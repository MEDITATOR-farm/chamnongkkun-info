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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 파일 업로드 관련 상태
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPath, setUploadPath] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  // 1. 비밀번호 인증
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin1234") {
      setIsAuthenticated(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  // 2. 메시지 폴링 (인증된 경우에만)
  useEffect(() => {
    if (!isAuthenticated) return;

    const poll = async () => {
      try {
        const response = await fetch("/api/chat-poll");
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Polling failed:", error);
      }
    };

    poll(); // 초기 호출
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. 답장 보내기
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
        body: JSON.stringify({
          text: replyText,
          sender: "admin"
        }),
      });
      // 보낸 후 즉시 폴링하여 화면 업데이트 유도
      const response = await fetch("/api/chat-poll");
      const data = await response.json();
      if (data.messages) setMessages(data.messages);
    } catch (error) {
      console.error("Reply failed:", error);
      alert("메시지 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 파일 업로드 핸들러
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage("파일을 선택해 주세요.");
      return;
    }
    
    setIsUploading(true);
    setUploadMessage("서버로 전송 중입니다... (10~20초 소요될 수 있습니다)");
    
    const formData = new FormData();
    formData.append("file", uploadFile);
    if (uploadPath.trim()) {
      formData.append("path", uploadPath.trim());
    }

    try {
      const res = await fetch("/api/upload-github", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setUploadMessage(`✅ 성공: ${data.message}`);
        setUploadFile(null); // 성공 후 선택된 파일 초기화
        // input[type=file]도 화면에서 지우려면 별도 ref가 필요하지만, 일단 null 처리로 충분합니다.
      } else {
        setUploadMessage(`❌ 실패: ${data.error}`);
      }
    } catch (error) {
      setUploadMessage("❌ 전송 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">통합 관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">파일 업로드 및 상담 관리를 위해 비밀번호를 입력하세요.</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-lg"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* 헤더 */}
      <header className="bg-orange-500 p-4 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">A</div>
          <div>
            <h1 className="font-bold text-lg">상담 관리 센터</h1>
            <p className="text-xs text-orange-100">방문자와 실시간으로 대화 중입니다.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30"
        >
          로그아웃
        </button>
      </header>

      {/* 메인 영역 (업로드 + 대화창) */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6 flex flex-col">
        
        {/* 1. 파일 업로드 섹션 */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            데이터 파일 직접 업로드 (GitHub 연동)
          </h2>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">파일 선택 (예: 사자성어.xlsx)</label>
                <input 
                  type="file" 
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  저장 경로 <span className="text-gray-400 font-normal">(비워두면 파일명 그대로 루트에 저장)</span>
                </label>
                <input 
                  type="text" 
                  value={uploadPath}
                  onChange={(e) => setUploadPath(e.target.value)}
                  placeholder="예: 사자성어.xlsx"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isUploading || !uploadFile}
                className="bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-black transition-all shadow-md flex items-center gap-2"
              >
                {isUploading ? "업로드 중..." : "파일 업로드"}
              </button>
              {uploadMessage && (
                <span className={`text-xs font-medium break-keep ${uploadMessage.includes('✅') ? 'text-green-600' : uploadMessage.includes('❌') ? 'text-red-500' : 'text-gray-600'}`}>
                  {uploadMessage}
                </span>
              )}
            </div>
          </form>
        </section>

        {/* 2. 대화창 섹션 */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[300px] overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              실시간 방문자 상담 내역
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f9fafb]">
            {messages.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>아직 주고받은 메시지가 없습니다.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    <span className="text-[10px] text-gray-400 mb-1 px-2">
                      {msg.sender === "user" ? "방문자" : "나 (관리자)"}
                    </span>
                    <div
                      className={`max-w-md p-3 px-4 rounded-2xl text-sm shadow-sm ${
                        msg.sender === "user"
                          ? "bg-white text-gray-800 rounded-tr-none border border-gray-100"
                          : "bg-orange-500 text-white rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </section>
      </main>

      {/* 입력창 영역 */}
      <footer className="bg-white border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom,1rem)] shadow-inner relative z-10 flex-shrink-0">
        <form onSubmit={handleSendReply} className="max-w-4xl w-full mx-auto flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="답장을 입력해 주세요..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-orange-600 transition-all shadow-md active:scale-95"
          >
            전송
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AdminPage;
