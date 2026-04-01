
async function test() {
  const symbol = '^KS11';
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
  
  try {
    const res = await fetch(proxyUrl);
    const data = await res.json();
    const yahooData = JSON.parse(data.contents);
    console.log('Success:', yahooData.chart.result[0].meta.regularMarketPrice);
  } catch (e) {
    console.error('Failed:', e);
  }
}
test();
