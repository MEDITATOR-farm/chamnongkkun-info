import Link from "next/link";

export default function YouthSupportPage() {
  const supports = [
    { 
      title: "�?�� ?�세 ?�시 ?�별지??, 
      category: "주거", 
      amount: "??최�? 20만원", 
      target: "�?19~34??무주??�?��",
      desc: "경제???�려?�??겪는 �?��?�의 주거�?부??경감???�한 ?�세 지???�업?�니??"
    },
    { 
      title: "경남 �?��구직?�동?�당", 
      category: "?�자�?, 
      amount: "�?200만원 (??50만x4??", 
      target: "�?18~34??미취??�?��",
      desc: "?�극?�인 구직?�동???�는 �?��?�에�?교육�? ?�서구입�??�을 지?�합?�다."
    },
    { 
      title: "�?�� ?�일?�축계�?, 
      category: "?�산?�성", 
      amount: "본인 ?�축액??1~3�?매칭", 
      target: "�?19~34???�하??�?��",
      desc: "�?��???�정 금액???�축하�??��?가 지?�금??추�?�??�립??목돈 마련???�습?�다."
    },
    { 
      title: "거제??�?�� 창업 지??, 
      category: "창업", 
      amount: "최�? 1,500만원", 
      target: "거제?????�비 창업 �?��",
      desc: "참신???�이?�어�?가�?�?��?�의 ?�공?�인 창업???�해 ?�업???�금??지?�합?�다."
    }
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#fff9f2", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* ?�더 */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#e37400", fontWeight: "bold", fontSize: "0.9rem" }}>
            ???�으�??�아가�?
          </Link>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#1a1a1a", marginTop: "1rem" }}>
            ?�� 거제 �?�� 지?�금 총정�?
          </h1>
          <p style={{ color: "#666" }}>거제 �?��?�라�?�?챙겨?????��? �?지?�체 ?�택??모았?�니??</p>
        </div>

        {/* ?�내 카드 */}
        <div style={{ 
          background: "linear-gradient(135deg, #ff9800, #f57c00)", 
          padding: "24px", 
          borderRadius: "24px", 
          color: "#fff",
          marginBottom: "2rem",
          boxShadow: "0 10px 20px rgba(245,124,0,0.2)"
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "8px" }}>?�� ?�독 ?�항</h2>
          <p style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.9 }}>
            ?��? 지???�업?� 조기??마감?????�으므�? �??�업???�세 공고�?반드???�인?�시�?바랍?�다. 
            궁금???��? 거제??�?��?�터 '거제�?��?�온'?�로 문의?�세??
          </p>
        </div>

        {/* 지?�금 리스??*/}
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
              <p style={{ fontSize: "0.9rem", color: "#d32f2f", fontWeight: "700", marginBottom: "8px" }}>?�?? {item.target}</p>
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
                ?�세공고 보기
              </button>
            </div>
          ))}
        </div>

        {/* ?�단 ?�내 */}
        <div style={{ marginTop: "3rem", textAlign: "center", paddingBottom: "4rem" }}>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            �??�비?�는 공공 ?�이?��? 기반?�로 ?�작?�었?�니??<br/>
            ?�확???�보??'?��?24' ?�는 '마이?? ?�페?��?�?참고?�세??
          </p>
        </div>
      </div>
    </div>
  );
}
