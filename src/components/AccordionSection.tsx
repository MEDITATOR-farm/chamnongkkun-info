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
            {isDiary ? (
              <div 
                className={`list-item-slim cursor-pointer group flex-col items-stretch !gap-0 ${isExpanded ? 'border-cyan-200/20' : 'border-transparent'}`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <div className="flex items-center justify-between w-full h-12">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-transparent border border-white/20 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                      {getIcon()}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-white/90 truncate group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="hidden sm:inline text-[10px] font-black text-white/40 uppercase tracking-tighter">
                      {item.date}
                    </span>
                    <span className={`text-white/40 text-xs transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                  </div>
                </div>

                <div className={`accordion-content ${isExpanded ? 'open' : ''}`}>
                  <div className="space-y-4">
                    {item.content && (
                      <p className="text-white/70 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
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
                        className="text-cyan-400 text-xs font-bold hover:underline inline-flex items-center gap-1"
                      >
                        일기 전문 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href={item.link || '#'}
                className="list-item-slim cursor-pointer group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-transparent border border-white/20 flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                    {getIcon()}
                  </span>
                  <h3 className="text-sm md:text-base font-bold text-white/90 truncate group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="hidden sm:inline text-[10px] font-black text-white/40 uppercase tracking-tighter">
                    {item.date}
                  </span>
                  <span className="text-white/40 text-xs group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
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
