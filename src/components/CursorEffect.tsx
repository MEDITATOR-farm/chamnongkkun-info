"use client";
import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    const glowEl = glowRef.current;
    if (!dot || !ringEl || !glowEl) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      glowEl.style.left = e.clientX + "px";
      glowEl.style.top = e.clientY + "px";
    };

    const enterHover = () => {
      dot.style.width = "6px";
      dot.style.height = "6px";
      dot.style.background = "#22d3ee";
      dot.style.boxShadow = "0 0 16px #22d3ee";
      ringEl.style.width = "52px";
      ringEl.style.height = "52px";
      ringEl.style.borderColor = "rgba(34,211,238,0.6)";
    };

    const leaveHover = () => {
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.background = "rgba(255,255,255,0.9)";
      dot.style.boxShadow = "0 0 14px rgba(255,255,255,0.4)";
      ringEl.style.width = "36px";
      ringEl.style.height = "36px";
      ringEl.style.borderColor = "rgba(255,255,255,0.35)";
    };

    document.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("a,button,[data-hover]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", enterHover);
      el.addEventListener("mouseleave", leaveHover);
    });

    let raf: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      ringEl.style.left = ring.current.x + "px";
      ringEl.style.top = ring.current.y + "px";
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", move);
      targets.forEach(el => {
        el.removeEventListener("mouseenter", enterHover);
        el.removeEventListener("mouseleave", leaveHover);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: "10px", height: "10px", borderRadius: "50%",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 0 14px rgba(255,255,255,0.4)",
        transform: "translate(-50%,-50%)",
        transition: "width 0.15s, height 0.15s, background 0.15s, box-shadow 0.15s",
      }} />
      <div ref={ringRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9998,
        width: "36px", height: "36px", borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.35)",
        transform: "translate(-50%,-50%)",
        transition: "width 0.2s, height 0.2s, border-color 0.2s",
      }} />
      <div ref={glowRef} style={{
        position: "fixed", pointerEvents: "none", zIndex: 9997,
        width: "240px", height: "240px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)",
        transform: "translate(-50%,-50%)",
        transition: "opacity 0.3s",
      }} />
    </>
  );
}
