const fs = require('fs').promises;
const path = require('path');

async function generateDailyAINews() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/ai-news.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `당신은 최신 IT 트렌드 전문 기자입니다. 최신 "인공지능(AI)" 관련 기술 동향, 출시 소식, 혹은 핫이슈 뉴스 중 단 1개를 선택해서 사람들에게 유익하게 요약해 주세요. 
형식은 반드시 다음의 JSON 배열 형태로 맞춰주세요:
[
  { 
    "title": "한 줄짜리 흥미로운 뉴스 헤드라인",
    "content": "뉴스의 핵심 내용과 시사점을 2~3줄로 쉽게 풀어쓴 상세 내용"
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
      console.log(`오늘의 AI 뉴스 업데이트 성공: ${processedData[0].title}`);
      return; // 성공 시 종료

    } catch (error) {
      retryCount++;
      console.error(`AI 뉴스 업데이트 시도 ${retryCount}/${maxRetries} 실패:`, error.message);
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('최대 재시도 횟수를 초과했습니다.');
      }
    }
  }
}

generateDailyAINews();
