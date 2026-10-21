import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { ToolRunner } from "@/components/tool/ToolRunner";
import { buildFaqJsonLd, buildToolJsonLd, buildToolMetadata } from "@/lib/seo";
import { defs, hasDef } from "@/lib/tool-defs";
import { getCategory, getToolHref, tools } from "@/lib/tools";

export const dynamicParams = false;
type P = { params: { category: string; slug: string } };

export const generateStaticParams = () => tools.filter((t) => hasDef(t.slug)).map((t) => ({ category: t.category, slug: t.slug }));
const find = ({ params }: P) => tools.find((t) => t.slug === params.slug && t.category === params.category && hasDef(t.slug));

export function generateMetadata(p: P): Metadata {
  const tool = find(p);
  return tool ? buildToolMetadata(tool) : {};
}

export default function ToolPage(p: P) {
  const tool = find(p);
  if (!tool) notFound();
  const cat = getCategory(tool.category);
  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug && hasDef(t.slug)).slice(0, 4);
  const faqs = [
    { q: `What is the ${tool.name}?`, a: tool.description },
    { q: "Is this tool free and private?", a: "Yes. It is free with no sign-up, and everything is calculated in your browser, so what you enter is never uploaded." },
    { q: "How accurate are the results?", a: "Results follow standard formulas. For legal, tax or financial decisions, confirm the numbers with an official source or a qualified professional." },
  ];
  const ld = [...buildToolJsonLd(tool), buildFaqJsonLd(faqs)];

  return (
    <div className="container py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
            <Link href="/" className="hover:text-fg">Home</Link> / <Link href={`/tools/${cat.id}`} className="hover:text-fg">{cat.name}</Link>
          </nav>
          <h1 className="text-display-lg">{tool.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{tool.description}</p>
          <div className="my-6"><AdSlot variant="header" /></div>
          <ToolRunner slug={tool.slug} />
          <div className="my-10"><AdSlot variant="in-content" /></div>
          {defs[tool.slug].about && (
            <section className="max-w-prose">
              <h2 className="text-2xl">About this tool</h2>
              <p className="mt-3 leading-relaxed text-muted">{defs[tool.slug].about}</p>
            </section>
          )}
          <section className="mt-10">
            <h2 className="text-2xl">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-line rounded-tile border border-line bg-surface">
              {faqs.map((f) => (
                <details key={f.q} className="p-5"><summary className="cursor-pointer font-display text-lg font-semibold">{f.q}</summary><p className="mt-2 text-muted">{f.a}</p></details>
              ))}
            </div>
          </section>
          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl">More in {cat.name}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((t) => (
                  <li key={t.slug}><Link href={getToolHref(t)} className="panel block p-4 transition hover:border-brand"><b className="font-display">{t.name}</b><p className="mt-1 text-sm text-muted">{t.description}</p></Link></li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="hidden xl:block"><div className="sticky top-24"><AdSlot variant="sidebar" /></div></aside>
      </div>
    </div>
  );
}
