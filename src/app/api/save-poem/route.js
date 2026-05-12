export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const poemData = await req.json();
    const password = poemData.password;

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
    }

    const { title, content, author, mood, bgColor, textColor, accentColor } = poemData;
    if (!title || !content || !mood) {
      return NextResponse.json({ error: "데이터가 부족합니다." }, { status: 400 });
    }

    const finalPoem = {
      id: Date.now(),
      title,
      author: author || "",
      content,
      mood,
      bgColor,
      textColor,
      accentColor,
      date: new Date().toISOString().split("T")[0],
    };

    // GitHub 설정
    const token = process.env.GITHUB_TOKEN;
    const owner = 'MEDITATOR-farm';
    const repo = 'chamnongkkun-info';
    const branch = 'main';
    const filePath = 'public/data/poems.json';

    if (!token) {
      return NextResponse.json({ error: "서버에 GITHUB_TOKEN이 설정되지 않았습니다." }, { status: 500 });
    }

    // 1. 기존 파일 가져오기
    let poems = [];
    let sha = undefined;
    
    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      cache: 'no-store'
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      poems = JSON.parse(content);
    }

    // 2. 새로운 데이터 추가
    poems.unshift(finalPoem);
    const updatedContent = Buffer.from(JSON.stringify(poems, null, 2)).toString('base64');

    // 3. GitHub에 업데이트 (Commit)
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `관리자: 새로운 시 등록 (${title})`,
        content: updatedContent,
        branch: branch,
        sha: sha
      })
    });

    if (!putRes.ok) {
      const errorData = await putRes.json();
      throw new Error(errorData.message || "GitHub 업데이트 실패");
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("save-poem error:", err);
    return NextResponse.json({ error: "처리 실패: " + err.message }, { status: 500 });
  }
}
