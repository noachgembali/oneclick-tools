import { promises as fs } from "node:fs";
import path from "node:path";
import type { Cover } from "./cover";

export interface Post {
  slug: string;
  title: string;
  topic: string;
  region: string;
  date: string;
  status: "draft" | "published";
  cover: Cover | null;
  toolSlug?: string;
  body: string;
}

const DIR = path.join(process.cwd(), "content", "blog");

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

/**
 * Writes JSON to content/blog (works locally and in a git-based workflow).
 * Vercel's filesystem is read-only at runtime: before deploying, swap this
 * for Vercel Blob, Postgres or a GitHub-commit call. The interface stays the same.
 */
export async function savePost(p: Post) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.writeFile(path.join(DIR, `${p.slug}.json`), JSON.stringify(p, null, 2));
}

export async function listPosts(): Promise<Post[]> {
  try {
    const files = await fs.readdir(DIR);
    const posts = await Promise.all(files.filter((f) => f.endsWith(".json")).map(async (f) => JSON.parse(await fs.readFile(path.join(DIR, f), "utf8")) as Post));
    return posts.filter((p) => p.status === "published").sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}
