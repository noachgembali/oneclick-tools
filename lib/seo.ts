import type { Metadata } from "next";
import { siteConfig } from "./site";
import { type Tool, getCategory, getToolHref } from "./tools";

/** Per-tool metadata: used by app/tools/[category]/[slug]/page.tsx in the next batches. */
export function buildToolMetadata(tool: Tool): Metadata {
  const url = `${siteConfig.url}${getToolHref(tool)}`;
  const title = `${tool.name}: Free Online Calculator & Tool`;
  const description = `${tool.description} Free, instant and private. Works in your browser with no sign-up.`;
  return {
    title,
    description,
    keywords: [tool.name, ...tool.keywords, "free online tool"],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(siteConfig.locales.map((l) => [l.code, url])),
    },
    openGraph: { title, description, url, type: "website", siteName: siteConfig.name, locale: "en_US", alternateLocale: ["en_IN", "en_GB", "en_AE"] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function buildToolJsonLd(tool: Tool) {
  const url = `${siteConfig.url}${getToolHref(tool)}`;
  const category = getCategory(tool.category);
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.name,
      description: tool.description,
      url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: category.name, item: `${siteConfig.url}/tools/${category.id}` },
        { "@type": "ListItem", position: 3, name: tool.name, item: url },
      ],
    },
  ];
}

export function buildFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
