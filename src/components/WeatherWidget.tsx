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
        // [수정] 통신 에러 시 Next.js 에러 화면을 방지하기 위해 타임아웃이나 추가 옵션을 고려할 수 있습니다.
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // 일시적인 네트워크 오류에 대비해 캐시 설정을 추가할 수 있습니다.
          next: { revalidate: 1800 } 
        });
        
        if (!res.ok) {
           throw new Error(`API 서버 응답 오류: ${res.status}`);
        }
        
        const data = await res.json();
        if (data && data.current_weather) {
          setWeather(data.current_weather);
        } else {
          throw new Error("데이터 형식이 올바르지 않습니다.");
        }
      } catch (e) {
        // [중요] 'Failed to fetch' 에러가 나도 콘솔엔 기록하고 UI는 멈추지 않게 기본값을 세팅합니다.
        console.warn("날씨 정보를 가져오는 중 사소한 문제가 발생했습니다 (일시적 통신 오류일 수 있음):", e);
        setWeather({ weathercode: -1, temperature: 0, windspeed: 0 }); 
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
    <div className="group p-3 flex items-center justify-between gap-4 transition-all bg-transparent border-b border-slate-100 h-[72px]">
      <div className="flex items-center gap-4">
         <div className="text-3xl drop-shadow-md animate-float flex items-center justify-center bg-white/40 w-12 h-12 rounded-2xl border border-white/20">
           {icon}
         </div>
         <div className="flex flex-col justify-center">
            <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-0.5">Geoje City</div>
            <div className="text-sm font-black text-slate-800 truncate tracking-tight">{text}</div>
         </div>
      </div>
      
      <div className="flex flex-col items-end justify-center border-l border-slate-100/50 pl-4 h-10">
        <div className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{temp}°</div>
        <div className="text-[10px] text-slate-400 font-bold mt-1 tracking-wide">Wind {wind}m/s</div>
      </div>
    </div>
  );
}
