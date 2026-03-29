"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientPage() {
  const { id } = useParams();
  const [diary, setDiary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // 전체 일기 데이터를 불러온 뒤, 클릭한 글의 id와 일치하는 것만 찾습니다.
    fetch("/data/diaries.json?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        const found = data.find((d: any) => d.id.toString() === id.toString());
        setDiary(found);
        setLoading(false);
      })
      .catch(err => {
        console.error("해당 글 로드 실패:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main style={containerStyle}>
        <p style={{ textAlign: "center", padding: "100px", color: "#888" }}>
          글을 불러오는 중입니다... 🌱
        </p>
      </main>
    );
  }

  if (!diary) {
    return (
      <main style={containerStyle}>
        <p style={{ textAlign: "center", padding: "100px", color: "#888" }}>
          해당 일기를 찾을 수 없습니다. 😢
        </p>
        <div style={{ textAlign: "center" }}>
          <Link href="/diaries" style={backLinkStyle}>
            ← 전체 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <Link href="/diaries" style={backLinkStyle}>← 목록으로 돌아가기</Link>
      </header>

      <div style={diaryCard}>
        <div style={dateStyle}>{diary.date}</div>
        <h1 style={diaryTitle}>{diary.title}</h1>

        {/* 이미지가 있을 경우 */}
        {diary.image && (
          <div style={mediaContainer}>
            <img src={diary.image} alt={diary.title} style={mediaImage} />
          </div>
        )}

        {/* 영상이 있을 경우 */}
        {diary.video && (
          <div style={mediaContainer}>
            <video src={diary.video} controls style={mediaImage} />
          </div>
        )}

        <p style={diaryContent}>{diary.content}</p>
      </div>
    </main>
  );
}

// 스타일 정의
const containerStyle: any = { maxWidth: 800, margin: "0 auto", padding: "60px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle: any = { marginBottom: 30 };
const backLinkStyle: any = { 
  display: "inline-block", padding: "10px 18px", background: "#f5f5f5", color: "#555", 
  borderRadius: "20px", textDecoration: "none", fontSize: "14px", fontWeight: "bold",
  transition: "0.2s"
};
const diaryCard: any = { 
  background: "#fff", padding: "40px", borderRadius: 20,
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid #f0eee0",
  fontFamily: "'Noto Serif KR', serif"
};
const dateStyle: any = { fontSize: 13, color: "#8b4513", opacity: 0.6, marginBottom: 15, letterSpacing: 1 };
const diaryTitle: any = { fontSize: 26, fontWeight: "900", color: "#2d241e", marginBottom: 30 };
const diaryContent: any = { fontSize: 17, lineHeight: 2.0, color: "#4d4238", whiteSpace: "pre-wrap" };
const mediaContainer: any = { marginBottom: 30, borderRadius: 16, overflow: "hidden", border: "1px solid #f4f4f4", background: "#fafafa" };
const mediaImage: any = { width: "100%", maxHeight: 600, objectFit: "contain", display: "block" };
