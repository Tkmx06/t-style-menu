import Image from "next/image";
import type { Dish } from "@/lib/dish";
import type { CSSProperties } from "react";

export function DishCard({
  dish,
  showName = true,
}: {
  dish: Dish;
  // LUNCH(2026-09-09〜)はDINNER(正式メニュー表)と同じく、写真そのものが
  // 情報であり個々の料理名を管理・表示する対象ではないため、名前ラベルの
  // 表示を省略できるようにしています。
  showName?: boolean;
}) {
  const imageStyle: CSSProperties = {
    transformOrigin: `${dish.focal_x * 100}% ${dish.focal_y * 100}%`,
    "--dish-zoom": dish.zoom,
    "--dish-rot": `${dish.rotation}deg`,
  } as CSSProperties;

  return (
    <div className="flex flex-col">
      {showName && (
        <p className="font-heading mb-1.5 text-center text-2xl font-light uppercase tracking-[0.15em] text-neutral-900">
          {dish.name}
        </p>
      )}
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          style={imageStyle}
          className="rotate-[var(--dish-rot)] scale-[var(--dish-zoom)] object-cover transition-transform duration-500 group-hover:scale-[calc(var(--dish-zoom)*1.05)]"
        />
      </div>
      {dish.description && (
        <p className="font-heading mt-3 text-center text-base font-light text-neutral-500">
          {dish.description}
        </p>
      )}
    </div>
  );
}
