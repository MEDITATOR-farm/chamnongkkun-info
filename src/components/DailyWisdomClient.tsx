"use client";

import { useState, useEffect } from "react";

export default function DailyWisdomClient({ wisdoms }: { wisdoms: any[] }) {
  const [todaysWisdom, setTodaysWisdom] = useState<any>(null);

  useEffect(() => {
    if (wisdoms && wisdoms.length > 0) {
      // 1년 중 며칠째인지 계산해서 매일 순환하도록 합니다.
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
    <div className="p-4 sm:p-5 flex items-center relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-slate-100/50" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative z-10 w-full">
        {/* 뱃지 */}
        <div className="flex-shrink-0 border border-amber-600 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest whitespace-nowrap w-fit">
          📜 오늘의 명심보감
        </div>
        
        {/* 뜻과 한자 */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row items-baseline gap-x-2 gap-y-0.5">
            <span className="text-base sm:text-lg font-bold text-amber-950 font-serif leading-tight">{todaysWisdom.chars}</span>
            <span className="text-[10px] sm:text-xs font-medium text-amber-800/60 font-serif tracking-[0.05em] flex-shrink-0">({todaysWisdom.reading})</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-amber-900/90 mt-0.5 sm:mt-0 max-w-full">
            — {todaysWisdom.meaning}
          </span>
        </div>
      </div>
    </div>
  );
}
