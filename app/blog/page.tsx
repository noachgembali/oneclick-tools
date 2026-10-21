import type { Metadata } from "next";
import Link from "next/link";
import { listPosts } from "@/lib/blog/store";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides and worked examples for the money, tax and everyday questions our tools answer.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await listPosts();
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-display-lg">Blog</h1>
      <div className="gold-rule my-6" />
      {posts.length === 0 ? (
        <p className="text-muted">
          New guides are on the way. In the meantime, <Link href="/#tools" className="text-brand hover:underline">explore the tools</Link>.
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="panel block p-5 transition hover:border-brand">
                <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                <p className="mt-1 text-sm text-muted">{p.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
