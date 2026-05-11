const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * 엑셀 파일을 읽어서 모든 시트의 데이터를 하나의 JSON 배열로 변환합니다.
 */
function convertExcelToJson() {
  const excelFilePath = path.join(__dirname, '../명심보감2.xlsx');
  const outputFilePath = path.join(__dirname, '../public/data/wisdom.json');

  console.log('엑셀 파일 읽기 시작:', excelFilePath);

  if (!fs.existsSync(excelFilePath)) {
    console.error('오류: 명심보감.xlsx 파일을 찾을 수 없습니다.');
    return;
  }

  // 엑셀 파일 로드
  const workbook = XLSX.readFile(excelFilePath);
  const allWisdoms = [];

  // 모든 시트 순회
  workbook.SheetNames.forEach((sheetName) => {
    console.log(`시트 처리 중: ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    
    // 시트 데이터를 JSON 형식으로 변환 (헤더 없이 배열 데이터로 가져옴)
    // header: 1 옵션은 데이터를 2차원 배열로 가져옵니다.
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, index) => {
      // 데이터가 없거나 너무 짧은 행은 건너뜁니다.
      if (!row || row.length < 2) return;

      // 한자, 발음, 뜻 추출 (제목 줄일 가능성이 있는 글자들은 건너뜁니다)
      let chars = String(row[0] || '').trim();
      let reading = String(row[1] || '').trim();
      let meaning = String(row[2] || '').trim();

      // 제목 줄(Header) 건너뛰기 로직
      if (chars === '한자' || chars === 'Hanja' || chars.includes('원문')) return;
      if (!chars) return;

      allWisdoms.push({
        chars,
        reading: reading || '',
        meaning: meaning || ''
      });
    });
  });

  console.log(`총 ${allWisdoms.length}개의 명심보감 문구를 찾았습니다.`);

  // JSON 파일로 저장
  fs.writeFileSync(outputFilePath, JSON.stringify(allWisdoms, null, 2), 'utf-8');
  console.log('변환 완료! 저장된 위치:', outputFilePath);
}

// 실행
try {
  convertExcelToJson();
} catch (error) {
  console.error('변환 중 오류 발생:', error);
}
