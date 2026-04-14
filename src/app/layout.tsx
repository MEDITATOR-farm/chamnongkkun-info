import type { Metadata } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

export const metadata: Metadata = {
  title: "Chamnongkkun 과 함께 하는 거제소식 | 행사·혜택·지원금 안내",
  description: "거제시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "Chamnongkkun 과 함께 하는 거제소식 | 행사·혜택·지원금 안내",
    description: "거제시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://www.chamnongkkun.com",
    siteName: "우리 동네 소식통",
    locale: "ko_KR",
    type: "website",
  },
};

// src/app/layout.tsx

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ 정적 빌드에서 가장 안정적인 방식 */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
