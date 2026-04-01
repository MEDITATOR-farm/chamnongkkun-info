"use client";

import { useEffect, useState } from "react";

export default function StockActiveRankingWidget() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        let res = await fetch('/api/stocks');
        let rankingData;
        
        if (res.ok) {
          const data = await res.json();
          rankingData = data.rankings;
        } else {
          // API 실패 시 (정적으로 배포된 환경) 미리 생성된 JSON 파일을 시도합니다.
          const staticRes = await fetch('/data/rankings.json');
          if (staticRes.ok) {
            rankingData = await staticRes.json();
          }
        }
        
        if (rankingData && Array.isArray(rankingData)) {
          const hasRealData = rankingData.some(s => s.value !== "연결 지연" && s.value !== "정보 없음");
          setStocks(rankingData);
          if (hasRealData) setIsLive(true);
        }
      } catch (err) {
        console.error("Stock ranking fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const displayStocks = (stocks && stocks.length > 0) ? stocks : [
    { id: 1, name: "삼성전자", value: "72,400", change: "+1.2%", isUp: true },
    { id: 2, name: "SK하이닉스", value: "182,500", change: "+2.5%", isUp: true },
    { id: 3, name: "LG에너지솔루션", value: "395,000", change: "-0.8%", isUp: false },
    { id: 4, name: "현대차", value: "245,000", change: "+0.5%", isUp: true },
    { id: 5, name: "POSCO홀딩스", value: "382,000", change: "-1.2%", isUp: false },
  ];

  return (
    <div className="glass-card group p-5 sm:p-6 rounded-[32px] flex flex-col relative overflow-hidden h-full transition-all border-white/40">
      {/* 배경 장식 효과 */}
      <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${isLive ? 'bg-amber-200/20' : 'bg-slate-200/20'} rounded-full blur-3xl opacity-60 -z-0 transition-all group-hover:scale-150`}></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span className={`${isLive ? 'animate-float' : ''} text-lg`}>🔥</span> 
          매수 랭킹
        </h3>
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm transition-all ${isLive ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
          {loading ? "확격 중" : "ACTIVE"}
        </span>
      </div>

      <div className={`flex-grow flex flex-col gap-2.5 relative z-10 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {displayStocks.map((stock, index) => (
          <div key={stock.id} className="flex items-center justify-between px-3 py-3 rounded-[20px] hover:bg-white/40 transition-all border border-transparent hover:border-white/60 hover:shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black shadow-sm transition-transform group-hover:rotate-12 ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {index + 1}
              </span>
              <div>
                <div className="text-[13px] font-black text-slate-700 tracking-tight">{stock.name}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{stock.symbol || 'KOSPI'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-black text-slate-900 tracking-tighter drop-shadow-sm">{stock.value}</div>
              <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${stock.isUp ? 'text-orange-600' : 'text-blue-600'}`}>
                {stock.isUp ? '▲' : '▼'} {stock.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20 text-center relative z-10">
        <p className="text-[10px] text-slate-400 font-bold italic opacity-60">
          ※ 국내 주요 거래 상위 종목 기반
        </p>
      </div>
    </div>
  );
}
