// MENU/LUNCHは以前、旧サイト(amour.pecori.jp)への外部リンクにしていましたが、
// 「おすすめ」写真(/menu/empfehlung)と同じ、この新しい編集画面(/admin)で
// 管理できるページに切り替えました。
// ・MENU: 温かい料理などの各カテゴリ一覧(/menu以下)。最初のカテゴリは
//   「おすすめ」ではなく「warme-gerichte」から始まるようにしています
//   (「おすすめ」はPHOTOタブの役割のため)。
// ・LUNCH: 新設した「lunch」カテゴリ(/menu/lunch)。MENUと同じ編集画面
//   (/admin/lunch)からランチメニューを登録・編集できます。
export const TABS = [
  { label: "MENU", href: "/menu/warme-gerichte" },
  { label: "LUNCH", href: "/menu/lunch" },
  { label: "PHOTO", href: "/menu/empfehlung" },
];
