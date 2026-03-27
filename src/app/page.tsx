import Link from "next/link";
import RestaurantRanking from "@/components/RestaurantRanking";
import AIRanking from "@/components/AIRanking";
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
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
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

        {/* 🧑‍🌾 농부 일기 섹션 (최상단으로 이동) */}
        <section className="mb-24 relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-3xl shadow-lg shadow-teal-100">🧑‍🌾</div>
            <div>
              <h2 className="text-3xl font-black text-slate-800">chamnongkkun의 농부일기</h2>
              <p className="text-slate-500">따분한 일상에 작은 쉼표가 되는 이야기들</p>
            </div>
          </div>
          <div className="grid gap-8">
            {diaries.length > 0 ? diaries.slice(0, 3).map((diary: any) => (
              <div
                key={diary.id}
                className="group flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-8 rounded-[2rem] border border-slate-50 transition-all hover:border-teal-200 hover:shadow-lg"
              >
                <div className="min-w-[100px] text-center">
                  <div className="text-teal-600 font-black text-2xl">{diary.date.split('-')[2]}</div>
                  <div className="text-slate-400 text-xs font-bold">{diary.date.split('-')[1]}월 {diary.date.split('-')[0]}</div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors leading-tight">
                    {diary.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1">{diary.content}</p>
                </div>
                <Link href="/diaries" className="hidden sm:inline-block bg-teal-50 text-teal-600 px-6 py-2 rounded-full font-bold hover:bg-teal-100 transition-colors">
                  일기장 보기
                </Link>
              </div>
            )) : (
              <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-400 mb-4">아직 소중한 일기가 올라오지 않았습니다.</p>
                <Link href="/upload-diary" className="text-teal-600 font-bold hover:underline">
                  첫 일기 작성하기 →
                </Link>
              </div>
            )}
          </div>
          {diaries.length > 3 && (
            <div className="mt-8 text-center">
              <Link href="/diaries" className="text-slate-400 hover:text-teal-600 font-bold border-b border-slate-200 transition-colors">
                지난 일기 모두 보기 →
              </Link>
            </div>
          )}
        </section>
        
        {/* 📝 새소식 블로그 섹션 (위치 이동) */}
        <section className="mb-24 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-800">📝 우리 동네 새소식</h2>
            <Link href="/blog" className="text-teal-600 font-bold hover:underline">블로그 전체보기 →</Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 transition-all hover:border-teal-200 hover:shadow-xl"
              >
                <time className="text-xs text-slate-400 font-bold mb-3 block uppercase tracking-wider">{post.date}</time>
                <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {post.summary}
                </p>
                <span className="text-xs font-bold text-teal-600 transition-all group-hover:translate-x-1 inline-flex items-center gap-1">
                  자세히 읽기 <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 💰 중간 광고 (AdSense) */}
        <AdBanner />

        {/* 🌸 이번 달 행사 (Row 1 - Full Width) */}
        <section id="events-section" className="mb-24 relative z-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <span className="text-4xl">🌸</span> 이번 달 행사/축제
            </h2>
            <Link href="#events-section" className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
              전체보기 →
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.events.slice(0, 4).map((event) => {
              const styles = getSeasonStyles(event.name);
              return (
                <div key={event.id} className={`group relative overflow-hidden rounded-[2.5rem] border ${styles.border} ${styles.bg} p-0.5 transition-all hover:shadow-2xl hover:-translate-y-1`}>
                  <div className="bg-white rounded-[2.4rem] p-6 h-full flex flex-col">
                    <span className={`self-start mb-3 rounded-full px-3 py-1 text-[10px] font-bold ${styles.badge}`}>{event.category}</span>
                    <h3 className={`mb-3 text-lg font-black ${styles.text} leading-tight group-hover:text-cyan-600 transition-colors line-clamp-2`}>{event.name}</h3>
                    <p className="text-slate-500 text-[11px] mb-4 flex items-center gap-1">
                      <span>📍</span> <span className="truncate">{event.location}</span>
                    </p>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">{event.summary}</p>
                    <Link href={`/events/${event.id}`} className={`block w-full rounded-2xl ${styles.accent} py-3 text-center font-bold text-xs text-white shadow-sm transition-all hover:shadow-md active:scale-95`}>
                      상세 정보 보러가기
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 📝 오늘의 시, 맛집 & AI 랭킹 (Rankings Section) */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24 relative z-10 items-stretch">
          
          {/* 오늘의 시 섹션 */}
          <section className="bg-orange-50/30 rounded-[3rem] p-10 text-center border border-orange-100/50 flex flex-col">
            <p className="text-orange-300 tracking-[0.3em] text-[10px] font-black mb-4">POEM OF THE DAY</p>
            <h2 className="text-2xl font-black text-slate-800 mb-8">📖 오늘의 시</h2>

            {latestPoem ? (
              <div 
                className="rounded-[2rem] p-8 shadow-xl text-left transition-transform hover:scale-[1.02] flex-grow"
                style={{
                  background: latestPoem.bgColor,
                  color: latestPoem.textColor,
                  fontFamily: "'Noto Serif KR', serif",
                }}
              >
                <div className="text-[10px] tracking-widest mb-3 font-bold opacity-80 uppercase" style={{ color: latestPoem.accentColor }}>
                  {latestPoem.mood}
                </div>
                <h3 className="text-xl font-bold mb-2">{latestPoem.title}</h3>
                {latestPoem.author && <p className="text-xs mb-6 opacity-70">— {latestPoem.author}</p>}
                <p className="text-base leading-loose whiteSpace-pre-wrap break-all">{latestPoem.content}</p>
                <p className="mt-8 text-[10px] opacity-40">{latestPoem.date}</p>
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur rounded-[2rem] p-12 border border-dashed border-slate-200 text-slate-400 flex-grow">
                아직 등록된 시가 없어요 📖
              </div>
            )}

            {poems.length > 1 && (
              <Link href="/poems" className="inline-block mt-8 text-orange-400 font-bold text-sm border-b-2 border-orange-200 hover:text-orange-600 hover:border-orange-400 transition-all">
                지난 시 모두 보기 →
              </Link>
            )}
          </section>

          {/* 맛집 랭킹 섹션 */}
          <section className="bg-blue-50/30 rounded-[3rem] p-10 border border-blue-100/50 flex flex-col h-full">
            <p className="text-blue-300 tracking-[0.3em] text-[10px] font-black mb-4 flex items-center gap-1 justify-center">
               <span>LOCAL FAVORITES</span>
            </p>
            <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">🍴 거제 맛집 랭킹</h2>
            <RestaurantRanking />
          </section>

          {/* AI 랭킹 섹션 (신규 추가) */}
          <section className="lg:col-span-2 bg-indigo-50/30 rounded-[3rem] p-10 border border-indigo-100/50 mt-4">
            <p className="text-indigo-300 tracking-[0.3em] text-[10px] font-black mb-4 text-center">TECH TRENDS</p>
            <div className="max-w-4xl mx-auto">
              <AIRanking />
            </div>
          </section>
        </div>


        {/* 💰 하단 쿠팡 광고 */}
        <CoupangBanner />
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 text-slate-500 text-xs">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="font-bold text-slate-600">📍 데이터 출처: 공공데이터포털(data.go.kr)</p>
          <div className="flex justify-center gap-4 uppercase font-medium tracking-widest text-[11px]">
            <Link href="/about" className="hover:text-cyan-600 transition-colors">About</Link>
            <span className="opacity-30">|</span>
            <Link href="/update-events" className="hover:text-cyan-600 transition-colors">Update</Link>
            <span className="opacity-30">|</span>
            <span>Privacy</span>
            <span className="opacity-30">|</span>
            <span>Contact</span>
          </div>
          <p className="text-slate-400 text-[10px]">© 2025 chamnongkkun-info. Powered by Next.js & Cloudflare</p>
        </div>
      </footer>
    </div>
  );
}
