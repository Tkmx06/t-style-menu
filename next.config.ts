import type { NextConfig } from "next";

const ORIGINAL_SITE_BASE = "https://amour.pecori.jp/t_style";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: `${ORIGINAL_SITE_BASE}/index_202412.html` },
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
  },
};

export default nextConfig;
