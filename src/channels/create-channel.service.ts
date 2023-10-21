import {
  TelegramCoreApiService,
  telegramCoreApiService,
} from "../core-api/telegram-core-api.service";
import { ChannelPostService, channelPostService } from "./channel-post.service";

export class CreateChannelService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private channelPostService: ChannelPostService
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
        this.channelPostService.sendPostSummary(event, destinationChannel)
      );
  }
}

export const createChannelService = new CreateChannelService(
  telegramCoreApiService,
  channelPostService
);
