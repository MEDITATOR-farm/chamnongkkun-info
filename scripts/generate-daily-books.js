const fs = require('fs').promises;
const path = require('path');

async function generateDailyBooks() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/books.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `당신은 대형 서점의 도서 판매 동향을 꿰뚫고 있는 전문가입니다.
현재를 기준으로, 한국에서 가장 대중적으로 인기 있거나 판매량이 높은 "시집(Poetry)" 3권과, 귀농/농업 기술/텃밭 가꾸기와 연관된 인기 있는 "농사 관련 도서(Farming)" 3권의 랭킹을 작성해 주세요. 
형식은 반드시 다음의 정확한 JSON 형태로 맞춰야 합니다. (다른 말은 절대 추가하지 마세요.)
{
  "poetry": [
    { "rank": 1, "title": "시집 제목", "author": "저자명" },
    { "rank": 2, "title": "시집 제목", "author": "저자명" },
    { "rank": 3, "title": "시집 제목", "author": "저자명" }
  ],
  "farming": [
    { "rank": 1, "title": "농업/귀농 책 제목", "author": "저자명" },
    { "rank": 2, "title": "농업/귀농 책 제목", "author": "저자명" },
    { "rank": 3, "title": "농업/귀농 책 제목", "author": "저자명" }
  ]
}`;

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
    
    // 마크다운 흔적 지우기
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedData = JSON.parse(resultText);

    // public/data/books.json 덮어쓰기
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedData, null, 2), 'utf-8');
    console.log(`오늘의 도서 랭킹 정보 업데이트 성공!`);

  } catch (error) {
    console.error('도서 랭킹 갱신 중 오류 발생:', error);
  }
}

generateDailyBooks();
