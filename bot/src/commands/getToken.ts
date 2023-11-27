import { GPTToken } from "../entities/gpt-token.entity";

export async function getUserToken(
  userId: number
): Promise<string | undefined> {
  const token = await GPTToken.findOne({
    where: {
      userId,
    },
  });

  return token?.token;
}
