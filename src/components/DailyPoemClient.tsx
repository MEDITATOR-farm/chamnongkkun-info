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
        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-md transition-all hover:border-orange-200"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute top-0 left-0 w-0.5 h-full bg-orange-200/50" />
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Today's Poem</span>
            <div className="text-orange-200 group-hover:text-orange-400 transition-colors bg-orange-50 p-1.5 rounded-full">
              {/* 확대(돋보기) 아이콘 */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          {poem ? (
            <div className="flex-grow flex flex-col justify-center">
              <h3 className="text-lg font-serif font-bold text-slate-800 mb-3 leading-tight group-hover:text-orange-600 transition-colors">
                {poem.title}
              </h3>
              {(poem.type === "image" || poem.imageUrl) ? (
                <div className="w-full mb-3 flex justify-center">
                  <img src={poem.imageUrl} alt={poem.title} className="w-full h-auto object-contain max-h-[400px] rounded-lg" loading="lazy" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(poem.content || "").split("\n").slice(0, 3).map((line: string, idx: number) => (
                    <p key={idx} className="text-slate-500 font-serif leading-relaxed text-sm italic">
                      {line}
                    </p>
                  ))}
                  {(poem.content || "").split("\n").length > 3 && (
                    <p className="text-slate-300 text-[10px] font-serif tracking-widest mt-2">. . .</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 font-serif italic text-sm">소중한 시가 준비 중입니다.</p>
          )}
          
          <div className="mt-8 flex justify-between items-end border-t border-slate-50 pt-4">
            <span className="text-[10px] text-slate-400 font-medium">— {poem?.author || "거제의 시인"}</span>
            <span className="text-orange-400 text-[10px] font-bold group-hover:text-orange-600 transition-colors">
              클릭해서 크게 보기 👆
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
