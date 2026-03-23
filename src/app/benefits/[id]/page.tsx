import Link from "next/link";
import fs from "fs";
import path from "path";

interface InfoItem {
  id: number;
  name: string;
  category: string;
  target: string;
  summary: string;
  link: string;
}

// 1. 모든 가능한 ID를 빌드 시점에 미리 알려줍니다 (정적 배포 필수 설정)
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  return data.benefits.map((benefit: InfoItem) => ({
    id: benefit.id.toString(),
  }));
}

// 2. 상세 페이지 내용을 렌더링합니다
export default async function BenefitDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const benefit = data.benefits.find((b: InfoItem) => b.id === parseInt(id));

  if (!benefit) return <div className="p-8 text-center min-h-screen flex items-center justify-center text-xl font-bold text-red-500">❌ 해당 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 overflow-x-hidden">
      {/* 상단 헤더 (공통 디자인) */}
      <header className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/header-bg.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-indigo-900/40" />
        
        <div className="relative z-20 text-center text-white p-6 drop-shadow-2xl">
          <Link href="/" className="mb-4 inline-block text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all">
            ← 목록으로 돌아가기
          </Link>
          <h1 className="text-4xl font-extrabold md:text-5xl tracking-tight mb-2">
            지원금 & 혜택 정보
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.43,84.43,101.45,112.33,161.85,116.82,222.25,121.3,275.46,65,321.39,56.44Z" fill="#f8fbff"></path>
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl relative">
        <article className={`rounded-[3rem] border-4 border-blue-200 bg-white p-8 md:p-16 shadow-2xl overflow-hidden relative`}>
          <div className="absolute -top-10 -right-10 text-[15rem] opacity-5 grayscale">💎</div>

          <div className="relative z-10">
            <div className="mb-10 block">
              <span className={`inline-block rounded-full px-6 py-2 text-sm font-black mb-6 bg-blue-100 text-blue-700 shadow-sm`}>
                {benefit.category}
              </span>
              <h2 className={`text-3xl md:text-5xl font-black text-slate-800 leading-tight`}>
                {benefit.name}
              </h2>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8 bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <div className="text-4xl">🎯</div>
                <div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-1">참여/수혜 대상</h3>
                  <p className="text-xl font-black text-blue-900">{benefit.target}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 leading-loose mb-12">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full" />
                상세 혜택 내용
              </h3>
              <div className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-inner italic text-lg leading-relaxed">
                {benefit.summary}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <a
                href={benefit.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-grow md:flex-none md:px-12 rounded-2xl bg-blue-600 py-5 text-center font-bold text-white transition-all transform hover:scale-105 shadow-xl shadow-blue-100 text-lg`}
              >
                신청 방법 및 자세히 보기 →
              </a>
              <Link
                href="/"
                className="flex-grow md:flex-none md:px-12 rounded-2xl bg-slate-800 py-5 text-center font-bold text-white transition-all transform hover:scale-105 shadow-xl text-lg"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </article>

        <div className="mt-12 p-8 bg-cyan-50 rounded-3xl border border-cyan-100 text-sm text-cyan-800 leading-relaxed text-center font-medium">
          💡 지원금 및 혜택 정보는 거제시청 및 관련 공공기관의 공고에 따라 변경될 수 있습니다. <br/>
          정확한 내용은 반드시 '공식 사이트'를 통해 한 번 더 확인해 주세요!
        </div>
      </main>

      <footer className="py-20 text-center text-slate-400 text-sm">
        <p>© 2025 chamnongkkun-info. 당신의 풍요로운 일상을 응원합니다.</p>
      </footer>
    </div>
  );
}
