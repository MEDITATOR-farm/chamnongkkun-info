const fs = require('fs').promises;
const path = require('path');

async function fetchGeojeEvents() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('?„ìˆ˜ ?˜ê²½ ë³€?˜ê? ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ?? (PUBLIC_DATA_API_KEY, GEMINI_API_KEY)');
    return;
  }

  try {
    // 1?¨ê³„: ê±°ì œ???°ì´?°í¬??API?ì„œ ê³µì—°/?‰ì‚¬ ?°ì´??ê°€?¸ì˜¤ê¸?(REST API)
    // ì°¸ê³ : http://data.geoje.go.kr/rfcapi/rest/geojeshowexhibition/getGeojeshowexhibitionList
    const geojeUrl = `http://data.geoje.go.kr/rfcapi/rest/geojeshowexhibition/getGeojeshowexhibitionList?authKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    
    console.log('ê±°ì œ?œì²­ API ?¸ì¶œ ì¤?..');
    const response = await fetch(geojeUrl);
    
    if (!response.ok) {
      throw new Error(`ê±°ì œ?œì²­ API ?¸ì¶œ ?¤íŒ¨: ${response.status}`);
    }

    // ê±°ì œ??API??XML ?ëŠ” JSON??ë°˜í™˜?????ˆìŒ (ê¸°ë³¸ XML?????ˆìœ¼ë¯€ë¡?ì£¼ì˜)
    const text = await response.text();
    
    // 2?¨ê³„: Gemini AIë¥??¬ìš©?˜ì—¬ XML/JSON ?Œì‹± ë°?ìµœì‹  ?‰ì‚¬ ?„í„°ë§?    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `?„ë˜??ê±°ì œ?œì²­?ì„œ ê°€?¸ì˜¨ ê³µì—°/?‰ì‚¬ ?°ì´??Raw text)?? 
??ì¤‘ì—???¤ëŠ˜(${today}) ?´í›„???´ë¦¬??ê°€??ì¤‘ìš”???‰ì‚¬ 1ê±´ë§Œ ì°¾ì•„??JSON ê°ì²´ë¡?ë³€?˜í•´ì¤?

?•ì‹:
{ "name": "?‰ì‚¬ëª?, "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD", "location": "?¥ì†Œ", "target": "?€??, "summary": "?´ìš© ?”ì•½(??ë¬¸ì¥)", "link": "ê´€??URL(?†ìœ¼ë©?#)" }

ë°˜ë“œ??JSON ê°ì²´ë§?ì¶œë ¥?? ?¤ëª… ?†ì´.

?°ì´???ë³¸:
${text.substring(0, 10000)} // ?°ì´?°ê? ?ˆë¬´ ?????ˆì–´ ?¼ë?ë§??„ë‹¬`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API ?¸ì¶œ ?¤íŒ¨: ${geminiResponse.status}`);
    }

    const geminiJson = await geminiResponse.json();
    let resultText = geminiJson.candidates[0].content.parts[0].text;
    resultText = resultText.replace(/```json|```/g, '').trim();
    
    const newEvent = JSON.parse(resultText);
    newEvent.category = '?‰ì‚¬';

    if (!newEvent.name || newEvent.name.includes('?•ë³´ ?†ìŒ') || newEvent.name === '?‰ì‚¬ëª?) {
      console.log('? íš¨???‰ì‚¬ ?•ë³´ê°€ ?†ìŠµ?ˆë‹¤.');
      return;
    }

    // 3?¨ê³„: ê¸°ì¡´ ?°ì´?°ì? ì¤‘ë³µ ?•ì¸ ë°?ì¶”ê?
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    
    const isDuplicate = db.events.some(e => e.name === newEvent.name);
    if (isDuplicate) {
      console.log(`?´ë? ì¡´ì¬?˜ëŠ” ?‰ì‚¬?…ë‹ˆ?? ${newEvent.name}`);
      return;
    }

    // ID ë¶€??    const currentMaxId = db.events.length > 0 
      ? Math.max(...db.events.map(i => i.id)) 
      : 0;
    
    // ?€?„ìŠ¤?¬í”„ ê¸°ë°˜ IDë¥?ê°€ì§???ª©?¤ì´ ?ì—¬ ?ˆìœ¼ë¯€ë¡??•ìˆ˜ IDë¡??µì¼ (?ëŠ” ? ë‹ˆ??ë³´ì¥)
    newEvent.id = Math.max(currentMaxId + 1, Date.now()); 

    db.events.unshift(newEvent); // ìµœì‹ ??ë§??„ë¡œ ?¤ë„ë¡??ì— ì¶”ê?
    
    // 8ê°œê¹Œì§€ë§?? ì? (ê³µê°„ ?¨ìœ¨??
    if (db.events.length > 8) {
      db.events = db.events.slice(0, 8);
    }

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`ê±°ì œ?œì²­ ?‰ì‚¬ ?ë™ ?…ë°?´íŠ¸ ?„ë£Œ: ${newEvent.name}`);

  } catch (error) {
    console.error('ê±°ì œ???‰ì‚¬ ?˜ì§‘ ì¤??¤ë¥˜ ë°œìƒ:', error);
  }
}

fetchGeojeEvents();
