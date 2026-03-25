import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-cyan-600 mb-8 transition-colors">
        <span className="mr-1">🏠</span> 홈으로 돌아가기
      </Link>
      <h1 className="text-4xl font-bold mb-8 text-neutral-800">새소식 📝</h1>
      
      {allPostsData.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
          <p className="text-neutral-500 text-lg">아직 작성된 글이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {allPostsData.map(({ slug, date, title, summary, category }) => (
            <article key={slug} className="group relative bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-full">
                  {category}
                </span>
                <time className="text-sm text-neutral-400">{date}</time>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-600 transition-colors">
                <Link href={`/blog/${slug}`}>
                  <span className="absolute inset-0" aria-hidden="true" />
                  {title}
                </Link>
              </h2>
              <p className="text-neutral-600 line-clamp-2">{summary}</p>
              <div className="mt-4 flex items-center text-cyan-600 font-medium">
                더 보기 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
