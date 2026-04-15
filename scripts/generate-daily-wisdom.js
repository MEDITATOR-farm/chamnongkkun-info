const fs = require('fs').promises;
const path = require('path');

async function generateDailyWisdom() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/wisdom.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEYê°€ ?†ìŠµ?ˆë‹¤.');
    return;
  }

  // ê¸°ì¡´ ëª…ì‹¬ë³´ê° ?½ê¸° (ì¤‘ë³µ ë°©ì???
  let currentWisdom = "";
  try {
    const existingData = JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf-8'));
    if (existingData && existingData.length > 0) {
      currentWisdom = existingData[0].chars;
    }
  } catch (e) {
    // ?Œì¼???†ê±°???½ê¸° ?¤íŒ¨ ??ë¬´ì‹œ
  }

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `ëª…ì‹¬ë³´ê°(?å¿ƒå¯¶é‘‘)?´ë‚˜ ???±í˜„?¤ì˜ ì§€?œë¡œ??ë§ì? ì¤‘ì—???¸ìƒ??êµí›ˆ??ì£¼ëŠ” ì§§ê³  ì¢‹ì? ?œì ë¬¸êµ¬ 1ê°œë? ì¶”ì²œ?´ì¤˜.
**ì¤‘ìš”: ë¬¸êµ¬ê°€ 'A?˜ê³  B?˜ë‹¤' ?ì˜ ?€êµ?å°å¥)ë¡??´ë£¨?´ì ¸ ?ˆë‹¤ë©? ?Šì? ë§ê³  ?¨ì „????êµ¬ì ˆ??ëª¨ë‘ ?¬í•¨?´ì¤˜!** (?? '?œåå¸¸æ€å·±???‘è«‡?«è«–äººé' ì²˜ëŸ¼ ??ë§ˆë””ë¥????¨ì¤˜)
?„ì¬ ?œì‹œ ì¤‘ì¸ ë¬¸êµ¬??"${currentWisdom}"?´ì•¼. **?´ê²ƒê³¼ëŠ” ?¤ë¥¸ ?ˆë¡œ??ë¬¸êµ¬**ë¡?ê³¨ë¼ì¤˜ì•¼ ??
?•ì‹?€ ë°˜ë“œ???„ë˜?€ ê°™ì´ JSON ë°°ì—´ ?•íƒœë¡?ë§Œë“¤?´ì•¼ ??
[
  { "chars": "?œì ?ë¬¸ (?? å¿ä??‚ä¹‹å¿??ç™¾?¥ä¹‹??", "reading": "?œê? ??(?? ?¸ì¼?œì?ë¶?ë©´ë°±?¼ì???", "meaning": "?½ê²Œ ?€?´í•œ ì¹œì ˆ???¤ëª…" }
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
      const processedWisdom = JSON.parse(resultText);

      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(processedWisdom, null, 2), 'utf-8');
      console.log(`?¤ëŠ˜??ëª…ì‹¬ë³´ê° ?…ë°?´íŠ¸ ?±ê³µ: ${processedWisdom[0].chars}`);
      return; // ?±ê³µ ??ì¢…ë£Œ

    } catch (error) {
      retryCount++;
      console.error(`ëª…ì‹¬ë³´ê° ?…ë°?´íŠ¸ ?œë„ ${retryCount}/${maxRetries} ?¤íŒ¨:`, error.message);
      if (retryCount < maxRetries) {
        console.log('3ì´????¤ì‹œ ?œë„?©ë‹ˆ??..');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error('ìµœë? ?¬ì‹œ???Ÿìˆ˜ë¥?ì´ˆê³¼?ˆìŠµ?ˆë‹¤.');
      }
    }
  }
}

generateDailyWisdom();
