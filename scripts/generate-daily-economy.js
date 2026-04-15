const fs = require('fs').promises;
const path = require('path');

async function generateDailyEconomy() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/economy.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEYê°€ ?†ìŠµ?ˆë‹¤.');
    return;
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `?¹ì‹ ?€ ì¹œì ˆ??ê²½ì œ ?„ë¬¸ê°€?…ë‹ˆ?? ?¹ì¼ ê¸°ì? ê°€??ì¤‘ìš”??"ê²½ì œ ?«ì´?? 1ê°œë? ê³¨ë¼???µì‹¬ë§??½ê²Œ ?¤ëª…??ì£¼ì„¸?? 
?•ì‹?€ ë°˜ë“œ???¤ìŒ??JSON ë°°ì—´ ?•íƒœë¡?ë§žì¶°ì£¼ì„¸??
[
  { 
    "title": "??ì¤„ì§œë¦?ì§ê??ì¸ ê²½ì œ ?´ìŠ¤ ?”ì•½ ?œëª©",
    "content": "???´ìŠˆê°€ ??ì¤‘ìš”?˜ê³  ê°œì¸??ê²½ì œ?í™œ???´ë–¤ ?í–¥??ë¯¸ì¹˜?”ì? 2~3ì¤„ë¡œ ?½ê²Œ ???ì„¸ ?´ìš©"
  }
]
?¤ë¥¸ ?‘ë‹µ?´ë‚˜ ?¸ì‚¬ë§??†ì´ ?¤ì§ ??JSON ë°°ì—´ ?¬ë§·ë§?ì¶œë ¥?˜ì„¸??`;

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
      const processedData = JSON.parse(resultText);

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedData, null, 2), 'utf-8');
      console.log(`?¤ëŠ˜??ê²½ì œ ?«ì´???…ë°?´íŠ¸ ?±ê³µ: ${processedData[0].title}`);
      return; // ?±ê³µ ??ì¢…ë£Œ

    } catch (error) {
      retryCount++;
      console.error(`ê²½ì œ ?…ë°?´íŠ¸ ?œë„ ${retryCount}/${maxRetries} ?¤íŒ¨:`, error.message);
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('ìµœë? ?¬ì‹œ???Ÿìˆ˜ë¥?ì´ˆê³¼?ˆìŠµ?ˆë‹¤.');
      }
    }
  }
}

generateDailyEconomy();
