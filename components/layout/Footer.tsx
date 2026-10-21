import Link from "next/link";
import { categories } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(2,1fr)]">
        <div className="max-w-sm">
          <p className="font-display text-xl font-bold">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Every tool runs inside your browser. Nothing you type or drop in is uploaded to a server.
          </p>
        </div>

        <nav aria-label="Tool categories">
          <p className="mb-3 text-sm font-semibold">Tools</p>
          <ul className="space-y-2 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.id}>
                <Link className="transition hover:text-fg" href={`/tools/${c.id}`}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="mb-3 text-sm font-semibold">Site</p>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link className="transition hover:text-fg" href="/blog">Blog</Link></li>
            <li><Link className="transition hover:text-fg" href="/about">About</Link></li>
            <li><Link className="transition hover:text-fg" href="/contact">Contact</Link></li>
            <li><Link className="transition hover:text-fg" href="/privacy-policy">Privacy policy</Link></li>
            <li><Link className="transition hover:text-fg" href="/terms">Terms of use</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
