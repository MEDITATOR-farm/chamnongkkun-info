"use client";
import Link from "next/link";
import { ReactNode } from "react";

const G: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "20px",
};

// 카테고리별 썸네일 플레이스홀더 그라디언트
const CATEGORY_GRADIENTS: Record<string, string> = {
  정보: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
  행사: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
  농업: "linear-gradient(135deg, #34d399 0%, #059669 100%)",
  복지: "linear-gradient(135deg, #fdba74 0%, #f97316 100%)",
  지원금: "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
  귀농: "linear-gradient(135deg, #86efac 0%, #16a34a 100%)",
  부동산: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
  기본: "linear-gradient(135deg, #334155 0%, #1e293b 100%)",
};

const CATEGORY_ICONS: Record<string, string> = {
  정보: "📋", 행사: "🌸", 농업: "🌱", 복지: "🤝",
  지원금: "💰", 귀농: "🏡", 부동산: "🏢", 기본: "📝",
};

// D-day 계산 함수
function getDday(endDate?: string): { label: string; color: string; bg: string } | null {
  if (!endDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) return null; // 이미 지난 행사
  if (diff === 0) return { label: "D-DAY", color: "#fff", bg: "#ef4444" };
  if (diff <= 3) return { label: `D-${diff}`, color: "#fff", bg: "#f97316" };
  if (diff <= 7) return { label: `D-${diff}`, color: "#fff", bg: "#eab308" };
  return { label: `D-${diff}`, color: "#fff", bg: "rgba(255,255,255,0.15)" };
}

export function GlassCard({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div style={{ ...G, ...style }} className={className}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.11)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; }}
      data-hover="true"
    >
      {children}
    </div>
  );
}

export function GlassLinkCard({ href, children, style }: { href: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ ...G, transition: "background 0.2s, transform 0.2s", ...style }}
        data-hover="true"
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(255,255,255,0.11)";
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(255,255,255,0.06)";
          el.style.transform = "translateY(0)";
        }}
      >
        {children}
      </div>
    </Link>
  );
}

export function SupportCard({ href, icon, tag, tagColor, title, amount }: {
  href: string; icon: string; tag: string; tagColor: string; title: string; amount: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div data-hover="true"
        style={{ ...G, padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", transition: "background 0.2s, transform 0.2s" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.11)"; el.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.transform = "translateY(0)"; }}
      >
        <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.7rem", color: tagColor, fontWeight: 700, marginBottom: "2px" }}>{tag}</div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700 }}>{amount}</div>
        </div>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
      </div>
    </Link>
  );
}

// 블로그 & 행사 통합 카드 (가로형 레이아웃 + 좌측 썸네일 + D-day 뱃지)
export function ContentCard({ href, category, date, title, summary, tagColor, meta, thumbnail, endDate }: {
  href: string; category?: string; date: string; title: string; summary?: string;
  tagColor: string; meta?: string; thumbnail?: string; endDate?: string;
}) {
  const gradient = CATEGORY_GRADIENTS[category || "기본"] || CATEGORY_GRADIENTS["기본"];
  const icon = CATEGORY_ICONS[category || "기본"] || CATEGORY_ICONS["기본"];
  const dday = getDday(endDate);

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div data-hover="true"
        style={{ ...G, overflow: "hidden", display: "flex", flexDirection: "row", height: "100%", transition: "background 0.2s, transform 0.2s" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.11)"; el.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.transform = "translateY(0)"; }}
      >
        {/* 썸네일 - 좌측 */}
        <div style={{ width: "52px", flexShrink: 0, overflow: "hidden", position: "relative" }}>
          {thumbnail ? (
            <img src={thumbnail} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.4rem" }}>{icon}</span>
            </div>
          )}
          {/* D-day 뱃지 */}
          {dday && (
            <div style={{
              position: "absolute", bottom: "6px", left: "50%", transform: "translateX(-50%)",
              background: dday.bg, color: dday.color,
              fontSize: "0.55rem", fontWeight: 800,
              padding: "2px 5px", borderRadius: "6px",
              whiteSpace: "nowrap", letterSpacing: "0.03em",
            }}>
              {dday.label}
            </div>
          )}
        </div>

        {/* 텍스트 - 우측 */}
        <div style={{ padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "5px", flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
            {category && (
              <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", color: tagColor, background: "rgba(255,255,255,0.08)", flexShrink: 0 }}>
                {category}
              </span>
            )}
            <span style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto", whiteSpace: "nowrap" }}>{date}</span>
          </div>
          <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "white", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
            {title}
          </div>
          {summary && (
            <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
              {summary}
            </div>
          )}
          {meta && (
            <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>📍 {meta}</div>
          )}
          <div style={{ fontSize: "0.72rem", color: "#22d3ee", fontWeight: 700, marginTop: "auto" }}>자세히 →</div>
        </div>
      </div>
    </Link>
  );
}

// 기존 BlogCard는 ContentCard로 대체되었지만 호환성 유지
export function BlogCard({ href, category, date, title, summary, tagColor }: {
  href: string; category?: string; date: string; title: string; summary?: string; tagColor: string;
}) {
  return <ContentCard href={href} category={category} date={date} title={title} summary={summary} tagColor={tagColor} />;
}

export function NavLinks() {
  return (
    <div style={{ display: "flex", gap: "clamp(0.6rem, 2vw, 1.8rem)", alignItems: "center", whiteSpace: "nowrap" }}>
      {([["홈", "/"], ["블로그", "/blog"], ["지원금", "/support/youth"], ["소개", "/about"]] as [string, string][]).map(([t, h]) => (
        <Link key={h} href={h}
          style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >{t}</Link>
      ))}
      <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer"
        style={{ color: "#22d3ee", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none" }}>🛒 스토어</a>
    </div>
  );
}

export function HeroButton() {
  return (
    <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" data-hover="true"
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "linear-gradient(135deg, #f59e0b, #ef4444)",
        color: "white", fontWeight: 700, fontSize: "0.9rem",
        padding: "12px 28px", borderRadius: "40px", textDecoration: "none",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 30px rgba(245,158,11,0.35)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
    >🛍️ 참농꾼 스토어 바로가기 →</a>
  );
}
