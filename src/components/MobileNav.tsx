"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/",      icon: "🏡", label: "홈" },
  { href: "/#map",  icon: "📍", label: "거제지도" },
  { href: "/#diary", icon: "🌱", label: "농부일기" },
  { href: "/#wisdom", icon: "✨", label: "오늘의시" },
  { href: "/about", icon: "👤", label: "소개" },
];

export default function MobileNav() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[100] sm:hidden bg-background/90 backdrop-blur-xl border-t border-primary/5 pb-[env(safe-area-inset-bottom,12px)] pt-3 px-2 flex justify-around">
      {NAV_ITEMS.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 flex-1 py-1 transition-all active:scale-90"
          >
            <span className={`text-xl transition-all ${isActive ? 'scale-110 drop-shadow-md' : 'opacity-40 grayscale'}`}>{icon}</span>
            <span className={`text-[10px] font-black tracking-tighter transition-colors ${isActive ? 'text-primary' : 'text-foreground/30'}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
