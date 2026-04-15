import Link from "next/link";

export default function FarmSupportPage() {
  const supports = [
    {
      title: "기본형 공익직불금",
      category: "기본직불",
      amount: "논·밭 면적별 차등 지급",
      target: "0.1ha 이상 농지를 경작하는 농업인",
      desc: "농업·농촌의 공익기능 증진을 위해 농업인에게 지급하는 기본 직불금입니다. 소농직불(연 120만원 정액)과 면적직불(단가 차등)로 구분됩니다.",
      detail: "신청기간: 매년 2~4월 / 신청처: 읍면동 주민센터"
    },
    {
      title: "소농직불금",
      category: "기본직불",
      amount: "연 120만원 (정액)",
      target: "농업경영체 등록 소농 (0.5ha 미만)",
      desc: "소규모 농가의 소득 안정을 위해 면적과 관계없이 연 120만원을 정액 지급합니다. 영농 규모가 작은 농가에 특히 유리합니다.",
      detail: "신청기간: 매년 2~4월 / 신청처: 읍면동 주민센터"
    },
    {
      title: "친환경농업직불금",
      category: "선택직불",
      amount: "유기인증 최대 61만원/10a",
      target: "친환경 인증(유기·무농약)을 받은 농업인",
      desc: "농약·화학비료 사용을 줄이고 친환경 농업을 실천하는 농업인에게 추가 지원금을 지급합니다. 유기농·무농약 인증에 따라 단가가 다릅니다.",
      detail: "신청기간: 매년 3~4월 / 신청처: 국립농산물품질관리원 거제사무소"
    },
    {
      title: "경관보전직불금",
      category: "선택직불",
      amount: "최대 170만원/ha",
      target: "경관작물(유채·해바라기 등)을 재배하는 농업인",
      desc: "농촌 경관 보전을 위해 경관작물을 재배하는 농업인에게 지원금을 지급합니다. 마을 단위로 신청하며 경남도 지정 경관보전지구 해당 시 우선 지원됩니다.",
      detail: "신청기간: 매년 3~5월 / 신청처: 거제시 농업기술센터"
    },
    {
      title: "밭농업직불금",
      category: "선택직불",
      amount: "최대 55만원/10a",
      target: "밭작물(콩·팥·감자 등)을 재배하는 농업인",
      desc: "논 중심의 직불제를 보완하여 밭농업 농가의 소득을 지원합니다. 식량작물·채소·특용작물 등 지정된 작물을 재배해야 합니다.",
      detail: "신청기간: 매년 4~5월 / 신청처: 읍면동 주민센터"
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f1f8f1", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🌾 농업 직불금 총정리
          </h1>
          <p style={{ color: "#666" }}>거제 농업인이라면 꼭 챙겨야 할 직불금 제도를 안내합니다.</p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #2e7d32, #1b5e20)",
          padding: "24px",
          borderRadius: "24px",
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 10px 20px rgba(46,125,50,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>📢 신청 전 필독</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            직불금은 반드시 농업경영체 등록이 되어 있어야 신청 가능합니다.
            신청 기간을 놓치면 해당 연도 지급이 불가하므로 반드시 기간 내 신청하세요.
            문의: 거제시 농업기술센터 055-639-3114
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {supports.map((item, index) => (
            <div key={index} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #c8e6c9",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "800"
                }}>{item.category}</span>
                <span style={{ color: "#2e7d32", fontWeight: "800", fontSize: "1rem" }}>{item.amount}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: "0 0 8px 0", color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#d32f2f", fontWeight: "700", marginBottom: "8px" }}>대상: {item.target}</p>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 8px 0", lineHeight: "1.6" }}>{item.desc}</p>
              <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>📅 {item.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            직불금 신청은 농업경영체 등록 후 가능합니다.<br />
            자세한 내용은 농림축산식품부(1330) 또는 거제시 농업기술센터로 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
