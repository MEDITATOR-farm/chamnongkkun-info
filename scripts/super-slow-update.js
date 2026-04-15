const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const scripts = [
  'node --env-file=.env.local scripts/generate-daily-books.js',
  'node --env-file=.env.local scripts/generate-daily-stocks.js',
  'node --env-file=.env.local scripts/fetch-public-data.js',
  'node --env-file=.env.local scripts/fetch-geoje-events.js',
  'node --env-file=.env.local scripts/fetch-rss-events.js',
  'node --env-file=.env.local scripts/update-restaurant-ranking.js',
  'node --env-file=.env.local scripts/generate-blog-post.js'
];

async function runWithDelay() {
  console.log('?? [?‘ë˜‘???…ë°?´íŠ¸ê¸?ë¥??œì‘?©ë‹ˆ?? (AIê°€ ì§€ì¹˜ì? ?Šê²Œ ì²œì²œ??ì§„í–‰?©ë‹ˆ??');
  
  for (const cmd of scripts) {
      try {
          console.log(`\n-----------------------------------------`);
          console.log(`?“¡ ?¤í–‰ ì¤? ${cmd}`);
          // 60ì´??€ê¸?(Gemini Free Tier??429 ?ëŸ¬ ë°©ì?)
          console.log(`??AIê°€ ?????ˆê²Œ 60ì´ˆê°„ ?€ê¸°í•©?ˆë‹¤...`);
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          const output = execSync(cmd, { stdio: 'inherit' });
          console.log(`???„ë£Œ!`);
      } catch (error) {
          console.error(`???¤ë¥˜ ë°œìƒ: ${cmd}`);
          console.error(`?´ìœ : ${error.message}`);
      }
  }
  
  console.log(`\n=========================================`);
  console.log(`??ëª¨ë“  ?…ë°?´íŠ¸ê°€ ?„ë£Œ?˜ì—ˆ?µë‹ˆ??`);
  console.log(`?´ì œ ë¸Œë¼?°ì??ì„œ ìµœì‹  ?•ë³´ë¥??•ì¸??ë³´ì„¸??`);
  console.log(`=========================================`);
}

runWithDelay();
