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

  if (loading) return <div className="p-4 text-center text-slate-400">AI 랭킹 분석 중...</div>;
  if (!data) return <div className="p-4 text-center text-slate-400">데이터를 찾을 수 없습니다.</div>;

  return (
    <section className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-50 overflow-hidden relative group/section">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <span className="text-3xl animate-pulse">🤖</span> 실시간 생성형 AI 랭킹
        </h2>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
            AI Usage Index
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(data.updatedAt).toLocaleString('ko-KR')} 기준
          </span>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {data.ranking.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex items-center gap-5 p-4 rounded-3xl transition-all duration-500 hover:bg-indigo-50/50 border border-transparent hover:border-indigo-100/50"
          >
            {/* 순위 숫자 */}
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-110
              ${index === 0 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : 
                index === 1 ? "bg-purple-100 text-purple-600" : 
                index === 2 ? "bg-cyan-100 text-cyan-600" : "bg-slate-50 text-slate-400"}
            `}>
              {item.rank}
            </div>

            {/* 정보 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-extrabold text-slate-800 truncate leading-tight group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold">{item.developer}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                   <div className="flex items-center gap-1">
                      <span className={`text-xs font-black ${item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                        {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
                      </span>
                      <span className="text-lg font-black text-slate-700">{item.score}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="text-[9px] text-indigo-500 bg-indigo-50/50 px-2 py-0.5 rounded-full font-bold border border-indigo-100/30">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 스코어 바 */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-[1500ms] ease-out w-0 group-hover:w-[${item.score}%]`}
                  style={{ 
                    width: `${item.score}%`,
                    background: index === 0 ? 'linear-gradient(90deg, #4f46e5, #818cf8)' : 
                               index === 1 ? 'linear-gradient(90deg, #9333ea, #c084fc)' : 
                               'linear-gradient(90deg, #0891b2, #22d3ee)'
                  }}
                />
              </div>
            </div>

            {/* 바로가기 */}
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all"
              title="사이트 방문"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-dashed border-indigo-100 text-center relative z-10">
         <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
           글로벌 실시간 검색량과 커뮤니티 언급 빈도를 분석하여<br/>
           <span className="text-indigo-500 font-bold">chamnongkkun AI 모델</span>이 산출한 랭킹입니다.
         </p>
      </div>

      {/* 배경 데코레이션 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-[100px] -z-0 group-hover/section:bg-indigo-100/40 transition-colors" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/20 rounded-full blur-[80px] -z-0" />
    </section>
  );
}
