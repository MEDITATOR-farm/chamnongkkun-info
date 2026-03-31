const fs = require('fs').promises;
const path = require('path');

async function generateDailyIdiom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/idioms.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  // 기존 사자성어 읽기 (중복 방지용)
  let currentIdiom = "";
  try {
    const existingData = JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf-8'));
    if (existingData && existingData.length > 0) {
      currentIdiom = existingData[0].hanja;
    }
  } catch (e) {
    // 파일이 없거나 읽기 실패 시 무시
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `사람들에게 긍정적인 희망이나 통찰을 줄 수 있는 멋진 사자성어 1개를 추천해줘.
현재 표시 중인 사자성어는 "${currentIdiom}"이야. **이것과는 무조건 다른 새로운 사자성어**로 골라줘야 해!
형식은 반드시 아래와 같이 JSON 배열 형태로 만들어야 해:
[
  { "hanja": "사자성어 한글 음", "chars": "한자 표기", "meaning": "쉽게 풀이한 친절한 설명" }
]
다른 말은 절대 덧붙이지 말고 오직 이 JSON 코드만 출력해줘. 어제랑 안 겹치는 새롭고 좋은 걸로 골라줘!`;

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
      const processedIdiom = JSON.parse(resultText);

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedIdiom, null, 2), 'utf-8');
      console.log(`오늘의 사자성어 업데이트 성공: ${processedIdiom[0].hanja}`);
      return; // 성공 시 종료

    } catch (error) {
      retryCount++;
      console.error(`사자성어 업데이트 시도 ${retryCount}/${maxRetries} 실패:`, error.message);
      if (retryCount < maxRetries) {
        console.log('3초 후 다시 시도합니다...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('최대 재시도 횟수를 초과했습니다.');
      }
    }
  }
}

generateDailyIdiom();
