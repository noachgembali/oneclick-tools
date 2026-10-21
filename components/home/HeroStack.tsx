"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** Decorative 3D stack: three live-looking tool previews that drift with the pointer. */
export function HeroStack() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div
      aria-hidden
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="perspective-1000 relative hidden h-[420px] lg:block"
    >
      <motion.div style={reduce ? undefined : { rotateX, rotateY }} className="preserve-3d absolute inset-0">
        {/* EMI */}
        <div className="panel absolute left-2 top-6 w-72 animate-float p-5" style={{ transform: "translateZ(20px)" }}>
          <p className="text-xs font-medium text-muted">EMI Calculator</p>
          <p className="mt-2 font-display text-4xl font-bold tracking-tight">₹41,236</p>
          <p className="text-sm text-muted">per month for 20 years</p>
          <div className="mt-5 h-2 rounded-pill bg-raised">
            <div className="h-full w-[62%] rounded-pill bg-brand" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>Principal</span>
            <span>Interest</span>
          </div>
        </div>

        {/* JSON */}
        <div
          className="panel absolute right-0 top-28 w-64 animate-float-slow p-5"
          style={{ transform: "translateZ(70px)", animationDelay: "-3s" }}
        >
          <p className="text-xs font-medium text-muted">JSON Formatter</p>
          <pre className="mt-3 text-[13px] leading-6 text-fg">
{`{
  "tool": "oneclick",
  "valid": `}<span className="text-saffron">true</span>{`,
  "ms": `}<span className="text-brand">3</span>{`
}`}
          </pre>
        </div>

        {/* Percentage */}
        <div
          className="panel absolute bottom-2 left-16 w-60 animate-float p-5"
          style={{ transform: "translateZ(120px)", animationDelay: "-5s" }}
        >
          <p className="text-xs font-medium text-muted">Percentage Calculator</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-saffron">+18%</span>
            <span className="text-sm text-muted">from 2,400</span>
          </div>
          <p className="mt-1 text-sm text-muted">equals 2,832</p>
        </div>
      </motion.div>
    </div>
  );
}
