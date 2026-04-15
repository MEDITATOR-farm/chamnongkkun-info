import Link from "next/link";
import AIRanking from "@/components/AIRanking";
import AdBanner from "@/components/AdBanner";
import MapLoader from "@/components/MapLoader";
import fs from "fs";
import path from "path";
import CoupangBanner from "@/components/CoupangBanner";
import FarmGallery from "@/components/FarmGallery";
import DailyIdiomClient from "@/components/DailyIdiomClient";
import DailyWisdomClient from "@/components/DailyWisdomClient";
import DailyNewsClient from "@/components/DailyNewsClient";
import DailyPoemClient from "@/components/DailyPoemClient";
import WeatherWidget from "@/components/WeatherWidget";
import BookRankingClient from "@/components/BookRankingClient";
import { getSortedPostsData } from "@/lib/posts";
import ScrollToTop from "@/components/ScrollToTop";
import AccordionSection from "@/components/AccordionSection";
import HighRevenueSection from "@/components/HighRevenueSection";

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
    return diaries.sort((a: any, b: any) => b.id - a.id);
  } catch (e) { return []; }
}

function getPoems() {
  const filePath = path.join(process.cwd(), "public/data/poems.json");
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return []; }
}

function getIdioms() {
  const filePath = path.join(process.cwd(), "public/data/idioms.json");
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return []; }
}

function getWisdoms() {
  const filePath = path.join(process.cwd(), "public/data/wisdom.json");
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return []; }
}

function getAiNews() {
  const filePath = path.join(process.cwd(), "public/data/ai-news.json");
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return []; }
}

function getEconomyNews() {
  const filePath = path.join(process.cwd(), "public/data/economy.json");
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return []; }
}

function getBooks() {
  const filePath = path.join(process.cwd(), "public/data/books.json");
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return null; }
}

function getYouthSupport() {
  const filePath = path.join(process.cwd(), "public/data/youth-support.json");
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return null; }
}

function getFarmSupport() {
  const filePath = path.join(process.cwd(), "public/data/farm-support.json");
  if (!fs.existsSync(filePath)) return null;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch (e) { return null; }
}

