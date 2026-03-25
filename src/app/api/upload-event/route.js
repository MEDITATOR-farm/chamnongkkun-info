export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const password = formData.get("password");
    
    // 비밀번호 확인
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json(
        { error: "비밀번호가 틀렸습니다" },
        { status: 401 }
      );
    }

    const newEvent = {
      id: Date.now(),
      name: formData.get("name"),
      category: formData.get("category") || "행사",
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      location: formData.get("location"),
      target: formData.get("target"),
      summary: formData.get("summary"),
      link: formData.get("link") || "#",
    };

    // 필수 항목 체크
    if (!newEvent.name || !newEvent.startDate || !newEvent.summary) {
      return NextResponse.json(
        { error: "필수 항목(이름, 날짜, 요약)을 모두 입력해 주세요" },
        { status: 400 }
      );
    }

    // chamnongkkun-info.json 저장
    const dataPath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
    let data = { events: [], benefits: [], blogPosts: [] };
    
    try {
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      }
    } catch (e) {
      console.error("파일 읽기 에러:", e);
    }

    // events 배열 최상단에 추가
    if (!data.events) data.events = [];
    data.events.unshift(newEvent);
    
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, event: newEvent });

  } catch (err) {
    console.error("upload-event error:", err);
    return NextResponse.json(
      { error: "처리 실패: " + err.message },
      { status: 500 }
    );
  }
}
