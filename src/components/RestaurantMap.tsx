"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Leaflet requires window, so we import it dynamically (Client-side only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Restaurant {
  rank: number;
  name: string;
  menu: string;
  summary: string;
  lat: number;
  lng: number;
  link: string;
}

export default function RestaurantMap() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import Leaflet directly for Icon manipulation
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
      
      // Fix for default marker icons in Leaflet + React
      const DefaultIcon = leaflet.default.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      leaflet.default.Marker.prototype.options.icon = DefaultIcon;
    });

    fetch("/data/restaurant-ranking.json")
      .then((res) => res.json())
      .then((data) => setRestaurants(data.ranking))
      .catch((err) => console.error("Failed to load restaurant data:", err));
  }, []);

  if (!restaurants.length || !L) {
    return (
      <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold">
        거제 맛집 지도를 불러오는 중... 🗺️
      </div>
    );
  }

  // 거제도 중심 좌표
  const center: [number, number] = [34.88, 128.62];

  return (
    <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {restaurants.map((res, index) => (
          <Marker key={index} position={[res.lat, res.lng]}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs">
                    {res.rank}
                  </span>
                  <h4 className="font-bold text-slate-800 m-0">{res.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">{res.summary}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {res.menu}
                  </span>
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
                  >
                    상세보기 →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* 플로팅 컨트롤 (맵 위에 표시될 안내) */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] pointer-events-none">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Interactive Map</p>
        <p className="text-xs font-bold text-slate-700">마커를 클릭하여 맛집의 상세 정보를 확인해보세요!</p>
      </div>
    </div>
  );
}
