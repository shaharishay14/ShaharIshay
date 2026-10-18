"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ContactDialog } from "@/components/ContactDialog";
import { cn } from "@/lib/utils";

const PAGES = [
  { name: "Work", href: "/" },
  { name: "Blog", href: "/blog" },
];

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/shaharishay14" },
  { name: "X", url: "https://x.com/shahar_ishay14?s=21&t=pHYwv3OZuImbn_TGDDxPIQ" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/shahar-ishay-831762303/" },
];

/** Name, page links, contact and socials. `children` are extra nav items (admin controls on the home page). */
export function SiteHeader({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const [contactOpen, setContactOpen] = useState(false);
  const closeContact = useCallback(() => setContactOpen(false), []);
  // The dialog is portalled to <body>: a transformed or filtered ancestor (the home page's
  // fade-in) would otherwise become the containing block for its fixed positioning
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight" aria-label="Shahar Ishay — home">
          Shahar Ishay
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted">
          {PAGES.map((page) => {
            const current = page.href === "/" ? pathname === "/" : pathname.startsWith(page.href);
            return (
              <Link
                key={page.name}
                href={page.href}
                aria-current={current ? "page" : undefined}
                className={cn("transition-colors hover:text-ink", current && "text-ink")}
              >
                {page.name}
              </Link>
            );
          })}
          <span aria-hidden="true" className="h-3.5 w-px bg-line" />
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="text-ink transition-colors hover:text-accent"
          >
            Contact
          </button>
          {SOCIALS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {link.name}
            </a>
          ))}
          {children}
        </nav>
      </header>
      {mounted && createPortal(<ContactDialog open={contactOpen} onClose={closeContact} />, document.body)}
    </>
  );
}
