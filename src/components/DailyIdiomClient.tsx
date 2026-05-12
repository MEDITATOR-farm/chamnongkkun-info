"use client";

import { useState, useEffect } from "react";

export default function DailyIdiomClient({ idioms }: { idioms: any[] }) {
  const [todaysIdiom, setTodaysIdiom] = useState<any>(null);

  useEffect(() => {
    if (idioms && idioms.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      setTodaysIdiom(idioms[dayOfYear % idioms.length]);
    }
  }, [idioms]);

  if (!todaysIdiom) return null;

  return (
    <div className="p-6 relative group" translate="no">
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase">Today's Idiom</span>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-serif font-black text-primary tracking-tight">{todaysIdiom.hanja}</h3>
            <span className="text-sm font-serif font-bold text-foreground/40 italic">[{todaysIdiom.chars}]</span>
          </div>
          <p className="text-lg font-serif font-medium text-foreground/70 border-l-2 border-secondary/20 pl-4 mt-2">
            "{todaysIdiom.meaning}"
          </p>
        </div>
      </div>
    </div>
  );
}
