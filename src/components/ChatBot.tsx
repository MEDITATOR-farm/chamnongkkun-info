"use client";

import React, { useState, useEffect, useRef } from "react";

interface ChatDataItem {
  question: string;
  answer: string;
}

interface Message {
  type: "user" | "bot";
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatData, setChatData] = useState<ChatDataItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // chat-data.json 파일을 가져옵니다. 
    // 루트에 있는 파일을 가져오기 위해 fetch를 사용하거나, 
    // 여기서는 단순함을 위해 직접 데이터를 포함할 수도 있지만 요구사항에 따라 fetch를 시도합니다.
    // Next.js에서는 public 폴더에 있어야 접근이 쉬우므로, 
    // 만약 루트에 있다면 빌드 시점에 포함되거나 api route가 필요할 수 있습니다.
    // 여기서는 클라이언트 측에서 /chat-data.json으로 접근 가능한지 확인합니다.
    fetch("/chat-data.json")
      .then((res) => res.json())
      .then((data) => setChatData(data))
      .catch((err) => console.error("Chat data loading failed:", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuestionClick = (item: ChatDataItem) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: item.question },
      { type: "bot", text: item.answer },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-transform active:scale-95"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* 채팅창 */}
      <div
        className={`fixed bottom-24 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none translate-y-10"
        } sm:w-[360px] sm:h-[500px] max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none`}
      >
        {/* 헤더 */}
        <div className="bg-blue-600 p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">AI 상담원</h3>
            <p className="text-xs text-blue-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              온라인
            </p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="ml-auto p-1 hover:bg-white/10 rounded sm:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 대화 영역 */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#f3f4f6] space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 질문 버튼 영역 */}
        <div className="p-4 bg-white border-t border-gray-100 max-h-48 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-2">자주 묻는 질문을 선택해주세요</p>
          <div className="flex flex-col gap-2">
            {chatData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item)}
                className="text-left p-2 px-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                {item.question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
