"use client";

import Link from "next/link";

export default function FarmGallery({ diaries }: { diaries: any[] }) {
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
      {/* 중앙 수직선 - 모바일에서는 숨김 */}
      <div className="absolute hidden md:block left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent -translate-x-1/2" />

      <div className="space-y-16 md:space-y-28">
        {monthKeys.map((monthKey) => (
          <div key={monthKey} className="relative">

            {/* 월별 배지 */}
            <div className="sticky top-24 z-20 mb-8 md:mb-12 flex justify-center">
              <div className="bg-primary text-white px-5 py-2 rounded-full font-serif font-bold shadow-xl shadow-primary/20 flex items-center gap-2 text-sm">
                🗓️ {monthKey}
              </div>
            </div>

            <div className="space-y-12 md:space-y-20">
              {groupedDiaries[monthKey].map((diary, index) => {
                const globalIndex = diaries.indexOf(diary);
                const isRight = globalIndex % 2 === 1;

                const images: string[] = diary.images && diary.images.length > 0
                  ? diary.images
                  : diary.image ? [diary.image] : [];

                return (
                  <div
                    key={diary.id || index}
                    className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-10 ${isRight ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* 타임라인 점 - 모바일에서는 숨김 */}
                    <div className="absolute left-1/2 top-2 w-4 h-4 rounded-full bg-white border-4 border-secondary -translate-x-1/2 z-10 hidden md:block shadow-sm" />

                    <div className="w-full md:w-[calc(50%-40px)]">
                      <div className="mb-4">
                        <div className="flex items-center justify-between md:block">
                          <span className="text-secondary font-black tracking-widest text-[10px] uppercase">
                            RECORD No.{diaries.length - globalIndex}
                          </span>
                          <div className="text-foreground/30 font-bold text-xs md:mt-0.5">{diary.date}</div>
                        </div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mt-2 leading-snug">
                          {diary.title}
                        </h3>
                      </div>

                      {/* 사진/영상 그대로 나열 */}
                      {diary.video ? (
                        <div className="rounded-[24px] overflow-hidden shadow-xl border border-primary/5">
                          <video
                            src={diary.video}
                            controls
                            playsInline
                            preload="metadata"
                            className="w-full object-contain bg-black"
                          />
                        </div>
                      ) : images.length > 0 ? (
                        <div className="space-y-2">
                          {images.map((img, idx) => (
                            <div key={idx} className="rounded-[20px] overflow-hidden shadow-lg border border-primary/5 bg-primary/5">
                              <img
                                src={img}
                                alt={`${diary.title} ${idx + 1}`}
                                className="w-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] bg-primary/5 rounded-[24px] flex items-center justify-center text-4xl">
                          🌱
                        </div>
                      )}

                      {diary.content && (
                        <p className="mt-5 text-foreground/50 leading-relaxed text-sm md:text-base line-clamp-3">
                          {diary.content}
                        </p>
                      )}
                    </div>

                    <div className="hidden md:block w-[calc(50%-40px)]" />
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
    </div>
  );
}
