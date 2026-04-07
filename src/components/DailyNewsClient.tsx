"use client";

import { useState } from "react";

interface NewsData {
  title: string;
  content: string;
}

interface Props {
  data: NewsData[];
  type: "ai" | "economy";
}

export default function DailyNewsClient({ data, type }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const news = data && data.length > 0 ? data[0] : null;

  if (!news) return null;

  const isAi = type === "ai";

  // AI 뉴스 전용 디자인 (Dark & Tech)
  if (isAi) {
    return (
      <div className="rounded-xl p-3 relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-slate-100/50" translate="no">
        <div 
          className="flex flex-col sm:flex-row sm:items-center gap-3 relative z-10 w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex-shrink-0 bg-transparent border border-indigo-400/50 text-indigo-500 text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-widest w-fit">
            AI TREND
          </div>
          
          <div className="flex-grow min-w-0 flex items-center justify-between gap-4">
            <span className="text-sm sm:text-base font-black text-slate-800 truncate flex-grow">
              {news.title}
            </span>
            <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-600 px-2 py-1 flex-shrink-0 transition-colors">
              {isOpen ? "닫기 ▲" : "펼치기 ▼"}
            </button>
          </div>
        </div>
        
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 break-keep whitespace-pre-wrap font-serif">
            {news.content}
          </div>
        )}
      </div>
    );
  }

  // 경제 핫이슈 전용 디자인 (Crisp & White)
  return (
    <div className="p-3 relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-slate-100/50" translate="no">
      <div 
        className="flex flex-col sm:flex-row sm:items-center gap-3 relative z-10 w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-shrink-0 border border-emerald-500 text-emerald-600 text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase w-fit rounded">
          경제 핫이슈
        </div>
        
        <div className="flex-grow min-w-0 flex items-center justify-between gap-4">
          <span className="text-sm sm:text-base font-black text-slate-800 truncate flex-grow">
            {news.title}
          </span>
          <button className="text-[10px] font-bold text-emerald-500 hover:text-emerald-700 underline underline-offset-2 flex-shrink-0">
            {isOpen ? "접기" : "요약 읽기"}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed font-serif animate-in fade-in slide-in-from-top-2 break-keep whitespace-pre-wrap">
          <span className="text-emerald-700 font-bold mr-2">요약:</span>{news.content}
        </div>
      )}
    </div>
  );
}
