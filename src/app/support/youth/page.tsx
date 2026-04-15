import fs from "fs";
import path from "path";
import Link from "next/link";

const categoryColor: Record<string, string> = {
  주거: "#e37400", 일자리: "#e37400", 자산형성: "#e37400",
  창업: "#e37400", 농업: "#e37400", 복지: "#e37400",
};

export default function YouthSupportPage() {
  let data: any = null;
  try {
    data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/youth-support.json"), "utf-8"));
  } catch(e) {}

  const supports = data?.supports || [];

  return (
    <div style={{ minHeight: "100vh", background: "#fff9f2", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#e37400", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            💰 거제 청년 지원금 총정리
          </h1>
          <p style={{ color: "#666" }}>거제 청년이라면 꼭 챙겨야 할 정부 및 지자체 혜택을 모았습니다.</p>
          {data?.updatedAt && (
            <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "4px" }}>업데이트: {data.updatedAt}</p>
          )}
        </div>

        <div style={{
          background: "linear-gradient(135deg, #ff9800, #f57c00)",
          padding: "24px", borderRadius: "24px", color: "#fff",
          marginBottom: "2rem", boxShadow: "0 10px 20px rgba(245,124,0,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>📢 필독 사항</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            일부 지원 사업은 조기에 마감될 수 있으므로, 각 사업의 상세 공고를 반드시 확인하시기 바랍니다.
            궁금한 점은 거제시 청년센터 '거제청년다온'으로 문의하세요!
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {supports.map((item: any, index: number) => (
            <div key={index} style={{
              background: "#fff", borderRadius: "20px", padding: "24px",
              border: "1px solid #fee6c1", boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <span style={{
                  background: "#fff3e0", color: "#e37400",
                  padding: "4px 12px", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "800"
                }}>{item.category}</span>
                <span style={{ color: "#e37400", fontWeight: "800", fontSize: "1.1rem" }}>{item.amount}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", margin: "0 0 8px 0", color: "#1a1a1a" }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#d32f2f", fontWeight: "700", marginBottom: "8px" }}>대상: {item.target}</p>
              <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>{item.desc}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-block", marginTop: "16px",
                  background: "#f1f1f1", border: "none", padding: "10px 16px",
                  borderRadius: "10px", fontWeight: "700", fontSize: "0.85rem",
                  color: "#666", textDecoration: "none"
                }}>상세공고 보기 →</a>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            본 서비스는 거제YOUth 청년정보플랫폼 데이터를 기반으로 매주 자동 업데이트됩니다.<br/>
            정확한 정보는 <a href="https://www.geoje.go.kr/youth/index.geoje" target="_blank" rel="noopener noreferrer" style={{ color: "#e37400" }}>거제YOUth</a>를 참고하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
