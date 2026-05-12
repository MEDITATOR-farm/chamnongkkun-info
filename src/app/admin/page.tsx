"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp?: number;
}

// GitHub 기본 설정 (사장님 저장소 정보)
const GITHUB_OWNER = 'MEDITATOR-farm';
const GITHUB_REPO = 'chamnongkkun-info';
const GITHUB_BRANCH = 'main';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // 탭 상태: poem, diary, file, chat
  const [activeTab, setActiveTab] = useState<"poem" | "diary" | "file" | "chat">("poem");

  // 주소창의 해시(#) 파라미터 처리
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["poem", "diary", "file", "chat"].includes(hash)) {
        setActiveTab(hash as any);
      }
    };

    handleHash(); // 초기 접속 시 실행
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // --- 토큰 관리 및 설정 관련 상태 ---
  const [ghToken, setGhToken] = useState("");
  const [tempToken, setTempToken] = useState(""); // 입력창용 임시 토큰
  const [showSettings, setShowSettings] = useState(false);

  // --- 기존 채팅 관련 상태 ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 파일 업로드 관련 상태 ---
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPath, setUploadPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // --- 시 올리기 관련 상태 ---
  const [poemForm, setPoemForm] = useState({
    title: "",
    content: "",
    author: "",
    mood: "차분한",
    bgColor: "#ffffff",
    textColor: "#000000",
  });
  const [isPoemSubmitting, setIsPoemSubmitting] = useState(false);

  // --- 농부일기 올리기 관련 상태 ---
  const [diaryForm, setDiaryForm] = useState({
    title: "",
    content: "",
  });
  const [diaryImages, setDiaryImages] = useState<FileList | null>(null);
  const [diaryVideo, setDiaryVideo] = useState<File | null>(null);
  const [isDiarySubmitting, setIsDiarySubmitting] = useState(false);

  // 입력창 초기화를 위한 Ref
  const diaryImageInputRef = useRef<HTMLInputElement>(null);
  const diaryVideoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 로드 시 저장된 토큰 가져오기
  useEffect(() => {
    const savedToken = localStorage.getItem("CHAMNONG_GH_TOKEN") || "";
    setGhToken(savedToken);
    setTempToken(savedToken);
  }, []);

  // 토큰 저장하기
  const handleSaveToken = () => {
    localStorage.setItem("CHAMNONG_GH_TOKEN", tempToken);
    setGhToken(tempToken);
    setShowSettings(false);
    alert("✅ 토큰이 브라우저에 저장되었습니다! 이제 매번 입력하지 않아도 됩니다.");
  };

  // 1. 관리자 로그인
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin1234") {
      setIsAuthenticated(true);
    } else {
      alert("관리자 비밀번호가 틀렸습니다.");
    }
  };

  // --- [핵심] GitHub API 유틸리티 함수 ---
  const commitToGithub = async (path: string, contentBase64: string, message: string) => {
    if (!ghToken) {
      setShowSettings(true);
      throw new Error("GitHub 토큰을 먼저 설정해주세요.");
    }

    // 1. 기존 파일의 SHA 값 확인 (덮어쓰기를 위해 필요)
    let sha = undefined;
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
      headers: { 
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github.v3+json"
      },
      cache: "no-store", // 캐시 방지: 항상 최신 SHA를 가져옴
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. 파일 저장 (PUT)
    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${ghToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: GITHUB_BRANCH,
        sha: sha,
      }),
    });

    if (!putRes.ok) {
      const error = await putRes.json();
      throw new Error(error.message || "GitHub 전송 실패");
    }
    return await putRes.json();
  };

  // 파일을 Base64로 변환하는 함수
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // --- 3. 시 등록 (GitHub 직접 연동) ---
  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemForm.title || !poemForm.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (!ghToken) {
      alert("상단 ⚙️ 설정을 클릭해 GitHub 토큰을 먼저 입력해주세요.");
      setShowSettings(true);
      return;
    }

    setIsPoemSubmitting(true);
    try {
      const filePath = "public/data/poems.json";
      let poems = [];
      
      // 최신 데이터 가져오기 (캐시 방지)
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`, {
        headers: { 
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github.v3+json"
        },
        cache: "no-store",
      });

      if (getRes.ok) {
        const data = await getRes.json();
        const content = decodeURIComponent(escape(atob(data.content)));
        poems = JSON.parse(content);
      }

      const newPoem = {
        id: Date.now(),
        ...poemForm,
        date: new Date().toISOString().split("T")[0],
      };
      poems.unshift(newPoem);

      const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(poems, null, 2))));
      await commitToGithub(filePath, updatedContentBase64, `관리자: 새로운 시 등록 (${poemForm.title})`);
      
      alert("✅ 시가 성공적으로 GitHub에 등록되었습니다! 약 1~2분 뒤 사이트에 자동 반영됩니다.");
      setPoemForm({ ...poemForm, title: "", content: "", author: "" });
    } catch (error: any) {
      alert(`❌ 오류 발생: ${error.message}`);
    } finally {
      setIsPoemSubmitting(false);
    }
  };

  // --- 4. 농부일기 등록 (GitHub 직접 연동) ---
  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryForm.title || !diaryForm.content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    if (!ghToken) {
      alert("상단 ⚙️ 설정을 클릭해 GitHub 토큰을 먼저 입력해주세요.");
      setShowSettings(true);
      return;
    }

    setIsDiarySubmitting(true);
    try {
      const imageUrls: string[] = [];
      let videoUrl = "";

      if (diaryImages) {
        for (let i = 0; i < diaryImages.length; i++) {
          const file = diaryImages[i];
          const base64 = await fileToBase64(file);
          const filename = `${Date.now()}-${file.name}`;
          const path = `public/uploads/diaries/images/${filename}`;
          await commitToGithub(path, base64, `관리자: 일기 이미지 업로드 (${file.name})`);
          imageUrls.push(`/uploads/diaries/images/${filename}`);
        }
      }

      if (diaryVideo) {
        const base64 = await fileToBase64(diaryVideo);
        const filename = `${Date.now()}-${diaryVideo.name}`;
        const path = `public/uploads/diaries/videos/${filename}`;
        await commitToGithub(path, base64, `관리자: 일기 영상 업로드 (${diaryVideo.name})`);
        videoUrl = `/uploads/diaries/videos/${filename}`;
      }

      const dataPath = "public/data/diaries.json";
      let diaries = [];
      
      // 최신 데이터 가져오기 (캐시 방지)
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dataPath}?ref=${GITHUB_BRANCH}`, {
        headers: { 
          Authorization: `Bearer ${ghToken}`,
          Accept: "application/vnd.github.v3+json"
        },
        cache: "no-store",
      });

      if (getRes.ok) {
        const data = await getRes.json();
        const content = decodeURIComponent(escape(atob(data.content)));
        diaries = JSON.parse(content);
      }

      const newDiary = {
        id: Date.now(),
        title: diaryForm.title,
        content: diaryForm.content,
        date: new Date().toISOString().split("T")[0],
        image: imageUrls.length > 0 ? imageUrls[0] : null,
        images: imageUrls,
        video: videoUrl || null,
      };
      diaries.unshift(newDiary);

      const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(diaries, null, 2))));
      await commitToGithub(dataPath, updatedContentBase64, `관리자: 새로운 농부일기 등록 (${diaryForm.title})`);

      alert("✅ 농부일기(현장소식)가 GitHub에 안전하게 등록되었습니다! 잠시 후 사이트에 자동 반영됩니다.");
      setDiaryForm({ title: "", content: "" });
      setDiaryImages(null);
      setDiaryVideo(null);
      
      // 화면의 파일 선택창 비우기
      if (diaryImageInputRef.current) diaryImageInputRef.current.value = "";
      if (diaryVideoInputRef.current) diaryVideoInputRef.current.value = "";
    } catch (error: any) {
      alert(`❌ 등록 중 오류: ${error.message}`);
    } finally {
      setIsDiarySubmitting(false);
    }
  };

  // --- 5. 데이터 파일 직접 업로드 ---
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("파일을 선택해주세요.");
      return;
    }
    
    setIsUploading(true);
    setUploadMessage("GitHub로 직접 전송 중...");
    
    try {
      const base64 = await fileToBase64(uploadFile);
      const path = uploadPath.trim() || uploadFile.name;
      await commitToGithub(path, base64, `관리자: 파일 직접 업로드 (${path})`);
      
      setUploadMessage(`✅ 성공: ${path} 파일이 업로드되었습니다.`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      setUploadMessage(`❌ 실패: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-sm:px-6 max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">참농꾼 마스터 통합 관리</h1>
            <p className="text-gray-500 text-sm mt-2">비밀번호를 입력하세요.</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (admin1234)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            autoFocus
          />
          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all">
            접속하기
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* 헤더 */}
      <header className="bg-orange-600 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="font-bold text-xl">참농꾼 마스터 센터</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(true)} className="text-lg bg-white/20 p-2 rounded-lg hover:bg-white/30" title="토큰 설정">
            ⚙️ 설정
          </button>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30">
            로그아웃
          </button>
        </div>
      </header>

      {/* 설정 모달 (팝업) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">GitHub 연동 설정</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                GitHub 토큰을 입력하고 저장하세요. <br/>
                <strong>브라우저에 안전하게 저장</strong>되어, 다음 접속 시에도 다시 입력할 필요가 없습니다.
              </p>
              <input
                type="password"
                value={tempToken}
                onChange={(e) => setTempToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleSaveToken} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all">
                토큰 저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메뉴 탭 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex gap-4 overflow-x-auto">
        <button onClick={() => setActiveTab("poem")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "poem" ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
          📝 시 등록
        </button>
        <button onClick={() => setActiveTab("diary")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "diary" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
          🌿 농부일기 & 현장소식
        </button>
        <button onClick={() => setActiveTab("file")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "file" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
          📂 파일 업로드
        </button>
        <button onClick={() => setActiveTab("chat")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "chat" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
          💬 상담 안내
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6 flex flex-col pb-20">
        
        {/* 토큰 미설정 안내 */}
        {!ghToken && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
            <div className="flex items-center">
              <div className="text-yellow-400 mr-3">⚠️</div>
              <p className="text-sm text-yellow-700 font-bold">
                아직 GitHub 연동이 설정되지 않았습니다. 상단의 ⚙️ 설정을 클릭해 토큰을 저장해 주세요.
              </p>
            </div>
          </div>
        )}

        {/* --- 시 등록 폼 --- */}
        {activeTab === "poem" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">📝 새로운 시 등록</h2>
            <form onSubmit={handlePoemSubmit} className="space-y-5">
              <input type="text" value={poemForm.title} onChange={e => setPoemForm({...poemForm, title: e.target.value})} placeholder="시 제목" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500" />
              <textarea value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} rows={6} placeholder="시 내용을 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500"></textarea>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={poemForm.author} onChange={e => setPoemForm({...poemForm, author: e.target.value})} placeholder="작가 이름" className="w-full border rounded-xl px-4 py-3 bg-gray-50" />
                <input type="text" value={poemForm.mood} onChange={e => setPoemForm({...poemForm, mood: e.target.value})} placeholder="분위기" className="w-full border rounded-xl px-4 py-3 bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-500">배경색</span>
                  <input type="color" value={poemForm.bgColor} onChange={e => setPoemForm({...poemForm, bgColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-500">글자색</span>
                  <input type="color" value={poemForm.textColor} onChange={e => setPoemForm({...poemForm, textColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" />
                </div>
              </div>
              <button type="submit" disabled={isPoemSubmitting} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all text-lg">
                {isPoemSubmitting ? "전송 중..." : "시 등록하기"}
              </button>
            </form>
          </div>
        )}

        {/* --- 농부일기 & 현장소식 폼 --- */}
        {activeTab === "diary" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-green-800 mb-6">🌿 농부일기 & 현장소식 작성</h2>
            <form onSubmit={handleDiarySubmit} className="space-y-5">
              <input type="text" value={diaryForm.title} onChange={e => setDiaryForm({...diaryForm, title: e.target.value})} placeholder="제목 (예: [현장소식] 오늘 농장 현황)" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500" />
              <textarea value={diaryForm.content} onChange={e => setDiaryForm({...diaryForm, content: e.target.value})} rows={8} placeholder="농장 현장 소식을 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500"></textarea>
              <div className="border p-4 rounded-xl bg-gray-50 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">사진 선택 (여러 장)</label>
                  <input ref={diaryImageInputRef} type="file" multiple accept="image/*" onChange={e => setDiaryImages(e.target.files)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">동영상 선택 (1개)</label>
                  <input ref={diaryVideoInputRef} type="file" accept="video/*" onChange={e => setDiaryVideo(e.target.files?.[0] || null)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
              </div>
              <button type="submit" disabled={isDiarySubmitting} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all text-lg">
                {isDiarySubmitting ? "GitHub 업로드 중..." : "등록하기"}
              </button>
            </form>
          </div>
        )}

        {/* --- 파일 업로드 --- */}
        {activeTab === "file" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📂 데이터 파일 업로드</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input ref={fileInputRef} type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50" />
                <input type="text" value={uploadPath} onChange={(e) => setUploadPath(e.target.value)} placeholder="저장 경로 (예: data/xxx.xlsx)" className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50" />
              </div>
              <button type="submit" disabled={isUploading || !uploadFile} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
                {isUploading ? "전송 중..." : "업로드 시작"}
              </button>
              {uploadMessage && <p className="text-sm font-bold mt-2">{uploadMessage}</p>}
            </form>
          </div>
        )}

        {/* --- 상담 안내 --- */}
        {activeTab === "chat" && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">실시간 상담 기능 사용 안내</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              현재 사장님의 사이트는 정적(Static) 모드로 운영 중입니다. <br/>
              실시간 상담 내역을 관리하시려면 전용 서버 설정이 추가로 필요합니다. <br/>
              현재는 **시와 일기 등록**을 중심으로 이용해 주세요!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;


