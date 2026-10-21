import type { Topic } from "./sources";

const SYSTEM = `You write helpful, original explainers for a free online tools website.
Rules:
- Use the topic only as a subject. Never copy or closely paraphrase any publisher's article.
- Do not invent statistics, quotes, laws, rates or dates. If a fact could be out of date, say to check the official source.
- Structure: a plain answer in the first two sentences, then 3 to 5 sections with ## headings, a worked example with real numbers, and a short FAQ.
- 600 to 900 words. No hype. First line is the title as "# Title".`;

export async function draftPost(topic: Topic): Promise<{ title: string; body: string }> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 2500,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Topic: "${topic.title}" (trending in ${topic.region}).${
            topic.tool ? ` Mention the reader can try our "${topic.tool.name}" tool.` : ""
          }`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Draft failed: ${res.status}`);
  const text: string = (await res.json()).content?.[0]?.text ?? "";
  const title = text.match(/^#\s+(.+)$/m)?.[1] ?? topic.title;
  return { title, body: text.replace(/^#\s+.+\n+/, "") };
}
