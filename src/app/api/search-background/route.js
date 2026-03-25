export const runtime = "nodejs";
import { NextResponse } from "next/server";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
];

const getFallbackResponse = () => NextResponse.json({ 
  source: "fallback",
  results: FALLBACK_IMAGES.map(url => ({ urls: { regular: url } }))
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "nature";
    
    const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
    
    // 키가 없거나 설정 전인 경우 바로 예비 이미지 반환
    if (!UNSPLASH_KEY || UNSPLASH_KEY === "나중에_입력") {
      return getFallbackResponse();
    }

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        },
        next: { revalidate: 0 }
      }
    );
    
    // 외부 API 호출 실패(401, 403 등) 시에도 에러를 띄우지 않고 예비 이미지로 대응
    if (!res.ok) {
      console.warn("Unsplash API 호출 실패, 예비 이미지로 전환합니다. 상태코드:", res.status);
      return getFallbackResponse();
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("search-background API 내부 오류 (예비 이미지 반환):", err);
    // 서버 내부 오류 시에도 사용자에게는 예비 이미지를 보여줌
    return getFallbackResponse();
  }
}
