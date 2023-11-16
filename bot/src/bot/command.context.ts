import { Telegraf } from "telegraf";

type TelegrafCommandFn = (typeof Telegraf)["command"];
type TelegrafCommandMiddleware = Parameters<TelegrafCommandFn>[1];

type IsFunction<T> = T extends (...args: any[]) => any ? T : never;

type TelegrafCommandMiddlewareFn = IsFunction<TelegrafCommandMiddleware>;

export type TelegrafCommandContext = Parameters<TelegrafCommandMiddlewareFn>[0];
