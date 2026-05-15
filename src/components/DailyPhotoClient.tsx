"use client";

import React from "react";

export default function DailyPhotoClient({ photos }: { photos: any[] }) {
  if (!photos || photos.length === 0) return null;
  const photo = photos[0]; // 가장 최근 사진 표시

  return (
    <div className="w-full relative bg-white group">
      <div className="aspect-square sm:aspect-video w-full overflow-hidden bg-gray-50">
        <img 
          src={photo.imageUrl} 
          alt={photo.title || "일상 사진"} 
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
          <span className="flex items-center gap-1">📍 {photo.location || "거제도"}</span>
          <span className="opacity-50">·</span>
          <span>{photo.date}</span>
        </div>
      </div>
    </div>
  );
}
