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

function MapMarkers({ spots, L, farmLocation, selectedId }: { spots: Spot[], L: any, farmLocation: [number, number], selectedId?: number }) {
  const map = useMap();
  const handleLinkClick = () => map.closePopup();

  useEffect(() => {
    if (selectedId !== undefined) {
      if (selectedId === -1) {
        map.setView(farmLocation, 15, { animate: true });
      } else {
        const selected = spots.find(s => s.rank === selectedId);
        if (selected && selected.lat && selected.lng) {
          map.setView([selected.lat, selected.lng], 15, { animate: true });
          setTimeout(() => {
            map.eachLayer((layer: any) => {
              if (layer instanceof L.Marker && layer.getLatLng().lat === selected.lat && layer.getLatLng().lng === selected.lng) {
                layer.openPopup();
              }
            });
          }, 100);
        }
      }
    }
  }, [selectedId, map, spots, L, farmLocation]);

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
        .map((spot) => (
          <Marker key={spot.rank} position={[spot.lat, spot.lng]}>
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
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

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
      <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold">
        거제 숨은 명소 지도를 불러오는 중... 🗺️
      </div>
    );
  }

  const center: [number, number] = [34.88, 128.62];
  const farmLocation: [number, number] = [34.80075, 128.602619];

  const filtered = activeCategory === "전체"
    ? spots
    : spots.filter(s => s.category && getCategory(s.category) === activeCategory);

  return (
    <div className="flex flex-col md:block relative w-full h-[700px] md:h-[600px] lg:h-[800px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-slate-50 mt-8 mb-8">
      
      {/* 1. 카테고리 필터 (상단 고정) */}
      <div className="z-20 bg-white/95 backdrop-blur border-b border-slate-100 flex-shrink-0">
        <div className="flex overflow-x-auto gap-2 px-4 py-3 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => {setActiveCategory(cat.key); setSelectedId(undefined);}}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border
                ${activeCategory === cat.key
                  ? "bg-slate-800 text-white border-slate-800 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full overflow-hidden">
        {/* 2. 지도 영역 (모바일에서는 상단 절반, 데스크탑에서는 전체) */}
        <div className="h-[300px] md:h-full flex-shrink-0 md:flex-1 relative">
          <MapContainer
            center={center}
            zoom={11}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <MapMarkers spots={filtered} L={L} farmLocation={farmLocation} selectedId={selectedId} />
          </MapContainer>
          
          {/* 농장 위치로 가기 버튼 (모바일용) */}
          <button 
            onClick={() => setSelectedId(-1)}
            className="absolute bottom-4 right-4 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 md:hidden"
          >
            🏠
          </button>
        </div>

        {/* 3. 리스트 영역 (모바일에서만 하단 스크롤 리스트로 노출) */}
        <div className="flex-1 md:hidden bg-white border-t border-slate-100 overflow-y-auto no-scrollbar">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Spot List ({filtered.length})</span>
              <span className="text-[10px] text-slate-300">리스트를 클릭하면 지도가 이동합니다</span>
            </div>
            {filtered.map((spot) => (
              <div 
                key={spot.rank}
                onClick={() => setSelectedId(spot.rank)}
                className={`p-4 rounded-2xl border transition-all ${selectedId === spot.rank ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100" : "border-slate-50 bg-slate-50"}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{spot.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{spot.summary}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-emerald-100">{spot.category}</span>
                    </div>
                  </div>
                  <a href={spot.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-xs">
                    🔗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 데스크탑 전용 플로팅 안내 */}
      <div className="hidden md:block absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 max-w-[200px] pointer-events-none">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Interactive Map</p>
        <p className="text-xs font-bold text-slate-700">마커를 클릭하여 명소의 상세 정보를 확인해보세요!</p>
      </div>
    </div>
  );
}
