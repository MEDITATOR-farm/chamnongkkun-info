"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

interface Spot {
  rank: number;
  name: string;
  category: string;
  summary: string;
  lat: number;
  lng: number;
  link: string;
  tags?: string[];
}

// 카테고리 자동 분류 (명소용)
const CATEGORIES = [
  { key: "전체", icon: "🗺️" },
  { key: "자연/풍경", icon: "🏞️" },
  { key: "역사/문화", icon: "🏛️" },
  { key: "포토존", icon: "📸" },
  { key: "체험/액티비티", icon: "🧗" },
  { key: "기타", icon: "📍" },
];

function getCategory(category: string): string {
  if (!category) return "기타";
  const cat = category.toLowerCase();
  if (cat.includes("자연") || cat.includes("풍경") || cat.includes("바다") || cat.includes("산") || cat.includes("섬") || cat.includes("해변")) return "자연/풍경";
  if (cat.includes("역사") || cat.includes("문화") || cat.includes("유적") || cat.includes("박물관")) return "역사/문화";
  if (cat.includes("사진") || cat.includes("포토존") || cat.includes("인스타")) return "포토존";
  if (cat.includes("체험") || cat.includes("레저") || cat.includes("액티비티") || cat.includes("캠핑")) return "체험/액티비티";
  return "기타";
}

function MapMarkers({ spots, L, farmLocation }: { spots: Spot[], L: any, farmLocation: [number, number] }) {
  const map = useMap();
  const handleLinkClick = () => map.closePopup();

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🏠 CHAMNONGKKUN 농장 마커 */}
      <Marker
        position={farmLocation}
        icon={L.icon({
          iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
        })}
      >
        <Popup className="custom-popup">
          <div className="p-3 min-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏠</span>
              <h4 className="font-black text-rose-600 m-0 text-lg">CHAMNONGKKUN 농장</h4>
            </div>
            <p className="text-[11px] text-slate-600 mb-4 leading-relaxed font-medium">
              거제시 동부면 208-8<br />
              사포닌이 풍부한 이형두릅을 자연과 함께 키우는 게으른 농부의 놀이터
            </p>
            <div className="flex flex-col gap-2">
              <a href="https://naver.me/F6Qmw94p" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}
                className="block text-center text-[10px] font-bold text-white bg-rose-500 px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-100">
                상세보기 →
              </a>
              <a href="/diaries"
                className="block text-center text-[10px] font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl hover:bg-rose-100 transition-colors">
                농부 일기 보러가기
              </a>
            </div>
          </div>
        </Popup>
      </Marker>

      {/* 🌲 명소 마커들 */}
      {spots
        .filter(s => s.lat && s.lng)
        .map((spot, index) => (
          <Marker key={index} position={[spot.lat, spot.lng]}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center font-black text-[10px]">📍</span>
                  <h4 className="font-bold text-slate-800 m-0">{spot.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">{spot.summary}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{spot.category}</span>
                  <a href={spot.link} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}
                    className="text-[10px] font-bold text-white bg-slate-800 px-3 py-1.5 rounded-lg hover:bg-black transition-colors">
                    상세보기 →
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}

export default function SpotMap() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [L, setL] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("전체");

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
      const DefaultIcon = leaflet.default.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41], iconAnchor: [12, 41],
      });
      leaflet.default.Marker.prototype.options.icon = DefaultIcon;
    });

    fetch("/data/hidden-spots.json")
      .then(res => res.json())
      .then(data => setSpots(data.spots || []))
      .catch(err => console.error("Failed to load spots data:", err));
  }, []);

  if (!spots.length || !L) {
    return (
      <div className="h-[400px] md:h-[600px] lg:h-[800px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold">
        거제 숨은 명소 지도를 불러오는 중... 🗺️
      </div>
    );
  }

  const center: [number, number] = [34.88, 128.62];
  const farmLocation: [number, number] = [34.80075, 128.602619];

  const filtered = activeCategory === "전체"
    ? spots
    : spots.filter(s => getCategory(s.category) === activeCategory);

  return (
    <div className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group mt-8 mb-8">

      {/* 카테고리 필터 버튼 */}
      <div className="flex overflow-x-auto gap-2 px-4 py-3 bg-white/95 backdrop-blur border-b border-slate-100" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style dangerouslySetInnerHTML={{ __html: `div::-webkit-scrollbar { display: none; }` }} />
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
              ${activeCategory === cat.key
                ? "bg-slate-800 text-white border-slate-800 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.key}</span>
            {cat.key !== "전체" && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-0.5 font-black
                ${activeCategory === cat.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                {spots.filter(s => getCategory(s.category) === cat.key).length}
              </span>
            )}
          </button>
        ))}

        {/* 현재 필터 결과 수 */}
        <span className="ml-auto text-[11px] text-slate-400 self-center flex-shrink-0 pl-2">
          {activeCategory === "전체" ? `전체 ${spots.length}곳` : `${filtered.length}곳`}
        </span>
      </div>

      {/* 지도 */}
      <div className="h-[400px] md:h-[600px] lg:h-[800px]">
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <MapMarkers spots={filtered} L={L} farmLocation={farmLocation} />
        </MapContainer>
      </div>

      {/* 플로팅 안내 */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] pointer-events-none">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Interactive Map</p>
        <p className="text-xs font-bold text-slate-700">마커를 클릭하여 명소의 상세 정보를 확인해보세요!</p>
      </div>
    </div>
  );
}
