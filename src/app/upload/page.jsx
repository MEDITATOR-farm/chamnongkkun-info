"use client";
import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [password, setPassword] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!image || !password) return;
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("password", password);
    formData.append("author", author);

    try {
      const res = await fetch("/api/upload-poem", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.poem);
      } else {
        setError(data.error || "오류가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류가 발생했습니다");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f5f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, serif",
      padding: 24,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        padding: 36,
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: 6, fontSize: 24 }}>
          📖 시 업로드
        </h2>
        <p style={{ textAlign: "center", color: "#999",
          marginBottom: 28, fontSize: 14 }}>
          시집 사진을 찍어 올리면 자동으로 디자인돼요
        </p>

        {/* 사진 선택 영역 */}
        <label style={{
          display: "block",
          border: "2px dashed #d0c8be",
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 14,
          background: "#faf8f5",
        }}>
          {preview ? (
            <img src={preview} alt="미리보기" style={{
              width: "100%", borderRadius: 8,
              maxHeight: 260, objectFit: "contain"
            }} />
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📸</div>
              <div style={{ color: "#aaa", fontSize: 14 }}>
                사진을 선택하거나 직접 찍어주세요
              </div>
            </>
          )}
          <input type="file" accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: "none" }} />
        </label>

        {/* 시인 이름 */}
        <input
          type="text"
          placeholder="✍️ 시인 이름 (예: 윤동주)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px",
            borderRadius: 10, border: "1.5px solid #e0dbd4",
            fontSize: 15, marginBottom: 10,
            boxSizing: "border-box", outline: "none",
            fontFamily: "Georgia, serif",
          }}
        />

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="🔑 업로드 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%", padding: "12px 16px",
            borderRadius: 10, border: "1.5px solid #e0dbd4",
            fontSize: 15, marginBottom: 14,
            boxSizing: "border-box", outline: "none",
          }}
        />

        {/* 업로드 버튼 */}
        <button
          onClick={handleUpload}
          disabled={!image || !password || loading}
          style={{
            width: "100%", padding: 14,
            background: (!image || !password || loading)
              ? "#ccc" : "#5c4a32",
            color: "#fff", border: "none",
            borderRadius: 10, fontSize: 16,
            cursor: (!image || !password || loading)
              ? "not-allowed" : "pointer",
            fontFamily: "Georgia, serif",
          }}
        >
          {loading ? "⏳ 시를 읽는 중..." : "✨ 업로드 & 디자인 생성"}
        </button>

        {/* 오류 메시지 */}
        {error && (
          <p style={{ color: "#e53e3e", textAlign: "center",
            marginTop: 14, fontSize: 14 }}>
            ⚠️ {error}
          </p>
        )}

        {/* 결과 미리보기 */}
        {result && (
          <div style={{
            marginTop: 28,
            background: result.bgColor,
            color: result.textColor,
            borderRadius: 16,
            padding: "32px 28px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 11, letterSpacing: 3,
              color: result.accentColor,
              marginBottom: 10,
              textTransform: "uppercase",
            }}>
              {result.mood}
            </div>
            <h3 style={{ fontSize: 20, marginBottom: 4,
              fontWeight: "normal" }}>
              {result.title}
            </h3>
            {result.author && (
              <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 20 }}>
                — {result.author}
              </p>
            )}
            <p style={{
              whiteSpace: "pre-line",
              lineHeight: 2.2, fontSize: 15,
            }}>
              {result.content}
            </p>
            <p style={{ marginTop: 20, fontSize: 12, opacity: 0.45 }}>
              {result.date}
            </p>
            <a href="/" style={{
              display: "inline-block", marginTop: 16,
              padding: "8px 24px",
              background: result.accentColor,
              color: "#fff", borderRadius: 8,
              textDecoration: "none", fontSize: 14,
            }}>
              메인에서 확인하기 →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
