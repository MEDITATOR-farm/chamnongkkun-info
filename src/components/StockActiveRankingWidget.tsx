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
        const res = await fetch('/api/stocks');
        if (!res.ok) return;
        
        const data = await res.json();
        const rankingData = data.rankings;
        
        if (rankingData && Array.isArray(rankingData)) {
          const hasRealData = rankingData.some(s => s.value !== "연결 지연");
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
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group h-full transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 ${isLive ? 'bg-amber-50' : 'bg-slate-50'} rounded-bl-full opacity-60 -z-0 transition-all group-hover:scale-110`}></div>
      
      <div className="flex justify-between items-center mb-5 relative z-10">
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
          <span className={`${isLive ? 'animate-bounce' : ''} text-amber-500 text-base`}>🔥</span> 실시간 매수 랭킹
        </h3>
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-colors ${isLive ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
          {loading ? "확인 중.." : "거래 활발"}
        </span>
      </div>

      <div className={`flex-grow flex flex-col justify-between gap-1.5 relative z-10 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {displayStocks.map((stock, index) => (
          <div key={stock.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-amber-50/30 transition-colors border border-transparent hover:border-amber-100/50">
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shadow-sm ${index < 3 ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                {index + 1}
              </span>
              <div>
                <div className="text-[12px] font-bold text-slate-700">{stock.name}</div>
                <div className="text-[9px] text-slate-400 font-medium">{stock.symbol || 'KOSPI'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-black text-slate-800 tracking-tight">{stock.value}</div>
              <div className={`text-[9px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${stock.isUp ? 'text-red-500' : 'text-blue-500'}`}>
                {stock.isUp ? '▲' : '▼'} {stock.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-5 pt-3 border-t border-slate-50 text-center relative z-10">
        <p className="text-[9px] text-slate-400 font-medium tracking-tight">
          ※ 국내 주요 거래 상위 종목 중심의 실시간 랭킹입니다
        </p>
      </div>
    </div>
  );
}
