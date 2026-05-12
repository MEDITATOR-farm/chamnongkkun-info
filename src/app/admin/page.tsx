"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp?: number;
}

// GitHub 설정 정보
const GITHUB_OWNER = 'MEDITATOR-farm';
const GITHUB_REPO = 'chamnongkkun-info';
const GITHUB_BRANCH = 'main';

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // 탭 상태: poem, diary, file, chat
  const [activeTab, setActiveTab] = useState<"poem" | "diary" | "file" | "chat">("poem");

  // --- 기존 채팅 관련 상태 ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
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

  // GitHub 토큰 가져오기 (환경변수 또는 로컬스토리지)
  const getGithubToken = () => {
    return process.env.NEXT_PUBLIC_GITHUB_TOKEN || localStorage.getItem("GH_TOKEN");
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

  // 2. 채팅 메시지 불러오기 (이 기능은 서버가 필요하므로 유지하되, 안 될 경우 안내)
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "chat") return;
    const poll = async () => {
      try {
        const response = await fetch("/api/chat-poll");
        if (!response.ok) throw new Error("API Not Found");
        const data = await response.json();
        if (data.messages) setMessages(data.messages);
      } catch (error) {
        console.log("실시간 상담은 서버 모드에서만 작동합니다.");
      }
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // --- [핵심] GitHub API 유틸리티 함수 ---
  const commitToGithub = async (path: string, contentBase64: string, message: string) => {
    const token = getGithubToken();
    if (!token) throw new Error("GitHub 토큰이 설정되지 않았습니다.");

    // 1. 기존 파일의 SHA 값 확인 (덮어쓰기를 위해 필요)
    let sha = undefined;
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. 파일 저장 (PUT)
    const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
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

    const token = getGithubToken();
    if (!token) {
      alert("설정 페이지에서 NEXT_PUBLIC_GITHUB_TOKEN을 먼저 설정해주세요.");
      return;
    }

    setIsPoemSubmitting(true);
    try {
      // 1. 기존 시 목록 가져오기
      const filePath = "public/data/poems.json";
      let poems = [];
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (getRes.ok) {
        const data = await getRes.json();
        const content = decodeURIComponent(escape(atob(data.content)));
        poems = JSON.parse(content);
      }

      // 2. 새 시 추가
      const newPoem = {
        id: Date.now(),
        ...poemForm,
        date: new Date().toISOString().split("T")[0],
      };
      poems.unshift(newPoem);

      // 3. GitHub에 저장
      const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(poems, null, 2))));
      await commitToGithub(filePath, updatedContentBase64, `관리자: 새로운 시 등록 (${poemForm.title})`);
      
      alert("✅ 시가 성공적으로 GitHub에 등록되었습니다! 사이트 반영까지 약 1~2분이 소요됩니다.");
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

    const token = getGithubToken();
    if (!token) {
      alert("GitHub 토큰이 필요합니다.");
      return;
    }

    setIsDiarySubmitting(true);
    try {
      const imageUrls: string[] = [];
      let videoUrl = "";

      // 1. 이미지들 업로드
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

      // 2. 영상 업로드
      if (diaryVideo) {
        const base64 = await fileToBase64(diaryVideo);
        const filename = `${Date.now()}-${diaryVideo.name}`;
        const path = `public/uploads/diaries/videos/${filename}`;
        await commitToGithub(path, base64, `관리자: 일기 영상 업로드 (${diaryVideo.name})`);
        videoUrl = `/uploads/diaries/videos/${filename}`;
      }

      // 3. JSON 데이터 업데이트
      const dataPath = "public/data/diaries.json";
      let diaries = [];
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${dataPath}?ref=${GITHUB_BRANCH}`, {
        headers: { Authorization: `Bearer ${token}` },
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

      alert("✅ 농부일기가 GitHub에 안전하게 등록되었습니다! 잠시 후 사이트에 반영됩니다.");
      setDiaryForm({ title: "", content: "" });
      setDiaryImages(null);
      setDiaryVideo(null);
    } catch (error: any) {
      alert(`❌ 등록 중 오류: ${error.message}`);
    } finally {
      setIsDiarySubmitting(false);
    }
  };

  // --- 5. 데이터 파일 직접 업로드 (GitHub 직접 연동) ---
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
            <h1 className="text-2xl font-bold text-gray-800">참농꾼 통합 관리자</h1>
            <p className="text-gray-500 text-sm mt-2">안전한 접속을 위해 비밀번호를 입력하세요.</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (admin1234)"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            autoFocus
          />
          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95">
            접속하기
          </button>
          {!getGithubToken() && (
            <p className="text-[10px] text-red-500 text-center">
              ⚠️ GITHUB_TOKEN이 설정되지 않았습니다. <br/> 배포 설정(Cloudflare)에서 NEXT_PUBLIC_GITHUB_TOKEN을 추가해주세요.
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* 헤더 */}
      <header className="bg-orange-600 p-4 text-white shadow-md flex justify-between items-center">
        <h1 className="font-bold text-xl">참농꾼 마스터 센터</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30">
          로그아웃
        </button>
      </header>

      {/* 메뉴 탭 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex gap-4 overflow-x-auto">
        <button onClick={() => setActiveTab("poem")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "poem" ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}>
          📝 시 등록
        </button>
        <button onClick={() => setActiveTab("diary")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "diary" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
          🌿 농부일기
        </button>
        <button onClick={() => setActiveTab("file")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "file" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
          📂 파일 업로드
        </button>
        <button onClick={() => setActiveTab("chat")} className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "chat" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}>
          💬 실시간 상담
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6 flex flex-col pb-20">
        
        {/* --- 시 등록 폼 --- */}
        {activeTab === "poem" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">📝 새로운 시 등록</h2>
            <form onSubmit={handlePoemSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
                <input type="text" value={poemForm.title} onChange={e => setPoemForm({...poemForm, title: e.target.value})} placeholder="시 제목" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">내용</label>
                <textarea value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} rows={6} placeholder="시 내용을 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={poemForm.author} onChange={e => setPoemForm({...poemForm, author: e.target.value})} placeholder="작가 이름" className="w-full border rounded-xl px-4 py-3 bg-gray-50" />
                <input type="text" value={poemForm.mood} onChange={e => setPoemForm({...poemForm, mood: e.target.value})} placeholder="분위기 (예: 차분한)" className="w-full border rounded-xl px-4 py-3 bg-gray-50" />
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
              <button type="submit" disabled={isPoemSubmitting} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all text-lg shadow-md active:scale-[0.98]">
                {isPoemSubmitting ? "GitHub에 저장 중..." : "시 등록하기"}
              </button>
            </form>
          </div>
        )}

        {/* --- 농부일기 폼 --- */}
        {activeTab === "diary" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">🌿 농부일기 작성</h2>
            <form onSubmit={handleDiarySubmit} className="space-y-5">
              <input type="text" value={diaryForm.title} onChange={e => setDiaryForm({...diaryForm, title: e.target.value})} placeholder="일기 제목" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500" />
              <textarea value={diaryForm.content} onChange={e => setDiaryForm({...diaryForm, content: e.target.value})} rows={8} placeholder="오늘의 농장 이야기를 들려주세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500"></textarea>
              <div className="border p-4 rounded-xl bg-gray-50 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">사진 (여러 장)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setDiaryImages(e.target.files)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">동영상 (1개)</label>
                  <input type="file" accept="video/*" onChange={e => setDiaryVideo(e.target.files?.[0] || null)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
              </div>
              <button type="submit" disabled={isDiarySubmitting} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all text-lg shadow-md active:scale-[0.98]">
                {isDiarySubmitting ? "파일 업로드 및 저장 중..." : "농부일기 등록"}
              </button>
            </form>
          </div>
        )}

        {/* --- 파일 업로드 (기존) --- */}
        {activeTab === "file" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📂 GitHub 직접 파일 업로드</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 cursor-pointer" />
                <input type="text" value={uploadPath} onChange={(e) => setUploadPath(e.target.value)} placeholder="저장 경로 (예: data/myfile.xlsx)" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50" />
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button type="submit" disabled={isUploading || !uploadFile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md active:scale-95">
                  {isUploading ? "전송 중..." : "업로드 시작"}
                </button>
                {uploadMessage && <span className={`text-sm font-bold ${uploadMessage.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{uploadMessage}</span>}
              </div>
            </form>
          </div>
        )}

        {/* --- 상담 관리 (서버 모드 안내) --- */}
        {activeTab === "chat" && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">실시간 상담 기능 안내</h3>
            <p className="text-gray-500 text-sm">실시간 상담 기능은 현재 사장님의 호스팅 환경(정적 사이트)에서는 지원되지 않습니다.<br/>상담 기능을 원하시면 Vercel 서버 배포를 추천드립니다.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;


