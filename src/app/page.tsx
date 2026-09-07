import { HomeHeader } from "@/components/HomeHeader";
import { PhotoSlideshow } from "@/components/PhotoSlideshow";
import { InstagramFeed } from "@/components/InstagramFeed";
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient";
import type { Dish } from "@/lib/dish";

export const dynamic = "force-dynamic";

async function getEmpfehlungDishes(): Promise<Dish[]> {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("category", "empfehlung")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    // ホームページの表示自体は止めたくないので、失敗時は空配列にする
    // (スライドショーは非表示になるだけ)。
    console.error("Failed to load empfehlung dishes for slideshow:", error.message);
    return [];
  }

  return (data ?? []) as Dish[];
}

export default async function Home() {
  const dishes = await getEmpfehlungDishes();

  return (
    <div className="flex min-h-full flex-col">
      <HomeHeader />
      <PhotoSlideshow dishes={dishes} />
      <InstagramFeed />
      {/*
        下の本文は、これまで通り旧ホームページ(amour.pecori.jp)をそのまま
        表示しています(next.config.ts の /legacy-home リライト経由)。
        ヘッダー・スライドショーだけを新しくして、本文の作り直しは次の
        ステップで行う想定です。
      */}
      <iframe
        src="/legacy-home"
        title="t-style ホーム"
        className="w-full flex-1 border-0"
        style={{ minHeight: "1400px" }}
      />
    </div>
  );
}
