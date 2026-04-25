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
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/chat-data.json")
      .then((res) => res.json())
      .then((data) => setChatData(data))
      .catch((err) => console.error("Chat data loading failed:", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleQuestionClick = (item: ChatDataItem) => {
    setMessages((prev) => [
      ...prev,
      { type: "user", text: item.question },
      { type: "bot", text: item.answer },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue("");
    setMessages((prev) => [...prev, { type: "user", text: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userText }],
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
        className={`fixed bottom-24 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none translate-y-10"
        } sm:w-[360px] sm:h-[500px] max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none`}
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
                    ? "bg-[#10B981] text-white rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 질문 버튼 및 입력 영역 */}
        <div className="bg-white border-t border-gray-100 flex flex-col">
          {/* 자주 묻는 질문 버튼 */}
          <div className="p-3 pb-0 max-h-32 overflow-y-auto flex flex-wrap gap-2">
            {chatData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuestionClick(item)}
                className="text-left py-1 px-3 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-colors whitespace-nowrap"
              >
                {item.question}
              </button>
            ))}
          </div>

          {/* 텍스트 입력창 */}
          <form onSubmit={handleSendMessage} className="p-3 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="궁금한 것을 물어보세요..."
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-[#10B981] text-white p-2 rounded-xl disabled:opacity-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
