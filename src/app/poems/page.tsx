"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PoemsPage() {
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);

  // 시 목록 가져오기 (클라이언트 측에서)
  useEffect(() => {
    setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    fetch("/data/poems.json?t=" + Date.now())
      .then(res => res.json())
      .then(data => {
        // ID 기준 최신순 정렬
        const sorted = data.sort((a: any, b: any) => b.id - a.id);
        setPoems(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      });
  }, []);

  // 삭제 처리 함수
  const handleDelete = async (id: number, title: string) => {
    // 로컬 환경 체크 (정적 사이트 배포 시 API가 작동하지 않으므로)
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      alert("⚠️ 삭제 기능은 사용자님의 컴퓨터(localhost:3000)에서만 작동합니다.\n\n내 컴퓨터에서 삭제를 완료한 후 'git push'를 해서 사이트에 반영해 주세요.");
      return;
    }

    const password = prompt(`'${title}' 시를 삭제하시겠습니까?\n발급받은 관리자 비밀번호를 입력해 주세요.`);
    
    if (!password) return;

    try {
      const res = await fetch("/api/delete-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password })
      });

      // 응답이 JSON이 아닐 경우(예: Static Export 404 페이지) 처리
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버 응답이 올바르지 않습니다. (localhost에서 실행 중인지 확인해 주세요)");
      }

      const data = await res.json();

      if (res.ok) {
        alert("성공적으로 삭제되었습니다.");
        // UI에서 즉시 제거
        setPoems(prev => prev.filter(p => p.id !== id));
      } else {
        alert("실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err: any) {
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <Link href="/" style={backLinkStyle}>← 홈으로 돌아가기</Link>
        <h1 style={titleStyle}>지난 시 모음</h1>
        <p style={subtitleStyle}>지금까지 우리 동네 소식통에 올라온 소중한 시들입니다.</p>

        {/* 로컬 환경에서만 보이는 시 쓰기 버튼 */}
        {isLocal && (
          <div style={{ marginTop: 24 }}>
            <Link href="/upload" style={{
              display: "inline-block",
              padding: "10px 24px",
              background: "#f97316", /* 주황색 포인트 */
              color: "white",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)",
            }}>
              ✨ 새로운 시 올리기
            </Link>
          </div>
        )}
      </header>

      {loading ? (
        <p style={{ textAlign: "center", padding: "50px" }}>시를 불러오는 중입니다... ☕</p>
      ) : (
        <div style={gridStyle}>
          {poems.map((poem) => (
            <div key={poem.id} style={{
              ...cardStyle,
              background: poem.bgColor,
              color: poem.textColor,
              position: "relative"
            }}>
              {/* 삭제 버튼 */}
              <button 
                onClick={() => handleDelete(poem.id, poem.title)}
                style={{
                  position: "absolute",
                  top: 15, right: 15,
                  background: "rgba(0,0,0,0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: 30, height: 30,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: 0.6,
                  transition: "0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.6")}
                title="삭제하기"
              >
                ✕
              </button>

              <div style={{ fontSize: 11, letterSpacing: 2, marginBottom: 8, opacity: 0.8 }}>
                {poem.mood}
              </div>
              <h3 style={{ fontSize: 18, marginBottom: 4, fontWeight: "bold" }}>{poem.title}</h3>
              {poem.author && <p style={{ fontSize: 13, marginBottom: 16, opacity: 0.7 }}>— {poem.author}</p>}
              <p style={{ 
                fontSize: 14, 
                lineHeight: 1.6, 
                whiteSpace: "pre-wrap", 
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                marginBottom: 16
              }}>
                {poem.content}
              </p>
              <div style={{ fontSize: 11, opacity: 0.5, marginTop: "auto" }}>{poem.date}</div>
            </div>
          ))}
        </div>
      )}

      {!loading && poems.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: "100px 0" }}>아직 등록된 시가 없네요. 📖</p>
      )}
    </main>
  );
}

const containerStyle: any = { maxWidth: 1000, margin: "0 auto", padding: "80px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle: any = { textAlign: "center", marginBottom: 60 };
const backLinkStyle: any = { color: "#888", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 };
const titleStyle: any = { fontSize: 32, fontWeight: "bold", color: "#3d3228", marginBottom: 12 };
const subtitleStyle: any = { color: "#888", fontSize: 16 };
const gridStyle: any = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 };
const cardStyle: any = { 
  borderRadius: 20, 
  padding: "32px 24px", 
  boxShadow: "0 8px 32px rgba(0,0,0,0.06)", 
  height: "100%", 
  display: "flex", 
  flexDirection: "column",
  fontFamily: "'Noto Serif KR', serif",
  transition: "0.3s"
};
