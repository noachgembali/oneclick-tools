export type CategoryId = "finance" | "converters" | "developer" | "math" | "everyday";

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
}

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string; // key in components/icons.ts
  keywords: string[];
  popular?: boolean;
}

export const categories: Category[] = [
  { id: "finance", name: "Finance & Tax", blurb: "Loans, investments, income tax and GST" },
  { id: "converters", name: "Converters & Formatters", blurb: "Units, files, images and data formats" },
  { id: "developer", name: "Developer Utilities", blurb: "Format, encode, decode and test" },
  { id: "math", name: "Math & Calculators", blurb: "Percentages, health, dates and numbers" },
  { id: "everyday", name: "Everyday & Social", blurb: "Text, captions, QR codes and timers" },
];

export const tools: Tool[] = [
  // Finance & Tax
  { slug: "emi-calculator", name: "EMI Calculator", description: "Monthly loan payment, total interest and a full amortization table.", category: "finance", icon: "landmark", keywords: ["loan", "home loan", "car loan", "mortgage", "installment"], popular: true },
  { slug: "sip-calculator", name: "SIP Calculator", description: "See what a monthly mutual fund investment grows into.", category: "finance", icon: "trending", keywords: ["mutual fund", "invest", "returns", "wealth"], popular: true },
  { slug: "gst-calculator", name: "GST Calculator", description: "Add or remove GST from any amount at any slab.", category: "finance", icon: "receipt", keywords: ["tax", "vat", "invoice", "india"], popular: true },
  { slug: "income-tax-calculator", name: "Income Tax Calculator", description: "Compare old and new tax regimes side by side.", category: "finance", icon: "wallet", keywords: ["salary", "tax", "itr", "regime"] },
  { slug: "compound-interest-calculator", name: "Compound Interest Calculator", description: "Grow a balance with any compounding frequency.", category: "finance", icon: "coins", keywords: ["savings", "interest", "fd", "deposit"] },
  { slug: "mortgage-calculator", name: "Mortgage Calculator", description: "Estimate monthly mortgage payments with taxes and insurance.", category: "finance", icon: "home", keywords: ["house", "property", "us", "uk"] },

  // Converters & Formatters
  { slug: "unit-converter", name: "Unit Converter", description: "Length, weight, temperature, area, volume and speed.", category: "converters", icon: "ruler", keywords: ["metric", "imperial", "kg", "lbs", "celsius"], popular: true },
  { slug: "image-compressor", name: "Image Compressor", description: "Shrink JPG, PNG and WebP files without leaving your browser.", category: "converters", icon: "image", keywords: ["reduce size", "optimize", "photo", "webp"], popular: true },
  { slug: "pdf-merge", name: "Merge PDF", description: "Combine several PDF files into one document.", category: "converters", icon: "files", keywords: ["join", "combine", "document"] },
  { slug: "json-to-csv", name: "JSON to CSV", description: "Flatten JSON arrays into spreadsheet-ready CSV.", category: "converters", icon: "table", keywords: ["excel", "convert", "spreadsheet"] },
  { slug: "number-to-words", name: "Number to Words", description: "Write any amount in words, in US or Indian numbering.", category: "converters", icon: "type", keywords: ["cheque", "lakh", "crore", "currency"] },
  { slug: "color-converter", name: "Color Converter", description: "Switch between HEX, RGB, HSL and CMYK.", category: "converters", icon: "palette", keywords: ["hex", "rgb", "hsl", "picker"] },

  // Developer Utilities
  { slug: "json-formatter", name: "JSON Formatter", description: "Validate, prettify and minify JSON with error pointers.", category: "developer", icon: "braces", keywords: ["beautify", "lint", "validator", "pretty"], popular: true },
  { slug: "base64-encoder", name: "Base64 Encode / Decode", description: "Convert text and files to and from Base64.", category: "developer", icon: "binary", keywords: ["encode", "decode", "data uri"] },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Read the header and payload of any JSON Web Token.", category: "developer", icon: "key", keywords: ["token", "auth", "claims"] },
  { slug: "regex-tester", name: "Regex Tester", description: "Test patterns live with match highlighting.", category: "developer", icon: "regex", keywords: ["regular expression", "match", "javascript"] },
  { slug: "uuid-generator", name: "UUID Generator", description: "Create v4 UUIDs in bulk and copy them in one click.", category: "developer", icon: "fingerprint", keywords: ["guid", "random id", "unique"] },
  { slug: "timestamp-converter", name: "Unix Timestamp Converter", description: "Turn epoch time into readable dates and back.", category: "developer", icon: "clock", keywords: ["epoch", "date", "utc"] },

  // Math & Calculators
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Percent of, percent change and what percent, solved instantly.", category: "math", icon: "percent", keywords: ["increase", "decrease", "discount"], popular: true },
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Body mass index with healthy range guidance.", category: "math", icon: "heart", keywords: ["weight", "health", "height"] },
  { slug: "age-calculator", name: "Age Calculator", description: "Exact age in years, months and days, plus next birthday.", category: "math", icon: "cake", keywords: ["birthday", "date of birth", "dob"] },
  { slug: "scientific-calculator", name: "Scientific Calculator", description: "Trigonometry, logs, powers and memory in one keypad.", category: "math", icon: "calculator", keywords: ["sin", "cos", "log", "exponent"] },
  { slug: "date-difference", name: "Date Difference", description: "Days, weeks and working days between two dates.", category: "math", icon: "calendar", keywords: ["days between", "duration", "countdown"] },

  // Everyday & Social
  { slug: "word-counter", name: "Word Counter", description: "Words, characters, sentences and reading time as you type.", category: "everyday", icon: "text", keywords: ["character count", "essay", "length"], popular: true },
  { slug: "qr-code-generator", name: "QR Code Generator", description: "Make QR codes for links, WiFi, WhatsApp and contacts.", category: "everyday", icon: "qr", keywords: ["scan", "barcode", "wifi"], popular: true },
  { slug: "password-generator", name: "Password Generator", description: "Strong random passwords with adjustable rules.", category: "everyday", icon: "lock", keywords: ["secure", "random", "passphrase"] },
  { slug: "hashtag-generator", name: "Hashtag Generator", description: "Relevant hashtags for Instagram, YouTube and X.", category: "everyday", icon: "hash", keywords: ["instagram", "reels", "tags", "social"] },
  { slug: "pomodoro-timer", name: "Pomodoro Timer", description: "Focus and break intervals with sound alerts.", category: "everyday", icon: "timer", keywords: ["focus", "study", "productivity"] },
];

export const getToolHref = (t: Tool) => `/tools/${t.category}/${t.slug}`;
export const getCategory = (id: CategoryId) => categories.find((c) => c.id === id)!;

/** Weighted live search: name > keywords > description. */
export function searchTools(list: Tool[], query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const kw = tool.keywords.join(" ").toLowerCase();
      const desc = tool.description.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (name.startsWith(term)) score += 6;
        else if (name.includes(term)) score += 4;
        if (kw.includes(term)) score += 3;
        if (desc.includes(term)) score += 1;
      }
      return { tool, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.tool);
}
