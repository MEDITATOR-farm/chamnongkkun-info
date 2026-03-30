const fs = require('fs').promises;
const path = require('path');

async function generateDailyWisdom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/wisdom.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY가 없습니다.');
    return;
  }

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // AI에게 내리는 명령(프롬프트)
    const prompt = `명심보감(明心寶鑑)이나 옛 성현들의 지혜로운 말씀 중에서 사람들의 마음가짐에 도움이 되거나 인생의 깊은 교훈을 주는 짧고 좋은 한자 문구 1개를 추천해줘.
형식은 반드시 아래와 같이 JSON 배열 형태로 만들어야 해:
[
  { "chars": "한자 원문 (예: 忍一時之忿 免百日之憂)", "reading": "한글 음 (예: 인일시지분 면백일지우)", "meaning": "쉽게 풀이한 친절한 설명" }
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
    const processedWisdom = JSON.parse(resultText);

    // 기존의 wisdom.json 파일을 지우고, 오늘 새롭게 추천받은 단 1개의 명심보감으로 덮어쓰기
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedWisdom, null, 2), 'utf-8');
    console.log(`오늘의 명심보감 업데이트 성공: ${processedWisdom[0].chars}`);

  } catch (error) {
    console.error('명심보감 스크립트 실행 중 오류 발생:', error);
  }
}

generateDailyWisdom();
