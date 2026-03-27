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
    <section className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-indigo-50 overflow-hidden relative group/section h-full flex flex-col">
      <div className="flex justify-between items-center mb-10 relative z-10">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <span className="text-3xl animate-bounce">⚡</span> 실시간 AI 랭킹 지표
        </h2>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest mb-1">
            Live AI Index
          </span>
          <span className="text-[9px] text-slate-400 font-medium">
            {new Date(data.updatedAt).toLocaleTimeString()} 업데이트됨
          </span>
        </div>
      </div>

      <div className="space-y-8 relative z-10 flex-grow">
        {data.ranking.map((item, index) => (
          <div 
            key={index} 
            className="group relative flex flex-col gap-3 p-2 transition-all duration-500"
          >
            {/* 상단의 도구 정보 영역 */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                  ${index === 0 ? "bg-indigo-600 text-white" : 
                    index === 1 ? "bg-purple-500 text-white" : 
                    index === 2 ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"}
                `}>
                  {item.rank}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[9px] text-slate-400">{item.developer}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black ${item.trend === 'up' ? 'text-emerald-500' : item.trend === 'down' ? 'text-rose-500' : 'text-slate-400'}`}>
                  {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
                </span>
                <span className="text-lg font-black text-slate-800 tabular-nums">{item.score}%</span>
              </div>
            </div>

            {/* 그래픽 막대 (시각화 강조) */}
            <div className="relative h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 shadow-inner">
              {/* 그리드 눈금선 배경 */}
              <div className="absolute inset-0 flex justify-between px-2 opacity-10">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-px h-full bg-slate-400" />
                ))}
              </div>
              
              {/* 실제 채워지는 데이터 막대 */}
              <div 
                className={`h-full rounded-full transition-all duration-[2000ms] ease-out relative group-hover:brightness-110 shadow-sm`}
                style={{ 
                  width: `${item.score}%`,
                  background: index === 0 ? 'linear-gradient(90deg, #4f46e5, #818cf8, #a5b4fc)' : 
                             index === 1 ? 'linear-gradient(90deg, #9333ea, #c084fc)' : 
                             'linear-gradient(90deg, #0891b2, #22d3ee)'
                }}
              >
                {/* 물결/빛 애니메이션 효과 */}
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                
                {/* 끝부분 포인트 글로우 */}
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40 blur-sm" />
              </div>
            </div>

            {/* 태그 정보 */}
            <div className="flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              {item.tags.map((tag, i) => (
                <span key={i} className="text-[8px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-dashed border-indigo-100">
         <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 font-medium tracking-tighter">
           <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> 점유율</div>
           <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> 신뢰도</div>
           <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span> 혁신성</div>
         </div>
      </div>

      <div className="mt-6 text-center relative z-10">
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed opacity-60">
           글로벌 실시간 검색량과 커뮤니티 언급 빈도를 분석하여<br/>
           <span className="text-indigo-500 font-bold">AI 모델</span>이 산출한 통합 지표입니다.
         </p>
      </div>

      {/* 배경 장식 레이어 */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/20 rounded-full blur-[80px] -z-10 group-hover/section:bg-indigo-100/30 transition-all duration-1000" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-50/20 rounded-full blur-[100px] -z-10" />
    </section>
  );
}
