import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { id, password } = await req.json();

    const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD?.trim();
    if (!UPLOAD_PASSWORD || password?.trim() !== UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "관리자 비밀번호가 일치하지 않습니다." }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "public", "data", "diaries.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "데이터 파일을 찾을 수 없습니다." }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf8");
    const diaries = JSON.parse(fileContent);
    const updatedDiaries = diaries.filter((d) => d.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(updatedDiaries, null, 2), "utf8");

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Delete Diary Error:", err);
    return NextResponse.json({ error: "오류 발생: " + err.message }, { status: 500 });
  }
}
