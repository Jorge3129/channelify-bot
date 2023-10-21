export class SummarizerService {
  // TODO
  public async getPostSummary(postText: string): Promise<string> {
    return postText.slice(0, 10);
  }
}

export const summarizerService = new SummarizerService();
