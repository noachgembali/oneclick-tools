import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";
import { ScrollProgress } from "./ScrollProgress";

const nav = [
  { href: "/#tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 glass">
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-fg transition duration-300 ease-snap group-hover:-rotate-6 group-hover:scale-105">
            <MousePointerClick size={19} strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">OneClick</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-pill px-3.5 py-2 text-sm font-medium text-muted transition duration-200 hover:bg-raised hover:text-fg"
            >
              {n.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
      <ScrollProgress />
    </header>
  );
}
