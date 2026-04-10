"use client";

import { useState } from "react";
import Link from "next/link";

export default function DailyPoemClient({ poems }: { poems: any[] }) {
  // 현재 어떤 시를 보고 있는지 번호(인덱스)를 기억합니다. 0번이 최신입니다.
  const [currentIndex, setCurrentIndex] = useState(0);
  // 모달 창이 열려있는지 여부를 기억합니다.
  const [isOpen, setIsOpen] = useState(false);

  // 현재 인덱스에 해당하는 시 데이터를 가져옵니다.
  const poem = poems && poems.length > 0 ? poems[currentIndex] : null;

  // 이전(앞선) 작품으로 가기
  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭(모달 열기) 방지
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 다음(뒤의) 작품으로 가기
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭(모달 열기) 방지
    if (currentIndex < poems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <>
      {/* 
        1. 메인 화면에 보이는 작은 카드 부분입니다.
        클릭할 수 있도록 cursor-pointer 속성을 추가했습니다. 
      */}
      <div 
        className="group p-4 sm:p-6 flex flex-col relative transition-all cursor-pointer h-auto justify-start bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        
        <div className="flex flex-col h-full relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              나의 시
            </span>
          </div>
          
          {poem ? (
            <div className="flex-grow">
              <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-5 font-serif leading-tight group-hover:text-orange-600 transition-colors tracking-tight">
                {poem.title}
              </h3>
              {(poem.type === "image" || poem.imageUrl) ? (
                <div className="w-full mb-6 overflow-hidden rounded-xl">
                  <img src={poem.imageUrl} alt={poem.title} className="w-full h-auto transition-transform" loading="lazy" />
                </div>
              ) : (
                <div className="space-y-2 opacity-90">
                  {/* 시 본문을 5줄 정도로 좀 더 넉넉하게 보여줍니다. */}
                  {(poem.content || "").split("\n").slice(0, 5).map((line: string, idx: number) => (
                    <p key={idx} className="text-slate-600 font-serif leading-relaxed text-base italic">
                      {line}
                    </p>
                  ))}
                  {(poem.content || "").split("\n").length > 5 && (
                    <p className="text-slate-300 text-[8px] tracking-[0.3em] mt-2 font-serif">. . .</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 font-serif italic text-base">소중한 시가 준비 중입니다.</p>
          )}
          
          <div className="mt-4 flex justify-between items-end pt-3 border-t border-slate-100/50">
            <span className="text-[10px] text-slate-400 font-medium">— {poem?.author || "거제의 시인"}</span>
            <div className="flex gap-6 items-center px-2 translate-no" translate="no">
              <button 
                onClick={goPrev} 
                disabled={currentIndex === 0}
                className={`text-sm font-serif font-black transition-all flex items-center gap-1.5 ${currentIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-orange-600 hover:text-orange-800 hover:underline active:scale-95'}`}
                title="이전 작품 (前詩)"
              >
                <span className="text-xs">◀</span> 前詩
              </button>
              <span className="w-[1px] h-4 bg-slate-200"></span>
              <button 
                onClick={goNext} 
                disabled={!poems || currentIndex === poems.length - 1}
                className={`text-sm font-serif font-black transition-all flex items-center gap-1.5 ${(!poems || currentIndex === poems.length - 1) ? 'text-slate-200 cursor-not-allowed' : 'text-orange-600 hover:text-orange-800 hover:underline active:scale-95'}`}
                title="다음 작품 (後時)"
              >
                後時 <span className="text-xs">▶</span>
              </button>
            </div>
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

              {/* 다운로드 버튼 섹션 */}
              <div className="mt-8 flex flex-col items-center gap-4">
                {poem.imageUrl ? (
                  <a 
                    href={poem.imageUrl} 
                    download={`${poem.title}_${poem.author}.png`}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-full text-[13px] font-bold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100 transition-all active:scale-95"
                  >
                    <span>💾</span>
                    이미지로 소장하기
                  </a>
                ) : (
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([`${poem.title}\n\n${poem.content}\n\n— ${poem.author}`], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = `${poem.title}_${poem.author}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-slate-400 border border-slate-100 rounded-full text-[13px] font-bold hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200 transition-all active:scale-95"
                  >
                    <span>📝</span>
                    시 구절 저장하기 (.txt)
                  </button>
                )}
                <p className="text-[10px] text-slate-300 font-medium">따뜻한 감동을 개인 소장용으로 간직해보세요. ✨</p>
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
