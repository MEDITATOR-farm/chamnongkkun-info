import { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData();
  const domain = 'https://chamnongkkun-info.pages.dev';

  const blogPosts = posts.map((post) => ({
    url: `${domain}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [
    {
      url: domain,
      lastModified: new Date(),
    },
    {
      url: `${domain}/blog`,
      lastModified: new Date(),
    },
    ...blogPosts,
  ];
}
