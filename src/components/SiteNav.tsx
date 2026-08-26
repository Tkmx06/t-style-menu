"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="inline-block" onClick={() => setOpen(false)}>
          <span className="text-xl font-semibold tracking-wide">t·style</span>
          <span className="ml-2 text-xs text-neutral-400">Japanisches Bistro</span>
        </Link>
        <button
          type="button"
          aria-label="メニュー"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1 sm:hidden"
        >
          <span className="h-0.5 w-5 bg-neutral-100" />
          <span className="h-0.5 w-5 bg-neutral-100" />
          <span className="h-0.5 w-5 bg-neutral-100" />
        </button>
        <nav className="hidden flex-wrap gap-x-4 gap-y-2 text-sm sm:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className={
                pathname === `/${c.slug}`
                  ? "text-white"
                  : "text-neutral-300 hover:text-white transition-colors"
              }
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-neutral-800 px-4 py-3 sm:hidden">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              onClick={() => setOpen(false)}
              className={
                pathname === `/${c.slug}`
                  ? "py-2 text-white"
                  : "py-2 text-neutral-300"
              }
            >
              {c.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
