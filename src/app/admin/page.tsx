"use client";

import React, { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
  timestamp?: number;
}

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
    uploadPassword: "", // API 전송용 비밀번호 (1234)
  });
  const [isPoemSubmitting, setIsPoemSubmitting] = useState(false);

  // --- 농부일기 올리기 관련 상태 ---
  const [diaryForm, setDiaryForm] = useState({
    title: "",
    content: "",
    uploadPassword: "", // API 전송용 비밀번호 (1234)
  });
  const [diaryImages, setDiaryImages] = useState<FileList | null>(null);
  const [diaryVideo, setDiaryVideo] = useState<File | null>(null);
  const [isDiarySubmitting, setIsDiarySubmitting] = useState(false);

  // 1. 관리자 로그인
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin1234") {
      setIsAuthenticated(true);
    } else {
      alert("관리자 비밀번호가 틀렸습니다.");
    }
  };

  // 2. 채팅 메시지 불러오기
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "chat") return;
    const poll = async () => {
      try {
        const response = await fetch("/api/chat-poll");
        const data = await response.json();
        if (data.messages) setMessages(data.messages);
      } catch (error) {
        console.error("Polling failed:", error);
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // 채팅 보내기
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const replyText = inputValue;
    setInputValue("");
    setIsLoading(true);
    try {
      await fetch("/api/chat-human", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText, sender: "admin" }),
      });
      const response = await fetch("/api/chat-poll");
      const data = await response.json();
      if (data.messages) setMessages(data.messages);
    } catch (error) {
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 데이터 파일 업로드 (기존 기능)
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage("파일을 선택해 주세요.");
      return;
    }
    setIsUploading(true);
    setUploadMessage("서버로 전송 중입니다...");
    const formData = new FormData();
    formData.append("file", uploadFile);
    if (uploadPath.trim()) formData.append("path", uploadPath.trim());

    try {
      const res = await fetch("/api/upload-github", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setUploadMessage(`✅ 성공: ${data.message}`);
        setUploadFile(null);
      } else {
        setUploadMessage(`❌ 실패: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage("❌ 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- 3. 시 올리기 핸들러 ---
  const handlePoemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poemForm.title || !poemForm.content || !poemForm.uploadPassword) {
      alert("제목, 내용, 등록 비밀번호는 필수입니다.");
      return;
    }
    setIsPoemSubmitting(true);
    try {
      const res = await fetch("/api/save-poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: poemForm.title,
          content: poemForm.content,
          author: poemForm.author,
          mood: poemForm.mood,
          bgColor: poemForm.bgColor,
          textColor: poemForm.textColor,
          password: poemForm.uploadPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ 시가 성공적으로 등록되었습니다!");
        setPoemForm({ ...poemForm, title: "", content: "", author: "" }); // 폼 초기화
      } else {
        alert(`❌ 등록 실패: ${data.error}`);
      }
    } catch (error) {
      alert("서버와 통신하는 중 문제가 발생했습니다.");
    } finally {
      setIsPoemSubmitting(false);
    }
  };

  // --- 4. 농부일기 올리기 핸들러 ---
  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryForm.title || !diaryForm.content || !diaryForm.uploadPassword) {
      alert("제목, 내용, 등록 비밀번호는 필수입니다.");
      return;
    }
    setIsDiarySubmitting(true);
    const formData = new FormData();
    formData.append("title", diaryForm.title);
    formData.append("content", diaryForm.content);
    formData.append("password", diaryForm.uploadPassword);
    
    if (diaryImages) {
      for (let i = 0; i < diaryImages.length; i++) {
        formData.append("images", diaryImages[i]);
      }
    }
    if (diaryVideo) {
      formData.append("video", diaryVideo);
    }

    try {
      const res = await fetch("/api/save-diary", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ 농부일기가 성공적으로 등록되었습니다!");
        setDiaryForm({ ...diaryForm, title: "", content: "" });
        setDiaryImages(null);
        setDiaryVideo(null);
      } else {
        alert(`❌ 등록 실패: ${data.error}`);
      }
    } catch (error) {
      alert("서버와 통신하는 중 문제가 발생했습니다.");
    } finally {
      setIsDiarySubmitting(false);
    }
  };

  // 로그인되지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">통합 관리자 로그인</h1>
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
          <button type="submit" className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600">
            로그인
          </button>
        </form>
      </div>
    );
  }

  // 화면 구성
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* 상단 헤더 */}
      <header className="bg-orange-600 p-4 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-xl">참농꾼 관리자 시스템</h1>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30">
          로그아웃
        </button>
      </header>

      {/* 메뉴 탭 */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2 flex gap-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("poem")} 
          className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "poem" ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          📝 시 올리기
        </button>
        <button 
          onClick={() => setActiveTab("diary")} 
          className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "diary" ? "bg-green-100 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          🌿 농부일기 올리기
        </button>
        <button 
          onClick={() => setActiveTab("file")} 
          className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "file" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          📂 데이터 파일 올리기
        </button>
        <button 
          onClick={() => setActiveTab("chat")} 
          className={`px-4 py-2 font-bold rounded-lg transition-colors whitespace-nowrap ${activeTab === "chat" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-50"}`}
        >
          💬 실시간 상담 관리
        </button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6 flex flex-col pb-20">
        
        {/* === 1. 시 올리기 화면 === */}
        {activeTab === "poem" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              📝 새로운 시 등록하기
            </h2>
            <form onSubmit={handlePoemSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">제목</label>
                <input type="text" value={poemForm.title} onChange={e => setPoemForm({...poemForm, title: e.target.value})} placeholder="시 제목을 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">내용</label>
                <textarea value={poemForm.content} onChange={e => setPoemForm({...poemForm, content: e.target.value})} rows={6} placeholder="시 내용을 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">작가 (선택)</label>
                  <input type="text" value={poemForm.author} onChange={e => setPoemForm({...poemForm, author: e.target.value})} placeholder="작가를 입력하세요" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">분위기</label>
                  <input type="text" value={poemForm.mood} onChange={e => setPoemForm({...poemForm, mood: e.target.value})} placeholder="예: 차분한, 따뜻한" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border p-4 rounded-xl bg-gray-50">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">배경색 선택</label>
                  <input type="color" value={poemForm.bgColor} onChange={e => setPoemForm({...poemForm, bgColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">글자색 선택</label>
                  <input type="color" value={poemForm.textColor} onChange={e => setPoemForm({...poemForm, textColor: e.target.value})} className="w-full h-10 rounded cursor-pointer" />
                </div>
              </div>
              <div className="border-t pt-5">
                <label className="block text-sm font-bold text-red-600 mb-1">등록 비밀번호</label>
                <input type="password" value={poemForm.uploadPassword} onChange={e => setPoemForm({...poemForm, uploadPassword: e.target.value})} placeholder="서버 등록 비밀번호 (1234)" className="w-full border rounded-xl px-4 py-3 bg-red-50 focus:outline-red-500" />
              </div>
              <button type="submit" disabled={isPoemSubmitting} className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition-all text-lg shadow-md">
                {isPoemSubmitting ? "등록하는 중..." : "시 등록하기"}
              </button>
            </form>
          </div>
        )}

        {/* === 2. 농부일기 올리기 화면 === */}
        {activeTab === "diary" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
              🌿 새로운 농부일기 쓰기
            </h2>
            <form onSubmit={handleDiarySubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">일기 제목</label>
                <input type="text" value={diaryForm.title} onChange={e => setDiaryForm({...diaryForm, title: e.target.value})} placeholder="오늘의 일기 제목" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">일기 내용</label>
                <textarea value={diaryForm.content} onChange={e => setDiaryForm({...diaryForm, content: e.target.value})} rows={8} placeholder="오늘 농장에서는 무슨 일이 있었나요?" className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:outline-green-500"></textarea>
              </div>
              <div className="border p-4 rounded-xl bg-gray-50 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">사진 첨부 (여러 장 가능)</label>
                  <input type="file" multiple accept="image/*" onChange={e => setDiaryImages(e.target.files)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">동영상 첨부 (1개만)</label>
                  <input type="file" accept="video/*" onChange={e => setDiaryVideo(e.target.files?.[0] || null)} className="w-full bg-white border p-2 rounded-lg text-sm" />
                </div>
              </div>
              <div className="border-t pt-5">
                <label className="block text-sm font-bold text-red-600 mb-1">등록 비밀번호</label>
                <input type="password" value={diaryForm.uploadPassword} onChange={e => setDiaryForm({...diaryForm, uploadPassword: e.target.value})} placeholder="서버 등록 비밀번호 (1234)" className="w-full border rounded-xl px-4 py-3 bg-red-50 focus:outline-red-500" />
              </div>
              <button type="submit" disabled={isDiarySubmitting} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all text-lg shadow-md">
                {isDiarySubmitting ? "일기 저장하는 중..." : "농부일기 등록하기"}
              </button>
            </form>
          </div>
        )}

        {/* === 3. 파일 업로드 화면 (기존) === */}
        {activeTab === "file" && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">데이터 파일 직접 업로드 (GitHub 연동)</h2>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">파일 선택 (예: 사자성어.xlsx)</label>
                  <input type="file" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50 cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">저장 경로 (비워두면 기본 경로)</label>
                  <input type="text" value={uploadPath} onChange={(e) => setUploadPath(e.target.value)} placeholder="예: data/사자성어.xlsx" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-gray-50" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <button type="submit" disabled={isUploading || !uploadFile} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 shadow-md">
                  {isUploading ? "업로드 중..." : "파일 업로드"}
                </button>
                {uploadMessage && (
                  <span className={`text-sm font-bold ${uploadMessage.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                    {uploadMessage}
                  </span>
                )}
              </div>
            </form>
          </section>
        )}

        {/* === 4. 채팅 상담 화면 (기존) === */}
        {activeTab === "chat" && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[500px]">
            <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
              <h2 className="text-sm font-bold text-purple-800">실시간 방문자 상담 내역</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-gray-400">아직 주고받은 메시지가 없습니다.</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <span className="text-[10px] text-gray-400 mb-1 px-2">{msg.sender === "user" ? "방문자" : "관리자(나)"}</span>
                      <div className={`max-w-md p-3 px-4 rounded-2xl text-sm shadow-sm ${msg.sender === "user" ? "bg-white text-gray-800 rounded-tr-none border border-gray-100" : "bg-purple-600 text-white rounded-tl-none"}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white">
              <form onSubmit={handleSendReply} className="flex gap-3">
                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="답장을 입력해 주세요..." className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-purple-500" />
                <button type="submit" disabled={!inputValue.trim() || isLoading} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50">전송</button>
              </form>
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default AdminPage;

