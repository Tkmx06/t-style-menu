// MENU/LUNCHは以前、旧サイト(amour.pecori.jp)への外部リンクにしていましたが、
// 「おすすめ」写真(/menu/empfehlung)と同じ、この新しい編集画面(/admin)で
// 管理できるページに切り替えました。
// ・Speisekarte: 以前は「MENU」タブとして/menu/menu-pagesに直接リンクしていましたが、
//   2026-09-08にLUNCH/DINNERをボタンで選ぶ選択画面(/menu)に変更しました。
//   選択画面から「LUNCH」(/menu/lunch)・「DINNER」(/menu/menu-pages)を選べます。
//   どちらも管理画面(/admin/lunch, /admin/menu-pages)から編集できます。
export const TABS = [
  { label: "Speisekarte", href: "/menu" },
  { label: "PHOTO", href: "/menu/empfehlung" },
];
