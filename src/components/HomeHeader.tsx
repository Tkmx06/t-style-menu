import Link from "next/link";
import Image from "next/image";

const RESERVATION_URL = "https://restaurant-reservation-ebon.vercel.app/reservation";
const INSTAGRAM_URL = "https://www.instagram.com/t_style_frankfurt/";
const MENU_URL = "https://amour.pecori.jp/t_style/food.html";
// TODO: この店の「LUNCH」向けページがまだ存在しないため、旧サイトの該当リンクをそのまま暫定的に使っています。
// 新しいランチページができたら、ここを差し替えてください。
const LUNCH_URL = "https://amour.pecori.jp/t_style/drink.html";

const TABS = [
  { label: "MENU", href: MENU_URL },
  { label: "LUNCH", href: LUNCH_URL },
  { label: "PHOTO", href: "/menu/empfehlung" },
];

export function HomeHeader() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6">
        <Link href="/" className="inline-block">
          <Image
            src="/logo.png"
            alt="t-style Japanisches Bistro"
            width={1561}
            height={586}
            priority
            className="h-16 w-auto object-contain sm:h-20"
          />
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-red-600 px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-red-700 sm:text-base"
          >
            今すぐ予約する
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:border-neutral-500 hover:text-neutral-900"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>

      <nav className="bg-neutral-900">
        <div className="mx-auto flex max-w-5xl">
          {TABS.map((tab) => {
            const isInternal = tab.href.startsWith("/");
            const className =
              "flex-1 py-3 text-center text-sm font-semibold tracking-widest text-white transition-colors hover:bg-neutral-700 sm:text-base";
            return isInternal ? (
              <Link key={tab.label} href={tab.href} className={className}>
                {tab.label}
              </Link>
            ) : (
              <a
                key={tab.label}
                href={tab.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {tab.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
