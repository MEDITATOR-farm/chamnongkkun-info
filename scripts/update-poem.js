const fs = require('fs');
const path = require('path');

/**
 * 박노해의 걷는 독서 사진을 읽어 Gemini AI로 텍스트를 추출하고 
 * src/content/daily-poem.json 파일을 업데이트하는 스크립트입니다.
 */

async function updateDailyPoem() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const IMAGE_PATH = path.join(process.cwd(), 'public/poems/today.jpg');
    const OUTPUT_PATH = path.join(process.cwd(), 'src/content/daily-poem.json');

    if (!API_KEY) {
        console.error('❌ 에러: GEMINI_API_KEY 환경변수가 설정되어 있지 않습니다.');
        return;
    }

    if (!fs.existsSync(IMAGE_PATH)) {
        console.error(`❌ 에러: 분석할 사진을 찾을 수 없습니다. (${IMAGE_PATH})`);
        console.log('💡 public/poems/ 폴더에 today.jpg 파일을 넣어주세요.');
        return;
    }

    console.log('🎨 사진 분석을 시작합니다 (AI: Gemini Vision)...');

    try {
        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const base64Image = imageBuffer.toString('base64');

        const prompt = `
            아래 사진 속에서 박노해 시인의 '걷는 독서' 구절을 정확하게 추출해줘.
            
            추출할 항목:
            1. 시의 제목 (만약 없다면 사진 속 상징적인 짧은 문구로 지어줘)
            2. 본문 내용 (줄바꿈을 포함해서 원문 그대로)
            3. 작가명 (박노해)
            4. 출처 (박노해의 걷는 독서)
            
            반드시 아래 JSON 형식으로만 답변해줘. 다른 설명은 필요 없어.
            {
              "title": "추출된 제목",
              "content": "추출된 시 본문\\n줄바꿈 포함",
              "author": "박노해",
              "source": "박노해의 걷는 독서",
              "date": "오늘 날짜(YYYY-MM-DD)"
            }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error('AI 분석 결과가 없습니다.');
        }

        let resultText = data.candidates[0].content.parts[0].text;
        
        // 마크다운 코드 블록 제거
        resultText = resultText.replace(/```json|```/g, '').trim();
        
        // JSON 유효성 검사 및 저장
        const poemJson = JSON.parse(resultText);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(poemJson, null, 2), 'utf-8');

        console.log('✅ 시 구절 업데이트 완료!');
        console.log('---------------------------');
        console.log(`제목: ${poemJson.title}`);
        console.log(`내용: ${poemJson.content.substring(0, 30)}...`);
        console.log('---------------------------');
        console.log('💡 사이트를 빌드하고 푸시하면 즉시 반영됩니다.');

    } catch (error) {
        console.error('❌ 에러 발생:', error.message);
    }
}

updateDailyPoem();
