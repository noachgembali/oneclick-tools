/** Client-side logic for every finished tool. A slug listed here gets a live page, sitemap entry and home-grid card. */
export type Field = {
  k: string; l: string; t: "number" | "text" | "area" | "date" | "select";
  v: string | number; o?: string[]; step?: number; slider?: [number, number];
};
export type Out = { rows?: [string, string, boolean?][]; text?: string; error?: string };
export interface Def { fields: Field[]; run: (v: any) => Out; about?: string }

const f = (n: number) => (isFinite(n) ? n.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "n/a");
const N = (k: string, l: string, v: number, slider?: [number, number], step?: number): Field => ({ k, l, t: "number", v, slider, step });
const X = (k: string, l: string, v: string): Field => ({ k, l, t: "text", v });
const T = (k: string, l: string, v: string): Field => ({ k, l, t: "area", v });
const D = (k: string, l: string, v: string): Field => ({ k, l, t: "date", v });
const S = (k: string, l: string, o: string[]): Field => ({ k, l, t: "select", v: o[0], o });

const loan = (p: number, r: number, y: number): Out => {
  const i = r / 1200, n = y * 12, e = i ? (p * i * (1 + i) ** n) / ((1 + i) ** n - 1) : p / n;
  return { rows: [["Monthly payment", f(e), true], ["Total interest", f(e * n - p)], ["Total payment", f(e * n)]] };
};

const ones = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" ");
const tens = "  twenty thirty forty fifty sixty seventy eighty ninety".split(" ");
const w2 = (n: number) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : ""));
const w3 = (n: number) => (n > 99 ? ones[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " : "") : "") + (n % 100 ? w2(n % 100) : "");
function words(n: number, indian: boolean): string {
  if (n === 0) return "zero";
  const u: [number, string][] = indian ? [[1e7, "crore"], [1e5, "lakh"], [1e3, "thousand"]] : [[1e9, "billion"], [1e6, "million"], [1e3, "thousand"]];
  const out: string[] = [];
  for (const [v, l] of u) if (n >= v) { out.push(words(Math.floor(n / v), indian) + " " + l); n %= v; }
  if (n) out.push(w3(n));
  return out.join(" ");
}

const UNITS: Record<string, (v: number) => number> = {
  "km to miles": (v) => v * 0.621371, "miles to km": (v) => v * 1.609344, "kg to lb": (v) => v * 2.20462, "lb to kg": (v) => v / 2.20462,
  "°C to °F": (v) => (v * 9) / 5 + 32, "°F to °C": (v) => ((v - 32) * 5) / 9, "metres to feet": (v) => v * 3.28084, "feet to metres": (v) => v / 3.28084,
  "cm to inches": (v) => v / 2.54, "inches to cm": (v) => v * 2.54, "litres to US gallons": (v) => v * 0.264172,
};
const b64d = (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)));

