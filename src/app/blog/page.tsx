import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#f8fbff] font-sans text-gray-800 selection:bg-cyan-200">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <Link href="/" className="group inline-flex items-center text-sm font-bold text-slate-400 hover:text-cyan-600 mb-12 transition-all">
          <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 홈으로 돌아가기
        </Link>
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tighter">
            참농꾼 <span className="text-cyan-500">새소식 📝</span>
          </h1>
          <p className="text-slate-500 font-medium">지역 소식과 농장 이야기를 한곳에서 만나보세요.</p>
        </div>
        
        {allPostsData.length === 0 ? (
          <div className="py-32 glass rounded-[40px] text-center border-dashed border-2 border-slate-200">
            <p className="text-slate-400 text-lg font-bold">아직 작성된 글이 없습니다. 🖋️</p>
          </div>
        ) : (
          <div className="grid gap-10">
            {allPostsData.map(({ slug, date, title, summary, category }) => (
              <article key={slug} className="glass-card group p-10 rounded-[32px] hover:-translate-y-1 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-cyan-50 text-cyan-600 text-[11px] font-black rounded-xl border border-cyan-100 uppercase tracking-widest">
                      {category}
                    </span>
                    <time className="text-xs text-slate-400 font-bold uppercase tracking-wider">{date}</time>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-cyan-600 transition-colors leading-tight">
                  <Link href={`/blog/${slug}`}>
                    <span className="absolute inset-0" aria-hidden="true" />
                    {title}
                  </Link>
                </h2>
                
                <p className="text-slate-500 text-base md:text-lg line-clamp-3 leading-relaxed mb-8 opacity-80 max-w-4xl">{summary}</p>
                
                <div className="flex items-center gap-3 text-xs font-black text-cyan-500 group-hover:text-cyan-700 transition-colors border-t border-cyan-50/50 pt-8">
                  READ ARTICLE
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
