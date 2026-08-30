import type { NextConfig } from "next";

// Cloudflare Pages は blog.hiramekun.dev のルートで配信するので basePath は要らない。
// (GitHub Pages のプロジェクトページ向けに付けていた /my-blog は廃止した)
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
