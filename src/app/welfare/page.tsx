import fs from "fs"; import path from "path";
const tagColors: any = { 의료:"bg-red-100 text-red-700", 교육:"bg-yellow-100 text-yellow-700", 주거:"bg-blue-100 text-blue-700", 생활:"bg-pink-100 text-pink-700", 노인:"bg-orange-100 text-orange-700", 장애:"bg-purple-100 text-purple-700" };
export default function Page() {
  let data: any = null;
  try { data = JSON.parse(fs.readFileSync(path.join(process.cwd(),"public/data/welfare.json"),"utf-8")); } catch(e) {}
  if (!data) return <div className="p-8 text-center text-slate-400">데이터 준비 중입니다...</div>;
  return (
    <div className="min-h-screen bg-[#f8fbff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏥</span><h1 className="text-2xl font-black text-slate-800">거제시 복지혜택 · 건강보험 절감</h1></div>
        <p className="text-sm text-slate-400 mb-2">업데이트: {data.updatedAt}</p>
        <p className="text-base text-slate-600 mb-8 font-medium">{data.summary}</p>
        <h2 className="text-lg font-bold text-slate-700 mb-4">📋 복지 혜택</h2>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {data.welfare?.map((w: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-800">{w.title}</div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${tagColors[w.tag]||"bg-slate-100 text-slate-600"}`}>{w.tag}</span>
              </div>
              <div className="text-sm text-slate-600 mb-2">{w.desc}</div>
              <div className="text-sm text-slate-500 space-y-1"><div>👤 {w.target}</div><div>💵 {w.amount}</div><div>📋 {w.how}</div></div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-bold text-slate-700 mb-4">💊 건강보험료 절감 방법</h2>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {data.insuranceTips?.map((t: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="font-bold text-slate-800 mb-1">{t.title}</div>
              <div className="text-sm text-slate-500 mb-2">{t.desc}</div>
              <div className="text-emerald-600 font-black">{t.savings}</div>
            </div>
          ))}
        </div>
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
          <div className="font-bold text-rose-800 mb-3">💡 꿀팁</div>
          <ul className="space-y-2">{data.tips?.map((t: string, i: number) => <li key={i} className="text-sm text-rose-700 flex gap-2"><span>•</span><span>{t}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
