import type { Metadata } from "next";
import { Noto_Sans, Josefin_Sans, Alex_Brush } from "next/font/google";
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

export const metadata: Metadata = {
  title: "t-style | Japanisches Bistro",
  description: "Menü von t-style Japanisches Bistro Frankfurt",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${notoSans.variable} ${josefinSans.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-neutral-900">{children}</body>
    </html>
  );
}
