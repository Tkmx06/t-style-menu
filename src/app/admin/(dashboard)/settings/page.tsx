"use client";

import { useEffect, useState } from "react";
import { extractInstagramPostId } from "@/lib/instagramPostId";

export default function AdminSettingsPage() {
  const [postInputs, setPostInputs] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings");
      const body = await res.json();
      if (res.ok) {
        const ids: string[] = body.instagramPostIds ?? [];
        setPostInputs(ids.length > 0 ? ids : [""]);
      } else {
        setError(body.error ?? "読み込みに失敗しました。");
      }
      setLoading(false);
    }
    load();
  }, []);

  function updateInput(index: number, value: string) {
    setPostInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
  }

  function addInput() {
    setPostInputs((prev) => [...prev, ""]);
  }

  function removeInput(index: number) {
    setPostInputs((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    setError(null);

    const ids = postInputs
      .map((value) => extractInstagramPostId(value))
      .filter((value) => value !== "");

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instagramPostIds: ids }),
    });
    const body = await res.json();

    if (res.ok) {
      const saved: string[] = body.instagramPostIds ?? [];
      setPostInputs(saved.length > 0 ? saved : [""]);
      setMessage("保存しました。");
    } else {
      setError(body.error ?? "保存に失敗しました。");
    }
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-semibold">サイト設定</h1>

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold">ホーム画面のInstagram表示</h2>
        <p className="mb-4 text-sm text-neutral-500">
          ホーム画面の「Instagram」欄に表示する投稿を指定します。Instagramで投稿を開き、
          アドレスバーのURL(例: https://www.instagram.com/p/XXXXXXXXXXX/)をそのまま貼り付けてください。
          この一覧は自動更新されないため、新しい投稿を表示したいときはここで都度差し替えてください。
        </p>

        {loading ? (
          <p className="text-sm text-neutral-500">読み込み中...</p>
        ) : (
          <div className="flex flex-col gap-2">
            {postInputs.map((value, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateInput(index, e.target.value)}
                  placeholder="https://www.instagram.com/p/XXXXXXXXXXX/"
                  className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeInput(index)}
                  className="shrink-0 rounded border border-neutral-300 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addInput}
          className="mt-3 text-sm text-neutral-600 hover:text-neutral-950"
        >
          + 投稿を追加
        </button>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-neutral-700 disabled:opacity-50"
          >
            {saving ? "保存中..." : "保存する"}
          </button>
          {message && <span className="text-sm text-green-600">{message}</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </section>
    </div>
  );
}
