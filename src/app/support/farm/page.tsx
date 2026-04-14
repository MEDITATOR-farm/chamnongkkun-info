import Link from "next/link";

export default function FarmSupportPage() {
  const checkList = [
    { title: "농업경영체 등록", desc: "국립농산물품질관리원에 농업경영체 정보가 올바르게 등록되어 있어야 합니다." },
    { title: "마을교육 이수", desc: "온라인 또는 대면 교육을 반드시 이수해야 직불금이 감액되지 않습니다." },
    { title: "영농기록 작성", desc: "비료 및 농약 사용 기록 등 영농 활동 기록을 꼼꼼히 기록하고 보관하세요." },
    { title: "농지 형상 유지", desc: "농작물을 재배할 수 있는 농지의 형태가 제대로 유지되어야 합니다." }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f8f3", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1e8e3e", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🌾 2026 농업직불금 신청 방법
          </h1>
          <p style={{ color: "#666" }}>거제시 농업인을 위한 공익직불금 신청 가이드와 주의사항입니다.</p>
        </div>

        {/* 중요 공지 카드 */}
        <div style={{ 
          background: "#fff", 
          padding: "24px", 
          borderRadius: "24px", 
          border: "2px solid #1e8e3e",
          marginBottom: "2rem",
          boxShadow: "0 8px 16px rgba(30,142,62,0.1)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1e8e3e", marginBottom: "12px" }}>📅 신청 기간 안내</h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <div style={{ flex: 1, background: "#f8fdf9", padding: "12px", borderRadius: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "#1e8e3e", fontWeight: "bold" }}>온라인 신청</span>
              <p style={{ margin: "5px 0 0 0", fontWeight: "800" }}>2월~3월 중</p>
            </div>
            <div style={{ flex: 1, background: "#f8fdf9", padding: "12px", borderRadius: "12px" }}>
              <span style={{ fontSize: "0.8rem", color: "#1e8e3e", fontWeight: "bold" }}>방문 신청</span>
              <p style={{ margin: "5px 0 0 0", fontWeight: "800" }}>3월~4월 중</p>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>* 신청 장소: 농지 소재지 읍·면·동 주민센터</p>
        </div>

        {/* 체크리스트 */}
        <h2 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "1.5rem" }}>✅ 신청 전 체크리스트</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "2rem" }}>
          {checkList.map((item, index) => (
            <div key={index} style={{ 
              background: "#fff", 
              padding: "20px", 
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "800", margin: "0 0 8px 0", color: "#2e7d32" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#555", margin: 0, lineHeight: "1.5" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 버튼 및 안내 */}
        <div style={{ 
          background: "#fff", 
          borderRadius: "20px", 
          padding: "24px", 
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
          marginBottom: "4rem"
        }}>
          <p style={{ fontWeight: "700", marginBottom: "16px" }}>인터넷으로 간편하게 신청하세요!</p>
          <a href="https://uni.agrix.go.kr" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block",
            background: "#1e8e3e",
            color: "#fff",
            padding: "16px 32px",
            borderRadius: "16px",
            textDecoration: "none",
            fontWeight: "800",
            boxShadow: "0 4px 12px rgba(30,142,62,0.3)"
          }}>
            비대면 신청 바로가기
          </a>
          <p style={{ marginTop: "16px", fontSize: "0.8rem", color: "#94a3b8" }}>
            문의: 거제시 농업기술센터 또는 상기 사이트 고객센터
          </p>
        </div>
      </div>
    </div>
  );
}
