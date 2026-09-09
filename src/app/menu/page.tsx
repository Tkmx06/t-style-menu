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
//
// 2026-09-08(続き): 「トリミングなしのまま、上の黒いバー(HOME/MENU/PHOTO)の
// 右端とこの写真の右端を揃えてほしい」との要望で対応しました。原因は、このページの
// 親コンテナ(src/app/menu/layout.tsxのmain)にpx-4の左右余白があるのに対し、
// 黒いバー(TabBar)にはその余白が無く画面幅いっぱいに表示されていたため、写真だけ
// 左右16pxずつ内側にずれて見えていたことです。-mx-4で親のpx-4を打ち消して写真を
// 画面幅いっぱいに広げ(角丸も見た目が揃うよう廃止)、ボタン部分は元通りpx-4で
// 内側に余白を保つようにしています。
//
// 2026-09-08(続き): 「PCでは綺麗になったが、iPhoneで見ると写真が右にはみ出す」との
// 指摘を受けて対応しました。原因はmin-h-[240px](画面が狭い時に写真が短くなりすぎない
// ようにする下限の高さ)とaspect-[1599/861]の組み合わせです。画面幅が狭く
// (目安436px未満)、アスペクト比通りの高さがmin-height(240px)を下回る場合、
// ブラウザはmin-heightを優先して高さを240pxに固定した上で、アスペクト比を保つために
// 「幅」の方を240px基準で逆算して広げてしまい、その分だけ写真が画面右端から
// はみ出していました(PCでは画面が広くアスペクト比通りの高さが240pxを超えるため
// min-heightが効かず、問題が起きていませんでした)。トリミングなし表示を保ったまま
// はみ出しを防ぐため、min-heightを廃止し、常にアスペクト比だけで高さを決めるように
// しました(画面が狭い時は写真の高さも比例して低くなりますが、はみ出しよりも優先しています)。
export default function MenuIndexPage() {
  return (
    <div className="relative -mx-4 flex aspect-[1599/861] flex-col items-center justify-center gap-8 overflow-hidden px-4 py-10 text-center">
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
