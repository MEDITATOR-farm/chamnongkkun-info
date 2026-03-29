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
    <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-3xl p-6 md:p-8 border border-white shadow-[0_4px_30px_rgba(0,120,100,0.06)] relative overflow-hidden group">
      {/* 디자인 목적: 연하고 큰 한자 배경 글자 (마우스 올리면 부드럽게 움직임) */}
      <div className="absolute -top-6 -right-4 p-4 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110 group-hover:-rotate-3 pointer-events-none">
        <span className="text-9xl font-serif text-teal-900">{todaysIdiom.chars[0]}</span>
      </div>
      
      <div className="relative z-10">
        <span className="inline-block bg-teal-600 shadow-sm text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg mb-4 tracking-widest">
          💡 오늘의 사자성어
        </span>
        <div className="flex flex-wrap items-end gap-3 mb-2">
          {/* 한글 뜻음 (가장 큼) */}
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-widest font-serif drop-shadow-sm">
            {todaysIdiom.hanja} 
          </h3>
          {/* 한자 표기 (조금 작고 연함) */}
          <span className="text-lg sm:text-xl font-medium text-teal-700/60 tracking-[0.25em] mb-0.5 font-serif">
            ({todaysIdiom.chars})
          </span>
        </div>
        {/* 설명 부분 */}
        <p className="text-teal-900 text-sm sm:text-base font-bold mt-3 leading-relaxed max-w-lg opacity-80 break-keep">
          "{todaysIdiom.meaning}"
        </p>
      </div>
    </div>
  );
}
