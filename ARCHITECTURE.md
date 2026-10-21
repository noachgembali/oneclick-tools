# OneClick Tools: Master Blueprint

## 1. Stack and rules

| Concern | Decision |
|---|---|
| Framework | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS 3 with CSS-variable tokens (`app/globals.css`) |
| Motion | Framer Motion (page transitions, layout animations, 3D tilt) |
| Tool logic | 100% client-side (`"use client"` components, pure functions in `lib/tools-logic/*`) |
| Routing | Subpaths on one domain: `/tools/{category}/{slug}`, `/blog/{slug}` |
| Ads | One AdSense approval covers every path on the domain. Add `public/ads.txt` after approval |

### Routing

```
/                              Home
/tools/{category}              Category hub (SEO landing page for the suite)
/tools/{category}/{slug}       Individual tool
/blog                          Blog index
/blog/{slug}                   Post
/about /contact /privacy-policy /terms     Required for AdSense approval
```

Note: the URL in the original brief was garbled (`://oneclick.com`). The scheme above is the intended
`https://oneclick.tools/tools/finance/emi-calculator` style path routing.

## 2. Directory architecture

```
oneclick-tools/
├─ app/
│  ├─ layout.tsx                  fonts, theme script, header/footer, sticky ad, AdSense script
│  ├─ template.tsx                page transition (remounts per navigation)
│  ├─ globals.css                 tokens + shared components (.panel .chip .field .slider .ad-slot)
│  ├─ page.tsx                    home (server) -> HomeClient
│  ├─ sitemap.ts                  (batch 2) all tools + posts
│  ├─ robots.ts                   (batch 2)
│  ├─ tools/
│  │  └─ [category]/
│  │     ├─ page.tsx              category hub
│  │     └─ [slug]/page.tsx       tool page: generateMetadata + JSON-LD + <ToolShell>
│  ├─ blog/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  └─ api/
│     └─ cron/trends/route.ts     trend ingestion + draft generation (see section 4)
├─ components/
│  ├─ ads/AdSlot.tsx              4 CLS-safe variants + sticky bar + spacer
│  ├─ home/                       Hero, HeroStack, HomeClient, ToolCard, TopToolsCarousel
│  ├─ layout/                     Header, Footer, ThemeToggle, ScrollProgress
│  ├─ tool/                       (batch 1) ToolShell, ResultCard, SliderField, CopyButton, RelatedTools, FaqBlock
│  └─ icons.ts                    single Lucide icon map
├─ lib/
│  ├─ site.ts                     config + ad slot ids
│  ├─ tools.ts                    registry: single source of truth for home, sitemap, SEO
│  ├─ seo.ts                      metadata + JSON-LD builders
│  ├─ tools-logic/                pure calculation functions, unit-testable
│  └─ blog/                       trends.ts, generate.ts, store.ts
├─ content/blog/                  reviewed .md posts with frontmatter
└─ public/ads.txt
```

## 3. Design system

- Type: Bricolage Grotesque (display) and Instrument Sans (body).
- Tokens (dark / light): Ink `#10162B` / Frost `#F2F5FC`, Raised `#1B2447` / `#E8EDFA`, Cobalt `#5B7CFF` / `#3552E8`, Saffron `#FFB547` / `#D68200`.
- Every tool uses `.panel`, `.field`, `.label`, `.slider`, `.btn-primary`, `.chip` and the Lucide icon set, so all tools look related.
- Ad layout map for every tool and blog page:
  - Top header: `<AdSlot variant="header" />` under the title block (90px / 100px reserved)
  - Floating sidebar: `<AdSlot variant="sidebar" />` inside a `sticky top-24` column, `xl` and up only (300x600 reserved)
  - In-content: `<AdSlot variant="in-content" />` after the result card and between article sections (min 280px)
  - Sticky footer: global in `layout.tsx`, with `StickyAdSpacer` reserving the same height

## 4. Automated trending blog engine

