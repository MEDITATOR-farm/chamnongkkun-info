"use client";

import React from "react";

export default function DailyPhotoClient({ photos }: { photos: any[] }) {
  if (!photos || photos.length === 0) return null;
  
  // 첫 번째(가장 최근) 사진의 날짜를 기준으로 같은 날짜의 사진들만 필터링
  const latestDate = photos[0].date;
  const todaysPhotos = photos.filter(photo => photo.date === latestDate);

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {todaysPhotos.map((photo, index) => (
        <div key={photo.id || index} className="w-full relative bg-white group rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="aspect-square sm:aspect-video w-full overflow-hidden bg-gray-50 relative group/slider">
            
            {/* 좌우 스크롤 버튼 (웹 환경 고려) */}
            {photo.imageUrls && photo.imageUrls.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.scroll-container');
                    if (container) container.scrollBy({ left: -window.innerWidth * 0.8, behavior: 'smooth' });
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full z-20 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/60 shadow-lg pointer-events-auto"
                >
                  ❮
                </button>
                <button 
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement?.querySelector('.scroll-container');
                    if (container) container.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white w-8 h-8 rounded-full z-20 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/60 shadow-lg pointer-events-auto"
                >
                  ❯
                </button>
              </>
            )}

            <div className="scroll-container flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide">
              {photo.imageUrls && photo.imageUrls.length > 0 ? (
                photo.imageUrls.map((url: string, imgIdx: number) => (
                  <div key={imgIdx} className="w-full h-full flex-shrink-0 snap-center relative">
                    <img 
                      src={url} 
                      alt={photo.title || "나의 일상"} 
                      className="w-full h-full object-cover"
                    />
                    {photo.imageUrls.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/60 text-white text-[10px] font-black px-3 py-1.5 rounded-full backdrop-blur-sm z-10 shadow-lg border border-white/20">
                        {imgIdx + 1} / {photo.imageUrls.length}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex-shrink-0 snap-center">
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.title || "나의 일상"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* 텍스트 정보 오버레이 (사진 하단) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white pointer-events-none">
            {photo.title && (
              <h3 className="font-serif font-black text-xl sm:text-2xl mb-2 drop-shadow-md">
                {photo.title}
              </h3>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold opacity-90 uppercase tracking-widest drop-shadow-md">
              {photo.location ? (
                <>
                  <span className="flex items-center gap-1">📍 {photo.location}</span>
                  <span className="opacity-50">·</span>
                </>
              ) : null}
              <span>{photo.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
