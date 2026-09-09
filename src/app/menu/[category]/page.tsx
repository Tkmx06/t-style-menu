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
  //
  // 2026-09-09: 「LUNCHもDINNER(正式メニュー表)と全く同じ仕様にしてほしい。
  // 今のLUNCHはサイズ・向きに関わらず写真がトリミングされてしまう」との指摘を
  // 受け、DishCardのカード一覧(4:3にトリミングして表示)をやめ、lunchも
  // menu-pagesと同じMenuPagesGallery(トリミングせず元の縦横比のまま上から
  // 順に並べる)を使うようにしました。見出しはcategoryLabel(category)が
  // カテゴリごとに「Dinner」「Lunch」を自動で出し分けるため、これだけで
  // 見出しの文字も正しく切り替わります。中身(登録内容)は既存のまま、
  // 表示レイアウトだけをDINNERと共通化しています。
  const isGalleryCategory = category === MENU_PAGES_SLUG || category === "lunch";
  if (isGalleryCategory) {
    return (
      <div>
        <h1 className="font-script mb-8 text-center text-5xl text-neutral-800">
          {categoryLabel(category)}
        </h1>
        {dishes.length === 0 ? (
          <p className="text-center text-neutral-500">
            まだ写真が登録されていません。
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
  //
  // 2026-09-08(続き): 「Unsere Empfehlungの白文字を消して、その分もう少し写真を
  // 広く使って元の写真の全体を表示してほしい」との要望で、見出し文字と黒い半透明
  // レイヤーを廃止し、コンテナの縦横比を元の写真(1599x861)と同じ比率にして、
  // 写真が一切トリミングされずにそのまま全体表示されるようにしました(MENUページと
  // 同じ考え方)。カテゴリ選択ボタンは11個あり折り返すため、モバイル時の最低高さは
  // MENUページより少し高めにしています。
  //
  // 2026-09-08(続き): 「トリミングなしのまま、上の黒いバーの右端とこの写真の右端を
  // 揃えてほしい」との要望で、MENUページと同じ理由・同じ方法(-mx-4で親のpx-4を
  // 打ち消して画面幅いっぱいに表示、角丸は廃止)で対応しました。
  //
  // 2026-09-08(続き): 「PCでは綺麗になったが、iPhoneで見ると写真が右にはみ出す」との
  // 指摘を受け、MENUページと同じ原因(min-heightとaspect-ratioの組み合わせで、画面が
  // 狭い時にブラウザが幅の方をmin-height基準で逆算して広げてしまう挙動)だったため、
  // 同じ対処としてmin-heightを廃止し、常にアスペクト比だけで高さを決めるようにしました。
  if (isPhotoCategory) {
    return (
      <div>
        <div className="relative -mx-4 mb-10 flex aspect-[1599/861] flex-col items-center justify-center gap-6 overflow-hidden px-4 py-10 text-center">
          <Image
            src="/hero-banner.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
            className="object-cover"
          />

          <div className="relative flex flex-wrap justify-center gap-2 px-2">
            {PHOTO_CATEGORIES.map((c) => {
              const isActive = c.slug === category;
              return (
                <Link
                  key={c.slug}
                  href={`/menu/${c.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wide shadow-md transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-white/95 text-neutral-900 backdrop-blur hover:bg-white"
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

  // menu-pages・lunch・PHOTO_CATEGORIESの3グループで全カテゴリを網羅しているため、
  // ここには到達しませんが、型のためにフォールバックを残しています。
  notFound();
}
