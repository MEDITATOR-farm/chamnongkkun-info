import { NextResponse } from "next/server";

export async function GET(request) {
  // 예비 이미지 정의 (전역보다 로컬이 안전한 경우가 있음)
  const FALLBACK_DATA = {
    source: "fallback",
    results: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    ].map(url => ({ urls: { regular: url } }))
  };

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "nature";
    
    const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    // 키가 없거나 나중에 입력된 경우 즉시 예비 이미지 반환
    if (!UNSPLASH_KEY || UNSPLASH_KEY.includes("나중에")) {
      console.log("Unsplash 키가 없거나 미설정 상태입니다. 예비 이미지를 사용합니다.");
      return NextResponse.json(FALLBACK_DATA);
    }

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        },
        cache: "no-store"
      }
    );
    
    if (!res.ok) {
      console.warn(`Unsplash API 응답 오류 (${res.status}). 예비 이미지로 대체합니다.`);
      return NextResponse.json(FALLBACK_DATA);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("배경 이미지 검색 API 심각한 오류 발생 (예비 이미지로 최종 복구):", err);
    // 어떤 오류가 나더라도 절대 500을 띄우지 않고 200 OK와 예비 데이터를 전송
    return NextResponse.json(FALLBACK_DATA);
  }
}
