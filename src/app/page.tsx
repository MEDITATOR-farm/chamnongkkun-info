import { NavLinks, HeroButton, GlassCard, ContentCard } from "@/components/GlassCard";
import fs from "fs";
import path from "path";
import AIRanking from "@/components/AIRanking";
import AdBanner from "@/components/AdBanner";
import MapLoader from "@/components/MapLoader";
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
import HighRevenueSection from "@/components/HighRevenueSection";

interface InfoItem {
  id: number; name: string; category: string;
  startDate: string; endDate: string; location: string;
  target: string; summary: string; link: string;
}
interface Data { events: InfoItem[]; blogPosts: any[]; }

function readJson(filePath: string, fallback: any = []) {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return fallback; }
}

const getData = (): Data =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "public/data/chamnongkkun-info.json"), "utf-8"));

const G: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "20px",
};

function SectionTitle({ icon, text, href, badge }: { icon: string; text: string; href?: string; badge?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", margin: 0 }}>{text}</h2>
      {badge && (
        <span style={{ fontSize: "0.62rem", background: "#ef4444", color: "white", padding: "2px 7px", borderRadius: "20px", fontWeight: 700 }}>{badge}</span>
      )}
      {href && (
        <a href={href} style={{ marginLeft: "auto", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          전체보기 →
        </a>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "2.8rem 0" }} />;
}

export default function Home() {
  const data = getData();
  let diaries = readJson(path.join(process.cwd(), "public/data/diaries.json"));
  diaries = diaries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const poems = readJson(path.join(process.cwd(), "public/data/poems.json"));
  const idioms = readJson(path.join(process.cwd(), "public/data/idioms.json"));
  const wisdoms = readJson(path.join(process.cwd(), "public/data/wisdom.json"));
  const aiNews = readJson(path.join(process.cwd(), "public/data/ai-news.json"));
  const economyNews = readJson(path.join(process.cwd(), "public/data/economy.json"));
  const books = readJson(path.join(process.cwd(), "public/data/books.json"), null);
  const blogPosts = getSortedPostsData().slice(0, 6);

  const tagColors: Record<string, string> = {
    행사: "#22d3ee", 농업: "#34d399", 부동산: "#60a5fa",
    복지: "#fdba74", 지원금: "#a78bfa", 귀농: "#86efac",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d2247 0%, #1a3f7a 35%, #165070 65%, #0d3528 100%)",
      color: "white", overflowX: "hidden",
    }}>

      {/* 배경 오브 */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.25), transparent 70%)", top: -150, left: -150, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%)", bottom: "10%", right: -100, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.14), transparent 70%)", top: "40%", left: "50%", filter: "blur(50px)" }} />
      </div>

      {/* ── 네비게이션 ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, height: "56px",
        padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(6,15,30,0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em" }}>
          Chamnongkkun <span style={{ color: "#22d3ee" }}>거제소식</span>
        </div>
        <NavLinks />
      </nav>

      {/* ── 히어로 ── */}
      <header style={{ position: "relative", zIndex: 1, minHeight: "440px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/daebyeongdaedo_lined.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,15,30,0.1), rgba(6,15,30,0.3))" }} />

        {/* 중앙 텍스트 */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem 1.5rem", maxWidth: "680px" }}>
          <div style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.18em",
            color: "#22d3ee", border: "1px solid rgba(34,211,238,0.3)", padding: "4px 16px",
            borderRadius: "30px", marginBottom: "1.2rem", background: "rgba(34,211,238,0.08)",
          }}>GEOJE · 거제 🐬</div>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.25, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
            Chamnongkkun과<br /><span style={{ color: "#22d3ee" }}>함께하는 거제소식</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.55)", marginBottom: "1.8rem", lineHeight: 1.7 }}>
            지원금 · 농업 · 행사 · 맛집 — 거제 생활의 모든 정보
          </p>
          <HeroButton />
        </div>

        {/* 날씨 위젯 - 우측 상단 (모바일에서 숨김) */}
        <div style={{
          position: "absolute",
          top: "1.2rem",
          right: "1.5rem",
          zIndex: 3,
          minWidth: "200px",
          maxWidth: "240px",
          display: "var(--weather-display, block)",
        }}
          className="hidden sm:block"
        >
          <WeatherWidget />
        </div>

      </header>

      {/* ── 메인 ── */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* ① 알면 돈이 되는 정보 */}
        <HighRevenueSection />
        <Divider />

        {/* ② 거제시 이달의 행사 */}
        <section>
          <SectionTitle icon="🌸" text="거제시 이달의 행사" href="/events" badge="이달" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "10px" }}>
            {data.events
              .filter((event: any) => new Date(event.endDate) >= new Date())
              .slice(0, 6)
              .map((event: any) => (
                <ContentCard
                  key={event.id}
                  href={`/events/${event.id}`}
                  category={event.category}
                  date={`${event.startDate} ~ ${event.endDate}`}
                  title={event.name}
                  summary={event.summary}
                  tagColor={tagColors[event.category] || "rgba(255,255,255,0.5)"}
                  meta={event.location}
                />
              ))}
          </div>
        </section>
        <Divider />

        {/* ③ 내가 자주 찾는 거제 숨은 맛집 */}
        <section>
          <SectionTitle icon="🍽️" text="내가 자주 찾는 거제 숨은 맛집" badge="현지인 픽" />
          <div style={{ ...G, overflow: "hidden" }}>
            <MapLoader />
          </div>
          <div style={{ marginTop: "12px" }}><AdBanner /></div>
        </section>
        <Divider />

        {/* ④ 최신 거제시 블로그 */}
        <section>
          <SectionTitle icon="📝" text="최신 거제시 블로그" href="/blog" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "10px" }}>
            {blogPosts.map((post: any) => (
              <ContentCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                category={post.category}
                date={post.date}
                title={post.title}
                summary={post.summary}
                tagColor={tagColors[post.category] || "rgba(255,255,255,0.5)"}
              />
            ))}
          </div>
        </section>
        <Divider />

        {/* ⑤ 트렌드 & 지식 */}
        {(aiNews.length > 0 || economyNews.length > 0 || idioms.length > 0 || wisdoms.length > 0) && (
          <section style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <SectionTitle icon="📡" text="트렌드 & 지식" />
            {aiNews.length > 0 && <div style={{ ...G, overflow: "hidden" }}><DailyNewsClient data={aiNews} type="ai" /></div>}
            {economyNews.length > 0 && <div style={{ ...G, overflow: "hidden" }}><DailyNewsClient data={economyNews} type="economy" /></div>}
            {idioms.length > 0 && <div style={{ ...G, overflow: "hidden" }}><DailyIdiomClient idioms={idioms} /></div>}
            {wisdoms.length > 0 && <div style={{ ...G, overflow: "hidden" }}><DailyWisdomClient wisdoms={wisdoms} /></div>}
          </section>
        )}
        <Divider />

        {/* ⑥ 오늘의 인사이트 */}
        <section>
          <SectionTitle icon="✨" text="오늘의 인사이트" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", alignItems: "start" }}>
            <div style={{ ...G, overflow: "hidden" }}><DailyPoemClient poems={poems} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ ...G, overflow: "hidden" }}><AIRanking /></div>
              <div style={{ ...G, overflow: "hidden" }}><BookRankingClient data={books} /></div>
            </div>
          </div>
        </section>
        <Divider />

        {/* ⑦ 농장 최근 현황 (갤러리) */}
        {diaries.length > 0 && diaries.filter((d: any) => d.date === diaries[0].date).some((d: any) => d.image || d.video) && (
          <section>
            <SectionTitle icon="🎬" text="농장 최근 현황" />
            <FarmGallery diaries={diaries.filter((d: any) => d.date === diaries[0].date && (d.image || d.video))} />
          </section>
        )}
        <Divider />

        {/* ⑧ 거꾸로 세계지도 */}
        <section>
          <SectionTitle icon="🌍" text="해양수산부 거꾸로 세계지도" />
          <GlassCard style={{ padding: "1.2rem", display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
            <img src="/assets/upside-down-world-map-v1.jpg" alt="거꾸로 세계지도"
              style={{ width: "200px", height: "auto", borderRadius: "12px", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1rem" }}>
                해양 중심으로 세상을 바라보는 시각 — 해양수산부 공공저작물
              </p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <a href="/assets/upside-down-world-map-v1.jpg" download
                  style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22d3ee", textDecoration: "none" }}>
                  v1 내려받기 ↓
                </a>
                <a href="/assets/upside-down-world-map-v2.jpg" download
                  style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22d3ee", textDecoration: "none" }}>
                  v2 내려받기 ↓
                </a>
              </div>
            </div>
          </GlassCard>
        </section>
        <Divider />

        <CoupangBanner />
      </main>

      {/* ── 푸터 ── */}
      <footer style={{
        position: "relative", zIndex: 1,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "3rem 2rem",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", marginBottom: "4px" }}>Chamnongkkun Info</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>THE BEST GUIDE TO GEOJE ISLAND 🐬</div>
            </div>
            <div style={{ display: "flex", gap: "1.8rem", flexWrap: "wrap" }}>
              {([["소개", "/about"], ["업데이트", "/update-events"]] as [string, string][]).map(([t, h]) => (
                <a key={h} href={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>{t}</a>
              ))}
              <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none" }}>스토어</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.18)" }}>© 2026 chamnongkkun-info. All rights reserved.</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>"푸른 바다와 함께하는 생생한 거제 소식"</p>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}
