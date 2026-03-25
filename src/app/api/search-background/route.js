import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "nature";
  
  const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
  
  if (!UNSPLASH_KEY) {
    // API 키가 없을 경우: 예비용 아름다운 이미지 8장 전체 반환
    const fallbacks = [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      "https://images.unsplash.com/photo-1501854140801-50d01698950b",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    ];
    
    return NextResponse.json({ 
      source: "fallback",
      results: fallbacks.map(url => ({ urls: { regular: url } }))
    });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/api/v1/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_KEY}`
        }
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
