import Link from "next/link";
import Image from "next/image";
import { TabBar } from "@/components/TabBar";

const RESERVATION_URL = "https://restaurant-reservation-ebon.vercel.app/reservation";
const INSTAGRAM_URL = "https://www.instagram.com/t_style_frankfurt/";

// 2026-09-08: DE/EN/JP言語切り替えボタンを廃止し、右上にInstagramへの
// リンクアイコンを設置しました。
// 中央の予約ボタンは、一時的にテーブル予約アイコンのみのデザインに変更しましたが、
// 「Jetzt reservieren」の文字が無いと分かりにくいとのことで、テーブル予約アイコンと
// 「Jetzt reservieren」の文字を1つのボタンの中に並べる形に戻しました。
//
// このヘッダーはホーム画面だけでなく、/menu以下の全ページ(src/app/menu/layout.tsx)
// でも共通で使っており、ロゴ・予約ボタン・Instagramリンク・下の黒いタブバー
// (HOME/MENU/PHOTO)がどのページでも必ず同じ内容で表示されるようにしています。
export function HomeHeader() {
  return (
    <header className="relative border-b border-neutral-200">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-500 hover:text-neutral-900"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="t-style Japanisches Bistro"
            width={1561}
            height={586}
            priority
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>

        <a
          href={RESERVATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-red-600 px-6 py-3 text-white shadow-sm transition-colors hover:bg-red-700 sm:px-7 sm:py-3.5"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <ellipse cx="10.5" cy="10.5" rx="7.5" ry="5.5" />
            <path d="M10.5 16v3.5M7 19.5h7" />
            <circle cx="18" cy="16.5" r="5" fill="#16a34a" stroke="white" strokeWidth="1.4" />
            <path
              d="M15.7 16.6l1.6 1.6 3-3.2"
              stroke="white"
              strokeWidth="1.6"
              fill="none"
            />
          </svg>
          <span className="text-sm font-semibold tracking-wide sm:text-base">
            Jetzt reservieren
          </span>
        </a>
      </div>

      <TabBar />
    </header>
  );
}
