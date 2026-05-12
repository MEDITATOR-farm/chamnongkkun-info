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
      {/* 중앙 수직선 */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent -translate-x-1/2" />

      <div className="space-y-28">
        {monthKeys.map((monthKey) => (
          <div key={monthKey} className="relative">

            {/* 월별 배지 */}
            <div className="sticky top-24 z-20 mb-12 flex justify-start md:justify-center">
              <div className="bg-primary text-white px-5 py-2 rounded-full font-serif font-bold shadow-xl shadow-primary/20 flex items-center gap-2 ml-2 md:ml-0 text-sm">
                🗓️ {monthKey}
              </div>
            </div>

            <div className="space-y-20">
              {groupedDiaries[monthKey].map((diary, index) => {
                const globalIndex = diaries.indexOf(diary);
                const isRight = globalIndex % 2 === 1;

                // 이미지 목록 계산
                const images: string[] = diary.images && diary.images.length > 0
                  ? diary.images
                  : diary.image ? [diary.image] : [];

                return (
                  <div
                    key={diary.id || index}
                    className={`relative flex flex-col md:flex-row items-start gap-10 ${isRight ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* 타임라인 포인트 */}
                    <div className="absolute left-4 md:left-1/2 top-2 w-4 h-4 rounded-full bg-white border-4 border-secondary -translate-x-1/2 z-10 hidden md:block shadow-sm" />

                    {/* 콘텐츠 영역 */}
                    <div className={`w-full md:w-[calc(50%-40px)] ml-10 md:ml-0`}>

                      {/* 날짜 + 제목 */}
                      <div className="mb-4">
                        <span className="text-secondary font-black tracking-widest text-[10px] uppercase">
                          RECORD No.{diaries.length - globalIndex}
                        </span>
                        <div className="text-foreground/30 font-bold text-xs mt-0.5">{diary.date}</div>
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-foreground mt-2 leading-snug">
                          {diary.title}
                        </h3>
                      </div>

                      {/* 사진 나열 (모달 없이 그대로) */}
                      {diary.video ? (
                        <div className="rounded-[24px] overflow-hidden shadow-xl border border-primary/5">
                          <video
                            src={diary.video}
                            controls
                            playsInline
                            className="w-full max-h-[70vw] md:max-h-[400px] object-contain bg-black"
                          />
                        </div>
                      ) : images.length > 0 ? (
                        <div className={`grid gap-2 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                          {images.map((img, idx) => (
                            <div
                              key={idx}
                              className={`rounded-[20px] overflow-hidden shadow-lg border border-primary/5 bg-primary/5 ${images.length === 1 ? "col-span-full" : ""}`}
                            >
                              <img
                                src={img}
                                alt={`${diary.title} ${idx + 1}`}
                                className="w-full aspect-square object-cover"
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

                      {/* 내용 */}
                      {diary.content && (
                        <p className="mt-5 text-foreground/50 leading-relaxed text-sm md:text-base line-clamp-3">
                          {diary.content}
                        </p>
                      )}
                    </div>

                    {/* 반대편 빈 공간 (지그재그 유지) */}
                    <div className="hidden md:block w-[calc(50%-40px)]" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 기록 추가 버튼 */}
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
