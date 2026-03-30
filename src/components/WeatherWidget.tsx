"use client";

import { useState, useEffect } from "react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // 거제시 위도 경도 기반 (Open-Meteo 무료 API: 가입/키 절차 불필요)
    const lat = 34.88;
    const lon = 128.62;
    
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (e) {
        console.error("날씨 정보 불러오기 실패", e);
      }
    };
    fetchWeather();
    
    // 30분마다 갱신 (1800000ms)
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // 로딩 중일 때 표시할 은은한 배경
  if (!weather) {
    return <div className="animate-pulse bg-slate-50/50 h-[68px] rounded-xl w-full border border-slate-100/50"></div>;
  }

  // WMO 날씨 코드를 한글 텍스트와 이모지로 변환
  const wmoToIcon = (code: number) => {
    if (code === 0) return { icon: "☀️", text: "맑음" };
    if (code === 1 || code === 2 || code === 3) return { icon: "⛅", text: "구름 조금/흐림" };
    if (code >= 40 && code <= 49) return { icon: "🌫️", text: "안개" };
    if (code >= 50 && code <= 69) return { icon: "🌧️", text: "비" };
    if (code >= 70 && code <= 79) return { icon: "❄️", text: "눈" };
    if (code >= 80 && code <= 82) return { icon: "🌦️", text: "소나기" };
    if (code >= 95 && code <= 99) return { icon: "⚡", text: "뇌우" };
    return { icon: "☁️", text: "알 수 없음" };
  };

  const { icon, text } = wmoToIcon(weather.weathercode);
  const temp = Math.round(weather.temperature);
  const wind = Math.round(weather.windspeed);

  // 디자인 요구사항: SIMPLE, 은은함(테마 일치), 튀지않게, 상하높이 최소화
  return (
    <div className="bg-gradient-to-r from-sky-50 to-blue-50/30 hover:from-sky-100/60 hover:to-blue-100/40 rounded-xl p-3 border border-sky-100/80 shadow-sm flex items-center justify-between gap-3 transition-colors h-[68px]">
      <div className="flex items-center gap-3">
         <span className="text-2xl drop-shadow-sm opacity-90">{icon}</span>
         <div className="flex flex-col justify-center">
            <div className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-0.5">Geoje</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 truncate">{text}</div>
         </div>
      </div>
      
      <div className="flex flex-col items-end justify-center border-l border-sky-200/60 pl-3">
        <div className="text-lg font-bold text-slate-800 tracking-tight">{temp}°C</div>
        <div className="text-[10px] text-slate-500 font-medium tracking-wide">풍속 {wind}m/s</div>
      </div>
    </div>
  );
}
