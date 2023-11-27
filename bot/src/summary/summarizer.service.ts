import OpenAI from "openai";
import { getUserToken } from "../commands/getToken";

export class SummarizerService {
  // TODO
  public async getPostSummary(postText: string): Promise<string> {
    return postText.slice(0, 10);
  }

  public async getSummaryForPosts(
    posts: string[],
    userId: number
  ): Promise<string> {
    const userKey = await getUserToken(userId);

    const apiKey: string = userKey ?? process.env["OPENAI_API_KEY"] ?? "";

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const prompt = `Hi! Pls create a summary of these posts as a bullet list. 
    Please only summarize meaningful information. 
    The posts may be in different languages, so pls write each point in the corresponding language.
    If there is no meaningful info in ANY of the posts pls reply with a single '$$404$$' string.
    If there is some meaningful info in SOME posts, pls summarize only those posts.
    Here are the posts: ${posts.join("\n\n")}`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const response = chatCompletion.choices[0].message.content ?? "";

    console.log({ response });

    if (response.includes("$$404$$")) {
      return "";
    }

    return response;
  }
}

export const summarizerService = new SummarizerService();
