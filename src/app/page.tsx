import Link from "next/link";
import RestaurantRanking from "@/components/RestaurantRanking";
import AIRanking from "@/components/AIRanking";
import MapLoader from "@/components/MapLoader";
import fs from "fs";
import path from "path";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";
import FarmGallery from "@/components/FarmGallery";
import DailyIdiomClient from "@/components/DailyIdiomClient";
import DailyWisdomClient from "@/components/DailyWisdomClient";
import DailyNewsClient from "@/components/DailyNewsClient";
import DailyPoemClient from "@/components/DailyPoemClient";
import WeatherWidget from "@/components/WeatherWidget";
import StockRankingWidget from "@/components/StockRankingWidget";
import StockActiveRankingWidget from "@/components/StockActiveRankingWidget";
import BookRankingClient from "@/components/BookRankingClient";
import { getSortedPostsData } from "@/lib/posts";
import ScrollToTop from "@/components/ScrollToTop";

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

function getIdioms() {
  const filePath = path.join(process.cwd(), "public/data/idioms.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

function getWisdoms() {
  const filePath = path.join(process.cwd(), "public/data/wisdom.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

function getAiNews() {
  const filePath = path.join(process.cwd(), "public/data/ai-news.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

function getEconomyNews() {
  const filePath = path.join(process.cwd(), "public/data/economy.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return [];
  }
}

function getBooks() {
  const filePath = path.join(process.cwd(), "public/data/books.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return null;
  }
}

function getStocks() {
  const filePath = path.join(process.cwd(), "public/data/stocks.json");
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    return null;
  }
}

function getData(): Data {
  const filePath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function Home() {
  const data = getData();
  const poems = getPoems();
  let diaries = getDiaries();
  // 일기 최신순(내림차순) 정렬 보장
  diaries = diaries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const idioms = getIdioms();
  const wisdoms = getWisdoms();
  const aiNews = getAiNews();
  const economyNews = getEconomyNews();
  const books = getBooks();
  const stockData = getStocks();
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
      {/* 1. 상단 헤더 (와이드 레이아웃 및 높이 최소화) */}
      <header className="relative min-h-[320px] w-full flex items-center justify-center overflow-hidden">
        {/* 상단 네비게이션 바 추가 */}
        <nav className="absolute top-0 left-0 w-full z-40 px-6 py-6 flex justify-end gap-8 text-white font-bold text-sm">
          <Link href="/" className="hover:text-cyan-300 transition-all hover:scale-105 active:scale-95">홈</Link>
          <Link href="/blog" className="hover:text-cyan-300 transition-all hover:scale-105 active:scale-95">블로그</Link>
          <Link href="/about" className="hover:text-cyan-300 transition-all hover:scale-105 active:scale-95">소개</Link>
          <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-1">
            <span className="text-lg">🛒</span> 스토어
          </a>
        </nav>
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-100 hover:scale-[1.02]"
          style={{ backgroundImage: "url('/images/daebyeongdaedo_lined.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        
        {/* 메인 타이틀 (유리 효과 제거 및 선명도 극대화 버전) */}
        <div className="relative z-20 text-center text-white p-6 md:p-10 mx-4 md:mx-auto mt-8 max-w-6xl w-[100%] transition-all">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-shadow-premium animate-fade-in leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            Chamnongkkun <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-100">과 함께 하는 거제소식</span>
          </h1>
          <p className="text-lg md:text-2xl font-bold opacity-100 mb-10 tracking-wide max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            푸른 바다와 함께하는 생생한 소식 🐬 거제의 모든 정보를 한눈에 확인하세요.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://smartstore.naver.com/chamnongkkun" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-[16px] font-black transition-all shadow-md hover:shadow-lg hover:-translate-y-1 active:translate-y-0 text-base md:text-lg border-2 border-white/5"
            >
              <span className="text-2xl group-hover:rotate-[10deg] transition-transform">🛍️</span> 
              참농꾼 스토어 바로가기
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg className="relative block w-full h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.43,84.43,101.45,112.33,161.85,116.82,222.25,121.3,275.46,65,321.39,56.44Z" fill="#f8fbff"></path>
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-7xl relative">
        {/* 프리미엄 배경 오라 효과 추가 */}
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[120px] animate-glow pointer-events-none" />
        <div className="absolute top-[40%] -right-[10%] w-[35%] h-[35%] bg-emerald-200/10 rounded-full blur-[100px] animate-glow pointer-events-none" style={{ animationDelay: '-2s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[30%] bg-blue-200/15 rounded-full blur-[90px] animate-glow pointer-events-none" style={{ animationDelay: '-4s' }} />

        {/* 🧑‍🌾 농부 일기 & 증시 & 날씨 통합 섹션 (4:2:2:2 비율 정렬) */}
        <section className="mb-20 relative z-10 px-4">
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-stretch">
            
            {/* 1. 최근 농부일기 (40%) */}
            <div className="w-full lg:w-[40%] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-float">🌱</span>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">최근 농부일기</h2>
                </div>
                <Link href="/diaries" className="text-slate-400 hover:text-cyan-600 text-xs font-bold transition-all hover:translate-x-1">
                  전체보기 →
                </Link>
              </div>
              
              <div className="space-y-4">
                {diaries.length > 0 ? (
                  diaries.filter((d: any) => d.date === diaries[0].date).slice(0, 3).map((diary: any, index: number) => (
                    <Link 
                      key={index}
                      href={`/diaries/${diary.id}`}
                      className="glass-card group block py-4 px-6 rounded-[24px] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex-shrink-0 text-center bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-2.5 min-w-[56px] border border-cyan-100/50 group-hover:scale-110 transition-transform shadow-sm">
                          <div className="text-cyan-600 font-black text-xl leading-none">{diary.date.split('-')[2]}</div>
                          <div className="text-cyan-400 text-[10px] mt-1 uppercase tracking-tighter font-bold">{diary.date.split('-')[1]}월</div>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1 group-hover:text-cyan-600 transition-colors truncate">
                            {diary.title}
                          </h3>
                          <div className="flex items-center gap-2">
                             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Post</span>
                          </div>
                        </div>
                        <div className="text-slate-300 group-hover:text-cyan-400 transition-colors">
                          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 glass rounded-3xl text-center border-dashed border-2 border-slate-200">
                    <p className="text-slate-400 text-sm font-medium">새로운 일기를 기다리고 있습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. 증시 시황 (20%) */}
            <div className="w-full lg:w-[20%]">
               <StockRankingWidget data={stockData} />
            </div>

            {/* 3. 매수 랭킹 (20%) */}
            <div className="w-full lg:w-[20%]">
               <StockActiveRankingWidget />
            </div>

            {/* 4. 날씨 & 도서 (20%) */}
            <div className="w-full lg:w-[20%] flex flex-col gap-4">
               <WeatherWidget />
               <BookRankingClient data={books} />
            </div>

          </div>
        </section>

        {/* 🎬 농장의 생생한 현장 (Farm's Recent View) - 갤러리 팝업 모드로 대체 */}
        {diaries.length > 0 && diaries.filter((d: any) => d.date === diaries[0].date).some((d: any) => d.image || d.video) && (
          <FarmGallery 
            diaries={diaries.filter((d: any) => d.date === diaries[0].date && (d.image || d.video))} 
          />
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
            <DailyPoemClient poem={latestPoem} />

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
          <div className="flex flex-col gap-8">
            {blogPosts.slice(0, 3).map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card group flex flex-col md:flex-row items-center gap-8 p-8 rounded-[40px] hover:-translate-y-1 wide-card-reveal"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="w-full md:w-[300px] h-[180px] rounded-[30px] overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center text-3xl opacity-60">
                   {index === 0 ? "🌊" : index === 1 ? "🏘️" : "🌱"}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 text-[10px] font-black rounded-full border border-cyan-100 uppercase tracking-widest">
                      {post.category || "NEW POST"}
                    </span>
                    <time className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{post.date}</time>
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-cyan-600 transition-colors leading-[1.2]">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-base line-clamp-2 leading-relaxed opacity-80 mb-6">
                    {post.summary}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-black text-cyan-500 group-hover:text-cyan-700 transition-colors">
                    자세히 보기
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
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
          <div className="grid gap-8 md:grid-cols-2">
            {data.events.slice(0, 4).map((event, index) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="glass-card group p-8 rounded-[40px] flex items-center gap-8 hover:-translate-y-1 wide-card-reveal"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-grow">
                  <span className="inline-block mb-4 rounded-full px-4 py-1.5 text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-tighter">
                    {event.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {event.name}
                  </h3>
                  <div className="text-slate-400 text-xs mb-6 flex items-center gap-3 font-bold opacity-70">
                    <span className="text-lg">📍</span> {event.location}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-black text-emerald-500 group-hover:text-emerald-700 transition-colors">
                    <span>이벤트 상세보기</span>
                    <span className="text-2xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 📚 최신 트렌드 & 지식 섹션 */}
        {(aiNews.length > 0 || economyNews.length > 0 || idioms.length > 0 || wisdoms.length > 0) && (
          <section className="mb-20 relative z-10 px-4 flex flex-col gap-1">
            {/* 상단: AI 및 경제 핫이슈 */}
            {aiNews.length > 0 && <DailyNewsClient data={aiNews} type="ai" />}
            {economyNews.length > 0 && <DailyNewsClient data={economyNews} type="economy" />}
            
            {/* 간격 여백 */}
            <div className="h-4"></div>
            
            {/* 하단: 사자성어 및 명심보감 */}
            {idioms.length > 0 && <DailyIdiomClient idioms={idioms} />}
            {wisdoms.length > 0 && <DailyWisdomClient wisdoms={wisdoms} />}
          </section>
        )}

        {/* 🗺️ 거꾸로 세계지도 */}
        <section className="mb-20 relative z-10 px-4">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">🌍</span>
            <h2 className="text-lg font-bold text-slate-800">해양수산부 거꾸로 세계지도</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white p-2">
            <img 
              src="/images/upside-down-map.jpg" 
              alt="해양수산부 거꾸로 세계지도" 
              className="w-full h-auto rounded-xl hover:scale-[1.02] transition-transform duration-500"
            />
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
      <footer className="relative bg-white/30 backdrop-blur-md border-t border-white/50 py-16 text-slate-500 text-sm z-10 overflow-hidden">
        {/* 푸터 배경 효과 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent opacity-50" />
        
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Chamnongkkun Info</h2>
              <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">The Best Guide to Geoje Island 🐬</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 font-bold text-xs tracking-widest text-slate-400">
              <Link href="/about" className="hover:text-cyan-600 transition-colors hover:scale-105">소개</Link>
              <Link href="/update-events" className="hover:text-cyan-600 transition-colors hover:scale-105">업데이트</Link>
              <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 transition-colors hover:scale-105">스토어</a>
              <span className="cursor-help hover:text-slate-800 transition-colors">개인정보처리방침</span>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium text-slate-400 opacity-60">
            <p>© 2025 chamnongkkun-info. All rights reserved.</p>
            <p className="italic font-serif">"푸른 바다와 함께하는 생생한 거제 소식"</p>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}
