const fs = require('fs').promises;
const path = require('path');

async function generateDailyIdiom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/idioms.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEYê°€ ?†ìŠµ?ˆë‹¤.');
    return;
  }

  // ê¸°ì¡´ ?¬ì?±ì–´ ?½ê¸° (ì¤‘ë³µ ë°©ì???
  let currentIdiom = "";
  try {
    const existingData = JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf-8'));
    if (existingData && existingData.length > 0) {
      currentIdiom = existingData[0].hanja;
    }
  } catch (e) {
    // ?Œì¼???†ê±°???½ê¸° ?¤íŒ¨ ??ë¬´ì‹œ
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `?¬ëŒ?¤ì—ê²?ê¸ì •?ì¸ ?¬ë§?´ë‚˜ ?µì°°??ì¤????ˆëŠ” ë©‹ì§„ ?¬ì?±ì–´ 1ê°œë? ì¶”ì²œ?´ì¤˜.
?„ì¬ ?œì‹œ ì¤‘ì¸ ?¬ì?±ì–´??"${currentIdiom}"?´ì•¼. **?´ê²ƒê³¼ëŠ” ë¬´ì¡°ê±??¤ë¥¸ ?ˆë¡œ???¬ì?±ì–´**ë¡?ê³¨ë¼ì¤˜ì•¼ ??
?•ì‹?€ ë°˜ë“œ???„ë˜?€ ê°™ì´ JSON ë°°ì—´ ?•íƒœë¡?ë§Œë“¤?´ì•¼ ??
[
  { "hanja": "?¬ì?±ì–´ ?œê? ??, "chars": "?œì ?œê¸°", "meaning": "?½ê²Œ ?€?´í•œ ì¹œì ˆ???¤ëª…" }
]
?¤ë¥¸ ë§ì? ?ˆë? ?§ë¶™?´ì? ë§ê³  ?¤ì§ ??JSON ì½”ë“œë§?ì¶œë ¥?´ì¤˜. ?´ì œ????ê²¹ì¹˜???ˆë¡­ê³?ì¢‹ì? ê±¸ë¡œ ê³¨ë¼ì¤?`;

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
      const processedIdiom = JSON.parse(resultText);

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedIdiom, null, 2), 'utf-8');
      console.log(`?¤ëŠ˜???¬ì?±ì–´ ?…ë°?´íŠ¸ ?±ê³µ: ${processedIdiom[0].hanja}`);
      return; // ?±ê³µ ??ì¢…ë£Œ

    } catch (error) {
      retryCount++;
      console.error(`?¬ì?±ì–´ ?…ë°?´íŠ¸ ?œë„ ${retryCount}/${maxRetries} ?¤íŒ¨:`, error.message);
      if (retryCount < maxRetries) {
        console.log('3ì´????¤ì‹œ ?œë„?©ë‹ˆ??..');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('ìµœë? ?¬ì‹œ???Ÿìˆ˜ë¥?ì´ˆê³¼?ˆìŠµ?ˆë‹¤.');
      }
    }
  }
}

generateDailyIdiom();
