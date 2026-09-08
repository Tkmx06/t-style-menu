import { HomeHeader } from "@/components/HomeHeader";
import { PhotoSlideshow } from "@/components/PhotoSlideshow";
import { InstagramFeed } from "@/components/InstagramFeed";
import { HomeFooter } from "@/components/HomeFooter";
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient";
import type { Dish } from "@/lib/dish";

export const dynamic = "force-dynamic";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

async function getSlideshowDishes(): Promise<Dish[]> {
  const supabase = getPublicSupabaseClient();
  // スライドショーは「おすすめ」カテゴリーだけでなく、公開中の全メニュー写真を
  // 対象にランダムな順番で表示します。
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("status", "published");

  if (error) {
    // ホームページの表示自体は止めたくないので、失敗時は空配列にする
    // (スライドショーは非表示になるだけ)。
    console.error("Failed to load dishes for slideshow:", error.message);
    return [];
  }

  return shuffle((data ?? []) as Dish[]);
}

async function getInstagramPostIds(): Promise<string[]> {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("instagram_post_ids")
    .eq("id", "main")
    .maybeSingle();

  if (error || !data) {
    // 失敗してもホームページ自体は表示したいので、空配列にしてInstagramFeed側の
    // フォールバック(FALLBACK_POSTS)に任せます。
    console.error("Failed to load instagram post ids:", error?.message);
    return [];
  }

  return (data.instagram_post_ids ?? []) as string[];
}

export default async function Home() {
  const [dishes, instagramPostIds] = await Promise.all([
    getSlideshowDishes(),
    getInstagramPostIds(),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      <HomeHeader />
      <PhotoSlideshow dishes={dishes} />
      <InstagramFeed postIds={instagramPostIds} />
      {/*
        予約フォームをそのまま埋め込んでいます(restaurant-reservation-ebon.vercel.app)。
        旧ホームページ(amour.pecori.jp)の本文埋め込みは廃止しました。
      */}
      <iframe
        src="https://restaurant-reservation-ebon.vercel.app/reservation"
        title="ご予約"
        className="w-full flex-1 border-0"
        style={{ minHeight: "900px" }}
      />
      <HomeFooter />
    </div>
  );
}
