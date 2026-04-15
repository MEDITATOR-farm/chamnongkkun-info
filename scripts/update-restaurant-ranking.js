const fs = require('fs').promises;
const path = require('path');

async function updateRestaurantRanking() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/restaurant-ranking.json');
  const CONFIG_PATH = path.join(__dirname, '../automation-control.json');

  try {
    // ?œì–´???¤ì • ?•ì¸
    const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configData);
    
    if (config.update_restaurants === false) {
      console.log('?š« ?œì–´?ì—??ë§›ì§‘ ?…ë°?´íŠ¸ê°€ êº¼ì ¸ ?ˆìŠµ?ˆë‹¤. ?‘ì—…??ì¤‘ë‹¨?©ë‹ˆ??');
      return;
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY ?˜ê²½ ë³€?˜ê? ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ??');
      return;
    }

    console.log('?¤ì‹œê°?ë§›ì§‘ ??‚¹ ?ì„± ì¤?(AI ê¸°ë°˜)...');

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // ê±°ì œ??9ë¯?9ê°€ì§€ ë§??€ ?„ì???ì¶”ì²œ ë§›ì§‘ ?•ë³´ë¥?ê¸°ë°˜?¼ë¡œ ??‚¹ ?ì„± ? ë„
    const prompt = `ê±°ì œ???„ì??¸ë“¤ê³?ê´€ê´‘ê°?¤ì—ê²?ê°€???¸ê¸° ?ˆëŠ” ë§›ì§‘ TOP 5ë¥?? ì •?´ì¤˜. 
ê±°ì œ 9ë¯??€êµ¬íƒ•, êµ??”ë¦¬, ë©ê²Œë¹„ë¹”ë°? ?„ë‹¤ë¦¬ì‘¥êµ? ë¬¼íšŒ, ë³¼ë½êµ¬ì´, ?ë?êµ¬íƒ•, ê±°ì œ ?œìš°, ê±°ì œ ??–´) ?•ë³´ë¥?ì°¸ê³ ?´ì„œ, 
?¤ì œë¡?? ëª…???ë‹¹ ?´ë¦„ê³?ë©”ë‰´ë¥??„ë˜ JSON ?•ì‹?¼ë¡œ ?‘ë‹µ?´ì¤˜.

?•ì‹:
[
  {
    "rank": 1,
    "name": "?ë‹¹ ?´ë¦„",
    "menu": "?€??ë©”ë‰´",
    "score": 98,
    "trend": "up", // up, down, steady
    "tags": ["ê°€ì¡±ì™¸??, "ê²½ì¹˜ì¢‹ì?", "?„ì??¸ë§›ì§?],
    "summary": "AI ?œì¤„ ??,
    "link": "?¤ì´ë²?ì§€??URL",
    "lat": 34.880, // ?„ë„ (?«ì)
    "lng": 128.625 // ê²½ë„ (?«ì)
  },
  ... (ì´?5ê°?
]

?„ë„(lat)?€ ê²½ë„(lng)???Œìˆ˜??3?ë¦¬ê¹Œì? ?•í™•???«ìë¡??œê³µ?´ì¤˜. ë°˜ë“œ???œìˆ˜ JSON ê°ì²´(ë°°ì—´)ë§?ì¶œë ¥??`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API ?¸ì¶œ ?¤íŒ¨: ${response.status}`);
    }

    const json = await response.json();
    let resultText = json.candidates[0].content.parts[0].text.trim();
    resultText = resultText.replace(/```json|```/g, '').trim();

    const rankingData = JSON.parse(resultText);

    // ?€??
    const finalData = {
      updatedAt: new Date().toISOString(),
      ranking: rankingData
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(finalData, null, 2), 'utf-8');
    console.log('?‰ ë§›ì§‘ ??‚¹ ?…ë°?´íŠ¸ ?„ë£Œ!');

  } catch (error) {
    console.error('ë§›ì§‘ ??‚¹ ?…ë°?´íŠ¸ ì¤??¤ë¥˜ ë°œìƒ:', error);
  }
}

updateRestaurantRanking();
