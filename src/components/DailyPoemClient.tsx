"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DailyPoemClient({ poems }: { poems: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const poem = poems && poems.length > 0 ? poems[currentIndex] : null;

  return (
    <>
      {/* 메인 카드 UI */}
      <div className="p-6 md:p-8 flex flex-col h-full justify-between">
        <div className="flex flex-col h-full">

          {/* 상단: 타이틀 + 넘기기 버튼 */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] text-primary/40 font-black uppercase tracking-[0.3em]">
              POETRY OF THE DAY
            </span>
            <span className="text-[10px] text-foreground/20 font-bold">{currentIndex + 1} / {poems.length}</span>
          </div>
          
          {poem ? (
            <div className="flex-grow flex flex-col justify-center">
              {poem.title && (
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6 leading-tight">
                  {poem.title}
                </h3>
              )}
              <div className="space-y-3">
                {(poem.content || "").split("\n").slice(0, 6).map((line: string, idx: number) => (
                  <p key={idx} className="text-foreground/60 font-serif leading-relaxed text-base md:text-lg italic">
                    {line}
                  </p>
                ))}
                {(poem.content || "").split("\n").length > 6 && (
                  <p className="text-primary/30 text-xs tracking-[0.5em] mt-2">. . .</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-foreground/30 font-serif italic text-lg text-center py-20">소중한 시가 준비 중입니다.</p>
          )}
          
          {/* 하단: 작가 + 넘기기 버튼 (큰 터치 영역) */}
          <div className="mt-8 pt-5 border-t border-primary/5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-serif font-bold text-primary/60">— {poem?.author || "거제의 시인"}</span>
              <button
                className="text-[10px] font-bold text-secondary tracking-widest uppercase px-3 py-1 rounded-full border border-secondary/20 hover:bg-secondary/10 transition-all"
                onClick={() => setIsOpen(true)}
              >
                전문 보기 →
              </button>
            </div>

            {/* 이전/다음 버튼 (모바일 터치 쉽도록 크게) */}
            <div className="flex gap-2">
              <button 
                onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${currentIndex === 0 ? 'bg-foreground/3 text-foreground/10 cursor-not-allowed' : 'bg-primary/5 text-primary hover:bg-primary/10 active:scale-95'}`}
              >
                ◀ 이전 시
              </button>
              <button 
                onClick={() => currentIndex < poems.length - 1 && setCurrentIndex(currentIndex + 1)}
                disabled={!poems || currentIndex === poems.length - 1}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${(!poems || currentIndex === poems.length - 1) ? 'bg-foreground/3 text-foreground/10 cursor-not-allowed' : 'bg-primary/5 text-primary hover:bg-primary/10 active:scale-95'}`}
              >
                다음 시 ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 전문 보기 모달 - Portal로 body에 직접 렌더링 */}
      {isOpen && poem && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-background rounded-[32px] overflow-hidden shadow-2xl border border-primary/5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 text-foreground/20 hover:text-foreground text-2xl z-[110] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            
            <div className="p-10 md:p-16">
              <span className="text-[10px] font-black text-secondary tracking-[0.3em] uppercase block mb-6">POETRY</span>
              {poem.title && (
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-10 leading-tight">
                  {poem.title}
                </h2>
              )}
              
              {/* 배경 이미지가 있는 시 */}
              {poem.imageUrl && (
                <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ minHeight: 240 }}>
                  <img src={poem.imageUrl} alt={poem.title} className="w-full h-full object-cover" style={{ maxHeight: 400 }} />
                  <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(poem.opacity ?? 35) / 100})` }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                    {(poem.content || "").split("\n").map((line: string, idx: number) => (
                      <p key={idx} className="font-serif leading-loose text-lg md:text-xl font-bold drop-shadow-lg">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* 이미지 없는 텍스트 시 */}
              {!poem.imageUrl && (
                <div className="space-y-6">
                  {(poem.content || "").split("\n").map((line: string, idx: number) => (
                    <p key={idx} className="text-foreground/70 font-serif leading-loose text-lg min-h-[1rem]">
                      {line}
                    </p>
                  ))}
                </div>
              )}
              
              <div className="mt-16 pt-8 border-t border-primary/5">
                <p className="text-foreground/80 font-serif font-bold text-xl">— {poem.author || "거제의 시인"}</p>
                {poem.date && <p className="text-foreground/30 text-xs mt-2 tracking-widest">{poem.date}</p>}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
