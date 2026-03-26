import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { text, password } = await req.json();

    // 비밀번호 확인 (간단한 보안)
    if (password !== process.env.UPLOAD_PASSWORD) {
      return NextResponse.json({ error: '비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }

    if (!text || text.trim().length < 10) {
      return NextResponse.json({ error: '분석할 텍스트가 너무 짧습니다.' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // Gemini API 호출
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const prompt = `아래 텍스트는 거제시청 홈페이지에서 가져온 공고/행사 내용이야. 
이 내용에서 핵심 행사 정보를 찾아 아래 JSON 형식으로 응답해줘.

형식:
{
  "name": "행사명",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "location": "장소",
  "target": "대상 (예: 거제시민, 전 국민 등)",
  "summary": "핵심 내용 1~2문장 요약",
  "link": "관련 URL (없으면 #)",
  "category": "행사"
}

반드시 순수 JSON 객체만 출력하고, 다른 설명은 하지 마.

데이터 내용:
${text}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'AI 분석 중 오류가 발생했습니다.' }, { status: 500 });
    }

    const data = await response.json();
    let resultText = data.candidates[0].content.parts[0].text;
    
    // Markdown 코드 블록 제거
    resultText = resultText.replace(/```json|```/g, '').trim();
    
    const eventData = JSON.parse(resultText);
    
    return NextResponse.json(eventData);

  } catch (error) {
    console.error('Extract Event Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다: ' + error.message }, { status: 500 });
  }
}
