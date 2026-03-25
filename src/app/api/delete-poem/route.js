import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const { id, password } = await req.json();

    // 환경 변수 비밀번호 확인
    const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
    if (!UPLOAD_PASSWORD || password !== UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "public", "data", "poems.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "데이터 파일을 찾을 수 없습니다." }, { status: 404 });
    }

    // 파일 읽기 및 필터링
    const fileContent = fs.readFileSync(filePath, "utf8");
    const poems = JSON.parse(fileContent);
    const updatedPoems = poems.filter((poem) => poem.id !== id);

    // 파일 저장
    fs.writeFileSync(filePath, JSON.stringify(updatedPoems, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "시가 성공적으로 삭제되었습니다." });

  } catch (err) {
    console.error("Delete API Error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다: " + err.message }, { status: 500 });
  }
}
