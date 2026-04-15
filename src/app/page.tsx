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
  id: number; name: string; category: string;
  startDate: string; endDate: string; location: string;
  target: string; summary: string; link: string;
}
interface Data { events: InfoItem[]; blogPosts: any[]; }

function readJson(filePath: string, fallback: any = []) {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return fallback; }
}

function getDiaries() {
  const d = readJson(path.join(process.cwd(), "public/data/diaries.json"));
  return d.sort((a: any, b: any) => b.id - a.id);
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

function SectionTitle({ icon, text, href }: { icon: string; text: string; href?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "white", margin: 0 }}>{text}</h2>
      {href && (
        <Link href={href} style={{ marginLeft: "auto", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>
          전체보기 →
        </Link>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "2.8rem 0" }} />;
}

export default function Home() {
  const data = getData();
  let diaries = getDiaries();
  diaries = diaries.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const poems = readJson(path.join(process.cwd(), "public/data/poems.json"));
  const idioms = readJson(path.join(process.cwd(), "public/data/idioms.json"));
  const wisdoms = readJson(path.join(process.cwd(), "public/data/wisdom.json"));
  const aiNews = readJson(path.join(process.cwd(), "public/data/ai-news.json"));
  const economyNews = readJson(path.join(process.cwd(), "public/data/economy.json"));
  const books = readJson(path.join(process.cwd(), "public/data/books.json"), null);
  const youthSupport = readJson(path.join(process.cwd(), "public/data/youth-support.json"), null);
  const farmSupport = readJson(path.join(process.cwd(), "public/data/farm-support.json"), null);
  const blogPosts = getSortedPostsData().slice(0, 6);

  const tagColors: Record<string, string> = {
    행사: "#22d3ee", 농업: "#34d399", 부동산: "#60a5fa",
    복지: "#fdba74", 지원금: "#a78bfa", 귀농: "#86efac",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060f1e 0%, #0a1e3a 35%, #0b2d3e 65%, #081a14 100%)",
      color: "white",
      cursor: "none",
      overflowX: "hidden",
    }}>
      {/* 배경 오브 */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.15), transparent 70%)", top: -150, left: -150, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)", bottom: "10%", right: -100, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)", top: "40%", left: "50%", filter: "blur(50px)" }} />
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
        <div style={{ display: "flex", gap: "1.8rem", alignItems: "center" }}>
          {([["홈", "/"], ["블로그", "/blog"], ["지원금", "/support/youth"], ["소개", "/about"]] as [string,string][]).map(([t, h]) => (
            <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none", cursor: "none" }}>{t}</Link>
          ))}
          <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer"
            style={{ color: "#22d3ee", fontSize: "0.82rem", fontWeight: 700, textDecoration: "none", cursor: "none" }}>🛒 스토어</a>
        </div>
      </nav>

      {/* ── 히어로 ── */}
      <header style={{ position: "relative", zIndex: 1, minHeight: "440px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/images/daebyeongdaedo_lined.png')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.22 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,15,30,0.35), rgba(6,15,30,0.65))" }} />
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
          <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" data-hover="true"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px", cursor: "none",
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              color: "white", fontWeight: 700, fontSize: "0.9rem",
              padding: "12px 28px", borderRadius: "40px", textDecoration: "none",
            }}>🛍️ 참농꾼 스토어 바로가기 →</a>
        </div>
      </header>

      {/* ── 메인 ── */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>

        {/* 1. 알면 돈이 되는 정보 */}
        <HighRevenueSection />
        <Divider />

        {/* 2. 오늘의 지원금 */}
        {(youthSupport || farmSupport) && (
          <section>
            <SectionTitle icon="💸" text="오늘의 지원금 요약" href="/support/youth" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px" }}>
              {[...(youthSupport?.supports?.slice(0, 3) || []), ...(farmSupport?.supports?.slice(0, 3) || [])].map((s: any, i: number) => (
                <Link key={i} href={i < 3 ? "/support/youth" : "/support/farm"} style={{ textDecoration: "none" }}>
                  <div data-hover="true" style={{ ...G, padding: "14px 16px", cursor: "none", display: "flex", alignItems: "center", gap: "12px", transition: "background 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.11)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{i < 3 ? "💰" : "🌾"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.7rem", color: i < 3 ? "#22d3ee" : "#34d399", fontWeight: 700, marginBottom: "2px" }}>{s.tag}</div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700 }}>{s.amount}</div>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <Divider />

        {/* 3. 농부일기 + 날씨/도서 */}
        <section>
          <SectionTitle icon="🌱" text="최근 농부일기" href="/diaries" />
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 58%", minWidth: "280px" }}>
              <div style={{ ...G, padding: "1.2rem" }}>
                {diaries.length > 0 ? (
                  <AccordionSection type="diary"
                    items={diaries.filter((d: any) => d.date === diaries[0].date).slice(0, 5).map((d: any) => ({
                      id: d.id, title: d.title, date: d.date, content: d.content,
                      image: d.image, video: d.video, link: `/diaries/${d.id}`,
                    }))} />
                ) : (
                  <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "2rem 0", fontSize: "0.85rem" }}>새로운 일기를 기다리고 있습니다.</p>
                )}
              </div>
            </div>
            <div style={{ flex: "1 1 28%", minWidth: "210px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ ...G, overflow: "hidden" }}><WeatherWidget /></div>
              <div style={{ ...G, overflow: "hidden" }}><BookRankingClient data={books} /></div>
            </div>
          </div>
        </section>

        {/* 4. 농장 갤러리 */}
        {diaries.length > 0 && diaries.filter((d: any) => d.date === diaries[0].date).some((d: any) => d.image || d.video) && (
          <><Divider /><FarmGallery diaries={diaries.filter((d: any) => d.date === diaries[0].date && (d.image || d.video))} /></>
        )}
        <Divider />

        {/* 5. 최신 블로그 카드형 */}
        <section>
          <SectionTitle icon="📝" text="최신 블로그" href="/blog" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "10px" }}>
            {blogPosts.map((post: any) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                <div data-hover="true" style={{ ...G, padding: "1rem 1.1rem", cursor: "none", display: "flex", flexDirection: "column", gap: "6px", height: "100%", transition: "background 0.2s, transform 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.11)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {post.category && (
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", color: tagColors[post.category] || "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.08)" }}>{post.category}</span>
                    )}
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginLeft: "auto" }}>{post.date}</span>
                  </div>
                  <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "white", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{post.title}</div>
                  {post.summary && (
                    <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>{post.summary}</div>
                  )}
                  <div style={{ fontSize: "0.72rem", color: "#22d3ee", fontWeight: 700, marginTop: "auto" }}>읽기 →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <Divider />

        {/* 6. 거제 맛집 지도 */}
        <section>
          <SectionTitle icon="📍" text="거제 맛집 지도" />
          <div style={{ ...G, overflow: "hidden" }}><MapLoader /></div>
          <div style={{ marginTop: "12px" }}><AdBanner /></div>
        </section>
        <Divider />

        {/* 7. 이달의 행사 */}
        <section>
          <SectionTitle icon="🌸" text="이달의 행사" href="/events" />
          <div style={{ ...G, padding: "1.2rem" }}>
            <AccordionSection type="event"
              items={data.events.slice(0, 5).map(event => ({
                id: event.id, title: event.name,
                date: `${event.startDate} ~ ${event.endDate}`,
                summary: event.summary, category: event.category,
                location: event.location, link: `/events/${event.id}`,
              }))} />
          </div>
        </section>
        <Divider />

        {/* 8. 오늘의 인사이트 */}
        <section>
          <SectionTitle icon="✨" text="오늘의 인사이트" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
            <div style={{ ...G, overflow: "hidden" }}><DailyPoemClient poems={poems} /></div>
            <div style={{ ...G, overflow: "hidden" }}><AIRanking /></div>
          </div>
        </section>
        <Divider />

        {/* 9. 트렌드 & 지식 */}
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

        {/* 10. 거꾸로 세계지도 (슬림) */}
        <section>
          <SectionTitle icon="🌍" text="해양수산부 거꾸로 세계지도" />
          <div style={{ ...G, padding: "1.2rem", display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap" }}>
            <img src="/assets/upside-down-world-map-v1.jpg" alt="거꾸로 세계지도" style={{ width: "200px", height: "auto", borderRadius: "12px", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "1rem" }}>해양 중심으로 세상을 바라보는 시각 — 해양수산부 공공저작물</p>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                <a href="/assets/upside-down-world-map-v1.jpg" download style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22d3ee", textDecoration: "none", cursor: "none" }}>v1 내려받기 ↓</a>
                <a href="/assets/upside-down-world-map-v2.jpg" download style={{ fontSize: "0.82rem", fontWeight: 700, color: "#22d3ee", textDecoration: "none", cursor: "none" }}>v2 내려받기 ↓</a>
              </div>
            </div>
          </div>
        </section>
        <Divider />

        <CoupangBanner />
      </main>

      {/* ── 푸터 ── */}
      <footer style={{ position: "relative", zIndex: 1, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "white", marginBottom: "4px" }}>Chamnongkkun Info</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>THE BEST GUIDE TO GEOJE ISLAND 🐬</div>
            </div>
            <div style={{ display: "flex", gap: "1.8rem", flexWrap: "wrap" }}>
              {([["소개", "/about"], ["업데이트", "/update-events"]] as [string,string][]).map(([t, h]) => (
                <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", cursor: "none" }}>{t}</Link>
              ))}
              <a href="https://smartstore.naver.com/chamnongkkun" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", fontWeight: 600, textDecoration: "none", cursor: "none" }}>스토어</a>
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
