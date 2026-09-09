"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { notFound } from "next/navigation";
import type { Dish } from "@/lib/dish";
import { DishEditCard } from "@/components/admin/DishEditCard";
import { AddDishCard } from "@/components/admin/AddDishCard";
import { DishListView } from "@/components/admin/DishListView";

type ViewMode = "card" | "list";

export default function AdminCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;
  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isValidCategory = CATEGORIES.some((c) => c.slug === category);

  async function load() {
    const res = await fetch(`/api/admin/dishes?category=${category}`);
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "読み込みに失敗しました。");
      return;
    }
    setDishes(body.dishes);
  }

  useEffect(() => {
    if (isValidCategory) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  if (!isValidCategory) {
    notFound();
  }

  async function handleArchive(id: string) {
    setDishes((prev) => prev?.filter((d) => d.id !== id) ?? prev);
    await fetch(`/api/admin/dishes/${id}/archive`, { method: "POST" });
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    await fetch("/api/admin/dishes/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, direction }),
    });
    load();
  }

  // 2026-09-09: 以前はres.json()の失敗(res.okかどうかのチェックより先に実行)や
  // fetch自体の失敗をここで無視していたため、アップロードが失敗しても呼び出し元
  // (DishEditCard)には何も伝わらず、「処理中…」の表示だけが残ってしまう不具合が
  // ありました。エラーを例外としてthrowし、呼び出し元でtry/catch/finallyにより
  // 必ず処理中表示が解除され、エラーメッセージが表示されるようにしています。
  async function handlePhotoChange(id: string, file: File) {
    const formData = new FormData();
    formData.set("photo", file);
    let res: Response;
    try {
      res = await fetch(`/api/admin/dishes/${id}/photo`, {
        method: "POST",
        body: formData,
      });
    } catch {
      throw new Error("通信に失敗しました。電波の良い場所でもう一度お試しください。");
    }

    let body: { dish?: Dish; error?: string };
    try {
      body = await res.json();
    } catch {
      throw new Error(
        res.status === 413
          ? "写真のファイルサイズが大きすぎます。もう一度お試しください。"
          : "写真の変更に失敗しました。もう一度お試しください。",
      );
    }

    if (!res.ok || !body.dish) {
      throw new Error(body.error ?? "写真の変更に失敗しました。");
    }

    const updatedDish = body.dish;
    setDishes((prev) => prev?.map((d) => (d.id === id ? updatedDish : d)) ?? prev);
  }

  async function handleFieldSave(id: string, field: "name" | "description", value: string) {
    const res = await fetch(`/api/admin/dishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    const body = await res.json();
    if (res.ok) {
      setDishes((prev) => prev?.map((d) => (d.id === id ? body.dish : d)) ?? prev);
    }
  }

  async function handlePhotoAdjust(
    id: string,
    focalX: number,
    focalY: number,
    zoom: number,
    rotation: number,
  ) {
    const res = await fetch(`/api/admin/dishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ focal_x: focalX, focal_y: focalY, zoom, rotation }),
    });
    const body = await res.json();
    if (res.ok) {
      setDishes((prev) => prev?.map((d) => (d.id === id ? body.dish : d)) ?? prev);
    }
  }

  async function handleAdd(formData: FormData) {
    const res = await fetch("/api/admin/dishes", { method: "POST", body: formData });
    let body: { dish?: Dish; error?: string };
    try {
      body = await res.json();
    } catch {
      throw new Error(
        res.status === 413
          ? "写真のファイルサイズが大きすぎます。もう一度お試しください。"
          : "登録に失敗しました。もう一度お試しください。",
      );
    }
    if (!res.ok || !body.dish) throw new Error(body.error ?? "登録に失敗しました。");
    const newDish = body.dish;
    setDishes((prev) => [...(prev ?? []), newDish]);
  }

  function handleEditFromList(id: string) {
    setViewMode("card");
    // カード表示に切り替わってDOMが描画された後にスクロールする
    requestAnimationFrame(() => {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <div>
      <h1 className="mb-4 text-center text-2xl font-semibold">{categoryLabel(category)}</h1>

      <div className="mb-6 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className={`rounded px-3 py-1.5 text-sm font-medium ${
            viewMode === "list"
              ? "bg-neutral-900 text-white"
              : "border border-neutral-300 text-neutral-600"
          }`}
        >
          一覧表示
        </button>
        <button
          type="button"
          onClick={() => setViewMode("card")}
          className={`rounded px-3 py-1.5 text-sm font-medium ${
            viewMode === "card"
              ? "bg-neutral-900 text-white"
              : "border border-neutral-300 text-neutral-600"
          }`}
        >
          カード表示
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {!dishes ? (
        <p className="text-neutral-500">読み込み中…</p>
      ) : viewMode === "list" ? (
        <>
          <DishListView
            dishes={dishes}
            onReorder={handleReorder}
            onArchive={handleArchive}
            onEdit={handleEditFromList}
          />
          <div className="mt-4">
            <AddDishCard category={category} onAdd={handleAdd} />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <div key={dish.id} ref={(el) => { cardRefs.current[dish.id] = el; }}>
              <DishEditCard
                dish={dish}
                isFirst={i === 0}
                isLast={i === dishes.length - 1}
                onArchive={handleArchive}
                onReorder={handleReorder}
                onPhotoChange={handlePhotoChange}
                onFieldSave={handleFieldSave}
                onPhotoAdjust={handlePhotoAdjust}
              />
            </div>
          ))}
          <AddDishCard category={category} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
