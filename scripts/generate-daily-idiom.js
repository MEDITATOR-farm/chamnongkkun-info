const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function generateDailyIdiom() {
  const excelFilePath = path.join(__dirname, '../사자성어.xlsx');
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/idiom.json');

  if (!fs.existsSync(excelFilePath)) {
    console.error('오류: 사자성어.xlsx 파일을 찾을 수 없습니다.');
    return;
  }

  const workbook = XLSX.readFile(excelFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const idioms = [];
  rows.forEach((row, index) => {
    if (index === 0 || !row || row.length < 4) return;
    
    let chars = String(row[2] || '').trim();
    let hanja = String(row[3] || '').trim();
    let meaning = String(row[4] || '').trim();
    let detail = String(row[5] || '').trim();
    let example = String(row[6] || '').trim();

    if (!chars || chars === '사자성어') return;
    const fullMeaning = detail ? meaning + ' (' + detail + ')' : meaning;

    idioms.push({
      hanja: hanja,
      chars: chars,
      meaning: fullMeaning,
      example: example
    });
  });

  if (idioms.length === 0) {
    console.log('추출된 사자성어 데이터가 없습니다.');
    return;
  }

  const randomIndex = Math.floor(Math.random() * idioms.length);
  const selectedIdiom = idioms[randomIndex];

  console.log('[사자성어 업데이트 완료] ' + selectedIdiom.chars + ' (' + selectedIdiom.hanja + ')');

  const processedIdiom = [selectedIdiom];
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(processedIdiom, null, 2), 'utf-8');
}

generateDailyIdiom();
