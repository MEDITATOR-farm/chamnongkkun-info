"use clent";
import Link from "next/link";

export default function InsuranceTipsPage() {
  const tips = [
    { 
      title: "임의계속가입 제도 활용", 
      desc: "퇴직 후 지역가입자로 전환되었을 때, 이전 직장에서 내던 보험료 수준으로 3년간 납부할 수 있는 제도입니다. 소득이나 재산이 많아 지역 보험료가 더 높게 나올 때 필수입니다." 
    },
    { 
      title: "자동차 보험료 점수 줄이기", 
      desc: "지역가입자의 경우 자동차 배기량과 연식에 따라 보험료가 산정됩니다. 최근 개정으로 4천만원 미만 차량은 부과 대상에서 제외되었으니 내 차량이 해당되는지 확인하세요." 
    },
    { 
      title: "피부양자 자격 유지하기", 
      desc: "소득이나 재산 요건이 자녀 등 가족의 피부양자로 등록될 수 있는 수준인지 체크하세요. 기준을 살짝 초과하는 경우 소득 발생 시기를 조절하여 피부양자 자격을 유지할 수 있습니다." 
    },
    { 
      title: "재산 기본 공제 활용", 
      desc: "지역가입자의 재산 보험료 산정 시, 일정 금액의 기본 공제가 적용됩니다. 최근 공제 금액이 상향 조정되어 실제 납부 금액이 줄어들었으니 고지서를 꼼꼼히 확인해 보세요." 
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8ff", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#7b1fa2", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🏥 건강보험료 합법적 절감 방법
          </h1>
          <p style={{ color: "#666" }}>지역가입자라면 꼭 알아야 할 보험료 부담을 줄여주는 제도와 꿀팁입니다.</p>
        </div>

        {/* 하이라이트 안내 */}
        <div style={{ 
          background: "#fff", 
          padding: "24px", 
          borderRadius: "24px", 
          border: "1px solid #f3e8fd",
          marginBottom: "2rem",
          boxShadow: "0 4px 12px rgba(123,31,162,0.05)"
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#7b1fa2", marginBottom: "12px" }}>💡 아는 만큼 줄어듭니다!</h2>
          <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.7", margin: 0 }}>
            건강보험료 개편안이 수시로 발표되고 있습니다. 최근에는 자동차에 대한 보험료 부과가 많이 폐지되거나 축소되는 등 
            다양한 변화가 있으니, 본인의 상황에 맞는 제도를 적극적으로 활용해 보세요.
          </p>
        </div>

        {/* 팁 리스트 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "3rem" }}>
          {tips.map((tip, index) => (
            <div key={index} style={{ 
              background: "#fff", 
              padding: "24px", 
              borderRadius: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
              borderLeft: "6px solid #7b1fa2"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", margin: "0 0 10px 0", color: "#1a1a1a" }}>
                {tip.title}
              </h3>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* 문의 및 도움말 */}
        <div style={{ 
          background: "linear-gradient(135deg, #7b1fa2, #9c27b0)", 
          borderRadius: "24px", 
          padding: "30px", 
          textAlign: "center",
          color: "#fff",
          marginBottom: "4rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "10px" }}>나의 예상 보험료가 궁금하신가요?</h3>
          <p style={{ fontSize: "0.9rem", opacity: 0.9, marginBottom: "20px" }}>
            국민건강보험공단 홈페이지의 '모의계산' 서비스를 이용하면 정확한 금액을 확인하실 수 있습니다.
          </p>
          <a href="https://www.nhis.or.kr" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-block",
            background: "#fff",
            color: "#7b1fa2",
            padding: "14px 28px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: "800",
            fontSize: "0.95rem"
          }}>
            국민건강보험공단 바로가기
          </a>
          <p style={{ marginTop: "20px", fontSize: "0.8rem", opacity: 0.8 }}>상담 전화: 1577-1000</p>
        </div>
      </div>
    </div>
  );
}
