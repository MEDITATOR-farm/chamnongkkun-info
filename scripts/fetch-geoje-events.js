const fs = require('fs').promises;
const path = require('path');

async function fetchGeojeEvents() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('필수 환경 변수가 설정되지 않았습니다. (PUBLIC_DATA_API_KEY, GEMINI_API_KEY)');
    return;
  }

  try {
    // 1단계: 거제시 데이터포털 API에서 공연/행사 데이터 가져오기 (REST API)
    // 참고: http://data.geoje.go.kr/rfcapi/rest/geojeshowexhibition/getGeojeshowexhibitionList
    const geojeUrl = `http://data.geoje.go.kr/rfcapi/rest/geojeshowexhibition/getGeojeshowexhibitionList?authKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    
    console.log('거제시청 API 호출 중...');
    const response = await fetch(geojeUrl);
    
    if (!response.ok) {
      throw new Error(`거제시청 API 호출 실패: ${response.status}`);
    }

    // 거제시 API는 XML 또는 JSON을 반환할 수 있음 (기본 XML일 수 있으므로 주의)
    const text = await response.text();
    
    // 2단계: Gemini AI를 사용하여 XML/JSON 파싱 및 최신 행사 필터링
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `아래는 거제시청에서 가져온 공연/행사 데이터(Raw text)야. 
이 중에서 오늘(${today}) 이후에 열리는 가장 중요한 행사 1건만 찾아서 JSON 객체로 변환해줘.

형식:
{ "name": "행사명", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "location": "장소", "target": "대상", "summary": "내용 요약(한 문장)", "link": "관련 URL(없으면 #)" }

반드시 JSON 객체만 출력해. 설명 없이.

데이터 원본:
${text.substring(0, 10000)} // 데이터가 너무 클 수 있어 일부만 전달`;

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
    
    const newEvent = JSON.parse(resultText);
    newEvent.category = '행사';

    // 3단계: 기존 데이터와 중복 확인 및 추가
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    
    const isDuplicate = db.events.some(e => e.name === newEvent.name);
    if (isDuplicate) {
      console.log(`이미 존재하는 행사입니다: ${newEvent.name}`);
      return;
    }

    // ID 부여
    const currentMaxId = db.events.length > 0 
      ? Math.max(...db.events.map(i => i.id)) 
      : 0;
    
    // 타임스탬프 기반 ID를 가진 항목들이 섞여 있으므로 정수 ID로 통일 (또는 유니크 보장)
    newEvent.id = Math.max(currentMaxId + 1, Date.now()); 

    db.events.unshift(newEvent); // 최신이 맨 위로 오도록 앞에 추가
    
    // 8개까지만 유지 (공간 효율성)
    if (db.events.length > 8) {
      db.events = db.events.slice(0, 8);
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`거제시청 행사 자동 업데이트 완료: ${newEvent.name}`);

  } catch (error) {
    console.error('거제시 행사 수집 중 오류 발생:', error);
  }
}

fetchGeojeEvents();
