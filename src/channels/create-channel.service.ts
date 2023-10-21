import { SummarizerService } from "../summary/summarizer.service";
import { TelegramCoreApiService } from "../core-api/telegram-core-api.service";

export class CreateChannelService {
  constructor(
    private telegramCoreApi: TelegramCoreApiService,
    private summarizer: SummarizerService
  ) {}

  public async createDigestChannel(
    originalChannelUrl: string,
    newChannelTitle: string
  ): Promise<void> {
    const originalChannel = await this.telegramCoreApi.joinChannel(
      originalChannelUrl
    );

    const newChannel = await this.telegramCoreApi.createChannel(
      newChannelTitle
    );

    // TODO
    await this.telegramCoreApi.addUserToChannel("userId", newChannel.id);

    this.telegramCoreApi
      .getChannelNewMessageUpdates(originalChannel.id)
      .subscribe(async (event) => {
        const postText = event.message.message;

        const postSummary = await this.summarizer.getPostSummary(postText);

        console.log({ postSummary });

        await this.telegramCoreApi.sendMessage(newChannel.id, postSummary);
      });
  }
}
