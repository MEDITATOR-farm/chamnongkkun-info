const fs = require('fs').promises;
const path = require('path');

async function generateDailyStocks() {
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/stocks.json');
  
  // 조회할 주식 기호 (무료 공개 데이터인 야후 파이낸스 기준입니다)
  const symbols = [
    { id: 1, symbol: '^KS11', name: 'KOSPI' },
    { id: 2, symbol: '^KQ11', name: 'KOSDAQ' },
    { id: 3, symbol: '^GSPC', name: 'S&P 500' },
    { id: 4, symbol: '^IXIC', name: 'NASDAQ' },
    { id: 5, symbol: 'KRW=X', name: '원/달러 환율' },
  ];

  const results = [];

  for (const item of symbols) {
    try {
      // 복잡한 키우주식 API 가입 없이 공개된 야후 주소에서 데이터를 가져옵니다.
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${item.symbol}`;
      const res = await fetch(url);
      const data = await res.json();
      
      const meta = data.chart.result[0].meta;
      const currentPrice = meta.regularMarketPrice; // 현재 가격
      const prevClose = meta.previousClose;         // 어제 마감 가격
      const changeValue = currentPrice - prevClose; // 가격 변동 폭
      const changePercent = (changeValue / prevClose) * 100; // 변동 %
      
      // 값이 0보다 크거나 같으면 올랐다고 판단합니다.
      const isUp = changeValue >= 0;
      
      // 가격이 너무 기니까 소수점 2자리까지만 예쁘게 끊어서 ,(콤마) 찍어줍니다.
      let formattedValue = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      let formattedChange = '';
      
      // 환율일 경우 표시 방식을 다르게 설정합니다. (원 단위)
      if (item.symbol === 'KRW=X') {
         formattedValue = currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
         formattedChange = Math.abs(changeValue).toFixed(2) + '원';
         
         // 환율은 오르는 게 오히려 '빨간색(하락/손실)' 느낌일 수 있지만, 한국 증시 화면처럼 통일해서
         // 환율은 값이 오르면 빨간색, 내리면 파란색으로 일단 단순하게 적용합니다.
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
      
    } catch (e) {
      console.error(`${item.name} 데이터를 가져오는 중 오류 발생:`, e);
      // 만약 인터넷 문제가 생기면 기본 빈칸으로 채워줍니다.
      results.push({
        id: item.id,
        name: item.name,
        value: "정보 없음",
        change: "-",
        isUp: true
      });
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
