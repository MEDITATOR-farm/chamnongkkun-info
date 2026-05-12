"use client";
import Link from "next/link";
import { ReactNode } from "react";

// 카드 공통 컨테이너
export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass-nature rounded-[32px] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}>
      {children}
    </div>
  );
}

// 네비게이션 링크
export function NavLinks() {
  const links = [
    { name: "기록", href: "/" },
    { name: "거제지도", href: "/#map" },
    { name: "오늘의시", href: "/#wisdom" },
    { name: "소개", href: "/about" },
  ];
}

// HeroButton ← 나중에 스토어 활성화 예정
export function HeroButton() {
  return null;
}

// 콘텐츠 제목 (섹션 헤더)
export function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  return (
    <div className="mb-10 reveal-up">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-xs font-black tracking-[0.2em] text-secondary uppercase">{subtitle || "HERITAGE"}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{title}</h2>
    </div>
  );
}
