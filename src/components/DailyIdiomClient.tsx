"use client";

import { useState, useEffect } from "react";

export default function DailyIdiomClient({ idioms }: { idioms: any[] }) {
  const [todaysIdiom, setTodaysIdiom] = useState<any>(null);

  useEffect(() => {
    if (idioms && idioms.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      setTodaysIdiom(idioms[dayOfYear % idioms.length]);
    }
  }, [idioms]);

  if (!todaysIdiom) return null;

  return (
    <div className="group p-4 sm:p-5 flex items-center relative overflow-hidden transition-all bg-transparent border-b border-white/10" translate="no">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-cyan-400 opacity-50" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 relative z-10 w-full">
        <div className="flex-shrink-0 border border-white/25 text-white/60 text-[9px] font-black px-2 py-0.5 rounded tracking-widest flex items-center gap-1.5 w-fit">
          💡 오늘의 사자성어
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-grow min-w-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-black text-white font-serif tracking-tighter">{todaysIdiom.hanja}</span>
            <span className="text-[11px] sm:text-xs font-bold text-cyan-300 font-serif bg-cyan-400/15 px-1.5 py-0.5 rounded tracking-widest leading-none">({todaysIdiom.chars})</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-white/20" />
          <span className="text-sm sm:text-base font-semibold text-white/75 italic truncate max-w-full">
            "{todaysIdiom.meaning}"
          </span>
        </div>
      </div>
    </div>
  );
}
