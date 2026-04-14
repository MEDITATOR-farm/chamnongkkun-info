import Link from "next/link";

export default function ReturnFarmSupportPage() {
  const benefitList = [
    { 
      title: "귀농인 정착장려금", 
      amount: "가구당 최대 500만원", 
      desc: "거제시로 전입하여 실제 영농에 종사하는 귀농인에게 정착에 필요한 초기 비용을 지원합니다." 
    },
    { 
      title: "귀농귀촌인 주택수리비", 
      amount: "가구당 500만원 내외", 
      desc: "오래된 빈집을 수리하거나 리모델링하여 거주하려는 분들에게 수리 비용을 지원해 드립니다." 
    },
    { 
      title: "창업 및 주택구입 융자", 
      amount: "최대 3억원 (연 1.5% 저리)", 
      desc: "농지 구입, 축사 신축 등 창업 자금과 주택 구입을 위한 정책 자금을 장기 저리로 융자해 드립니다." 
    },
    { 
      title: "귀농귀촌 교육 및 인턴십", 
      amount: "교육비 전액 및 수당 지원", 
      desc: "성공적인 정착을 위한 현장 실습과 농업 기초 교육 이수를 돕고 실습 수당을 지급합니다." 
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fef8f8", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#c5221f", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🏡 거제 귀농귀촌 지원 가이드
          </h1>
          <p style={{ color: "#666" }}>새로운 인생 2막, 거제에서 시작하는 귀농귀촌인을 위한 든든한 혜택 모음입니다.</p>
        </div>

        {/* 메인 이미지/배너 */}
        <div style={{ 
          background: "linear-gradient(135deg, #fce8e6, #f8d7d4)", 
          padding: "30px", 
          borderRadius: "24px", 
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#c5221f", marginBottom: "8px" }}>
            "푸른 바다가 보이는 거제로 오세요!"
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
            거제시는 귀농귀촌인의 안정적인 정착을 위해 맞춤형 지원 사업을 추진하고 있습니다.
          </p>
        </div>

        {/* 지원금 리스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "3rem" }}>
          {benefitList.map((item, index) => (
            <div key={index} style={{ 
              background: "#fff", 
              borderRadius: "20px", 
              padding: "24px", 
              border: "1px solid #f8d7d4",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(197,34,31,0.03)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1a1a1a", margin: 0 }}>{item.title}</h3>
                <span style={{ 
                  color: "#c5221f", 
                  fontWeight: "800", 
                  fontSize: "1rem",
                  background: "#fdf0ef",
                  padding: "4px 12px",
                  borderRadius: "20px"
                }}>
                  {item.amount}
                </span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 하단 연락처 정보 */}
        <div style={{ 
          background: "#fff", 
          padding: "30px", 
          borderRadius: "24px", 
          textAlign: "center",
          border: "1px solid #e2e8f0",
          marginBottom: "4rem"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "12px" }}>궁금하신 점이 있으신가요?</h3>
          <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "20px" }}>
            거제시 귀농귀촌 지원센터로 전화주시면 친절하게 상담해 드립니다.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>상담 전화</p>
              <p style={{ margin: 0, fontWeight: "800", fontSize: "1.2rem", color: "#1a73e8" }}>055-639-6401</p>
            </div>
            <div style={{ width: "1px", background: "#e2e8f0" }}></div>
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>위치</p>
              <p style={{ margin: 0, fontWeight: "800", fontSize: "1rem" }}>거제시 농업기술센터</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
