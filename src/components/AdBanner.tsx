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
  const showPlaceholder = true; 

  if (showPlaceholder || !adsenseId || adsenseId === "나중에_입력") {
    return (
      <div className="my-16 flex flex-col items-center justify-center w-full max-w-6xl mx-auto overflow-hidden rounded-[32px] border border-cyan-100 shadow-xl bg-white group transition-all hover:shadow-2xl">
        <div className="relative w-full aspect-[21/6]">
          <img 
            src="/images/google_ad_placeholder.png" 
            alt="Ad Placeholder" 
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <span className="px-4 py-1.5 bg-cyan-500/80 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest mb-4 uppercase">Chamnongkkun Official</span>
            <h3 className="text-xl md:text-3xl font-black mb-2 text-shadow-premium">거제의 가치를 더하는 정보 나눔</h3>
            <p className="text-xs md:text-sm font-bold opacity-90">구글 광고 승인 대기 중입니다! 조금만 기다려 주세요. ✨</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-16 flex justify-center w-full max-w-6xl mx-auto overflow-hidden min-h-[280px] bg-neutral-50/50 rounded-[32px] border border-dashed border-cyan-200 items-center text-cyan-400 font-bold relative group">
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "280px" }}
        data-ad-client={adsenseId}
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      {/* 개발 단계 안내 문구 - 광고 로드 시 가득 채워짐 */}
      <div className="absolute flex flex-col items-center gap-3 pointer-events-none group-hover:scale-110 transition-transform">
        <span className="text-4xl">💰</span>
        <div className="text-center">
          <p className="text-sm">GOOGLE ADSENSE AREA</p>
          <p className="text-[10px] opacity-60">광고가 승인되면 이곳에 예쁜 광고가 나타납니다!</p>
        </div>
      </div>
    </div>
  );
}
