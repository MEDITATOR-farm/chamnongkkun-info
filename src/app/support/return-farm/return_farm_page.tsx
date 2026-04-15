import Link from "next/link";

export default function ReturnFarmPage() {
  const supports = [
    {
      title: "귀농창업 및 주택구입 지원",
      category: "융자",
      amount: "창업 최대 3억원 / 주택 7,500만원",
      target: "귀농인 (농촌 이주 후 세대원 전원 전입)",
      desc: "귀농 후 영농창업 자금 및 주택 구입·신축 자금을 저리(연 1~2%)로 융자 지원합니다. 5년 거치 10년 균등분할 상환 조건입니다.",
      detail: "신청처: 거제시 농업기술센터 / 접수: 연중"
    },
    {
      title: "경남 귀농귀촌 정착 지원금",
      category: "보조금",
      amount: "최대 1,000만원",
      target: "경남으로 귀농귀촌 후 1년 이상 거주한 가구",
      desc: "경상남도가 지원하는 귀농귀촌 가구 정착 보조금입니다. 영농기반 조성, 농기계 구입, 주택 수리 등에 사용 가능합니다.",
      detail: "신청기간: 매년 상반기 / 신청처: 거제시 농업기술센터"
    },
    {
      title: "귀농귀촌 교육 이수 지원",
      category: "교육",
      amount: "교육비 무료 + 귀농지원금 우대",
      target: "귀농을 준비 중인 도시민",
      desc: "귀농학교·귀농귀촌 종합센터 운영 교육 이수 시 각종 지원금 신청 시 우대를 받습니다. 100시간 이상 이수 시 창업 지원 융자 금리 우대 혜택이 있습니다.",
      detail: "신청처: 경남귀농귀촌지원센터 055-254-7777"
    },
    {
      title: "농촌 빈집 리모델링 지원",
      category: "주거",
      amount: "최대 1,000만원 보조",
      target: "거제시 내 농촌 빈집을 구입·임차한 귀농귀촌인",
      desc: "농촌에 방치된 빈집을 귀농귀촌인이 리모델링할 경우 공사비 일부를 보조합니다. 취약지역 빈집 우선 지원이며 거주 의무 기간(5년)이 있습니다.",
      detail: "신청기간: 매년 3~4월 / 신청처: 거제시 농촌활력과"
    },
    {
      title: "귀농인의 집 (임시거주 지원)",
      category: "주거",
      amount: "월 10만원 이하 저렴한 임대",
      target: "귀농귀촌 준비 중 임시 거주가 필요한 가구",
      desc: "귀농귀촌 초기 정착 시 농촌 지역 빈집을 저렴하게 임대하는 제도입니다. 거제시 내 일부 읍면 지역에서 운영되며 최대 2년 거주 가능합니다.",
      detail: "문의: 거제시 농촌활력과 055-639-3114"
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f9f6f0", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#795548", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🌿 귀농귀촌 지원금 총정리
          </h1>
          <p style={{ color: "#666" }}>거제로 귀농귀촌을 준비 중이라면 꼭 확인하세요.</p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #795548, #4e342e)",
          padding: "24px",
          borderRadius: "24px",
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 10px 20px rgba(121,85,72,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>🏡 귀농귀촌 절차 안내</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            귀농귀촌은 ① 귀농귀촌 교육 이수 → ② 농업경영체 등록 → ③ 전입신고 → ④ 지원금 신청 순서로 진행됩니다.
            사전 상담은 거제시 농업기술센터(055-639-3114)로 문의하세요.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {supports.map((item, index) => (
            <div key={index} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid #d7ccc8",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{
                  background: "#efebe9",
                  color: "#795548",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "800"
                }}>{item.category}</span>
                <span style={{ color: "#795548", fontWeight: "800", fontSize: "1rem" }}>{item.amount}</span>
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
            귀농귀촌 종합 정보는 귀농귀촌종합센터(www.returnfarm.com)를 참고하세요.<br />
            경남 귀농귀촌지원센터: 055-254-7777
          </p>
        </div>
      </div>
    </div>
  );
}
