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
    { type: "bot", text: "안녕하세요! 거제 소식통입니다. 무엇이든 물어보세요! 😊" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 추천 질문 예시 (프롬프트 칩)
  const starterPrompts = [
    "이번 주 거제도 행사 알려줘",
    "고향사랑기부제가 뭐야?",
    "거제도 숨은 명소 추천해줘",
    "블로그 업데이트는 언제 돼?"
  ];

  useEffect(() => {
    fetch("/chat-data.json")
      .then((res) => res.json())
      .then((data) => setChatData(data))
      .catch((err) => console.error("Chat data loading failed:", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleQuestionClick = (question: string, answer?: string) => {
    if (answer) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: question },
        { type: "bot", text: answer },
      ]);
    } else {
      // 답변이 없는 경우 AI에게 직접 물어보기 모드로 작동
      handleSendMessage(null, question);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | null, directText?: string) => {
    if (e) e.preventDefault();
    
    const textToSendMessage = directText || inputValue;
    if (!textToSendMessage.trim() || isLoading) return;

    setInputValue("");
    setMessages((prev) => [...prev, { type: "user", text: textToSendMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: textToSendMessage }],
        }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
      } else {
        setMessages((prev) => [...prev, { type: "bot", text: "죄송합니다. 오류가 발생했습니다." }]);
      }
    } catch (error) {
      console.error("AI chat failed:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "서버와 통신하는 중 문제가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#059669] transition-transform active:scale-95"
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
        className={`fixed bottom-24 right-6 w-[360px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none translate-y-10"
        } sm:w-[360px] sm:h-[550px] max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none`}
      >
        {/* 헤더 */}
        <div className="bg-[#10B981] p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">거제 소식통 챗봇</h3>
            <p className="text-xs text-emerald-100 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              실시간 AI 답변 중
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
        <div className="flex-1 p-4 overflow-y-auto bg-[#f8fafc] space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                  msg.type === "user"
                    ? "bg-[#10B981] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 px-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 질문 도우미 및 입력 영역 */}
        <div className="bg-white border-t border-gray-100 p-3 pt-4 space-y-3">
          {/* 추천 질문 (프롬프트 칩) */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 mb-2 px-1 uppercase tracking-wider">추천 질문</p>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(prompt)}
                  className="flex-shrink-0 py-1.5 px-3 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full hover:bg-emerald-100 transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* 텍스트 입력창 */}
          <div className="relative group">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="궁금한 것을 여기에 입력하세요..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-12 text-sm focus:bg-white focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 bg-[#10B981] text-white p-2 rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
          <p className="text-center text-[10px] text-gray-400">거제 소식통 AI는 블로그 데이터를 바탕으로 답변합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
