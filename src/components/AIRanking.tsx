"use client";

import { useEffect, useState } from "react";

interface AIRankingItem {
  rank: number;
  name: string;
  developer: string;
  score: number;
  trend: "up" | "down" | "steady";
  tags: string[];
  summary: string;
  link: string;
}

export default function AIRanking() {
  const [data, setData] = useState<{ updatedAt: string; ranking: AIRankingItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/ai-ranking.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load AI ranking:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center text-slate-400 text-xs italic">AI 지표 분석 중...</div>;
  if (!data) return <div className="p-4 text-center text-slate-400 text-xs">데이터 연결 실패</div>;

  return (
    <div className="group p-4 sm:p-2 flex flex-col h-full bg-transparent transition-all">
      <div className="flex justify-between items-center mb-6 relative z-10 border-b border-slate-100/50 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">📊</span>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">AI Insights</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-glow" />
          <span className="text-[10px] font-black text-slate-400 font-mono tracking-widest italic leading-none uppercase">Geoje Pulse</span>
        </div>
      </div>

      <div className="flex flex-row items-end justify-between h-[220px] pt-14 pb-14 relative z-10 px-4 gap-6">
        {data.ranking.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group/item relative">
            {/* 점수 라벨 (상단) */}
            <div className="absolute -top-7 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:-translate-y-1 duration-500 z-20">
              <span className="text-[10px] font-black text-cyan-600 font-mono tracking-tighter bg-white shadow-md border border-cyan-100/50 px-2 py-0.5 rounded-full">
                {item.score}%
              </span>
            </div>
            
            {/* 세로 막대 */}
            <div className="w-full max-w-[40px] bg-slate-100/50 rounded-t-xl overflow-hidden h-full flex flex-col justify-end relative shadow-inner">
               <div 
                 className={`w-full rounded-t-xl transition-all duration-[1.5s] ease-out shadow-[0_0_15px_rgba(34,211,238,0.25)] ${
                   idx === 0 ? "bg-gradient-to-t from-cyan-400 to-blue-600" : 
                   idx === 1 ? "bg-gradient-to-t from-teal-400 to-cyan-500" : 
                   "bg-gradient-to-t from-blue-300 to-cyan-400"
                 }`}
                 style={{ height: `${item.score}%` }}
               >
                 <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
               </div>
            </div>

            {/* 이름 및 정보 (하단) */}
            <div className="absolute -bottom-12 w-full flex flex-col items-center text-center">
              <span className="text-[11px] font-black text-slate-800 leading-tight truncate w-full px-1 mb-0.5">
                {item.name}
              </span>
              <span className="text-[9px] text-cyan-600 font-black italic opacity-40">#{idx + 1}</span>
              
              {/* 호버 시 나타나는 태그 */}
              <div className="flex gap-1 mt-1 opacity-0 group-hover/item:opacity-100 transition-all duration-300 absolute -bottom-4 whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-slate-100">
                {item.tags.slice(0, 1).map((tag, tIdx) => (
                  <span key={tIdx} className="text-[8px] text-slate-400 font-black tracking-wide">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-3 border-t border-slate-100/50 flex justify-between items-center relative z-10">
        <p className="text-[10px] text-slate-300 italic font-serif">"실시간 AI 트렌드 차트"</p>
        <div className="flex gap-1 opacity-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-cyan-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
