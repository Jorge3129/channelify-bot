import { Api, TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Observable } from "rxjs";

type Chat = {
  id: string;
};

export class TelegramCoreApiService {
  constructor(private client: TelegramClient) {}

  public async createChannel(title: string, about = ""): Promise<Chat> {
    const result: any = await this.client.invoke(
      new Api.channels.CreateChannel({
        title,
        about,
        broadcast: true,
      })
    );

    return result.chats[0];
  }

  public async joinChannel(inputChannel: string): Promise<Chat> {
    const result: any = await this.client.invoke(
      new Api.channels.JoinChannel({
        channel: inputChannel,
      })
    );

    return result.chats[0];
  }

  public getChannelNewMessageUpdates(
    chatId: string
  ): Observable<NewMessageEvent> {
    return new Observable((observer) => {
      const handler = (event: NewMessageEvent) => {
        observer.next(event);
      };

      this.client.addEventHandler(
        handler,
        new NewMessage({
          incoming: true,
          chats: [chatId],
        })
      );
    });
  }

  // TODO
  public async sendMessage(chatId: string, message: string): Promise<void> {}

  // TODO
  public async addUserToChannel(
    user: string,
    channelId: string
  ): Promise<void> {}
}
