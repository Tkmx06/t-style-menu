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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/85 via-white/10 to-white/90" />

        <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center px-4 sm:bottom-6">
          <div className="rounded-2xl bg-white/90 px-5 py-2.5 text-center shadow-lg backdrop-blur-sm sm:px-7 sm:py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-600 sm:text-xs">
              Unsere Empfehlung
            </p>
            <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
              写真をタップして、おすすめ一覧へ
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
