export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const poemData = await req.json();
    const password = poemData.password;

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 틀렸습니다" },
        { status: 401 }
      );
    }

    // 필수 항목 체크 (password는 위에서 체크했으므로 제외)
    const { title, content, author, mood, bgColor, textColor, accentColor } = poemData;
    if (!title || !content || !mood) {
      return NextResponse.json(
        { error: "데이터가 부족합니다." },
        { status: 400 }
      );
    }

    // 저장용 데이터 정제
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

    poems.unshift(finalPoem);
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(poems, null, 2));

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("save-poem error:", err);
    return NextResponse.json(
      { error: "처리 실패: " + err.message },
      { status: 500 }
    );
  }
}
