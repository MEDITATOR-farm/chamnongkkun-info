"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UpdateEventsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Input text, 2: Review & Edit, 3: Success
  const [inputText, setInputText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 필드별 상태
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [target, setTarget] = useState("");
  const [summary, setSummary] = useState("");
  const [eventLink, setEventLink] = useState("#");
  const [category, setCategory] = useState("행사");

  // AI 분석 실행
  const handleAiExtract = async () => {
    if (!inputText || !password) {
      setError("텍스트와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai-extract-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setName(data.name || "");
        setStartDate(data.startDate || "");
        setEndDate(data.endDate || "");
        setLocation(data.location || "");
        setTarget(data.target || "");
        setSummary(data.summary || "");
        setEventLink(data.link || "#");
        setCategory(data.category || "행사");
        setStep(2);
      } else {
        setError(data.error || "분석 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 최종 저장
  const handleSave = async () => {
    setLoading(true);
    setError("");

    const eventData = {
      name,
      startDate,
      endDate,
      location,
      target,
      summary,
      link: eventLink,
      category
    };

    try {
      const res = await fetch("/api/save-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventData, password }),
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setError(data.error || "저장 중 오류가 발생했습니다.");
      }
    } catch (err) {
      setError("서버 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <Link href="/" style={backLinkStyle}>← 홈으로</Link>
        <h1 style={titleStyle}>🎊 거제도 행사 업데이트</h1>
        <p style={subtitleStyle}>거제시청 홈페이지의 새로운 소식을 편리하게 등록해 보세요.</p>
      </header>

      <div style={layoutStyle}>
        {/* 가이드 & 입력 폼 */}
        <div style={mainContentStyle}>
          
          {step === 1 && (
            <section style={cardStyle}>
              <div style={guideBoxStyle}>
                <h3 style={{ fontSize: 16, marginBottom: 8, color: "#2d3748" }}>💡 사용 방법</h3>
                <ol style={{ paddingLeft: 20, fontSize: 13, color: "#718096", lineHeight: 1.6 }}>
                  <li>아래 버튼을 눌러 거제시청 공연/행사 페이지로 이동합니다.</li>
                  <li>원하는 소식의 본문 내용을 복사(Ctrl+C) 합니다.</li>
                  <li>아래 입력창에 붙여넣기(Ctrl+V) 한 뒤 분석 시작을 누르세요!</li>
                </ol>
                <a 
                  href="https://www.geoje.go.kr/index.geoje?menuCd=DOM_000000105001001000" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={linkButtonStyle}
                >
                  🌐 거제시청 행사 페이지로 이동하기
                </a>
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>내용 붙여넣기</label>
                <textarea 
                  placeholder="홈페이지에서 복사한 내용을 여기에 붙여넣어 주세요..."
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  style={{ ...inputStyle, minHeight: 250 }} 
                />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>관리자 비밀번호</label>
                <input 
                  type="password" 
                  placeholder="비밀번호 입력"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={inputStyle} 
                />
              </div>

              {error && <p style={errorStyle}>{error}</p>}

              <button onClick={handleAiExtract} disabled={loading} style={aiButtonStyle}>
                {loading ? "분석 중..." : "🪄 AI로 정보 추출하기"}
              </button>
            </section>
          )}

          {step === 2 && (
            <section style={cardStyle}>
              <h3 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "#3d3228" }}>🔍 정보 확인 및 수정</h3>
              
              <div style={inputGroup}>
                <label style={labelStyle}>행사명</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div style={inputGroup}>
                  <label style={labelStyle}>시작일</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroup}>
                  <label style={labelStyle}>종료일</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                <div style={inputGroup}>
                  <label style={labelStyle}>장소</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />
                </div>
                <div style={inputGroup}>
                  <label style={labelStyle}>대상</label>
                  <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>카테고리</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  <option value="행사">행사</option>
                  <option value="혜택">혜택</option>
                  <option value="생활정보">생활정보</option>
                </select>
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>소식 요약</label>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
              </div>

              <div style={inputGroup}>
                <label style={labelStyle}>관련 링크</label>
                <input type="text" value={eventLink} onChange={(e) => setEventLink(e.target.value)} style={inputStyle} />
              </div>

              {error && <p style={errorStyle}>{error}</p>}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={cancelButtonStyle}>← 다시 입력</button>
                <button onClick={handleSave} disabled={loading} style={saveButtonStyle}>
                  {loading ? "저장 중..." : "✅ 이 정보로 업데이트!"}
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section style={{ ...cardStyle, textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>성공적으로 업데이트 되었습니다!</h2>
              <p style={{ color: "#666", marginBottom: 40 }}>이제 웹사이트에 새로운 행사가 표시됩니다.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <Link href="/" style={finishButtonStyle}>홈으로 가기</Link>
                <button onClick={() => { setStep(1); setInputText(""); }} style={finishButtonStyle}>추가 등록하기</button>
              </div>
            </section>
          )}
        </div>

        {/* 실시간 미리보기 (Card) */}
        {step === 2 && (
          <div style={previewSection}>
            <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 15, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
              <span>👁️ 미리보기</span>
              <span style={{ fontSize: 11, fontWeight: "normal", background: "#f0fdf4", color: "#166534", padding: "2px 8px", borderRadius: 20 }}>웹사이트 적용 모습</span>
            </h2>
            <div style={previewCard}>
              <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "10px 10px 0 0", borderBottom: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: 10, fontWeight: "bold", color: "#6366f1", background: "#eef2ff", padding: "2px 8px", borderRadius: 4, marginBottom: 8, display: "inline-block" }}>{category}</span>
                <h3 style={{ fontSize: 18, fontWeight: "900", color: "#1e293b", lineHeight: 1.3 }}>{name || "행사명을 입력하세요"}</h3>
              </div>
              <div style={{ padding: "20px" }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>📍 {location || "장소를 입력하세요"}</p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, marginBottom: 20, minHeight: 44 }}>{summary || "요약 내용을 입력하세요"}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{startDate} ~ {endDate}</span>
                  <button style={{ fontSize: 12, fontWeight: "bold", color: "#fff", background: "#6366f1", border: "none", padding: "6px 16px", borderRadius: 6 }}>자세히 정보</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// 스타일 정의 (이전 업로드 페이지들과 통일성 유지)
const containerStyle = { maxWidth: 1100, margin: "0 auto", padding: "60px 24px", fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif" };
const headerStyle = { textAlign: "center", marginBottom: 50 };
const backLinkStyle = { color: "#888", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20, fontWeight: "bold" };
const titleStyle = { fontSize: 40, fontWeight: "900", color: "#2d241e", marginBottom: 12, letterSpacing: "-1px" };
const subtitleStyle = { color: "#888", fontSize: 17, marginBottom: 40 };

const layoutStyle = { display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) 1fr", gap: 50, alignItems: "start" };
const mainContentStyle = { width: "100%" };

const cardStyle = { 
  background: "#fff", padding: 40, borderRadius: 28, 
  boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
  border: "1px solid #f0eee0",
  animation: "fadeIn 0.5s ease-out"
};

const guideBoxStyle = { background: "#f8fafc", padding: "24px", borderRadius: 18, marginBottom: 30, border: "1px solid #e2e8f0" };
const linkButtonStyle = { display: "block", background: "#fff", border: "1px solid #e2e8f0", color: "#2563eb", textAlign: "center", padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: "bold", marginTop: 15, textDecoration: "none", transition: "0.2s" };

const inputGroup = { marginBottom: 24 };
const labelStyle = { display: "block", fontSize: 14, fontWeight: "bold", marginBottom: 10, color: "#34495e" };
const inputStyle = { width: "100%", padding: "16px 20px", borderRadius: 14, border: "2px solid #f0eee0", fontSize: 16, outline: "none", transition: "0.3s", fontFamily: "inherit", boxSizing: "border-box" };

const aiButtonStyle = { width: "100%", padding: "20px", borderRadius: 16, border: "none", background: "#6366f1", color: "#fff", fontSize: 18, fontWeight: "bold", cursor: "pointer", transition: "0.3s", marginTop: 10, boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)" };
const saveButtonStyle = { flex: 2, padding: "18px", borderRadius: 14, border: "none", background: "#10b981", color: "#fff", fontSize: 18, fontWeight: "bold", cursor: "pointer", transition: "0.3s" };
const cancelButtonStyle = { flex: 1, padding: "18px", borderRadius: 14, border: "1px solid #ddd", background: "#fff", color: "#666", fontSize: 16, fontWeight: "bold", cursor: "pointer" };
const finishButtonStyle = { background: "#f1f5f9", color: "#334155", textDecoration: "none", padding: "14px 24px", borderRadius: 12, fontSize: 15, border: "none", fontWeight: "bold", cursor: "pointer" };

const previewSection = { position: "sticky", top: 40, animation: "slideInRight 0.5s ease-out" };
const previewCard = { 
  background: "#fff", borderRadius: 24, overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0",
  minHeight: 250, fontFamily: "inherit"
};

const errorStyle = { color: "#ef4444", fontSize: 14, marginBottom: 20, background: "#fef2f2", padding: "12px", borderRadius: 8, border: "1px solid #fee2e2", fontWeight: "bold" };
