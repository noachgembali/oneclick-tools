import { NextResponse } from "next/server";
import { trendingTopics } from "@/lib/blog/sources";
import { findCover } from "@/lib/blog/cover";
import { draftPost } from "@/lib/blog/generate";
import { savePost, slugify } from "@/lib/blog/store";

export const maxDuration = 60;
const PER_RUN = 3; // a few strong posts beat dozens of thin ones

export async function GET(req: Request) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const topics = (await trendingTopics()).filter((t) => t.tool).slice(0, PER_RUN);
  const created: string[] = [];

  for (const topic of topics) {
    try {
      const { title, body } = await draftPost(topic);
      await savePost({
        slug: slugify(title),
        title,
        topic: topic.title,
        region: topic.region,
        date: new Date().toISOString().slice(0, 10),
        // Stay "draft" until a person has edited and approved it.
        status: process.env.AUTO_PUBLISH === "true" ? "published" : "draft",
        cover: await findCover(topic.title),
        toolSlug: topic.tool?.slug,
        body,
      });
      created.push(title);
    } catch (e) {
      console.error("post failed", topic.title, e);
    }
  }
  return NextResponse.json({ created });
}
