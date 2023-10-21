import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
// @ts-ignore
import input from "input";
import fs from "fs";
import path from "path";

const SESSION_PATH = path.join(__dirname, "../../session.txt");

class TelegramClientFactory {
  public async getClient(): Promise<TelegramClient> {
    const apiId = parseInt(process.env.TELEGRAM_API_ID ?? "");
    const apiHash = process.env.TELEGRAM_API_HASH ?? "";
    const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER ?? "";

    const stringSession = this.getStringSession();

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: phoneNumber,
      phoneCode: async () => await input.text("Code ?"),
      onError: (err) => console.log(err),
    });

    this.persistStringSession(stringSession);

    return client;
  }

  private getStringSession() {
    let savedSession = "";
    if (fs.existsSync(SESSION_PATH)) {
      savedSession = fs.readFileSync(SESSION_PATH, "utf-8");
    }
    return new StringSession(savedSession);
  }

  private persistStringSession(session: StringSession) {
    fs.writeFileSync(SESSION_PATH, session.save());
  }
}

export const telegramClientFactory = new TelegramClientFactory();
