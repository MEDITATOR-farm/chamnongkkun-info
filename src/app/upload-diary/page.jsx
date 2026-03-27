"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("password", password);
      formData.append("date", date);
      if (image) formData.append("image", image);
      if (video) formData.append("video", video);

      const res = await fetch("/api/save-diary", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("오늘의 일기가 성공적으로 저장되었습니다! 🧑‍🌾");
        router.push("/diaries");
      } else {
        setError(data.error || "문제가 발생했습니다.");
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
        <h1 style={titleStyle}>🧑‍🌾 농부 일기 쓰기</h1>
        <p style={subtitleStyle}>오늘 하루 농장에서는 어떤 일이 있었나요? 사진과 영상도 함께 남겨보세요.</p>
      </header>

      <div style={layoutStyle}>
        {/* 입력 폼 */}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>날짜</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              style={inputStyle} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>제목</label>
            <input 
              type="text" 
              placeholder="예: 오늘 첫 수확을 했습니다!"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={inputStyle} 
              required
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>내용</label>
            <textarea 
              placeholder="오늘의 이야기를 들려주세요..."
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              style={{ ...inputStyle, minHeight: 150, resize: "vertical" }} 
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div style={inputGroup}>
              <label style={labelStyle}>📸 사진 올리기</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ ...inputStyle, padding: "10px" }}
              />
            </div>
            <div style={inputGroup}>
              <label style={labelStyle}>🎥 영상 올리기</label>
              <input 
                type="file" 
                accept="video/*"
                onChange={handleVideoChange}
                style={{ ...inputStyle, padding: "10px" }}
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>관리자 비밀번호</label>
            <input 
              type="password" 
              placeholder="비밀번호 입력"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={inputStyle} 
              required
            />
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? "저장 중..." : "✅ 일기 저장하기"}
          </button>
        </form>

        {/* 실시간 미리보기 */}
        <div style={previewSection}>
          <h2 style={{ fontSize: 18, marginBottom: 20, color: "#888" }}>📝 미리보기</h2>
          <div style={previewCard}>
            <div style={{ fontSize: 13, color: "#8b4513", opacity: 0.6, marginBottom: 10 }}>{date}</div>
            <h3 style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#3d3228" }}>
              {title || "제목을 입력해 주세요"}
            </h3>
            
            {/* 사진 미리보기 */}
            {imagePreview && (
              <div style={mediaPreviewContainer}>
                <img src={imagePreview} alt="Preview" style={mediaPreviewImage} />
              </div>
            )}

            {/* 영상 미리보기 */}
            {videoPreview && (
              <div style={mediaPreviewContainer}>
                <video src={videoPreview} controls style={mediaPreviewImage} />
              </div>
            )}

            <p style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#5d5248" }}>
              {content || "내용을 입력하시면 이곳에 실시간으로 나타납니다."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const mediaPreviewContainer = { marginBottom: 20, borderRadius: 12, overflow: "hidden", border: "1px solid #f0eee0" };
const mediaPreviewImage = { width: "100%", height: "auto", display: "block" };

const containerStyle = { maxWidth: 1100, margin: "0 auto", padding: "60px 24px", fontFamily: "'Pretendard', sans-serif" };
const headerStyle = { textAlign: "center", marginBottom: 50 };
const backLinkStyle = { color: "#888", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 };
const titleStyle = { fontSize: 36, fontWeight: "900", color: "#2d241e", marginBottom: 12 };
const subtitleStyle = { color: "#888", fontSize: 17 };

const layoutStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "start" };

const formStyle = { 
  background: "#fff", padding: 40, borderRadius: 24, 
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
  border: "1px solid #f0eee0"
};

const inputGroup = { marginBottom: 24 };
const labelStyle = { display: "block", fontSize: 14, fontWeight: "bold", marginBottom: 8, color: "#555" };
const inputStyle = { 
  width: "100%", padding: "14px 18px", borderRadius: 12, border: "2px solid #f0eee0",
  fontSize: 16, outline: "none", transition: "0.3s", fontFamily: "inherit"
};

const submitButtonStyle = {
  width: "100%", padding: "18px", borderRadius: 12, border: "none",
  background: "#4a7c59", color: "#fff", fontSize: 18, fontWeight: "bold",
  cursor: "pointer", transition: "0.3s", marginTop: 20
};

const previewSection = { position: "sticky", top: 40 };
const previewCard = { 
  background: "#fdfcf0", padding: "50px 40px", borderRadius: 8,
  boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #f0eee0",
  minHeight: 500, fontFamily: "'Noto Serif KR', serif",
  backgroundImage: "radial-gradient(#e0ddd0 1px, transparent 1px)",
  backgroundSize: "20px 20px"
};

const errorStyle = { color: "#e53e3e", fontSize: 14, marginTop: -10, marginBottom: 20 };
