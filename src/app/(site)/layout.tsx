import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <Link href="/admin" className="hover:text-neutral-300">
          管理
        </Link>
      </footer>
    </div>
  );
}
