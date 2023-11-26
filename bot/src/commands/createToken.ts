import { Markup } from "telegraf";
import { TelegrafCommandContext } from "../bot/command.context";
import { GPTToken } from "../entities/gpt-token.entity";
import { validateGptToken } from "../gpt/gpt";

async function upsert(userId: number, tokenstr: string) {
  const token = await GPTToken.findOne({
    where: {
      userId,
    },
  });

  if (token) {
    token.token = tokenstr;
    return token.save();
  } else {
    const newToken = new GPTToken();
    newToken.userId = userId;
    newToken.token = tokenstr;
    return newToken.save();
  }
}

export async function createTokenCommand(ctx: TelegrafCommandContext) {
  if (!ctx.args.length || !ctx.args[0]) {
    await ctx.reply("Please provide token");
    return;
  }

  const tokenStr = ctx.args[0];

  if (await validateGptToken(tokenStr)) {
    await upsert(ctx.from.id, tokenStr);
    await ctx.reply(
      "Token saved",
      Markup.keyboard([
        ["button 1", "button 2"], // Row1 with 2 buttons
        ["button 3", "button 4"], // Row2 with 2 buttons
        ["button 5", "button 6", "button 7"], // Row3 with 3 buttons
      ])
        .oneTime()
        .resize()
    );
  } else {
    await ctx.reply("Invalid token");
  }
}
