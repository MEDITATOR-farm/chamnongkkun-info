"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const adPushed = useRef(false);

  useEffect(() => {
    // 광고 ID가 설정되어 있고 실시간 환경일 때만 광고를 로드합니다.
    if (adsenseId && adsenseId !== "나중에_입력" && adsenseId !== "나중애_입력" && !adPushed.current) {
      try {
        const adsbygoogle = window.adsbygoogle || [];
        adsbygoogle.push({});
        adPushed.current = true;
      } catch (err) {
        if (err instanceof Error && !err.message.includes("already have ads")) {
          console.error("AdSense error:", err);
        }
      }
    }
  }, [adsenseId]);

  // 구글 검토 승인이 나기 전에는 광고가 빈 공간으로 보이게 됩니다.
  // 검토 로봇이 소스 코드에서 <ins> 가 정상적으로 존재하는지 확인해야 하므로
  // 임시 안내 문구를 없애고 항상 실제 광고 태그를 렌더링합니다.
  if (!adsenseId || adsenseId === "나중에_입력" || adsenseId === "나중애_입력") {
    return null;
  }

  return (
    <div className="my-16 flex justify-center w-full max-w-6xl mx-auto overflow-hidden min-h-[280px] bg-white rounded-3xl items-center relative shadow-sm border border-slate-50">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "280px" }}
        data-ad-client={adsenseId}
        data-ad-slot="auto" // [주의] 추후 애드센스 대시보드에서 받은 10자리 숫자로 교체하면 더 좋습니다.
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
