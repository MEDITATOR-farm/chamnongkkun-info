"use client";

import { useState } from "react";
import Link from "next/link";

export default function FarmGallery({ diaries }: { diaries: any[] }) {
  // 모달에 띄울 사진이나 비디오 데이터를 보관하는 공간입니다.
  // 모달에 띄울 사진이나 비디오 데이터를 보관하는 공간입니다.
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  if (!diaries || diaries.length === 0) return null;

  return (
    <section className="mb-20 relative z-10">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xl">🎬</span>
        <h2 className="text-lg font-bold text-slate-800">농장 최근 현장</h2>
      </div>
      
      {/* 갤러리 그리드 부분 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {diaries.map((diary: any, index: number) => (
          <div 
            key={index} 
            className="rounded-2xl overflow-hidden border border-slate-100 shadow-md bg-black/5 aspect-video relative group cursor-pointer"
            onClick={() => {
              setSelectedDiary(diary);
              setCurrentImgIdx(0);
            }}
          >
            {diary.video ? (
              // 동영상일 때는 썸네일(사진)을 깔고 재생 버튼 모양을 예쁘게 올립니다.
              <img 
                src={diary.image || ""} 
                alt="Farm Recent View" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              // 사진일 때는 그대로 보여줍니다.
              <img 
                src={diary.image} 
                alt="Farm Recent View" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            )}
            
            {/* 영상 재생 중임을 알리는 플레이버튼 아이콘 (영상인 경우만) */}
            {diary.video && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center pl-1 backdrop-blur-md shadow-lg">
                  <span className="text-teal-600 text-xl">▶</span>
                </div>
              </div>
            )}

            {/* 다중 이미지 뱃지 (사진이 여러 장인 경우만) */}
            {!diary.video && diary.images && diary.images.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                <span>📂</span>
                {diary.images.length}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-bold line-clamp-1 drop-shadow-md">{diary.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-right">
        <Link href="/upload-diary" className="text-[12px] font-bold text-teal-500 hover:text-teal-700 transition-colors">
          + 현장 소식 올리기
        </Link>
      </div>

      {/* ==============================================
          여기가 사진을 눌렀을 때 나타나는 팝업(모달) 창입니다! 
          ============================================== */}
      {selectedDiary && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDiary(null)} /* 검은 배경 누르면 닫힘 */
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} /* 사진 자체를 누르면 안 닫힘 */
          >
            {/* 창 닫기 버튼 */}
            <button 
              className="absolute -top-14 right-2 text-white/70 hover:text-white text-5xl z-[110] transition-colors"
              onClick={() => setSelectedDiary(null)}
              title="닫기"
            >
              &times;
            </button>
            
            <div className="w-full overflow-hidden rounded-xl shadow-2xl bg-black flex items-center justify-center relative" style={{ maxHeight: '80vh', aspectRatio: selectedDiary.video ? 'auto' : '4/3' }}>
              {selectedDiary.video ? (
                <video 
                  src={selectedDiary.video} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-[80vh] object-contain" 
                />
              ) : (
                <>
                  {/* 이미지 슬라이드 부분 */}
                  <div className="flex h-full w-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}>
                    {(selectedDiary.images && selectedDiary.images.length > 0 ? selectedDiary.images : [selectedDiary.image]).map((img: string, idx: number) => (
                      <div key={idx} className="min-w-full h-full flex items-center justify-center">
                        <img 
                          src={img} 
                          alt={`${selectedDiary.title} - ${idx + 1}`} 
                          className="max-w-full max-h-[80vh] object-contain" 
                        />
                      </div>
                    ))}
                  </div>

                  {/* 좌우 네비게이션 버튼 (2장 이상일 때만) */}
                  {selectedDiary.images && selectedDiary.images.length > 1 && (
                    <>
                      <button 
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-2xl flex items-center justify-center backdrop-blur-md transition-all"
                        onClick={() => setCurrentImgIdx(prev => (prev > 0 ? prev - 1 : selectedDiary.images.length - 1))}
                      >
                        ‹
                      </button>
                      <button 
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-2xl flex items-center justify-center backdrop-blur-md transition-all"
                        onClick={() => setCurrentImgIdx(prev => (prev < selectedDiary.images.length - 1 ? prev + 1 : 0))}
                      >
                        ›
                      </button>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md font-bold">
                        {currentImgIdx + 1} / {selectedDiary.images.length}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* 사진 하단 제목 영역 */}
            <p className="text-white/90 text-lg mt-5 font-bold text-center tracking-wide">
              {selectedDiary.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
