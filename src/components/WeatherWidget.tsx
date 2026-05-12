"use client";

import { useState, useEffect } from "react";

// 네비게이션 우측에 들어가는 컴팩트 버전
export function WeatherWidgetCompact() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=34.88&longitude=128.62&current_weather=true&timezone=auto`
        );
        const data = await res.json();
        if (data?.current_weather) setWeather(data.current_weather);
      } catch {
        setWeather({ weathercode: -1, temperature: "--", windspeed: 0 });
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const wmoToIcon = (code: number) => {
    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code >= 40 && code <= 49) return "🌫️";
    if (code >= 50 && code <= 69) return "🌧️";
    if (code >= 70 && code <= 79) return "❄️";
    if (code >= 80 && code <= 82) return "🌦️";
    if (code >= 95 && code <= 99) return "⚡";
    return "☁️";
  };

  if (!weather) {
    return (
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/10 bg-primary/5 animate-pulse">
        <span className="text-sm">🌤️</span>
        <span className="text-xs font-bold text-foreground/30">--°</span>
      </div>
    );
  }

  const icon = wmoToIcon(weather.weathercode);
  const temp = Math.round(weather.temperature);

  return (
    <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
      <span className="text-base leading-none">{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-black text-primary/40 tracking-widest uppercase">거제도</span>
        <span className="text-sm font-black text-foreground/70">{temp}°C</span>
      </div>
    </div>
  );
}

// 기존 full 버전 (섹션용, 하위 호환 유지)
export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=34.88&longitude=128.62&current_weather=true&timezone=auto`
        );
        const data = await res.json();
        if (data?.current_weather) setWeather(data.current_weather);
      } catch {
        setWeather({ weathercode: -1, temperature: 0, windspeed: 0 });
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;

  const wmoToIcon = (code: number) => {
    if (code === 0) return { icon: "☀️", text: "맑음" };
    if (code <= 3) return { icon: "⛅", text: "구름 조금" };
    if (code >= 50 && code <= 69) return { icon: "🌧️", text: "비" };
    if (code >= 70 && code <= 79) return { icon: "❄️", text: "눈" };
    if (code >= 80 && code <= 82) return { icon: "🌦️", text: "소나기" };
    if (code >= 95) return { icon: "⚡", text: "뇌우" };
    return { icon: "☁️", text: "흐림" };
  };

  const { icon, text } = wmoToIcon(weather.weathercode);
  const temp = Math.round(weather.temperature);
  const wind = Math.round(weather.windspeed);

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="text-[10px] font-black text-primary/40 tracking-widest uppercase">Geoje · 거제도</div>
          <div className="text-base font-bold text-foreground/70">{text}</div>
        </div>
      </div>
      <div className="text-right border-l border-primary/10 pl-4">
        <div className="text-2xl font-black text-foreground">{temp}°C</div>
        <div className="text-[10px] text-foreground/30 font-bold">바람 {wind}m/s</div>
      </div>
    </div>
  );
}
