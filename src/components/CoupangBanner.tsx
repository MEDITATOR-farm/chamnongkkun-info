"use client";

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

  // 파트너스 ID가 설정되어 있지 않으면 렌더링하지 않습니다.
  if (!partnerId || partnerId === "나중에_입력") {
    return null;
  }

  return (
    <div className="my-8 flex flex-col items-center w-full overflow-hidden">
      <div className="w-full max-w-[680px] h-[140px] relative">
        <iframe 
          src={`https://ads-partners.coupang.com/widgets.html?id=${partnerId}&template=carousel&trackingCode=AF0000000&subId=local-info`} 
          width="100%" 
          height="140" 
          frameBorder="0" 
          scrolling="no" 
          referrerPolicy="unsafe-url"
          loading="lazy"
          className="rounded-xl border border-neutral-100 shadow-sm"
        ></iframe>
      </div>
      <p className="text-[10px] text-neutral-400 mt-2 text-center leading-tight">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
