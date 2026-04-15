const fs = require('fs').promises;
const path = require('path');

async function backfillEventDetails() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY ?˜ê²½ ë³€?˜ê? ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ??');
    return;
  }

  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    let updatedCount = 0;

    console.log('ì´???ª© ??', db.events.length, '. ?ì„¸ ?´ìš© ?ì„± ì¤?..');

    // ëª¨ë“  ?´ë²¤??ì²˜ë¦¬
    const allItems = [...db.events];

    for (const item of allItems) {
      if (item.detailContent) continue; // ?´ë? ?ˆë‹¤ë©?ê±´ë„ˆ?€

      console.log(`[${item.name}] ?ì„¸ ê¸€ ?ì„± ì¤?..`);

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
      
      const prompt = `?¹ì‹ ?€ 'ì°¸ë†ê¾??Œì‹?? ë¸”ë¡œê·¸ì˜ ?˜ì„ ?‘ê??…ë‹ˆ?? 
?„ë˜ ê³µê³µ ?•ë³´ë¥?ë°”íƒ•?¼ë¡œ ì£¼ë??¤ì—ê²??•ê°??ê°€ê³??ì„¸??'ë¸”ë¡œê·??¤í??????ì„¸ ?¤ëª…???‘ì„±??ì£¼ì„¸??

?•ë³´: ${JSON.stringify(item, null, 2)}

?•ì‹ ì§€ì¹?
1. ë§ˆí¬?¤ìš´(Markdown) ?•ì‹???¬ìš©?˜ì„¸??
2. ?œëª©?€ ?œì™¸?˜ê³  ë³¸ë¬¸(?´ìš©)ë§??‘ì„±?˜ì„¸??
3. ?Œì œëª?###), ê¸€ë¨¸ë¦¬ ê¸°í˜¸(-), êµµê²Œ(**) ?±ì„ ?œìš©??ê°€?…ì„±???’ì´?¸ìš”.
4. ì¶”ì²œ ?´ìœ  3ê°€ì§€, ì¦ê¸°???? ì£¼ì˜?¬í•­ ?ëŠ” ? ì²­ ë°©ë²• ?±ì„ ?¬í•¨??800???´ì™¸ë¡??•ì„±ê»??‘ì„±??ì£¼ì„¸??
5. ë§íˆ¬??"~?´ìš”", "~?…ë‹ˆ???€ ê°™ì´ ì¹œê·¼?˜ê³  ?•ê° ?ˆëŠ” ë¸”ë¡œê·??¤ìœ¼ë¡??˜ì„¸??`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        console.error(`Gemini ?¸ì¶œ ?¤íŒ¨ (${item.name}):`, response.status);
        continue;
      }

      const json = await response.json();
      const resultText = json.candidates[0].content.parts[0].text.trim();
      
      item.detailContent = resultText;
      updatedCount++;
      
      // API ? ë‹¹???œí•œ???¼í•˜ê¸??„í•´ 10ì´??€ê¸?      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    if (updatedCount > 0) {
      await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
      console.log(`?‰ ${updatedCount}ê°œì˜ ??ª©???ì„¸ ?´ìš©??ì¶”ê??˜ì—ˆ?µë‹ˆ??`);
    } else {
      console.log('?´ë? ëª¨ë“  ??ª©???…ë°?´íŠ¸?˜ì–´ ?ˆìŠµ?ˆë‹¤.');
    }

  } catch (error) {
    console.error('ë°±í•„ ì¤??¤ë¥˜ ë°œìƒ:', error);
  }
}

backfillEventDetails();
