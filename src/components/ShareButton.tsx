"use client";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    // 풀 URL 만들기
    const fullUrl = url.startsWith('http') ? url : `https://www.chamnongkkun.com${url}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl,
        });
      } catch (e: any) {
        // AbortError is normal when a user cancels share
        if (e.name !== "AbortError") {
          console.error("공유하기 실패:", e);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(fullUrl);
        alert("링크가 복사되었습니다! 카카오톡이나 메시지로 붙여넣어 공유해 보세요.");
      } catch (err) {
        alert("공유하기를 지원하지 않는 브라우저입니다.");
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        height: "56px",
        marginTop: "1rem",
        borderRadius: "16px",
        background: "linear-gradient(90deg, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))",
        border: "1px solid rgba(34, 211, 238, 0.4)",
        color: "#22d3ee",
        fontWeight: "bold",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      className="hover:scale-[1.02] active:scale-95"
    >
      <span style={{ fontSize: "1.2rem" }}>📤</span>
      <span>이 소식 이웃에게 공유하기</span>
    </button>
  );
}
