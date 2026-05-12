"use client";

import { useState, useEffect } from "react";

export default function DailyWisdomClient({ wisdoms }: { wisdoms: any[] }) {
  const [todaysWisdom, setTodaysWisdom] = useState<any>(null);

  useEffect(() => {
    if (wisdoms && wisdoms.length > 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - start.getTime();
      const sixHours = 1000 * 60 * 60 * 6;
      const intervalIndex = Math.floor(diff / sixHours);
      setTodaysWisdom(wisdoms[intervalIndex % wisdoms.length]);
    }
  }, [wisdoms]);

  if (!todaysWisdom) return null;

  return (
    <div className="p-6 relative group" translate="no">
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase">Daily Wisdom</span>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl md:text-2xl font-serif font-black text-primary leading-snug">{todaysWisdom.chars}</h3>
            <span className="text-[10px] font-serif font-bold text-foreground/30 tracking-widest">{todaysWisdom.reading}</span>
          </div>
          <p className="text-base font-serif font-medium text-foreground/70 border-l-2 border-secondary/20 pl-4 mt-2">
            — {todaysWisdom.meaning}
          </p>
        </div>
      </div>
    </div>
  );
}
