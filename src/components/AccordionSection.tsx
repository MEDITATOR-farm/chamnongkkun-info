'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AccordionItem {
  id: string | number;
  title: string;
  date?: string;
  category?: string;
  location?: string;
  summary?: string;
  content?: string;
  image?: string;
  video?: string;
  link?: string;
}

interface AccordionSectionProps {
  items: AccordionItem[];
  type: 'diary' | 'blog' | 'event';
}

export default function AccordionSection({ items, type }: AccordionSectionProps) {
  // 어떤 아이템이 펼쳐졌는지 기억하기 위한 '기억장치'입니다.
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  const getIcon = () => {
    switch (type) {
      case 'diary': return '🌱';
      case 'blog': return '📝';
      case 'event': return '🌸';
      default: return '📍';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isDiary = type === 'diary';
        const isExpanded = expandedId === item.id;

        return (
          <div key={item.id} className="w-full">
            {/* 1. 일기(diary)일 때는 클릭 시 펼치고 접는 동작을 합니다. */}
            {isDiary ? (
              <div 
                className={`list-item-slim cursor-pointer group flex-col items-stretch !gap-0 ${isExpanded ? 'border-cyan-200/20' : 'border-transparent'}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-center justify-between w-full h-12">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-transparent border border-slate-100/30 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      {getIcon()}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-slate-700 truncate group-hover:text-cyan-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-70">
                      {item.date}
                    </span>
                    <span className={`text-slate-300 text-xs transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                {/* 펼쳐지는 내용 부분입니다. */}
                <div className={`accordion-content ${isExpanded ? 'open' : ''}`}>
                  <div className="space-y-4">
                    {item.content && (
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    )}
                    
                    {item.image && (
                      <div className="rounded-xl overflow-hidden max-w-md">
                        <img src={item.image} alt={item.title} className="w-full h-auto" />
                      </div>
                    )}

                    {item.video && (
                      <div className="rounded-xl overflow-hidden max-w-md">
                        <video src={item.video} controls className="w-full h-auto" />
                      </div>
                    )}

                    <div className="pt-2">
                      <Link 
                        href={item.link || '#'}
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-600 text-xs font-bold hover:underline inline-flex items-center gap-1"
                      >
                        일기 전문 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 2. 일기 외의 항목(블로그, 행사 등)은 기존처럼 바로 링크로 이동합니다. */
              <Link 
                href={item.link || '#'}
                className="list-item-slim cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-transparent border border-slate-100/30 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    {getIcon()}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-slate-700 truncate group-hover:text-cyan-600 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:inline text-[10px] font-black text-slate-400 uppercase tracking-tighter opacity-70">
                    {item.date}
                  </span>
                  <span className="text-slate-300 text-xs group-hover:text-cyan-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
