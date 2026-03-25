const fs = require('fs').promises;
const path = require('path');

async function fetchPublicData() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('필수 환경 변수가 설정되지 않았습니다.');
    return;
  }

  try {
    // 1단계: 공공데이터포털 API에서 데이터 가져오기
    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    const publicResponse = await fetch(publicDataUrl);
    
    if (!publicResponse.ok) {
      throw new Error(`공공데이터 API 호출 실패: ${publicResponse.status}`);
    }

    const publicJson = await publicResponse.json();
    const allItems = publicJson.data || [];

    if (allItems.length === 0) {
      console.log('가져온 데이터가 없습니다.');
      return;
    }

    // 필터링 로직
    const filterByKeyword = (items, keyword) => {
      return items.filter(item => 
        (item.서비스명 && item.서비스명.includes(keyword)) ||
        (item.서비스목적요약 && item.서비스목적요약.includes(keyword)) ||
        (item.지원대상 && item.지원대상.includes(keyword)) ||
        (item.소관기관명 && item.소관기관명.includes(keyword))
      );
    };

    let filteredItems = filterByKeyword(allItems, '거제');
    if (filteredItems.length === 0) {
      filteredItems = filterByKeyword(allItems, '경남');
    }
    if (filteredItems.length === 0) {
      filteredItems = allItems;
    }

    // 2단계: 기존 데이터와 비교
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    const existingNames = new Set([
      ...db.events.map(e => e.name),
      ...db.benefits.map(b => b.name)
    ]);

    const newItems = filteredItems.filter(item => !existingNames.has(item.서비스명));

    if (newItems.length === 0) {
      console.log('새로운 데이터가 없습니다.');
      return;
    }

    // 새로운 항목 중 첫 번째 1개만 선택
    const targetItem = newItems[0];

    // 3단계: Gemini AI로 새 항목 가공
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

분석할 데이터:
${JSON.stringify(targetItem, null, 2)}`;

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
    
    // 마크다운 코드 블록 제거 및 JSON 파싱
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedItem = JSON.parse(resultText);

    // 4단계: 기존 데이터에 추가
    const categoryKey = processedItem.category === '행사' ? 'events' : 'benefits';
    
    // ID 부여 (현재 해당 카테고리의 최대 ID + 1)
    const currentMaxId = db[categoryKey].length > 0 
      ? Math.max(...db[categoryKey].map(i => i.id)) 
      : 0;
    processedItem.id = currentMaxId + 1;

    db[categoryKey].push(processedItem);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`추가 완료: ${processedItem.name} (${processedItem.category})`);

  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
  }
}

fetchPublicData();
