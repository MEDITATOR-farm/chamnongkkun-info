import Link from "next/link";

export default function RealEstatePage() {
  // 샘플 데이터 (나중에 실제 데이터로 연결할 수 있습니다)
  const realEstateData = [
    { name: "고현 e편한세상", type: "아파트", size: "84㎡", price: "3억 8,000만", change: "▲ 500" },
    { name: "상동 힐스테이트 거제", type: "아파트", size: "84㎡", price: "4억 2,000만", change: "▼ 200" },
    { name: "장평 포레나 거제", type: "아파트", size: "84㎡", price: "3억 9,000만", change: "-", },
    { name: "수월 자이", type: "아파트", size: "110㎡", price: "5억 5,000만", change: "▲ 1,000" },
    { name: "아주 KCC 스위첸", type: "아파트", size: "84㎡", price: "2억 9,000만", change: "▲ 300" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fbff", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#1a73e8", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            🏠 거제 부동산 실거래가 시세
          </h1>
          <p style={{ color: "#666" }}>거제시 주요 아파트 및 토지의 최신 거래 정보를 확인하세요.</p>
        </div>

        {/* 안내 카드 */}
        <div style={{ 
          background: "#fff", 
          padding: "20px", 
          borderRadius: "16px", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          marginBottom: "2rem",
          border: "1px solid #eef2f6"
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "10px" }}>💡 부동산 거래 팁</h2>
          <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: "1.6" }}>
            실거래가는 국토교통부 데이터를 기준으로 하며, 실제 매물 가격과는 차이가 있을 수 있습니다. 
            정확한 시세 파악을 위해서는 주변 공인중개사 사무소 방문을 권장드립니다.
          </p>
        </div>

        {/* 시세 리스트 */}
        <div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={{ padding: "15px", fontSize: "0.85rem", color: "#64748b" }}>단지명</th>
                <th style={{ padding: "15px", fontSize: "0.85rem", color: "#64748b" }}>면적</th>
                <th style={{ padding: "15px", fontSize: "0.85rem", color: "#64748b" }}>실거래가</th>
                <th style={{ padding: "15px", fontSize: "0.85rem", color: "#64748b" }}>변동</th>
              </tr>
            </thead>
            <tbody>
              {realEstateData.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "15px", fontWeight: "700", color: "#1a1a1a" }}>{item.name}</td>
                  <td style={{ padding: "15px", color: "#666", fontSize: "0.9rem" }}>{item.size}</td>
                  <td style={{ padding: "15px", fontWeight: "800", color: "#1a73e8" }}>{item.price}</td>
                  <td style={{ 
                    padding: "15px", 
                    fontSize: "0.85rem", 
                    fontWeight: "700",
                    color: item.change.includes("▲") ? "#d32f2f" : item.change.includes("▼") ? "#1976d2" : "#666"
                  }}>
                    {item.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단 안내 */}
        <div style={{ marginTop: "2rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            데이터 업데이트: 2026년 4월 15일 기준<br/>
            제공: 국토교통부 실거래가 공개시스템
          </p>
        </div>
      </div>
    </div>
  );
}
