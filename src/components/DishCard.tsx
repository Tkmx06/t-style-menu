import Image from "next/image";
import type { Dish } from "@/lib/dish";

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-center text-lg font-semibold">{dish.name}</p>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-900">
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover"
        />
      </div>
      {dish.description && (
        <p className="text-center text-sm text-neutral-400">{dish.description}</p>
      )}
    </div>
  );
}
