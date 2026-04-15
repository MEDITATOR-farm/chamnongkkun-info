const fs = require('fs');
const path = require('path');

/**
 * ë°•ë…¸?´ì˜ ê±·ëŠ” ?…ì„œ ?¬ì§„???½ì–´ Gemini AIë¡??ìŠ¤?¸ë? ì¶”ì¶œ?˜ê³  
 * src/content/daily-poem.json ?Œì¼???…ë°?´íŠ¸?˜ëŠ” ?¤í¬ë¦½íŠ¸?…ë‹ˆ??
 */

async function updateDailyPoem() {
    const API_KEY = process.env.GEMINI_API_KEY;
    const IMAGE_PATH = path.join(process.cwd(), 'public/poems/today.jpg');
    const OUTPUT_PATH = path.join(process.cwd(), 'src/content/daily-poem.json');

    if (!API_KEY) {
        console.error('???ëŸ¬: GEMINI_API_KEY ?˜ê²½ë³€?˜ê? ?¤ì •?˜ì–´ ?ˆì? ?ŠìŠµ?ˆë‹¤.');
        return;
    }

    if (!fs.existsSync(IMAGE_PATH)) {
        console.error(`???ëŸ¬: ë¶„ì„???¬ì§„??ì°¾ì„ ???†ìŠµ?ˆë‹¤. (${IMAGE_PATH})`);
        console.log('?’¡ public/poems/ ?´ë”??today.jpg ?Œì¼???£ì–´ì£¼ì„¸??');
        return;
    }

    console.log('?¨ ?¬ì§„ ë¶„ì„???œì‘?©ë‹ˆ??(AI: Gemini Vision)...');

    try {
        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const base64Image = imageBuffer.toString('base64');

        const prompt = `
            ?„ë˜ ?¬ì§„ ?ì—??ë°•ë…¸???œì¸??'ê±·ëŠ” ?…ì„œ' êµ¬ì ˆ???•í™•?˜ê²Œ ì¶”ì¶œ?´ì¤˜.
            
            ì¶”ì¶œ????ª©:
            1. ?œì˜ ?œëª© (ë§Œì•½ ?†ë‹¤ë©??¬ì§„ ???ì§•?ì¸ ì§§ì? ë¬¸êµ¬ë¡?ì§€?´ì¤˜)
            2. ë³¸ë¬¸ ?´ìš© (ì¤„ë°”ê¿ˆì„ ?¬í•¨?´ì„œ ?ë¬¸ ê·¸ë?ë¡?
            3. ?‘ê?ëª?(ë°•ë…¸??
            4. ì¶œì²˜ (ë°•ë…¸?´ì˜ ê±·ëŠ” ?…ì„œ)
            
            ë°˜ë“œ???„ë˜ JSON ?•ì‹?¼ë¡œë§??µë??´ì¤˜. ?¤ë¥¸ ?¤ëª…?€ ?„ìš” ?†ì–´.
            {
              "title": "ì¶”ì¶œ???œëª©",
              "content": "ì¶”ì¶œ????ë³¸ë¬¸\\nì¤„ë°”ê¿??¬í•¨",
              "author": "ë°•ë…¸??,
              "source": "ë°•ë…¸?´ì˜ ê±·ëŠ” ?…ì„œ",
              "date": "?¤ëŠ˜ ? ì§œ(YYYY-MM-DD)"
            }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: base64Image
                            }
                        }
                    ]
                }]
            })
        });

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error('AI ë¶„ì„ ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤.');
        }

        let resultText = data.candidates[0].content.parts[0].text;
        
        // ë§ˆí¬?¤ìš´ ì½”ë“œ ë¸”ë¡ ?œê±°
        resultText = resultText.replace(/```json|```/g, '').trim();
        
        // JSON ? íš¨??ê²€??ë°??€??        const poemJson = JSON.parse(resultText);
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(poemJson, null, 2), 'utf-8');

        console.log('????êµ¬ì ˆ ?…ë°?´íŠ¸ ?„ë£Œ!');
        console.log('---------------------------');
        console.log(`?œëª©: ${poemJson.title}`);
        console.log(`?´ìš©: ${poemJson.content.substring(0, 30)}...`);
        console.log('---------------------------');
        console.log('?’¡ ?¬ì´?¸ë? ë¹Œë“œ?˜ê³  ?¸ì‹œ?˜ë©´ ì¦‰ì‹œ ë°˜ì˜?©ë‹ˆ??');

    } catch (error) {
        console.error('???ëŸ¬ ë°œìƒ:', error.message);
    }
}

updateDailyPoem();
