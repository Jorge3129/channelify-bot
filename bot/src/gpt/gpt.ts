export async function validateGptToken(token: string): Promise<boolean> {
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const requestBody = {
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: "Who won the world series in 2020?" },
    ],
    max_tokens: 20,
    temperature: 0.7,
    frequency_penalty: 0.5,
  };

  const requestOptions = {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(requestBody),
  };

  const res = await fetch(apiUrl, requestOptions);

  return res.status === 200;
}
