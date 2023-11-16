import asyncio
import os
from telethon import TelegramClient
from telethon.sessions import StringSession
from datetime import datetime, timedelta
import pytz
import logging

api_id = os.environ.get('TELEGRAM_API_ID')
api_hash = os.environ.get('TELEGRAM_API_HASH')
session_str = os.environ.get('TELEGRAM_SESSION')

client = TelegramClient(StringSession(session_str), api_id, api_hash)

def get_past_day():
    current_date = datetime.now().date()
    when_process = datetime.strptime(os.environ.get("WHEN_PROCESS_CHANNELS"), "%H:%M:%S").time()
    day = datetime.combine(current_date, when_process)
    day = day - timedelta(days=1)
    day = day.astimezone(pytz.utc)
    return day


def seconds_until_when_process():
    now = datetime.now()

    current_date = datetime.now().date()
    when_process = datetime.strptime(os.environ.get("WHEN_PROCESS_CHANNELS"), "%H:%M:%S").time()
    next_run = datetime.combine(current_date, when_process)

    if now > next_run:
        next_run = next_run + timedelta(days=1)

    return (next_run - now).total_seconds()


def chunkify(texts, chunk_size = 1200):
    texts = [text.split() for text in texts if text]

    res = []
    while len(texts) >= 2:
        if len(texts[0]) + len(texts[1]) <= chunk_size:
            texts[0].extend(texts[1])
            texts.pop(1)
        else:
            res.append(texts.pop(0))

    if texts:
        res.append(texts.pop(0))

    return [" ".join(text) for text in res]


class TgWrapper:
    def __init__(self, client, conn):
        self.client = client
        self.conn = conn

        # This code is for v1 of the openai package: pypi.org/project/openai
        from openai import OpenAI
        self.aiclient = OpenAI()


    async def get_channel_messages(self, channel_username):
        await self.client.start()
        channel = await self.client.get_entity(channel_username)
        yesterday = get_past_day()

        texts = []
        async for message in self.client.iter_messages(channel, offset_date=yesterday, reverse=True):
            # print(message.id, message.text[:50])
            texts.append(message.text)

        return chunkify(texts)


    async def shorten(self, chunk):
        response = self.aiclient.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            messages=[
                {
                    "role": "user",
                    "content": f"Опиши головні тези тексту у форматі bullet list: {chunk}"
                }
            ],
            temperature=0,
            max_tokens=chunk.count(" ") + 1,
            top_p=0,
            frequency_penalty=0,
            presence_penalty=0
        )

        return response.choices[0].message.content


    async def get_non_shortened_channels(self):
        with self.conn.cursor() as cur:
            cur.execute(
                '''
                    with shortened as (
                        select handle, max(created_at) as created_at 
                        from shortened 
                        group by handle
                    )
                    select channel.handle from channel
                    left join shortened on channel.handle = shortened.handle
                    where created_at < %s or created_at is null
                ''', 
                (get_past_day(),)
            )

            channels = cur.fetchall()

            return [channel[0] for channel in channels]


    async def process_not_shortened_channels(self):
        channels = await self.get_non_shortened_channels()
        logging.info(f"Polling channels: %s", channels)

        for channel in channels:
            chunks = await self.get_channel_messages(channel)

            logging.info(f"Got {len(chunks)} chunks for {channel}")

            if not chunks:
                continue

            shortened = []
            for chunk in chunks:
                shortened.append(await self.shorten(chunk))

            with self.conn.cursor() as cur:
                cur.execute(
                    '''
                        INSERT INTO shortened (handle, created_at, shortened) 
                        VALUES (%s, %s, %s)
                        ON CONFLICT DO NOTHING 
                        RETURNING handle
                    ''', 
                    (channel, get_past_day(), "\n".join(shortened))
                )

                result = cur.fetchall()
                self.conn.commit()


    async def start_polling_channels(self):
        seconds_until = seconds_until_when_process()

        while True:
            logging.info(f"Polling channels in {seconds_until} seconds")
            await asyncio.sleep(seconds_until)
            for i in range(5):
                try:
                    await self.process_not_shortened_channels()
                    break
                except Exception as e:
                    logging.error(e)
                    await asyncio.sleep(2 ** i)

            seconds_until = seconds_until_when_process()
