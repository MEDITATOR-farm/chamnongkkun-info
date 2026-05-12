"use client";

import { useState } from "react";
import Link from "next/link";

export default function FarmGallery({ diaries }: { diaries: any[] }) {
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  if (!diaries || diaries.length === 0) return null;

  return (
    <div className="relative">
      {/* 중앙 수직선 */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2"></div>
      
      <div className="space-y-24">
        {diaries.map((diary: any, index: number) => (
          <div key={index} className={`relative flex flex-col md:flex-row items-center gap-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* 중앙 포인트 (동그라미) */}
            <div className="absolute left-4 md:left-1/2 top-0 w-8 h-8 rounded-full bg-background border-4 border-primary -translate-x-1/2 z-10 hidden md:block"></div>
            
            {/* 콘텐츠 박스 */}
            <div className={`w-full md:w-[calc(50%-48px)] reveal-up ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'} ml-12 md:ml-0`}>
              <div className="mb-4">
                <span className="text-secondary font-black tracking-widest text-xs">{diary.date}</span>
                <h3 className="text-2xl font-serif font-bold text-foreground mt-1">{diary.title}</h3>
              </div>
              
              <div 
                className="group relative rounded-[24px] overflow-hidden shadow-xl shadow-primary/5 cursor-pointer border border-primary/5 bg-white"
                onClick={() => {
                  setSelectedDiary(diary);
                  setCurrentImgIdx(0);
                }}
              >
                {diary.image ? (
                  <img 
                    src={diary.image} 
                    alt={diary.title} 
                    className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full aspect-[4/3] bg-primary/5 flex items-center justify-center text-4xl">🌱</div>
                )}
                
                {diary.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center pl-1 backdrop-blur-md shadow-2xl">
                      <span className="text-primary text-2xl">▶</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm font-bold">자세히 보기 →</p>
                </div>
              </div>

              <p className="mt-6 text-foreground/60 leading-relaxed line-clamp-3 font-medium">
                {diary.content}
              </p>
            </div>
            
            {/* 반대편 비어있는 공간용 (모바일에서는 숨김) */}
            <div className="hidden md:block w-[calc(50%-48px)]"></div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center">
        <Link 
          href="/admin#diary" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background border-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5"
        >
          + 현장 소식 더 기록하기
        </Link>
      </div>

      {/* 모달 (기존 로직 유지하되 스타일 고도화) */}
      {selectedDiary && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 backdrop-blur-md p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedDiary(null)}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-16 right-0 text-white/50 hover:text-white text-4xl z-[110] transition-colors"
              onClick={() => setSelectedDiary(null)}
            >
              ✕
            </button>
            
            <div className="w-full overflow-hidden rounded-3xl shadow-2xl bg-black flex items-center justify-center relative border border-white/10" style={{ maxHeight: '75vh', aspectRatio: selectedDiary.video ? 'auto' : '16/10' }}>
              {selectedDiary.video ? (
                <video src={selectedDiary.video} controls autoPlay className="max-w-full max-h-[75vh] object-contain" />
              ) : (
                <>
                  <div className="flex h-full w-full transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}>
                    {(selectedDiary.images && selectedDiary.images.length > 0 
                      ? selectedDiary.images 
                      : (selectedDiary.image ? [selectedDiary.image] : [])
                    ).filter(Boolean).map((img: string, idx: number) => (
                      <div key={idx} className="min-w-full h-full flex items-center justify-center">
                        <img src={img} alt={selectedDiary.title} className="max-w-full max-h-[75vh] object-contain" />
                      </div>
                    ))}
                  </div>

                  {selectedDiary.images && selectedDiary.images.length > 1 && (
                    <>
                      <button 
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-3xl flex items-center justify-center backdrop-blur-md transition-all"
                        onClick={() => setCurrentImgIdx(prev => (prev > 0 ? prev - 1 : selectedDiary.images.length - 1))}
                      >
                        ‹
                      </button>
                      <button 
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-3xl flex items-center justify-center backdrop-blur-md transition-all"
                        onClick={() => setCurrentImgIdx(prev => (prev < selectedDiary.images.length - 1 ? prev + 1 : 0))}
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-8 text-center max-w-2xl px-4">
              <span className="text-secondary font-black tracking-widest text-xs uppercase">{selectedDiary.date}</span>
              <h4 className="text-white text-2xl font-serif font-bold mt-2 mb-4">{selectedDiary.title}</h4>
              <p className="text-white/60 text-sm leading-relaxed">{selectedDiary.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
