import { NavLinks, HeroButton, GlassCard, SectionHeader } from "@/components/GlassCard";
import fs from "fs";
import path from "path";
import MapLoader from "@/components/MapLoader";
import SpotMapLoader from "@/components/SpotMapLoader";
import FarmGallery from "@/components/FarmGallery";
import DailyIdiomClient from "@/components/DailyIdiomClient";
import DailyWisdomClient from "@/components/DailyWisdomClient";
import DailyPoemClient from "@/components/DailyPoemClient";
import WeatherWidget, { WeatherWidgetCompact } from "@/components/WeatherWidget";
import ScrollToTop from "@/components/ScrollToTop";

function readJson(filePath: string, fallback: any = []) {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return fallback; }
}

const getData = () => {
  const filePath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

export default function Home() {
  const data = getData();
  let diaries = readJson(path.join(process.cwd(), "public/data/diaries.json"));
  diaries = diaries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const poems = readJson(path.join(process.cwd(), "public/data/poems.json"));
  const idioms = readJson(path.join(process.cwd(), "public/data/idioms.json"));
  const wisdoms = readJson(path.join(process.cwd(), "public/data/wisdom.json"));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      
      {/* ── 네비게이션 ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-primary/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">C</div>
          <span className="text-xl font-serif font-black tracking-tighter">참농꾼</span>
        </div>
        <div className="flex items-center gap-4">
          <NavLinks />
          <WeatherWidgetCompact />
        </div>
      </nav>

      {/* ── 히어로 ── */}
      <header className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* 히어로 배경 이미지 */}
        <div className="absolute inset-0 z-0 scale-105 animate-float opacity-20">
          <img 
            src="/premium_nature_farm_hero_1778562582864.png" 
            alt="Nature Background" 
            className="w-full h-full object-cover blur-[2px]" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-1"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center reveal-up">
          <span className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest mb-10 uppercase">
            ESTABLISHED 2024 · 거제도 참농꾼
          </span>

          {/* 메인 타이틀: 나눔명조체 감성 폰트 */}
          <h1 className="font-serif mb-6 leading-[1.3] tracking-tight">
            <span className="block text-3xl md:text-5xl text-foreground/40 font-normal mb-2"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif", letterSpacing: "0.05em" }}
            >
              자급자족을 꿈꾸는
            </span>
            <span className="block text-5xl md:text-7xl font-black text-foreground"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
            >
              “게으른 농부”
            </span>
            <span className="block text-2xl md:text-3xl text-primary font-normal mt-4"
              style={{ fontFamily: "var(--font-nanum-myeongjo), serif", fontStyle: "italic" }}
            >
              의 삶의 이야기
            </span>
          </h1>

          <p className="text-base md:text-lg text-foreground/50 max-w-xl mx-auto mb-12 leading-[2] font-medium"
            style={{ fontFamily: "var(--font-nanum-myeongjo), serif" }}
          >
            서둘러 가지 않아도 되는 일들, 너무 급하지 않아도 되는 어제들…<br />
            거제도 논밖에서 삐시왼이 쓴 진짜 농부의 하루하루.
          </p>
          <a href="#diary" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/30 hover:text-primary transition-colors">
            <span>기록 살펴보기</span>
            <span className="animate-bounce">↓</span>
          </a>
        </div>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main className="max-w-6xl mx-auto px-6 pb-40">
        
        {/* ① 농부일기 & 현장소식 (Timeline) */}
        <section id="diary" className="mb-40 pt-20">
          <SectionHeader 
            title="게으른 농부의 게으른 시간들.." 
            subtitle="THE CHRONICLE" 
            icon="🌿" 
          />
          <div className="reveal-up reveal-delay-1">
            <FarmGallery diaries={diaries} />
          </div>
        </section>

        {/* ② 거제 마스터 가이드 (Maps) */}
        <section id="map" className="mb-40 pt-20">
          <SectionHeader 
            title="거제의 숨은 보석" 
            subtitle="CURATED MAP" 
            icon="📍" 
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 reveal-up reveal-delay-2">
            <GlassCard className="!p-0 overflow-hidden border-2 border-primary/5">
              <div className="p-6 border-b border-primary/5 bg-primary/5">
                <h3 className="font-serif font-bold text-xl flex items-center gap-2">🍽️ 현지인 추천 맛집</h3>
                <p className="text-sm text-foreground/40 mt-1">직접 먹어보고 엄선한 맛집 지도입니다.</p>
              </div>
              <MapLoader />
            </GlassCard>
            <GlassCard className="!p-0 overflow-hidden border-2 border-primary/5">
              <div className="p-6 border-b border-primary/5 bg-primary/5">
                <h3 className="font-serif font-bold text-xl flex items-center gap-2">🏞️ 테마별 여행 코스</h3>
                <p className="text-sm text-foreground/40 mt-1">거제의 숨겨진 명소들을 안내합니다.</p>
              </div>
              <SpotMapLoader />
            </GlassCard>
          </div>
        </section>

        {/* ③ 오늘의 인사이트 (Wisdom & Poem) */}
        <section id="wisdom" className="pt-20">
          <SectionHeader 
            title="오늘의 인사이트" 
            subtitle="DAILY WISDOM" 
            icon="✨" 
          />
          <div className="max-w-3xl space-y-8 reveal-up reveal-delay-3">
            <div className="space-y-8">
              <GlassCard className="border-l-8 border-l-secondary bg-secondary/5">
                <DailyPoemClient poems={poems} />
              </GlassCard>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard className="bg-primary/5 border-t-4 border-t-primary">
                  <DailyIdiomClient idioms={idioms} />
                </GlassCard>
                <GlassCard className="bg-primary/5 border-t-4 border-t-primary">
                  <DailyWisdomClient wisdoms={wisdoms} />
                </GlassCard>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── 푸터 ── */}
      <footer className="bg-primary text-white/90 py-20 px-6 border-t-8 border-secondary">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <h2 className="text-3xl font-serif font-bold mb-4">참농꾼</h2>
            <p className="text-white/60 leading-relaxed font-serif italic text-lg">
              "자연과 함께 숨 쉬고,<br />
              정직한 땀방울로 거제의 삶을 기록합니다."
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold mb-6 text-secondary uppercase tracking-widest text-xs">Menu</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="/" className="hover:text-secondary transition-colors">홈</a></li>
                <li><a href="/#map" className="hover:text-secondary transition-colors">거제지도</a></li>
                <li><a href="/#wisdom" className="hover:text-secondary transition-colors">지혜/인사이트</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-secondary uppercase tracking-widest text-xs">Family</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="https://smartstore.naver.com/chamnongkkun" target="_blank" className="hover:text-secondary transition-colors">네이버 스토어</a></li>
                <li><a href="/about" className="hover:text-secondary transition-colors">참농꾼 소개</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-secondary uppercase tracking-widest text-xs">Philosophy</h4>
              <p className="text-xs text-white/40 leading-loose">
                우리는 매일의 기록을 통해<br />
                누적된 신뢰의 가치를 믿습니다.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-4 text-[10px] uppercase tracking-widest font-bold text-white/20">
          <p>© 2026 CHAMNONGKKUN INFO. ALL RIGHTS RESERVED.</p>
          <p>THE BEST GUIDE TO GEOJE ISLAND 🐬</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
