import { NextResponse } from 'next/server';

export async function GET() {
  const indexSymbols = [
    { id: 1, symbol: '^KS11', name: 'KOSPI' },
    { id: 2, symbol: '^KQ11', name: 'KOSDAQ' },
    { id: 3, symbol: '^GSPC', name: 'S&P 500' },
    { id: 4, symbol: '^IXIC', name: 'NASDAQ' },
    { id: 5, symbol: 'KRW=X', name: '원/달러 환율' },
  ];

  const rankingSymbols = [
    { id: 1, symbol: '005930.KS', name: '삼성전자' },
    { id: 2, symbol: '000660.KS', name: 'SK하이닉스' },
    { id: 3, symbol: '373220.KS', name: 'LG에너지솔루션' },
    { id: 4, symbol: '005380.KS', name: '현대차' },
    { id: 5, symbol: '005490.KS', name: 'POSCO홀딩스' },
    { id: 6, symbol: '068270.KS', name: '셀트리온' },
    { id: 7, symbol: '000270.KS', name: '기아' },
  ];

  const fetchStockData = async (item) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
      const res = await fetch(url, { 
        next: { revalidate: 60 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const data = await res.json();
      const meta = data.chart.result[0].meta;
      const currentPrice = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      const changeValue = currentPrice - prevClose;
      const changePercent = (changeValue / prevClose) * 100;
      
      const isUp = changeValue >= 0;
      
      let formattedValue = currentPrice.toLocaleString(undefined, { minimumFractionDigits: item.symbol === 'KRW=X' ? 2 : 0, maximumFractionDigits: 2 });
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
        symbol: item.symbol,
        value: formattedValue,
        change: formattedChange,
        isUp: isUp,
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
  };

  try {
    const [indices, rankings] = await Promise.all([
      Promise.all(indexSymbols.map(fetchStockData)),
      Promise.all(rankingSymbols.map(fetchStockData))
    ]);
    
    return NextResponse.json({ indices, rankings, lastUpdated: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
