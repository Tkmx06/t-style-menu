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

// 2026-09-15: ã­ã´ã®ãtã»styleãé¨åããã­ã¹ãã¨ãã¦ã¢ãã¡ã¼ã·ã§ã³è¡¨ç¤ºããããã«
// è¿½å ãã¾ãããåã®ã­ã´ç»åã®æ¸ä½ã«è¿ããä¸¸ã¿ã®ããå¤ªå­ã®ãã©ã³ããé¸ãã§ãã¾ãã
const baloo2 = Baloo_2({
  variable: "--font-logo",
  weight: ["700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "t-style | Japanisches Bistro",
  description: "MenÃ¼ von t-style Japanisches Bistro Frankfurt",
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
