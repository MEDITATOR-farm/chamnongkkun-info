"use client";

import { useState, useEffect } from "react";

export default function DailyWisdomClient({ wisdoms }: { wisdoms: any[] }) {
  const [todaysWisdom, setTodaysWisdom] = useState<any>(null);

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

  return (
    <div className="p-4 sm:p-5 relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-white/10" translate="no">
      <div className="flex flex-col gap-2 relative z-10 w-full">
        {/* 배지 */}
        <div className="flex-shrink-0 border border-amber-400/60 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest w-fit">
          📜 오늘의 명심보감
        </div>
        {/* 1줄: 한자 */}
        <div className="text-base sm:text-lg font-bold text-amber-200 font-serif leading-snug">
          {todaysWisdom.chars}
        </div>
        {/* 2줄: 한글 독음 */}
        <div className="text-xs sm:text-sm font-medium text-amber-300/60 font-serif tracking-wide">
          {todaysWisdom.reading}
        </div>
        {/* 3줄: 해석 */}
        <div className="text-xs sm:text-sm font-medium text-white/70 leading-relaxed">
          — {todaysWisdom.meaning}
        </div>
      </div>
    </div>
  );
}
