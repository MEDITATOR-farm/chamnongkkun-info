"use client";

import { useState } from "react";
import Link from "next/link";

export default function DailyPoemClient({ poem }: { poem: any }) {
  // 모달 창이 열려있는지 여부를 기억하는 기억장치입니다.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 
        1. 메인 화면에 보이는 작은 카드 부분입니다.
        클릭할 수 있도록 cursor-pointer 속성을 추가했습니다. 
      */}
      <div 
        className="glass group p-6 sm:p-8 rounded-[36px] flex flex-col relative overflow-hidden transition-all hover:shadow-2xl border-white/40 cursor-pointer min-h-[220px] justify-center bg-white/40"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-300 to-amber-500 opacity-60" />
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              DAILY POETRY
            </span>
            <div className="text-orange-400 group-hover:scale-110 transition-transform bg-white/60 p-2 rounded-2xl shadow-sm border border-white/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h6v6M10 14L21 3M18 21H6a3 3 0 01-3-3V6a3 3 0 013-3h3" />
              </svg>
            </div>
          </div>
          
          {poem ? (
            <div className="flex-grow">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-5 font-serif leading-tight group-hover:text-orange-600 transition-colors tracking-tight">
                {poem.title}
              </h3>
              {(poem.type === "image" || poem.imageUrl) ? (
                <div className="w-full mb-4 overflow-hidden rounded-2xl shadow-sm border border-white/40">
                  <img src={poem.imageUrl} alt={poem.title} className="w-full h-32 object-cover scale-105 group-hover:scale-110 transition-transform" loading="lazy" />
                </div>
              ) : (
                <div className="space-y-3 opacity-80">
                  {(poem.content || "").split("\n").slice(0, 3).map((line: string, idx: number) => (
                    <p key={idx} className="text-slate-600 font-serif leading-relaxed text-sm md:text-base italic">
                      {line}
                    </p>
                  ))}
                  {(poem.content || "").split("\n").length > 3 && (
                    <p className="text-slate-300 text-xs tracking-[0.5em] mt-3 font-serif">. . .</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 font-serif italic text-base">소중한 시가 준비 중입니다.</p>
          )}
          
          <div className="mt-8 flex justify-between items-end border-t border-white/20 pt-5">
            <span className="text-[11px] text-slate-500 font-black tracking-widest">— {poem?.author || "거제의 시인"}</span>
            <span className="text-orange-500 text-[10px] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
              READ FULL STORY <span className="text-base text-orange-400/50">→</span>
            </span>
          </div>
        </div>
      </div>

      {/* 
        2. 화면에 크게 띄워지는 팝업(모달) 창입니다.
        isOpen이 true일 때만 나타납니다.
      */}
      {isOpen && poem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)} // 검은 바탕을 누르면 창이 닫힙니다.
        >
          <div 
            className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-orange-100"
            onClick={(e) => e.stopPropagation()} // 하얀 창을 눌렀을 때는 안 닫히게 막아줍니다.
            style={{ maxHeight: '90vh' }}
          >
            {/* 닫기 버튼 */}
            <button 
              className="absolute top-4 right-4 text-slate-400 hover:text-orange-500 text-3xl z-[110] transition-colors bg-white/80 rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            
            <div className="p-6 sm:p-10 overflow-y-auto w-full">
              {/* 시 제목 */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-8 text-center border-b-2 border-orange-100 pb-6 w-full relative">
                {poem.title}
                <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-12 h-0.5 bg-orange-400"></div>
              </h2>
              
              {/* 시 내용 또는 이미지 */}
              {(poem.type === "image" || poem.imageUrl) ? (
                <div className="w-full flex justify-center mb-8">
                  <img src={poem.imageUrl} alt={poem.title} className="max-w-full h-auto rounded-xl shadow-md border border-slate-100" />
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 px-2 sm:px-8 py-6">
                  {(poem.content || "").split("\n").map((line: string, idx: number) => (
                    <p key={idx} className="text-slate-700 font-serif leading-loose text-base sm:text-lg text-center break-words min-h-[1.5rem]">
                      {line}
                    </p>
                  ))}
                </div>
              )}
              
              {/* 지은이 표시 */}
              <div className="mt-10 text-right px-4">
                <p className="text-slate-600 font-serif font-bold text-lg">— {poem.author || "거제의 시인"}</p>
                {poem.date && <p className="text-slate-400 text-sm mt-2">{poem.date}</p>}
              </div>

              {/* 다른 시 보러가기 버튼 */}
              <div className="mt-12 flex justify-center pb-2">
                <Link 
                  href="/poems" 
                  className="px-8 py-3 bg-orange-50 text-orange-600 border border-orange-200 rounded-full text-sm font-bold hover:bg-orange-500 hover:text-white transition-colors"
                >
                  과거의 시 더 읽어보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
