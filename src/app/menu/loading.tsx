// 2026-09-16: 「PHOTOタブ/『Unsere Empfehlung』ボタンを押しても何も起きない
// (機能していないように見える)」という報告への対応。
//
// 原因: /menu/[category] は force-dynamic (毎回Supabaseへ料理写真を問い合わせる)
// で、かつこのセグメントに loading.tsx が無かったため、遷移先のデータ取得が
// 終わるまでNext.jsの画面は「元のページのまま」何も変化しませんでした。
// 取得が数秒かかると、クリックしても反応が無いように見えてしまいます
// (実際にはリンク自体は正しく機能しており、裏側の通信は行われていました)。
//
// 対応: このファイル(loading.tsx)を追加することで、クリックした瞬間から
// ヘッダー/タブバーはそのまま維持しつつ、コンテンツ部分に読み込み中の
// スケルトン表示がすぐに出るようになり、「ボタンが反応した」ことが
// 一目でわかるようになります(データ取得自体の速度は変えていません)。
export default function MenuLoading() {
  return (
    <div className="animate-pulse">
      <div className="relative -mx-4 mb-10 aspect-[1599/861] bg-neutral-200" />
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="mx-auto mb-3 h-5 w-2/3 rounded bg-neutral-200" />
            <div className="aspect-[4/3] w-full rounded-lg bg-neutral-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
