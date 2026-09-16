import type { NextConfig } from "next";

const ORIGINAL_SITE_BASE = "https://amour.pecori.jp/t_style";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/legacy-home", destination: `${ORIGINAL_SITE_BASE}/index_202412.html` },
        { source: "/css/:path*", destination: `${ORIGINAL_SITE_BASE}/css/:path*` },
        { source: "/image/:path*", destination: `${ORIGINAL_SITE_BASE}/image/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // サイト内で実際に使われている表示幅(64px管理サムネイル、400px前後の
    // カード/編集画面、最大1024pxのメニューページ、スライドショーの~20-33vw)
    // に絞り込み、Next.jsデフォルト(640〜3840pxの8段階)による無駄な
    // バリアント生成を防ぐ。
    deviceSizes: [400, 640, 750, 1024, 1080],
    imageSizes: [64, 256],
    qualities: [75],
  },
};

export default nextConfig;
