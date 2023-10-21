import dotenv from "dotenv";
dotenv.config();

import { Markup, Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => {
  ctx.reply("Hello " + ctx.from.first_name + "!");
});
bot.help((ctx) => {
  ctx.reply("Send /start to receive a greeting");
  ctx.reply("Send /keyboard to receive a message with a keyboard");
  ctx.reply("Send /quit to stop the bot");
});
bot.command("quit", (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id);
});
bot.command("keyboard", (ctx) => {
  ctx.reply(
    "Keyboard",
    Markup.inlineKeyboard([
      Markup.button.callback("First option", "first"),
      Markup.button.callback("Second option", "second"),
    ])
  );
});
bot.on("callback_query", (ctx) => {
  const data = (<any>ctx.callbackQuery).data;

  if (data === "first") {
    ctx.reply("You chose the First Option!");
  } else if (data === "second") {
    ctx.reply("You chose the Second Option!");
  }

  ctx.answerCbQuery();
});
bot.on("text", (ctx) => {
  ctx.reply(
    "You choose the " +
      (ctx.message.text === "first" ? "First" : "Second") +
      " Option!"
  );
});

bot.launch();
