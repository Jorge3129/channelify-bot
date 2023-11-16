import dataSource from "./data-source";
import { channelBot } from "./bot/bot";
import { telegramClientFactory } from "./core-api/telegram-client.factory";

const main = async () => {
  await dataSource.initialize();
  console.log("Data Source initialized");

  await telegramClientFactory.initialize();
  console.log("TelegramClientFactory initialized");

  channelBot.launch();
  console.log("Bot launched");
};

main();
