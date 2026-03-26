import Link from "next/link";
import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  detailContent?: string;
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  return data.events.map((event: InfoItem) => ({
    id: event.id.toString(),
  }));
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const filePath = path.join(process.cwd(), "public", "data", "chamnongkkun-info.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  
  const event = data.events.find((e: InfoItem) => e.id === parseInt(id));

  if (!event) return <div className="p-8 text-center min-h-screen flex items-center justify-center text-xl font-bold text-red-500">❌ 해당 정보를 찾을 수 없습니다.</div>;

  const getSeasonStyles = (itemName: string) => {
    if (itemName.includes("수선화") || itemName.includes("진달래") || itemName.includes("벚꽃") || itemName.includes("맹종죽")) {
      return { bg: "bg-pink-50", border: "border-pink-200", accent: "bg-pink-500", text: "text-pink-900", icon: "🌸" };
    }
    if (itemName.includes("옥포대첩") || itemName.includes("수국") || itemName.includes("바다로")) {
      return { bg: "bg-cyan-50", border: "border-cyan-200", accent: "bg-cyan-500", text: "text-cyan-900", icon: "🌊" };
    }
    return { bg: "bg-emerald-50", border: "border-emerald-200", accent: "bg-emerald-500", text: "text-emerald-900", icon: "🌿" };
  };

  const styles = getSeasonStyles(event.name);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 고정 상단바 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 font-bold text-sm">
            <span>←</span> 목록으로
          </Link>
          <div className="text-[10px] font-black text-slate-300 tracking-widest uppercase">EVENT DETAIL</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-12">
        <article>
          {/* 헤더 영역 */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black text-white ${styles.accent} shadow-sm`}>
                {event.category}
              </span>
              <span className="text-xs font-bold text-slate-400">📅 {event.startDate} ~ {event.endDate}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white px-4 py-2 rounded-2xl border border-slate-100 text-sm font-bold shadow-sm">📍 {event.location}</span>
              <span className="bg-white px-4 py-2 rounded-2xl border border-slate-100 text-sm font-bold shadow-sm">👥 {event.target}</span>
            </div>
          </header>

          {/* 메인 콘텐츠 (블로그 스타일) */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 border border-slate-100">
             {/* 요약 박스 */}
             <div className={`${styles.bg} ${styles.border} border rounded-3xl p-8 mb-12 italic text-lg ${styles.text} leading-relaxed font-medium`}>
                "{event.summary}"
             </div>

             {/* 상세 내용 (Markdown) */}
             <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-p:leading-loose prose-strong:text-blue-600 prose-img:rounded-3xl">
                {event.detailContent ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {event.detailContent}
                  </ReactMarkdown>
                ) : (
                  <p>상세 내용을 불러오는 중입니다...</p>
                )}
             </div>

             {/* 하단 버튼 */}
             <div className="mt-16 pt-12 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <a 
                  href={event.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${styles.accent} text-white px-8 py-4 rounded-2xl font-black text-center transition-transform hover:scale-105 shadow-lg shadow-blue-200`}
                >
                  원본 사이트에서 보기 →
                </a>
                <Link 
                  href="/" 
                  className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black text-center transition-transform hover:scale-105"
                >
                  다른 소식 더보기
                </Link>
             </div>
          </div>
        </article>
      </main>

      {/* 푸터 영역 장식 */}
      <div className="mt-20 text-center text-slate-300 font-bold text-[10px] tracking-widest uppercase">
        © 2025 OUR NEIGHBORHOOD NEWS SOURCE
      </div>
    </div>
  );
}
