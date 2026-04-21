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
    const geojeUrl = `http://data.geoje.go.kr/rfcapi/rest/geojeshowexhibition/getGeojeshowexhibitionList?authKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    
    console.log('거제시청 API 호출 중...');
    const response = await fetch(geojeUrl);
    
    if (!response.ok) {
      throw new Error(`거제시청 API 호출 실패: ${response.status}`);
    }

    const text = await response.text();
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `아래는 거제시청에서 가져온 공연/행사 데이터(Raw text)입니다. 
이 중에서 오늘(${today}) 이후에 열리는 가장 중요한 행사 1건만 찾아서 JSON 객체로 변환해줘.

형식:
{ "name": "행사명", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "location": "장소", "target": "대상", "summary": "내용 요약(두 문장)", "link": "관련 URL(없으면 #)" }

반드시 JSON 객체만 출력. 설명 없이.
행사를 찾지 못하면 null을 반환해.

데이터 원본:
${text.substring(0, 10000)}`;

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
    
    if (resultText === 'null') {
      console.log('유효한 행사 정보가 없습니다.');
      return;
    }

    const newEvent = JSON.parse(resultText);
    newEvent.category = '행사';

    if (!newEvent.name || newEvent.name.includes('정보 없음') || newEvent.name === '행사명') {
      console.log('유효하지 않은 행사 정보입니다.');
      return;
    }

    // 기존 데이터 읽기
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    
    // 중복 체크: 제목 유사도 + 날짜 기준으로 판단
    const isDuplicate = db.events.some(e => {
      // 같은 날짜면서 제목이 80% 이상 유사한 경우 중복으로 판단
      if (e.startDate === newEvent.startDate && e.endDate === newEvent.endDate) {
        // 공통 키워드 추출해서 비교
        const existingWords = e.name.replace(/[『』「」\s]/g, '').toLowerCase();
        const newWords = newEvent.name.replace(/[『』「」\s]/g, '').toLowerCase();
        const shorter = existingWords.length < newWords.length ? existingWords : newWords;
        const longer = existingWords.length >= newWords.length ? existingWords : newWords;
        // 짧은 문자열이 긴 문자열에 포함되면 중복
        if (longer.includes(shorter.substring(0, Math.floor(shorter.length * 0.7)))) {
          return true;
        }
      }
      return false;
    });

    if (isDuplicate) {
      console.log(`이미 존재하는 유사 행사입니다: ${newEvent.name}`);
      return;
    }

    // 만료된 행사 제거 (endDate가 오늘보다 이전인 것)
    db.events = db.events.filter(e => {
      if (e.endDate === '상시') return true;
      return new Date(e.endDate) >= new Date(today);
    });

    newEvent.id = Date.now();
    db.events.unshift(newEvent);
    
    // 최대 8개 유지
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
