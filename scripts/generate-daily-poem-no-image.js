const fs = require('fs');
const path = require('path');

/**
 * 사진이 없을 때 Gemini AI로 새로운 시 한 구절을 생성하여 
 * src/content/daily-poem.json 파일을 업데이트하는 스크립트입니다.
 */

async function generateDailyPoemNoImage() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const OUTPUT_PATH = path.join(process.cwd(), 'src/content/daily-poem.json');

    if (!API_KEY) {
        console.error('❌ 에러: GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.');
        return;
    }

    console.log('🎨 사진이 없으므로 AI를 통해 새로운 시를 추천받습니다...');

    try {
        const prompt = `
            사람들에게 따뜻한 위로나 새로운 시작에 대한 희망을 줄 수 있는 짧고 아름다운 시 한 구절을 추천해줘.
            반드시 박노해 시인의 문체와 비슷한 느낌이면 좋겠어.
            
            항목:
            1. 시의 제목
            2. 본문 내용 (줄바꿈 포함)
            3. 작가명 (박노해)
            4. 출처 (박노해의 걷는 독서)
            
            반드시 아래 JSON 형식으로만 답변해줘. 다른 설명은 필요 없어.
            {
              "title": "추출된 제목",
              "content": "추출된 시 본문\\n줄바꿈 포함",
              "author": "박노해",
              "source": "박노해의 걷는 독서",
              "date": "2026-04-06"
            }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error('AI 분석 결과가 없습니다.');
        }

        let resultText = data.candidates[0].content.parts[0].text;
        resultText = resultText.replace(/```json|```/g, '').trim();
        
        const poemJson = JSON.parse(resultText);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(poemJson, null, 2), 'utf-8');

        console.log('✅ 오늘의 시 업데이트 완료!');
        console.log(`제목: ${poemJson.title}`);
    } catch (error) {
        console.error('❌ 에러 발생:', error.message);
    }
}

generateDailyPoemNoImage();
