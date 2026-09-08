import type { Dish } from "@/lib/dish";

// 「menu-pages」カテゴリ専用の表示コンポーネント。他のカテゴリ(DishCard)と違い、
// 料理名・説明は表示せず、管理画面(/admin/menu-pages)に登録された画像
// (メニュー表の各ページ)を、切り抜きせず上から順にそのまま並べます。
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
