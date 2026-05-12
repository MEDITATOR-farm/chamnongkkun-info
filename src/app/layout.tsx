import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo, Outfit } from "next/font/google";
import "./globals.css";
import CursorEffect from "@/components/CursorEffect";
import MobileNav from "@/components/MobileNav";
// import RecentViewsDrawer from "@/components/RecentViewsDrawer"; ← 나중에 활성화 예정
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

export const viewport: Viewport = {
  themeColor: "#0d3528",
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "참농꾼 | 자급자족을 꿈꾸는 게으른 농부의 삶의 이야기",
  description: "거제도 참농꾼의 정직한 농부일기와 직접 발로 뛴 거제 맛집·명소 가이드를 만나보세요.",
  openGraph: {
    title: "참농꾼 | 자급자족을 꿈꾸는 게으른 농부의 삶의 이야기",
    description: "거제도 참농꾼의 정직한 농부일기와 직접 발로 뛴 거제 맛집·명소 가이드를 만나보세요.",
    url: "https://www.chamnongkkun.com",
    siteName: "참농꾼",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://www.chamnongkkun.com/images/daebyeongdaedo_lined.png",
        width: 1200,
        height: 630,
        alt: "참농꾼 - 거제도 게으른 농부의 기록",
      },
    ],
  },
  verification: { 
    google: "f106dc695fea681f",
    other: {
      "naver-site-verification": "479afcc045529b9dd97cc736d086c8a383a15a19",
    }
  },
};

// import ChatBot from "@/components/ChatBot"; // 나중에 활성화 예정

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable} ${outfit.variable} antialiased font-sans`}>
        <CursorEffect />
        {children}
        {/* <RecentViewsDrawer /> ← 나중에 활성화 예정 */}
        <MobileNav />
        {/* <ChatBot /> ← 나중에 활성화 예정 */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
