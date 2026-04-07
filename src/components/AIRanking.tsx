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

      <div className="space-y-6 flex-grow flex flex-col justify-center relative z-10">
        {data.ranking.slice(0, 3).map((item, idx) => (
          <div key={idx} className="space-y-2 group/item">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[13px] font-black text-slate-800 flex items-center gap-3">
                <span className="text-[11px] text-cyan-600 font-black italic opacity-40 group-hover/item:opacity-100 transition-opacity">#{idx + 1}</span>
                {item.name}
              </span>
              <span className="text-[11px] font-black text-cyan-600 font-mono tracking-tighter bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-100/50">{item.score}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
              <div 
                className={`h-full rounded-full transition-all duration-[1.5s] ease-out shadow-[0_0_15px_rgba(34,211,238,0.4)] ${
                  idx === 0 ? "bg-gradient-to-r from-cyan-400 to-blue-600" : 
                  idx === 1 ? "bg-gradient-to-r from-teal-400 to-cyan-500" : 
                  "bg-gradient-to-r from-blue-300 to-cyan-400"
                }`}
                style={{ width: `${item.score}%` }}
              >
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all group-hover/item:translate-x-1 duration-300">
              {item.tags.slice(0, 2).map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] text-slate-400 font-black tracking-wide border-b border-cyan-200/50">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-3 border-t border-slate-100/50 flex justify-between items-center relative z-10">
        <p className="text-[10px] text-slate-300 italic font-serif">"실시간 AI 트렌드"</p>
        <div className="flex gap-1 opacity-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-cyan-400" />
          ))}
        </div>
      </div>
    </div>
  );
}
