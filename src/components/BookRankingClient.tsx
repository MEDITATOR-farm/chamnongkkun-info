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
  
  const bgClass = "bg-transparent";
  const tabActive = isPoetry ? "bg-cyan-500 text-white" : "bg-emerald-500 text-white";
  const tabInactive = "text-slate-400 hover:text-slate-600";

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🎖";
  };
  
  const getWidth = (rank: number) => {
     if (rank === 1) return "w-[100%]";
     if (rank === 2) return "w-[75%]";
     if (rank === 3) return "w-[50%]";
     return "w-[25%]";
  };

  return (
    <div className={`p-4 sm:p-2 ${bgClass} transition-all relative group`}>
      {/* 장식용 은은한 효과 제거됨 */}

      {/* 타이틀 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 relative z-10 border-b border-slate-100/50 pb-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
           <span className={`w-2 h-2 rounded-full ${isPoetry ? "bg-cyan-400 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
           TOP PICKS
        </h3>
        
        {/* 미니 탭 버튼 깔끔하게 */}
        <div className="flex bg-slate-50/50 rounded-lg p-0.5 border border-slate-200/50">
           <button 
             onClick={() => setActiveTab("poetry")} 
             className={`px-3 py-1 text-[10px] font-black rounded-md transition-all duration-300 ${isPoetry ? "bg-white text-slate-800 border border-slate-200/50 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
           >
             국내 시집
           </button>
           <button 
             onClick={() => setActiveTab("farming")} 
             className={`px-3 py-1 text-[10px] font-black rounded-md transition-all duration-300 ${!isPoetry ? "bg-white text-slate-800 border border-slate-200/50 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
           >
             농업/지식
           </button>
        </div>
      </div>

      {/* 랭킹 리스트 */}
      <div className="flex flex-col gap-0.5 relative z-10">
         {currentList && currentList.length > 0 ? (
           currentList.map((book) => (
             <div key={book.rank} className="relative group/item">
                {/* 배경 막대 디자인 개선 */}
                <div className={`absolute left-0 top-0 h-full ${getWidth(book.rank)} ${isPoetry ? "bg-cyan-50/30" : "bg-emerald-50/30"} rounded-lg opacity-0 group-hover/item:opacity-100 transition-all duration-500 -z-10`} />
                
                <div className="flex items-center gap-4 p-2 rounded-lg transition-all hover:translate-x-1">
                   <div className="text-xl flex-shrink-0 w-8 text-center drop-shadow-sm group-hover/item:scale-125 transition-transform">
                     {getMedal(book.rank)}
                   </div>
                   <div className="flex-grow min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate tracking-tight group-hover/item:text-slate-900 leading-tight">
                         {book.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold truncate mt-1 tracking-wide opacity-80">
                         {book.author}
                      </div>
                   </div>
                </div>
             </div>
           ))
         ) : (
           <div className="text-center text-[10px] font-bold text-slate-400 py-6 italic">지식을 채우는 중입니다...</div>
         )}
      </div>
    </div>
  );
}
