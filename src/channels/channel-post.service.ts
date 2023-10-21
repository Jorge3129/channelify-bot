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

export class ChannelPostService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private summarizer: SummarizerService
  ) {}

  public async sendPostSummary(
    event: NewMessageEvent,
    destinationChannel: TelegramChat
  ): Promise<void> {
    const postText = event.message.message;

    const postSummary = await this.summarizer.getPostSummary(postText);

    console.log({
      postSummary,
    });

    await this.telegramCoreApi.sendMessage(postSummary, destinationChannel.id);
  }
}

export const channelPostService = new ChannelPostService(
  telegramCoreApiService,
  summarizerService
);
