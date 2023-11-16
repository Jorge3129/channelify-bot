import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
// @ts-ignore
import input from "input";
import fs from "fs";
import path from "path";

const SESSION_PATH = path.join(__dirname, "../../session.txt");

export class TelegramClientFactory {
  private client: TelegramClient | null = null;

  public async initialize(): Promise<TelegramClient> {
    this.client = await this.createClient();

    return this.client;
  }

  public getClient(): TelegramClient {
    if (!this.client) {
      throw new Error("TelegramClientFactory is unitialized");
    }

    return this.client;
  }

  private async createClient(): Promise<TelegramClient> {
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
