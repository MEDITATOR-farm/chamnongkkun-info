"use client";

import Link from "next/link";


const categories = [
  {
    icon: "🏠",
    title: "거제 부동산 시세",
    desc: "아파트·토지 최신 실거래가 정보",
    tag: "부동산",
    color: "#e8f4fd",
    tagColor: "#1a73e8",
    href: "/realestate",
  },
  {
    icon: "💰",
    title: "청년 지원금 총정리",
    desc: "경남 거제 청년이라면 꼭 받아야 할 지원금",
    tag: "지원금",
    color: "#fef3e2",
    tagColor: "#e37400",
    href: "/support/youth",
  },
  {
    icon: "🌾",
    title: "농업직불금 신청",
    desc: "2026년 농업직불금 신청 방법 완전 정리",
    tag: "농업",
    color: "#e6f4ea",
    tagColor: "#1e8e3e",
    href: "/support/farm",
  },
  {
    icon: "🏡",
    title: "귀농귀촌 지원금",
    desc: "정착지원금·교육비·주택수리비 신청 가이드",
    tag: "귀농",
    color: "#fce8e6",
    tagColor: "#c5221f",
    href: "/support/return-farm",
  },
  {
    icon: "🏥",
    title: "건강보험료 절감",
    desc: "지역가입자 보험료 줄이는 합법적 방법",
    tag: "절약",
    color: "#f3e8fd",
    tagColor: "#7b1fa2",
    href: "/tips/insurance",
  },
  {
    icon: "📋",
    title: "거제시 복지 혜택",
    desc: "놓치기 쉬운 거제시 복지 서비스 한눈에",
    tag: "복지",
    color: "#e8f5e9",
    tagColor: "#2e7d32",
    href: "/welfare",
  },
];

export default function HighRevenueSection() {
  return (
    <section style={{ 
      padding: "4rem 1rem", 
      maxWidth: "1000px", 
      margin: "0 auto",
      position: "relative"
    }}>
      {/* 배경 장식 요소 */}
      <div style={{
        position: "absolute",
        top: "10%",
        right: "-5%",
        width: "200px",
        height: "200px",
        background: "rgba(26, 115, 232, 0.05)",
        filter: "blur(60px)",
        borderRadius: "50%",
        zIndex: -1
      }} />

      {/* 섹션 헤더 */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "2rem",
        padding: "0 10px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px",
            height: "40px",
            background: "#fff",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontSize: "1.2rem"
          }}>
            💡
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", margin: 0, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
              알면 돈이 되는 정보
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#666", margin: "2px 0 0 0" }}>거제 생활의 질을 높여주는 핵심 혜택</p>
          </div>
          <span style={{
            fontSize: "0.65rem", 
            background: "linear-gradient(135deg, #ff4444, #ff8888)", 
            color: "#fff",
            padding: "3px 10px", 
            borderRadius: "20px", 
            fontWeight: "800",
            boxShadow: "0 2px 8px rgba(255,68,68,0.3)",
            animation: "pulse 2s infinite"
          }}>
            HOT
          </span>
        </div>
        
        <Link href="/tips" style={{ 
          fontSize: "0.85rem", 
          fontWeight: "600", 
          color: "#1a73e8", 
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          전체보기 
          <span style={{ fontSize: "1rem" }}>›</span>
        </Link>
      </div>

      {/* 카드 그리드 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {categories.map((item, index) => (
          <Link 
            key={index} 
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid rgba(240, 240, 240, 0.8)",
              height: "100%",
              transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = item.tagColor + "44";
              e.currentTarget.style.background = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
              e.currentTarget.style.borderColor = "rgba(240, 240, 240, 0.8)";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
            }}
            >
              {/* 장식용 그라데이션 원 */}
              <div style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                background: item.color,
                borderRadius: "50%",
                opacity: 0.3,
                zIndex: 0
              }} />

              <div style={{
                width: "56px",
                height: "56px",
                background: item.color,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                zIndex: 1,
                boxShadow: `0 8px 16px ${item.tagColor}15`
              }}>
                {item.icon}
              </div>
              
              <div style={{ zIndex: 1 }}>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  color: item.tagColor,
                  background: item.color,
                  padding: "4px 12px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "inline-block",
                  letterSpacing: "0.5px"
                }}>
                  {item.tag}
                </span>
                <h3 style={{ 
                  fontSize: "1.15rem", 
                  fontWeight: "800", 
                  margin: "6px 0", 
                  color: "#1a1a1a",
                  lineHeight: "1.3"
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "#555", 
                  margin: 0, 
                  lineHeight: "1.6",
                  fontWeight: "500"
                }}>
                  {item.desc}
                </p>
              </div>

              <div style={{
                marginTop: "auto",
                paddingTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: item.tagColor,
                fontSize: "0.85rem",
                fontWeight: "700"
              }}>
                자세히 알아보기
                <span style={{ transition: "transform 0.2s" }} className="arrow">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

