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
    <div className="glass group p-4 sm:p-5 rounded-[28px] flex items-center relative overflow-hidden transition-all hover:shadow-xl hover:bg-white/80 border-white/40">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 opacity-80" />
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 relative z-10 w-full">
        {/* 뱃지 프리미엄화 */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full tracking-[0.2em] shadow-lg flex items-center gap-1.5 w-fit">
          <span className="animate-pulse">💡</span> 오늘의 사자성어
        </div>
        
        {/* 뜻과 한자 - 폰트 및 간격 최적화 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-grow min-w-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tighter drop-shadow-sm">{todaysIdiom.hanja}</span>
            <span className="text-[11px] sm:text-xs font-bold text-cyan-600/70 font-serif bg-cyan-50/50 px-1.5 py-0.5 rounded tracking-widest leading-none">({todaysIdiom.chars})</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-slate-200" />
          <span className="text-sm sm:text-base font-semibold text-slate-600 italic opacity-90 truncate max-w-full">
            "{todaysIdiom.meaning}"
          </span>
        </div>
      </div>
    </div>
  );
}
