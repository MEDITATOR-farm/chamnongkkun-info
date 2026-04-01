"use client";

import { useEffect, useState } from "react";

export default function StockRankingWidget({ data }: { data?: any[] }) {
  const [stocks, setStocks] = useState<any[]>(data || []);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        let res = await fetch('/api/stocks');
        let liveData;
        
        if (res.ok) {
          const rawData = await res.json();
          liveData = rawData.indices;
        } else {
          // API 실패 시 (정적 배포 환경 등) 미리 생성된 JSON 파일을 시도합니다.
          const staticRes = await fetch('/data/stocks.json');
          if (staticRes.ok) {
            liveData = await staticRes.json();
          }
        }

        if (liveData && Array.isArray(liveData)) {
          const hasRealData = liveData.some(s => s.value !== "연결 지연" && s.value !== "정보 없음");
          setStocks(liveData);
          if (hasRealData) setIsLive(true);
        }
      } catch (err) {
        console.error("Stock fetch error:", err);
        // 실패 시 props로 전달받은 데이터나 기본 데이터 유지
        if (!data || data.length === 0) {
           // 데이터가 아예 없을 때만 기본값(필요 시) 유지
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    
    // 3분마다 자동 갱신
    const interval = setInterval(fetchStocks, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [data]);

  const displayStocks = (stocks && stocks.length > 0) ? stocks : [
    { id: 1, name: "KOSPI", value: "2,748.56", change: "+1.2%", isUp: true },
    { id: 2, name: "KOSDAQ", value: "912.45", change: "+0.8%", isUp: true },
    { id: 3, name: "S&P 500", value: "5,234.18", change: "-0.3%", isUp: false },
    { id: 4, name: "NASDAQ", value: "16,401.84", change: "-0.5%", isUp: false },
    { id: 5, name: "원/달러 환율", value: "1,345.50", change: "-2.5원", isUp: false },
  ];

  return (
    <div className="glass-card group p-5 sm:p-6 rounded-[32px] flex flex-col relative overflow-hidden h-full transition-all border-white/40">
      {/* 장식용 은은한 오라 효과 추가 */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${isLive ? 'bg-cyan-200/30' : 'bg-slate-200/30'} rounded-full blur-3xl opacity-60 -z-0 transition-all group-hover:scale-150`}></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span className={`${isLive ? 'animate-float' : ''} text-lg`}>📈</span> 
          실시간 증시
        </h3>
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shadow-sm transition-all ${isLive ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
          {loading ? "연결 중" : (isLive ? "LIVE" : "DELAYED")}
        </span>
      </div>

      <div className={`flex-grow flex flex-col gap-2 relative z-10 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {displayStocks.map((stock, index) => (
          <div key={stock.id} className="flex items-center justify-between px-3 py-3 rounded-[18px] hover:bg-white/40 transition-all border border-transparent hover:border-white/60 hover:shadow-sm">
            <div className="flex items-center gap-4">
              <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black shadow-sm transition-transform group-hover:scale-110 ${index < 2 ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {index + 1}
              </span>
              <span className="text-[13px] font-black text-slate-700 tracking-tight">{stock.name}</span>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-black text-slate-900 tracking-tighter drop-shadow-sm">{stock.value}</div>
              <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 mt-0.5 ${stock.isUp ? 'text-cyan-600' : 'text-blue-600'}`}>
                {stock.isUp ? '▲' : '▼'} {stock.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20 text-center relative z-10">
        <p className="text-[10px] text-slate-400 font-bold italic opacity-60">
          {loading ? "데이터 수집 중..." : "※ Powered by Yahoo Finance"}
        </p>
      </div>
    </div>
  );
}
