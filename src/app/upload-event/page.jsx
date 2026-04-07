"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    category: "행사",
    startDate: "",
    endDate: "",
    location: "",
    target: "누구나",
    summary: "",
    link: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await fetch("/api/upload-event", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();

      if (res.ok) {
        setResult(resData.event);
        setFormData({ ...formData, name: "", summary: "", link: "", password: "" }); // 일부 초기화
        alert("행사가 성공적으로 등록되었습니다! 🌸");
        router.push("/events");
      } else {
        setError(resData.error || "오류가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류: " + e.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-aura py-16 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-emerald-600 font-bold text-sm mb-6 transition-all group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 홈으로 돌아가기
          </Link>
          <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-emerald-100/50">
            EVENT MANAGER
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
            📅 거제 <span className="text-emerald-500">주요 행사</span> 등록
          </h1>
          <p className="text-slate-500 font-bold text-base md:text-lg max-w-2xl mx-auto opacity-80 leading-relaxed">
            거제시청의 새로운 소식이나 지역 축제를 등록해 주세요.<br/>
            등록된 소식은 메인 화면의 '이달의 행사' 섹션에 예쁘게 표시됩니다.
          </p>
        </header>

        <form onSubmit={handleUpload} className="glass-card p-8 md:p-12 rounded-[40px] shadow-2xl border-white/40 space-y-10 group overflow-hidden relative">
          {/* 장식용 오로라 효과 */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl opacity-60 -z-0" />
          
          <div className="relative z-10 space-y-8">
            {/* 행사 기본 정보 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                  <span className="text-lg">📢</span> 행사 이름 <span className="text-emerald-500">*</span>
                </label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="예: 제5회 거제 바다 축제" 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700 text-lg shadow-sm" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span className="text-lg">🗓️</span> 시작 날짜 <span className="text-emerald-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-3.5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span className="text-lg">🏁</span> 종료 날짜
                  </label>
                  <input 
                    type="date" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleChange} 
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-3.5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700" 
                  />
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                  <span className="text-lg">📍</span> 개최 장소
                </label>
                <input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="예: 지세포항 일원" 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-3.5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700" 
                />
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                  <span className="text-lg">👥</span> 참여 대상
                </label>
                <input 
                  name="target" 
                  value={formData.target} 
                  onChange={handleChange} 
                  placeholder="예: 거제시민, 관광객 누구나" 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-3.5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                <span className="text-lg">✨</span> 한 줄 요약 <span className="text-emerald-500">*</span>
              </label>
              <textarea 
                name="summary" 
                value={formData.summary} 
                onChange={handleChange} 
                required 
                placeholder="행사에 대한 짧고 강렬한 설명을 적어주세요." 
                className="w-full bg-white/50 border-2 border-slate-100 rounded-[28px] px-6 py-5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700 min-h-[120px] resize-none leading-relaxed" 
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                <span className="text-lg">🔗</span> 상세 링크 (URL)
              </label>
              <input 
                name="link" 
                value={formData.link} 
                onChange={handleChange} 
                placeholder="거제시청 공식 공고문 링크 등" 
                className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-3.5 outline-none focus:border-emerald-400 focus:bg-white transition-all font-bold text-slate-700" 
              />
            </div>

            {/* 비밀번호 섹션 */}
            <div className="pt-8 border-t border-slate-100/50 flex flex-col items-center">
              <div className="w-full md:w-1/2 space-y-4">
                <label className="flex items-center justify-center gap-2 text-sm font-black text-red-500">
                  <span className="text-lg">🔒</span> 관리자 비밀번호 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-white/50 border-2 border-red-50 rounded-2xl px-6 py-3.5 outline-none focus:border-red-400 focus:bg-white transition-all font-black text-slate-700 text-center tracking-widest shadow-sm" 
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 animate-pulse">
                <span>⚠️ {error}</span>
              </div>
            )}

            {result && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-bold text-center">
                ✅ <strong>{result.name}</strong> 등록 완료! 메인 사이트에서 확인해 보세요.
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full relative group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-lg shadow-emerald-100 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-3 italic">등록 중...</span>
              ) : (
                <>
                  <span>새로운 행사 등록하기</span>
                  <span className="text-2xl transition-transform group-hover:rotate-12 group-hover:scale-125">🌸</span>
                </>
              )}
            </button>
          </div>
        </form>

        <footer className="mt-12 text-center">
           <Link href="/" className="text-slate-400 hover:text-slate-800 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
             🏠 메인 화면으로 돌아가기
           </Link>
        </footer>
      </div>
    </main>
  );
}
