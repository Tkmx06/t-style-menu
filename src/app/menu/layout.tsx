import { HomeHeader } from "@/components/HomeHeader";
import { HomeFooter } from "@/components/HomeFooter";

// 2026-09-08: ロゴ・予約ボタン・Instagramリンク・黒いタブバー(HOME/MENU/PHOTO)を
// ホーム画面と完全に同じにするため、専用のSiteNav+カテゴリ一覧フッターをやめ、
// ホーム画面と共通のHomeHeader/HomeFooterをここでも使うようにしました。
// これにより/menu以下のどのページに来ても、上のヘッダーとタブバーは必ず同じ内容で
// 表示されます(カテゴリ一覧はMENU/PHOTOタブから辿れるため、重複していた
// フッターのカテゴリリンクは廃止しました)。
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <HomeHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <HomeFooter />
    </div>
  );
}
