import Link from "next/link";

export default function WelfarePage() {
  const welfareItems = [
    { 
      target: "영유아/아동", 
      title: "거제시 출산장려금 지원", 
      desc: "첫째아부터 출산장려금을 지원하며, 산후조리비 지원 등 아이 키우기 좋은 환경을 제공합니다." 
    },
    { 
      target: "어르신/노인", 
      title: "기초연금 및 경로당 지원", 
      desc: "어르신들의 안정적인 노후 생활을 위해 기초연금을 지급하고, 지역 내 경로당 운영 및 급식을 지원합니다." 
    },
    { 
      target: "장애인", 
      title: "장애인 활동지원 서비스", 
      desc: "일상생활이 어려운 장애인분들에게 활동지원사를 파견하여 자립 생활을 돕고 가족의 부담을 줄여드립니다." 
    },
    { 
      target: "일반시민", 
      title: "거제사랑상품권 발행", 
      desc: "지역 경제 활성화를 위해 상시 할인된 가격으로 상품권을 판매하여 가계 경제에 도움을 드립니다." 
    },
    { 
      target: "교육/취약계층", 
      title: "통합문화이용권(문화누리카드)", 
      desc: "문화생활 향유를 위해 도서, 공연, 여행 등에 사용할 수 있는 카드 결제 대금을 지원합니다." 
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fdf9", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            📋 거제시 맞춤형 복지 서비스
          </h1>
          <p style={{ color: "#666" }}>거제시민의 행복한 삶을 위해 제공되는 연령별, 대상별 복지 혜택입니다.</p>
        </div>

        {/* 안내 배너 */}
        <div style={{ 
          background: "#e8f5e9", 
          padding: "24px", 
          borderRadius: "24px", 
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "2rem",
          border: "1px solid #c8e6c9"
        }}>
          <span style={{ fontSize: "2rem" }}>🤝</span>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#2e7d32", margin: 0 }}>복지 사각지대 발굴</h2>
            <p style={{ fontSize: "0.9rem", color: "#444", margin: "4px 0 0 0" }}>주변에 어려움을 겪고 있는 이웃이 있다면 주민센터로 알려주세요.</p>
          </div>
        </div>

        {/* 복지 아이템 리스트 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "3rem" }}>
          {welfareItems.map((item, index) => (
            <div key={index} style={{ 
              background: "#fff", 
              borderRadius: "20px", 
              padding: "24px", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              border: "1px solid #eef2f6",
              transition: "transform 0.2s ease"
            }}>
              <span style={{ 
                display: "inline-block", 
                padding: "4px 10px", 
                borderRadius: "6px", 
                background: "#e8f5e9", 
                color: "#2e7d32", 
                fontSize: "0.75rem", 
                fontWeight: "800",
                marginBottom: "12px"
              }}>
                {item.target}
              </span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "8px", color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 하단 도움말 센터 */}
        <div style={{ 
          background: "#fff", 
          borderRadius: "24px", 
          padding: "30px", 
          textAlign: "center",
          border: "1px solid #e2e8f0",
          marginBottom: "4rem"
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "16px" }}>어떤 복지 혜택을 받을 수 있는지 궁금하신가요?</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <a href="https://www.bokjiro.go.kr" target="_blank" rel="noopener noreferrer" style={{
              background: "#2e7d32",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.9rem"
            }}>
              🎨 복지로 사이트 바로가기
            </a>
            <a href="https://www.geoje.go.kr" target="_blank" rel="noopener noreferrer" style={{
              background: "#f1f5f9",
              color: "#334155",
              padding: "12px 24px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "0.9rem"
            }}>
              🏛️ 거제시청 홈페이지
            </a>
          </div>
          <p style={{ marginTop: "20px", fontSize: "0.85rem", color: "#94a3b8" }}>
            궁금한 점은 보건복지 상담센터 (국번없이 129) 또는 거제시청 사회복지과로 문의하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
