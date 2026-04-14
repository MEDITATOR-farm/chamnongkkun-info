import fs from "fs"; import path from "path";
export default function Page() {
  let data: any = null;
  try { data = JSON.parse(fs.readFileSync(path.join(process.cwd(),"public/data/realestate.json"),"utf-8")); } catch(e) {}
  if (!data) return <div className="p-8 text-center text-slate-400">데이터 준비 중입니다...</div>;
  return (
    <div className="min-h-screen bg-[#f8fbff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏠</span><h1 className="text-2xl font-black text-slate-800">거제 부동산 시세</h1></div>
        <p className="text-sm text-slate-400 mb-2">업데이트: {data.updatedAt}</p>
        <p className="text-base text-slate-600 mb-8 font-medium">{data.summary}</p>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {data.areas?.map((a: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
              <div><div className="font-bold text-slate-800 text-lg">{a.name}</div><div className="text-sm text-slate-500 mt-1">{a.highlight}</div></div>
              <div className="text-right"><div className="font-black text-slate-700">{a.avgPrice}</div>
              <div className={`text-lg font-bold mt-1 ${a.trend==="상승"?"text-red-500":a.trend==="하락"?"text-blue-500":"text-slate-400"}`}>{a.trendIcon} {a.trend}</div></div>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <div className="font-bold text-amber-800 mb-3">💡 알아두면 좋은 팁</div>
          <ul className="space-y-2">{data.tips?.map((t: string, i: number) => <li key={i} className="text-sm text-amber-700 flex gap-2"><span>•</span><span>{t}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
