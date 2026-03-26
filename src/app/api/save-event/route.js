import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { eventData, password } = await req.json();

    // 비밀번호 확인 (간단한 보안)
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!eventData || !eventData.name) {
      return NextResponse.json({ error: '저장할 데이터가 유효하지 않습니다.' }, { status: 400 });
    }

    const DATA_FILE_PATH = path.join(process.cwd(), 'public/data/chamnongkkun-info.json');
    
    // 기존 데이터 읽기
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const db = JSON.parse(fileContent);

    // 중복 확인
    const isDuplicate = db.events.some(e => e.name === eventData.name && e.startDate === eventData.startDate);
    if (isDuplicate) {
      return NextResponse.json({ error: '이미 존재하는 행사입니다.' }, { status: 409 });
    }

    // ID 부여
    const currentMaxId = db.events.length > 0 
      ? Math.max(...db.events.map(i => i.id)) 
      : 0;
    
    eventData.id = Math.max(currentMaxId + 1, Date.now()); 
    eventData.category = eventData.category || '행사';

    // 최신이 맨 위로 오도록 앞에 추가
    db.events.unshift(eventData);
    
    // 8개까지만 유지 (공간 효율성 유지)
    if (db.events.length > 8) {
      db.events = db.events.slice(0, 8);
    }

    // 파일 저장
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');

    return NextResponse.json({ success: true, eventId: eventData.id });

  } catch (error) {
    console.error('Save Event Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다: ' + error.message }, { status: 500 });
  }
}
