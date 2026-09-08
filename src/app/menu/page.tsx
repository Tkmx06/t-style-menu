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
// 変更しました。
//
// 2026-09-08(続き): 「Speisekarteの白文字を消して、その分もう少し写真を広く使って
// 元の写真の全体を表示してほしい」との要望で、見出し文字と黒い半透明レイヤーを廃止し、
// コンテナの縦横比を元の写真(1599x861)と同じ比率にして、写真が一切トリミングされずに
// そのまま全体表示されるようにしました。ボタン自体が白/赤の不透明に近い背景を
// 持っているため、オーバーレイが無くても読みやすさは保たれます。
export default function MenuIndexPage() {
  return (
    <div className="relative flex min-h-[240px] aspect-[1599/861] flex-col items-center justify-center gap-8 overflow-hidden rounded-2xl px-4 py-10 text-center sm:min-h-0">
      <Image
        src="/hero-banner.jpg"
        alt="t-style Gerichte"
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        priority
        className="object-cover"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row">
        <Link
          href="/menu/lunch"
          className="w-56 rounded-full bg-white/95 px-10 py-4 text-lg font-semibold tracking-widest text-neutral-900 shadow-md backdrop-blur transition-colors hover:bg-white"
        >
          LUNCH
        </Link>
        <Link
          href="/menu/menu-pages"
          className="w-56 rounded-full bg-red-600 px-10 py-4 text-lg font-semibold tracking-widest text-white shadow-md transition-colors hover:bg-red-700"
        >
          DINNER
        </Link>
      </div>
    </div>
  );
}
