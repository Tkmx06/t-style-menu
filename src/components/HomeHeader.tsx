import Link from "next/link";
import Image from "next/image";

const RESERVATION_URL = "https://restaurant-reservation-ebon.vercel.app/reservation";
// TODO: この店の「LUNCH」向けページがまだ存在しないため、旧サイトの該当リンクをそのまま暫定的に使っています。
// 新しいランチページができたら、ここを差し替えてください。
const LUNCH_URL = "https://amour.pecori.jp/t_style/drink.html";

const TABS = [
  { label: "MENU", href: "/menu" },
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

        <a
          href={RESERVATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-red-600 px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-red-700 sm:text-base"
        >
          今すぐ予約する
        </a>
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
