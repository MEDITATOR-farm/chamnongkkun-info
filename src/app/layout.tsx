import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Nanum_Myeongjo } from "next/font/google";
import "./globals.css";
import CursorEffect from "@/components/CursorEffect";
import MobileNav from "@/components/MobileNav";
import RecentViewsDrawer from "@/components/RecentViewsDrawer";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nanum-myeongjo",
});

export const viewport: Viewport = {
  themeColor: "#06b6d4",
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Chamnongkkun 과 함께 하는 거제소식 | 행사·혜택·지원금 안내",
  description: "거제시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
  openGraph: {
    title: "Chamnongkkun 과 함께 하는 거제소식 | 행사·혜택·지원금 안내",
    description: "거제시 주민을 위한 지역 행사, 축제, 지원금, 혜택 정보를 매일 업데이트합니다.",
    url: "https://www.chamnongkkun.com",
    siteName: "우리 동네 소식통",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "https://www.chamnongkkun.com/images/daebyeongdaedo_lined.png",
        width: 1200,
        height: 630,
        alt: "Chamnongkkun 거제소식",
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
      <body className={`${geistSans.variable} ${geistMono.variable} ${nanumMyeongjo.variable}`}>
        <CursorEffect />
        {children}
        <RecentViewsDrawer />
        <MobileNav />
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
