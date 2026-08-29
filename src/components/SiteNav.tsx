"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="w-16" />
        <Link href="/menu" className="inline-block" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="t-style Japanisches Bistro"
            width={1561}
            height={586}
            priority
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>
        <button
          type="button"
          aria-label="メニュー"
          onClick={() => setOpen((v) => !v)}
          className="flex w-16 flex-col items-end gap-1.5"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="h-0.5 w-6 bg-neutral-900" />
            <span className="h-0.5 w-6 bg-neutral-900" />
            <span className="h-0.5 w-6 bg-neutral-900" />
          </div>
          <span className="text-[11px] font-semibold tracking-widest text-neutral-700">
            MENU
          </span>
        </button>
      </div>

      {open && (
        <>
          <button
            aria-label="閉じる"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 bg-black/20"
          />
          <nav className="absolute right-4 top-full z-20 flex w-56 flex-col gap-1 rounded-md border border-neutral-200 bg-white py-2 shadow-lg">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/menu/${c.slug}`}
                onClick={() => setOpen(false)}
                className={
                  pathname === `/menu/${c.slug}`
                    ? "px-4 py-2 text-sm font-medium text-red-600"
                    : "px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                }
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
