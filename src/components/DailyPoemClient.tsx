"use client";

import { useState } from "react";

export default function DailyPoemClient({ poems }: { poems: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!poems || poems.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-foreground/30 font-serif italic text-lg">소중한 시가 준비 중입니다.</p>
      </div>
    );
  }

  const poem = poems[currentIndex];
  const opacity = poem.opacity ?? 35;
  const hasBg = !!(poem.imageUrl && !poem.imageUrl.startsWith("data:"));

  return (
    <div className="flex flex-col gap-0">

      {/* ── 시 카드 (배경 이미지 + 텍스트 오버레이) ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: "20px",
          minHeight: 320,
          background: hasBg ? undefined : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        {/* 배경 이미지 */}
        {hasBg && (
          <img
            src={poem.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: "block" }}
          />
        )}

        {/* 어둡기 오버레이 */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${opacity / 100})` }}
        />

        {/* 날짜 + 출처 */}
        <div className="absolute top-4 left-4 text-[10px] text-white/40 font-bold tracking-widest">
          {poem.date}
        </div>
        <div className="absolute top-4 right-4 text-[10px] text-white/40 font-bold tracking-widest">
          출처 : {poem.author || "거제의 시인"}
        </div>

        {/* 시 본문 */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 py-16 text-center text-white min-h-[320px]">
          {poem.title && (
            <p className="text-[11px] font-bold tracking-[0.4em] uppercase text-white/40 mb-6">
              POETRY OF THE DAY
            </p>
          )}
          <div className="space-y-3">
            {(poem.content || "").split("\n").map((line: string, idx: number) => (
              <p
                key={idx}
                className="font-serif text-xl md:text-2xl font-bold leading-relaxed drop-shadow-xl"
                style={{ minHeight: "1.5rem" }}
              >
                {line || "\u00A0"}
              </p>
            ))}
          </div>
        </div>

        {/* 워터마크 */}
        <div className="absolute bottom-4 right-4 text-[9px] text-white/20 font-bold tracking-[0.3em] uppercase">
          Design by AI & 瞑想家
        </div>
      </div>

      {/* ── 이전 / 다음 네비게이션 ── */}
      <div className="flex items-center gap-3 mt-4 px-1">
        <button
          onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            currentIndex === 0
              ? "bg-foreground/5 text-foreground/15 cursor-not-allowed"
              : "bg-primary/8 text-primary hover:bg-primary/15 active:scale-95"
          }`}
        >
          ◀ 이전 시
        </button>

        <span className="text-[11px] font-bold text-foreground/20 whitespace-nowrap">
          {currentIndex + 1} / {poems.length}
        </span>

        <button
          onClick={() => currentIndex < poems.length - 1 && setCurrentIndex(currentIndex + 1)}
          disabled={currentIndex === poems.length - 1}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            currentIndex === poems.length - 1
              ? "bg-foreground/5 text-foreground/15 cursor-not-allowed"
              : "bg-primary/8 text-primary hover:bg-primary/15 active:scale-95"
          }`}
        >
          다음 시 ▶
        </button>
      </div>

    </div>
  );
}
