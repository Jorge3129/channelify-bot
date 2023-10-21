import { NewMessageEvent } from "telegram/events";
import {
  TelegramChat,
  TelegramCoreApiService,
} from "../core-api/telegram-core-api.service";
import { SummarizerService } from "../summary/summarizer.service";

export class NewMessageHandler {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private summarizer: SummarizerService
  ) {}

  public async handle(
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
