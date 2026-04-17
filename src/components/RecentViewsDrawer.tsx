"use client";

import { useState } from "react";
import { useRecentViews } from "@/hooks/useRecentViews";
import Link from "next/link";

export default function RecentViewsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { recentViews, clearViews } = useRecentViews();

  if (recentViews.length === 0) return null;

  return (
    <>
      {/* Floating Button right above MobileNav */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "80px", // Above mobile nav
          right: "20px",
          zIndex: 90,
          background: "rgba(6, 15, 30, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(34, 211, 238, 0.3)",
          color: "#22d3ee",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
        aria-label="최근 본 기록"
      >
        🕒
      </button>

      {/* Overlay & Drawer */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "flex-end",
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxHeight: "70vh",
              background: "#0a1329",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "20px",
              overflowY: "auto",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "white" }}>최근 본 항목</h3>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "white", fontSize: "1.5rem" }}
              >
                ×
              </button>
            </div>

            {recentViews.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recentViews.map((item) => (
                  <Link 
                    key={item.url} 
                    href={item.url}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{ fontSize: "0.7rem", color: "#22d3ee", marginBottom: "4px", fontWeight: "bold" }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "white", fontWeight: "bold" }}>
                      {item.title}
                    </div>
                  </Link>
                ))}
                <button
                  onClick={clearViews}
                  style={{
                    marginTop: "10px", padding: "10px", background: "rgba(255,0,0,0.1)", color: "#ff6b6b", border: "none", borderRadius: "10px", cursor: "pointer"
                  }}
                >
                  기록 모두 지우기
                </button>
              </div>
            ) : (
              <p style={{ color: "rgba(255,255,255,0.4)" }}>모든 기록이 삭제되었습니다.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
