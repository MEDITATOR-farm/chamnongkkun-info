import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* 네비게이션 (메인 페이지와 동일 스타일) */}
      <nav className="fixed top-0 inset-x-0 z-50 h-20 px-6 md:px-12 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-primary/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black">C</div>
          <span className="text-xl font-serif font-black tracking-tighter">참농꾼</span>
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">홈</Link>
          <Link href="/#map" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">거제지도</Link>
          <Link href="/#wisdom" className="text-sm font-semibold text-foreground/60 hover:text-primary transition-colors">오늘의시</Link>
          <Link href="/about" className="text-sm font-semibold text-primary transition-colors">소개</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-40 pb-40">

        {/* 히어로 */}
        <section className="mb-32 reveal-up">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-black tracking-widest mb-8 uppercase">
                Our Story · 게으른 농부의 이야기
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-black mb-10 leading-[1.1] tracking-tight">
                거제도 한쪽에서<br />
                <span className="text-primary">그냥 살고 있습니다.</span>
              </h1>
              <p className="text-xl text-foreground/50 leading-relaxed max-w-xl font-medium">
                땅 파고, 씨 뿌리고, 가끔 바다 보고.<br />
                별거 없는 하루를 기록하는 게으른 농부입니다.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img
                src="/images/farmer-character.png"
                alt="게으른 농부 캐릭터"
                className="w-64 md:w-80 drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* 철학 카드 3개 */}
        <section className="grid gap-8 md:grid-cols-3 mb-32 reveal-up reveal-delay-1">
          {[
            {
              icon: "🌱",
              title: "진정성의 기록",
              desc: "매일의 농장 생활을 있는 그대로 기록합니다. 거짓 없는 땀방울이 쌓여 신뢰가 됩니다."
            },
            {
              icon: "📍",
              title: "직접 발굴한 정보",
              desc: "광고 없이, 직접 가보고 먹어보고 경험한 거제의 맛집과 명소만을 소개합니다."
            },
            {
              icon: "⏳",
              title: "시간이 쌓이는 가치",
              desc: "기록이 누적될수록 더 깊어지는 신뢰. 이 페이지는 사장님의 살아있는 역사입니다."
            }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="glass-nature rounded-[32px] p-10 hover:-translate-y-2 transition-all duration-500">
              <div className="w-14 h-14 bg-primary/5 rounded-[16px] flex items-center justify-center mb-8">
                <span className="text-3xl">{icon}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-4">{title}</h3>
              <p className="text-foreground/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* 약속 섹션 */}
        <section className="bg-primary rounded-[56px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/10 reveal-up reveal-delay-2">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="text-secondary font-black tracking-[0.3em] text-xs uppercase mb-4 block">Our Promise</span>
            <h3 className="text-3xl md:text-4xl font-serif font-black mb-12 tracking-tight">참농꾼의 약속 🤝</h3>
            <ul className="space-y-10">
              {[
                "매일 직접 기록하는 정직한 농부의 일상을 공유합니다.",
                "직접 경험하지 않은 정보는 절대 소개하지 않습니다.",
                "방문하는 모든 분들이 거제를 더 깊이 사랑할 수 있도록 안내합니다."
              ].map((text, i) => (
                <li key={i} className="flex gap-6 items-start">
                  <span className="flex-shrink-0 w-10 h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center text-sm font-black">
                    {i + 1}
                  </span>
                  <span className="text-white/80 font-medium text-lg md:text-xl leading-relaxed pt-1">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </main>

      {/* 푸터 */}
      <footer className="bg-primary/5 border-t border-primary/5 py-16 text-center">
        <p className="text-foreground/20 text-xs font-black tracking-widest uppercase">
          © 2026 Chamnongkkun · 거제도 참농꾼의 기록
        </p>
      </footer>
    </div>
  );
}
