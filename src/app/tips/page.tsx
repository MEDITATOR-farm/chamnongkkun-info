"use client";
import Link from "next/link";

const categories = [
  {
    icon: "🏠",
    title: "거제 부동산 시세",
    desc: "거제시 주요 지역의 아파트, 상가, 토지 실거래가 및 최신 부동산 동향을 확인하세요.",
    tag: "부동산",
    color: "#e8f4fd",
    tagColor: "#1a73e8",
    href: "/realestate",
  },
  {
    icon: "💰",
    title: "청년 지원금 총정리",
    desc: "사회에 첫발을 내딛는 거제 청년들을 위한 정부와 시의 다양한 지원금 혜택을 모았습니다.",
    tag: "지원금",
    color: "#fef3e2",
    tagColor: "#e37400",
    href: "/support/youth",
  },
  {
    icon: "🌾",
    title: "농업직불금 신청",
    desc: "2026년 공익직불금 신청 기간부터 자격 요건, 준수 사항까지 꼼꼼하게 안내해 드립니다.",
    tag: "농업",
    color: "#e6f4ea",
    tagColor: "#1e8e3e",
    href: "/support/farm",
  },
  {
    icon: "🏡",
    title: "귀농귀촌 지원금",
    desc: "거제로의 새로운 도전을 꿈꾸는 귀농귀촌인을 위한 정착 자금 및 주택 수리비 지원 가이드입니다.",
    tag: "귀농",
    color: "#fce8e6",
    tagColor: "#c5221f",
    href: "/support/return-farm",
  },
  {
    icon: "🏥",
    title: "건강보험료 절감",
    desc: "지역가입자 보험료 부과 기준 개편안과 보험료를 줄일 수 있는 합법적인 꿀팁을 정리했습니다.",
    tag: "절약",
    color: "#f3e8fd",
    tagColor: "#7b1fa2",
    href: "/tips/insurance",
  },
  {
    icon: "📋",
    title: "거제시 복지 혜택",
    desc: "아이부터 어르신까지, 거제시민이라면 누구나 누릴 수 있는 풍성한 복지 서비스를 확인하세요.",
    tag: "복지",
    color: "#e8f5e9",
    tagColor: "#2e7d32",
    href: "/welfare",
  },
];

export default function TipsHubPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8fbff", padding: "3rem 1rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* 헤더 */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#666", fontWeight: "bold", fontSize: "0.9rem" }}>
            ← 홈으로 돌아가기
          </Link>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1a1a1a", marginTop: "1rem", letterSpacing: "-1px" }}>
            💡 알면 돈이 되는 <span style={{ color: "#1a73e8" }}>정보 센터</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666", marginTop: "10px" }}>
            거제 생활의 품격을 높여주는 핵심 혜택들을 모두 모았습니다.
          </p>
        </div>

        {/* 리스트 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "5rem" }}>
          {categories.map((item, index) => (
            <Link key={index} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{ 
                background: "#fff", 
                borderRadius: "24px", 
                padding: "30px", 
                display: "flex", 
                alignItems: "center", 
                gap: "24px",
                border: "1px solid #eef2f6",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = item.tagColor + "33";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.03)";
                e.currentTarget.style.borderColor = "#eef2f6";
              }}
              >
                <div style={{ 
                  width: "70px", 
                  height: "70px", 
                  background: item.color, 
                  borderRadius: "20px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "2.2rem",
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: "800", 
                    color: item.tagColor, 
                    background: item.color, 
                    padding: "4px 12px", 
                    borderRadius: "20px",
                    display: "inline-block",
                    marginBottom: "8px"
                  }}>
                    {item.tag}
                  </span>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#1a1a1a", margin: "0 0 6px 0" }}>
                    {item.title}
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "#555", margin: 0, lineHeight: "1.6" }}>
                    {item.desc}
                  </p>
                </div>
                <div style={{ color: "#cbd5e1", fontSize: "1.5rem", fontWeight: "bold" }}>›</div>
              </div>
            </Link>
          ))}
        </div>

        {/* 하단 푸터 느낌의 안내 */}
        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.9rem", paddingBottom: "4rem" }}>
          <p>내용은 정기적으로 업데이트됩니다. 더 궁금한 점이 있다면 각 상세 페이지의 문의처를 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}
