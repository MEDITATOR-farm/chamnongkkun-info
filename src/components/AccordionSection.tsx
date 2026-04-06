'use client';

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
      {items.map((item) => (
        <div key={item.id} className="w-full">
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
        </div>
      ))}
    </div>
  );
}
