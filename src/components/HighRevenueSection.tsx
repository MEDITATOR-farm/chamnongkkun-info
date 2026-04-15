"use client";
import Link from "next/link";

const categories = [
  {
    icon: "🏠", title: "거제 부동산 시세",
    desc: "아파트·토지 최신 실거래가 정보",
    tag: "부동산", tagColor: "#22d3ee", href: "/realestate",
  },
  {
    icon: "💰", title: "청년 지원금 총정리",
    desc: "경남 거제 청년이라면 꼭 받아야 할 지원금",
    tag: "지원금", tagColor: "#34d399", href: "/support/youth",
  },
  {
    icon: "🌾", title: "농업직불금 신청",
    desc: "2026년 농업직불금 신청 방법 완전 정리",
    tag: "농업", tagColor: "#86efac", href: "/support/farm",
  },
  {
    icon: "🏡", title: "귀농귀촌 지원금",
    desc: "정착지원금·교육비·주택수리비 신청 가이드",
    tag: "귀농", tagColor: "#fca5a5", href: "/support/return-farm",
  },
  {
    icon: "🏥", title: "건강보험료 절감",
    desc: "지역가입자 보험료 줄이는 합법적 방법",
    tag: "절약", tagColor: "#c4b5fd", href: "/tips/insurance",
  },
  {
    icon: "📋", title: "거제시 복지 혜택",
    desc: "놓치기 쉬운 거제시 복지 서비스 한눈에",
    tag: "복지", tagColor: "#fdba74", href: "/welfare",
  },
];

export default function HighRevenueSection() {
  return (
    <section style={{ padding: "0 0 3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.2rem" }}>
        <span style={{ fontSize: "1.1rem" }}>💡</span>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", margin: 0 }}>
          알면 돈이 되는 정보
        </h2>
        <span style={{
          fontSize: "0.65rem", background: "#ef4444", color: "white",
          padding: "2px 8px", borderRadius: "20px", fontWeight: 700,
        }}>HOT</span>
        <Link href="/realestate" style={{
          marginLeft: "auto", fontSize: "0.75rem",
          color: "rgba(255,255,255,0.4)", textDecoration: "none",
        }}>전체보기 →</Link>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "12px",
      }}>
        {categories.map((cat) => (
          <Link key={cat.href} href={cat.href} style={{ textDecoration: "none" }}>
            <div
              data-hover="true"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                padding: "1.1rem 1.2rem",
                cursor: "none",
                transition: "background 0.2s, transform 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.11)";
                el.style.transform = "translateY(-3px)";
                el.style.borderColor = "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.background = "rgba(255,255,255,0.06)";
                el.style.transform = "translateY(0)";
                el.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700, color: cat.tagColor,
                  background: "rgba(255,255,255,0.08)", padding: "2px 9px",
                  borderRadius: "20px",
                }}>{cat.tag}</span>
                <span style={{ fontSize: "1.4rem" }}>{cat.icon}</span>
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "white", marginBottom: "0.35rem" }}>
                {cat.title}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                {cat.desc}
              </div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: cat.tagColor, fontWeight: 700 }}>
                자세히 보기 →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
