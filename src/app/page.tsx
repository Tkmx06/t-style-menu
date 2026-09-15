import { HomeHeader } from "@/components/HomeHeader";
import { PhotoSlideshow } from "@/components/PhotoSlideshow";
import { InstagramFeed } from "@/components/InstagramFeed";
import { HomeFooter } from "@/components/HomeFooter";
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient";
import type { Dish } from "@/lib/dish";
import { PHOTO_CATEGORIES } from "@/lib/categories";

// 2026-09-16: 「PHOTOタブ/『Unsere Empfehlung』ボタンを押しても反応がない」との
// 報告を調査した結果、force-dynamic(アクセスのたびに毎回Supabaseへ問い合わせる)
// になっていたことが原因の一端と判明。ホームページ自体に加え、上部タブバーや
// 写真の壁からのリンク遷移先(/menu/empfehlung)への遷移時にも同時にSupabaseへの
// 問い合わせが複数走り、Vercel(Hobbyプラン)のサーバー関数が混雑して503エラーに
// なることがあった。revalidate(30秒キャッシュ)に変更し、同時リクエストの大半を
// キャッシュから返すようにして混雑を減らす。管理画面での編集が公開側に反映される
// までに最大30秒程度のタイムラグが生じるようになったが、頻繁に更新する運用では
// ないため許容範囲と判断。
export const revalidate = 30;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 2026-09-15: 巻き寿司(かっぱ巻き・海老天巻き・カリフォルニアロールなど、
// 料理名が「maki」で終わる品)はホームのスライドショーには表示しないでほしい
// との要望を受けました。巻き寿司専用のカテゴリーは無く、他のお寿司・お刺身と
// 同じ「sushi-sashimi」カテゴリーに含まれているため、カテゴリー単位ではなく
// 料理名の末尾が「maki」かどうかで判定して除外しています
// (現状の巻き寿司は全て英語名が「〜maki」で終わる命名になっています)。
function isMakizushi(dish: Dish): boolean {
  return dish.name.trim().toLowerCase().endsWith("maki");
}

async function getSlideshowDishes(): Promise<Dish[]> {
  const supabase = getPublicSupabaseClient();
  // 2026-09-15: スライドショーに表示する写真は、PHOTOタブ配下のカテゴリー
  // (PHOTO_CATEGORIES = CATEGORIES から「lunch」「menu-pages」を除いたもの)に
  // 限定しました。「lunch」(MENUタブのLUNCHページ)と「menu-pages」(MENUタブの
  // 正式なメニュー表PDFページ画像)はMENU側のコンテンツなので、ホームの写真の壁には
  // 含めません。カテゴリーの追加・変更はlib/categories.tsのPHOTO_CATEGORIESに
  // 自動追従します。
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("status", "published")
    .in(
      "category",
      PHOTO_CATEGORIES.map((c) => c.slug),
    );

  if (error) {
    // ホームページの表示自体は止めたくないので、失敗時は空配列にする
    // (スライドショーは非表示になるだけ)。
    console.error("Failed to load dishes for slideshow:", error.message);
    return [];
  }

  const dishes = ((data ?? []) as Dish[]).filter((dish) => !isMakizushi(dish));

  return shuffle(dishes);
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

        2026-09-08: 「予約フォームに触ると上下にスライドしてしまい、ページ全体を
        スクロールできない」との指摘を受けて対応しました。原因は、埋め込み先の
        予約アプリの実際のコンテンツの高さ(実測で約898px)がiframeのminHeight
        (900px)にほぼ一致していたため、わずかな誤差でもiframe内部に隙間なく
        スクロール余地が生まれ、スマホでのタッチスワイプがページ全体ではなく
        iframe内部のスクロールとして処理されてしまっていたことです。
        余裕を持ってminHeightを増やし、念のためiframe自体のスクロールを
        scrolling="no"で無効化して、iframe内部が動かないようにしました。
      */}
      <iframe
        src="https://reservation.t-style-de.com/reservation"
        title="ご予約"
        className="w-full flex-1 border-0"
        style={{ minHeight: "1050px" }}
        scrolling="no"
      />
      <HomeFooter />
    </div>
  );
}
