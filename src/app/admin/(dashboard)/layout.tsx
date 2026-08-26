import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { LogoutButton } from "@/components/LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">管理画面</span>
            <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-200">
              サイトを見る ↗
            </Link>
          </div>
          <LogoutButton />
        </div>
        <nav className="mx-auto flex max-w-5xl flex-wrap gap-x-4 gap-y-2 px-4 pb-4 text-sm">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/admin/${c.slug}`}
              className="text-neutral-300 hover:text-white transition-colors"
            >
              {c.label}
            </Link>
          ))}
          <Link href="/admin/archive" className="text-amber-400 hover:text-amber-300">
            過去のメニュー
          </Link>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
