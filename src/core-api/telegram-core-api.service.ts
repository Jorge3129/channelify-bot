import { Api, TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Observable } from "rxjs";

class TelegramCoreApiService {
  public async createChannel(
    client: TelegramClient,
    title: string,
    about = ""
  ): Promise<any> {
    const result: any = await client.invoke(
      new Api.channels.CreateChannel({
        title,
        about,
        broadcast: true,
      })
    );

    return result.chats[0];
  }

  public async joinChannel(
    client: TelegramClient,
    inputChannel: string
  ): Promise<any> {
    const result: any = await client.invoke(
      new Api.channels.JoinChannel({
        channel: inputChannel,
      })
    );

    return result.chats[0];
  }

  public getChannelNewMessageUpdates(
    client: TelegramClient,
    chatId: string
  ): Observable<NewMessageEvent> {
    return new Observable((observer) => {
      const handler = (event: NewMessageEvent) => {
        observer.next(event);
      };

      client.addEventHandler(
        handler,
        new NewMessage({
          incoming: true,
          chats: [chatId],
        })
      );
    });
  }
}

export const telegramCoreApiService = new TelegramCoreApiService();
