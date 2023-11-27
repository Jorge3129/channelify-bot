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
import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";

type DigestChannelCreated = {
  inviteLink: string;
  // destinationChannelId: BigInteger;
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

    const channelMapping = await this.createChannelOrGetExisting(
      sourceChannel,
      sourceChannelUrl
    );

    return {
      inviteLink: channelMapping.destinationChatUrl,
    };
  }

  private async createChannelOrGetExisting(
    sourceChat: TelegramChat,
    sourceChatUrl: string
  ): Promise<ChannelMapping> {
    const existingMapping = await this.channelMappingRepo.findOneBy({
      sourceChatUrl: sourceChatUrl,
    });

    if (existingMapping) {
      return existingMapping;
    }

    const newChannelTitle = `${sourceChat.title} Digest`;

    const newChannel = await this.telegramCoreApi.createChannel(
      newChannelTitle,
      (sourceChat.username + "_digest_" + uuid())
        .replace(/-/gi, "_")
        .slice(0, 32)
        .replace(/_$/, "")
    );

    // console.log({ newChannel });

    const inviteLink = await this.telegramCoreApi
      .getInviteLink(newChannel.id)
      .catch((e) => {
        console.log(e);
        return "";
      });

    const result = await this.channelMappingRepo.save({
      sourceChatId: sourceChat.id.toString(),
      sourceChatUrl: sourceChatUrl,
      sourceChat: sourceChat,
      destinationId: newChannel.id.toString(),
      destinationChat: newChannel,
      destinationChatUrl: `https://t.me/${newChannel.username}`,
      inviteLink: inviteLink,
    });

    return result;
  }
}

export const createChannelService = new CreateChannelService(
  telegramCoreApiService,
  dataSource.getRepository(ChannelMapping),
  channelPostService
);
