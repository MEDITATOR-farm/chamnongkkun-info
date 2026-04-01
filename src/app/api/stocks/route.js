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
    for (const item of symbols) {
      let retryCount = 0;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
          const res = await fetch(url, { next: { revalidate: 60 } }); // 1분간 캐시 유지
          
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          
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

          results.push({
            id: item.id,
            name: item.name,
            value: formattedValue,
            change: formattedChange,
            isUp: isUp,
            lastUpdated: new Date().toISOString()
          });
          success = true;
          
        } catch (e) {
          retryCount++;
          if (retryCount >= maxRetries) {
            results.push({
              id: item.id,
              name: item.name,
              value: "연결 중..",
              change: "-",
              isUp: true
            });
          }
        }
      }
    }
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}
