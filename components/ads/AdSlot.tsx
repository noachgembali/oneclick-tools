"use client";

import { useEffect, useRef } from "react";
import { adSlots, siteConfig } from "@/lib/site";

export type AdVariant = "header" | "sidebar" | "in-content" | "sticky-footer";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Every variant reserves its final size up front, so an ad loading (or not
 * filling) can never push content around. Sizes mirror the common AdSense
 * formats: 728x90 / 320x100, 300x600, 336x280 / fluid, 728x90 / 320x50.
 */
const CONFIG: Record<AdVariant, { box: string; slot: string; format: string; label: string }> = {
  header: {
    box: "h-[var(--ad-header-h)] max-w-[970px]",
    slot: adSlots.header,
    format: "horizontal",
    label: "Header ad",
  },
  sidebar: {
    box: "h-[600px] w-[300px]",
    slot: adSlots.sidebar,
    format: "vertical",
    label: "Sidebar ad",
  },
  "in-content": {
    box: "min-h-[280px] max-w-[760px]",
    slot: adSlots.inContent,
    format: "auto",
    label: "In-content ad",
  },
  "sticky-footer": {
    box: "h-[var(--ad-sticky-h)] max-w-[728px]",
    slot: adSlots.sticky,
    format: "horizontal",
    label: "Sticky footer ad",
  },
};

export function AdSlot({ variant, className = "" }: { variant: AdVariant; className?: string }) {
  const cfg = CONFIG[variant];
  const pushed = useRef(false);
  const live = Boolean(siteConfig.adsenseClient && cfg.slot);

  useEffect(() => {
    if (!live || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense blocked or not yet loaded: the reserved box simply stays empty. */
    }
  }, [live]);

  const showPlaceholder = !live && siteConfig.showAdPlaceholders;

  return (
    <aside
      aria-label="Advertisement"
      data-ad-variant={variant}
      data-placeholder={showPlaceholder ? "true" : "false"}
      className={`ad-slot ${cfg.box} ${className}`}
    >
      {live ? (
        <ins
          className="adsbygoogle block h-full w-full"
          style={{ display: "block" }}
          data-ad-client={siteConfig.adsenseClient}
          data-ad-slot={cfg.slot}
          data-ad-format={cfg.format}
          data-full-width-responsive="true"
        />
      ) : showPlaceholder ? (
        <span>{cfg.label}</span>
      ) : null}
    </aside>
  );
}

/** Fixed bottom bar. Layout reserves the same height via <StickyAdSpacer /> so nothing shifts. */
export function StickyFooterAd() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/90 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md">
      <AdSlot variant="sticky-footer" />
    </div>
  );
}

export function StickyAdSpacer() {
  return <div aria-hidden className="h-[calc(var(--ad-sticky-h)+0.75rem)]" />;
}
