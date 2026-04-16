"use client";

import { useState, useEffect } from "react";

export default function DailyWisdomClient({ wisdoms }: { wisdoms: any[] }) {
  const [todaysWisdom, setTodaysWisdom] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 340;
      const ctx = canvas.getContext("2d")!;

      // 배경
      const grad = ctx.createLinearGradient(0, 0, 800, 340);
      grad.addColorStop(0, "#0a1e3a");
      grad.addColorStop(1, "#0b2d3e");
      ctx.fillStyle = grad;
      ctx.roundRect(0, 0, 800, 340, 20);
      ctx.fill();

      // 테두리
      ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
      ctx.lineWidth = 1;
      ctx.roundRect(1, 1, 798, 338, 20);
      ctx.stroke();

      // 배지
      ctx.fillStyle = "rgba(251, 191, 36, 0.15)";
      ctx.roundRect(24, 24, 140, 24, 6);
      ctx.fill();
      ctx.fillStyle = "#fcd34d";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("📜 오늘의 명심보감", 34, 41);

      // 한자
      ctx.fillStyle = "#fde68a";
      ctx.font = "bold 22px serif";
      const maxWidth = 752;
      let y = 95;
      const chars = todaysWisdom.chars || "";
      const charWords = chars.split(" ");
      let line = "";
      for (const word of charWords) {
        const test = line + word + " ";
        if (ctx.measureText(test).width > maxWidth && line) {
          ctx.fillText(line.trim(), 24, y);
          line = word + " ";
          y += 32;
        } else {
          line = test;
        }
      }
      if (line) { ctx.fillText(line.trim(), 24, y); y += 36; }

      // 독음
      ctx.fillStyle = "rgba(253, 211, 77, 0.55)";
      ctx.font = "13px serif";
      ctx.fillText(todaysWisdom.reading || "", 24, y);
      y += 32;

      // 해석
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.font = "14px sans-serif";
      const meaning = "— " + (todaysWisdom.meaning || "");
      const mWords = meaning.split(" ");
      let mLine = "";
      for (const word of mWords) {
        const test = mLine + word + " ";
        if (ctx.measureText(test).width > maxWidth && mLine) {
          ctx.fillText(mLine.trim(), 24, y);
          mLine = word + " ";
          y += 22;
        } else {
          mLine = test;
        }
      }
      if (mLine) ctx.fillText(mLine.trim(), 24, y);

      // 출처
      ctx.fillStyle = "rgba(253, 211, 77, 0.6)";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("chamnongkkun.com  by 瞑想家", 776, 318);

      // 다운로드
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "명심보감.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      }, "image/png");

    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 relative overflow-hidden group transition-all mt-1 bg-transparent border-b border-white/10" translate="no">
      <div className="flex flex-col gap-2 relative z-10 w-full">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 border border-amber-400/60 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded tracking-widest w-fit">
            📜 오늘의 명심보감
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-[10px] font-bold text-amber-300/70 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400/60 px-2 py-0.5 rounded transition-all disabled:opacity-50"
          >
            {saving ? "생성 중..." : "이미지 저장 💾"}
          </button>
        </div>

        {/* 저장 안내 메시지 */}
        {saved && (
          <div className="text-[11px] text-amber-300/80 bg-amber-400/10 border border-amber-400/20 rounded px-3 py-2">
            ✅ <strong>다운로드 폴더</strong>에 <strong>명심보감.png</strong>로 저장됐어요!<br/>
            카톡 채팅창 → 📎 파일첨부 → 다운로드 폴더에서 찾아 전송하세요.
          </div>
        )}

        <div className="text-base sm:text-lg font-bold text-amber-200 font-serif leading-snug">
          {todaysWisdom.chars}
        </div>
        <div className="text-xs sm:text-sm font-medium text-amber-300/60 font-serif tracking-wide">
          {todaysWisdom.reading}
        </div>
        <div className="text-xs sm:text-sm font-medium text-white/70 leading-relaxed">
          — {todaysWisdom.meaning}
        </div>
      </div>
    </div>
  );
}
