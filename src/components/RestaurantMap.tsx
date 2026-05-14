"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

interface Restaurant {
  rank: number;
  name: string;
  menu: string;
  summary: string;
  lat: number;
  lng: number;
  link: string;
  tags?: string[];
}

// 카테고리 자동 분류
const CATEGORIES = [
  { key: "전체", icon: "🗺️" },
  { key: "해산물/회", icon: "🐟" },
  { key: "고기", icon: "🥩" },
  { key: "중식", icon: "🥢" },
  { key: "국밥/탕", icon: "🍲" },
  { key: "면류", icon: "🍜" },
];

function getCategory(menu: string): string {
  const m = menu.toLowerCase();
  if (m.includes("냉면") || m.includes("수제비") || m.includes("칼국수") || m.includes("짜장") || m.includes("짬뽕")) {
    if (m.includes("짜장") || m.includes("짬뽕") || m.includes("순두부")) return "중식";
    return "면류";
  }
  if (m.includes("회") || m.includes("해산물") || m.includes("낙지") || m.includes("생선") || m.includes("밴댕이") || m.includes("홍어") || m.includes("가오리") || m.includes("매운탕") || m.includes("코다리") || m.includes("대구")) return "해산물/회";
  if (m.includes("한우") || m.includes("족발") || m.includes("보쌈") || m.includes("구이") || m.includes("수육")) return "고기";
  if (m.includes("국밥") || m.includes("삼계탕") || m.includes("갈비탕") || m.includes("찜닭")) return "국밥/탕";
  return "기타";
}

function MapMarkers({ restaurants, L, farmLocation, selectedId }: { restaurants: Restaurant[], L: any, farmLocation: [number, number], selectedId?: number }) {
  const map = useMap();
  const handleLinkClick = () => map.closePopup();

  useEffect(() => {
    if (selectedId !== undefined) {
      const selected = restaurants.find(r => r.rank === selectedId);
      if (selected && selected.lat && selected.lng) {
        map.setView([selected.lat, selected.lng], 15, { animate: true });
        // 지연 실행하여 마커가 렌더링된 후 팝업을 엽니다.
        setTimeout(() => {
          map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker && layer.getLatLng().lat === selected.lat && layer.getLatLng().lng === selected.lng) {
              layer.openPopup();
            }
          });
        }, 100);
      }
    }
  }, [selectedId, map, restaurants, L]);

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

      {/* 🍴 맛집 마커들 */}
      {restaurants
        .filter(res => res.lat && res.lng)
        .map((res) => (
          <Marker key={res.rank} position={[res.lat, res.lng]}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center font-black text-[10px]">📍</span>
                  <h4 className="font-bold text-slate-800 m-0">{res.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">{res.summary}</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{res.menu}</span>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}
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

export default function RestaurantMap() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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

    fetch("/data/restaurant-ranking.json")
      .then(res => res.json())
      .then(data => setRestaurants(data.ranking))
      .catch(err => console.error("Failed to load restaurant data:", err));
  }, []);

  if (!restaurants.length || !L) {
    return (
      <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-bold">
        거제 맛집 지도를 불러오는 중... 🗺️
      </div>
    );
  }

  const center: [number, number] = [34.88, 128.62];
  const farmLocation: [number, number] = [34.80075, 128.602619];

  const filtered = activeCategory === "전체"
    ? restaurants
    : restaurants.filter(r => r.menu && getCategory(r.menu) === activeCategory);

  return (
    <div className="flex flex-col md:block relative w-full h-[700px] md:h-[600px] lg:h-[800px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-slate-50">
      
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
            <MapMarkers restaurants={filtered} L={L} farmLocation={farmLocation} selectedId={selectedId} />
          </MapContainer>
          
          {/* 농장 위치로 가기 버튼 (모바일용) */}
          <button 
            onClick={() => setSelectedId(-1)} // 농장 위치는 임의로 -1 처리하거나 로직 추가
            className="absolute bottom-4 right-4 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 md:hidden"
          >
            🏠
          </button>
        </div>

        {/* 3. 리스트 영역 (모바일에서만 하단 스크롤 리스트로 노출) */}
        <div className="flex-1 md:hidden bg-white border-t border-slate-100 overflow-y-auto no-scrollbar">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Restaurant List ({filtered.length})</span>
              <span className="text-[10px] text-slate-300">리스트를 클릭하면 지도가 이동합니다</span>
            </div>
            {filtered.map((res) => (
              <div 
                key={res.rank}
                onClick={() => setSelectedId(res.rank)}
                className={`p-4 rounded-2xl border transition-all ${selectedId === res.rank ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-50 bg-slate-50"}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{res.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{res.summary}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-100">{res.menu}</span>
                    </div>
                  </div>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
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
        <p className="text-xs font-bold text-slate-700">마커를 클릭하여 맛집의 상세 정보를 확인해보세요!</p>
      </div>
    </div>
  );
}
