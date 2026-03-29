"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const themes = [
  { bgColor: "#f0f4f8", textColor: "#2d3748", accentColor: "#718096", mood: "잔잔한" },
  { bgColor: "#fff5f5", textColor: "#742a2a", accentColor: "#fc8181", mood: "그리운" },
  { bgColor: "#f0fff4", textColor: "#22543d", accentColor: "#48bb78", mood: "따뜻한" },
  { bgColor: "#ebf8ff", textColor: "#2a4365", accentColor: "#63b3ed", mood: "고요한" },
  { bgColor: "#faf5ff", textColor: "#44337a", accentColor: "#9f7aea", mood: "몽환적인" },
  { bgColor: "#fffff0", textColor: "#744210", accentColor: "#ecc94b", mood: "희망찬" },
  { bgColor: "#fff8f1", textColor: "#7b341e", accentColor: "#ed8936", mood: "힘찬" },
  { bgColor: "#f7fafc", textColor: "#1a202c", accentColor: "#a0aec0", mood: "쓸쓸한" },
];

export default function UploadPage() {
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview & Edit, 3: Success
  const [uploadMode, setUploadMode] = useState("ai"); // "ai" or "direct"
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [themeIndex, setThemeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // 1단계: 텍스트 추출 요청
  const handleExtract = async () => {
    if (!image || !password) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("password", password);

    try {
      const res = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setTitle(data.title);
        setContent(data.content);
        setThemeIndex(Math.floor(Math.random() * themes.length));
        setStep(2);
      } else {
        setError(data.error || "오류가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  // 디자인 랜덤 변경 (색상)
  const shuffleTheme = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * themes.length);
    } while (nextIndex === themeIndex);
    setThemeIndex(nextIndex);
  };

  // 2단계: 최종 저장 요청
  const handleSave = async () => {
    setLoading(true);
    setError("");

    const theme = themes[themeIndex];
    const poemData = {
      title,
      author,
      content,
      password,
      ...theme
    };

    try {
      const res = await fetch("/api/save-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poemData),
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setError(data.error || "저장 중 오류가 발생했습니다.");
      }
    } catch (e) {
      setError("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  // 직접 업로드 (AI 없이 사진만 저장)
  const handleSaveDirect = async () => {
    if (!image || !password) {
      setError("사진과 비밀번호를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("password", password);
    formData.append("author", author);
    formData.append("title", title);

    try {
      const res = await fetch("/api/save-poem-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3);
      } else {
        setError(data.error || "오류가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  const currentTheme = themes[themeIndex];

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>🌸 오늘의 시 업로드</h1>
        <p style={{ color: "#888" }}>시집을 찍고, 원하는 디자인을 골라보세요.</p>
      </header>

      {/* 1단계: 사진 업로드 및 정보 입력 */}
      {step === 1 && (
        <section style={formCardStyle}>
          {/* 모드 선택 탭 */}
          <div style={modeTabContainerStyle}>
            <button 
              onClick={() => setUploadMode("ai")} 
              style={uploadMode === "ai" ? activeTabStyle : inactiveTabStyle}
            >
              🤖 AI 텍스트 변환
            </button>
            <button 
              onClick={() => setUploadMode("direct")} 
              style={uploadMode === "direct" ? activeTabStyle : inactiveTabStyle}
            >
              📸 원본 사진 올리기
            </button>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>시집 사진 찍기</label>
            <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={fileInputStyle} />
          </div>

          {preview && (
            <div style={imageWrapperStyle}>
              <img src={preview} alt="미리보기" style={imageStyle} />
            </div>
          )}

          {uploadMode === "direct" && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>시 제목 (선택)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 봄날의 편지" style={inputStyle} />
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>시인 이름</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="예: 박노해" style={inputStyle} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>관리자 비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" style={inputStyle} />
          </div>

          {uploadMode === "ai" ? (
            <button onClick={handleExtract} disabled={loading || !image || !password} style={activeButtonStyle}>
              {loading ? "AI 분석 중..." : "AI 분석 및 디자인 생성 시작"}
            </button>
          ) : (
            <button onClick={handleSaveDirect} disabled={loading || !image || !password} style={saveButtonStyle}>
              {loading ? "업로드 중..." : "✅ 사진 올려서 바로 등록하기!"}
            </button>
          )}
        </section>
      )}

      {/* 2단계: 디자인 확인 및 수정 */}
      {step === 2 && (
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <div style={{
            width: "100%", maxWidth: 460, minHeight: 400, borderRadius: 24, padding: "60px 40px",
            background: currentTheme.bgColor,
            color: currentTheme.textColor,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)", textAlign: "center",
            fontFamily: "'Noto Serif KR', serif", transition: "0.5s",
            overflow: "hidden", position: "relative",
            display: "flex", flexDirection: "column", justifyContent: "center"
          }}>
            <span style={{ 
              fontSize: 13, 
              color: currentTheme.accentColor, 
              letterSpacing: 3, marginBottom: 15, display: "block",
              opacity: 0.8
            }}>
              {currentTheme.mood}
            </span>
            <input 
              value={title} onChange={(e) => setTitle(e.target.value)} 
              style={{ 
                ...titleInputStyle, 
                color: currentTheme.textColor,
                borderBottom: "1px solid rgba(0,0,0,0.1)"
              }} 
            />
            <textarea 
              value={content} onChange={(e) => setContent(e.target.value)} 
              style={{ 
                ...contentInputStyle, 
                color: currentTheme.textColor,
              }} 
            />
            {author && <p style={{ fontSize: 13, marginTop: 24, opacity: 0.8 }}>— {author}</p>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, width: "100%", maxWidth: 460 }}>
            <button onClick={shuffleTheme} style={shuffleButtonStyle}>🎨 테마 색상 바꾸기</button>
            <button onClick={handleSave} disabled={loading} style={saveButtonStyle}>
              {loading ? "저장 중..." : "✅ 이 디자인으로 결정!"}
            </button>
          </div>
          
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>
            ← 사진 다시 찍기
          </button>
        </section>
      )}

      {/* 3단계: 성공 안내 */}
      {step === 3 && (
        <section style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>✨</div>
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>업로드가 완료되었습니다!</h2>
          <p style={{ color: "#666", marginBottom: 40 }}>이제 실제 사이트에 반영하기 위해 GitHub에 푸시해 주세요.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link href="/" style={finishButtonStyle}>홈으로 가기</Link>
            <button onClick={() => { setStep(1); setImage(null); setPreview(null); }} style={finishButtonStyle}>새 시 올리기</button>
          </div>
        </section>
      )}

      {error && <p style={{ color: "#ff4d4d", textAlign: "center", marginTop: 20 }}>⚠️ {error}</p>}
    </main>
  );
}

// 스타일 정의
const containerStyle = { maxWidth: 800, margin: "0 auto", padding: "80px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle = { textAlign: "center", marginBottom: 60 };
const formCardStyle = { background: "#fff", padding: 32, borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 24 };
const inputGroupStyle = { display: "flex", flexDirection: "column", gap: 8 };
const labelStyle = { fontSize: 14, fontWeight: "bold", color: "#333" };
const inputStyle = { padding: "14px 18px", borderRadius: 12, border: "1px solid #eee", fontSize: 16 };
const fileInputStyle = { padding: 10, border: "2px dashed #eee", borderRadius: 12, cursor: "pointer" };
const imageWrapperStyle = { width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid #eee" };
const imageStyle = { width: "100%", display: "block" };
const activeButtonStyle = { background: "#3d3228", color: "#fff", padding: "18px", borderRadius: 14, border: "none", fontSize: 16, fontWeight: "bold", cursor: "pointer" };
const shuffleButtonStyle = { flex: 1, background: "#fff", border: "1px solid #ddd", padding: "16px", borderRadius: 14, cursor: "pointer", fontWeight: "bold" };
const saveButtonStyle = { flex: 1, background: "#22c55e", color: "#fff", border: "none", padding: "16px", borderRadius: 14, cursor: "pointer", fontWeight: "bold" };
const finishButtonStyle = { background: "#f5f5f5", color: "#333", textDecoration: "none", padding: "14px 24px", borderRadius: 12, fontSize: 15 };

const titleInputStyle = { width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(0,0,0,0.1)", textAlign: "center", fontSize: 24, marginBottom: 20, padding: 10, fontWeight: "bold" };
const contentInputStyle = { width: "100%", background: "none", border: "none", textAlign: "center", fontSize: 18, lineHeight: 1.8, height: 300, resize: "none" };
const modeTabContainerStyle = { display: "flex", gap: "10px", marginBottom: "15px", background: "#f5f5f5", padding: "8px", borderRadius: "16px" };
const activeTabStyle = { flex: 1, padding: "12px", background: "#fff", color: "#3d3228", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.2s" };
const inactiveTabStyle = { flex: 1, padding: "12px", background: "transparent", color: "#888", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "15px", cursor: "pointer", transition: "all 0.2s" };
