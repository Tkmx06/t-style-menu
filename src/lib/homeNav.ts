// MENU/LUNCHは以前、旧サイト(amour.pecori.jp)への外部リンクにしていましたが、
// 「おすすめ」写真(/menu/empfehlung)と同じ、この新しい編集画面(/admin)で
// 管理できるページに切り替えました。
// ・MENU: 正式なメニュー表の各ページ画像を上から順に並べた「menu-pages」カテゴリ
//   (/menu/menu-pages)。管理画面(/admin/menu-pages)から画像の追加・並べ替え・
//   削除ができます(2026-09-08、料理写真のカード一覧から切り替え)。
// ・LUNCH: 新設した「lunch」カテゴリ(/menu/lunch)。MENUと同じ編集画面
//   (/admin/lunch)からランチメニューを登録・編集できます。
export const TABS = [
  { label: "MENU", href: "/menu/menu-pages" },
  { label: "LUNCH", href: "/menu/lunch" },
  { label: "PHOTO", href: "/menu/empfehlung" },
];
