import { searchTools, tools, type Tool } from "@/lib/tools";

export interface Topic {
  title: string;
  region: string;
  source: "google-trends" | "hacker-news";
  tool?: Tool;
}

const GEOS = ["US", "IN", "GB", "AE"];
// Only write about topics our readers and tools can genuinely help with.
const NICHE = /\b(tax|loan|emi|sip|invest|mutual fund|salary|gst|vat|budget|mortgage|ai|chatgpt|claude|gemini|api|json|code|developer|software|app|excel|pdf|password|privacy)\b/i;

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

/**
 * Topic DISCOVERY only. We read headlines and trend names, never article text,
 * so nothing is copied from other publishers. The article itself is written fresh.
 */
export async function trendingTopics(): Promise<Topic[]> {
  const found: Topic[] = [];

  await Promise.all(
    GEOS.map(async (geo) => {
      try {
        const res = await fetch(`https://trends.google.com/trending/rss?geo=${geo}`, { next: { revalidate: 3600 } });
        const xml = await res.text();
        for (const m of xml.matchAll(/<item>[\s\S]*?<title>([^<]+)<\/title>/g)) {
          found.push({ title: decode(m[1]).trim(), region: geo, source: "google-trends" });
        }
      } catch {
        /* one region failing must not stop the run */
      }
    })
  );

  try {
    const ids: number[] = await (await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")).json();
    const items = await Promise.all(
      ids.slice(0, 20).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json()))
    );
    for (const it of items) if (it?.title) found.push({ title: it.title, region: "GLOBAL", source: "hacker-news" });
  } catch {
    /* ignore */
  }

  const seen = new Set<string>();
  return found
    .filter((t) => NICHE.test(t.title))
    .filter((t) => (seen.has(t.title.toLowerCase()) ? false : (seen.add(t.title.toLowerCase()), true)))
    .map((t) => ({ ...t, tool: searchTools(tools, t.title)[0] }));
}
