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
    if (adsenseId && adsenseId !== "나중에_입력" && !adPushed.current) {
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

  // [수정] 광고가 아직 승인되지 않았으므로, 안내 이미지를 먼저 보여줍니다.
  // 나중에 광고를 정식으로 띄우고 싶으실 때 이 부분만 살짝 고치면 됩니다.
  const showPlaceholder = false; 

  if (showPlaceholder || !adsenseId || adsenseId === "나중에_입력") {
    return (
      <div className="my-12 flex flex-col items-center justify-center w-full max-w-6xl mx-auto py-16 border-y border-slate-100/50 opacity-40">
        <p className="text-slate-300 text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Ad Space Reserved
        </p>
        <p className="text-slate-400 text-xs font-bold">
          ( 여기는 구글 광고가 예약 된 위치 입니다 )
        </p>
      </div>
    );
  }

  return (
    <div className="my-16 flex justify-center w-full max-w-6xl mx-auto overflow-hidden min-h-[280px] bg-white rounded-3xl items-center relative">
      {/* 📍 광고 예약 안내 문구 추가 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <p className="text-slate-200 text-xs font-bold tracking-widest opacity-60">
          ( 여기는 구글 광고가 예약 된 위치 입니다 )
        </p>
      </div>
      
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "280px" }}
        data-ad-client={adsenseId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
