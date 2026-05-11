const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

/**
 * automation-control.json 파일의 설정을 확인하여 
 * 특정 스크립트를 실행할지 말지 결정하는 라우팅 스크립트입니다.
 */

const configKey = process.argv[2];
const scriptPath = process.argv[3];

if (!configKey || !scriptPath) {
  console.error('사용법: node scripts/run-if-enabled.js [설정키] [스크립트경로]');
  process.exit(1);
}

const configPath = path.join(__dirname, '../automation-control.json');

try {
  let fileContent = fs.readFileSync(configPath, 'utf8');
  // 눈에 보이지 않는 BOM(Byte Order Mark) 특수 문자가 있을 경우 제거
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1);
  }
  const config = JSON.parse(fileContent);

  if (config[configKey] === true) {
    console.log(`\n🟢 [자동화 켜짐] '${configKey}' 설정이 활성화되어 스크립트를 실행합니다: ${scriptPath}`);
    
    // 환경 변수를 그대로 전달하면서 스크립트 실행
    const result = spawnSync('node', [scriptPath], { 
      stdio: 'inherit', 
      env: process.env 
    });

    if (result.status !== 0) {
      console.error(`🔴 [오류 발생] ${scriptPath} 실행 중 문제가 생겼습니다. (코드: ${result.status})`);
    }
  } else {
    console.log(`\n⏸️ [자동화 꺼짐] '${configKey}' 설정이 비활성화되어 있어 스크립트를 건너뜁니다: ${scriptPath}`);
  }
} catch (error) {
  console.error(`❌ [설정 확인 실패] automation-control.json 파일을 읽는 중 오류가 발생했습니다:`, error.message);
  process.exit(1);
}
