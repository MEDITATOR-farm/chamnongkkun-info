import fs from "fs"; import path from "path";
const G: React.CSSProperties = { background:"rgba(255,255,255,0.06)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"16px" };
export default function Page() {
  let data: any = null;
  try { data = JSON.parse(fs.readFileSync(path.join(process.cwd(),"public/data/welfare.json"),"utf-8")); } catch(e) {}
  if (!data) return <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060f1e,#0a1e3a)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.4)",fontSize:"0.9rem"}}>데이터 준비 중입니다...</div>;
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#060f1e 0%,#0a1e3a 50%,#081a14 100%)",padding:"3rem 1.5rem",color:"white"}}>
      <div style={{maxWidth:"720px",margin:"0 auto"}}>
        <a href="/" style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.4)",textDecoration:"none",display:"block",marginBottom:"1.5rem"}}>← 홈으로</a>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px"}}>
          <span style={{fontSize:"2rem"}}>🏥</span>
          <h1 style={{fontSize:"1.6rem",fontWeight:800,margin:0}}>건강보험료 절감 방법</h1>
        </div>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.8rem",marginBottom:"4px"}}>업데이트: {data.updatedAt}</p>
        <p style={{color:"rgba(255,255,255,0.65)",fontSize:"0.95rem",marginBottom:"2rem",lineHeight:1.7}}>{data.summary}</p>
        <h2 style={{fontSize:"1rem",fontWeight:700,color:"#c4b5fd",marginBottom:"1rem"}}>💊 보험료 절감 방법</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"2rem"}}>
          {data.insuranceTips?.map((t: any, i: number) => (
            <div key={i} style={{...G,padding:"1rem 1.2rem"}}>
              <div style={{fontWeight:700,color:"white",fontSize:"0.95rem",marginBottom:"6px"}}>{t.title}</div>
              <div style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.5)",marginBottom:"8px",lineHeight:1.6}}>{t.desc}</div>
              <div style={{fontSize:"1rem",fontWeight:800,color:"#34d399"}}>{t.savings}</div>
            </div>
          ))}
        </div>
        <h2 style={{fontSize:"1rem",fontWeight:700,color:"#fdba74",marginBottom:"1rem"}}>🏥 거제시 복지 혜택</h2>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"2rem"}}>
          {data.welfare?.slice(0,4).map((w: any, i: number) => (
            <div key={i} style={{...G,padding:"1rem 1.2rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
                <span style={{fontWeight:700,color:"white",fontSize:"0.9rem"}}>{w.title}</span>
                <span style={{fontSize:"0.65rem",fontWeight:700,padding:"2px 9px",borderRadius:"20px",background:"rgba(253,186,116,0.15)",color:"#fdba74"}}>{w.tag}</span>
              </div>
              <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{w.desc}</div>
            </div>
          ))}
        </div>
        <div style={{...G,padding:"1.2rem",background:"rgba(196,181,253,0.07)"}}>
          <div style={{fontWeight:700,color:"#c4b5fd",marginBottom:"10px",fontSize:"0.9rem"}}>💡 꿀팁</div>
          {data.tips?.map((t: string, i: number) => <div key={i} style={{fontSize:"0.82rem",color:"rgba(255,255,255,0.55)",marginBottom:"6px",lineHeight:1.6}}>• {t}</div>)}
        </div>
      </div>
    </div>
  );
}
