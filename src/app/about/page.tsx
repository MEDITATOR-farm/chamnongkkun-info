import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200">
      <header className="bg-white/30 backdrop-blur-md border-b border-white/50 px-6 py-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-slate-800 tracking-tighter hover:text-cyan-600 transition-colors">Chamnongkkun Info</Link>
          <nav className="flex gap-8 font-black text-xs tracking-widest uppercase text-slate-400">
            <Link href="/" className="hover:text-cyan-600 transition-colors">홈</Link>
            <Link href="/blog" className="hover:text-cyan-600 transition-colors">블로그</Link>
            <Link href="/about" className="text-cyan-600">소개</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-24">
        <section className="mb-24 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-10 leading-tight tracking-tighter">
            지역 주민을 위한<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">스마트한 생활 정보</span> 🐬
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl font-medium opacity-80">
            '참농꾼(Chamnongkkun)'은 거제시의 소중한 정보를 한눈에 확인할 수 있는 프리미엄 생활 정보 플랫폼입니다. 
            바쁜 일상 속에서 놓치기 쉬운 혜택과 행사 소식을 가장 세련된 방식으로 전해드립니다.
          </p>
        </section>

        <div className="grid gap-10 md:grid-cols-2 mb-24">
          <div className="glass-card p-12 rounded-[40px] hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-cyan-100/50 rounded-[24px] flex items-center justify-center mb-8 shadow-inner">
              <span className="text-3xl">🏛️</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">검증된 공공데이터</h3>
            <p className="text-slate-500 leading-relaxed font-medium opacity-80">
              대한민국 공공데이터포털(data.go.kr)과 지자체 공식 자료를 바탕으로 수집됩니다. 
              부정확한 소문 대신 신뢰할 수 있는 정보를 제공하여 현명한 일상을 돕습니다.
            </p>
          </div>

          <div className="glass-card p-12 rounded-[40px] hover:-translate-y-2 transition-all">
            <div className="w-16 h-16 bg-amber-100/50 rounded-[24px] flex items-center justify-center mb-8 shadow-inner">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">AI 큐레이션</h3>
            <p className="text-slate-500 leading-relaxed font-medium opacity-80">
              복잡한 정책 정보를 Gemini AI 기술을 활용하여 읽기 쉬운 형태로 가공합니다. 
              지역 주민의 눈높이에서 가장 핵심적인 내용을 친근하고 명확하게 전달합니다.
            </p>
          </div>
        </div>

        <section className="bg-slate-900 rounded-[56px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight">우리의 약속 🤝</h3>
            <ul className="space-y-8 font-bold text-lg md:text-xl">
              <li className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-black">1</span>
                <span className="opacity-90">지역 경제와 공동체의 상생을 최우선 가치로 둡니다.</span>
              </li>
              <li className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-black">2</span>
                <span className="opacity-90">누구도 소외되지 않는 정보 격차 해소를 위해 노력합니다.</span>
              </li>
              <li className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-black">3</span>
                <span className="opacity-90">매일 업데이트되는 최신 정보로 지역의 활기를 더합니다.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="py-24 text-center border-t border-slate-100">
         <p className="text-slate-400 text-xs font-black tracking-widest uppercase mb-4 opacity-60">© 2025 Chamnongkkun Info. All rights reserved.</p>
         <div className="flex justify-center gap-8 font-bold text-xs text-slate-300">
           <Link href="/" className="hover:text-cyan-600 transition-colors">HOME</Link>
           <Link href="/blog" className="hover:text-cyan-600 transition-colors">BLOG</Link>
           <Link href="/about" className="text-cyan-600">ABOUT</Link>
         </div>
      </footer>
    </div>
  );
}
