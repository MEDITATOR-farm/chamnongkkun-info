const fs = require('fs').promises;
const path = require('path');

async function backfillEventDetails() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    return;
  }

  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    let updatedCount = 0;

    console.log('총 항목 수:', db.events.length + db.benefits.length, '. 상세 내용 생성 중...');

    // 모든 이벤트와 혜택 처리
    const allItems = [...db.events, ...db.benefits];

    for (const item of allItems) {
      if (item.detailContent) continue; // 이미 있다면 건너뜀

      console.log(`[${item.name}] 상세 글 생성 중...`);

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `당신은 '참농꾼 소식통' 블로그의 수석 작가입니다. 
아래 공공 정보를 바탕으로 주민들에게 정감이 가고 상세한 '블로그 스타일'의 상세 설명을 작성해 주세요.

정보: ${JSON.stringify(item, null, 2)}

형식 지침:
1. 마크다운(Markdown) 형식을 사용하세요.
2. 제목은 제외하고 본문(내용)만 작성하세요.
3. 소제목(###), 글머리 기호(-), 굵게(**) 등을 활용해 가독성을 높이세요.
4. 추천 이유 3가지, 즐기는 팁, 주의사항 또는 신청 방법 등을 포함해 800자 내외로 정성껏 작성해 주세요.
5. 말투는 "~해요", "~입니다"와 같이 친근하고 정감 있는 블로그 톤으로 하세요.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        console.error(`Gemini 호출 실패 (${item.name}):`, response.status);
        continue;
      }

      const json = await response.json();
      const resultText = json.candidates[0].content.parts[0].text.trim();
      
      item.detailContent = resultText;
      updatedCount++;
      
      // API 할당량 제한을 고려해 약간의 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (updatedCount > 0) {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
      console.log(`🎉 ${updatedCount}개의 항목에 상세 내용이 추가되었습니다!`);
    } else {
      console.log('이미 모든 항목이 업데이트되어 있습니다.');
    }

  } catch (error) {
    console.error('백필 중 오류 발생:', error);
  }
}

backfillEventDetails();
