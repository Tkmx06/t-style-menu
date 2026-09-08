// MENUの各カテゴリページ(温かい料理・冷たい料理・サラダ・肉料理・天ぷら・魚料理・
// ご飯料理・寿司と刺身・麺)の上部に、価格・アレルゲン表記込みの正式なメニュー表(PDF)
// へのリンクを表示します。写真中心のカード表示だけでは価格などを載せられないため、
// 詳しいメニュー表はこのPDFをそのまま案内する形にしています(2026-09-08)。
export function MenuPdfBanner() {
  return (
    <div className="mb-8 flex justify-center">
      <a
        href="/menu_updated3.pdf"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
        </svg>
        Speisekarte mit Preisen (PDF) / メニュー表(価格入り・PDF)
      </a>
    </div>
  );
}