```
Vercel Cron (every 6h) -> /api/cron/trends
  1. FETCH     Google Trends daily RSS per region: geo=US, IN, GB, AE
  2. NORMALISE dedupe by slug, drop adult/medical/tragedy/brand-risk topics, score by traffic
  3. MATCH     map topic -> closest tool in lib/tools.ts (e.g. "income tax slab" -> Income Tax Calculator)
  4. DRAFT     LLM call produces markdown: answer-first intro, H2 sections, FAQ, internal link to the tool
  5. VALIDATE  min 700 words, one original element (worked example, table, or calculator embed), no duplicate title
  6. STORE     write to content/blog/*.md (git commit) or a DB row with status "draft"
  7. PUBLISH   human approval flips status to "published", then revalidatePath("/blog")
```

Important caveats:
- A cron route is a small server function, so the blog is the one non-client-side part. Tools stay fully client-side.
- Google's spam policies target mass-produced, low-value content, and AdSense can reject or demote such sites. Keep the approval gate in step 7 and make each post add something real: a worked example, a table, or an embedded tool.
- Launch with 15 to 20 hand-reviewed posts before applying to AdSense.

## 5. Master checklist (5 suites x 20 tools, built in batches of 20)

Status: [x] done, [ ] pending. Home screen: [x]

### Batch 1: Finance & Tax
- [ ] EMI  - [ ] SIP  - [ ] Lumpsum  - [ ] FD  - [ ] RD  - [ ] PPF  - [ ] Income tax (India, old vs new)
- [ ] GST  - [ ] HRA  - [ ] Gratuity  - [ ] Compound interest  - [ ] Simple interest  - [ ] CAGR  - [ ] ROI
- [ ] Mortgage (US/UK)  - [ ] US take-home pay  - [ ] VAT (UK/UAE)  - [ ] Inflation  - [ ] FIRE/retirement  - [ ] Break-even

### Batch 2: Converters & Formatters
- [ ] Length  - [ ] Weight  - [ ] Temperature  - [ ] Area  - [ ] Volume  - [ ] Speed  - [ ] Time zone
- [ ] Number to words  - [ ] Roman numerals  - [ ] Number base  - [ ] Color (HEX/RGB/HSL/CMYK)  - [ ] Case converter
- [ ] JSON to CSV  - [ ] CSV to JSON  - [ ] Image format  - [ ] Image compress  - [ ] Image resize  - [ ] PDF merge  - [ ] PDF split  - [ ] Text to PDF

### Batch 3: Development Utilities
- [ ] JSON formatter  - [ ] JS minify  - [ ] CSS minify  - [ ] HTML formatter  - [ ] SQL formatter  - [ ] Base64  - [ ] URL encode
- [ ] JWT decoder  - [ ] UUID  - [ ] Regex tester  - [ ] Hash generator  - [ ] Diff checker  - [ ] Cron parser  - [ ] Markdown preview
- [ ] Lorem ipsum  - [ ] Timestamp  - [ ] QR code  - [ ] Password generator  - [ ] HTML entities  - [ ] YAML/JSON

### Batch 4: Math & Calculators
- [ ] Percentage  - [ ] Scientific  - [ ] Fraction  - [ ] Average  - [ ] GCD/LCM  - [ ] Prime checker  - [ ] Quadratic
- [ ] Standard deviation  - [ ] Matrix  - [ ] BMI  - [ ] Age  - [ ] Date difference  - [ ] Ratio  - [ ] Probability
- [ ] Permutation/combination  - [ ] Binary  - [ ] Random number  - [ ] Tip  - [ ] Grade  - [ ] Discount

### Batch 5: Everyday & Social
- [ ] Word counter  - [ ] Character counter  - [ ] Hashtag generator  - [ ] Fancy text  - [ ] Username generator  - [ ] OCR image to text
- [ ] Color palette  - [ ] Bio generator  - [ ] Countdown  - [ ] Stopwatch  - [ ] Pomodoro  - [ ] WiFi QR  - [ ] Text repeater
- [ ] WhatsApp link  - [ ] UTM builder  - [ ] Social image sizes  - [ ] Caption generator  - [ ] Reading time  - [ ] Emoji picker  - [ ] Random picker

## 6. Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```
