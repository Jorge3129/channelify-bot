import { Telegraf } from "telegraf";
import { botController } from "./bot.controller";
import { createTokenCommand } from "../commands/createToken";

export const channelBot = new Telegraf(process.env.BOT_TOKEN as string);

channelBot.start(async (ctx) => {
  await ctx.reply("Hello " + ctx.from.first_name + "!");
});

channelBot.help(async (ctx) => {
  await ctx.reply("Send /start to receive a greeting");
  await ctx.reply(
    "Send /createChannel <channelUrl> <newChannelName> to create new channel"
  );
});

channelBot.command("quit", async (ctx) => {
  await ctx.telegram.leaveChat(ctx.message.chat.id);
});

channelBot.command("createToken", createTokenCommand);

channelBot.command("createChannel", (ctx) =>
  botController.handleCreateChannel(ctx).catch(async (e) => {
    await ctx.reply((e as Error).stack || (e as Error).message);
  })
);

channelBot.on("callback_query", async (ctx) => {
  const data = (<any>ctx.callbackQuery).data;

  if (data === "first") {
    await ctx.reply("You chose the First Option!");
  } else if (data === "second") {
    await ctx.reply("You chose the Second Option!");
  }

  ctx.setMyCommands;
  await ctx.answerCbQuery();
});
