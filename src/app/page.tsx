import { HomeHeader } from "@/components/HomeHeader";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <HomeHeader />
      {/*
        下の本文は、これまで通り旧ホームページ(amour.pecori.jp)をそのまま
        表示しています(next.config.ts の /legacy-home リライト経由)。
        ヘッダー(ロゴ・予約ボタン・MENU/LUNCH/PHOTOタブ)だけを新しくして、
        本文の作り直しは次のステップで行う想定です。
      */}
      <iframe
        src="/legacy-home"
        title="t-style ホーム"
        className="w-full flex-1 border-0"
        style={{ minHeight: "1400px" }}
      />
    </div>
  );
}
