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
          <div className="aspect-square sm:aspect-video w-full overflow-hidden bg-gray-50">
            <img 
              src={photo.imageUrl} 
              alt={photo.title || "나의 일상"} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          {/* 텍스트 정보 오버레이 (사진 하단) */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
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
