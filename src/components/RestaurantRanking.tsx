"use client";

import { useEffect, useState } from "react";

interface RankingItem {
  rank: number;
  name: string;
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
          <span className="text-blue-500">📍</span> 거제 추천 맛집
        </h2>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
          지역 정보 기반 보관소
        </span>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {data.ranking.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50 border border-slate-50 hover:border-blue-100"
          >
            {/* 고정 아이콘 (랭킹 숫자 대체) */}
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 truncate leading-tight group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-bold">{item.menu}</span>
                {item.tags.slice(0, 2).map((tag: string, i: number) => (
                  <span key={i} className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-bold">#{tag}</span>
                ))}
              </div>

              <p className="text-xs text-slate-500 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                {item.summary}
              </p>
            </div>

            {/* 링크 버튼 */}
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-blue-600 text-[10px] font-black px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all whitespace-nowrap"
              >
                지도보기
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-slate-100 text-center">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           Verified Local Information
         </p>
      </div>

      {/* 배경 장식 */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-50/30 rounded-full blur-3xl -z-10" />
    </section>
  );
}
