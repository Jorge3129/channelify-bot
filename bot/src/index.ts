import dataSource from "./data-source";
import { channelBot } from "./bot/bot";
import { telegramClientFactory } from "./core-api/telegram-client.factory";
import Fastify from "fastify";

const main = async () => {
  await dataSource.initialize();
  console.log("Data Source initialized");

  await telegramClientFactory.initialize();
  console.log("TelegramClientFactory initialized");

  channelBot.launch();

  console.log("Bot launched");
  const fastify = Fastify({
    logger: true,
  });

  // Declare a route
  fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
  });

  // Run the server!
  try {
    await fastify.listen({ host: "0.0.0.0", port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

main();
