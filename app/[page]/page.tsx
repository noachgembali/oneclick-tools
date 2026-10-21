import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

const PAGES: Record<string, { title: string; body: string[] }> = {
  about: { title: "About", body: [
    `${siteConfig.name} is a free collection of calculators, converters and developer utilities. Every tool runs in your browser, so the numbers and text you enter are not uploaded or stored by us.`,
    "We build each tool around a standard formula or open specification, test it against known examples, and explain how it works so you can check the result yourself.",
    "The site is supported by advertising, which keeps every tool free without sign-up.",
  ] },
  contact: { title: "Contact", body: [
    "Found a mistake, want a tool added, or have a question? Email us and we will reply as soon as we can.",
    "Email: contact@your-domain.com (replace with your real address before launch).",
  ] },
  "privacy-policy": { title: "Privacy Policy", body: [
    "Tool inputs are processed locally in your browser and are not sent to our servers.",
    "We use Google AdSense to show ads. Google and its partners may use cookies to serve ads based on your visits to this and other sites. You can manage personalised advertising at adssettings.google.com or opt out at aboutads.info.",
    "We may use privacy-friendly analytics to count page views. Where required, we ask for your consent to cookies before ads or analytics load.",
    "If you contact us, we use your email only to reply to you. Questions about this policy can be sent through the Contact page.",
  ] },
  terms: { title: "Terms of Use", body: [
    "The tools are provided as is, for general information. Results are estimates and are not financial, tax, legal or medical advice.",
    "You are responsible for how you use the results. Please confirm important figures with an official source or a qualified professional.",
    "We may update the tools and these terms at any time. Continued use means you accept the current version.",
  ] },
};

export const generateStaticParams = () => Object.keys(PAGES).map((page) => ({ page }));
export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  const p = PAGES[params.page];
  return p ? { title: p.title, alternates: { canonical: `/${params.page}` } } : {};
}

export default function InfoPage({ params }: { params: { page: string } }) {
  const p = PAGES[params.page];
  if (!p) notFound();
  return (
    <article className="container max-w-2xl py-14">
      <h1 className="text-display-lg">{p.title}</h1>
      <div className="gold-rule my-6" />
      {p.body.map((t) => <p key={t} className="mb-4 leading-relaxed text-muted">{t}</p>)}
    </article>
  );
}
