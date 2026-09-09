"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { categoryLabel } from "@/lib/categories";
import type { Dish } from "@/lib/dish";
import { readJsonResponse } from "@/lib/fetchJson";

export default function ArchivePage() {
  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/archive");
    try {
      const body = await readJsonResponse<{ dishes?: Dish[] }>(res);
      setDishes(body.dishes ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み込みに失敗しました。");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- マウント時に一覧データを取得するための意図的な呼び出しです
    load();
  }, []);

  async function handleRestore(id: string) {
    setBusyId(id);
    await fetch(`/api/admin/dishes/${id}/restore`, { method: "POST" });
    setDishes((prev) => prev?.filter((d) => d.id !== id) ?? prev);
    setBusyId(null);
  }

  // 2026-09-09: 「復元ボタンしかないので削除ボタンも追加してほしい」との要望への対応。
  // こちらは元に戻せない完全削除のため、誤操作防止にconfirm()で一度確認しています。
  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`「${name}」を完全に削除します。この操作は元に戻せません。よろしいですか？`)) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
      const body = await readJsonResponse<{ error?: string }>(res);
      if (!res.ok) {
        throw new Error(body.error ?? "削除に失敗しました。");
      }
      setDishes((prev) => prev?.filter((d) => d.id !== id) ?? prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : "削除に失敗しました。");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-semibold">過去のメニュー</h1>
      <p className="mb-8 text-center text-sm text-neutral-500">
        削除した料理はここに記憶されます。「復元する」を押すと、そのカテゴリの一覧に再度表示されます。「削除する」を押すと、写真ごと完全に削除され元に戻せません。
      </p>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}
      {!dishes ? (
        error ? null : <p className="text-neutral-500">読み込み中…</p>
      ) : dishes.length === 0 ? (
        <p className="text-center text-neutral-500">過去のメニューはまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <div key={dish.id} className="flex flex-col gap-2">
              <p className="text-center text-xs text-neutral-500">{categoryLabel(dish.category)}</p>
              <p className="text-center text-base font-semibold">{dish.name}</p>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
                <Image src={dish.image_url} alt={dish.name} fill sizes="400px" className="object-cover" />
              </div>
              {dish.description && (
                <p className="text-center text-sm text-neutral-400">{dish.description}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busyId === dish.id}
                  onClick={() => handleRestore(dish.id)}
                  className="flex-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {busyId === dish.id ? "処理中…" : "復元する"}
                </button>
                <button
                  type="button"
                  disabled={busyId === dish.id}
                  onClick={() => handleDelete(dish.id, dish.name)}
                  className="flex-1 rounded border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                >
                  {busyId === dish.id ? "処理中…" : "削除する"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
