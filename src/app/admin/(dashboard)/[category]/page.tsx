"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CATEGORIES, categoryLabel } from "@/lib/categories";
import { notFound } from "next/navigation";
import type { Dish } from "@/lib/dish";
import { DishEditCard } from "@/components/admin/DishEditCard";
import { AddDishCard } from "@/components/admin/AddDishCard";

export default function AdminCategoryPage() {
  const params = useParams<{ category: string }>();
  const category = params.category;
  const [dishes, setDishes] = useState<Dish[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function handlePhotoChange(id: string, file: File) {
    const formData = new FormData();
    formData.set("photo", file);
    const res = await fetch(`/api/admin/dishes/${id}/photo`, {
      method: "POST",
      body: formData,
    });
    const body = await res.json();
    if (res.ok) {
      setDishes((prev) => prev?.map((d) => (d.id === id ? body.dish : d)) ?? prev);
    }
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

  async function handlePhotoAdjust(id: string, focalX: number, focalY: number, zoom: number) {
    const res = await fetch(`/api/admin/dishes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ focal_x: focalX, focal_y: focalY, zoom }),
    });
    const body = await res.json();
    if (res.ok) {
      setDishes((prev) => prev?.map((d) => (d.id === id ? body.dish : d)) ?? prev);
    }
  }

  async function handleAdd(formData: FormData) {
    const res = await fetch("/api/admin/dishes", { method: "POST", body: formData });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error);
    setDishes((prev) => [...(prev ?? []), body.dish]);
  }

  return (
    <div>
      <h1 className="mb-8 text-center text-2xl font-semibold">{categoryLabel(category)}</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!dishes ? (
        <p className="text-neutral-500">読み込み中…</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, i) => (
            <DishEditCard
              key={dish.id}
              dish={dish}
              isFirst={i === 0}
              isLast={i === dishes.length - 1}
              onArchive={handleArchive}
              onReorder={handleReorder}
              onPhotoChange={handlePhotoChange}
              onFieldSave={handleFieldSave}
              onPhotoAdjust={handlePhotoAdjust}
            />
          ))}
          <AddDishCard category={category} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
