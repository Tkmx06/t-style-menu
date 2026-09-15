"use client";

// 2026-09-16: PHOTO/MENUページへの遷移がバックエンドの一時的なエラー(503など、
// サーバー関数の混雑時に発生することがある)で失敗した場合、これまではエラー用の
// 表示が無かったため、画面が固まったまま何も起きないように見えていた。
// このファイル(error.tsx)を追加し、失敗時に「再読み込みボタン付きのエラー画面」を
// 表示するようにした。loading.tsx(読み込み中スケルトン)とあわせて、
// クリックした結果(読み込み中/成功/失敗)が必ず画面に反映されるようになる。
export default function MenuError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-lg font-semibold text-neutral-800">
        一時的に読み込めませんでした
      </p>
      <p className="max-w-sm text-sm text-neutral-500">
        サーバーが混み合っている可能性があります。少し待ってからもう一度お試しください。
      </p>
      <button
        onClick={() => reset()}
        className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        もう一度読み込む
      </button>
    </div>
  );
}
