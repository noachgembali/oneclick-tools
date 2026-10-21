"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";
import { categories, searchTools, type CategoryId, type Tool } from "@/lib/tools";
import { Hero } from "./Hero";
import { ToolCard } from "./ToolCard";
import { TopToolsCarousel } from "./TopToolsCarousel";

type Filter = "all" | CategoryId;

export function HomeClient({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const pool = filter === "all" ? tools : tools.filter((t) => t.category === filter);
    return searchTools(pool, deferredQuery);
  }, [tools, filter, deferredQuery]);

  const popular = useMemo(() => tools.filter((t) => t.popular), [tools]);
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: tools.length };
    for (const c of categories) map[c.id] = tools.filter((t) => t.category === c.id).length;
    return map;
  }, [tools]);

  const activeBlurb = categories.find((c) => c.id === filter)?.blurb;
  const searching = deferredQuery.trim().length > 0;

  return (
    <>
      <Hero query={query} onQuery={setQuery} toolCount={tools.length} />

      {/* Top header ad: space is reserved by the AdSlot itself */}
      <div className="container">
        <AdSlot variant="header" />
      </div>

      <section id="tools" aria-labelledby="all-tools" className="container scroll-mt-20 pt-14">
        <div className="mb-6">
          <h2 id="all-tools" className="text-display-lg">
            {searching ? `Results for “${deferredQuery.trim()}”` : "All tools"}
          </h2>
          <p className="mt-2 min-h-[1.5rem] text-muted">
            {filter === "all" ? "Pick a category or start typing above." : activeBlurb}
          </p>
        </div>

        <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {[{ id: "all" as const, name: "All tools" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              className="chip"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id as Filter)}
            >
              {c.name}
              <span className="text-xs opacity-70">{counts[c.id]}</span>
            </button>
          ))}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "tool" : "tools"} found
        </p>

        {results.length === 0 ? (
          <div className="panel grid place-items-center gap-3 px-6 py-16 text-center">
            <SearchX size={36} strokeWidth={1.5} className="text-muted" />
            <p className="font-display text-xl font-semibold">No tool matches “{deferredQuery.trim()}”</p>
            <p className="max-w-md text-sm text-muted">
              Try a shorter word like “loan” or “pdf”, or switch back to all categories.
            </p>
            <button
              type="button"
              className="btn-primary mt-2"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((tool, index) => (
                <motion.li
                  key={tool.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(index, 8) * 0.02 }}
                >
                  <ToolCard tool={tool} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <div className="container py-14">
        <AdSlot variant="in-content" />
      </div>

      <TopToolsCarousel tools={popular} />
    </>
  );
}
