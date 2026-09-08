// ホーム画面・/menu以下の全ページで共通の黒いタブバー(HomeHeader/TabBar)に
// 表示するタブです。2026-09-08にHOMEを追加し、ラベルを「Speisekarte」から
// 「MENU」に戻しました(「HOME MENU PHOTO」の3つで統一)。
// ・HOME: トップページ(/)
// ・MENU: LUNCH/DINNERをボタンで選ぶ選択画面(/menu)。選択画面から
//   「LUNCH」(/menu/lunch)・「DINNER」(/menu/menu-pages、正式なメニュー表)を
//   選べます。どちらも管理画面(/admin/lunch, /admin/menu-pages)から編集できます。
// ・PHOTO: 「おすすめ」写真一覧(/menu/empfehlung)。管理画面(/admin/empfehlung)から
//   編集できます。
export const TABS = [
  { label: "HOME", href: "/" },
  { label: "MENU", href: "/menu" },
  { label: "PHOTO", href: "/menu/empfehlung" },
];
