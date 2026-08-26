"use client";

import { useState, type FormEvent } from "react";

export function AddDishCard({
  category,
  onAdd,
}: {
  category: string;
  onAdd: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200"
      >
        <span className="text-3xl">+</span>
        <span className="text-sm">料理を追加</span>
      </button>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("category", category);
    try {
      await onAdd(formData);
      setOpen(false);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-neutral-700 p-3">
      <input type="text" name="name" placeholder="料理名" required className="input text-sm" />
      <textarea name="description" placeholder="説明（任意）" rows={2} className="input text-sm" />
      <input type="file" name="photo" accept="image/*" required className="text-sm" />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "登録中…" : "登録"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300"
        >
          キャンセル
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
