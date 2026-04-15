const fs = require('fs').promises;
const path = require('path');

async function fetchRssEvents() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');
  const RSS_URL = 'http://www.geoje.go.kr/board/openApi/rss.geoje?boardId=BBS_0000008';

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY ?˜ê²½ ë³€?˜ê? ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ??');
    return;
  }

  try {
    console.log('ê±°ì œ?œì²­ RSS ?¼ë“œ ê°€?¸ì˜¤??ì¤?..');
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`RSS ?”ì²­ ?¤íŒ¨: ${response.status}`);
    }
    const xmlText = await response.text();

    // RSS ?¼ë“œ?ì„œ ??ª© ì¶”ì¶œ (?¨ìˆœ ë¬¸ì??ë§¤ì¹­?¼ë¡œ <item> ?œê·¸ ì¶”ì¶œ)
    const items = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
    console.log(`ì´?${items.length}ê°œì˜ ??ª©??ì°¾ì•˜?µë‹ˆ?? AI ë¶„ì„???œì‘?©ë‹ˆ??..`);

    if (items.length === 0) return;

    // ìµœê·¼ 10ê°???ª©ë§?AI?ê²Œ ?„ë‹¬?˜ì—¬ ë¶„ì„ (?¨ìœ¨??
    const recentItems = items.slice(0, 10).join('\n');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `?„ë˜??ê±°ì œ?œì²­??ìµœì‹  ê³µê³  RSS ?°ì´?°ì•¼. 
??ì¤‘ì—??'ì¶•ì œ', 'ë¬¸í™” ?‰ì‚¬', '?œë? ?œíƒ', 'ì§€?ê¸ˆ' ???¼ë°˜ ?œë??¤ì—ê²?ë§¤ìš° ? ìµ?˜ê³  ?¥ë?ë¡œìš´ ?Œì‹ë§?**ìµœë? 1ê±?* ì°¾ì•„ì¤? 
?‰ì •?ì¸ ?¨ìˆœ ê³µê³ (?…ì°°, ê²°ê³¼ ë°œí‘œ ????ë¬´ì‹œ??

?ˆë‹¤ë©??„ë˜ JSON ?•ì‹?¼ë¡œ ?‘ë‹µ?´ì¤˜. ë§Œì•½ ì§„ì§œë¡?ì¤‘ìš”???Œì‹???˜ë‚˜???†ë‹¤ë©?null ?´ë¼ê³ ë§Œ ?µí•´.

?•ì‹:
{
  "name": "?‰ì‚¬/?Œì‹ ?´ë¦„",
  "startDate": "YYYY-MM-DD (ë³¸ë¬¸???†ìœ¼ë©??¤ëŠ˜ ? ì§œ)",
  "endDate": "YYYY-MM-DD (ë³¸ë¬¸???†ìœ¼ë©??œì‘?¼ë¡œë¶€??1ê°œì›” ??",
  "location": "?¥ì†Œ (?†ìœ¼ë©?ê±°ì œ???¼ì›)",
  "target": "?€??(?? ê±°ì œ ?œë?, ê´€ê´‘ê° ??",
  "summary": "?µì‹¬ ?´ìš© 1~2ë¬¸ì¥ ?”ì•½",
  "detailContent": "ë¸”ë¡œê·??¬ìŠ¤???•ì‹???„ì£¼ ?ì„¸???¤ëª… (ì¶”ì²œ ?´ìœ  3ê°€ì§€, ???¬í•¨, 800???´ì™¸)",
  "link": "ê´€??URL (<link> ?œê·¸??ì£¼ì†Œ)",
  "category": "?‰ì‚¬"
}

RSS ?°ì´??
${recentItems}`;

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
    let resultText = geminiJson.candidates[0].content.parts[0].text.trim();
    
    // Markdown ?œê±°
    resultText = resultText.replace(/```json|```/g, '').trim();

    if (resultText === 'null' || !resultText.startsWith('{')) {
      console.log('AIê°€ ? ì •???ˆë¡œ??ì£¼ìš” ?Œì‹???†ìŠµ?ˆë‹¤.');
      return;
    }

    const newEvent = JSON.parse(resultText);
    newEvent.category = newEvent.category || '?‰ì‚¬';

    // ê¸°ì¡´ ?°ì´??ë¡œë“œ
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);

    // ì¤‘ë³µ ?•ì¸ (?´ë¦„ê³?? ì§œ ê¸°ì?)
    const isDuplicate = db.events.some(e => e.name === newEvent.name);
    if (isDuplicate) {
      console.log(`?´ë? ?±ë¡???Œì‹?…ë‹ˆ?? ${newEvent.name}`);
      return;
    }

    // ID ë¶€??    const currentMaxId = db.events.length > 0 ? Math.max(...db.events.map(i => i.id)) : 0;
    newEvent.id = Math.max(currentMaxId + 1, Date.now());

    // ?°ì´??ì¶”ê?
    db.events.unshift(newEvent);
    if (db.events.length > 8) db.events = db.events.slice(0, 8);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`?‰ ?ˆë¡œ???Œì‹???ë™?¼ë¡œ ì°¾ì•˜?µë‹ˆ?? ${newEvent.name}`);

  } catch (error) {
    console.error('RSS ?˜ì§‘ ì¤??¤ë¥˜ ë°œìƒ:', error);
  }
}

fetchRssEvents();
