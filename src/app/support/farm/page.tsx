import Link from "next/link";
import fs from "fs"; import path from "path";
const tagColors: any = { 직불금:"bg-green-100 text-green-700", 귀농:"bg-lime-100 text-lime-700", 귀촌:"bg-teal-100 text-teal-700", 시설:"bg-orange-100 text-orange-700", 교육:"bg-yellow-100 text-yellow-700" };
export default function Page() {
  let data: any = null;
  try { data = JSON.parse(fs.readFileSync(path.join(process.cwd(),"public/data/farm-support.json"),"utf-8")); } catch(e) {}
  if (!data) return <div className="p-8 text-center text-slate-400">데이터 준비 중입니다...</div>;
  return (
    <div className="min-h-screen bg-[#f8fbff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div style={{ marginBottom: "1.5rem" }}>
  <Link href="/" style={{ textDecoration: "none", color: "#2e7d32", fontWeight: "bold", fontSize: "0.9rem" }}>
    ← 홈으로 돌아가기
  </Link>
</div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🌾</span><h1 className="text-[clamp(1.25rem,4vw,1.5rem)] md:text-2xl font-black text-slate-800">농업직불금 · 귀농 지원금</h1></div>
        <p className="text-sm text-slate-400 mb-2">업데이트: {data.updatedAt}</p>
        <p className="text-base text-slate-600 mb-8 font-medium">{data.summary}</p>
        <div className="grid grid-cols-1 gap-4 mb-10">
          {data.supports?.map((s: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-slate-800">{s.title}</div>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${tagColors[s.tag]||"bg-slate-100 text-slate-600"}`}>{s.tag}</span>
              </div>
              <div className="text-xl font-black text-green-600 mb-3">{s.amount}</div>
              <div className="text-sm text-slate-500 space-y-1">
                <div>👤 {s.target}</div><div>📅 {s.deadline}</div><div>📋 {s.how}</div>
              </div>
              {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-blue-500 hover:underline">자세히 보기 →</a>}
            </div>
          ))}
        </div>
        <div className="bg-lime-50 rounded-2xl p-5 border border-lime-100">
          <div className="font-bold text-lime-800 mb-3">💡 꿀팁</div>
          <ul className="space-y-2">{data.tips?.map((t: string, i: number) => <li key={i} className="text-sm text-lime-700 flex gap-2"><span>•</span><span>{t}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}
