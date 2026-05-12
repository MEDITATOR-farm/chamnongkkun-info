import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const password = formData.get("password");
    const date = formData.get("date") || new Date().toISOString().split("T")[0];
    const imageFiles = formData.getAll("images");
    const videoFile = formData.get("video");

    // GitHub 설정
    const token = process.env.GITHUB_TOKEN;
    const owner = 'MEDITATOR-farm';
    const repo = 'chamnongkkun-info';
    const branch = 'main';

    if (!token) {
      return NextResponse.json({ error: "서버에 GITHUB_TOKEN이 설정되지 않았습니다." }, { status: 500 });
    }

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });
    }

    const imageUrls = [];
    let videoUrl = "";

    // 유틸리티: GitHub에 파일 업로드 함수
    const uploadToGithub = async (file, subPath) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `public/uploads/diaries/${subPath}/${filename}`;
      const base64Content = buffer.toString('base64');

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: `관리자: 농부일기 파일 업로드 (${filename})`,
          content: base64Content,
          branch: branch
        })
      });

      if (!res.ok) {
        throw new Error(`GitHub 파일 업로드 실패: ${file.name}`);
      }
      return `/uploads/diaries/${subPath}/${filename}`;
    };

    // 이미지 업로드
    for (const imageFile of imageFiles) {
      if (imageFile && typeof imageFile !== "string" && imageFile.size > 0) {
        const url = await uploadToGithub(imageFile, "images");
        imageUrls.push(url);
      }
    }

    // 영상 업로드
    if (videoFile && typeof videoFile !== "string" && videoFile.size > 0) {
      videoUrl = await uploadToGithub(videoFile, "videos");
    }

    const newDiary = {
      id: Date.now(),
      title,
      content,
      date,
      image: imageUrls.length > 0 ? imageUrls[0] : null,
      images: imageUrls,
      video: videoUrl || null,
    };

    // diaries.json 업데이트
    const dataPath = 'public/data/diaries.json';
    let diaries = [];
    let sha = undefined;

    const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}?ref=${branch}`, {
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
      diaries = JSON.parse(content);
    }

    diaries.unshift(newDiary);
    const updatedContent = Buffer.from(JSON.stringify(diaries, null, 2)).toString('base64');

    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${dataPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `관리자: 농부일기 등록 (${title})`,
        content: updatedContent,
        branch: branch,
        sha: sha
      })
    });

    if (!putRes.ok) {
      throw new Error("GitHub diaries.json 업데이트 실패");
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Save Diary Error:", err);
    return NextResponse.json({ error: "저장 실패: " + err.message }, { status: 500 });
  }
}
