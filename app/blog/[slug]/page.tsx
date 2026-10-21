import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/blog/store";

type P = { params: { slug: string } };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const post = await getPost(params.slug);
  return post ? { title: post.title, alternates: { canonical: `/blog/${post.slug}` } } : {};
}

export default async function BlogPostPage({ params }: P) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="container max-w-2xl py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/blog" className="hover:text-fg">Blog</Link>
      </nav>
      <h1 className="text-display-lg">{post.title}</h1>
      <p className="mt-2 text-sm text-muted">{post.date}</p>
      <div className="gold-rule my-6" />
      {post.body.split(/\n{2,}/).map((block, i) =>
        block.startsWith("## ") ? (
          <h2 key={i} className="mb-3 mt-8 text-2xl">{block.slice(3)}</h2>
        ) : (
          <p key={i} className="mb-4 leading-relaxed text-muted">{block}</p>
        )
      )}
    </article>
  );
}
