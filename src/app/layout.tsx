import type { Metadata } from "next";
import { Noto_Sans, Josefin_Sans, Alex_Brush, Baloo_2 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-heading",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

// 2026-09-15: ロゴの「t・style」部分をテキストとしてアニメーション表示するために
// 追加しました。元のロゴ画像の書体に近い、丸みのある太字のフォントを選んでいます。
const baloo2 = Baloo_2({
  variable: "--font-logo",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "t-style | Japanisches Bistro",
  description: "Menü von t-style Japanisches Bistro Frankfurt",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${notoSans.variable} ${josefinSans.variable} ${alexBrush.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-neutral-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
