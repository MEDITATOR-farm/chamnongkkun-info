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
  console.log('🚀 [똑똑한 업데이트기]를 시작합니다. (AI가 지치지 않게 천천히 진행합니다)');
  
  for (const cmd of scripts) {
      try {
          console.log(`\n-----------------------------------------`);
          console.log(`📡 실행 중: ${cmd}`);
          // 60초 대기 (Gemini Free Tier의 429 에러 방지)
          console.log(`⏳ AI가 쉴 수 있게 60초간 대기합니다...`);
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          const output = execSync(cmd, { stdio: 'inherit' });
          console.log(`✅ 완료!`);
      } catch (error) {
          console.error(`❌ 오류 발생: ${cmd}`);
          console.error(`이유: ${error.message}`);
      }
  }
  
  console.log(`\n=========================================`);
  console.log(`✨ 모든 업데이트가 완료되었습니다!`);
  console.log(`이제 브라우저에서 최신 정보를 확인해 보세요.`);
  console.log(`=========================================`);
}

runWithDelay();
