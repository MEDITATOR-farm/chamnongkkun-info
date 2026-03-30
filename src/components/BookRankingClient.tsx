"use client";

import { useState } from "react";

interface Book {
  rank: number;
  title: string;
  author: string;
}

interface BooksData {
  poetry: Book[];
  farming: Book[];
}

export default function BookRankingClient({ data }: { data: BooksData | null }) {
  const [activeTab, setActiveTab] = useState<"poetry" | "farming">("poetry");

  if (!data || (!data.poetry && !data.farming)) return null;

  // 전체적으로 튀지 않고 하늘(Sky) + 연두(Emerald) 계열의 "은은한 베이지/회색" 톤을 적용합니다.
  const isPoetry = activeTab === "poetry";
  const currentList = isPoetry ? data.poetry : data.farming;
  
  const bgClass = isPoetry ? "bg-orange-50/30 border-orange-100/60" : "bg-emerald-50/30 border-emerald-100/60";
  const tabActive = isPoetry ? "bg-orange-100 text-orange-700 shadow-sm" : "bg-emerald-100 text-emerald-700 shadow-sm";
  const tabInactive = "text-slate-400 hover:text-slate-600 hover:bg-slate-50";

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🎖";
  };
  
  // 1,2,3등 별로 게이지 바 막대 그래프(그래픽 형태) 넓이 설정
  const getWidth = (rank: number) => {
     if (rank === 1) return "w-[100%]";
     if (rank === 2) return "w-[75%]";
     if (rank === 3) return "w-[50%]";
     return "w-[25%]";
  };

  return (
    <div className={`mt-4 rounded-xl border p-3 ${bgClass} transition-colors relative overflow-hidden`}>
      {/* 귀여운 은은한 타이틀 바 */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-200/50 pb-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
           <span className={`w-1.5 h-1.5 rounded-full ${isPoetry ? "bg-orange-300" : "bg-emerald-300"} inline-block`} />
           BEST SELLERS
        </h3>
        
        {/* 심플한 미니 탭 버튼 */}
        <div className="flex bg-slate-100/50 rounded-lg p-0.5 shadow-inner">
           <button 
             onClick={() => setActiveTab("poetry")} 
             className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${isPoetry ? "bg-orange-100 text-orange-700 shadow-sm" : tabInactive}`}
           >
             국내 시집
           </button>
           <button 
             onClick={() => setActiveTab("farming")} 
             className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-md transition-all ${!isPoetry ? "bg-emerald-100 text-emerald-700 shadow-sm" : tabInactive}`}
           >
             농업/지식
           </button>
        </div>
      </div>

      {/* 랭킹 리스트 (막대 그래프 그래픽 표현 탑재) */}
      <div className="flex flex-col gap-2 relative z-10">
         {currentList && currentList.length > 0 ? (
           currentList.map((book) => (
             <div key={book.rank} className="relative group">
                {/* 배경 막대 (은은한 진행률 표시) */}
                <div className={`absolute left-0 top-0 h-full ${getWidth(book.rank)} ${isPoetry ? "bg-orange-100/50" : "bg-emerald-100/50"} rounded opacity-50 transition-all -z-10`} />
                
                <div className="flex items-center gap-2.5 p-1.5 px-2 rounded hover:bg-white/50 transition-colors">
                   <div className="text-xl drop-shadow-sm flex-shrink-0 w-6 text-center">{getMedal(book.rank)}</div>
                   <div className="flex-grow min-w-0">
                      <div className="text-[13px] font-bold text-slate-700 truncate leading-tight group-hover:text-slate-900">
                         {book.title}
                      </div>
                      <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                         {book.author}
                      </div>
                   </div>
                </div>
             </div>
           ))
         ) : (
           <div className="text-center text-xs text-slate-400 py-3">데이터를 불러오는 중입니다...</div>
         )}
      </div>
    </div>
  );
}
