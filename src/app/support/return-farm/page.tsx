import fs from "fs"; import path from "path";
const tagColors: any = { 귀농:"bg-lime-100 text-lime-700", 귀촌:"bg-teal-100 text-teal-700", 시설:"bg-orange-100 text-orange-700", 교육:"bg-yellow-100 text-yellow-700", 주거:"bg-blue-100 text-blue-700" };
const G: React.CSSProperties = { background:"rgba(255,255,255,0.06)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"16px" };
export default function Page() {
  let data: any = null;
  try { data = JSON.parse(fs.readFileSync(path.join(process.cwd(),"public/data/farm-support.json"),"utf-8")); } catch(e) {}
  if (!data) return <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060f1e,#0a1e3a)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem"}}>데이터 준비 중입니다...</div>;
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060f1e 0%,#0a1e3a 50%,#081a14 100%)",padding:"3rem 1.5rem",color:"white"}}>
      <div style={{maxWidth:"720px",margin:"0 auto"}}>
        <a href="/" style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",textDecoration:"none",display:"block",marginBottom:"1.5rem"}}>← 홈으로</a>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"}}>
          <span style={{fontSize:"2rem"}}>🏡</span>
          <h1 style={{fontSize:"1.6rem",fontWeight:800,margin:0}}>귀농귀촌 지원금</h1>
        </div>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",marginBottom:"4px"}}>업데이트: {data.updatedAt}</p>
        <p style={{color:"rgba(255,255,255,0.65)",fontSize:"0.95rem",marginBottom:"2rem",lineHeight:1.7}}>{data.summary}</p>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"2rem"}}>
          {data.supports?.map((s: any, i: number) => (
            <div key={i} style={{...G,padding:"1rem 1.2rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontWeight:700,color:"white",fontSize:"0.95rem"}}>{s.title}</span>
                <span style={{fontSize:"0.65rem",fontWeight:700,padding:"2px 9px",borderRadius:"20px",background:"rgba(134,239,172,0.15)",color:"#86efac"}}>{s.tag}</span>
              </div>
              <div style={{fontSize:"1.1rem",fontWeight:800,color:"#34d399",marginBottom:"10px"}}>{s.amount}</div>
              <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",display:"flex",flexDirection:"column",gap:"4px"}}>
                <span>👤 {s.target}</span><span>📅 {s.deadline}</span><span>📋 {s.how}</span>
              </div>
              {s.link&&<a href={s.link} target="_blank" rel="noopener noreferrer" style={{marginTop:"10px",display:"inline-block",fontSize:"0.75rem",color:"#22d3ee",textDecoration:"none"}}>자세히 보기 →</a>}
            </div>
          ))}
        </div>
        <div style={{...G,padding:"1.2rem",background:"rgba(134,239,172,0.07)"}}>
          <div style={{fontWeight:700,color:"#86efac",marginBottom:"10px",fontSize:"0.9rem"}}>💡 꿀팁</div>
          {data.tips?.map((t: string, i: number) => <div key={i} style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",marginBottom:"6px",lineHeight:1.6}}>• {t}</div>)}
        </div>
      </div>
    </div>
  );
}
