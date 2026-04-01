import { NextResponse } from 'next/server';

export async function GET() {
  const symbols = [
    { id: 1, symbol: '^KS11', name: 'KOSPI' },
    { id: 2, symbol: '^KQ11', name: 'KOSDAQ' },
    { id: 3, symbol: '^GSPC', name: 'S&P 500' },
    { id: 4, symbol: '^IXIC', name: 'NASDAQ' },
    { id: 5, symbol: 'KRW=X', name: '원/달러 환율' },
  ];

  const results = [];
  const maxRetries = 2;

  try {
    // 병렬로 모든 종목 데이터를 동시에 요청합니다 (속도 향상)
    const results = await Promise.all(symbols.map(async (item) => {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
        const res = await fetch(url, { 
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(5000) // 5초 내 응답 없으면 중단
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const data = await res.json();
        const meta = data.chart.result[0].meta;
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.previousClose;
        const changeValue = currentPrice - prevClose;
        const changePercent = (changeValue / prevClose) * 100;
        
        const isUp = changeValue >= 0;
        
        let formattedValue = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        let formattedChange = '';
        
        if (item.symbol === 'KRW=X') {
           formattedValue = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
           formattedChange = Math.abs(changeValue).toFixed(2) + '원';
        } else {
           formattedChange = Math.abs(changePercent).toFixed(2) + '%';
        }

        return {
          id: item.id,
          name: item.name,
          value: formattedValue,
          change: formattedChange,
          isUp: isUp,
          lastUpdated: new Date().toISOString()
        };
      } catch (e) {
        console.error(`${item.name} 페치 실패:`, e.message);
        return {
          id: item.id,
          name: item.name,
          value: "연결 지연",
          change: "-",
          isUp: true
        };
      }
    }));
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
