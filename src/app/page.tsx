import Link from "next/link";
import fs from "fs";
import path from "path";
import AdBanner from "@/components/AdBanner";
import CoupangBanner from "@/components/CoupangBanner";

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
          <div className="grid gap-4">
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

        {/* 💰 중간 광고 (AdSense) */}
        <AdBanner />

        {/* 🌸 오늘의 시 & 행사 & 꿀팁 통합 레이아웃 */}
        <div className="flex flex-col lg:flex-row gap-8 mb-24 relative z-10 items-start">
          
          {/* ===== 오늘의 시 섹션 (왼쪽 사이드바) ===== */}
          <section style={{
            flex: "0 0 380px",
            padding: "50px 24px",
            background: "#faf8f5",
            textAlign: "center",
            borderRadius: "3rem",
            width: "100%",
            position: "sticky",
            top: "20px"
          }}>
            <p style={{ color: "#a0917e", letterSpacing: 4, fontSize: 10, marginBottom: 8 }}>POEM OF THE DAY</p>
            <h2 style={{ fontSize: 18, marginBottom: 24, color: "#3d3228", fontWeight: "normal" }}>오늘의 시</h2>

            {latestPoem ? (
              <div style={{
                background: latestPoem.bgColor,
                color: latestPoem.textColor,
                borderRadius: 16,
                padding: "36px 24px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
                fontFamily: "'Noto Serif KR', serif",
                textAlign: "left"
              }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: latestPoem.accentColor, marginBottom: 10, textTransform: "uppercase" }}>
                  {latestPoem.mood}
                </div>
                <h3 style={{ fontSize: 16, marginBottom: 8, fontWeight: "bold" }}>{latestPoem.title}</h3>
                {latestPoem.author && <p style={{ fontSize: 11, marginBottom: 20, opacity: 0.7 }}>— {latestPoem.author}</p>}
                <p style={{ fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{latestPoem.content}</p>
                <p style={{ marginTop: 20, fontSize: 9, opacity: 0.4 }}>{latestPoem.date}</p>
              </div>
            ) : (
              <p style={{ color: "#ccc" }}>아직 등록된 시가 없어요 📖</p>
            )}

            {poems.length > 1 && (
              <a href="/poems" style={{ display: "inline-block", marginTop: 20, color: "#a0917e", fontSize: 12, textDecoration: "none", borderBottom: "1px solid #a0917e" }}>
                지난 시 모두 보기 →
              </a>
            )}
          </section>

          {/* ===== 오른쪽 정보 영역 (행사 + 꿀팁) ===== */}
          <div className="flex-grow w-full space-y-16">
            
            {/* 1. 이번 달 행사/축제 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800">🌸 이번 달 행사/축제</h2>
                <Link href="/blog" className="text-xs font-bold text-emerald-600 hover:underline">전체보기 →</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.events.slice(0, 4).map((event) => {
                  const styles = getSeasonStyles(event.name);
                  return (
                    <div key={event.id} className={`group relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} p-0.5 transition-all hover:shadow-lg`}>
                      <div className="bg-white rounded-[0.9rem] p-5 h-full flex flex-col">
                        <span className={`self-start mb-2 rounded-full px-2 py-0.5 text-[9px] font-bold ${styles.badge}`}>{event.category}</span>
                        <h3 className={`mb-2 text-base font-black ${styles.text} leading-tight`}>{event.name}</h3>
                        <p className="text-slate-500 text-[11px] mb-3 truncate">📍 {event.location}</p>
                        <p className="text-slate-600 text-xs line-clamp-2 mb-4 flex-grow">{event.summary}</p>
                        <Link href={`/events/${event.id}`} className={`block w-full rounded-lg ${styles.accent} py-2 text-center font-bold text-[11px] text-white`}>상세 정보</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. 우리 동네 꿀팁 & 혜택 */}
            <section id="category-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-800">💎 우리 동네 꿀팁 & 혜택</h2>
                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">총 {data.benefits.length}건</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.benefits.slice(0, 4).map((benefit) => (
                  <div key={benefit.id} className="group relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all hover:ring-blue-200">
                    <h3 className="mb-2 text-base font-black text-slate-800 group-hover:text-blue-600">{benefit.name}</h3>
                    <p className="text-blue-600 font-bold text-[10px] mb-2">🎯 {benefit.target}</p>
                    <p className="text-slate-600 text-xs line-clamp-2 mb-4">{benefit.summary}</p>
                    <Link href={`/benefits/${benefit.id}`} className="text-xs font-bold text-blue-500 hover:text-blue-700">더 알아보기 →</Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
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
