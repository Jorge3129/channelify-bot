import { Api, TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Observable } from "rxjs";
import bigInt from "big-integer";
// @ts-ignore
import randomBigint from "random-bigint";

export type TelegramChat = {
  id: string;
  title: string;
};

export class TelegramCoreApiService {
  constructor(private client: TelegramClient) {}

  public async createChannel(title: string, about = ""): Promise<TelegramChat> {
    const result: any = await this.client.invoke(
      new Api.channels.CreateChannel({
        title,
        about,
        broadcast: true,
      })
    );

    return result.chats[0];
  }

  public async joinChannel(inputChannel: string): Promise<TelegramChat> {
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

  public async sendMessage(
    message: string,
    destinationChatId: string
  ): Promise<Api.TypeUpdates> {
    const result = await this.client.invoke(
      new Api.messages.SendMessage({
        peer: destinationChatId,
        message: message,
        randomId: bigInt(randomBigint(128)),
        noWebpage: true,
        noforwards: true,
      })
    );

    return result;
  }

  // TODO
  public async addUserToChannel(
    user: string,
    channelId: string
  ): Promise<void> {}
}
