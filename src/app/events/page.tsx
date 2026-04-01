import Link from 'next/link';
import fs from 'fs';
import path from 'path';

interface EventItem {
  id: number;
  name: string;
  category: string;
  location: string;
  summary: string;
  startDate: string;
  endDate: string;
}

function getEvents() {
  const filePath = path.join(process.cwd(), "public/data/chamnongkkun-info.json");
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return data.events || [];
  } catch (e) {
    return [];
  }
}

export default function EventsPage() {
  const events = getEvents();

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link href="/" className="group inline-flex items-center text-sm font-bold text-slate-400 hover:text-cyan-600 mb-12 transition-all">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 홈으로 돌아가기
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tighter">
            이달의 <span className="text-cyan-500">행사 & 축제</span> 🌸
          </h1>
          <p className="text-slate-500 font-medium">거제의 생생한 축제와 문화 행사 소식을 전해드립니다.</p>
        </div>

        {events.length === 0 ? (
          <div className="py-32 glass rounded-[40px] text-center border-dashed border-2 border-slate-200">
            <p className="text-slate-400 text-lg font-bold">진행 중인 행사가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event: EventItem) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="glass-card group p-8 rounded-[32px] flex flex-col h-full hover:-translate-y-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 uppercase tracking-tighter">
                    {event.category}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {event.name}
                </h2>
                
                <div className="text-slate-400 text-xs mb-6 space-y-2 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 p-1.5 rounded-lg text-base">📍</span> {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 p-1.5 rounded-lg text-base">📅</span> {event.startDate} ~ {event.endDate}
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-8 flex-grow opacity-80">
                  {event.summary}
                </p>
                
                <div className="flex items-center justify-between text-[11px] font-black text-emerald-500 group-hover:text-emerald-700 transition-colors border-t border-emerald-50/50 pt-6">
                  <span>VIEW DETAILS</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
