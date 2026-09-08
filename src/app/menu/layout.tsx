import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { TabBar } from "@/components/TabBar";
import { HomeFooter } from "@/components/HomeFooter";
import { CATEGORIES } from "@/lib/categories";

// PHOTOタブなどからこのメニュー一覧セクションに来たとき、ホームに戻る手段が
// 無かったため、ホーム画面と同じ黒いタブバー(上)と黒いフッターバー(下、HOMEリンク付き)を
// ここにも貼り付けています。
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      <TabBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-neutral-200 py-8">
        <nav className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-sm text-neutral-600">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/menu/${c.slug}`} className="hover:text-neutral-950">
              {c.label}
            </Link>
          ))}
        </nav>
      </footer>
      <HomeFooter />
    </div>
  );
}
