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
      <div className="bg-[#0f172a] rounded-xl p-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.15)] relative overflow-hidden group transition-all mt-4">
        {/* 장식용 은은한 글로우 효과 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>

        <div 
          className="flex flex-col sm:flex-row sm:items-center gap-3 relative z-10 w-full cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* 사이버네틱 무드의 뱃지 */}
          <div className="flex-shrink-0 bg-transparent border border-indigo-400 text-indigo-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded tracking-widest w-fit shadow-[0_0_8px_rgba(99,102,241,0.3)]">
            <span className="mr-1 animate-pulse inline-block">●</span> AI TREND
          </div>
          
          <div className="flex-grow min-w-0 flex items-center justify-between gap-4">
            <span className="text-sm sm:text-base font-bold text-slate-100 truncate flex-grow drop-shadow-md">
              {news.title}
            </span>
            <button 
              className="text-[10px] sm:text-xs font-bold text-indigo-300 hover:text-indigo-100 px-2 py-1 flex-shrink-0 transition-colors bg-indigo-900/40 rounded border border-indigo-500/20"
              aria-label="자세히 보기"
            >
              {isOpen ? "Collapse ✕" : "Expand 💬"}
            </button>
          </div>
        </div>
        
        {/* 상세 내용 아코디언 */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-indigo-500/20 text-sm sm:text-base text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-2 break-keep whitespace-pre-wrap font-sans">
            {news.content}
          </div>
        )}
      </div>
    );
  }

  // 경제 핫이슈 전용 디자인 (Crisp & White)
  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 border-l-4 border-l-emerald-600 border-y border-r border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-md mt-4">
      <div 
        className="flex flex-col sm:flex-row sm:items-center gap-3 relative z-10 w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 전문적인 뉴스룸 무드의 뱃지 */}
        <div className="flex-shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase w-fit rounded-sm">
          경제 핫이슈 📈
        </div>
        
        <div className="flex-grow min-w-0 flex items-center justify-between gap-4">
          <span className="text-sm sm:text-base font-bold text-slate-800 truncate flex-grow">
            {news.title}
          </span>
          <button 
            className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-emerald-700 underline underline-offset-2 flex-shrink-0 transition-colors"
            aria-label="요약 읽기"
          >
            {isOpen ? "접기" : "요약 읽기"}
          </button>
        </div>
      </div>
      
      {/* 상세 내용 아코디언 */}
      {isOpen && (
        <div className="mt-4 pt-3 border-t-2 border-slate-100 text-sm sm:text-base text-slate-600 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2 break-keep whitespace-pre-wrap">
          <span className="text-emerald-700 font-bold mr-2">요약:</span>{news.content}
        </div>
      )}
    </div>
  );
}
