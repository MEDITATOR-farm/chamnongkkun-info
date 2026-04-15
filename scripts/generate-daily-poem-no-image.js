const fs = require('fs');
const path = require('path');

/**
 * ?¬ì§„???†ì„ ??Gemini AIë¡??ˆë¡œ??????êµ¬ì ˆ???ì„±?˜ì—¬ 
 * src/content/daily-poem.json ?Œì¼???…ë°?´íŠ¸?˜ëŠ” ?¤í¬ë¦½íŠ¸?…ë‹ˆ??
 */

async function generateDailyPoemNoImage() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const OUTPUT_PATH = path.join(process.cwd(), 'src/content/daily-poem.json');

    if (!API_KEY) {
        console.error('???ëŸ¬: GEMINI_API_KEY ?˜ê²½ë³€?˜ê? ?¤ì •?˜ì–´ ?ˆì? ?ŠìŠµ?ˆë‹¤.');
        return;
    }

    console.log('?¨ ?¬ì§„???†ìœ¼ë¯€ë¡?AIë¥??µí•´ ?ˆë¡œ???œë? ì¶”ì²œë°›ìŠµ?ˆë‹¤...');

    try {
        const prompt = `
            ?¬ëŒ?¤ì—ê²??°ëœ»???„ë¡œ???ˆë¡œ???œì‘???€???¬ë§??ì¤????ˆëŠ” ì§§ê³  ?„ë¦„?¤ìš´ ????êµ¬ì ˆ??ì¶”ì²œ?´ì¤˜.
            ë°˜ë“œ??ë°•ë…¸???œì¸??ë¬¸ì²´?€ ë¹„ìŠ·???ë‚Œ?´ë©´ ì¢‹ê² ??
            
            ??ª©:
            1. ?œì˜ ?œëª©
            2. ë³¸ë¬¸ ?´ìš© (ì¤„ë°”ê¿??¬í•¨)
            3. ?‘ê?ëª?(ë°•ë…¸??
            4. ì¶œì²˜ (ë°•ë…¸?´ì˜ ê±·ëŠ” ?…ì„œ)
            
            ë°˜ë“œ???„ë˜ JSON ?•ì‹?¼ë¡œë§??µë??´ì¤˜. ?¤ë¥¸ ?¤ëª…?€ ?„ìš” ?†ì–´.
            {
              "title": "ì¶”ì¶œ???œëª©",
              "content": "ì¶”ì¶œ????ë³¸ë¬¸\\nì¤„ë°”ê¿??¬í•¨",
              "author": "ë°•ë…¸??,
              "source": "ë°•ë…¸?´ì˜ ê±·ëŠ” ?…ì„œ",
              "date": "2026-04-06"
            }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error('AI ë¶„ì„ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.');
        }

        let resultText = data.candidates[0].content.parts[0].text;
        resultText = resultText.replace(/```json|```/g, '').trim();
        
        const poemJson = JSON.parse(resultText);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(poemJson, null, 2), 'utf-8');

        console.log('???¤ëŠ˜?????…ë°?´íŠ¸ ?„ë£Œ!');
        console.log(`?œëª©: ${poemJson.title}`);
    } catch (error) {
        console.error('???ëŸ¬ ë°œìƒ:', error.message);
    }
}

generateDailyPoemNoImage();
