import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { categories, getToolHref, tools } from "@/lib/tools";
import { listPosts } from "@/lib/blog/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await listPosts();
  return [
    { url: siteConfig.url, lastModified: now, priority: 1 },
    { url: `${siteConfig.url}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    ...categories.map((c) => ({ url: `${siteConfig.url}/tools/${c.id}`, lastModified: now, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${siteConfig.url}${getToolHref(t)}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...posts.map((p) => ({ url: `${siteConfig.url}/blog/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
  ];
}