export const defs: Record<string, Def> = {
  "emi-calculator": {
    about: "EMI (equated monthly instalment) is the fixed amount you repay each month on a loan. Each payment covers interest on the remaining balance plus part of the principal, so early payments are mostly interest. A shorter tenure raises the EMI but cuts total interest sharply.",
    fields: [N("p", "Loan amount", 2500000, [100000, 20000000]), N("r", "Interest rate (% per year)", 8.5, [1, 25], 0.1), N("y", "Tenure (years)", 20, [1, 40])],
    run: (v) => loan(v.p, v.r, v.y),
  },
  "mortgage-calculator": {
    fields: [N("p", "Loan amount", 350000, [50000, 2000000]), N("r", "Interest rate (% per year)", 6.5, [1, 15], 0.05), N("y", "Term (years)", 30, [5, 40])],
    run: (v) => loan(v.p, v.r, v.y),
  },
  "sip-calculator": {
    about: "A SIP invests a fixed sum every month. Returns compound, so starting early matters more than the amount. Results are estimates: real market returns vary and are not guaranteed.",
    fields: [N("m", "Monthly investment", 10000, [500, 200000]), N("r", "Expected return (% per year)", 12, [1, 30], 0.1), N("y", "Years", 15, [1, 40])],
    run: (v) => { const i = v.r / 1200, n = v.y * 12, fv = i ? v.m * (((1 + i) ** n - 1) / i) * (1 + i) : v.m * n; return { rows: [["Future value", f(fv), true], ["Amount invested", f(v.m * n)], ["Estimated gains", f(fv - v.m * n)]] }; },
  },
  "compound-interest-calculator": {
    fields: [N("p", "Principal", 100000, [1000, 5000000]), N("r", "Rate (% per year)", 7, [1, 25], 0.1), N("y", "Years", 10, [1, 40])],
    run: (v) => { const t = v.p * (1 + v.r / 1200) ** (v.y * 12); return { rows: [["Final amount", f(t), true], ["Interest earned", f(t - v.p)]] }; },
  },
  "gst-calculator": {
    about: "GST and VAT are taxes on the value added at each stage of a sale. Use Add to put tax on top of a price, or Remove to split a tax-inclusive price into net and tax. Check the current rate for your country and goods.",
    fields: [N("a", "Amount", 1000), N("r", "Tax rate (%)", 18, [0, 30], 0.5), S("m", "Mode", ["Add tax", "Remove tax"])],
    run: (v) => { const add = v.m === "Add tax", tax = add ? (v.a * v.r) / 100 : v.a - v.a / (1 + v.r / 100), net = add ? v.a : v.a - tax; return { rows: [["Gross amount", f(net + tax), true], ["Net amount", f(net)], ["Tax", f(tax)]] }; },
  },
  "unit-converter": {
    fields: [N("v", "Value", 1), S("u", "Convert", Object.keys(UNITS))],
    run: (v) => ({ rows: [["Result", `${f(UNITS[v.u](v.v))} ${v.u.split(" to ")[1]}`, true]] }),
  },
  "number-to-words": {
    fields: [N("n", "Number", 1250000), S("s", "Style", ["Indian", "International"])],
    run: (v) => { const n = Math.floor(Math.abs(v.n)); return n > 9e12 ? { error: "Number is too large." } : { rows: [["In words", words(n, v.s === "Indian"), true]] }; },
  },
  "color-converter": {
    fields: [X("h", "HEX color", "#0B5D4B")],
    run: (v) => {
      const m = /^#?([\da-f]{6})$/i.exec(String(v.h).trim()); if (!m) return { error: "Enter a 6-digit HEX color." };
      const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, x = Math.max(r, g, b) / 255, y = Math.min(r, g, b) / 255, l = (x + y) / 2, d = x - y;
      const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
      const h = d ? (x === r / 255 ? ((g - b) / 255 / d + 6) % 6 : x === g / 255 ? (b - r) / 255 / d + 2 : (r - g) / 255 / d + 4) : 0;
      return { rows: [["RGB", `rgb(${r}, ${g}, ${b})`, true], ["HSL", `hsl(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`]] };
    },
  },
  "json-formatter": {
    fields: [T("j", "Paste JSON", '{"tool":"oneclick","valid":true,"items":[1,2,3]}'), S("m", "Output", ["Pretty", "Minified"])],
    run: (v) => { try { return { text: JSON.stringify(JSON.parse(v.j), null, v.m === "Pretty" ? 2 : 0) }; } catch (e) { return { error: "Invalid JSON: " + (e as Error).message }; } },
  },
  "base64-encoder": {
    fields: [T("t", "Text", "Hello, OneClick!"), S("m", "Action", ["Encode", "Decode"])],
    run: (v) => { try { return { text: v.m === "Encode" ? btoa(String.fromCharCode(...new TextEncoder().encode(v.t))) : b64d(v.t.trim()) }; } catch { return { error: "Not valid Base64." }; } },
  },
  "jwt-decoder": {
    fields: [T("t", "JWT", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.x")],
    run: (v) => { try { const [h, p] = String(v.t).trim().split("."); return { text: JSON.stringify(JSON.parse(b64d(h)), null, 2) + "\n\n" + JSON.stringify(JSON.parse(b64d(p)), null, 2) }; } catch { return { error: "Paste a valid JWT (header.payload.signature)." }; } },
  },
  "regex-tester": {
    fields: [X("p", "Pattern", "\\b\\w{5}\\b"), X("g", "Flags", "gi"), T("t", "Test text", "Quick brown foxes jump over lazy dogs")],
    run: (v) => { try { const m = [...String(v.t).matchAll(new RegExp(v.p, v.g.includes("g") ? v.g : v.g + "g"))]; return { rows: [["Matches", String(m.length), true]], text: m.map((x) => x[0]).join("\n") }; } catch (e) { return { error: (e as Error).message }; } },
  },
  "uuid-generator": {
    fields: [N("n", "How many", 5)],
    run: (v) => ({ text: Array.from({ length: Math.min(Math.max(v.n | 0, 1), 50) }, () => crypto.randomUUID()).join("\n") }),
  },
  "timestamp-converter": {
    fields: [N("t", "Unix timestamp (seconds)", 1767225600)],
    run: (v) => { const d = new Date(v.t * 1000); return isNaN(+d) ? { error: "Invalid timestamp." } : { rows: [["UTC", d.toUTCString(), true], ["ISO 8601", d.toISOString()]] }; },
  },
  "percentage-calculator": {
    fields: [N("a", "Value A", 20), N("b", "Value B", 250)],
    run: (v) => ({ rows: [[`${f(v.a)}% of ${f(v.b)}`, f((v.a * v.b) / 100), true], [`${f(v.a)} is what % of ${f(v.b)}`, f((v.a / v.b) * 100) + "%"], [`Change from ${f(v.a)} to ${f(v.b)}`, f(((v.b - v.a) / v.a) * 100) + "%"]] }),
  },
  "bmi-calculator": {
    fields: [N("w", "Weight (kg)", 70, [30, 200]), N("h", "Height (cm)", 170, [120, 220])],
    run: (v) => { const b = v.w / (v.h / 100) ** 2; return { rows: [["BMI", f(b), true], ["Category", b < 18.5 ? "Underweight" : b < 25 ? "Healthy" : b < 30 ? "Overweight" : "Obese"]] }; },
  },
  "age-calculator": {
    fields: [D("d", "Date of birth", "1995-06-15")],
    run: (v) => {
      const b = new Date(v.d), t = new Date(); if (isNaN(+b)) return { error: "Pick a valid date." };
      let y = t.getFullYear() - b.getFullYear(), m = t.getMonth() - b.getMonth(), d = t.getDate() - b.getDate();
      if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); } if (m < 0) { y--; m += 12; }
      const nx = new Date(t.getFullYear(), b.getMonth(), b.getDate()); if (nx < t) nx.setFullYear(t.getFullYear() + 1);
      return { rows: [["Age", `${y} years, ${m} months, ${d} days`, true], ["Next birthday in", Math.ceil((+nx - +t) / 864e5) + " days"]] };
    },
  },
  "date-difference": {
    fields: [D("a", "From", "2026-01-01"), D("b", "To", "2026-12-31")],
    run: (v) => { const a = new Date(v.a), b = new Date(v.b), d = Math.round((+b - +a) / 864e5); let w = 0; for (let i = 0, x = new Date(Math.min(+a, +b)); i < Math.abs(d); i++, x.setDate(x.getDate() + 1)) if (x.getDay() % 6) w++; return { rows: [["Days", f(d), true], ["Weeks", f(d / 7)], ["Working days", String(w)]] }; },
  },
  "word-counter": {
    fields: [T("t", "Your text", "Type or paste text here.")],
    run: (v) => { const w = (String(v.t).match(/\S+/g) || []).length; return { rows: [["Words", String(w), true], ["Characters", String(v.t.length)], ["Without spaces", String(v.t.replace(/\s/g, "").length)], ["Reading time", Math.max(1, Math.round(w / 230)) + " min"]] }; },
  },
  "password-generator": {
    fields: [N("n", "Length", 16, [8, 64]), S("s", "Symbols", ["Include", "Skip"])],
    run: (v) => { const a = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789" + (v.s === "Include" ? "!@#$%^&*-_?" : ""); return { text: [...crypto.getRandomValues(new Uint32Array(Math.min(Math.max(v.n | 0, 6), 64)))].map((x) => a[x % a.length]).join("") }; },
  },
};

export const hasDef = (slug: string) => slug in defs;
