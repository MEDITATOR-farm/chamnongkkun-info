import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 배포 완료를 위해 다시 활성화했습니다! 실시간 데이터는 자동 빌드 시 업데이트됩니다.
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
