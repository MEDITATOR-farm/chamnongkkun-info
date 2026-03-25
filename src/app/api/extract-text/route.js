export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const password = formData.get("password");

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

    return NextResponse.json({ title, content });

  } catch (err) {
    console.error("extract-text error:", err);
    return NextResponse.json(
      { error: "처리 실패: " + err.message },
      { status: 500 }
    );
  }
}
