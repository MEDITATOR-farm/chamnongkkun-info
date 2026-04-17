"use client";
import { useEffect, useState } from "react";

export interface RecentItem {
  id: string;
  title: string;
  url: string;
  category: string;
  timestamp: number;
}

const STORAGE_KEY = "chamnongkkun_recent_views";

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentViews(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load recent views", e);
    }
  }, []);

  const addView = (item: Omit<RecentItem, "timestamp">) => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const parsed: RecentItem[] = current ? JSON.parse(current) : [];
      
      const filtered = parsed.filter(i => i.url !== item.url);
      const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 15);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentViews(updated);
    } catch (e) {
      console.error("Failed to save recent view", e);
    }
  };

  const clearViews = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentViews([]);
  };

  return { recentViews, addView, clearViews };
}
