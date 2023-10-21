import { createChannelService } from "./channels/create-channel.service";
import { telegramClientFactory } from "./core-api/telegram-client.factory";
import dataSource from "./data-source";

const main = async () => {
  await dataSource.initialize();
  console.log("Data Source initialized");

  await telegramClientFactory.initialize();
  console.log("TelegramClientFactory initialized");

  await createChannelService.createDigestChannel(
    "https://t.me/test_news_channel_1",
    "New DIgest Channel"
  );
};

main();
