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
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      setTodaysWisdom(wisdoms[dayOfYear % wisdoms.length]);
    }
  }, [wisdoms]);

  if (!todaysWisdom) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50/40 rounded-2xl p-3 sm:p-4 border border-amber-100/60 shadow-sm flex items-center relative overflow-hidden group transition-all hover:shadow-md mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative z-10 w-full">
        {/* 뱃지 */}
        <div className="flex-shrink-0 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-widest whitespace-nowrap w-fit">
          📜 오늘의 명심보감
        </div>
        
        {/* 뜻과 한자 */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 flex-grow min-w-0">
          <div className="flex items-baseline gap-1 whitespace-nowrap overflow-hidden">
            <span className="text-base sm:text-lg font-bold text-amber-950 font-serif truncate">{todaysWisdom.chars}</span>
            <span className="text-xs sm:text-sm font-medium text-amber-800/60 font-serif tracking-[0.05em] flex-shrink-0">({todaysWisdom.reading})</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-amber-900/90 mt-0.5 sm:mt-0 max-w-full">
            — {todaysWisdom.meaning}
          </span>
        </div>
      </div>
    </div>
  );
}
