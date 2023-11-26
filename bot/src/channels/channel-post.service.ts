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
import { BigInteger } from "big-integer";

export class ChannelPostService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private summarizer: SummarizerService
  ) {}

  public async publishSummariesForAllChannels() {
    // const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() - 1);
    // const msgs = await this.telegramCoreApi.getChannelMessages(
    //   sourceChannel,
    //   new Date()
    // );
    // console.log({ msgs });
  }

  public async publishSummaryForChannel(sourceChannelId: BigInteger) {
    // const currentDate = new Date();
    // currentDate.setHours(currentDate.getHours() - 1);

    const msgs = await this.telegramCoreApi.getChannelMessages(
      sourceChannelId,
      new Date()
    );

    console.log({ msgs });
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
  summarizerService
);
