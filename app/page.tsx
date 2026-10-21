import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { buildFaqJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { categories, tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name}: Free Online Calculators, Converters & Developer Tools` },
  description:
    "EMI, SIP and GST calculators, unit and image converters, JSON formatter, QR codes and more. Free, instant, private tools that run in your browser.",
};

const faqs = [
  {
    q: "Are OneClick tools really free?",
    a: "Yes. Every tool is free to use with no account, no trial and no usage limits. The site is supported by ads.",
  },
  {
    q: "Is my data uploaded anywhere?",
    a: "No. Calculations, formatting and file processing happen inside your browser, so what you type or drop in never leaves your device.",
  },
  {
    q: "Which regions do the finance tools support?",
    a: "Finance and tax tools cover India (INR, GST, income tax regimes), the United States, the United Kingdom and the UAE (VAT), with local currency formats.",
  },
  {
    q: "Do the tools work offline?",
    a: "Once a tool page has loaded, it keeps working without a connection because the logic runs locally.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["en-US", "en-IN", "en-GB", "en-AE"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  buildFaqJsonLd(faqs),
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <HomeClient tools={tools} />

      {/* Crawlable, human-written copy: gives search engines and AdSense reviewers real page content */}
      <section className="container mt-24 grid gap-12 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="about-heading">
        <div>
          <h2 id="about-heading" className="text-display-lg">Built for quick answers</h2>
          <p className="mt-5 max-w-prose leading-relaxed text-muted">
            Most online tools make you wait, sign up or upload private files. OneClick runs every calculation
            in your browser, so results appear as you type and your data stays with you.
          </p>
          <ul className="mt-6 space-y-3 text-muted">
            {categories.map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-fg">{c.name}:</span> {c.blurb}.
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-display-lg">Questions people ask</h2>
          <div className="mt-6 divide-y divide-line rounded-tile border border-line bg-surface">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 open:bg-raised/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                  {f.q}
                  <span aria-hidden className="text-brand transition duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
