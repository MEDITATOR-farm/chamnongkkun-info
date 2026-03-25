import fs from "fs";
import path from "path";
import Link from "next/link";

export default function PoemsPage() {
  const filePath = path.join(process.cwd(), "public", "data", "poems.json");
  let poems = [];
  
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      poems = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error("파일 읽기 오류:", e);
  }

  // ID(시간체크용) 기준 최신순으로 한번 더 확실히 정렬
  const sortedPoems = [...poems].sort((a: any, b: any) => b.id - a.id);

  return (
    <main style={containerStyle}>
      <header style={headerStyle}>
        <Link href="/" style={backLinkStyle}>← 홈으로 돌아가기</Link>
        <h1 style={titleStyle}>지난 시 모음</h1>
        <p style={subtitleStyle}>지금까지 우리 동네 소식통에 올라온 소중한 시들입니다.</p>
      </header>

      <div style={gridStyle}>
        {sortedPoems.map((poem: any) => (
          <div key={poem.id} style={{
            ...cardStyle,
            background: poem.bgColor,
            color: poem.textColor,
          }}>
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

      {sortedPoems.length === 0 && (
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
