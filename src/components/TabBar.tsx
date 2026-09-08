import Link from "next/link";
import { TABS } from "@/lib/homeNav";

// ホームヘッダー下部の黒いタブバー(MENU/LUNCH/PHOTO)を、他のページ(メニュー一覧など)
// からでもホームに戻れるよう、独立コンポーネントとして切り出したものです。
export function TabBar() {
  return (
    <nav className="bg-neutral-900">
      <div className="mx-auto flex max-w-5xl">
        {TABS.map((tab) => {
          const isInternal = tab.href.startsWith("/");
          const className =
            "flex-1 py-3 text-center text-sm font-semibold tracking-widest text-white transition-colors hover:bg-neutral-700 sm:text-base";
          return isInternal ? (
            <Link key={tab.label} href={tab.href} className={className}>
              {tab.label}
            </Link>
          ) : (
            <a
              key={tab.label}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
