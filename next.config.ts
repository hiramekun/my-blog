import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/my-blog",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
