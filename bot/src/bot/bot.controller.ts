import {
  CreateChannelService,
  createChannelService,
} from "../channels/create-channel.service";
import { TelegrafCommandContext } from "./command.context";

export class BotController {
  constructor(private channelService: CreateChannelService) {}

  public async handleCreateChannel(ctx: TelegrafCommandContext): Promise<void> {
    const [_command, sourceChannelUrl] = ctx.message.text.split(" ");

    if (!sourceChannelUrl) {
      await ctx.reply("Please provide sourceChannelUrl");
      return;
    }

    const { inviteLink } = await this.channelService.createDigestChannel(
      sourceChannelUrl
    );

    await ctx.reply(
      `Created digest channel ${inviteLink} to summarize posts from  ${sourceChannelUrl}`
    );
  }
}

export const botController = new BotController(createChannelService);
