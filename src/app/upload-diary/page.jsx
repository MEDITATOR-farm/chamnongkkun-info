"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadDiaryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);

    // 미리보기 생성
    const newPreviews = [];
    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === newImages.length) {
          setImagePreviews([...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("password", password);
      formData.append("date", date);
      images.forEach((img) => formData.append("images", img));
      if (video) formData.append("video", video);

      const res = await fetch("/api/save-diary", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("오늘의 일기가 성공적으로 저장되었습니다! 🧑‍🌾");
        router.push("/diaries");
      } else {
        setError(data.error || "문제가 발생했습니다.");
      }
    } catch (err) {
      setError("서버 오류: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-aura py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-cyan-600 font-bold text-sm mb-6 transition-all group">
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 홈으로 돌아가기
          </Link>
          <div className="inline-block px-4 py-1.5 bg-cyan-50 text-cyan-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-cyan-100/50">
            FARMER'S EDITOR
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight mb-4 drop-shadow-sm">
            🧑‍🌾 소중한 <span className="text-cyan-500">농장 일기</span> 쓰기
          </h1>
          <p className="text-slate-500 font-bold text-base md:text-lg max-w-2xl mx-auto opacity-80 leading-relaxed">
            오늘 하루 농장에서 있었던 일들을 기록해 보세요.<br/>
            정성껏 작성하신 글은 메인 화면의 '가장 최근 현장'에 멋지게 나타납니다.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 입력 폼 (Left Section) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 rounded-[40px] space-y-8 shadow-2xl border-white/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span>📅</span> 날짜 선택
                  </label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:border-cyan-400 focus:bg-white transition-all font-bold text-slate-700" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span>🏷️</span> 일기 제목
                  </label>
                  <input 
                    type="text" 
                    placeholder="예: 오늘 첫 수확을 했어요!"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:border-cyan-400 focus:bg-white transition-all font-bold text-slate-700" 
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                  <span>📝</span> 오늘의 이야기
                </label>
                <textarea 
                  placeholder="무슨 일이 있었나요? 자유롭게 적어주세요..."
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 focus:bg-white transition-all font-bold text-slate-700 min-h-[200px] resize-none" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span>📸</span> 사진 (다중 선택 가능)
                  </label>
                  <div className="relative group/file">
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full bg-white/30 border-2 border-dashed border-slate-200 rounded-2xl px-5 py-8 text-center text-xs font-bold text-slate-400 cursor-pointer hover:border-cyan-300 hover:bg-cyan-50/30 transition-all file:hidden"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60 group-hover/file:opacity-100">
                      <span className="text-3xl mb-2">🖼️</span>
                      <span>이미지 파일을 선택하세요</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-600 ml-1">
                    <span>🎥</span> 영상 업로드
                  </label>
                  <div className="relative group/file">
                    <input 
                      type="file" 
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full bg-white/30 border-2 border-dashed border-slate-200 rounded-2xl px-5 py-8 text-center text-xs font-bold text-slate-400 cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all file:hidden"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-60 group-hover/file:opacity-100">
                      <span className="text-3xl mb-2">🎬</span>
                      <span>동영상 파일을 선택하세요</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-slate-100/50">
                <label className="flex items-center gap-2 text-sm font-black text-red-500 ml-1">
                  <span>🔒</span> 관리자 비밀번호
                </label>
                <input 
                  type="password" 
                  placeholder="비밀번호를 입력해 주세요"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-white/50 border-2 border-red-50 rounded-2xl px-5 py-3.5 outline-none focus:border-red-400 focus:bg-white transition-all font-bold text-slate-700" 
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                  <span className="text-lg">⚠️</span> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-cyan-200 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    심는 중...
                  </span>
                ) : (
                  <>
                    <span>✅ 농장 소식 저장하기</span>
                    <span className="text-2xl transition-transform group-hover:rotate-12">🌱</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 실시간 미리보기 (Right Section) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4 px-2">
                <span className="text-xl">🔍</span>
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">LIVE PREVIEW</h2>
              </div>
              
              <div className="glass-card overflow-hidden rounded-[40px] shadow-xl bg-white/40 border-white/60">
                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="text-center bg-cyan-50 rounded-2xl p-3 border border-cyan-100/50 shadow-sm">
                        <div className="text-cyan-600 font-black text-2xl leading-none">{date.split('-')[2]}</div>
                        <div className="text-cyan-400 text-[10px] mt-1 font-black uppercase">{date.split('-')[1]}월</div>
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Preview Mode</div>
                         <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                           {title || "제목을 입력해 주세요"}
                         </h3>
                      </div>
                    </div>
                  </div>

                  {/* 사진 그리드 미리보기 */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {imagePreviews.map((prev, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[24px] overflow-hidden group/image border-2 border-white shadow-md">
                          <img src={prev} alt={`Preview ${idx}`} className="w-full h-full object-cover group-hover/image:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 영상 미리보기 */}
                  {videoPreview && (
                    <div className="mb-8 rounded-[28px] overflow-hidden border-2 border-white shadow-lg shadow-black/5 bg-black">
                      <video src={videoPreview} controls className="w-full h-auto aspect-video" />
                    </div>
                  )}

                  <div className="bg-white/50 rounded-[32px] p-6 md:p-8 border border-white/80">
                    <p className="text-slate-600 text-lg md:text-xl font-bold leading-relaxed whitespace-pre-wrap font-serif opacity-90 italic">
                      {content || "이곳에 농장의 생생한 소식이 실시간으로 채워집니다..."}
                    </p>
                  </div>
                </div>
                
                <div className="bg-cyan-500/5 py-6 px-10 text-center border-t border-cyan-100/30">
                  <p className="text-[10px] text-cyan-600 font-black tracking-widest uppercase opacity-60">
                    Chamnongkkun Geoje News • {date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
