export const siteConfig = {
  name: "OneClick Tools",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oneclick.tools",
  description:
    "Free online calculators, converters and developer utilities that run instantly in your browser. No sign-up, no uploads, no waiting.",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  showAdPlaceholders: process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true",
  locales: [
    { code: "en-US", region: "United States", currency: "USD" },
    { code: "en-IN", region: "India", currency: "INR" },
    { code: "en-GB", region: "United Kingdom", currency: "GBP" },
    { code: "en-AE", region: "United Arab Emirates", currency: "AED" },
  ],
} as const;

export const adSlots = {
  header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER ?? "",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
  inContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT ?? "",
  sticky: process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY ?? "",
} as const;
