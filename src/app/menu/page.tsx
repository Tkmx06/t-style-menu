import Link from "next/link";

export const dynamic = "force-static";

// 黒いタブバーの「Speisekarte」から遷移する選択画面。
// LUNCH(/menu/lunch)とDINNER(/menu/menu-pages、正式なメニュー表)を
// ボタンで選べるようにしています(2026-09-08、旧「MENU」タブを置き換え)。
// 以前はここから最初のカテゴリ(CATEGORIES[0])へリダイレクトしていましたが、
// LUNCH/DINNERを選ぶ画面に変更しました。
export default function MenuIndexPage() {
  return (
    <div className="flex flex-col items-center gap-10 py-8 text-center">
      <h1 className="font-script text-5xl text-neutral-800">Speisekarte</h1>
      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          href="/menu/lunch"
          className="w-56 rounded-full bg-neutral-900 px-10 py-4 text-lg font-semibold tracking-widest text-white shadow-sm transition-colors hover:bg-neutral-700"
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
