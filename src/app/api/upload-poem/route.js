export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const themes = [
  { bgColor: "#f0f4f8", textColor: "#2d3748", accentColor: "#718096", mood: "잔잔한" },
  { bgColor: "#fff5f5", textColor: "#742a2a", accentColor: "#fc8181", mood: "그리운" },
  { bgColor: "#f0fff4", textColor: "#22543d", accentColor: "#48bb78", mood: "따뜻한" },
  { bgColor: "#ebf8ff", textColor: "#2a4365", accentColor: "#63b3ed", mood: "고요한" },
  { bgColor: "#faf5ff", textColor: "#44337a", accentColor: "#9f7aea", mood: "몽환적인" },
  { bgColor: "#fffff0", textColor: "#744210", accentColor: "#ecc94b", mood: "희망찬" },
  { bgColor: "#fff8f1", textColor: "#7b341e", accentColor: "#ed8936", mood: "힘찬" },
  { bgColor: "#f7fafc", textColor: "#1a202c", accentColor: "#a0aec0", mood: "쓸쓸한" },
];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const password = formData.get("password");
    const author = formData.get("author") || "";

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 틀렸습니다" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "이미지가 없습니다" },
        { status: 400 }
      );
    }

    // 이미지 → base64 변환
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    // Google Vision API 호출
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: "TEXT_DETECTION" }],
          }],
        }),
      }
    );

    const visionData = await visionRes.json();

    // Vision API 오류 체크
    if (visionData.error) {
      return NextResponse.json(
        { error: "Vision API 오류: " + visionData.error.message },
        { status: 500 }
      );
    }

    const extractedText =
      visionData.responses?.[0]?.fullTextAnnotation?.text || "";

    if (!extractedText) {
      return NextResponse.json(
        { error: "텍스트를 인식하지 못했어요. 더 밝고 선명하게 찍어주세요!" },
        { status: 400 }
      );
    }

    // 첫 줄 = 제목, 나머지 = 본문
    const lines = extractedText
      .trim()
      .split("\n")
      .filter((l) => l.trim());
    const title = lines[0] || "제목 없음";
    const content = lines.slice(1).join("\n") || extractedText;

    // 랜덤 테마
    const theme = themes[Math.floor(Math.random() * themes.length)];

    const poemData = {
      id: Date.now(),
      title,
      author,
      content,
      mood: theme.mood,
      bgColor: theme.bgColor,
      textColor: theme.textColor,
      accentColor: theme.accentColor,
      date: new Date().toISOString().split("T")[0],
    };

    // poems.json 저장
    const dataPath = path.join(process.cwd(), "public/data/poems.json");
    let poems = [];
    try {
      if (fs.existsSync(dataPath)) {
        poems = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      }
    } catch (e) {
      poems = [];
    }

    poems.unshift(poemData);
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(poems, null, 2));

    return NextResponse.json({ success: true, poem: poemData });

  } catch (err) {
    console.error("upload-poem error:", err);
    return NextResponse.json(
      { error: "처리 실패: " + err.message },
      { status: 500 }
    );
  }
}
