"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { HeroStack } from "./HeroStack";

const PROMPTS = [
  "EMI calculator",
  "Merge PDF files",
  "Format JSON",
  "GST calculator",
  "Compress an image",
  "Convert kg to lbs",
  "Generate a QR code",
];

/** Cycles through example searches so the placeholder teaches what the bar can do. */
function useTypedPlaceholder(active: boolean) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(PROMPTS[0]);

  useEffect(() => {
    if (!active || reduce) {
      setText("Search 100+ free tools");
      return;
    }
    let i = 0;
    let n = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = PROMPTS[i % PROMPTS.length];
      if (!deleting) {
        n++;
        setText(word.slice(0, n));
        if (n === word.length) {
          deleting = true;
          timer = setTimeout(tick, 1400);
          return;
        }
        timer = setTimeout(tick, 70);
      } else {
        n--;
        setText(word.slice(0, n));
        if (n === 0) {
          deleting = false;
          i++;
          timer = setTimeout(tick, 250);
          return;
        }
        timer = setTimeout(tick, 32);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [active, reduce]);

  return text;
}

interface HeroProps {
  query: string;
  onQuery: (q: string) => void;
  toolCount: number;
}

export function Hero({ query, onQuery, toolCount }: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const placeholder = useTypedPlaceholder(!focused && query === "");

  // Press "/" anywhere to jump into search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[28rem] w-[56rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
      />

      <div className="container grid items-center gap-10 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
        <div>
          <h1 className="text-display-xl">
            Every small job,
            <br />
            <span className="text-shimmer animate-shimmer">done in one click.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Calculators, converters and developer tools that run right in your browser. Nothing to install,
            nothing uploaded, no account.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-9 max-w-2xl"
          >
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <div className="group relative">
              <Search
                size={22}
                strokeWidth={1.75}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted transition group-focus-within:text-brand"
              />
              <input
                id="tool-search"
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={placeholder}
                autoComplete="off"
                spellCheck={false}
                className="h-16 w-full rounded-pill border border-line bg-surface pl-14 pr-28 text-lg text-fg shadow-lift transition duration-300 ease-snap placeholder:text-muted/70 focus:border-brand focus:shadow-glow focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      onQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="grid h-9 w-9 place-items-center rounded-pill text-muted transition hover:bg-raised hover:text-fg"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <kbd className="hidden rounded-lg border border-line bg-raised px-2.5 py-1 text-sm font-medium text-muted sm:block">
                    /
                  </kbd>
                )}
              </div>
            </div>
            <p className="mt-3 pl-5 text-sm text-muted">
              {toolCount} tools ready. Press <span className="font-medium text-fg">/</span> from anywhere to search.
            </p>
          </form>
        </div>

        <HeroStack />
      </div>
    </section>
  );
}
