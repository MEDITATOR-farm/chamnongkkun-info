"use client";

import poemData from "@/content/daily-poem.json";

export default function DailyPoem() {
  if (!poemData || !poemData.content) return null;

  return (
    <section className="relative max-w-4xl mx-auto my-16 px-4">
      {/* 종이 질감 배경 카드 */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[#fdfaf5] p-12 shadow-xl border border-amber-100/50 group">
        {/* 장식용 따옴표 */}
        <div className="absolute top-8 left-8 text-amber-200/50 text-8xl font-serif select-none pointer-events-none">
          &ldquo;
        </div>
        <div className="absolute bottom-4 right-12 text-amber-200/50 text-8xl font-serif select-none pointer-events-none translate-y-8">
          &rdquo;
        </div>

        {/* 배경 수채화 느낌 장식 */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-40" />

        <div className="relative space-y-8 text-center">
          <div className="space-y-2">
            <span className="text-amber-600/70 text-sm font-bold tracking-[0.2em] uppercase">Today&apos;s Reading</span>
            <div className="h-px w-12 bg-amber-200 mx-auto" />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-400 font-serif tracking-tight italic">
              {poemData.title}
            </h2>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-neutral-800 leading-[1.8] font-serif font-medium whitespace-pre-wrap py-4">
              {poemData.content}
            </p>
          </div>

          <div className="pt-8 space-y-1">
            <p className="text-lg font-bold text-neutral-700 font-serif">
              — {poemData.author}
            </p>
            <p className="text-sm text-neutral-400 font-serif">
              {poemData.source}
            </p>
          </div>
        </div>

        {/* 하단 날짜 표시 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-neutral-300 font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Updated at {poemData.date}
        </div>
      </div>

      <style jsx>{`
        section {
          font-family: var(--font-nanum-myeongjo), serif;
        }
      `}</style>
    </section>
  );
}
