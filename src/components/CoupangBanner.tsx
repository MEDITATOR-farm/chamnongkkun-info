"use client";

export default function CoupangBanner() {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID || "AF0913433";
  const widgetId = process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID;

  // 위젯 ID가 있는 경우 (기존 다이나믹 배너 방식 유지)
  if (widgetId && widgetId !== "나중에_입력" && widgetId !== "") {
    return (
      <div className="my-8 flex flex-col items-center w-full overflow-hidden px-4">
        <div className="w-full max-w-[680px] h-[140px] relative">
          <iframe 
            src={`https://ads-partners.coupang.com/widgets.html?id=${widgetId}&template=carousel&trackingCode=${partnerId}&subId=local-info`} 
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

  // 위젯 ID가 없는 경우 (파트너 ID만 사용하는 세련된 버튼 방식)
  return (
    <div className="my-8 flex flex-col items-center w-full px-4">
      <a 
        href={`https://link.coupang.com/a/bTj9P0?subId=local-info&trackingCode=${partnerId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-full max-w-[680px] bg-gradient-to-r from-blue-600 to-blue-500 p-[1px] rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-blue-200/50 hover:scale-[1.01]"
      >
        <div className="bg-white rounded-[15px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
              📦
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-slate-800 font-bold text-base mb-0.5">쿠팡 오늘의 추천 상품</h4>
              <p className="text-slate-500 text-[11px] font-medium opacity-80">파트너스 활동을 통해 매일 엄선된 특가 상품을 만나보세요!</p>
            </div>
          </div>
          <div className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold group-hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            쿠팡 바로가기 <span className="translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </a>
      <p className="text-[10px] text-neutral-400 mt-3 text-center leading-tight">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
