import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const password = formData.get("password");
    const date = formData.get("date") || new Date().toISOString().split("T")[0];
    const imageFile = formData.get("image");
    const videoFile = formData.get("video");

    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "비밀번호가 틀렸습니다" }, { status: 401 });
    }

    if (!title || !content) {
      return NextResponse.json({ error: "제목과 내용을 입력해 주세요." }, { status: 400 });
    }

    let imageUrl = "";
    let videoUrl = "";

    // 이미지 저장
    if (imageFile && typeof imageFile !== "string") {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${imageFile.name}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", "diaries", "images", filename);
      await writeFile(uploadPath, buffer);
      imageUrl = `/uploads/diaries/images/${filename}`;
    }

    // 영상 저장
    if (videoFile && typeof videoFile !== "string") {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${videoFile.name}`;
      const uploadPath = path.join(process.cwd(), "public", "uploads", "diaries", "videos", filename);
      await writeFile(uploadPath, buffer);
      videoUrl = `/uploads/diaries/videos/${filename}`;
    }

    const newDiary = {
      id: Date.now(),
      title,
      content,
      date,
      image: imageUrl,
      video: videoUrl,
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
