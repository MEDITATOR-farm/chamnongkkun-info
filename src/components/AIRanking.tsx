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

  // Adapt data.ranking to the new structure if needed, or define a new rankingData
  // For this change, we'll assume the new structure is directly applied to data.ranking
  // and map existing properties to the new ones (name -> keyword, score -> score, and assign a color)
  const rankingData = data.ranking.map((item, index) => ({
    keyword: item.name,
    score: item.score,
    color: index === 0 ? 'from-indigo-400 to-indigo-600' :
           index === 1 ? 'from-purple-400 to-purple-600' :
           'from-cyan-400 to-cyan-600'
  }));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full group transition-all hover:border-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">AI 트렌드 지표</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase italic leading-none">Geoje Live</span>
        </div>
      </div>

      <div className="space-y-5 flex-grow flex flex-col justify-center">
        {data.ranking.slice(0, 3).map((item, idx) => (
          <div key={idx} className="space-y-1.5 group/item">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <span className="text-[10px] text-slate-300 font-serif italic">#0{idx + 1}</span>
                {item.name}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{item.score}%</span>
            </div>
            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-50 relative">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  idx === 0 ? "bg-indigo-400" : idx === 1 ? "bg-purple-300" : "bg-cyan-300"
                }`}
                style={{ width: `${item.score}%` }}
              />
            </div>
            {/* 호기심 유발 태그 (Hover 시 살짝 강조) */}
            <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
              {item.tags.slice(0, 2).map((tag, tIdx) => (
                <span key={tIdx} className="text-[9px] text-slate-300 font-medium">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-50 flex justify-between items-center">
        <p className="text-[10px] text-slate-300 italic">"거제도의 실시간 관심사를 반영합니다"</p>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-indigo-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
