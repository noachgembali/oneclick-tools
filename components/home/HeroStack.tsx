"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const CARDS = [
  ["EMI Calculator", "₹41,236 / month"],
  ["JSON Formatter", "Valid in 3 ms"],
  ["Percentage", "+18% gives 2,832"],
  ["Unit Converter", "5 km = 3.11 mi"],
  ["Word Counter", "1,284 words"],
  ["GST Calculator", "₹1,180 incl. 18%"],
];

/** A slowly rotating 3D ring of tool previews. Pointer position tilts the whole scene. */
export function HeroStack() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-16, 16]), { stiffness: 80, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [18, -6]), { stiffness: 80, damping: 18 });

  return (
    <div
      aria-hidden
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="perspective-1000 relative hidden h-[460px] lg:block"
    >
      <motion.div style={reduce ? undefined : { rotateX, rotateY }} className="preserve-3d absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-[radial-gradient(circle_at_30%_28%,#fff,rgb(var(--saffron))_45%,rgb(var(--brand))_100%)] opacity-80 blur-[2px] shadow-glow" />
        <div className="preserve-3d absolute inset-0 animate-spin3d" style={reduce ? { animation: "none" } : undefined}>
          {CARDS.map(([title, value], i) => (
            <div
              key={title}
              className="panel absolute left-1/2 top-1/2 w-[200px] p-4 [backface-visibility:hidden]"
              style={{ margin: "-48px 0 0 -100px", transform: `rotateY(${i * 60}deg) translateZ(250px)` }}
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-saffron">{title}</p>
              <p className="mt-1.5 font-display text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
