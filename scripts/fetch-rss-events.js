const fs = require('fs').promises;
const path = require('path');

async function fetchRssEvents() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');
  const RSS_URL = 'http://www.geoje.go.kr/board/openApi/rss.geoje?boardId=BBS_0000008';

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    return;
  }

  try {
    console.log('거제시청 RSS 피드 가져오는 중...');
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`RSS 요청 실패: ${response.status}`);
    }
    const xmlText = await response.text();

    // RSS 피드에서 항목 추출 (단순 문자열 매칭으로 <item> 태그 추출)
    const items = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
    console.log(`총 ${items.length}개의 항목을 찾았습니다. AI 분석을 시작합니다...`);

    if (items.length === 0) return;

    // 최근 10개 항목만 AI에게 전달하여 분석 (효율성)
    const recentItems = items.slice(0, 10).join('\n');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `아래는 거제시청의 최신 공고 RSS 데이터야. 
이 중에서 '축제', '문화 행사', '시민 혜택', '지원금' 등 일반 시민들에게 매우 유익하고 흥미로운 소식만 **최대 1건** 찾아줘. 
행정적인 단순 공고(입찰, 결과 발표 등)는 무시해.

있다면 아래 JSON 형식으로 응답해줘. 만약 진짜로 중요한 소식이 하나도 없다면 null 이라고만 답해.

형식:
{
  "name": "행사/소식 이름",
  "startDate": "YYYY-MM-DD (본문에 없으면 오늘 날짜)",
  "endDate": "YYYY-MM-DD (본문에 없으면 시작일로부터 1개월 뒤)",
  "location": "장소 (없으면 거제시 일원)",
  "target": "대상 (예: 거제 시민, 관광객 등)",
  "summary": "핵심 내용 1~2문장 요약",
  "link": "관련 URL (<link> 태그의 주소)",
  "category": "행사"
}

RSS 데이터:
${recentItems}`;

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
    let resultText = geminiJson.candidates[0].content.parts[0].text.trim();
    
    // Markdown 제거
    resultText = resultText.replace(/```json|```/g, '').trim();

    if (resultText === 'null' || !resultText.startsWith('{')) {
      console.log('AI가 선정한 새로운 주요 소식이 없습니다.');
      return;
    }

    const newEvent = JSON.parse(resultText);
    newEvent.category = newEvent.category || '행사';

    // 기존 데이터 로드
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);

    // 중복 확인 (이름과 날짜 기준)
    const isDuplicate = db.events.some(e => e.name === newEvent.name);
    if (isDuplicate) {
      console.log(`이미 등록된 소식입니다: ${newEvent.name}`);
      return;
    }

    // ID 부여
    const currentMaxId = db.events.length > 0 ? Math.max(...db.events.map(i => i.id)) : 0;
    newEvent.id = Math.max(currentMaxId + 1, Date.now());

    // 데이터 추가
    db.events.unshift(newEvent);
    if (db.events.length > 8) db.events = db.events.slice(0, 8);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`🎉 새로운 소식을 자동으로 찾았습니다: ${newEvent.name}`);

  } catch (error) {
    console.error('RSS 수집 중 오류 발생:', error);
  }
}

fetchRssEvents();
