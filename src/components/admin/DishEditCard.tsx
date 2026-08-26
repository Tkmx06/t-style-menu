"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Dish } from "@/lib/dish";

export function DishEditCard({
  dish,
  isFirst,
  isLast,
  onArchive,
  onReorder,
  onPhotoChange,
  onFieldSave,
}: {
  dish: Dish;
  isFirst: boolean;
  isLast: boolean;
  onArchive: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onPhotoChange: (id: string, file: File) => void;
  onFieldSave: (id: string, field: "name" | "description", value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onReorder(dish.id, "up")}
          className="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 disabled:opacity-30"
          aria-label="前に移動"
        >
          ←
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onReorder(dish.id, "down")}
          className="rounded border border-neutral-700 px-2 py-0.5 text-xs text-neutral-300 disabled:opacity-30"
          aria-label="後に移動"
        >
          →
        </button>
      </div>

      <input
        type="text"
        defaultValue={dish.name}
        onBlur={(e) => {
          if (e.target.value.trim() !== dish.name) {
            onFieldSave(dish.id, "name", e.target.value);
          }
        }}
        className="input text-center text-base font-semibold"
      />

      <div
        className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-neutral-900"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
          タップして写真を変更
        </div>
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
            アップロード中…
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onArchive(dish.id);
          }}
          aria-label="削除（アーカイブへ）"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
        >
          ×
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onClick={(e) => e.stopPropagation()}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setBusy(true);
            await onPhotoChange(dish.id, file);
            setBusy(false);
            e.target.value = "";
          }}
        />
      </div>

      <textarea
        defaultValue={dish.description ?? ""}
        placeholder="説明（任意）"
        rows={2}
        onBlur={(e) => {
          if (e.target.value.trim() !== (dish.description ?? "")) {
            onFieldSave(dish.id, "description", e.target.value);
          }
        }}
        className="input text-center text-sm"
      />
    </div>
  );
}
