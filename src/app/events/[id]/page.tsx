import Link from "next/link";
import fs from "fs";
import path from "path";

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

// 1. 모든 가능한 ID를 빌드 시점에 미리 알려줍니다 (정적 배포 필수 설정)
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  return data.events.map((event: InfoItem) => ({
    id: event.id.toString(),
  }));
}

// 2. 상세 페이지 내용을 렌더링합니다
export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  
  const event = data.events.find((e: InfoItem) => e.id === parseInt(id));

  if (!event) return <div className="p-8 text-center min-h-screen flex items-center justify-center text-xl font-bold text-red-500">❌ 해당 정보를 찾을 수 없습니다.</div>;

  const getSeasonStyles = (itemName: string) => {
    if (itemName.includes("수선화") || itemName.includes("진달래") || itemName.includes("맹종죽")) {
      return { bg: "bg-pink-50", border: "border-pink-300", accent: "bg-pink-500 hover:bg-pink-600", text: "text-pink-900", icon: "🌸" };
    }
    if (itemName.includes("옥포대첩") || itemName.includes("수국") || itemName.includes("바다로")) {
      return { bg: "bg-cyan-50", border: "border-cyan-300", accent: "bg-cyan-500 hover:bg-cyan-600", text: "text-cyan-900", icon: "🌊" };
    }
    if (itemName.includes("섬꽃")) {
      return { bg: "bg-orange-50", border: "border-orange-300", accent: "bg-orange-500 hover:bg-orange-600", text: "text-orange-900", icon: "🍁" };
    }
    return { bg: "bg-blue-50", border: "border-blue-300", accent: "bg-blue-500 hover:bg-blue-600", text: "text-blue-900", icon: "❄️" };
  };

  const styles = getSeasonStyles(event.name);

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 overflow-x-hidden">
      {/* 상단 헤더 */}
      <header className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/header-bg.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-cyan-900/40" />
        
        <div className="relative z-20 text-center text-white p-6 drop-shadow-2xl">
          <Link href="/" className="mb-4 inline-block text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all">
            ← 목록으로 돌아가기
          </Link>
          <h1 className="text-4xl font-extrabold md:text-5xl tracking-tight mb-2">
            축제 상세 정보
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-30">
          <svg className="relative block w-full h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.43,84.43,101.45,112.33,161.85,116.82,222.25,121.3,275.46,65,321.39,56.44Z" fill="#f8fbff"></path>
          </svg>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl relative">
        <article className={`rounded-[3rem] border-4 ${styles.border} ${styles.bg} p-8 md:p-16 shadow-2xl overflow-hidden relative`}>
          <div className="absolute -top-6 -right-6 text-9xl opacity-10 grayscale">{styles.icon}</div>

          <div className="relative z-10">
            <div className="mb-8">
              <span className={`inline-block rounded-full px-6 py-2 text-sm font-bold mb-4 shadow-sm ${styles.accent} text-white`}>
                {event.category}
              </span>
              <h2 className={`text-3xl md:text-5xl font-black ${styles.text} leading-tight`}>
                {event.name}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-12">
              <div className="bg-white/60 p-6 rounded-3xl backdrop-blur-sm">
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">일시</h3>
                <p className="text-lg font-bold text-slate-700">📅 {event.startDate} ~ {event.endDate}</p>
              </div>
              <div className="bg-white/60 p-6 rounded-3xl backdrop-blur-sm">
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">장소</h3>
                <p className="text-lg font-bold text-slate-700">📍 {event.location}</p>
              </div>
              <div className="bg-white/60 p-6 rounded-3xl backdrop-blur-sm md:col-span-2">
                <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">참여 대상</h3>
                <p className="text-lg font-bold text-slate-700">👥 {event.target}</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-slate-700 leading-loose mb-12">
              <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-current rounded-full" />
                상세 내용
              </h3>
              <p className="whitespace-pre-wrap bg-white/40 p-8 rounded-[2rem] border border-white/60">
                {event.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-grow md:flex-none md:px-12 rounded-2xl ${styles.accent} py-5 text-center font-bold text-white transition-all transform hover:scale-105 shadow-xl text-lg`}
              >
                원본 사이트 자세히 보기 →
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
      </main>

      <footer className="py-20 text-center text-slate-400 text-sm">
        <p>© 2025 chamnongkkun-info. 거제시의 아름다운 일상을 기록합니다.</p>
      </footer>
    </div>
  );
}
