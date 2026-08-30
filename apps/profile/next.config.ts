import type { NextConfig } from "next";

// Cloudflare Pages が hiramekun.dev のルートで配信するので basePath は要らない。
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
