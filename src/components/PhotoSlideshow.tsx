"use client";

import Image from "next/image";
import Link from "next/link";
import type { Dish } from "@/lib/dish";
import { dishImageStyle } from "@/lib/dishImageStyle";

const WALL_COLUMNS = 5;
const TILES_PER_COLUMN = 5;
const COLUMN_DURATIONS = [34, 26, 30, 32, 28];

// 2026-09-15: 「元のサイトのスライドショーをもっとオシャレに」との要望を受け、
// 単純な横スライドのカルーセル(1枚ずつ切り替え+左右矢印)から、料理写真の壁が
// 5列で常に自動スクロールし続ける演出に変更しました(参考: jra-fun.jp/umajob の
// 「写真の壁」演出)。手動送りの矢印・ドットは不要になったため廃止しています。
// (当初は料理名の吹き出しも検討しましたが、不要とのことで採用していません。)
//
// データの取得元・件数・並び順(page.tsx側のgetSlideshowDishes、PHOTOタブに
// 入っているカテゴリーの写真のみをランダム抽出。MENUタブ側=lunch/menu-pages
// は含まない)や、コンポーネントのprops("dishes"のみ)は変更していません。
// 呼び出し側(page.tsx)の変更は不要です。
//
// 2026-09-15(続き): 写真の色が薄く見えるとの指摘を受け、白のグラデーション
// オーバーレイの不透明度を下げ、写真がより鮮やかに見えるようにしました。
// またキャプションの案内文言を、サイトの基本言語であるドイツ語に統一しました
// (見出し「Unsere Empfehlung」は元々ドイツ語)。
//
// 2026-09-15(さらに続き): それでもまだ色が薄く見えるとのことで、写真全体に
// かけていた白いグラデーションのオーバーレイを完全に廃止し、元の写真の色を
// そのまま表示するようにしました。下部キャプションは元々白背景のチップ
// (bg-white/90)自体で十分読めるため、可読性への影響はありません。
//
// 2026-09-15(さらに続き): キャプションの下段「Fotos antippen für mehr
// Empfehlungen」の案内文を削除し、見出し「Unsere Empfehlung」のみに整理。
// あわせて見出しのuppercase/字間広げ指定を外し、自然な大文字小文字表記に
// 変更しました。
function buildColumns(dishes: Dish[]): Dish[][] {
  const columns: Dish[][] = Array.from({ length: WALL_COLUMNS }, () => []);
  const needed = WALL_COLUMNS * TILES_PER_COLUMN;
  for (let i = 0; i < needed; i++) {
    columns[i % WALL_COLUMNS].push(dishes[i % dishes.length]);
  }
  return columns;
}

export function PhotoSlideshow({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) {
    return null;
  }

  const columns = buildColumns(dishes);

  return (
    <section className="relative bg-white">
      <Link
        href="/menu/empfehlung"
        className="group relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]"
      >
        <div className="absolute inset-0 flex gap-1 sm:gap-1.5">
          {columns.map((column, colIndex) => (
            <div
              key={colIndex}
              className={`relative min-w-0 flex-1 overflow-hidden ${
                colIndex === 3 ? "hidden sm:block" : ""
              } ${colIndex === 4 ? "hidden lg:block" : ""}`}
            >
              <div
                className="wall-track flex flex-col gap-1 sm:gap-1.5"
                style={{
                  animationDuration: `${COLUMN_DURATIONS[colIndex]}s`,
                  animationDirection: colIndex % 2 === 1 ? "reverse" : "normal",
                }}
              >
                {[...column, ...column].map((dish, i) => (
                  <div
                    key={`${dish.id}-${i}`}
                    className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-md sm:rounded-lg"
                  >
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      style={dishImageStyle(dish)}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-4 sm:bottom-6">
          <div className="rounded-2xl bg-white/90 px-5 py-2.5 text-center shadow-lg backdrop-blur-sm sm:px-7 sm:py-3">
            <p className="text-xs font-bold text-red-600 sm:text-sm">
              Unsere Empfehlung
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
