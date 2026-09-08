export type Category = {
  slug: string;
  label: string;
};

// 2026-09-08: MENUタブは「温かい料理・冷たい料理・サラダ…」という料理写真ベースの
// サブカテゴリ一覧をやめ、正式なメニュー表(PDF)の各ページをそのまま画像として
// 上から順に並べる「menu-pages」1本の縦スクロールページに統一しました
// (「おすすめ(empfehlung)」の管理画面と同じ操作感で、写真の追加・並べ替え・削除ができます)。
// 元々あった温かい料理・サラダ等のカテゴリに登録されていた料理写真データは
// Supabase上にはそのまま残していますが(削除はしていません)、このCATEGORIES一覧
// から外れているため、現在は管理画面・公開ページのどちらにも表示されません。
// 将来また料理写真ベースの一覧に戻したくなった場合は、該当のカテゴリをこの配列に
// 追加し直せば復元できます。
export const CATEGORIES: Category[] = [
  { slug: "empfehlung", label: "Unsere Empfehlung" },
  { slug: "lunch", label: "Lunch" },
  { slug: "menu-pages", label: "Dinner" },
];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
