const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

/**
 * automation-control.json ?Œì¼???¤ì •???•ì¸?˜ì—¬ 
 * ?¹ì • ?¤í¬ë¦½íŠ¸ë¥??¤í–‰? ì? ë§ì? ê²°ì •?˜ëŠ” ?„ìš°ë¯??¤í¬ë¦½íŠ¸?…ë‹ˆ??
 */

const configKey = process.argv[2];
const scriptPath = process.argv[3];

if (!configKey || !scriptPath) {
  console.error('?¬ìš©ë²? node scripts/run-if-enabled.js [?¤ì •?? [?¤í¬ë¦½íŠ¸ê²½ë¡œ]');
  process.exit(1);
}

const configPath = path.join(__dirname, '../automation-control.json');

try {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  if (config[configKey] === true) {
    console.log(`\n??[?ë™??ì¼œì§] '${configKey}' ??ª©???œì„±?”ë˜???ˆì–´ ?¤í¬ë¦½íŠ¸ë¥??¤í–‰?©ë‹ˆ?? ${scriptPath}`);
    
    // ?˜ê²½ ë³€?˜ë? ê·¸ë?ë¡??„ë‹¬?˜ë©´???¤í¬ë¦½íŠ¸ ?¤í–‰
    const result = spawnSync('node', [scriptPath], { 
      stdio: 'inherit', 
      env: process.env 
    });

    if (result.status !== 0) {
      console.error(`??[?¤ë¥˜ ë°œìƒ] ${scriptPath} ?¤í–‰ ì¤?ë¬¸ì œê°€ ?ê²¼?µë‹ˆ?? (ì½”ë“œ: ${result.status})`);
    }
  } else {
    console.log(`\n?š« [?ë™??êº¼ì§] '${configKey}' ??ª©??ë¹„í™œ?±í™”?˜ì–´ ?ˆì–´ ?¤í¬ë¦½íŠ¸ë¥?ê±´ë„ˆ?ë‹ˆ?? ${scriptPath}`);
  }
} catch (error) {
  console.error(`??[?¤ì • ?•ì¸ ?¤íŒ¨] automation-control.json ?Œì¼???½ëŠ” ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤:`, error.message);
  process.exit(1);
}
