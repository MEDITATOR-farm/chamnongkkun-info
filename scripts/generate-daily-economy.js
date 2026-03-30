const fs = require('fs').promises;
const path = require('path');

async function generateDailyEconomy() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/economy.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `당신은 친절한 경제 전문가입니다. 
당일 기준 전 세계 또는 한국 금융시장, 주식, 부동산, 생활경제와 관련된 가장 중요한 "경제 핫이슈" 1개를 골라서 핵심만 쉽게 설명해 주세요. 
형식은 반드시 다음의 JSON 배열 형태로 맞춰주세요:
[
  { 
    "title": "한 줄짜리 직관적인 경제 뉴스 요약 제목",
    "content": "이 이슈가 왜 중요하고 개인의 경제생활에 어떤 영향을 미치는지 2~3줄로 쉽게 쓴 상세 내용"
  }
]
다른 응답이나 인사말 없이 오직 위 JSON 배열 포맷만 출력하세요.`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status}`);
    }

    const geminiJson = await geminiResponse.json();
    let resultText = geminiJson.candidates[0].content.parts[0].text;
    
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedData = JSON.parse(resultText);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedData, null, 2), 'utf-8');
    console.log(`오늘의 경제 핫이슈 업데이트 성공: ${processedData[0].title}`);

  } catch (error) {
    console.error('경제 핫이슈 갱신 중 오류 발생:', error);
  }
}

generateDailyEconomy();
