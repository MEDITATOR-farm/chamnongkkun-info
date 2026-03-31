const fs = require('fs').promises;
const path = require('path');

async function generateDailyStocks() {
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/stocks.json');
  
  const symbols = [
    { id: 1, symbol: '^KS11', name: 'KOSPI' },
    { id: 2, symbol: '^KQ11', name: 'KOSDAQ' },
    { id: 3, symbol: '^GSPC', name: 'S&P 500' },
    { id: 4, symbol: '^IXIC', name: 'NASDAQ' },
    { id: 5, symbol: 'KRW=X', name: '원/달러 환율' },
  ];

  const results = [];
  const maxRetries = 3;

  for (const item of symbols) {
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
        const res = await fetch(url);
        
        if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
        }
        
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
          isUp: isUp
        });
        success = true;
        
      } catch (e) {
        retryCount++;
        console.error(`${item.name} 업데이트 시도 ${retryCount}/${maxRetries} 실패:`, e.message);
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          results.push({
            id: item.id,
            name: item.name,
            value: "정보 없음",
            change: "-",
            isUp: true
          });
        }
      }
    }
  }

  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(results, null, 2), 'utf-8');
    console.log('실시간 주식 시장 데이터 업데이트 완료!');
  } catch (e) {
    console.error('파일 저장 실패:', e);
  }
}

generateDailyStocks();
