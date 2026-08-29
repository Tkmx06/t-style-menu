import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { CATEGORIES } from "@/lib/categories";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav />
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
    </div>
  );
}
