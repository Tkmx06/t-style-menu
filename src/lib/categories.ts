export type Category = {
  slug: string;
  label: string;
};

// 2026-09-08: MENUタブは「温かい料理・冷たい料理・サラダ…」という料理写真ベースの
// サブカテゴリ一覧をやめ、正式なメニュー表(PDF)の各ページをそのまま画像として
// 上から順に並べる「menu-pages」1本の縦スクロールページに統一しましたが、
// 同日中に「PHOTOページでも写真の背景の中から全カテゴリを選べるようにしたい」との
// 要望を受け、温かい料理・冷たい料理・サラダ等の元のカテゴリをこの一覧に復元しました
// (Supabase上のデータ自体は一度も削除しておらず、このCATEGORIES一覧から外していた
// だけなので、復元しても既存の写真・並び順・説明文はそのまま使えます)。
export const CATEGORIES: Category[] = [
  { slug: "empfehlung", label: "Unsere Empfehlung" },
  { slug: "lunch", label: "Lunch" },
  { slug: "warme-gerichte", label: "Warme Gerichte" },
  { slug: "kalte-gerichte", label: "Kalte Gerichte" },
  { slug: "salate", label: "Salate" },
  { slug: "fleischspeisen", label: "Fleischspeisen" },
  { slug: "tempura", label: "Tempura" },
  { slug: "fischspeisen", label: "Fischspeisen" },
  { slug: "reisgerichte", label: "Reisgerichte" },
  { slug: "sushi-sashimi", label: "Sushi und Sashimi" },
  { slug: "nudeln", label: "Nudeln" },
  { slug: "dessert", label: "Dessert" },
  { slug: "menu-pages", label: "Dinner" },
];

// PHOTOページ(/menu/[category])の背景ヒーロー内に並べる、料理写真ベースの
// カテゴリ選択ボタン用の一覧です。Lunch(独立したLUNCHボタンから遷移)と
// menu-pages(正式なメニュー表PDFのページ画像、料理写真ではない)はここには含めません。
export const PHOTO_CATEGORIES: Category[] = CATEGORIES.filter(
  (c) => c.slug !== "lunch" && c.slug !== "menu-pages",
);

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}
