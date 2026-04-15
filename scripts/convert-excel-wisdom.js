const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * ?��? ?�일???�어??모든 ?�트???�이?��? ?�나??JSON 배열�?변?�합?�다.
 */
function convertExcelToJson() {
  const excelFilePath = path.join(__dirname, '../명심보감2.xlsx');
  const outputFilePath = path.join(__dirname, '../public/data/wisdom.json');

  console.log('?��? ?�일 ?�기 ?�작:', excelFilePath);

  if (!fs.existsSync(excelFilePath)) {
    console.error('?�류: 명심보감.xlsx ?�일??찾을 ???�습?�다.');
    return;
  }

  // ?��? ?�일 로드
  const workbook = XLSX.readFile(excelFilePath);
  const allWisdoms = [];

  // 모든 ?�트 ?�회
  workbook.SheetNames.forEach((sheetName) => {
    console.log(`?�트 처리 �? ${sheetName}`);
    const sheet = workbook.Sheets[sheetName];
    
    // ?�트 ?�이?��? JSON ?�식?�로 변??(?�더 ?�이 배열 ?�이?�로 가?�옴)
    // header: 1 ?�션?� ?�이?��? 2차원 배열�?가?�옵?�다.
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, index) => {
      // ?�이?��? ?�거???�무 짧�? ?��? 건너?�니??
      if (!row || row.length < 2) return;

      // ?�자, 발음, ??추출 (?�목 줄일 가?�성???�는 글?�들?� 건너?�니??
      let chars = String(row[0] || '').trim();
      let reading = String(row[1] || '').trim();
      let meaning = String(row[2] || '').trim();

      // ?�목 �?Header) 건너?�기 로직
      if (chars === '?�자' || chars === 'Hanja' || chars.includes('?�문')) return;
      if (!chars) return;

      allWisdoms.push({
        chars,
        reading: reading || '',
        meaning: meaning || ''
      });
    });
  });

  console.log(`�?${allWisdoms.length}개의 명심보감 문구�?찾았?�니??`);

  // JSON ?�일�??�??
  fs.writeFileSync(outputFilePath, JSON.stringify(allWisdoms, null, 2), 'utf-8');
  console.log('변???�료! ?�?�된 ?�치:', outputFilePath);
}

// ?�행
try {
  convertExcelToJson();
} catch (error) {
  console.error('변??�??�류 발생:', error);
}
