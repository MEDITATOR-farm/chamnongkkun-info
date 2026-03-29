export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const password = formData.get("password");
    const title = formData.get("title") || "제목 없음";
    const author = formData.get("author") || "";

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 틀렸습니다" },
        { status: 401 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "이미지가 없습니다" },
        { status: 400 }
      );
    }

    // 파일 이름 생성
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 저장 경로 설정
    const uploadDir = path.join(process.cwd(), "public", "uploads", "poems");
    await mkdir(uploadDir, { recursive: true });
    
    const uploadPath = path.join(uploadDir, filename);
    await writeFile(uploadPath, buffer);
    const imageUrl = `/uploads/poems/${filename}`;

    // 저장용 데이터 정제
    const finalPoem = {
      id: Date.now(),
      title,
      author,
      imageUrl,
      type: "image",
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

    return NextResponse.json({ success: true, poem: finalPoem });

  } catch (err) {
    console.error("save-poem-image error:", err);
    return NextResponse.json(
      { error: "처리 실패: " + err.message },
      { status: 500 }
    );
  }
}
