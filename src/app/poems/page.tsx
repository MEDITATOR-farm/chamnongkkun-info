"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function PoemsPage() {
  const [poems, setPoems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocal, setIsLocal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  // 현재 선택된 시 객체
  const selectedPoem = selectedIndex !== null ? poems[selectedIndex] : null;

  // 이전 시로 이동
  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(prev => (prev! > 0 ? prev! - 1 : poems.length - 1));
  }, [selectedIndex, poems.length]);

  // 다음 시로 이동
  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex(prev => (prev! < poems.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, poems.length]);

  // 키보드 방향키로도 이동 가능하게
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, goPrev, goNext]);

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
        setSelectedIndex(null);
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
          {poems.map((poem, index) => {
            // 배경색이 없거나 흰색인 경우 기본 크림색 배경 적용
            const bg = poem.bgColor && poem.bgColor !== "#ffffff" && poem.bgColor !== "#FFFFFF"
              ? poem.bgColor
              : "#fdf6ee";
            const textCol = poem.textColor || "#3d3228";

            return (
              <div key={poem.id} style={{
                ...cardStyle,
                background: bg,
                color: textCol,
                position: "relative",
                border: `1px solid ${bg === "#fdf6ee" ? "#e8d5b7" : "transparent"}`,
              }} onClick={() => setSelectedIndex(index)}>
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(poem.id, poem.title);
                  }}
                  style={{
                    position: "absolute",
                    top: 15, right: 15,
                    background: "rgba(0,0,0,0.07)",
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

                <div style={{ fontSize: 11, letterSpacing: 2, marginBottom: 8, opacity: 0.7 }}>
                  {poem.mood || "오늘의 시집"}
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 4, fontWeight: "bold" }}>{poem.title}</h3>
                {poem.author && <p style={{ fontSize: 13, marginBottom: 16, opacity: 0.7 }}>— {poem.author}</p>}

                {(poem.type === "image" || poem.imageUrl) ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden", marginBottom: 16 }}>
                    <img
                      src={poem.imageUrl}
                      alt={poem.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <p style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: 16,
                    flex: 1,
                  }}>
                    {poem.content}
                  </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{poem.date}</div>
                  <div style={{ fontSize: 11, fontWeight: "bold", opacity: 0.5 }}>크게 보기 🔍</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && poems.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", padding: "100px 0" }}>아직 등록된 시가 없네요. 📖</p>
      )}

      {/*
        팝업(모달) 창: 시를 클릭했을 때 나타납니다.
        이전 / 다음 버튼으로 시를 넘길 수 있습니다.
      */}
      {selectedPoem && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            padding: "16px",
          }}
          onClick={() => setSelectedIndex(null)}
        >
          {/* 이전 버튼 */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={navBtnStyle}
            title="이전 시"
          >
            ‹
          </button>

          {/* 시 본문 카드 - 항상 같은 크기 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "580px",
              height: "80vh",
              maxHeight: "680px",
              background: "#fdfbf7",
              borderRadius: "24px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
              border: "1px solid rgba(249,115,22,0.15)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* 닫기 버튼 */}
            <button
              style={{
                position: "absolute", top: 16, right: 16,
                background: "white",
                border: "none",
                borderRadius: "50%",
                width: 40, height: 40,
                fontSize: 20, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                color: "#888",
                zIndex: 10,
                transition: "color 0.2s"
              }}
              onMouseOver={e => (e.currentTarget.style.color = "#f97316")}
              onMouseOut={e => (e.currentTarget.style.color = "#888")}
              onClick={() => setSelectedIndex(null)}
            >
              ×
            </button>

            {/* 시 번호 표시 */}
            <div style={{
              textAlign: "center",
              padding: "20px 20px 0",
              fontSize: 12,
              color: "#f97316",
              fontWeight: "bold",
              letterSpacing: 2,
              opacity: 0.8,
            }}>
              {selectedIndex! + 1} / {poems.length}
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 40px 24px" }}>
              {/* 제목 */}
              <h2 style={{
                fontSize: "1.6rem",
                fontFamily: "'Noto Serif KR', serif",
                fontWeight: "bold",
                color: "#3d3228",
                textAlign: "center",
                marginBottom: "24px",
                paddingBottom: "20px",
                borderBottom: "2px solid #fde8d0",
                position: "relative",
              }}>
                {selectedPoem.title}
                <span style={{
                  position: "absolute", bottom: -2,
                  left: "50%", transform: "translateX(-50%)",
                  width: 48, height: 2,
                  background: "#f97316", display: "block"
                }} />
              </h2>

              {/* 이미지 시 */}
              {(selectedPoem.type === "image" || selectedPoem.imageUrl) ? (
                <div style={{ textAlign: "center" }}>
                  <img
                    src={selectedPoem.imageUrl}
                    alt={selectedPoem.title}
                    style={{ maxWidth: "100%", height: "auto", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                </div>
              ) : (
                /* 텍스트 시 */
                <div style={{ padding: "0 8px" }}>
                  {(selectedPoem.content || "").split("\n").map((line: string, idx: number) => (
                    <p key={idx} style={{
                      fontFamily: "'Noto Serif KR', serif",
                      color: "#4a3f35",
                      lineHeight: 2,
                      fontSize: "1rem",
                      textAlign: "center",
                      minHeight: "1.5rem",
                      margin: 0,
                    }}>
                      {line || "\u00A0"}
                    </p>
                  ))}
                </div>
              )}

              {/* 작가 & 날짜 */}
              <div style={{ marginTop: 32, textAlign: "right" }}>
                <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: "bold", color: "#5a4a3a", fontSize: "1rem" }}>
                  — {selectedPoem.author || "거제의 시인"}
                </p>
                {selectedPoem.date && (
                  <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: 6 }}>{selectedPoem.date}</p>
                )}
              </div>
            </div>

            {/* 하단 이전/다음 버튼 바 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 24px",
              borderTop: "1px solid #f5e8d8",
              background: "#fdf6ee",
            }}>
              <button onClick={goPrev} style={bottomNavBtn}>
                ← 이전 시
              </button>
              <span style={{ fontSize: 12, color: "#ccc" }}>
                ← → 방향키로도 이동
              </span>
              <button onClick={goNext} style={bottomNavBtn}>
                다음 시 →
              </button>
            </div>
          </div>

          {/* 다음 버튼 */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={navBtnStyle}
            title="다음 시"
          >
            ›
          </button>
        </div>
      )}
    </main>
  );
}

