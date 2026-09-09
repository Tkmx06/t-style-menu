import type { Dish } from "@/lib/dish";

// 「menu-pages」(DINNER)と「lunch」(LUNCH)カテゴリ共通の表示コンポーネント。
// 他のカテゴリ(DishCard)と違い、料理名・説明は表示せず、管理画面
// (/admin/menu-pages, /admin/lunch)に登録された画像を、切り抜きせず上から
// 順にそのまま並べます(2026-09-09: 「LUNCHもDINNERと全く同じ仕様にしたい」
// との指摘を受け、lunchでも共通利用するように変更)。
//
// 画像は管理者が自由な縦横比の写真をアップロードできるため、next/image の
// width/height 固定ではなく、素の <img> + h-auto でブラウザに実際の縦横比を
// 使わせています(引き伸ばし・不要な切り抜きを防ぐため)。
export function MenuPagesGallery({ dishes }: { dishes: Dish[] }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dish.image_url} alt={dish.name} className="block h-auto w-full" />
        </div>
      ))}
    </div>
  );
}
