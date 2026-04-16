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
    setSharing(true);
    try {
      // html2canvas 대신 Canvas API로 직접 그리기
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 320;
      const ctx = canvas.getContext("2d")!;

      // 배경
      const grad = ctx.createLinearGradient(0, 0, 800, 320);
      grad.addColorStop(0, "#0a1e3a");
      grad.addColorStop(1, "#0b2d3e");
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, 800, 320, 20);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
      ctx.lineWidth = 1;
      ctx.roundRect(0, 0, 800, 320, 20);
      ctx.stroke();

      // 배지
      ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
      ctx.roundRect(24, 24, 130, 22, 6);
      ctx.fill();
      ctx.fillStyle = "#fcd34d";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("📜 오늘의 명심보감", 34, 39);

      // 한자
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 22px serif";
      const chars = todaysWisdom.chars || "";
      const maxWidth = 750;
      let y = 90;
      // 줄바꿈 처리
      const words = chars.split(" ");
      let line = "";
      for (const word of words) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line, 24, y);
          line = word + " ";
          y += 32;
        } else {
          line = test;
        }
      }
      ctx.fillText(line, 24, y);
      y += 36;

      // 독음
      ctx.fillStyle = "rgba(253, 211, 77, 0.5)";
      ctx.font = "13px serif";
      ctx.fillText(todaysWisdom.reading || "", 24, y);
      y += 28;

      // 해석
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "14px sans-serif";
      const meaning = "— " + (todaysWisdom.meaning || "");
      const meaningWords = meaning.split(" ");
      let mLine = "";
      for (const word of meaningWords) {
        const test = mLine + word + " ";
        if (ctx.measureText(test).width > maxWidth && mLine) {
          ctx.fillText(mLine, 24, y);
          mLine = word + " ";
          y += 22;
        } else {
          mLine = test;
        }
      }
      ctx.fillText(mLine, 24, y);

      // 출처
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("chamnongkkun.com", 776, 296);

      // 다운로드 or 공유
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "명심보감.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "오늘의 명심보감" });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "명심보감.png";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
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
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 border border-amber-400/60 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest w-fit">
            📜 오늘의 명심보감
          </div>
          <button
            onClick={handleShare}
            disabled={sharing}
            className="text-[10px] font-bold text-amber-300/70 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 px-2 py-0.5 rounded transition-all disabled:opacity-50"
          >
            {sharing ? "생성 중..." : "이미지 공유 📤"}
          </button>
        </div>
        <div ref={cardRef}>
          <div className="text-base sm:text-lg font-bold text-amber-200 font-serif leading-snug">
            {todaysWisdom.chars}
          </div>
          <div className="text-xs sm:text-sm font-medium text-amber-300/60 font-serif tracking-wide mt-1">
            {todaysWisdom.reading}
          </div>
          <div className="text-xs sm:text-sm font-medium text-white/70 leading-relaxed mt-1">
            — {todaysWisdom.meaning}
          </div>
        </div>
      </div>
    </div>
  );
}
