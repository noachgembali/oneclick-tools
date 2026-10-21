"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getIcon } from "@/components/icons";
import { getCategory, getToolHref, type Tool } from "@/lib/tools";

export function TopToolsCarousel({ tools }: { tools: Tool[] }) {
  const track = useRef<HTMLUListElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 300) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="top-tools" className="container">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 id="top-tools" className="text-display-lg">Most used right now</h2>
          <p className="mt-2 text-muted">The tools people open again and again.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous tools" onClick={() => scrollByCard(-1)} className="btn-ghost !px-3">
            <ChevronLeft size={18} />
          </button>
          <button type="button" aria-label="Next tools" onClick={() => scrollByCard(1)} className="btn-ghost !px-3">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0"
        tabIndex={0}
        aria-label="Most used tools"
      >
        {tools.map((tool, i) => {
          const Icon = getIcon(tool.icon);
          return (
            <motion.li
              key={tool.slug}
              className="w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[31.5%]"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ delay: Math.min(i, 4) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={getToolHref(tool)}
                className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-tile border border-line bg-raised p-6 transition duration-500 ease-snap hover:border-brand/70 hover:shadow-glow"
              >
                <span
                  aria-hidden
                  className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand/15 blur-2xl transition duration-500 group-hover:bg-brand/30"
                />
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand text-brand-fg">
                  <Icon size={24} strokeWidth={1.75} />
                </span>
                <div className="relative">
                  <p className="text-xs font-medium text-muted">{getCategory(tool.category).name}</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{tool.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{tool.description}</p>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
