import Link from "next/link";

export default function RealEstatePage() {
  const areas = [
    {
      area: "고현동·중곡동",
      tag: "도심 중심",
      color: "#1565c0",
      bg: "#e3f2fd",
      items: [
        { type: "아파트 매매", size: "84㎡ 기준", price: "2억 ~ 3억 5천만원", trend: "보합" },
        { type: "아파트 전세", size: "84㎡ 기준", price: "1억 2천 ~ 2억원", trend: "보합" },
        { type: "아파트 월세", size: "59㎡ 기준", price: "보증 2천 / 월 50~70만원", trend: "-" },
      ]
    },
    {
      area: "장평동·상문동",
      tag: "주거 밀집",
      color: "#2e7d32",
      bg: "#e8f5e9",
      items: [
        { type: "아파트 매매", size: "84㎡ 기준", price: "1억 8천 ~ 2억 8천만원", trend: "소폭 하락" },
        { type: "아파트 전세", size: "84㎡ 기준", price: "1억 ~ 1억 6천만원", trend: "보합" },
        { type: "아파트 월세", size: "59㎡ 기준", price: "보증 1천 / 월 45~60만원", trend: "-" },
      ]
    },
    {
      area: "아주동·양정동",
      tag: "조선소 인근",
      color: "#6a1b9a",
      bg: "#f3e5f5",
      items: [
        { type: "아파트 매매", size: "84㎡ 기준", price: "1억 5천 ~ 2억 5천만원", trend: "하락세" },
        { type: "아파트 전세", size: "84㎡ 기준", price: "8천 ~ 1억 3천만원", trend: "하락세" },
        { type: "아파트 월세", size: "59㎡ 기준", price: "보증 500 / 월 35~50만원", trend: "-" },
      ]
    },
    {
      area: "신현읍·사등면",
      tag: "외곽·전원",
      color: "#e65100",
      bg: "#fff3e0",
      items: [
        { type: "단독주택 매매", size: "대지 100평 기준", price: "8천 ~ 1억 5천만원", trend: "보합" },
        { type: "농가주택 매매", size: "농지 포함", price: "5천 ~ 1억 2천만원", trend: "보합" },
        { type: "전·답 매매", size: "1,000㎡ 기준", price: "3천 ~ 8천만원", trend: "소폭 상승" },
      ]
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1565c0", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🏡 거제 부동산 시세
          </h1>
          <p style={{ color: "#666" }}>거제시 주요 지역별 아파트·주택·토지 시세를 정리했습니다.</p>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #1565c0, #0d47a1)",
          padding: "24px",
          borderRadius: "24px",
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 10px 20px rgba(21,101,192,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>📌 시세 안내</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            아래 시세는 2024년 하반기 실거래가 및 호가 기준 참고 자료입니다.
            정확한 시세는 국토교통부 실거래가 공개시스템(rt.molit.go.kr)에서 확인하세요.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {areas.map((area, i) => (
            <div key={i} style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              border: `1px solid ${area.bg}`,
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span style={{
                  background: area.bg,
                  color: area.color,
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "800"
                }}>{area.tag}</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#1a1a1a", margin: 0 }}>{area.area}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {area.items.map((item, j) => (
                  <div key={j} style={{
                    background: area.bg,
                    borderRadius: "12px",
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}>
                    <div>
                      <span style={{ fontWeight: "800", fontSize: "0.95rem", color: area.color }}>{item.type}</span>
                      <span style={{ fontSize: "0.8rem", color: "#888", marginLeft: "8px" }}>{item.size}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: "800", fontSize: "1rem", color: "#1a1a1a" }}>{item.price}</span>
                      {item.trend !== "-" && (
                        <span style={{ fontSize: "0.75rem", color: "#888", marginLeft: "8px" }}>({item.trend})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            본 시세는 참고용이며 실제 거래가와 차이가 있을 수 있습니다.<br />
            정확한 정보는 국토교통부 실거래가 공개시스템을 이용하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
