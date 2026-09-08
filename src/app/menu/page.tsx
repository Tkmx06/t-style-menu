import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";

// 黒いタブバーの「MENU」から遷移する選択画面。
// LUNCH(/menu/lunch)とDINNER(/menu/menu-pages、正式なメニュー表)を
// ボタンで選べるようにしています(2026-09-08、旧「MENU」タブを置き換え)。
// 以前はここから最初のカテゴリ(CATEGORIES[0])へリダイレクトしていましたが、
// LUNCH/DINNERを選ぶ画面に変更しました。
//
// 2026-09-08: 「PHOTOページの黒いバーの下にある写真を、このSpeisekarte/LUNCH/DINNER
// 画面の背景にしてほしい」との要望で、PHOTOページ(/menu/empfehlung)の一番上に
// 表示しているのと同じ写真(/hero-banner.jpg)を背景にしたヒーロー風のセクションに
// 変更しました。文字とボタンを読みやすくするため、写真の上に黒の半透明レイヤーを
// 重ねています。
export default function MenuIndexPage() {
  return (
    <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-10 overflow-hidden rounded-2xl px-4 py-16 text-center sm:min-h-[520px]">
      <Image
        src="/hero-banner.jpg"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/55" />

      <h1 className="relative font-script text-5xl text-white drop-shadow-md">
        Speisekarte
      </h1>
      <div className="relative flex flex-col gap-6 sm:flex-row">
        <Link
          href="/menu/lunch"
          className="w-56 rounded-full bg-white/95 px-10 py-4 text-lg font-semibold tracking-widest text-neutral-900 shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          LUNCH
        </Link>
        <Link
          href="/menu/menu-pages"
          className="w-56 rounded-full bg-red-600 px-10 py-4 text-lg font-semibold tracking-widest text-white shadow-sm transition-colors hover:bg-red-700"
        >
          DINNER
        </Link>
      </div>
    </div>
  );
}
