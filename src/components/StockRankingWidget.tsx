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
        const res = await fetch('/api/stocks');
        if (!res.ok) {
          console.warn("증시 데이터 응답 이상:", res.status);
          return;
        }
        const rawData = await res.json();
        const liveData = rawData.indices;
        if (liveData && Array.isArray(liveData)) {
          // 모든 항목이 '연결 지연'이 아닌, 실제 숫자가 하나라도 포함되어 있는지 확인
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
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group h-full transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 ${isLive ? 'bg-red-50' : 'bg-slate-50'} rounded-bl-full opacity-60 -z-0 transition-all group-hover:scale-110`}></div>
      
      <div className="flex justify-between items-center mb-5 relative z-10">
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
          <span className={`${isLive ? 'animate-pulse' : ''} text-red-500 text-base`}>📈</span> 실시간 증시
        </h3>
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border transition-colors ${isLive ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
          {loading ? "연결 중.." : (isLive ? "실시간 연동" : "지연 데이터")}
        </span>
      </div>

      <div className={`flex-grow flex flex-col justify-between gap-1.5 relative z-10 transition-opacity duration-500 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {displayStocks.map((stock, index) => (
          <div key={stock.id} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black shadow-sm ${index < 2 ? 'bg-red-500 text-white shadow-red-200' : 'bg-slate-100 text-slate-600'}`}>
                {index + 1}
              </span>
              <span className="text-[12px] font-bold text-slate-700">{stock.name}</span>
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
          {loading ? "최신 데이터를 불러오고 있습니다..." : (isLive ? "※ 야후 파이낸스 실시간 데이터를 연동 중입니다" : "※ 연동에 실패하여 임시 데이터를 표시합니다")}
        </p>
      </div>
    </div>
  );
}
