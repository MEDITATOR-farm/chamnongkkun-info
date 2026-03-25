"use client";
import { useState } from "react";
import Link from "next/link";

export default function UploadEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "행사",
    startDate: "",
    endDate: "",
    location: "",
    target: "누구나",
    summary: "",
    link: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await fetch("/api/upload-event", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();

      if (res.ok) {
        setResult(resData.event);
        setFormData({ ...formData, name: "", summary: "", link: "", password: "" }); // 일부 초기화
      } else {
        setError(resData.error || "오류가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 600, margin: "60px auto", padding: "0 20px",
      fontFamily: "'Pretendard', sans-serif"
    }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, color: "#2563eb", marginBottom: 10 }}>📅 주요 행사 등록</h1>
        <p style={{ color: "#64748b" }}>거제시청의 새로운 소식을 사이트에 바로 업데이트하세요.</p>
      </header>

      <form onSubmit={handleUpload} style={{
        background: "white", padding: 30, borderRadius: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        display: "flex", flexDirection: "column", gap: 20
      }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>행사 이름 *</label>
          <input name="name" value={formData.name} onChange={handleChange} required 
                 placeholder="예: 제5회 거제 바다 축제" style={inputStyle} />
        </div>

        <div style={{ display: "flex", gap: 15 }}>
          <div style={{ ...inputGroupStyle, flex: 1 }}>
            <label style={labelStyle}>시작 날짜 *</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, flex: 1 }}>
            <label style={labelStyle}>종료 날짜</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>장소</label>
          <input name="location" value={formData.location} onChange={handleChange} 
                 placeholder="예: 지세포항 일원" style={inputStyle} />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>대상</label>
          <input name="target" value={formData.target} onChange={handleChange} 
                 placeholder="예: 거제시민, 관광객 누구나" style={inputStyle} />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>한 줄 요약 *</label>
          <textarea name="summary" value={formData.summary} onChange={handleChange} required 
                    placeholder="행사에 대한 짧은 설명을 적어주세요." style={{ ...inputStyle, height: 80, resize: "none" }} />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>상세 링크 (URL)</label>
          <input name="link" value={formData.link} onChange={handleChange} 
                 placeholder="거제시청 공고문 링크 등" style={inputStyle} />
        </div>

        <div style={{ ...inputGroupStyle, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
          <label style={{ ...labelStyle, color: "#ef4444" }}>관리자 비밀번호 *</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required 
                 style={{ ...inputStyle, borderColor: "#fca5a5" }} />
        </div>

        <button type="submit" disabled={loading} style={{
          background: loading ? "#94a3b8" : "#2563eb",
          color: "white", padding: "16px", borderRadius: 12,
          border: "none", fontSize: 16, fontWeight: "bold",
          cursor: "pointer", transition: "0.2s"
        }}>
          {loading ? "등록 중..." : "새 행사 등록하기"}
        </button>

        {error && <p style={{ color: "#ef4444", textAlign: "center", fontSize: 14 }}>⚠️ {error}</p>}
        {result && (
          <div style={{
            background: "#f0fdf4", padding: 20, borderRadius: 12,
            border: "1px solid #bbf7d0", color: "#166534"
          }}>
            ✅ <strong>{result.name}</strong> 등록 완료!<br/>
            메인 사이트에서 확인해 보세요.
          </div>
        )}
      </form>

      <footer style={{ marginTop: 30, textAlign: "center" }}>
        <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: 14 }}>🏠 홈으로 돌아가기</Link>
      </footer>
    </div>
  );
}

const inputGroupStyle = { display: "flex", flexDirection: "column", gap: 8 };
const labelStyle = { fontSize: 14, fontWeight: "bold", color: "#475569" };
const inputStyle = {
  padding: "12px 16px", borderRadius: 10, border: "1px solid #e2e8f0",
  fontSize: 15, outline: "none", transition: "0.2s"
};
