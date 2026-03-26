const fs = require('fs').promises;
const path = require('path');

async function updateRestaurantRanking() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/restaurant-ranking.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    return;
  }

  try {
    console.log('실시간 맛집 랭킹 생성 중 (AI 기반)...');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // 거제도 9미(9가지 맛)와 현지인 추천 맛집 정보를 기반으로 랭킹 생성 유도
    const prompt = `거제도 현지인들과 관광객들에게 가장 인기 있는 맛집 TOP 5를 선정해줘. 
거제 9미(대구탕, 굴 요리, 멍게비빔밥, 도다리쑥국, 물회, 볼락구이, 생대구탕, 거제 한우, 거제 숭어) 정보를 참고해서, 
실제로 유명한 식당 이름과 메뉴를 아래 JSON 형식으로 응답해줘.

형식:
[
  {
    "rank": 1,
    "name": "식당 이름",
    "menu": "대표 메뉴",
    "score": 98,
    "trend": "up", // up, down, steady
    "tags": ["가족외식", "경치좋은", "현지인맛집"],
    "summary": "AI 한줄 평",
    "link": "네이버 지도 또는 식당 정보 URL (없으면 해당 식당 이름을 네이버에서 검색하는 주소)"
  },
  ... (총 5개)
]

반드시 순수 JSON 객체(배열)만 출력해.`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API 호출 실패: ${response.status}`);
    }

    const json = await response.json();
    let resultText = json.candidates[0].content.parts[0].text.trim();
    resultText = resultText.replace(/```json|```/g, '').trim();

    const rankingData = JSON.parse(resultText);

    // 저장
    const finalData = {
      updatedAt: new Date().toISOString(),
      ranking: rankingData
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log('🎉 맛집 랭킹 업데이트 완료!');

  } catch (error) {
    console.error('맛집 랭킹 업데이트 중 오류 발생:', error);
  }
}

updateRestaurantRanking();
