import OpenAI from "openai";

export class SummarizerService {
  // TODO
  public async getPostSummary(postText: string): Promise<string> {
    return postText.slice(0, 10);
  }

  public async foo() {
    const apiKey = process.env["OPENAI_API_KEY"];
    console.log({ apiKey });
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
    });

    console.log(chatCompletion.choices[0].message);
  }
}

export const summarizerService = new SummarizerService();
