import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <header className="bg-white border-b border-neutral-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-cyan-600 tracking-tighter">우리 동네 소식통</Link>
          <nav className="flex gap-6 font-bold text-neutral-600">
            <Link href="/" className="hover:text-cyan-600 transition-colors">홈</Link>
            <Link href="/blog" className="hover:text-cyan-600 transition-colors">블로그</Link>
            <Link href="/about" className="text-cyan-600">소개</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-8 leading-tight">
            지역 주민을 위한<br />
            <span className="text-cyan-600">가장 쉽고 빠른 생활 정보</span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed mb-8">
            '우리 동네 소식통'은 거제시를 비롯한 우리 지역의 소중한 정보를 한눈에 확인할 수 있는 생활 정보 플랫폼입니다. 
            바쁜 일상 속에서 놓치기 쉬운 지자체 혜택, 행사, 지원금 정보를 누구나 쉽고 빠르게 접할 수 있도록 돕기 위해 시작되었습니다.
          </p>
        </section>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
            <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🏛️</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">정확한 공공데이터 기반</h3>
            <p className="text-neutral-600 leading-relaxed">
              모든 소식은 대한민국 공공데이터포털(data.go.kr)과 각 지자체 공식 홈페이지의 검증된 자료를 바탕으로 수집됩니다. 
              부정확한 정보 대신 공식적인 출처를 기반으로 한 믿을 수 있는 정보를 제공합니다.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-4">스마트한 AI 콘텐츠 생성</h3>
            <p className="text-neutral-600 leading-relaxed">
              복잡하고 읽기 어려운 공보 문구나 정책 정보를 AI 기술(Gemini)을 활용하여 이해하기 쉬운 블로그 형태로 가공합니다. 
              지역 주민의 눈높이에서 가장 핵심적인 내용을 친근하게 전달합니다.
            </p>
          </div>
        </div>

        <section className="mt-20 p-10 bg-cyan-900 rounded-[3rem] text-white">
          <h3 className="text-2xl font-bold mb-6">운영 철학</h3>
          <ul className="space-y-4 opacity-90">
            <li className="flex gap-3">
              <span className="text-cyan-400">✓</span>
              <span>지역 경제와 공동체의 상생을 최우선 가치로 둡니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">✓</span>
              <span>정보 소외 계층 없이 누구나 혜택을 누릴 수 있는 환경을 만듭니다.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400">✓</span>
              <span>매일 업데이트되는 최신 정보로 지역의 활기를 더합니다.</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="py-20 text-center text-neutral-400 text-sm">
        © 2025 우리 동네 소식통 (chamnongkkun-info). All rights reserved.
      </footer>
    </div>
  );
}
