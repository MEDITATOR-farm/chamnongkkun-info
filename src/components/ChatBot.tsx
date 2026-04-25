"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface ChatDataItem {
  question: string;
  answer: string;
}

interface Message {
  type: "user" | "bot" | "admin";
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "human">("ai");
  const [chatData, setChatData] = useState<ChatDataItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: "안녕하세요! 거제 소식통입니다. 무엇이든 물어보세요! 😊" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // 관리자 페이지에서는 챗봇을 숨깁니다.
  if (pathname.startsWith("/admin")) return null;

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

  // 상담원 모드일 때 폴링 시작
  useEffect(() => {
    if (mode === "human" && isOpen) {
      pollingRef.current = setInterval(async () => {
        try {
          const response = await fetch("/api/chat-poll");
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            // 마지막으로 받은 메시지와 비교하거나, 새 메시지만 필터링하는 로직이 필요할 수 있으나
            // 여기서는 단순하게 새 admin 메시지가 있으면 추가합니다.
            const newAdminMessages = data.messages.filter((m: any) => m.sender === "admin");
            if (newAdminMessages.length > 0) {
              setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                const newMsgText = newAdminMessages[newAdminMessages.length - 1].text;
                if (lastMsg.text !== newMsgText) {
                  return [...prev, { type: "admin", text: newMsgText }];
                }
                return prev;
              });
            }
          }
        } catch (error) {
          console.error("Polling failed:", error);
        }
      }, 2000);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [mode, isOpen]);

  const handleQuestionClick = (question: string, answer?: string) => {
    if (mode === "human") return; // 상담원 모드에서는 추천 질문 비활성화
    
    if (answer) {
      setMessages((prev) => [
        ...prev,
        { type: "user", text: question },
        { type: "bot", text: answer },
      ]);
    } else {
      handleSendMessage(null, question);
    }
  };

  const switchToHuman = () => {
    setMode("human");
    setMessages((prev) => [
      ...prev,
      { type: "bot", text: "상담원 연결을 시도합니다. 잠시만 기다려 주세요... (상담원 모드)" }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent | null, directText?: string) => {
    if (e) e.preventDefault();
    
    const textToSendMessage = directText || inputValue;
    if (!textToSendMessage.trim() || isLoading) return;

    setInputValue("");
    setMessages((prev) => [...prev, { type: "user", text: textToSendMessage }]);
    setIsLoading(true);

    const endpoint = mode === "ai" ? "/api/chat" : "/api/chat-human";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSendMessage, // 상담원 API용
          messages: [{ role: "user", content: textToSendMessage }], // AI API용
        }),
      });

      const data = await response.json();
      
      if (mode === "ai") {
        if (data.response) {
          setMessages((prev) => [...prev, { type: "bot", text: data.response }]);
        } else {
          setMessages((prev) => [...prev, { type: "bot", text: "죄송합니다. 오류가 발생했습니다." }]);
        }
      } else {
        // 상담원 모드에서는 폴링을 통해 답변을 기다림
        // 여기서는 메시지 전송 성공 여부만 확인 가능
      }
    } catch (error) {
      console.error("Message send failed:", error);
      setMessages((prev) => [...prev, { type: "bot", text: "서버와 통신하는 중 문제가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[110]">
      {/* 챗봇 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
          mode === "ai" ? "bg-[#10B981] hover:bg-[#059669]" : "bg-orange-500 hover:bg-orange-600"
        }`}
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
        <div className={`${mode === "ai" ? "bg-[#10B981]" : "bg-orange-500"} p-4 text-white flex items-center gap-3 transition-colors`}>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm">{mode === "ai" ? "거제 소식통 챗봇" : "상담원 실시간 대화"}</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {mode === "ai" ? "실시간 AI 답변 중" : "상담원 연결됨"}
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
                    ? `${mode === "ai" ? "bg-[#10B981]" : "bg-orange-500"} text-white rounded-tr-none`
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && mode === "ai" && (
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
          {/* AI 모드일 때만 추천 질문 및 상담원 연결 버튼 표시 */}
          {mode === "ai" && (
            <div>
              <div className="flex justify-between items-center mb-2 px-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">추천 질문</p>
                <button 
                  onClick={switchToHuman}
                  className="text-[11px] font-bold text-orange-500 hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  상담원 연결
                </button>
              </div>
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
          )}

          {/* 텍스트 입력창 */}
          <div className="relative group">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={mode === "ai" ? "궁금한 것을 여기에 입력하세요..." : "상담원에게 메시지를 보내세요..."}
                className={`w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 pr-12 text-sm focus:bg-white outline-none transition-all shadow-inner ${
                  mode === "ai" ? "focus:ring-2 focus:ring-[#10B981]" : "focus:ring-2 focus:ring-orange-500"
                }`}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`absolute right-2 text-white p-2 rounded-xl disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-md ${
                  mode === "ai" ? "bg-[#10B981]" : "bg-orange-500"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
          <p className="text-center text-[10px] text-gray-400">
            {mode === "ai" ? "거제 소식통 AI는 블로그 데이터를 바탕으로 답변합니다." : "실시간 상담 중입니다. 답변이 올 때까지 잠시만 기다려 주세요."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
