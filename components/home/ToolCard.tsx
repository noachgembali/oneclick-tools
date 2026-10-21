"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { getIcon } from "@/components/icons";
import { getCategory, getToolHref, type Tool } from "@/lib/tools";

export function ToolCard({ tool }: { tool: Tool }) {
  const reduce = useReducedMotion();
  const Icon = getIcon(tool.icon);
  const category = getCategory(tool.category);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 22 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={reduce ? undefined : { rotateX, rotateY }}
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="preserve-3d h-full"
      >
        <Link
          href={getToolHref(tool)}
          className="group panel flex h-full flex-col gap-4 p-5 transition-colors duration-300 hover:border-brand/60"
        >
          <div className="flex items-start justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised text-brand transition duration-300 ease-snap group-hover:bg-brand group-hover:text-brand-fg">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <ArrowUpRight
              size={18}
              className="text-muted opacity-0 transition duration-300 ease-snap group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand group-hover:opacity-100"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-semibold leading-snug">{tool.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{tool.description}</p>
          </div>
          <p className="text-xs font-medium text-muted">{category.name}</p>
        </Link>
      </motion.div>
    </div>
  );
}
