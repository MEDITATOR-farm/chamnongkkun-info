"use client";

import { useState } from "react";
import Link from "next/link";

export default function DailyPoemClient({ poems }: { poems: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const poem = poems && poems.length > 0 ? poems[currentIndex] : null;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < poems.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <>
      {/* 메인 카드 UI */}
      <div 
        className="group p-8 flex flex-col relative transition-all cursor-pointer h-full justify-between"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] text-primary/40 font-black uppercase tracking-[0.3em]">
              POETRY OF THE DAY
            </span>
            <div className="flex gap-4 items-center px-2">
              <button 
                onClick={goPrev} 
                disabled={currentIndex === 0}
                className={`text-xs font-serif font-bold transition-all ${currentIndex === 0 ? 'text-foreground/10 cursor-not-allowed' : 'text-primary hover:text-secondary'}`}
              >
                ◀ 前
              </button>
              <span className="text-[10px] text-foreground/20 font-bold">{currentIndex + 1} / {poems.length}</span>
              <button 
                onClick={goNext} 
                disabled={!poems || currentIndex === poems.length - 1}
                className={`text-xs font-serif font-bold transition-all ${(!poems || currentIndex === poems.length - 1) ? 'text-foreground/10 cursor-not-allowed' : 'text-primary hover:text-secondary'}`}
              >
                後 ▶
              </button>
            </div>
          </div>
          
          {poem ? (
            <div className="flex-grow flex flex-col justify-center">
              {poem.title && (
                <h3 className="text-3xl font-serif font-bold text-foreground mb-8 leading-tight group-hover:text-primary transition-colors">
                  {poem.title}
                </h3>
              )}
              <div className="space-y-4">
                {(poem.content || "").split("\n").slice(0, 4).map((line: string, idx: number) => (
                  <p key={idx} className="text-foreground/60 font-serif leading-relaxed text-lg italic">
                    {line}
                  </p>
                ))}
                {(poem.content || "").split("\n").length > 4 && (
                  <p className="text-primary/30 text-xs tracking-[0.5em] mt-4">. . .</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-foreground/30 font-serif italic text-lg text-center py-20">소중한 시가 준비 중입니다.</p>
          )}
          
          <div className="mt-10 pt-6 border-t border-primary/5 flex justify-between items-center">
            <span className="text-sm font-serif font-bold text-primary/60">— {poem?.author || "거제의 시인"}</span>
            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">READ MORE →</span>
          </div>
        </div>
      </div>

      {/* 모달 UI (걷는 독서 디자인 적용) */}
      {isOpen && poem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 backdrop-blur-xl p-4 animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl aspect-square bg-background rounded-[48px] overflow-hidden shadow-2xl flex flex-col border-8 border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white text-3xl z-[120] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* 배경 이미지 및 오버레이 */}
            {poem.imageUrl ? (
              <>
                <img src={poem.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Poem Background" />
                <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${(poem.opacity || 35) / 100})` }}></div>
              </>
            ) : (
              <div className="absolute inset-0 bg-primary/5"></div>
            )}
            
            {/* 시 내용 (걷는 독서 스타일) */}
            <div className="relative z-10 p-12 md:p-20 h-full flex flex-col justify-center text-center text-white">
              <div className="absolute top-12 left-12 text-[10px] opacity-40 font-bold tracking-widest">{poem.date}</div>
              <div className="absolute top-12 right-12 text-[10px] opacity-40 font-bold tracking-widest">출처 : {poem.author}</div>
              
              <div className="space-y-8">
                {(poem.content || "").split("\n").map((line: string, idx: number) => (
                  <p key={idx} className="text-2xl md:text-4xl font-serif font-bold leading-relaxed drop-shadow-2xl animate-revealUp">
                    {line}
                  </p>
                ))}
              </div>

              <div className="absolute bottom-12 right-12 text-[10px] opacity-40 font-bold tracking-[0.3em] uppercase">Design by Chamnongkkun</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
