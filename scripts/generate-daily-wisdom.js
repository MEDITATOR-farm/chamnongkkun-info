const fs = require('fs').promises;
const path = require('path');

async function generateDailyWisdom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/wisdom.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  // 기존 명심보감 읽기 (중복 방지용)
  let currentWisdom = "";
  try {
    const existingData = JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf-8'));
    if (existingData && existingData.length > 0) {
      currentWisdom = existingData[0].chars;
    }
  } catch (e) {
    // 파일이 없거나 읽기 실패 시 무시
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `명심보감(明心寶鑑)이나 옛 성현들의 지혜로운 말씀 중에서 인생의 교훈을 주는 짧고 좋은 한자 문구 1개를 추천해줘.
**중요: 문구가 'A하고 B하다' 식의 대구(對句)로 이루어져 있다면, 끊지 말고 온전한 두 구절을 모두 포함해줘!** (예: '靜坐常思己過 閑談莫論人非' 처럼 두 마디를 다 써줘)
현재 표시 중인 문구는 "${currentWisdom}"이야. **이것과는 다른 새로운 문구**로 골라줘야 해!
형식은 반드시 아래와 같이 JSON 배열 형태로 만들어야 해:
[
  { "chars": "한자 원문 (예: 忍一時之忿 免百日之憂)", "reading": "한글 음 (예: 인일시지분 면백일지우)", "meaning": "쉽게 풀이한 친절한 설명" }
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
      const processedWisdom = JSON.parse(resultText);

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedWisdom, null, 2), 'utf-8');
      console.log(`오늘의 명심보감 업데이트 성공: ${processedWisdom[0].chars}`);
      return; // 성공 시 종료

    } catch (error) {
      retryCount++;
      console.error(`명심보감 업데이트 시도 ${retryCount}/${maxRetries} 실패:`, error.message);
      if (retryCount < maxRetries) {
        console.log('3초 후 다시 시도합니다...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('최대 재시도 횟수를 초과했습니다.');
      }
    }
  }
}

generateDailyWisdom();
