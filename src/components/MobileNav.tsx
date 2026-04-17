"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",              icon: "🏠", label: "홈" },
  { href: "/events",        icon: "🌸", label: "행사" },
  { href: "/blog",          icon: "📝", label: "블로그" },
  { href: "/support/youth", icon: "💰", label: "지원금" },
  { href: "/about",         icon: "👤", label: "소개" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 100,
      display: "flex",
      background: "rgba(6,15,30,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      padding: "6px 0 env(safe-area-inset-bottom, 6px)",
    }}
      className="sm:hidden"
    >
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "6px 0",
              textDecoration: "none",
              position: "relative",
            }}
          >
            <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontSize: "0.62rem",
              fontWeight: isActive ? 800 : 500,
              color: isActive ? "#22d3ee" : "rgba(255,255,255,0.45)",
              letterSpacing: "0.02em",
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                width: "4px", height: "4px",
                borderRadius: "50%",
                background: "#22d3ee",
                marginTop: "1px",
              }} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
