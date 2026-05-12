import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // API 기능을 위해 이 설정을 비활성화했습니다. Vercel 배포 시 서버 기능이 정상 동작합니다.
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
