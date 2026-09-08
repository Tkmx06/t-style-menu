// MENUの各カテゴリページ(温かい料理・冷たい料理・サラダ・肉料理・天ぷら・魚料理・
// ご飯料理・寿司と刺身・麺)の上部に、価格・アレルゲン表記込みの正式なメニュー表(PDF)
// を、リンクとしてではなく最初から開いた状態でそのまま埋め込み表示します。写真中心の
// カード表示だけでは価格などを載せられないため、詳しいメニュー表はこのPDFをそのまま
// 案内する形にしています(2026-09-08)。
export function MenuPdfEmbed() {
  return (
    <div className="mb-10">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-neutral-700">
          Speisekarte mit Preisen (PDF) / メニュー表(価格入り・PDF)
        </p>
        <a
          href="/menu_updated3.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-800"
        >
          新しいタブで開く ↗
        </a>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm">
        <iframe
          src="/menu_updated3.pdf"
          title="t-style Speisekarte / メニュー表 (PDF)"
          className="h-[75vh] min-h-[480px] w-full"
        />
      </div>
    </div>
  );
}
