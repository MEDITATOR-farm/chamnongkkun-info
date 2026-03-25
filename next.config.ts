import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 배포를 위해 다시 활성화했습니다!
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
