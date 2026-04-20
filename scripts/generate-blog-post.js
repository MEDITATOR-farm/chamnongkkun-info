const fs = require('fs').promises;
const path = require('path');

async function generateBlogPost() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const DATA_FILE_PATH = path.join(__dirname, '../public/data/chamnongkkun-info.json');
  const POSTS_DIR = path.join(__dirname, '../src/content/posts/');

  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
    return;
  }

  try {
    // 1단계: 최신 데이터 확인
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);
    
    // events와 benefits 합쳐서 가장 마지막(최신) 데이터 가져오기
    const allItems = [...db.events, ...db.benefits];
    if (allItems.length === 0) {
      console.log('데이터가 없습니다.');
      return;
    }
    
    // ID 기준으로 가장 큰 데이터가 최신으로 간주
    const latestItem = allItems.sort((a, b) => b.id - a.id)[0];
    const itemName = latestItem.name;

    // 2단계: 기존 포스트들과 비교하여 중복 주제 찾기 (최근 30개)
    const existingFiles = await fs.readdir(POSTS_DIR);
    const mdFiles = existingFiles.filter(file => file.endsWith('.md')).sort();
    const recentFiles = mdFiles.slice(-30);
    
    let postListText = "";
    for (const file of recentFiles) {
      const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
      const titleMatch = content.match(/title:\s*['"]?([^'"\n]+)/);
      if (titleMatch) {
         postListText += `- ${file}: ${titleMatch[1]}\n`;
      }
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    // AI에게 중복 여부 확인
    const checkPrompt = `내가 새로 작성할 블로그 글의 정보는 다음과 같아.
제목(이름): ${itemName}
요약: ${latestItem.summary}

아래는 기존에 작성된 최신 블로그 글 목록(파일명: 제목)이야.
${postListText}

새로 작성할 내용이 위 목록 중에 완전히 같은 행사나 사실상 80% 이상 겹치는 동일한 주제라면, 해당 파일명(예: 2026-04-05-keyword.md)을 딱 1개만 정확히 출력해줘.
만약 중복되는 게 조금도 없거나 새로운 행사/정보라면 대문자로 'NEW'라고만 출력해. 다른 설명은 절대 추가하지 마.`;

    const checkResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: checkPrompt }] }]
      })
    });

    if (!checkResponse.ok) {
      throw new Error(`Gemini API 호출 실패 (중복 확인): ${checkResponse.status}`);
    }

    const checkJson = await checkResponse.json();
    let checkResult = checkJson.candidates[0].content.parts[0].text.trim();
    // 마크다운 백틱 등이 들어올 수 있으므로 정리
    checkResult = checkResult.replace(/[`"]/g, '').trim();
    console.log(`중복 체크 결과: ${checkResult}`);

    const today = new Date().toISOString().split('T')[0];

    // 3단계: 업데이트 처리 또는 새 글 작성
    if (checkResult !== 'NEW' && checkResult.endsWith('.md')) {
      const targetFilePath = path.join(POSTS_DIR, checkResult);
      let originalPost = "";
      try {
        originalPost = await fs.readFile(targetFilePath, 'utf-8');
      } catch (err) {
        console.error('반환된 파일이 없습니다, 새 글 작성을 진행합니다.');
      }
      
      if (originalPost) {
        console.log(`${checkResult} 파일 업데이트 진행 중...`);
        const updatePrompt = `아래는 기존에 작성된 블로그 마크다운 글이야.
[기존 글 시작]
${originalPost}
[기존 글 끝]

그리고 방금 새로 들어온 최신 정보는 다음과 같아.
추가 내용: ${JSON.stringify(latestItem, null, 2)}

위의 추가 내용을 반영해서 기존 글을 더 풍부하고 최신화된 글로 업데이트해줘.
주의사항:
1. 문서 가장 처음 부분에 있는 '---' 로 둘러싸인 메타데이터(포맷) 구역은 반드시 유지해.
2. 단, 'date:' 부분을 오늘 날짜인 ${today}로 변경해줘. 이를 통해 목록의 최상단에 올라가게 해야 해.
3. 원래 글에서 이제는 필요 없어진 낡은 부분은 교체하고, 새로운 정보가 자연스럽게 녹아들게 본문을 정리해.
4. 블로그 포스팅 형태(친근한 말투)를 계속 띄어야 해.
5. 마크다운 본문과 메타데이터만 완벽하게 출력하고, 다른 안내말이나 이상한 기호는 절대 출력하지 마.`;

        const updateResponse = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: updatePrompt }] }]
          })
        });

        const updateJson = await updateResponse.json();
        const updatedContent = updateJson.candidates[0].content.parts[0].text;
        
        let finalContent = updatedContent.trim();
        // 앞뒤에 ```markdown 태그가 붙어있는 경우 제거
        if (finalContent.startsWith('\`\`\`markdown')) {
          finalContent = finalContent.replace(/^\`\`\`markdown\n/, '').replace(/\n\`\`\`$/, '');
        } else if (finalContent.startsWith('\`\`\`')) {
          finalContent = finalContent.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
        }

        await fs.writeFile(targetFilePath, finalContent, 'utf-8');
        console.log(`업데이트 완료: ${checkResult} (날짜가 ${today}로 갱신되었습니다)`);
        return;
      }
    }

    // NEW 이거나 파일을 못 찾은 경우 새 글 작성
    console.log('새 글 작성을 진행합니다.');
    
    const prompt = `아래 공공기관/새소식 정보를 바탕으로 블로그 글을 작성해줘.
${latestItem.detailContent ? `이미 작성된 상세 내용이 있다면 이것을 참고하여 잘 다듬어줘: ${latestItem.detailContent}` : ''}

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 빼!
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (핵심 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
source_link: ${latestItem.link}
---

(본문: 800자 이상, 친근한 블로그 말투, 추천 이유 3가지 포함, 행사의 경우 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명을 꼭 출력해줘. 키워드는 영문 소문자와 하이픈(-) 조합으로 써.`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API 호출 실패: ${geminiResponse.status}`);
    }

    const geminiJson = await geminiResponse.json();
    let resultText = geminiJson.candidates[0].content.parts[0].text;
    
    if (resultText.startsWith('\`\`\`markdown')) {
      resultText = resultText.replace(/^\`\`\`markdown\n/, '').replace(/\n\`\`\`$/, '');
    } else if (resultText.startsWith('\`\`\`')) {
      resultText = resultText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    // 파일 저장 분리
    const lines = resultText.trim().split('\n');
    let filenameLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('FILENAME:')) {
        filenameLineIndex = i;
        break;
      }
    }

    if (filenameLineIndex === -1) {
      throw new Error('파일명을 찾을 수 없습니다. (FILENAME: 형식 누락)');
    }

    let filename = lines[filenameLineIndex].replace('FILENAME:', '').replace(/['"\`]/g, '').trim();
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }
    
    const postContent = lines.slice(0, filenameLineIndex).join('\n').trim();

    await fs.writeFile(path.join(POSTS_DIR, filename), postContent, 'utf-8');
    console.log(`생성 완료: ${filename}`);

  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
  }
}

generateBlogPost();
