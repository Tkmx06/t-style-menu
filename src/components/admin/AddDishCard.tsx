"use client";

import { useState, type FormEvent } from "react";

// 「menu-pages」(正式なメニュー表PDFの各ページ画像)は料理ではなく単なる
// ページ画像なので、他のカテゴリと違って料理名・説明の入力は不要です。
// 以前はどのカテゴリでも同じ「料理名(必須)」フォームを使っていたため、
// menu-pagesに写真を追加しようとすると料理名を入れないと保存できず、
// 分かりにくい状態になっていました(2026-09-08、指摘を受けて対応)。
const MENU_PAGES_CATEGORY = "menu-pages";

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
  const isMenuPages = category === MENU_PAGES_CATEGORY;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-400 hover:text-neutral-600"
      >
        <span className="text-3xl">+</span>
        <span className="text-sm">{isMenuPages ? "写真を追加" : "料理を追加"}</span>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-neutral-300 p-3">
      {!isMenuPages && (
        <>
          <input type="text" name="name" placeholder="料理名" required className="input text-sm" />
          <textarea name="description" placeholder="説明（任意）" rows={2} className="input text-sm" />
        </>
      )}
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
          className="rounded border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600"
        >
          キャンセル
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
