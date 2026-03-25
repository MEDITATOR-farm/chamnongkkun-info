"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdBanner from "@/components/AdBanner";

interface InfoItem {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

interface BlogPost {
  id: number;
  title: string;
  date: string;
  summary: string;
  link: string;
}

interface Data {
  events: InfoItem[];
  benefits: InfoItem[];
  blogPosts: BlogPost[];
}

export default function Home() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("/data/chamnongkkun-info.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <div className="p-8 text-center min-h-screen flex items-center justify-center text-xl font-bold text-cyan-600">🌊 정보를 불러오는 중입니다...</div>;

  // 계절별 색상 결정 함수
  const getSeasonStyles = (itemName: string) => {
    if (itemName.includes("수선화") || itemName.includes("진달래") || itemName.includes("맹종죽")) {
      return { bg: "bg-pink-50", border: "border-pink-300", badge: "bg-pink-200 text-pink-700", accent: "bg-pink-500 hover:bg-pink-600", text: "text-pink-900" };
    }
    if (itemName.includes("옥포대첩") || itemName.includes("수국") || itemName.includes("바다로")) {
      return { bg: "bg-cyan-50", border: "border-cyan-300", badge: "bg-cyan-200 text-cyan-700", accent: "bg-cyan-500 hover:bg-cyan-600", text: "text-cyan-900" };
    }
    if (itemName.includes("섬꽃")) {
      return { bg: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-200 text-orange-700", accent: "bg-orange-500 hover:bg-orange-600", text: "text-orange-900" };
    }
    return { bg: "bg-blue-50", border: "border-blue-300", badge: "bg-blue-200 text-blue-700", accent: "bg-blue-500 hover:bg-blue-600", text: "text-blue-900" };
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200 overflow-x-hidden">
      {/* 1. 상단 헤더 */}
      <header className="relative h-[450px] w-full flex items-center justify-center overflow-hidden">
        {/* 상단 네비게이션 바 추가 */}
        <nav className="absolute top-0 left-0 w-full z-40 px-6 py-4 flex justify-end gap-6 text-white font-bold">
          <Link href="/" className="hover:text-cyan-200 transition-colors">홈</Link>
          <Link href="/blog" className="hover:text-cyan-200 transition-colors">블로그</Link>
          <Link href="/about" className="hover:text-cyan-200 transition-colors">소개</Link>
        </nav>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/images/header-bg.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-cyan-900/40" />
        
        <div className="relative z-20 text-center text-white p-6 drop-shadow-2xl">
          <h1 className="text-5xl font-extrabold md:text-7xl tracking-tight mb-4 text-shadow-lg">
            거제시 생활 정보
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-95">
            푸른 바다와 함께하는 생생한 소식 🐬
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.43,84.43,101.45,112.33,161.85,116.82,222.25,121.3,275.46,65,321.39,56.44Z" fill="#f8fbff"></path>
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-7xl relative">
        <div className="absolute top-20 right-10 w-32 h-32 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-80 left-10 w-48 h-48 bg-emerald-200 rounded-full blur-3xl opacity-20" />

        <section className="mb-24 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-slate-800 mb-2">🌸 이번 달 행사/축제</h2>
            <div className="h-1.5 w-24 bg-emerald-400 mx-auto rounded-full" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.events.map((event) => {
              const styles = getSeasonStyles(event.name);
              return (
                <div
                  key={event.id}
                  className={`group relative overflow-hidden rounded-[2.5rem] border-2 ${styles.border} ${styles.bg} p-1 transition-all hover:shadow-2xl hover:scale-102`}
                >
                  <div className="bg-white rounded-[2.3rem] p-8 h-full flex flex-col">
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": "Event",
                          "name": event.name,
                          "startDate": event.startDate,
                          "endDate": event.endDate,
                          "location": {
                            "@type": "Place",
                            "name": event.location
                          },
                          "description": event.summary
                        })
                      }}
                    />
                    <span className={`self-start mb-4 rounded-full px-4 py-1 text-xs font-bold ring-2 ring-offset-2 ring-transparent transition-all group-hover:ring-current ${styles.badge}`}>
                      {event.category} 소식
                    </span>
                    <h3 className={`mb-4 text-2xl font-black ${styles.text} leading-tight`}>{event.name}</h3>
                    <div className="space-y-3 mb-6 text-slate-500 font-medium">
                      <p className="flex items-center gap-2">📍 {event.location}</p>
                      <p className="flex items-center gap-2">📅 {event.startDate} ~ {event.endDate}</p>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-8 flex-grow">{event.summary}</p>
                    <Link
                      href={`/events/${event.id}`}
                      className={`block w-full rounded-2xl ${styles.accent} py-4 text-center font-bold text-white transition-all transform group-hover:translate-y-[-2px] shadow-lg`}
                    >
                      상세 정보 보기
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <AdBanner />

        <section className="mb-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <h2 className="text-4xl font-black text-slate-800">💎 우리 동네 꿀팁 & 혜택</h2>
            <span className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full font-bold text-sm">총 {data.benefits.length}건의 정보</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.benefits.map((benefit) => (
              <div
                key={benefit.id}
                className="group relative rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-xl hover:ring-blue-200"
              >
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "GovernmentService",
                      "serviceName": benefit.name,
                      "description": benefit.summary,
                      "provider": {
                        "@type": "GovernmentOrganization",
                        "name": "거제시"
                      }
                    })
                  }}
                />
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-tr-[2rem] -z-1" />
                <h3 className="mb-4 text-xl font-black text-slate-800 group-hover:text-blue-600">{benefit.name}</h3>
                <div className="mb-6 space-y-2 text-sm">
                  <p className="text-blue-600 font-bold">🎯 {benefit.target}</p>
                  <p className="text-slate-600 leading-snug line-clamp-2">{benefit.summary}</p>
                </div>
                <Link
                  href={`/benefits/${benefit.id}`}
                  className="inline-flex items-center gap-2 font-bold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  더 알아보기 <span className="text-xl">→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-3xl shadow-lg shadow-teal-100">🚜</div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">chamnongkkun의 농부일기</h2>
              <p className="text-slate-500">따분한 일상에 작은 쉼표가 되는 이야기들</p>
            </div>
          </div>
          <div className="grid gap-4">
            {data.blogPosts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-8 rounded-[2rem] border border-slate-50 transition-all hover:border-teal-200 hover:shadow-lg"
              >
                <div className="min-w-[100px] text-center">
                  <div className="text-teal-600 font-black text-2xl">{post.date.split('-')[2]}</div>
                  <div className="text-slate-400 text-xs font-bold">{post.date.split('-')[1]}월 {post.date.split('-')[0]}</div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1">{post.summary}</p>
                </div>
                <Link href="/blog" className="hidden sm:inline-block bg-teal-50 text-teal-600 px-6 py-2 rounded-full font-bold hover:bg-teal-100 transition-colors">
                  자세히 보기
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 text-slate-500">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-10 flex justify-center space-x-8 opacity-60">
            <span className="text-3xl hover:scale-125 transition-transform cursor-default">🌿</span>
            <span className="text-3xl hover:scale-125 transition-transform cursor-default">🌊</span>
            <span className="text-3xl hover:scale-125 transition-transform cursor-default">⛵</span>
          </div>
          <div className="space-y-4">
            <p className="text-lg font-bold text-slate-700 underline decoration-cyan-400 decoration-4 underline-offset-4">📍 데이터 출처: 공공데이터포털(data.go.kr)</p>
            <p className="text-sm">마지막 실시간 업데이트: {new Date().toLocaleDateString("ko-KR")} 22:00</p>
            <div className="pt-10 flex flex-col items-center gap-2">
              <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-300">
                <span>About</span>
                <span>Privacy</span>
                <span>Contact</span>
              </div>
              <p className="text-[10px] text-slate-300">
                © 2025 chamnongkkun-info. Powered by Next.js & Cloudflare
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
