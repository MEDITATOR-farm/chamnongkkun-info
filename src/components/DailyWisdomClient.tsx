"use client";

import { useState, useEffect, useRef } from "react";

export default function DailyWisdomClient({ wisdoms }: { wisdoms: any[] }) {
  const [todaysWisdom, setTodaysWisdom] = useState<any>(null);
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wisdoms && wisdoms.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const sixHours = 1000 * 60 * 60 * 6;
      const intervalIndex = Math.floor(diff / sixHours);
      setTodaysWisdom(wisdoms[intervalIndex % wisdoms.length]);
    }
  }, [wisdoms]);

  if (!todaysWisdom) return null;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a1e3a",
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "명심보감.png", { type: "image/png" });

        // 모바일: 이미지 공유
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "오늘의 명심보감",
          });
        } else {
          // PC: 이미지 다운로드
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "명심보감.png";
          a.click();
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (e) {
      console.error(e);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-white/10" translate="no">
      <div className="flex flex-col gap-2 relative z-10 w-full">
        {/* 배지 + 공유 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 border border-amber-400/60 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest w-fit">
            📜 오늘의 명심보감
          </div>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="text-[10px] font-bold text-amber-300/70 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 px-2 py-0.5 rounded transition-all disabled:opacity-50"
          >
            {sharing ? "캡처 중..." : "이미지 공유 📤"}
          </button>
        </div>

        {/* 캡처 대상 카드 */}
        <div ref={cardRef} style={{
          background: "linear-gradient(135deg, #0a1e3a, #0b2d3e)",
          borderRadius: "12px",
          padding: "16px",
        }}>
          {/* 1줄: 한자 */}
          <div className="text-base sm:text-lg font-bold text-amber-200 font-serif leading-snug mb-2">
            {todaysWisdom.chars}
          </div>
          {/* 2줄: 한글 독음 */}
          <div className="text-xs sm:text-sm font-medium text-amber-300/60 font-serif tracking-wide mb-2">
            {todaysWisdom.reading}
          </div>
          {/* 3줄: 해석 */}
          <div className="text-xs sm:text-sm font-medium text-white/70 leading-relaxed">
            — {todaysWisdom.meaning}
          </div>
          {/* 출처 */}
          <div className="text-[9px] text-white/20 mt-3 text-right">
            chamnongkkun.com
          </div>
        </div>
      </div>
    </div>
  );
}
