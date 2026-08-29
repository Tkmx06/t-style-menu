import Image from "next/image";
import type { Dish } from "@/lib/dish";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-heading text-center text-lg font-semibold text-neutral-900">
        {dish.name}
      </p>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm">
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      {dish.description && (
        <p className="text-center text-sm text-neutral-500">{dish.description}</p>
      )}
    </div>
  );
}
