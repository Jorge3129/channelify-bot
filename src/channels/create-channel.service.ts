import { TelegramCoreApiService } from "../core-api/telegram-core-api.service";
import { NewMessageHandler } from "./new-message.handler";

export class CreateChannelService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private newMessageHandler: NewMessageHandler
  ) {}

  public async createDigestChannel(
    originalChannelUrl: string,
    newChannelTitle: string
  ): Promise<void> {
    const originalChannel = await this.telegramCoreApi.joinChannel(
      originalChannelUrl
    );

    const destinationChannel = await this.telegramCoreApi.createChannel(
      newChannelTitle
    );

    // TODO
    await this.telegramCoreApi.addUserToChannel(
      "userId",
      destinationChannel.id
    );

    this.telegramCoreApi
      .getChannelNewMessageUpdates(originalChannel.id)
      .subscribe((event) =>
        this.newMessageHandler.handle(event, destinationChannel)
      );
  }
}
