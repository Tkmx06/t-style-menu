"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { categoryLabel } from "@/lib/categories";
import type { Dish } from "@/lib/dish";

export default function ArchivePage() {
  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/archive");
    const body = await res.json();
    setDishes(body.dishes ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRestore(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/dishes/${id}/restore`, { method: "POST" });
    setDishes((prev) => prev?.filter((d) => d.id !== id) ?? prev);
    setBusyId(null);
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-semibold">過去のメニュー</h1>
      <p className="mb-8 text-center text-sm text-neutral-500">
        削除した料理はここに記憶されます。「復元」を押すと、そのカテゴリの一覧に再度表示されます。
      </p>
      {!dishes ? (
        <p className="text-neutral-500">読み込み中…</p>
      ) : dishes.length === 0 ? (
        <p className="text-center text-neutral-500">過去のメニューはまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div key={dish.id} className="flex flex-col gap-2">
              <p className="text-center text-xs text-neutral-500">{categoryLabel(dish.category)}</p>
              <p className="text-center text-base font-semibold">{dish.name}</p>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-neutral-100">
                <Image src={dish.image_url} alt={dish.name} fill sizes="400px" className="object-cover" />
              </div>
              {dish.description && (
                <p className="text-center text-sm text-neutral-400">{dish.description}</p>
              )}
              <button
                type="button"
                disabled={busyId === dish.id}
                onClick={() => handleRestore(dish.id)}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {busyId === dish.id ? "復元中…" : "復元する"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