function getData(): Data {
  const filePath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export default function Home() {
  const data = getData();
  const poems = getPoems();
  let diaries = getDiaries();
  diaries = diaries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const idioms = getIdioms();
  const wisdoms = getWisdoms();
  const aiNews = getAiNews();
  const economyNews = getEconomyNews();
  const books = getBooks();
  const youthSupport = getYouthSupport();
  const farmSupport = getFarmSupport();
  const blogPosts = getSortedPostsData().slice(0, 6);

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200 overflow-x-hidden">

      {/* ── 헤더 ── */}
      <header className="relative min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <nav className="absolute top-0 left-0 w-full z-40 px-6 py-5 flex justify-end gap-8 text-white font-bold text-sm">
          <Link href="/" className="hover:text-cyan-300 transition-all">홈</Link>
          <Link href="/blog" className="hover:text-cyan-300 transition-all">블로그</Link>
          <Link href="/about" className="hover:text-cyan-300 transition-all">소개</Link>
          <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-300 transition-all flex items-center gap-1">
            <span>🛒</span> 스토어
          </a>
        </nav>
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/daebyeongdaedo_lined.png')" }} />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        <div className="relative z-20 text-center text-white p-6 md:p-10 mx-4 mt-4 max-w-5xl w-full">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
            Chamnongkkun <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-100">과 함께 하는 거제소식</span>
          </h1>
          <p className="text-base md:text-xl font-bold mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            푸른 바다와 함께하는 생생한 소식 🐬 거제의 모든 정보를 한눈에
          </p>
          <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-md hover:-translate-y-1 text-base">
            <span>🛍️</span> 참농꾼 스토어 바로가기 →
          </a>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg className="relative block w-full h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.43,84.43,101.45,112.33,161.85,116.82,222.25,121.3,275.46,65,321.39,56.44Z" fill="#f8fbff" />
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl">

        {/* ── 1. 알면 돈이 되는 정보 ── */}
        <HighRevenueSection />

        {/* ── 2. 오늘의 지원금 요약 카드 ── */}
        {(youthSupport || farmSupport) && (
          <section className="mb-14 px-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">💸</span>
              <h2 className="text-lg font-bold text-slate-800">오늘의 지원금 요약</h2>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">바로 신청 가능</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 청년 지원금 TOP 3 */}
              {youthSupport?.supports?.slice(0, 3).map((s: any, i: number) => (
                <Link href="/support/youth" key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">💰</div>
                  <div className="min-w-0">
                    <div className="text-xs text-blue-500 font-bold mb-0.5">{s.tag}</div>
                    <div className="font-bold text-slate-800 text-sm truncate">{s.title}</div>
                    <div className="text-emerald-600 font-black text-sm">{s.amount}</div>
                  </div>
                  <div className="ml-auto text-slate-300 text-lg">›</div>
                </Link>
              ))}
              {/* 농업 지원금 TOP 3 */}
              {farmSupport?.supports?.slice(0, 3).map((s: any, i: number) => (
                <Link href="/support/farm" key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">🌾</div>
                  <div className="min-w-0">
                    <div className="text-xs text-green-600 font-bold mb-0.5">{s.tag}</div>
                    <div className="font-bold text-slate-800 text-sm truncate">{s.title}</div>
                    <div className="text-emerald-600 font-black text-sm">{s.amount}</div>
                  </div>
                  <div className="ml-auto text-slate-300 text-lg">›</div>
                </Link>
              ))}
            </div>
            <div className="flex gap-3 mt-3">
              <Link href="/support/youth" className="text-xs text-blue-500 hover:underline font-bold">청년지원금 전체보기 →</Link>
              <Link href="/support/farm" className="text-xs text-green-600 hover:underline font-bold">농업지원금 전체보기 →</Link>
            </div>
          </section>
        )}

        {/* ── 3. 농부일기 + 날씨/도서 ── */}
        <section className="mb-14 px-2">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            <div className="w-full lg:w-[68%] flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌱</span>
                  <h2 className="text-lg font-bold text-slate-800">최근 농부일기</h2>
                </div>
                <Link href="/diaries" className="text-slate-400 hover:text-cyan-600 text-xs font-bold transition-all">전체보기 →</Link>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {diaries.length > 0 ? (
                  <AccordionSection type="diary"
                    items={diaries.filter((d: any) => d.date === diaries[0].date).slice(0, 5).map((d: any) => ({
                      id: d.id, title: d.title, date: d.date, content: d.content,
                      image: d.image, video: d.video, link: `/diaries/${d.id}`
                    }))}
                  />
                ) : (
                  <div className="py-10 text-center border-dashed border-2 border-slate-200 rounded-2xl">
                    <p className="text-slate-400 text-sm">새로운 일기를 기다리고 있습니다.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[32%] flex flex-col gap-5">
              <WeatherWidget />
              <BookRankingClient data={books} />
            </div>
          </div>
        </section>

        {/* ── 4. 농장 갤러리 ── */}
        {diaries.length > 0 && diaries.filter((d: any) => d.date === diaries[0].date).some((d: any) => d.image || d.video) && (
          <FarmGallery diaries={diaries.filter((d: any) => d.date === diaries[0].date && (d.image || d.video))} />
        )}

        {/* ── 5. 거제 맛집 지도 ── */}
        <section className="mb-14 px-2">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">📍</span>
            <h2 className="text-lg font-bold text-slate-800">거제 맛집 지도</h2>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
            <MapLoader />
          </div>
          <AdBanner />
        </section>

        {/* ── 6. 최신 블로그 글 (카드형) ── */}
        <section className="mb-14 px-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <h2 className="text-lg font-bold text-slate-800">최신 블로그</h2>
            </div>
            <Link href="/blog" className="text-slate-400 hover:text-teal-600 text-xs font-bold transition-all">전체보기 →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogPosts.map((post: any) => (
              <Link href={`/blog/${post.slug}`} key={post.slug}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {post.category && (
                    <span className="text-xs bg-cyan-50 text-cyan-600 px-2 py-0.5 rounded-full font-bold">{post.category}</span>
                  )}
                  <span className="text-xs text-slate-400 ml-auto">{post.date}</span>
                </div>
                <div className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{post.title}</div>
                {post.summary && (
                  <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{post.summary}</div>
                )}
                <div className="text-xs text-cyan-500 font-bold mt-auto">읽기 →</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 7. 이달의 행사 ── */}
        <section className="mb-14 px-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌸</span>
              <h2 className="text-lg font-bold text-slate-800">이달의 행사</h2>
            </div>
            <Link href="/events" className="text-slate-400 hover:text-teal-600 text-xs font-bold transition-all">전체보기 →</Link>
          </div>
          <AccordionSection type="event"
            items={data.events.slice(0, 5).map(event => ({
              id: event.id, title: event.name,
              date: `${event.startDate} ~ ${event.endDate}`,
              summary: event.summary, category: event.category,
              location: event.location, link: `/events/${event.id}`
            }))}
          />
        </section>

        {/* ── 8. 오늘의 인사이트 (시 + AI랭킹) ── */}
        <section className="mb-14 px-2">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-slate-800">오늘의 인사이트</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <DailyPoemClient poems={poems} />
            <AIRanking />
          </div>
        </section>

        {/* ── 9. 트렌드 & 지식 (통합 슬림) ── */}
        {(aiNews.length > 0 || economyNews.length > 0 || idioms.length > 0 || wisdoms.length > 0) && (
          <section className="mb-14 px-2 flex flex-col gap-2">
            {aiNews.length > 0 && <DailyNewsClient data={aiNews} type="ai" />}
            {economyNews.length > 0 && <DailyNewsClient data={economyNews} type="economy" />}
            <div className="h-3" />
            {idioms.length > 0 && <DailyIdiomClient idioms={idioms} />}
            {wisdoms.length > 0 && <DailyWisdomClient wisdoms={wisdoms} />}
          </section>
        )}

        {/* ── 10. 거꾸로 세계지도 (하단 슬림) ── */}
        <section className="mb-14 px-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <h2 className="text-base font-bold text-slate-700">해양수산부 거꾸로 세계지도</h2>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-bold">무료 배포</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <img src="/assets/upside-down-world-map-v1.jpg" alt="거꾸로 세계지도"
              className="w-full sm:w-64 h-auto rounded-xl object-cover" />
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500 leading-relaxed">
                해양 중심으로 세상을 바라보는 새로운 시각 — 해양수산부 공공저작물
              </p>
              <div className="flex gap-4">
                <a href="/assets/upside-down-world-map-v1.jpg" download="거꾸로세계지도-일반형.jpg"
                  className="text-sm font-bold text-cyan-600 hover:underline">v1 내려받기</a>
                <a href="/assets/upside-down-world-map-v2.jpg" download="거꾸로세계지도-해양테마.jpg"
                  className="text-sm font-bold text-cyan-600 hover:underline">v2 내려받기</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 쿠팡 배너 ── */}
        <div className="px-2 mb-14">
          <CoupangBanner />
        </div>

      </main>

      <footer className="bg-white/30 backdrop-blur-md border-t border-white/50 py-12 text-slate-500 text-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-1">Chamnongkkun Info</h2>
              <p className="text-slate-400 text-xs">The Best Guide to Geoje Island 🐬</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 font-bold text-xs text-slate-400">
              <Link href="/about" className="hover:text-cyan-600">소개</Link>
              <Link href="/update-events" className="hover:text-cyan-600">업데이트</Link>
              <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">스토어</a>
              <span className="cursor-help">개인정보처리방침</span>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-slate-400">
            <p>© 2026 chamnongkkun-info. All rights reserved.</p>
            <p className="italic font-serif">"푸른 바다와 함께하는 생생한 거제 소식"</p>
          </div>
        </div>
      </footer>
      <ScrollToTop />
    </div>
  );
}
