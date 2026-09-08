"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dish } from "@/lib/dish";
import { dishImageStyle } from "@/lib/dishImageStyle";

const INTERVAL_MS = 4000;

// 2026-09-08: 「写真の下の丸いインジケーター(料理の数だけ、20個くらい)は不要。
// 代わりに左右に矢印をつけて、押すとすぐに横スライドで写真が切り替わるように
// してほしい」との要望で、ドットのページネーションを廃止し、左右の矢印ボタンで
// 手動送りできるカルーセルに変更しました。矢印は「次の写真へのリンク」ではなく
// 「同じページ内で表示を切り替えるボタン」なので、写真本体のリンク(/menu/empfehlung)
// とは別のクリック領域として、Linkの外(兄弟要素)に配置しています。
// 自動再生(4秒ごとの切り替え)はそのまま残しています。
export function PhotoSlideshow({ dishes }: { dishes: Dish[] }) {
  const [index, setIndex] = useState(0);
  const count = dishes.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) {
    return null;
  }

  function goTo(next: number) {
    setIndex(((next % count) + count) % count);
  }

  return (
    <section className="relative bg-neutral-950">
      <Link
        href="/menu/empfehlung"
        className="group relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[16/7]"
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {dishes.map((dish, i) => (
            <div key={dish.id} className="relative h-full w-full shrink-0">
              <Image
                src={dish.image_url}
                alt={dish.name}
                fill
                sizes="100vw"
                priority={i === 0}
                style={dishImageStyle(dish)}
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 sm:px-8 sm:pb-6">
                <p className="font-heading text-center text-lg font-light uppercase tracking-[0.15em] text-white sm:text-xl">
                  {dish.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Link>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              goTo(index - 1);
            }}
            aria-label="前の写真"
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:left-4 sm:h-11 sm:w-11"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              goTo(index + 1);
            }}
            aria-label="次の写真"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-4 sm:h-11 sm:w-11"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}
