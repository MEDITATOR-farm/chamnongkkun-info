import Link from "next/link";

export default function InsurancePage() {
  const tips = [
    {
      title: "농어촌 지역가입자 보험료 경감",
      category: "농어업인 혜택",
      save: "22% 경감",
      target: "농업경영체 등록 농업인",
      desc: "농어업인으로 등록된 지역가입자는 건강보험료를 22% 경감받습니다. 농업경영체 등록 후 국민건강보험공단에 신청하면 됩니다.",
      detail: "신청처: 국민건강보험공단 거제지사 1577-1000"
    },
    {
      title: "피부양자 등록으로 보험료 절감",
      category: "피부양자 전환",
      save: "보험료 0원",
      target: "소득·재산 기준을 충족하는 가족",
      desc: "연 소득 2,000만원 이하, 재산 과세표준 5억4천만원 이하인 경우 직장가입자 가족의 피부양자로 등록하면 보험료를 내지 않아도 됩니다.",
      detail: "신청처: 국민건강보험공단 1577-1000 / 온라인: nhis.or.kr"
    },
    {
      title: "재산 공제 확대 활용",
      category: "보험료 산정",
      save: "재산 5천만원 공제",
      target: "지역가입자 전체",
      desc: "지역가입자 건강보험료 산정 시 재산에서 기본 5,000만원을 공제합니다. 재산 규모가 작은 농촌 지역 주민에게 유리한 제도입니다.",
      detail: "문의: 국민건강보험공단 1577-1000"
    },
    {
      title: "건강보험료 납부 유예 신청",
      category: "긴급복지",
      save: "최대 6개월 납부 유예",
      target: "재난·재해 등으로 생계가 곤란한 가입자",
      desc: "자연재해, 화재, 갑작스러운 실직 등으로 보험료 납부가 어려운 경우 최대 6개월간 납부를 유예받을 수 있습니다.",
      detail: "신청처: 국민건강보험공단 거제지사 또는 1577-1000"
    },
    {
      title: "본인부담금 상한제 환급",
      category: "의료비 환급",
      save: "연간 초과분 전액 환급",
      target: "건강보험 가입자 전체",
      desc: "연간 본인부담 의료비 합계가 소득 구간별 상한액(81만~780만원)을 초과하면 초과분을 자동 환급받습니다. 별도 신청 없이 공단이 안내합니다.",
      detail: "문의: 국민건강보험공단 1577-1000"
    },
    {
      title: "장기요양보험료 농어업인 경감",
      category: "농어업인 혜택",
      save: "30% 경감",
      target: "농어업인으로 등록된 지역가입자",
      desc: "건강보험료와 함께 부과되는 장기요양보험료도 농어업인은 30% 경감받습니다. 건강보험료 경감 신청 시 함께 처리됩니다.",
      detail: "신청처: 국민건강보험공단 거제지사 1577-1000"
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7ff", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#0277bd", fontWeight: "bold", fontSize: "0.9rem" }}>
            홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            건강보험료 절감 방법
          </h1>
          <p style={{ color: "#666" }}>거제 농촌 주민이 활용할 수 있는 건강보험료 절감 제도를 안내합니다.</p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0277bd, #01579b)",
          padding: "24px",
          borderRadius: "24px",
          color: "#fff",
          marginBottom: "2rem"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>절감 핵심 포인트</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            농업경영체 등록만 해도 건강보험료 22%, 장기요양보험료 30%를 경감받습니다.
            아직 신청 안 하셨다면 지금 바로 국민건강보험공단(1577-1000)에 문의하세요.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {tips.map((item, index) => (
            <div key={index} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #b3d9f5"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{
                  background: "#e1f0fa",
                  color: "#0277bd",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "800"
                }}>{item.category}</span>
                <span style={{ color: "#0277bd", fontWeight: "800", fontSize: "1rem" }}>{item.save}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: "0 0 8px 0", color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#d32f2f", fontWeight: "700", marginBottom: "8px" }}>대상: {item.target}</p>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: "0 0 8px 0", lineHeight: "1.6" }}>{item.desc}</p>
              <p style={{ fontSize: "0.85rem", color: "#888", margin: 0 }}>{item.detail}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            건강보험료 관련 문의는 국민건강보험공단 고객센터(1577-1000)로 연락하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
