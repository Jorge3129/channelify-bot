import { Repository } from "typeorm";
import {
  TelegramChat,
  TelegramCoreApiService,
  telegramCoreApiService,
} from "../core-api/telegram-core-api.service";
import { ChannelMapping } from "../channel-mapping/channel-mapping.entity";
import dataSource from "../data-source";
import bigInt, { BigInteger } from "big-integer";
import { ChannelPostService, channelPostService } from "./channel-post.service";
import { summarizerService } from "../summary/summarizer.service";

type DigestChannelCreated = {
  inviteLink: string;
  destinationChannelId: BigInteger;
};

export class CreateChannelService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private channelMappingRepo: Repository<ChannelMapping>,
    private channelPostService: ChannelPostService
  ) {}

  public async createDigestChannel(
    sourceChannelUrl: string
  ): Promise<DigestChannelCreated> {
    const sourceChannel = await this.telegramCoreApi
      .joinChannel(sourceChannelUrl)
      .catch((e) => {
        console.log(e);
        throw new Error("Could not join the channel");
      });

    const destinationChannelId = await this.createChannelOrGetExisting(
      sourceChannel
    );

    const inviteLink = await this.telegramCoreApi
      .getInviteLink(destinationChannelId)
      .catch((e) => {
        console.log(e);
        return "";
      });

    // await this.channelPostService
    //   .publishSummariesForAllChannels()
    //   .catch((e) => {
    //     console.log(e);
    //     return "";
    //   });

    return { inviteLink, destinationChannelId };
  }

  private async createChannelOrGetExisting(
    sourceChat: TelegramChat
  ): Promise<BigInteger> {
    const existingMapping = await this.channelMappingRepo.findOneBy({
      sourceChatId: sourceChat.id.toString(),
    });

    if (existingMapping) {
      return bigInt(existingMapping.destinationId);
    }

    const newChannelTitle = `${sourceChat.title} Digest`;

    const newChannel = await this.telegramCoreApi.createChannel(
      newChannelTitle
    );

    await this.channelMappingRepo.save({
      sourceChatId: sourceChat.id.toString(),
      destinationId: newChannel.id.toString(),
    });

    return newChannel.id;
  }
}

export const createChannelService = new CreateChannelService(
  telegramCoreApiService,
  dataSource.getRepository(ChannelMapping),
  channelPostService
);
