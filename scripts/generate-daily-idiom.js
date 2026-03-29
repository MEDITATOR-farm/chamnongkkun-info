const fs = require('fs').promises;
const path = require('path');

async function generateDailyIdiom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/idioms.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // AI에게 내리는 명령(프롬프트)
    const prompt = `어렵고 지루한 것 말고, 사람들에게 긍정적인 희망이나 통찰을 줄 수 있는 멋진 사자성어 1개를 추천해줘.
형식은 반드시 아래와 같이 JSON 배열 형태로 만들어야 해:
[
  { "hanja": "사자성어 한글 음", "chars": "한자 표기", "meaning": "쉽게 풀이한 친절한 설명" }
]
다른 말은 절대 덧붙이지 말고 오직 이 JSON 코드만 출력해줘. 매일 요청할 테니까 어제랑 안 겹치는 새롭고 좋은 걸로 골라줘!`;

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
    
    // 마크다운 코드 블록(```json 처럼 덧붙은 글씨) 제거하고 순수 데이터만 추출
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedIdiom = JSON.parse(resultText);

    // 기존의 idioms.json 파일을 지우고, 오늘 새롭게 추천받은 단 1개의 사자성어로 덮어쓰기!
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedIdiom, null, 2), 'utf-8');
    console.log(`오늘의 사자성어 업데이트 성공: ${processedIdiom[0].hanja}`);

  } catch (error) {
    console.error('사자성어 스크립트 실행 중 오류 발생:', error);
  }
}

generateDailyIdiom();
