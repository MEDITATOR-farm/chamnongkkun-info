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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">관리자 로그인</h1>
            <p className="text-gray-500 text-sm mt-2">상담 관리를 위해 비밀번호를 입력하세요.</p>
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

      {/* 대화창 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 overflow-y-auto space-y-4">
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
      </main>

      {/* 입력창 영역 */}
      <footer className="bg-white border-t border-gray-200 p-4 pb-[env(safe-area-inset-bottom,1rem)] shadow-inner relative z-10">
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
