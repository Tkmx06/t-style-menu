"use client";

import Image from "next/image";
import type { Dish } from "@/lib/dish";
import { dishImageStyle } from "@/lib/dishImageStyle";

export function DishListView({
  dishes,
  onReorder,
  onArchive,
  onEdit,
}: {
  dishes: Dish[];
  onReorder: (id: string, direction: "up" | "down") => void;
  onArchive: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {dishes.map((dish, i) => (
        <div
          key={dish.id}
          className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-neutral-100">
            <Image
              src={dish.image_url}
              alt={dish.name}
              fill
              sizes="64px"
              style={dishImageStyle(dish)}
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{dish.name}</p>
            {dish.description && (
              <p className="truncate text-xs text-neutral-500">{dish.description}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => onReorder(dish.id, "up")}
              aria-label="前に移動"
              className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-sm text-neutral-600 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={i === dishes.length - 1}
              onClick={() => onReorder(dish.id, "down")}
              aria-label="後に移動"
              className="flex h-7 w-7 items-center justify-center rounded border border-neutral-300 text-sm text-neutral-600 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => onEdit(dish.id)}
              className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => onArchive(dish.id)}
              className="rounded border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
