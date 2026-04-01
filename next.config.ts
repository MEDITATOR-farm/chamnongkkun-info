import type { NextConfig } from "next";

const nextConfig: NextConfig = {
//   output: "export", // 실시간 기능을 위해 잠시 꺼두었습니다! Vercel 등으로 배포하면 문제없어요.
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
