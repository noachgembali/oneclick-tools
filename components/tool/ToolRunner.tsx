"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { defs, type Out } from "@/lib/tool-defs";

export function ToolRunner({ slug }: { slug: string }) {
  const def = defs[slug];
  const [vals, setVals] = useState<Record<string, string | number>>(() => Object.fromEntries(def.fields.map((f) => [f.k, f.v])));
  const [out, setOut] = useState<Out | null>(null);
  const [copied, setCopied] = useState(false);

  // Computed after mount so random tools never cause a server/client mismatch.
  useEffect(() => {
    const parsed = Object.fromEntries(def.fields.map((f) => [f.k, f.t === "number" ? parseFloat(String(vals[f.k])) : vals[f.k]]));
    try { setOut(def.run(parsed)); } catch { setOut({ error: "Please check your input." }); }
  }, [vals, def]);

  const copyText = useMemo(() => out?.text ?? out?.rows?.map((r) => `${r[0]}: ${r[1]}`).join("\n") ?? "", [out]);
  const set = (k: string, v: string | number) => setVals((p) => ({ ...p, [k]: v }));

  return (
    <div className="panel p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        {def.fields.map((f) => (
          <div key={f.k} className={f.t === "area" ? "sm:col-span-2" : ""}>
            <label htmlFor={`f-${f.k}`} className="label">{f.l}</label>
            {f.t === "area" ? (
              <textarea id={`f-${f.k}`} rows={6} spellCheck={false} className="field font-mono text-sm" value={String(vals[f.k])} onChange={(e) => set(f.k, e.target.value)} />
            ) : f.t === "select" ? (
              <select id={`f-${f.k}`} className="field" value={String(vals[f.k])} onChange={(e) => set(f.k, e.target.value)}>
                {f.o!.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <>
                <input id={`f-${f.k}`} className="field" type={f.t === "number" ? "number" : f.t} step={f.step ?? "any"} value={String(vals[f.k])} onChange={(e) => set(f.k, e.target.value)} />
                {f.slider && (
                  <input
                    aria-label={`${f.l} slider`} type="range" className="slider mt-3" min={f.slider[0]} max={f.slider[1]} step={f.step ?? 1}
                    value={Number(vals[f.k]) || f.slider[0]}
                    style={{ "--fill": `${((Number(vals[f.k]) - f.slider[0]) / (f.slider[1] - f.slider[0])) * 100}%` } as React.CSSProperties}
                    onChange={(e) => set(f.k, e.target.value)}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="gold-rule my-6" />

      <div aria-live="polite" className="min-h-[96px]">
        <AnimatePresence mode="wait">
          {out && (
            <motion.div key={JSON.stringify(out).length} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {out.error ? <p className="text-red-600">{out.error}</p> : (
                <>
                  {out.rows?.map(([l, v, big]) => (
                    <div key={l} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
                      <span className="text-muted">{l}</span>
                      <b className={big ? "font-display text-3xl text-brand sm:text-4xl" : "text-right font-semibold"}>{v}</b>
                    </div>
                  ))}
                  {out.text && <pre className="mt-3 whitespace-pre-wrap break-words rounded-xl bg-raised p-4 font-mono text-sm">{out.text}</pre>}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!out?.error && copyText && (
        <button type="button" className="btn-primary mt-5" onClick={() => navigator.clipboard.writeText(copyText).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); })}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy result"}
        </button>
      )}
    </div>
  );
}
