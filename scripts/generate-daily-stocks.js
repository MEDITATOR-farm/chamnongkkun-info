const fs = require('fs').promises;
const path = require('path');

async function generateDailyStocks() {
  const STOCKS_PATH = path.join(__dirname, '../public/data/stocks.json');
  const RANKINGS_PATH = path.join(__dirname, '../public/data/rankings.json');
  
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

  const fetchData = async (item) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const meta = data.chart.result[0].meta;
      const currentPrice = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      const changeValue = currentPrice - prevClose;
      const changePercent = (changeValue / prevClose) * 100;
      
      return {
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        value: currentPrice.toLocaleString(undefined, { minimumFractionDigits: item.symbol === 'KRW=X' ? 2 : 0, maximumFractionDigits: 2 }),
        change: item.symbol === 'KRW=X' ? Math.abs(changeValue).toFixed(2) + '원' : Math.abs(changePercent).toFixed(2) + '%',
        isUp: changeValue >= 0
      };
    } catch (e) {
      console.error(`${item.name} 실패:`, e.message);
      return { id: item.id, name: item.name, value: "정보 없음", change: "-", isUp: true };
    }
  };

  const stocks = await Promise.all(indexSymbols.map(fetchData));
  const rankings = await Promise.all(rankingSymbols.map(fetchData));

  await fs.mkdir(path.dirname(STOCKS_PATH), { recursive: true });
  await fs.writeFile(STOCKS_PATH, JSON.stringify(stocks, null, 2), 'utf-8');
  await fs.writeFile(RANKINGS_PATH, JSON.stringify(rankings, null, 2), 'utf-8');
  console.log('증시 데이터 파일 저장 완료!');
}

generateDailyStocks();
