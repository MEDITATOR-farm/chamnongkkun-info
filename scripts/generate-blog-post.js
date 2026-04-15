const fs = require('fs').promises;
const path = require('path');

async function generateBlogPost() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');
  const POSTS_DIR = path.join(__dirname, '../src/content/posts/');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY ?˜ê²½ ë³€?˜ê? ?¤ì •?˜ì? ?Šì•˜?µë‹ˆ??');
    return;
  }

  try {
    // 1?¨ê³„: ìµœì‹  ?°ì´???•ì¸
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    
    // events?€ benefits ?©ì³??ê°€??ë§ˆì?ë§?ìµœì‹ ) ??ª© ê°€?¸ì˜¤ê¸?    const allItems = [...db.events, ...db.benefits];
    if (allItems.length === 0) {
      console.log('?°ì´?°ê? ?†ìŠµ?ˆë‹¤.');
      return;
    }
    
    // ID ê¸°ì??¼ë¡œ ê°€??????ª©??ìµœì‹ ?¼ë¡œ ê°„ì£¼ (?ëŠ” ë°°ì—´ ?œì„œ??ë§ˆì?ë§?
    const latestItem = allItems.sort((a, b) => b.id - a.id)[0];
    const itemName = latestItem.name;

    // ê¸°ì¡´ ?¬ìŠ¤?¸ë“¤ê³?ë¹„êµ
    const existingFiles = await fs.readdir(POSTS_DIR);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
        if (content.includes(itemName)) {
          console.log('?´ë? ?‘ì„±??ê¸€?…ë‹ˆ??');
          return;
        }
      }
    }

    // 2?¨ê³„: Gemini AIë¡?ë¸”ë¡œê·?ê¸€ ?ì„±
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `?„ë˜ ê³µê³µ?œë¹„???•ë³´ë¥?ë°”íƒ•?¼ë¡œ ë¸”ë¡œê·?ê¸€???‘ì„±?´ì¤˜.
${latestItem.detailContent ? `?´ë? ?‘ì„±???ì„¸ ?´ìš©???ˆìœ¼???´ë? ì°¸ê³ ?˜ì—¬ ???ì„±?˜ê²Œ ?¤ë“¬?´ì¤˜: ${latestItem.detailContent}` : ''}

?•ë³´: ${JSON.stringify(latestItem, null, 2)}

?„ë˜ ?•ì‹?¼ë¡œ ì¶œë ¥?´ì¤˜. ë°˜ë“œ?????•ì‹ë§?ì¶œë ¥?˜ê³  ?¤ë¥¸ ?ìŠ¤?¸ëŠ” ?†ì´:
---
title: (ì¹œê·¼?˜ê³  ?¥ë?ë¡œìš´ ?œëª©)
date: ${today}
summary: (??ì¤??”ì•½)
category: ?•ë³´
tags: [?œê·¸1, ?œê·¸2, ?œê·¸3]
source_link: ${latestItem.link}
---

(ë³¸ë¬¸: 800???´ìƒ, ì¹œê·¼??ë¸”ë¡œê·??? ì¶”ì²œ ?´ìœ  3ê°€ì§€ ?¬í•¨, ? ì²­ ë°©ë²• ?ˆë‚´)

ë§ˆì?ë§?ì¤„ì— FILENAME: ${today}-keyword ?•ì‹?¼ë¡œ ?Œì¼ëª…ë„ ì¶œë ¥?´ì¤˜. ?¤ì›Œ?œëŠ” ?ë¬¸?¼ë¡œ.`;

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
    const resultText = geminiJson.candidates[0].content.parts[0].text;

    // 3?¨ê³„: ?Œì¼ ?€??(?´ìš©ê³??Œì¼ëª?ë¶„ë¦¬)
    const lines = resultText.trim().split('\n');
    let filenameLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('FILENAME:')) {
        filenameLineIndex = i;
        break;
      }
    }

    if (filenameLineIndex === -1) {
      throw new Error('?Œì¼ëª??•ì‹??ì°¾ì„ ???†ìŠµ?ˆë‹¤.');
    }

    const filename = lines[filenameLineIndex].replace('FILENAME:', '').trim() + '.md';
    const postContent = lines.slice(0, filenameLineIndex).join('\n').trim();

    await fs.writeFile(path.join(POSTS_DIR, filename), postContent, 'utf-8');
    console.log(`?ì„± ?„ë£Œ: ${filename}`);

  } catch (error) {
    console.error('?¤í¬ë¦½íŠ¸ ?¤í–‰ ì¤??¤ë¥˜ ë°œìƒ:', error);
  }
}

generateBlogPost();
