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
    
    // events와 benefits 합쳐서 가장 마지막(최신) 항목 가져오기
    const allItems = [...db.events, ...db.benefits];
    if (allItems.length === 0) {
      console.log('데이터가 없습니다.');
      return;
    }
    
    // ID 기준으로 가장 큰 항목을 최신으로 간주 (또는 배열 순서상 마지막)
    const latestItem = allItems.sort((a, b) => b.id - a.id)[0];
    const itemName = latestItem.name;

    // 기존 포스트들과 비교
    const existingFiles = await fs.readdir(POSTS_DIR);
    for (const file of existingFiles) {
      if (file.endsWith('.md')) {
        const content = await fs.readFile(path.join(POSTS_DIR, file), 'utf-8');
        if (content.includes(itemName)) {
          console.log('이미 작성된 글입니다.');
          return;
        }
      }
    }

    // 2단계: Gemini AI로 블로그 글 생성
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
source_link: ${latestItem.link}
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: ${today}-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
    const resultText = geminiJson.candidates[0].content.parts[0].text;

    // 3단계: 파일 저장 (내용과 파일명 분리)
    const lines = resultText.trim().split('\n');
    let filenameLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes('FILENAME:')) {
        filenameLineIndex = i;
        break;
      }
    }

    if (filenameLineIndex === -1) {
      throw new Error('파일명 형식을 찾을 수 없습니다.');
    }

    const filename = lines[filenameLineIndex].replace('FILENAME:', '').trim() + '.md';
    const postContent = lines.slice(0, filenameLineIndex).join('\n').trim();

    await fs.writeFile(path.join(POSTS_DIR, filename), postContent, 'utf-8');
    console.log(`생성 완료: ${filename}`);

  } catch (error) {
    console.error('스크립트 실행 중 오류 발생:', error);
  }
}

generateBlogPost();
