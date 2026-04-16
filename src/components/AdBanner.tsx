"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window { adsbygoogle: any[]; }
}

export default function AdBanner() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const adPushed = useRef(false);
  const insRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!adsenseId || adsenseId === "나중에_입력" || adsenseId === "나중애_입력") return;
    if (adPushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      adPushed.current = true;
    } catch (err) {
      if (err instanceof Error && !err.message.includes("already have ads")) {
        console.error("AdSense error:", err);
      }
    }

    // 1.5초 후 실제로 광고가 채워졌는지 확인
    const timer = setTimeout(() => {
      const ins = insRef.current;
      const status = ins?.getAttribute("data-ad-status");
      if (status === "filled") {
        setAdLoaded(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [adsenseId]);

  // adsenseId 없으면 아무것도 렌더링 안 함
  if (!adsenseId || adsenseId === "나중에_입력" || adsenseId === "나중애_입력") {
    return null;
  }

  return (
    <div
      style={{
        display: adLoaded ? "flex" : "none", // 광고 채워졌을 때만 보임
      }}
      className="my-16 justify-center w-full max-w-6xl mx-auto overflow-hidden min-h-[280px] bg-white rounded-3xl items-center relative shadow-sm border border-slate-50"
    >
      <ins
        ref={insRef}
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
