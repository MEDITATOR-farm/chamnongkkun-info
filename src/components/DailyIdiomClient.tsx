"use client";

import { useState, useEffect } from "react";

export default function DailyIdiomClient({ idioms }: { idioms: any[] }) {
  const [todaysIdiom, setTodaysIdiom] = useState<any>(null);

  useEffect(() => {
    if (idioms && idioms.length > 0) {
      // 1년 중 며칠째인지(day of the year) 계산해서, 매일 자정마다 알아서 바뀌도록 무작위 선택합니다.
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // 전체 사자성어 개수로 나눈 나머지를 사용해 순환시킵니다.
      setTodaysIdiom(idioms[dayOfYear % idioms.length]);
    }
  }, [idioms]);

  // 불러오기 전이거나 파일에 사자성어가 비어있을 땐 창을 비워둡니다.
  if (!todaysIdiom) return null;

  return (
    <div className="bg-gradient-to-r from-teal-50 to-emerald-50/30 rounded-2xl p-3 sm:p-4 border border-teal-100/50 shadow-sm flex items-center relative overflow-hidden group transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative z-10 w-full">
        {/* 뱃지 */}
        <div className="flex-shrink-0 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-widest whitespace-nowrap w-fit">
          💡 오늘의 사자성어
        </div>
        
        {/* 뜻과 한자 */}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 flex-grow min-w-0">
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-base sm:text-lg font-bold text-slate-800 font-serif">{todaysIdiom.hanja}</span>
            <span className="text-xs sm:text-sm font-medium text-teal-700/60 font-serif tracking-[0.1em]">({todaysIdiom.chars})</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-teal-900/80 mt-0.5 sm:mt-0 opacity-90 truncate max-w-full">
            — {todaysIdiom.meaning}
          </span>
        </div>
      </div>
    </div>
  );
}
