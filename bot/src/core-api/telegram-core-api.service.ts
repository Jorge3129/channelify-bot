import { Api, TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from "telegram/events";
import { Observable } from "rxjs";
import bigInt, { BigInteger } from "big-integer";
// @ts-ignore
import randomBigint from "random-bigint";
import {
  TelegramClientFactory,
  telegramClientFactory,
} from "./telegram-client.factory";

export type TelegramChat = {
  id: BigInteger;
  title: string;
};

export class TelegramCoreApiService {
  constructor(private factory: TelegramClientFactory) {}

  private get client(): TelegramClient {
    return this.factory.getClient();
  }

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
    chatId: BigInteger
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
    destinationChatId: BigInteger
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

  public async getInviteLink(
    destinationChannelId: BigInteger
  ): Promise<string> {
    const result: any = await this.client.invoke(
      new Api.messages.ExportChatInvite({
        peer: destinationChannelId,
        requestNeeded: false,
      })
    );

    return result.link;
  }
}

export const telegramCoreApiService = new TelegramCoreApiService(
  telegramClientFactory
);
