import { ChannelMapping } from "../channel-mapping/channel-mapping.entity";
import { channelPostService } from "../channels/channel-post.service";
import {
  CreateChannelService,
  createChannelService,
} from "../channels/create-channel.service";
import dataSource from "../data-source";
import { TelegrafCommandContext } from "./command.context";

export class BotController {
  constructor(private channelService: CreateChannelService) {}

  public async createChannel(ctx: TelegrafCommandContext): Promise<void> {
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

  public async publishSummaries(ctx: TelegrafCommandContext) {
    await channelPostService.publishSummariesForAllChannels();

    await ctx.reply(`Done publishing summaries`);
  }

  public async cleanup(ctx: TelegrafCommandContext) {
    await dataSource.getRepository(ChannelMapping).delete({});

    await ctx.reply(`Done cleaning up`);
  }
}

export const botController = new BotController(createChannelService);
