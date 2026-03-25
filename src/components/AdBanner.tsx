"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // 광고 ID가 설정되어 있고 실시간 환경일 때만 광고를 로드합니다.
    if (adsenseId && adsenseId !== "나중에_입력") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense error:", err);
      }
    }
  }, [adsenseId]);

  // 광고 ID가 없거나 '나중에_입력'인 경우 아무것도 렌더링하지 않습니다.
  if (!adsenseId || adsenseId === "나중에_입력") {
    return null;
  }

  return (
    <div className="my-12 flex justify-center w-full overflow-hidden min-h-[100px] bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 items-center text-neutral-400 text-xs">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adsenseId}
        data-ad-slot="auto" // 실제 슬롯 ID가 생기면 여기를 수정하세요
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {/* 개발 단계에서는 영역 확인용 텍스트 (광고 로드 시 가려짐) */}
      <div className="absolute">AD AREA</div>
    </div>
  );
}
