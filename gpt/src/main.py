import asyncio
import os
import uvicorn

# These are objects, like singletons:
from db import conn
from get_channel_messages import client, TgWrapper
from api import app

import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

tg_wrapper = TgWrapper(client, conn)


async def log_exception(coro):
    try:
        await coro
    except Exception as e:
        logging.error(e)


async def main():
    # TODO: this line for development only, to have some rows in the table
    await tg_wrapper.process_not_shortened_channels()

    # Schedule the Telethon task
    telethon_task = asyncio.create_task(log_exception(tg_wrapper.start_polling_channels()))

    # Start the FastAPI app
    port = int(os.environ.get('PORT', 5000))
    config = uvicorn.Config(app=app, host='0.0.0.0', port=port)
    server = uvicorn.Server(config)
    await server.serve()

    # Wait for the Telethon task to complete (if ever)
    await telethon_task


if __name__ == '__main__':
    # TODO: why I have to use the loop from the client?
    client.loop.run_until_complete(main())
