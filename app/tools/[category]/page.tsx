import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasDef } from "@/lib/tool-defs";
import { categories, getToolHref, tools } from "@/lib/tools";

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ category: c.id }));

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const c = categories.find((x) => x.id === params.category);
  return c ? { title: `${c.name}: Free Online Tools`, description: `${c.blurb}. Free, instant and private.` } : {};
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const c = categories.find((x) => x.id === params.category);
  if (!c) notFound();
  const list = tools.filter((t) => t.category === c.id && hasDef(t.slug));
  return (
    <div className="container py-12">
      <h1 className="text-display-lg">{c.name}</h1>
      <p className="mt-3 text-lg text-muted">{c.blurb}.</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <li key={t.slug}><Link href={getToolHref(t)} className="panel block h-full p-5 transition hover:border-brand"><h2 className="font-display text-lg font-semibold">{t.name}</h2><p className="mt-2 text-sm text-muted">{t.description}</p></Link></li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-8 text-muted">Tools for this category are on the way.</p>}
    </div>
  );
}
