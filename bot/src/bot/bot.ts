import { Telegraf } from "telegraf";
import { botController } from "./bot.controller";

export const channelBot = new Telegraf(process.env.BOT_TOKEN as string);

channelBot.start((ctx) => {
  ctx.reply("Hello " + ctx.from.first_name + "!");
});

channelBot.help((ctx) => {
  ctx.reply("Send /start to receive a greeting");
  ctx.reply(
    "Send /createChannel <channelUrl> <newChannelName> to create new channel"
  );
});

channelBot.command("quit", (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id);
});

channelBot.command("createChannel", (ctx) =>
  botController.handleCreateChannel(ctx).catch((e) => {
    ctx.reply((e as Error).stack || (e as Error).message);
  })
);

channelBot.on("callback_query", (ctx) => {
  const data = (<any>ctx.callbackQuery).data;

  if (data === "first") {
    ctx.reply("You chose the First Option!");
  } else if (data === "second") {
    ctx.reply("You chose the Second Option!");
  }

  ctx.answerCbQuery();
});
