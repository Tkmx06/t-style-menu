import Script from "next/script";

// SnapWidget (https://snapwidget.com) のダッシュボードで発行された公式の埋め込みコードを
// そのまま使用しています(<script src="https://snapwidget.com/js/snapwidget.js"> + iframe)。
// width: 100% でコンテナ幅いっぱいに表示され、高さは scrolling="no" のままウィジェット側の
// スクリプトが投稿数に応じて自動調整します(以前のように高さを固定して見切れることはありません)。
//
// 注意: SnapWidgetの標準ウィジェットは「最新の投稿」を並べる仕組みで、
// Instagram側の「ピン留め投稿」を区別して取得する機能は持っていません。
// 特定の2枚(最新+ピン留め)だけを厳密に出し分けたい場合は、SnapWidgetダッシュボード側の
// 表示件数/列数の設定を確認いただくか、Instagram Graph APIを使った作り込みが必要です。
export function InstagramFeed() {
  return (
    <section className="flex flex-col items-center gap-4 bg-white px-4 py-12">
      <h2 className="font-script text-3xl text-neutral-800">Instagram</h2>
      <div className="mx-auto w-full max-w-[620px]">
        <Script src="https://snapwidget.com/js/snapwidget.js" strategy="lazyOnload" />
        <iframe
          src="https://snapwidget.com/embed/1098542"
          className="snapwidget-widget"
          allowTransparency
          frameBorder="0"
          scrolling="no"
          style={{ border: "none", overflow: "hidden", width: "100%" }}
          title="Posts from Instagram"
        />
      </div>
    </section>
  );
}
