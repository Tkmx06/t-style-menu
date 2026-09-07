// SnapWidget (https://snapwidget.com) 経由でInstagramの最新投稿を表示します。
// 埋め込みコードはSnapWidgetのダッシュボードで発行されたものをそのまま使用しています。
export function InstagramFeed() {
  return (
    <section className="flex flex-col items-center gap-4 bg-white px-4 py-12">
      <h2 className="font-script text-3xl text-neutral-800">Instagram</h2>
      <div className="mx-auto w-full max-w-[425px] overflow-hidden">
        <iframe
          src="https://snapwidget.com/embed/1098542"
          className="w-full border-0"
          style={{ overflow: "hidden", height: 425 }}
          scrolling="no"
          title="Posts from Instagram"
        />
      </div>
    </section>
  );
}
