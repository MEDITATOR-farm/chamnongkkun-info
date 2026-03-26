"use client";

import { useEffect, useState } from "react";

interface RankingItem {
  rank: number;
  name: number;
  menu: string;
  score: number;
  trend: "up" | "down" | "steady";
  tags: string[];
  summary: string;
}

export default function RestaurantRanking() {
  const [data, setData] = useState<{ updatedAt: string; ranking: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/restaurant-ranking.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load ranking:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center text-slate-400">랭킹 로딩 중...</div>;
  if (!data) return <div className="p-4 text-center text-slate-400">데이터가 없습니다.</div>;

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <span>🏆</span> 실시간 맛집 랭킹
        </h2>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
          Updated: {new Date(data.updatedAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-4">
        {data.ranking.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-100"
          >
            {/* 순위 숫자 */}
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg
              ${index === 0 ? "bg-amber-100 text-amber-600 shadow-sm" : 
                index === 1 ? "bg-slate-100 text-slate-600" : 
                index === 2 ? "bg-orange-50 text-orange-600" : "text-slate-400"}
            `}>
              {item.rank}
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1">
                   <span className={`text-[10px] font-black ${item.trend === 'up' ? 'text-red-500' : item.trend === 'down' ? 'text-blue-500' : 'text-slate-400'}`}>
                     {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '-'}
                   </span>
                   <span className="text-xs font-black text-slate-700">{item.score}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{item.menu}</span>
                <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-bold">{item.tags[0]}</span>
              </div>

              {/* 그래픽 막대 (Score 시각화) */}
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out`}
                  style={{ 
                    width: `${item.score}%`,
                    background: index === 0 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
                               index === 1 ? 'linear-gradient(90deg, #64748b, #94a3b8)' : 
                               'linear-gradient(90deg, #3b82f6, #60a5fa)'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-slate-100 text-center">
         <p className="text-[10px] text-slate-400 font-medium">
           AI가 공공데이터와 리뷰를 분석하여 선정한 오늘의 순위입니다.
         </p>
      </div>

      {/* 배경 장식 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl -z-10" />
    </section>
  );
}
