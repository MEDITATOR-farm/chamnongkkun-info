"use client";

import { useState } from "react";
import Link from "next/link";

export default function FarmGallery({ diaries }: { diaries: any[] }) {
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  if (!diaries || diaries.length === 0) return null;

  // 날짜별로 그룹화 (연-월 기준)
  const groupedDiaries: { [key: string]: any[] } = {};
  diaries.forEach(diary => {
    const date = new Date(diary.date);
    const key = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    if (!groupedDiaries[key]) groupedDiaries[key] = [];
    groupedDiaries[key].push(diary);
  });

  const monthKeys = Object.keys(groupedDiaries);

  return (
    <div className="relative">
      {/* 중앙 수직선 - 더 선명하고 그라데이션 효과 */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent -translate-x-1/2"></div>
      
      <div className="space-y-32">
        {monthKeys.map((monthKey) => (
          <div key={monthKey} className="relative">
            {/* 월별 타이틀 배지 */}
            <div className="sticky top-24 z-20 mb-16 flex justify-start md:justify-center">
              <div className="bg-primary text-white px-6 py-2 rounded-full font-serif font-bold shadow-xl shadow-primary/20 flex items-center gap-2 transform -translate-x-2 md:translate-x-0">
                <span className="text-lg">🗓️</span>
                {monthKey}
              </div>
            </div>

            <div className="space-y-24">
              {groupedDiaries[monthKey].map((diary, index) => {
                // 전체 인덱스 계산 (지그재그를 위해)
                const globalIndex = diaries.indexOf(diary);
                const isRight = globalIndex % 2 === 1;

                return (
                  <div key={diary.id || index} className={`relative flex flex-col md:flex-row items-center gap-12 ${isRight ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* 중앙 포인트 (동그라미) - 호버 효과 추가 */}
                    <div className="absolute left-4 md:left-1/2 top-0 w-6 h-6 rounded-full bg-white border-4 border-secondary -translate-x-1/2 z-10 hidden md:block shadow-sm"></div>
                    
                    {/* 콘텐츠 박스 */}
                    <div className={`w-full md:w-[calc(50%-48px)] reveal-up ${isRight ? 'md:text-right' : 'md:text-left'} ml-12 md:ml-0`}>
                      <div className="mb-6">
                        <div className={`flex items-center gap-2 mb-1 ${isRight ? 'md:justify-end' : ''}`}>
                          <span className="w-8 h-[2px] bg-secondary/30"></span>
                          <span className="text-secondary font-black tracking-widest text-[10px] uppercase">RECORD No.{diaries.length - globalIndex}</span>
                        </div>
                        <span className="text-foreground/40 font-bold text-xs">{diary.date}</span>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mt-2 leading-tight">{diary.title}</h3>
                      </div>
                      
                      <div 
                        className="group relative rounded-[32px] overflow-hidden shadow-2xl shadow-primary/5 cursor-pointer border border-primary/5 bg-white transition-all duration-500 hover:-translate-y-2"
                        onClick={() => {
                          setSelectedDiary(diary);
                          setCurrentImgIdx(0);
                        }}
                      >
                        {diary.image ? (
                          <img 
                            src={diary.image} 
                            alt={diary.title} 
                            className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full aspect-[4/3] bg-primary/5 flex items-center justify-center text-4xl">🌱</div>
                        )}
                        
                        {diary.video && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all duration-500">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center pl-1 backdrop-blur-md shadow-2xl transform transition-transform group-hover:scale-110">
                              <span className="text-primary text-2xl">▶</span>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            기록 자세히 보기
                          </span>
                        </div>
                      </div>

                      <p className="mt-8 text-foreground/50 leading-relaxed line-clamp-3 font-medium text-sm md:text-base">
                        {diary.content}
                      </p>
                    </div>
                    
                    <div className="hidden md:block w-[calc(50%-48px)]"></div>
                  </div>
                );
              })}
            </div>
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

      {/* 모달 - 모바일 최적화 (사진이 화면 꽉 참, 하단 정보 영역) */}
      {selectedDiary && (
        <div 
          className="fixed inset-0 z-[100] bg-black flex flex-col"
          onClick={() => setSelectedDiary(null)}
        >
          {/* 닫기 버튼 - 우상단 고정 */}
          <button 
            className="absolute top-4 right-4 z-[120] w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/70 hover:text-white flex items-center justify-center text-lg transition-all"
            onClick={() => setSelectedDiary(null)}
          >
            ✕
          </button>

          {/* 사진/영상 영역 - 모바일 화면 꽉 채우기 */}
          <div 
            className="flex-1 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedDiary.video ? (
              <video 
                src={selectedDiary.video} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full object-contain bg-black" 
              />
            ) : (
              <div className="relative w-full h-full">
                {/* 슬라이드 이미지 */}
                <div 
                  className="flex h-full transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}
                >
                  {(selectedDiary.images && selectedDiary.images.length > 0 
                    ? selectedDiary.images 
                    : (selectedDiary.image ? [selectedDiary.image] : [])
                  ).filter(Boolean).map((img: string, idx: number) => (
                    <div key={idx} className="min-w-full h-full flex items-center justify-center bg-black">
                      <img 
                        src={img} 
                        alt={selectedDiary.title} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* 좌우 버튼 - 사진 여러 장일 때 */}
                {selectedDiary.images && selectedDiary.images.length > 1 && (
                  <>
                    <button 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xl flex items-center justify-center"
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => prev > 0 ? prev - 1 : selectedDiary.images.length - 1); }}
                    >‹</button>
                    <button 
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xl flex items-center justify-center"
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => prev < selectedDiary.images.length - 1 ? prev + 1 : 0); }}
                    >›</button>
                    {/* 페이지 표시 점 */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {selectedDiary.images.map((_: any, i: number) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImgIdx ? 'bg-white w-4' : 'bg-white/30'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 하단 정보 영역 */}
          <div 
            className="bg-black/90 backdrop-blur-xl px-6 pt-5 pb-8 border-t border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-secondary font-black tracking-widest text-[10px] uppercase block mb-1">{selectedDiary.date}</span>
            <h4 className="text-white text-lg font-serif font-bold mb-2 leading-snug">{selectedDiary.title}</h4>
            {selectedDiary.content && (
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{selectedDiary.content}</p>
            )}
        </div>
      )}
    </div>
  );
}
