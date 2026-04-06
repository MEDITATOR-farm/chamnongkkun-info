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
  const [openId, setOpenId] = useState<string | number | null>(null);

  const toggle = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  const getIcon = () => {
    switch (type) {
      case 'diary': return '🌱';
      case 'blog': return '📝';
      case 'event': return '🌸';
      default: return '📍';
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'diary': return 'border-cyan-400';
      case 'blog': return 'border-blue-400';
      case 'event': return 'border-emerald-400';
      default: return 'border-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="w-full">
          {type === 'diary' ? (
            <div 
              onClick={() => toggle(item.id)}
              className="list-item-slim cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/50 border border-white flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
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
                <span className={`transform transition-all duration-300 ${openId === item.id ? 'rotate-180 text-cyan-500' : 'text-slate-300'} text-xs`}>
                  ▼
                </span>
              </div>
            </div>
          ) : (
            <Link 
              href={item.link || '#'}
              className="list-item-slim cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/50 border border-white flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
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
          
          {type === 'diary' && (
            <div className={`accordion-content ${openId === item.id ? 'open' : ''}`}>
              <div className={`glass-card rounded-[24px] p-6 border-l-4 ${getAccentColor()} shadow-inner bg-white/40`}>
                 {/* 미디어 콘텐츠 표시 (일기 등) */}
                 {(item.image || item.video) && (
                   <div className="mb-6 rounded-2xl overflow-hidden border border-white/50 shadow-sm transition-transform hover:scale-[1.01] duration-500">
                      {item.video ? (
                        <video src={item.video} controls className="w-full h-auto max-h-[400px] object-cover" />
                      ) : (
                        <img src={item.image} alt={item.title} className="w-full h-auto max-h-[400px] object-cover" />
                      )}
                   </div>
                 )}
  
                 <div className="flex flex-wrap gap-2 mb-4">
                    {item.category && (
                      <span className="px-3 py-1 bg-white/60 text-slate-600 text-[10px] font-black rounded-full border border-white shadow-sm uppercase tracking-widest">
                        {item.category}
                      </span>
                    )}
                    {item.location && (
                      <span className="px-3 py-1 bg-emerald-50/50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 shadow-sm">
                        📍 {item.location}
                      </span>
                    )}
                    <span className="sm:hidden px-3 py-1 bg-white/60 text-slate-400 text-[10px] font-black rounded-full border border-white shadow-sm">
                      {item.date}
                    </span>
                 </div>
                 
                 <div className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap font-medium">
                   {item.content || item.summary || "상세 정보가 없습니다."}
                 </div>
                 
                 {item.link && (
                   <Link 
                     href={item.link} 
                     className="inline-flex items-center gap-2 text-xs font-black text-cyan-600 hover:text-cyan-800 transition-all bg-white/80 px-4 py-2 rounded-xl border border-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                   >
                     전체 내용 보기
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                   </Link>
                 )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
