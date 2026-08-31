import Image from "next/image";
import type { Dish } from "@/lib/dish";
import type { CSSProperties } from "react";

export function DishCard({ dish }: { dish: Dish }) {
  const imageStyle: CSSProperties = {
    objectPosition: `${dish.focal_x * 100}% ${dish.focal_y * 100}%`,
    "--dish-zoom": dish.zoom,
    "--dish-rot": `${dish.rotation}deg`,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-xl font-normal text-neutral-900">
        {dish.name}
      </p>
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
        <p className="text-center text-sm text-neutral-500">{dish.description}</p>
      )}
    </div>
  );
}
