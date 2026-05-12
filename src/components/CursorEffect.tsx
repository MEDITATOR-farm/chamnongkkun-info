"use client";
import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };

    const enterHover = () => {
      dot.style.width = "40px";
      dot.style.height = "40px";
      dot.style.background = "var(--primary)";
      dot.style.opacity = "0.1";
      ringEl.style.width = "60px";
      ringEl.style.height = "60px";
      ringEl.style.borderColor = "var(--secondary)";
    };

    const leaveHover = () => {
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.background = "var(--primary)";
      dot.style.opacity = "0.4";
      ringEl.style.width = "30px";
      ringEl.style.height = "30px";
      ringEl.style.borderColor = "var(--primary)";
    };

    document.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("a,button,[data-hover]");
    targets.forEach(el => {
      el.addEventListener("mouseenter", enterHover);
      el.addEventListener("mouseleave", leaveHover);
    });

    let raf: number;
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
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
      <div ref={dotRef} className="hidden md:block" style={{
        position: "fixed", pointerEvents: "none", zIndex: 9999,
        width: "8px", height: "8px", borderRadius: "50%",
        background: "var(--primary)",
        opacity: 0.4,
        transform: "translate(-50%,-50%)",
        transition: "width 0.3s, height 0.3s, background 0.3s, opacity 0.3s",
      }} />
      <div ref={ringRef} className="hidden md:block" style={{
        position: "fixed", pointerEvents: "none", zIndex: 9998,
        width: "30px", height: "30px", borderRadius: "50%",
        border: "1px solid var(--primary)",
        opacity: 0.2,
        transform: "translate(-50%,-50%)",
        transition: "width 0.4s, height 0.4s, border-color 0.4s",
      }} />
    </>
  );
}