const containerStyle: any = { maxWidth: 1000, margin: "0 auto", padding: "80px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle: any = { textAlign: "center", marginBottom: 60 };
const backLinkStyle: any = { color: "#888", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 };
const titleStyle: any = { fontSize: 32, fontWeight: "bold", color: "#3d3228", marginBottom: 12 };
const subtitleStyle: any = { color: "#888", fontSize: 16 };
const gridStyle: any = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 24,
  alignItems: "start",
};
const cardStyle: any = {
  borderRadius: 20,
  padding: "28px 24px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
  height: "380px",       /* ← 모든 카드 고정 높이 */
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Noto Serif KR', serif",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  overflow: "hidden",
};
const navBtnStyle: any = {
  background: "rgba(255,255,255,0.15)",
  border: "none",
  color: "white",
  fontSize: 48,
  width: 56, height: 56,
  borderRadius: "50%",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
  margin: "0 8px",
  transition: "background 0.2s",
  lineHeight: 1,
};
const bottomNavBtn: any = {
  background: "none",
  border: "1px solid #e8d5b7",
  borderRadius: 30,
  padding: "8px 20px",
  cursor: "pointer",
  fontSize: 13,
  color: "#8a6a4a",
  fontFamily: "'Pretendard', sans-serif",
  transition: "background 0.2s, color 0.2s",
};
