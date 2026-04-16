import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";

const BASE_URL = "https://www.chamnongkkun.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData();

  // 블로그 포스트 목록
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    // 메인 페이지
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // 블로그 목록
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    // 행사 목록
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // 지원금
    {
      url: `${BASE_URL}/support/youth`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // 소개
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // 블로그 포스트들
    ...postEntries,
  ];
}
