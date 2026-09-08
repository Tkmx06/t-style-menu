import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, PHOTO_CATEGORIES, categoryLabel } from "@/lib/categories";
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient";
import type { Dish } from "@/lib/dish";
import { DishCard } from "@/components/DishCard";
import { MenuPagesGallery } from "@/components/MenuPagesGallery";

export const dynamic = "force-dynamic";

const MENU_PAGES_SLUG = "menu-pages";

export default async function CategoryPage(
  props: PageProps<"/menu/[category]">,
) {
  const { category } = await props.params;

  if (!CATEGORIES.some((c) => c.slug === category)) {
    notFound();
  }

  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("category", category)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const dishes = (data ?? []) as Dish[];

  // MENUタブ(menu-pages)は、料理写真のカード一覧ではなく、正式なメニュー表の
  // 各ページ画像を上から順にそのまま並べる専用レイアウトを使います。
  if (category === MENU_PAGES_SLUG) {
    return (
      <div>
        <h1 className="font-script mb-8 text-center text-5xl text-neutral-800">
          {categoryLabel(category)}
        </h1>
        {dishes.length === 0 ? (
          <p className="text-center text-neutral-500">
            まだメニュー表のページが登録されていません。
          </p>
        ) : (
          <MenuPagesGallery dishes={dishes} />
        )}
      </div>
    );
  }

  const isPhotoCategory = PHOTO_CATEGORIES.some((c) => c.slug === category);

  // 2026-09-08: 「PHOTOページも、MENUページと同じように背景を写真にして、
  // その中で全てのカテゴリ(Unsere Empfehlung・温かい料理・冷たい料理…計71品)を
  // 選べるようにしたい」との要望で、PHOTOページ(/menu/[category]のうち
  // Lunch・menu-pagesを除いたカテゴリ群)の一番上に、写真を背景にした見出し+
  // カテゴリ選択ボタンのヒーローセクションを追加しました。ページを開いた時点の
  // カテゴリ(初期設定ではUnsere Empfehlung=/menu/empfehlung)の料理写真を
  // ヒーローの下に一覧表示します。
  if (isPhotoCategory) {
    return (
      <div>
        <div className="relative mb-10 flex min-h-[380px] flex-col items-center justify-center gap-8 overflow-hidden rounded-2xl px-4 py-14 text-center sm:min-h-[440px]">
          <Image
            src="/hero-banner.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />

          <h1 className="relative font-script text-5xl text-white drop-shadow-md">
            {categoryLabel(category)}
          </h1>
          <div className="relative flex flex-wrap justify-center gap-2 px-2">
            {PHOTO_CATEGORIES.map((c) => {
              const isActive = c.slug === category;
              return (
                <Link
                  key={c.slug}
                  href={`/menu/${c.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wide shadow-sm transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-white/90 text-neutral-900 backdrop-blur hover:bg-white"
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {dishes.length === 0 ? (
          <p className="text-neutral-500">まだ料理が登録されていません。</p>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Lunch(MENUページのLUNCHボタンから遷移)は、PHOTOページのカテゴリ選択には
  // 含めないため、これまで通りシンプルな見出し+一覧のみのレイアウトです。
  return (
    <div>
      <h1 className="font-script mb-8 text-center text-5xl text-neutral-800">
        {categoryLabel(category)}
      </h1>
      {dishes.length === 0 ? (
        <p className="text-neutral-500">まだ料理が登録されていません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
}
