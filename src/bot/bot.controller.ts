import {
  CreateChannelService,
  createChannelService,
} from "../channels/create-channel.service";
import { TelegrafCommandContext } from "./command.context";

export class BotController {
  constructor(private channelService: CreateChannelService) {}

  public async handleCreateChannel(ctx: TelegrafCommandContext): Promise<void> {
    const [_command, ...rest] = ctx.message.text.split(" ");
    const input = rest.join(" ");

    if (!input) {
      ctx.reply("Please provide sourceChannelUrl and newChannelName");
      return;
    }

    const [sourceChannelUrl, newChannelName] = input.split(",");

    if (!sourceChannelUrl || !newChannelName) {
      ctx.reply("Please provide both sourceChannelUrl and newChannelName");
      return;
    }

    await this.channelService.createDigestChannel(
      sourceChannelUrl,
      newChannelName
    );

    ctx.reply(
      `Created digest channel ${newChannelName} to summarize posts from  ${sourceChannelUrl}`
    );
  }
}

export const botController = new BotController(createChannelService);
