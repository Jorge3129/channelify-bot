import { Api, TelegramClient } from "telegram";

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
}

export const telegramCoreApiService = new TelegramCoreApiService();