"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DiariesPage() {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/diaries.json?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        setDiaries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("일기 로드 실패:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      alert("⚠️ 삭제 기능은 사용자님의 컴퓨터(localhost:3000)에서만 작동합니다.");
      return;
    }

    const password = prompt(`'${title}' 일기를 삭제하시겠습니까?\n관리자 비밀번호를 입력해 주세요.`);
    if (!password) return;

    try {
      const res = await fetch("/api/delete-diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password })
      });

      const data = await res.json();
      if (res.ok) {
        alert("일기가 삭제되었습니다.");
        setDiaries(prev => prev.filter(d => d.id !== id));
      } else {
        alert("실패: " + data.error);
      }
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <Link href="/" style={backLinkStyle}>← 홈으로</Link>
        <h1 style={titleStyle}>📔 참농꾼의 농부 일기</h1>
        <p style={subtitleStyle}>흙과 땀으로 적어 내려간 농부님의 소중한 기록입니다.</p>
        <Link href="/upload-diary" style={writeButtonStyle}>✍️ 새 일기 쓰기</Link>
      </header>

      {loading ? (
        <p style={{ textAlign: "center", padding: "100px", color: "#888" }}>일기를 불러오는 중입니다... 🌱</p>
      ) : (
        <div style={gridStyle}>
          {diaries.map((diary) => (
            <div key={diary.id} style={diaryCard}>
              <button 
                onClick={() => handleDelete(diary.id, diary.title)}
                style={deleteButtonStyle}
                title="삭제하기"
              >✕</button>
              
              <div style={dateStyle}>{diary.date}</div>
              <h3 style={diaryTitle}>{diary.title}</h3>
              <p style={diaryContent}>{diary.content}</p>
            </div>
          ))}

          {diaries.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "100px 0" }}>
              <p style={{ fontSize: 20, color: "#aaa", marginBottom: 20 }}>아직 기록된 일기가 없습니다. 🌾</p>
              <Link href="/upload-diary" style={{ color: "#4a7c59", fontWeight: "bold" }}>첫 일기 쓰러 가기</Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

const containerStyle: any = { maxWidth: 900, margin: "0 auto", padding: "80px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle: any = { textAlign: "center", marginBottom: 80 };
const backLinkStyle: any = { color: "#888", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 };
const titleStyle: any = { fontSize: 40, fontWeight: "900", color: "#2d241e", marginBottom: 15 };
const subtitleStyle: any = { color: "#888", fontSize: 18, marginBottom: 30 };
const writeButtonStyle: any = { 
  display: "inline-block", padding: "12px 24px", borderRadius: 30, background: "#4a7c59", 
  color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: "bold", boxShadow: "0 4px 15px rgba(74, 124, 89, 0.2)"
};

const gridStyle: any = { display: "flex", flexDirection: "column", gap: 40 };

const diaryCard: any = { 
  background: "#fff", padding: "40px", borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.03)", border: "1px solid #f0eee0",
  position: "relative", transition: "0.3s",
  fontFamily: "'Noto Serif KR', serif"
};

const dateStyle: any = { fontSize: 14, color: "#8b4513", opacity: 0.6, marginBottom: 12 };
const diaryTitle: any = { fontSize: 24, fontWeight: "bold", color: "#3d3228", marginBottom: 20 };
const diaryContent: any = { fontSize: 17, lineHeight: 1.9, color: "#5d5248", whiteSpace: "pre-wrap" };

const deleteButtonStyle: any = {
  position: "absolute", top: 20, right: 20, background: "none", border: "none",
  color: "#ccc", fontSize: 20, cursor: "pointer", padding: 10
};
