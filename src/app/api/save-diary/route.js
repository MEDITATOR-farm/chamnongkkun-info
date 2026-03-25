import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.json();
    const { title, content, password, date } = data;

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });
    }

    const newDiary = {
      id: Date.now(),
      title,
      content,
      date: date || new Date().toISOString().split("T")[0],
    };

    const dataPath = path.join(process.cwd(), "public", "data", "diaries.json");
    let diaries = [];
    
    if (fs.existsSync(dataPath)) {
      diaries = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    }

    diaries.unshift(newDiary);
    fs.writeFileSync(dataPath, JSON.stringify(diaries, null, 2), "utf8");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Save Diary Error:", err);
    return NextResponse.json({ error: "저장 실패: " + err.message }, { status: 500 });
  }
}
