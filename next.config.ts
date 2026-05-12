import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Cloudflare Pages 배포를 위해 다시 활성화했습니다. 브라우저 직접 연동 방식으로 작동합니다.
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
