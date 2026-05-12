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
              <h3 className="text-3xl font-serif font-bold text-foreground mb-8 leading-tight group-hover:text-primary transition-colors">
                {poem.title}
              </h3>
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

      {/* 모달 UI */}
      {isOpen && poem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90 backdrop-blur-xl p-4 animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-background rounded-[40px] overflow-hidden shadow-2xl flex flex-col border border-primary/5"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <button 
              className="absolute top-8 right-8 text-foreground/20 hover:text-primary text-3xl z-[110] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            
            <div className="p-12 sm:p-20 overflow-y-auto w-full">
              <div className="text-center mb-16">
                <span className="text-[10px] font-black text-secondary tracking-[0.4em] uppercase mb-4 block">DAILY INSIGHT</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                  {poem.title}
                </h2>
                <div className="w-12 h-1 bg-secondary mx-auto mt-8"></div>
              </div>
              
              <div className="space-y-8 px-4">
                {(poem.content || "").split("\n").map((line: string, idx: number) => (
                  <p key={idx} className="text-foreground/70 font-serif leading-loose text-xl text-center break-words min-h-[1.5rem]">
                    {line}
                  </p>
                ))}
              </div>
              
              <div className="mt-20 text-center border-t border-primary/5 pt-12">
                <p className="text-foreground font-serif font-bold text-2xl">— {poem.author || "거제의 시인"}</p>
                {poem.date && <p className="text-foreground/30 text-xs mt-4 tracking-widest">{poem.date}</p>}
              </div>

              <div className="mt-16 flex justify-center">
                <Link 
                  href="/poems" 
                  className="px-10 py-4 bg-primary text-white rounded-full text-sm font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                >
                  과거의 시 더 읽어보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
