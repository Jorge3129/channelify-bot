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
      await ctx.reply("Please provide sourceChannelUrl and newChannelName");
      return;
    }

    const [sourceChannelUrl, newChannelName] = input.split(",");

    if (!sourceChannelUrl || !newChannelName) {
      await ctx.reply(
        "Please provide both sourceChannelUrl and newChannelName"
      );
      return;
    }

    const { inviteLink } = await this.channelService.createDigestChannel(
      sourceChannelUrl,
      newChannelName
    );

    await ctx.reply(
      `Created digest channel ${inviteLink} to summarize posts from  ${sourceChannelUrl}`
    );
  }
}

export const botController = new BotController(createChannelService);
