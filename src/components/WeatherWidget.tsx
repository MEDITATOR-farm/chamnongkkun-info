"use client";

import { useState, useEffect } from "react";

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const lat = 34.88;
    const lon = 128.62;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
          { method: "GET", headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error(`API 오류: ${res.status}`);
        const data = await res.json();
        if (data?.current_weather) {
          setWeather(data.current_weather);
        } else {
          throw new Error("데이터 형식 오류");
        }
      } catch (e) {
        console.warn("날씨 로딩 실패:", e);
        setWeather({ weathercode: -1, temperature: 0, windspeed: 0 });
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) {
    return (
      <div style={{
        height: "64px", borderRadius: "16px", width: "100%",
        background: "rgba(255,255,255,0.08)",
        animation: "pulse 2s infinite",
      }} />
    );
  }

  const wmoToIcon = (code: number) => {
    if (code === 0) return { icon: "☀️", text: "맑음" };
    if (code <= 3) return { icon: "⛅", text: "구름 조금" };
    if (code >= 40 && code <= 49) return { icon: "🌫️", text: "안개" };
    if (code >= 50 && code <= 69) return { icon: "🌧️", text: "비" };
    if (code >= 70 && code <= 79) return { icon: "❄️", text: "눈" };
    if (code >= 80 && code <= 82) return { icon: "🌦️", text: "소나기" };
    if (code >= 95 && code <= 99) return { icon: "⚡", text: "뇌우" };
    return { icon: "☁️", text: "흐림" };
  };

  const { icon, text } = wmoToIcon(weather.weathercode);
  const temp = Math.round(weather.temperature);
  const wind = Math.round(weather.windspeed);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "12px", padding: "10px 14px",
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderRadius: "16px",
      border: "1px solid rgba(255,255,255,0.15)",
    }}>
      {/* 아이콘 + 텍스트 */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          fontSize: "1.8rem", width: "44px", height: "44px",
          background: "rgba(255,255,255,0.12)", borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: "0.6rem", fontWeight: 800, color: "#22d3ee", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Geoje City
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "white" }}>
            {text}
          </div>
        </div>
      </div>

      {/* 온도 + 바람 */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-end",
        borderLeft: "1px solid rgba(255,255,255,0.15)", paddingLeft: "12px",
      }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
          {temp}°
        </div>
        <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginTop: "2px" }}>
          Wind {wind}m/s
        </div>
      </div>
    </div>
  );
}
