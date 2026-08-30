"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";

const STEP = 0.05;

export function PhotoAdjustPanel({
  imageUrl,
  initialFocalX,
  initialFocalY,
  initialZoom,
  onSave,
  onCancel,
}: {
  imageUrl: string;
  initialFocalX: number;
  initialFocalY: number;
  initialZoom: number;
  onSave: (focalX: number, focalY: number, zoom: number) => Promise<void>;
  onCancel: () => void;
}) {
  const [focalX, setFocalX] = useState(initialFocalX);
  const [focalY, setFocalY] = useState(initialFocalY);
  const [zoom, setZoom] = useState(initialZoom);
  const [saving, setSaving] = useState(false);

  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const previewStyle: CSSProperties = {
    objectPosition: `${focalX * 100}% ${focalY * 100}%`,
    transform: `scale(${zoom})`,
  };

  async function handleSave() {
    setSaving(true);
    await onSave(focalX, focalY, zoom);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-300 bg-neutral-50 p-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-200">
        <Image src={imageUrl} alt="" fill sizes="400px" style={previewStyle} className="object-cover" />
      </div>

      <div className="flex flex-col items-center gap-1">
        <button
          type="button"
          onClick={() => setFocalY((v) => clamp(v - STEP))}
          className="h-7 w-7 rounded border border-neutral-300 bg-white text-sm"
        >
          ↑
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setFocalX((v) => clamp(v - STEP))}
            className="h-7 w-7 rounded border border-neutral-300 bg-white text-sm"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => {
              setFocalX(0.5);
              setFocalY(0.5);
            }}
            className="h-7 w-7 rounded border border-neutral-300 bg-white text-xs"
            aria-label="中央に戻す"
          >
            ●
          </button>
          <button
            type="button"
            onClick={() => setFocalX((v) => clamp(v + STEP))}
            className="h-7 w-7 rounded border border-neutral-300 bg-white text-sm"
          >
            →
          </button>
        </div>
        <button
          type="button"
          onClick={() => setFocalY((v) => clamp(v + STEP))}
          className="h-7 w-7 rounded border border-neutral-300 bg-white text-sm"
        >
          ↓
        </button>
      </div>

      <label className="flex items-center gap-2 text-xs text-neutral-600">
        拡大
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-10 text-right">{zoom.toFixed(2)}x</span>
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
