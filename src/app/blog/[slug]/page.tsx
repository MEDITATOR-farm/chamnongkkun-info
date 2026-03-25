import { getSortedPostsData, getPostData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: Props) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-sm text-neutral-500 hover:text-cyan-600 mb-8 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="15 19l-7-7 7-7" />
        </svg>
        목록으로 돌아가기
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-full">
            {postData.category}
          </span>
          <time className="text-sm text-neutral-400">{postData.date}</time>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-6">
          {postData.title}
        </h1>
        <p className="text-xl text-neutral-500 italic border-l-4 border-cyan-200 pl-4">
          {postData.summary}
        </p>
      </header>

      <div className="prose prose-lg prose-cyan max-w-none prose-neutral">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {postData.content}
        </ReactMarkdown>
      </div>

      <div className="mt-16 pt-8 border-t border-neutral-100 italic text-neutral-400">
        태그: {postData.tags.join(', ')}
      </div>
    </article>
  );
}
