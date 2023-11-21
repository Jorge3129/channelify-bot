import { NewMessageEvent } from "telegram/events";
import {
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
