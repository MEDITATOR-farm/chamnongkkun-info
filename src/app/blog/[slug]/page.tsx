import { getSortedPostsData, getPostData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import CoupangBanner from '@/components/CoupangBanner';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPostData(slug);
  if (!postData) return {};
  
  return {
    title: `${postData.title} | 우리 동네 소식통`,
    description: postData.summary,
    openGraph: {
      title: postData.title,
      description: postData.summary,
      type: 'article',
      publishedTime: postData.date,
      tags: postData.tags,
    },
  };
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postData.title,
    "datePublished": postData.date,
    "description": postData.summary,
    "author": {
      "@type": "Organization",
      "name": "우리 동네 소식통"
    },
    "publisher": {
      "@type": "Organization",
      "name": "우리 동네 소식통"
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://chamnongkkun-info.pages.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "블로그",
        "item": "https://chamnongkkun-info.pages.dev/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": postData.title,
        "item": `https://chamnongkkun-info.pages.dev/blog/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 text-sm text-neutral-500">
        <Link href="/" className="inline-flex items-center hover:text-cyan-600 transition-colors">
          <span className="mr-1">🏠</span> 홈으로
        </Link>
        <span className="opacity-30">|</span>
        <Link href="/blog" className="inline-flex items-center hover:text-cyan-600 transition-colors">
          <span className="mr-1">📋</span> 목록으로
        </Link>
      </div>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-sm font-medium rounded-full">
            {postData.category}
          </span>
          <time className="text-sm text-neutral-400">최종 업데이트: {postData.date}</time>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-6">
          {postData.title}
        </h1>
        <p className="text-xl text-neutral-500 italic border-l-4 border-cyan-200 pl-4">
          {postData.summary}
        </p>
      </header>

      <div className="prose prose-lg prose-cyan max-w-none prose-neutral mb-16">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {postData.content}
        </ReactMarkdown>
      </div>

      <AdBanner />
      <CoupangBanner />

      <footer className="space-y-8 pt-8 border-t border-neutral-100">
        <div className="italic text-neutral-400">
          태그: {postData.tags.join(', ')}
        </div>

        {postData.source_link && postData.source_link !== '#' && (
          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
            <h4 className="text-sm font-bold text-neutral-900 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.823a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
              </svg>
              원문 출처
            </h4>
            <a 
              href={postData.source_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-600 hover:underline break-all text-sm"
            >
              {postData.source_link}
            </a>
          </div>
        )}

        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-sm text-amber-800 leading-relaxed">
          <p className="flex items-start gap-2">
            <span className="text-lg">🤖</span>
            <span>
              이 글은 공공데이터포털(<a href="https://data.go.kr" target="_blank" rel="noopener noreferrer" className="underline font-bold">data.go.kr</a>)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해 주세요.
            </span>
          </p>
        </div>
      </footer>
    </article>
    </>
  );
}
