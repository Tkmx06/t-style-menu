// SnapWidget (https://snapwidget.com) 経由でInstagramの最新投稿を表示します。
// 埋め込みコードはSnapWidgetのダッシュボードで発行されたものをそのまま使用しています。
//
// 以前は幅425px・高さ固定(425px, overflow: hidden)の1列レイアウトだったため、
// 投稿画像が上下で見切れていました。ここでは横幅を広げて2列で表示されるようにし、
// 高さも固定せずウィジェット側の高さに合わせています。
//
// 注意: SnapWidgetの標準ウィジェットは「最新の投稿」を並べる仕組みで、
// Instagram側の「ピン留め投稿」を区別して取得する機能は持っていません。
// 特定の2枚(最新+ピン留め)だけを厳密に出し分けたい場合は、SnapWidgetダッシュボード側の
// 表示件数/列数の設定を確認いただくか、Instagram Graph APIを使った作り込みが必要です。
export function InstagramFeed() {
  return (
    <section className="flex flex-col items-center gap-4 bg-white px-4 py-12">
      <h2 className="font-script text-3xl text-neutral-800">Instagram</h2>
      <div className="mx-auto w-full max-w-[620px] overflow-hidden">
        <iframe
          src="https://snapwidget.com/embed/1098542"
          className="w-full border-0"
          style={{ minHeight: 300 }}
          title="Posts from Instagram"
        />
      </div>
    </section>
  );
}
