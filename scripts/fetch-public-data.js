const fs = require('fs').promises;
const path = require('path');

async function fetchPublicData() {
  const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');

  if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
    console.error('?ÑÏàò ?òÍ≤Ω Î≥Ä?òÍ? ?§Ï†ï?òÏ? ?äÏïò?µÎãà??');
    return;
  }

  try {
    // 1?®Í≥Ñ: Í≥µÍ≥µ?∞Ïù¥?∞Ìè¨??API?êÏÑú ?∞Ïù¥??Í∞Ä?∏Ïò§Í∏?    const publicDataUrl = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    const publicResponse = await fetch(publicDataUrl);
    
    if (!publicResponse.ok) {
      throw new Error(`Í≥µÍ≥µ?∞Ïù¥??API ?∏Ï∂ú ?§Ìå®: ${publicResponse.status}`);
    }

    const publicJson = await publicResponse.json();
    const allItems = publicJson.data || [];

    if (allItems.length === 0) {
      console.log('Í∞Ä?∏Ïò® ?∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§.');
      return;
    }

    // ?ÑÌÑ∞Îß?Î°úÏßÅ
    const filterByKeyword = (items, keyword) => {
      return items.filter(item => 
        (item.?úÎπÑ?§Î™Ö && item.?úÎπÑ?§Î™Ö.includes(keyword)) ||
        (item.?úÎπÑ?§Î™©?ÅÏöî??&& item.?úÎπÑ?§Î™©?ÅÏöî??includes(keyword)) ||
        (item.ÏßÄ?êÎ???&& item.ÏßÄ?êÎ???includes(keyword)) ||
        (item.?åÍ?Í∏∞Í?Î™?&& item.?åÍ?Í∏∞Í?Î™?includes(keyword))
      );
    };

    let filteredItems = filterByKeyword(allItems, 'Í±∞Ï†ú');
    if (filteredItems.length === 0) {
      filteredItems = filterByKeyword(allItems, 'Í≤ΩÎÇ®');
    }
    if (filteredItems.length === 0) {
      filteredItems = allItems;
    }

    // 2?®Í≥Ñ: Í∏∞Ï°¥ ?∞Ïù¥?∞Ï? ÎπÑÍµê
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    const existingNames = new Set([
      ...db.events.map(e => e.name),
      ...db.benefits.map(b => b.name)
    ]);

    const newItems = filteredItems.filter(item => !existingNames.has(item.?úÎπÑ?§Î™Ö));

    if (newItems.length === 0) {
      console.log('?àÎ°ú???∞Ïù¥?∞Í? ?ÜÏäµ?àÎã§.');
      return;
    }

    // ?àÎ°ú????™© Ï§?Ï≤?Î≤àÏß∏ 1Í∞úÎßå ?†ÌÉù
    const targetItem = newItems[0];

    // 3?®Í≥Ñ: Gemini AIÎ°?????™© Í∞ÄÍ≥?    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `?ÑÎûò Í≥µÍ≥µ?∞Ïù¥??1Í±¥ÏùÑ Î∂ÑÏÑù?¥ÏÑú JSON Í∞ùÏ≤¥Î°?Î≥Ä?òÌï¥Ï§? ?ïÏãù:
{id: ?´Ïûê, name: ?úÎπÑ?§Î™Ö, category: '?âÏÇ¨' ?êÎäî '?úÌÉù', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: ?•ÏÜå ?êÎäî Í∏∞Í?Î™? target: ÏßÄ?êÎ??? summary: ?úÏ§Ñ?îÏïΩ, link: ?ÅÏÑ∏URL}
category???¥Ïö©??Î≥¥Í≥† ?âÏÇ¨/Ï∂ïÏ†úÎ©?'?âÏÇ¨', ÏßÄ?êÍ∏à/?úÎπÑ?§Î©¥ '?úÌÉù'?ºÎ°ú ?êÎã®??
startDateÍ∞Ä ?ÜÏúºÎ©??§Îäò ?†Ïßú, endDateÍ∞Ä ?ÜÏúºÎ©?'?ÅÏãú'Î°??£Ïñ¥.
Î∞òÎìú??JSON Í∞ùÏ≤¥Îß?Ï∂úÎ†•?? ?§Î•∏ ?çÏä§???ÜÏù¥.

Î∂ÑÏÑù???∞Ïù¥??
${JSON.stringify(targetItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API ?∏Ï∂ú ?§Ìå®: ${geminiResponse.status}`);
    }

    const geminiJson = await geminiResponse.json();
    let resultText = geminiJson.candidates[0].content.parts[0].text;
    
    // ÎßàÌÅ¨?§Ïö¥ ÏΩîÎìú Î∏îÎ°ù ?úÍ±∞ Î∞?JSON ?åÏã±
    resultText = resultText.replace(/```json|```/g, '').trim();
    const processedItem = JSON.parse(resultText);

    // 4?®Í≥Ñ: Í∏∞Ï°¥ ?∞Ïù¥?∞Ïóê Ï∂îÍ?
    const categoryKey = processedItem.category === '?âÏÇ¨' ? 'events' : 'benefits';
    
    // ID Î∂Ä??(?ÑÏû¨ ?¥Îãπ Ïπ¥ÌÖåÍ≥†Î¶¨??ÏµúÎ? ID + 1)
    const currentMaxId = db[categoryKey].length > 0 
      ? Math.max(...db[categoryKey].map(i => i.id)) 
      : 0;
    processedItem.id = currentMaxId + 1;

    db[categoryKey].push(processedItem);

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
    console.log(`Ï∂îÍ? ?ÑÎ£å: ${processedItem.name} (${processedItem.category})`);

  } catch (error) {
    console.error('?§ÌÅ¨Î¶ΩÌä∏ ?§Ìñâ Ï§??§Î•ò Î∞úÏÉù:', error);
  }
}

fetchPublicData();
