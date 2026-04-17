"use client";

import dynamic from "next/dynamic";

const RestaurantMap = dynamic(() => import("./RestaurantMap"), { 
  ssr: false,
  loading: () => <div className="h-[450px] md:h-[600px] lg:h-[900px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold">지도를 불러오고 있습니다... 🗺️</div>
});

export default function MapLoader() {
  return <RestaurantMap />;
}
