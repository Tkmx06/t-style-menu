"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dish } from "@/lib/dish";
import { PhotoAdjustPanel } from "./PhotoAdjustPanel";

export function DishEditCard({
  dish,
  isFirst,
  isLast,
  onArchive,
  onReorder,
  onPhotoChange,
  onFieldSave,
  onPhotoAdjust,
}: {
  dish: Dish;
  isFirst: boolean;
  isLast: boolean;
  onArchive: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onPhotoChange: (id: string, file: File) => void;
  onFieldSave: (id: string, field: "name" | "description", value: string) => void;
  onPhotoAdjust: (
    id: string,
    focalX: number,
    focalY: number,
    zoom: number,
    rotation: number,
  ) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [adjusting, setAdjusting] = useState(false);

  async function handleRotate(direction: "left" | "right") {
    setBusy(true);
    try {
      const res = await fetch(dish.image_url);
      const blob = await res.blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.height;
      canvas.height = bitmap.width;
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((direction === "right" ? 1 : -1) * (Math.PI / 2));
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
      const rotatedBlob: Blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("rotate failed"))), "image/jpeg", 0.92),
      );
      const file = new File([rotatedBlob], "rotated.jpg", { type: "image/jpeg" });
      await onPhotoChange(dish.id, file);
    } finally {
      setBusy(false);
    }
  }

  const imageStyle: CSSProperties = {
    objectPosition: `${dish.focal_x * 100}% ${dish.focal_y * 100}%`,
    transform: `scale(${dish.zoom}) rotate(${dish.rotation}deg)`,
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onReorder(dish.id, "up")}
          className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600 disabled:opacity-30"
          aria-label="前に移動"
        >
          ←
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onReorder(dish.id, "down")}
          className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-neutral-600 disabled:opacity-30"
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
        className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg bg-neutral-100"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          style={imageStyle}
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
          タップして写真を変更
        </div>
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white">
            処理中…
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRotate("left");
            }}
            aria-label="左に90度回転"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            ↺
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRotate("right");
            }}
            aria-label="右に90度回転"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            ↻
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAdjusting(true);
            }}
            aria-label="切り抜き・拡大を調整"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            ⛶
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onArchive(dish.id);
          }}
          aria-label="削除（アーカイブへ）"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600"
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

      {adjusting && (
        <PhotoAdjustPanel
          imageUrl={dish.image_url}
          initialFocalX={dish.focal_x}
          initialFocalY={dish.focal_y}
          initialZoom={dish.zoom}
          initialRotation={dish.rotation}
          onCancel={() => setAdjusting(false)}
          onSave={async (focalX, focalY, zoom, rotation) => {
            await onPhotoAdjust(dish.id, focalX, focalY, zoom, rotation);
            setAdjusting(false);
          }}
        />
      )}

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
