import { Repository } from "typeorm";
import {
  TelegramCoreApiService,
  telegramCoreApiService,
} from "../core-api/telegram-core-api.service";
import { ChannelPostService, channelPostService } from "./channel-post.service";
import { ChannelMapping } from "../channel-mapping/channel-mapping.entity";
import dataSource from "../data-source";

export class CreateChannelService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private channelPostService: ChannelPostService,
    private channelMappingRepo: Repository<ChannelMapping>
  ) {}

  public async createDigestChannel(
    sourceChannelUrl: string,
    newChannelTitle: string
  ): Promise<void> {
    const sourceChannel = await this.telegramCoreApi.joinChannel(
      sourceChannelUrl
    );

    const destinationChannelId = await this.createChannelOrGetExisting(
      sourceChannel.id,
      newChannelTitle
    );

    // TODO
    await this.telegramCoreApi.addUserToChannel("userId", destinationChannelId);

    this.telegramCoreApi
      .getChannelNewMessageUpdates(sourceChannel.id)
      .subscribe((event) =>
        this.channelPostService.sendPostSummary(event, destinationChannelId)
      );
  }

  private async createChannelOrGetExisting(
    sourceChatId: string,
    newChannelTitle: string
  ): Promise<string> {
    const existingMapping = await this.channelMappingRepo.findOneBy({
      sourceChatId,
    });

    if (existingMapping) {
      return existingMapping.destinationId;
    }

    const newChannel = await this.telegramCoreApi.createChannel(
      newChannelTitle
    );

    return newChannel.id;
  }
}

export const createChannelService = new CreateChannelService(
  telegramCoreApiService,
  channelPostService,
  dataSource.getRepository(ChannelMapping)
);
