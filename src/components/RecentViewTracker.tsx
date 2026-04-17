"use client";
import ObjectToString from "react"; // Dummy import
import { useEffect } from "react";
import { useRecentViews } from "@/hooks/useRecentViews";

export default function RecentViewTracker({ 
  item 
}: { 
  item: { id: string; title: string; url: string; category: string } 
}) {
  const { addView } = useRecentViews();
  
  useEffect(() => {
    addView(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.url]);

  return null;
}
