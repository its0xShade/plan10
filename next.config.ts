import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  /* خروجی استاتیک برای GitHub Pages؛ مسیر پایه از متغیر محیطی (در CI: /plan1) */
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
