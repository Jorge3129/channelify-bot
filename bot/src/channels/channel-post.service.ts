import { NewMessageEvent } from "telegram/events";
import {
  TelegramChat,
  TelegramCoreApiService,
  telegramCoreApiService,
} from "../core-api/telegram-core-api.service";
import {
  SummarizerService,
  summarizerService,
} from "../summary/summarizer.service";
import bigInt, { BigInteger } from "big-integer";
import { Repository } from "typeorm";
import { ChannelMapping } from "../channel-mapping/channel-mapping.entity";
import dataSource from "../data-source";

export class ChannelPostService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private summarizer: SummarizerService,
    private channelMappingRepo: Repository<ChannelMapping>
  ) {}

  public async publishSummariesForAllChannels(userId: number) {
    const channelMappings = await this.channelMappingRepo.find();

    for (const channelMapping of channelMappings) {
      await this.publishSummaryForChannel(channelMapping, userId);
    }
  }

  public async publishSummaryForChannel(
    channelMapping: ChannelMapping,
    userId: number
  ) {
    const messages = await this.telegramCoreApi.getChannelMessages(
      channelMapping.sourceChatUrl,
      new Date()
    );

    const postContents = [...messages]
      .filter((message) => !!message.message)
      .map((message) => message.message);

    const summary = await summarizerService.getSummaryForPosts(
      postContents,
      userId
    );

    if (!summary) {
      return;
    }

    // console.log({ sourceChannelId, destinationChannelId });

    await this.telegramCoreApi.sendMessage(
      summary,
      channelMapping.destinationChatUrl
    );
  }

  public async sendPostSummary(
    event: NewMessageEvent,
    destinationChannelId: BigInteger
  ): Promise<void> {
    const postText = event.message.message;

    const postSummary = await this.summarizer.getPostSummary(postText);

    console.log({
      postSummary,
    });

    await this.telegramCoreApi.sendMessage(postSummary, destinationChannelId);
  }
}

export const channelPostService = new ChannelPostService(
  telegramCoreApiService,
  summarizerService,
  dataSource.getRepository(ChannelMapping)
);
