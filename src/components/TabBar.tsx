import Link from "next/link";
import { TABS } from "@/lib/homeNav";

// ホームヘッダー下部の黒いタブバー(MENU/LUNCH/PHOTO)を、他のページ(メニュー一覧など)
// からでもホームに戻れるよう、独立コンポーネントとして切り出したものです。
//
// 2026-09-15: 各タブのhover演出(背景色・下線)は、スマホ等のタッチ端末では
// 発火しない(カーソルが無いため)ため、active:(タップ中)にも同じ見た目を
// 適用し、タップ操作でも動きが感じられるようにしました。
export function TabBar() {
  return (
    <nav className="nav-fade-in bg-neutral-900">
      <div className="mx-auto flex max-w-5xl">
        {TABS.map((tab) => {
          const isInternal = tab.href.startsWith("/");
          const className =
            "relative flex-1 py-3 text-center text-sm font-semibold tracking-widest text-white transition-colors hover:bg-neutral-700 active:bg-neutral-700 sm:text-base after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-red-500 after:transition-all after:duration-300 hover:after:w-8 active:after:w-8";
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
