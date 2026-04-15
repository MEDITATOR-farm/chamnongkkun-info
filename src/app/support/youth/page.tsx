import Link from "next/link";

export default function YouthSupportPage() {
  const supports = [
    { 
      title: "청년 월세 한시 특별지원", 
      category: "주거", 
      amount: "월 최대 20만원", 
      target: "만 19~34세 무주택 청년",
      desc: "경제적 어려움을 겪는 청년들의 주거비 부담 경감을 위한 월세 지원 사업입니다."
    },
    { 
      title: "경남 청년구직활동수당", 
      category: "일자리", 
      amount: "총 200만원 (월 50만x4회)", 
      target: "만 18~34세 미취업 청년",
      desc: "적극적인 구직활동을 하는 청년들에게 교육비, 도서구입비 등을 지원합니다."
    },
    { 
      title: "청년 내일저축계좌", 
      category: "자산형성", 
      amount: "본인 저축액의 1~3배 매칭", 
      target: "만 19~34세 일하는 청년",
      desc: "청년이 일정 금액을 저축하면 정부가 지원금을 추가로 적립해 목돈 마련을 돕습니다."
    },
    { 
      title: "거제시 청년 창업 지원", 
      category: "창업", 
      amount: "최대 1,500만원", 
      target: "거제시 내 예비 창업 청년",
      desc: "참신한 아이디어를 가진 청년들의 성공적인 창업을 위해 사업화 자금을 지원합니다."
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff9f2", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#e37400", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            💰 거제 청년 지원금 총정리
          </h1>
          <p style={{ color: "#666" }}>거제 청년이라면 꼭 챙겨야 할 정부 및 지자체 혜택을 모았습니다.</p>
        </div>

        {/* 안내 카드 */}
        <div style={{ 
          background: "linear-gradient(135deg, #ff9800, #f57c00)", 
          padding: "24px", 
          borderRadius: "24px", 
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 10px 20px rgba(245,124,0,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>📢 필독 사항</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            일부 지원 사업은 조기에 마감될 수 있으므로, 각 사업의 상세 공고를 반드시 확인하시기 바랍니다. 
            궁금한 점은 거제시 청년센터 '거제청년다온'으로 문의하세요!
          </p>
        </div>

        {/* 지원금 리스트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {supports.map((item, index) => (
            <div key={index} style={{ 
              background: "#fff", 
              borderRadius: "20px", 
              padding: "24px", 
              border: "1px solid #fee6c1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{ 
                  background: "#fff3e0", 
                  color: "#e37400", 
                  padding: "4px 12px", 
                  borderRadius: "8px", 
                  fontSize: "0.75rem", 
                  fontWeight: "800"
                }}>
                  {item.category}
                </span>
                <span style={{ color: "#e37400", fontWeight: "800", fontSize: "1.1rem" }}>{item.amount}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: "0 0 8px 0", color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#d32f2f", fontWeight: "700", marginBottom: "8px" }}>대상: {item.target}</p>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
              <button style={{ 
                marginTop: "16px",
                background: "#f1f1f1",
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.85rem",
                color: "#666",
                cursor: "pointer"
              }}>
                상세공고 보기
              </button>
            </div>
          ))}
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            본 서비스는 공공 데이터를 기반으로 제작되었습니다.<br/>
            정확한 정보는 '정부24' 또는 '마이홈' 홈페이지를 참고하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
