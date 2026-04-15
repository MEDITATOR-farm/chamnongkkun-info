const fs = require('fs').promises;
const path = require('path');

async function generateDailyBooks() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/books.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEYê°€ ?†ìŠµ?ˆë‹¤.');
    return;
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `?¹ì‹ ?€ ?€???œì ???„ì„œ ?ë§¤ ?™í–¥??ê¿°ëš«ê³??ˆëŠ” ?„ë¬¸ê°€?…ë‹ˆ?? ?„ìž¬ë¥?ê¸°ì??¼ë¡œ, ?œêµ­?ì„œ ê°€???€ì¤‘ì ?¼ë¡œ ?¸ê¸° ?ˆê±°???ë§¤?‰ì´ ?’ì? "?œì§‘(Poetry)" 3ê¶Œê³¼, ê·€???ì—… ê¸°ìˆ /?ƒë°­ ê°€ê¾¸ê¸°?€ ?°ê????¸ê¸° ?ˆëŠ” "?ì‚¬ ê´€???„ì„œ(Farming)" 3ê¶Œì˜ ??‚¹???‘ì„±??ì£¼ì„¸?? 
?•ì‹?€ ë°˜ë“œ???¤ìŒ???•í™•??JSON ?•íƒœë¡?ë§žì¶°???©ë‹ˆ?? (?¤ë¥¸ ë§ì? ?ˆë? ì¶”ê??˜ì? ë§ˆì„¸??)
{
  "poetry": [
    { "rank": 1, "title": "?œì§‘ ?œëª©", "author": "?€?ëª…" },
    { "rank": 2, "title": "?œì§‘ ?œëª©", "author": "?€?ëª…" },
    { "rank": 3, "title": "?œì§‘ ?œëª©", "author": "?€?ëª…" }
  ],
  "farming": [
    { "rank": 1, "title": "?ì—…/ê·€??ì±??œëª©", "author": "?€?ëª…" },
    { "rank": 2, "title": "?ì—…/ê·€??ì±??œëª©", "author": "?€?ëª…" },
    { "rank": 3, "title": "?ì—…/ê·€??ì±??œëª©", "author": "?€?ëª…" }
  ]
}`;

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
      console.log(`?¤ëŠ˜???„ì„œ ??‚¹ ?•ë³´ ?…ë°?´íŠ¸ ?±ê³µ!`);
      return; // ?±ê³µ ??ì¢…ë£Œ

    } catch (error) {
      retryCount++;
      console.error(`?„ì„œ ?…ë°?´íŠ¸ ?œë„ ${retryCount}/${maxRetries} ?¤íŒ¨:`, error.message);
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('ìµœë? ?¬ì‹œ???Ÿìˆ˜ë¥?ì´ˆê³¼?ˆìŠµ?ˆë‹¤.');
      }
    }
  }
}

generateDailyBooks();
