import Link from "next/link";
import { TABS } from "@/components/HomeHeader";

// 旧サイト(amour.pecori.jp/t_style)の一番下の黒いバー(サイトマップ+コピーライト)を、
// 新しいヘッダーのタブ構成(MENU/LUNCH/PHOTO)に合わせて再現したフッターです。
const SITE_LINKS = [
  { label: "HOME", href: "/" },
  ...TABS,
];

export function HomeFooter() {
  return (
    <footer className="bg-neutral-900 px-4 py-6 text-center text-white">
      <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs tracking-wide sm:text-sm">
        {SITE_LINKS.map((link, i) => {
          const isInternal = link.href.startsWith("/");
          const linkClassName = "underline-offset-2 hover:underline";
          return (
            <span key={link.label} className="flex items-center gap-x-2">
              {isInternal ? (
                <Link href={link.href} className={linkClassName}>
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {link.label}
                </a>
              )}
              {i < SITE_LINKS.length - 1 && <span className="text-neutral-500">|</span>}
            </span>
          );
        })}
      </nav>

      <p className="mt-3 text-[11px] text-neutral-300 sm:text-xs">
        Japanisches Bistro T-Style · Adalbertstraße 37-39, 60486 Frankfurt am Main · 069/97789716
      </p>
      <p className="mt-1 text-[11px] text-neutral-400 sm:text-xs">
        Copyright © {new Date().getFullYear()} Japanisches Bistro T-Style. All Rights Reserved.
      </p>
    </footer>
  );
}
