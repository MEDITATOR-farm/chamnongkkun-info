import Link from "next/link";
import RestaurantRanking from "@/components/RestaurantRanking";
import AIRanking from "@/components/AIRanking";
import MapLoader from "@/components/MapLoader";
import fs from "fs";
import path from "path";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import { getSortedPostsData } from "@/lib/posts";

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
  blogPosts: BlogPost[];
}

function getDiaries() {
  const filePath = path.join(process.cwd(), "public/data/diaries.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const diaries = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // id(타임스탬프) 기준 내림차순 정렬하여 최신순으로 반환
    return diaries.sort((a: any, b: any) => b.id - a.id);
  } catch (e) {
    return [];
  }
}

function getPoems() {
  const filePath = path.join(process.cwd(), "public/data/poems.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

function getData(): Data {
  const filePath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function Home() {
  const data = getData();
  const poems = getPoems();
  const diaries = getDiaries();
  const latestPoem = poems[0];

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

  const blogPosts = getSortedPostsData().slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200 overflow-x-hidden">
      {/* 1. 상단 헤더 (높이 축소) */}
      <header className="relative h-[280px] w-full flex items-center justify-center overflow-hidden">
        {/* 상단 네비게이션 바 추가 */}
        <nav className="absolute top-0 left-0 w-full z-40 px-6 py-4 flex justify-end gap-6 text-white font-bold text-sm">
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
          <h1 className="text-3xl font-extrabold md:text-5xl tracking-tight mb-2 text-shadow-lg">
            거제시 생활 정보
          </h1>
          <p className="text-base md:text-xl font-medium opacity-95">
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

        {/* 🧑‍🌾 농부 일기 섹션 (미니멀리즘 적용) */}
        <section className="mb-20 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl font-bold text-slate-800">최근 농부일기</h2>
            </div>
            <Link href="/diaries" className="text-slate-400 hover:text-teal-600 text-sm font-medium transition-colors">
              전체보기 →
            </Link>
          </div>
          
          <div className="max-w-3xl">
            {diaries.length > 0 ? (
              <Link 
                href="/diaries"
                className="group block bg-white p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all relative overflow-hidden"
              >
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 text-center">
                    <div className="text-teal-600 font-black text-xl leading-none">{diaries[0].date.split('-')[2]}</div>
                    <div className="text-slate-400 text-[10px] mt-1 uppercase tracking-wider">{diaries[0].date.split('-')[1]}월</div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-teal-600 transition-colors truncate">
                      {diaries[0].title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {diaries[0].image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-50 flex-shrink-0">
                          <img src={diaries[0].image} alt="Thumbnail" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                        </div>
                      )}
                      <p className="text-slate-400 text-sm line-clamp-1 font-light italic">
                        "{diaries[0].content.substring(0, 60)}..."
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <span className="text-teal-300 text-xl">→</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="py-10 bg-white rounded-2xl border border-slate-50 text-center">
                <p className="text-slate-300 text-sm">새로운 일기를 기다리고 있습니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* 🎬 농장의 생생한 현장 (Farm's Recent View) - 새 섹션 */}
        {diaries.length > 0 && (diaries[0].image || diaries[0].video) && (
          <section className="mb-20 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-xl">🎬</span>
              <h2 className="text-lg font-bold text-slate-800">농장 최근 현장</h2>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-black/5 aspect-video relative group">
              {diaries[0].video ? (
                <video 
                  src={diaries[0].video} 
                  controls 
                  className="w-full h-full object-cover"
                  poster={diaries[0].image}
                />
              ) : (
                <img 
                  src={diaries[0].image} 
                  alt="Farm Recent View" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium">{diaries[0].title}</p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link href="/upload-diary" className="text-[11px] font-bold text-teal-500 hover:text-teal-700 transition-colors">
                + 현장 소식 올리기
              </Link>
            </div>
          </section>
        )}
        <section className="mb-16 relative z-10 px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">📍</span>
            <h2 className="text-lg font-bold text-slate-800">거제 맛집 지도</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <MapLoader />
          </div>
        </section>

        {/* ✨ 오늘의 인사이트 요약 (Poem & AI Ranking 통합 슬림화) */}
        <section className="mb-20 relative z-10 px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-slate-800">오늘의 인사이트</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* 1. 오늘의 시 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-0.5 h-full bg-orange-200/50" />
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Today's Poem</span>
                  <div className="text-orange-100 group-hover:text-orange-200 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </div>
                
                {latestPoem ? (
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-lg font-serif font-bold text-slate-800 mb-4 leading-tight">
                      {latestPoem.title}
                    </h3>
                    <div className="space-y-3">
                      {(latestPoem.content || "").split("\n").slice(0, 3).map((line: string, idx: number) => (
                        <p key={idx} className="text-slate-500 font-serif leading-relaxed text-sm italic">
                          {line}
                        </p>
                      ))}
                      {(latestPoem.content || "").split("\n").length > 3 && (
                        <p className="text-slate-300 text-[10px] font-serif tracking-widest mt-2">. . .</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 font-serif italic text-sm">소중한 시가 준비 중입니다.</p>
                )}
                
                <div className="mt-8 flex justify-between items-end border-t border-slate-50 pt-4">
                  <span className="text-[10px] text-slate-400 font-medium">— {latestPoem?.author || "거제의 시인"}</span>
                  <Link href="/poems" className="text-orange-400 text-[10px] font-bold hover:text-orange-600 transition-colors">
                    더 읽어보기 →
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. 실시간 AI 랭킹 */}
            <AIRanking />
          </div>
        </section>

        {/* 📝 지역 소식 (블로그) - 슬림화 */}
        <section className="mb-20 relative z-10 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xl">📝</span>
              <h2 className="text-lg font-bold text-slate-800">지역 소식</h2>
            </div>
            <Link href="/blog" className="text-slate-400 hover:text-teal-600 text-sm font-medium transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-teal-100 hover:shadow-sm transition-all"
              >
                <time className="text-[10px] text-slate-400 font-bold mb-2 block uppercase tracking-wider">{post.date}</time>
                <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 🌸 행사/축제 (슬림화) */}
        <section id="events-section" className="mb-20 relative z-10 px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xl">🌸</span>
              <h2 className="text-lg font-bold text-slate-800">이달의 행사</h2>
            </div>
            <Link href="/events" className="text-slate-400 hover:text-teal-600 text-sm font-medium transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.events.slice(0, 4).map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-teal-100 hover:shadow-sm transition-all flex flex-col h-full"
              >
                <span className="inline-block self-start mb-3 rounded-full px-2 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-500">{event.category}</span>
                <h3 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">{event.name}</h3>
                <p className="text-slate-500 text-[10px] mb-3 flex items-center gap-1 opacity-70">
                  <span>📍</span> {event.location}
                </p>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4 flex-grow">{event.summary}</p>
                <div className="text-[10px] font-bold text-teal-400 group-hover:text-teal-600 transition-colors">
                  상세보기 +
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 💰 광고 섹션 */}
        <div className="px-4 mb-20">
          <AdBanner />
        </div>
        
        <div className="px-4 mb-20">
          <CoupangBanner />
        </div>
      </main>
      <footer className="bg-white border-t border-slate-50 py-10 text-slate-400 text-[11px] relative z-10">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 font-medium tracking-tight">
            <Link href="/about" className="hover:text-slate-600 transition-colors">소개</Link>
            <Link href="/update-events" className="hover:text-slate-600 transition-colors">업데이트</Link>
            <span>개인정보처리방침</span>
            <span>문의하기</span>
          </div>
          <p>© 2025 chamnongkkun-info. Powered by Next.js & Cloudflare</p>
          <p className="text-[9px] opacity-70 italic font-serif">"푸른 바다와 함께하는 생생한 거제 소식"</p>
        </div>
      </footer>
    </div>
  );
}
