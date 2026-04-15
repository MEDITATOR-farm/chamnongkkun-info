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
      <div style={{ ...G, cursor: "none", transition: "background 0.2s, transform 0.2s", ...style }}
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
        style={{ ...G, padding: "14px 16px", cursor: "none", display: "flex", alignItems: "center", gap: "12px", transition: "background 0.2s, transform 0.2s" }}
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

// 블로그 & 행사 통합 카드
export function ContentCard({ href, category, date, title, summary, tagColor, meta }: {
  href: string; category?: string; date: string; title: string; summary?: string; tagColor: string; meta?: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div data-hover="true"
        style={{ ...G, padding: "1rem 1.1rem", cursor: "none", display: "flex", flexDirection: "column", gap: "6px", height: "100%", transition: "background 0.2s, transform 0.2s" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.11)"; el.style.transform = "translateY(-3px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.transform = "translateY(0)"; }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {category && (
            <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", color: tagColor, background: "rgba(255,255,255,0.08)" }}>{category}</span>
          )}
          <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{date}</span>
        </div>
        <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "white", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{title}</div>
        {summary && (
          <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{summary}</div>
        )}
        {meta && (
          <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>📍 {meta}</div>
        )}
        <div style={{ fontSize: "0.72rem", color: "#22d3ee", fontWeight: 700, marginTop: "auto" }}>자세히 →</div>
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
    <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
      {([["홈", "/"], ["블로그", "/blog"], ["지원금", "/support/youth"], ["소개", "/about"]] as [string, string][]).map(([t, h]) => (
        <Link key={h} href={h}
          style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", cursor: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "white")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
        >{t}</Link>
      ))}
      <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer"
        style={{ color: "#22d3ee", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", cursor: "none" }}>🛒 스토어</a>
    </div>
  );
}

export function HeroButton() {
  return (
    <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" data-hover="true"
      style={{
        display: "inline-flex", alignItems: "center", gap: "8px", cursor: "none",
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
