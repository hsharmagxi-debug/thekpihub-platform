import { useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const C = { bg:'#06071A', card:'#0B0D24', cardHi:'#10133A', border:'#1B1E42', borderHi:'#2D3170', gold:'#E9A123', goldFaint:'rgba(233,161,35,0.08)', goldGlow:'rgba(233,161,35,0.25)', teal:'#00D4A0', red:'#FF4455', blue:'#4B90FF', purple:'#9B6DFF', text:'#E4E6F4', muted:'#5A5F82', dim:'#1D2048' };
const fd = "'Cormorant Garamond', Georgia, serif";
const fb = "'DM Sans', system-ui, sans-serif";
const fm = "'DM Mono', monospace";

const MRR = [{m:'Oct',mrr:12400,target:14000},{m:'Nov',mrr:15200,target:16000},{m:'Dec',mrr:18700,target:18000},{m:'Jan',mrr:21100,target:20000},{m:'Feb',mrr:24600,target:23000},{m:'Mar',mrr:28900,target:27000},{m:'Apr',mrr:34200,target:31000}];
const RADAR = [{kpi:"Retention",kpihub:88,market:65},{kpi:"Growth",kpihub:92,market:70},{kpi:"Efficiency",kpihub:76,market:60},{kpi:"Engagement",kpihub:84,market:55},{kpi:"Unit Econ",kpihub:79,market:68},{kpi:"Innovation",kpihub:95,market:50}];
const BENCHMARKS = [
  {name:"ARR Growth YoY",p25:"45%",p50:"87%",p75:"142%",p90:"210%",cat:"Growth"},
  {name:"MRR Churn Rate",p25:"2.1%",p50:"3.8%",p75:"6.2%",p90:"10%",cat:"Retention"},
  {name:"CAC Payback (mo)",p25:"9",p50:"16",p75:"24",p90:"36",cat:"Efficiency"},
  {name:"LTV:CAC Ratio",p25:"2.1x",p50:"3.4x",p75:"5.2x",p90:"8x",cat:"Unit Econ"},
  {name:"Net Revenue Retention",p25:"95%",p50:"108%",p75:"122%",p90:"140%",cat:"Retention"},
  {name:"Gross Margin",p25:"55%",p50:"68%",p75:"78%",p90:"85%",cat:"Efficiency"},
  {name:"Magic Number",p25:"0.4",p50:"0.7",p75:"1.1",p90:"1.8",cat:"Efficiency"},
  {name:"Rule of 40",p25:"12",p50:"28",p75:"44",p90:"68",cat:"Growth"},
  {name:"Quick Ratio",p25:"1.4",p50:"2.2",p75:"3.6",p90:"5.1",cat:"Growth"},
  {name:"Burn Multiple",p25:"0.8x",p50:"1.4x",p75:"2.3x",p90:"4x",cat:"Efficiency"},
  {name:"DAU/MAU Ratio",p25:"12%",p50:"22%",p75:"38%",p90:"55%",cat:"Engagement"},
];
const COMPETITORS = [
  {name:"Klipfolio",score:72,arr:"$18M",nps:34,churn:"4.2%",signal:"📉 Lost 3 enterprise deals Q1"},
  {name:"Geckoboard",score:61,arr:"$12M",nps:28,churn:"5.8%",signal:"🔄 Rebranding underway"},
  {name:"Databox",score:81,arr:"$31M",nps:42,churn:"3.1%",signal:"🚀 Series B closed $22M"},
  {name:"Grow.com",score:68,arr:"$21M",nps:31,churn:"4.9%",signal:"👥 Hiring freeze detected"},
];

async function askClaude(prompt, sys="") {
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content:prompt}]})});
  const d = await r.json();
  return d.content?.[0]?.text || "No response.";
}

const Card = ({children,style={},glow=false}) => <div style={{background:C.card,border:`1px solid ${glow?C.gold:C.border}`,borderRadius:12,padding:20,boxShadow:glow?`0 0 32px ${C.goldGlow}`:'0 2px 20px rgba(0,0,0,0.4)',transition:'all 0.2s',...style}}>{children}</div>;
const Tag = ({children,color=C.gold}) => <span style={{background:`${color}18`,color,border:`1px solid ${color}30`,borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,fontFamily:fm,letterSpacing:'0.05em'}}>{children}</span>;
const Spin = () => <div style={{display:'flex',alignItems:'center',gap:10,color:C.muted,padding:8}}><div style={{width:16,height:16,border:`2px solid ${C.dim}`,borderTopColor:C.gold,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/><span style={{fontFamily:fb,fontSize:13}}>Processing intelligence...</span></div>;

function Auth({onAuth}) {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [co,setCo]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const go=async()=>{
    setLoading(true);setErr("");
    await new Promise(r=>setTimeout(r,800));
    if(!email.includes("@")){setErr("Valid email required");setLoading(false);return;}
    if(pass.length<6){setErr("Password min 6 chars");setLoading(false);return;}
    onAuth({name:name||email.split("@")[0],email,company:co||"Your Company"});
    setLoading(false);
  };
  const inp = (val,set,ph,type="text") => <input type={type} value={val} onChange={e=>set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder={ph} style={{background:C.dim,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px',color:C.text,fontFamily:fb,fontSize:14,outline:'none',width:'100%',boxSizing:'border-box'}}/>;
  return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:fb,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,opacity:0.04,backgroundImage:`linear-gradient(${C.gold} 1px,transparent 1px),linear-gradient(90deg,${C.gold} 1px,transparent 1px)`,backgroundSize:'48px 48px'}}/>
      <div style={{position:'absolute',top:'15%',left:'10%',width:350,height:350,borderRadius:'50%',background:`radial-gradient(circle,${C.goldGlow} 0%,transparent 70%)`,filter:'blur(50px)'}}/>
      <div style={{position:'absolute',bottom:'15%',right:'10%',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(75,144,255,0.12) 0%,transparent 70%)',filter:'blur(50px)'}}/>
      <div style={{width:420,position:'relative',zIndex:1}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:10}}>
            <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${C.gold},#B87A18)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,fontWeight:900,color:'#000',fontFamily:fd}}>K</div>
            <span style={{fontSize:22,fontWeight:700,color:C.text,fontFamily:fd,letterSpacing:'0.02em'}}>The KPI Hub</span>
          </div>
          <div style={{fontSize:11,color:C.muted,letterSpacing:'0.12em',textTransform:'uppercase',fontWeight:600}}>Decision-Grade Intelligence · Zero Fluff</div>
        </div>
        <Card style={{padding:32}}>
          <div style={{display:'flex',gap:4,marginBottom:24,background:C.dim,borderRadius:8,padding:4}}>
            {['login','register'].map(m=><button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:'8px 0',borderRadius:6,border:'none',background:mode===m?C.gold:'transparent',color:mode===m?'#000':C.muted,fontFamily:fb,fontWeight:700,fontSize:13,cursor:'pointer',transition:'all 0.2s',textTransform:'capitalize'}}>{m}</button>)}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {mode==='register'&&<>{inp(name,setName,"Full name")}{inp(co,setCo,"Company name")}</>}
            {inp(email,setEmail,"Email address","email")}
            {inp(pass,setPass,"Password","password")}
            {err&&<div style={{color:C.red,fontSize:12}}>{err}</div>}
            <button onClick={go} disabled={loading} style={{background:`linear-gradient(135deg,${C.gold},#C88A1A)`,color:'#000',border:'none',borderRadius:8,padding:'13px 0',fontFamily:fb,fontWeight:800,fontSize:14,cursor:loading?'not-allowed':'pointer',opacity:loading?0.7:1,transition:'all 0.2s',marginTop:4,letterSpacing:'0.02em'}}>
              {loading?'Authenticating...':(mode==='login'?'Access Intelligence →':'Create Account →')}
            </button>
          </div>
          <div style={{textAlign:'center',marginTop:18,color:C.muted,fontSize:11}}>Enterprise-grade security · SOC 2 compliant</div>
        </Card>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700&family=DM+Sans:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}input::placeholder{color:${C.muted};}@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

function Overview({user}) {
  const kpis=[{l:"MRR",v:"$34,200",d:"▲ 18.4% MoM",dc:C.teal,s:"April 2026"},{l:"ARR Run Rate",v:"$410K",d:"▲ 26.2% QoQ",dc:C.teal,s:"vs $325K last qtr"},{l:"Churn Rate",v:"1.98%",d:"▲ 0.31% improved",dc:C.teal,s:"Target <2% ✓"},{l:"LTV:CAC",v:"4.8x",d:"▼ p75 is 5.2x",dc:'#F59E0B',s:"Close to top quartile"},{l:"NRR",v:"118%",d:"▲ Expansion strong",dc:C.teal,s:"Top decile: 140%"},{l:"Rule of 40",v:"61",d:"▲ Above threshold",dc:C.teal,s:"Growth + Profitability"}];
  const tt={contentStyle:{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontFamily:fm,fontSize:11},labelStyle:{color:C.gold,fontWeight:700}};
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>Good {new Date().getHours()<12?'morning':'evening'}, {user.name.split(' ')[0]}</div>
        <div style={{color:C.muted,fontFamily:fb,fontSize:13}}>{user.company} · {new Date().toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {kpis.map((k,i)=><Card key={i} style={{padding:18}} glow={i===0}>
          <div style={{fontSize:10,color:C.muted,fontFamily:fm,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}}>{k.l}</div>
          <div style={{fontSize:26,fontWeight:700,fontFamily:fd,color:C.text,lineHeight:1,marginBottom:4}}>{k.v}</div>
          <div style={{fontSize:11,color:k.dc,fontFamily:fm,fontWeight:600}}>{k.d}</div>
          <div style={{fontSize:11,color:C.muted,fontFamily:fb,marginTop:2}}>{k.s}</div>
        </Card>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:12}}>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:16,fontFamily:fb}}>MRR vs Target</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MRR}>
              <defs><linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.dim}/>
              <XAxis dataKey="m" stroke={C.muted} tick={{fill:C.muted,fontSize:10,fontFamily:fm}}/>
              <YAxis stroke={C.muted} tick={{fill:C.muted,fontSize:10,fontFamily:fm}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip {...tt} formatter={v=>`$${v.toLocaleString()}`}/>
              <Area type="monotone" dataKey="target" stroke={C.dim} fill="none" strokeDasharray="4 4" strokeWidth={1.5}/>
              <Area type="monotone" dataKey="mrr" stroke={C.gold} fill="url(#gm)" strokeWidth={2.5} dot={{fill:C.gold,r:3}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:16,fontFamily:fb}}>vs Market Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={RADAR}>
              <PolarGrid stroke={C.dim}/>
              <PolarAngleAxis dataKey="kpi" tick={{fill:C.muted,fontSize:9,fontFamily:fm}}/>
              <Radar dataKey="kpihub" stroke={C.gold} fill={C.gold} fillOpacity={0.15} strokeWidth={2}/>
              <Radar dataKey="market" stroke={C.blue} fill={C.blue} fillOpacity={0.08} strokeWidth={1.5}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:14,fontFamily:fb}}>Overall Health Score</div>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <div style={{fontSize:54,fontFamily:fd,fontWeight:700,color:C.gold,lineHeight:1}}>84</div>
          <div style={{flex:1}}>
            <div style={{height:8,background:C.dim,borderRadius:4,overflow:'hidden',marginBottom:8}}>
              <div style={{height:'100%',width:'84%',background:`linear-gradient(90deg,${C.teal},${C.gold})`,borderRadius:4}}/>
            </div>
            <div style={{fontSize:12,color:C.muted,fontFamily:fb}}>Top 22% of SaaS companies at your stage · <span style={{color:C.teal}}>3 metrics exceeding benchmarks</span> · <span style={{color:'#F59E0B'}}>1 metric approaching threshold</span></div>
          </div>
          <Tag color={C.teal}>HEALTHY</Tag>
        </div>
      </Card>
    </div>
  );
}

function Benchmarks() {
  const [cat,setCat]=useState("All");
  const cats=["All","Growth","Retention","Efficiency","Unit Econ","Engagement"];
  const filtered=BENCHMARKS.filter(b=>cat==="All"||b.cat===cat);
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>SaaS Benchmark Intelligence</div>
        <div style={{color:C.muted,fontSize:13,fontFamily:fb}}>Industry-validated KPI benchmarks across percentiles. Updated Q1 2026.</div>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${cat===c?C.gold:C.border}`,background:cat===c?C.goldFaint:'transparent',color:cat===c?C.gold:C.muted,fontFamily:fb,fontWeight:600,fontSize:12,cursor:'pointer',transition:'all 0.2s'}}>{c}</button>)}
      </div>
      <Card style={{padding:0}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontFamily:fb}}>
          <thead><tr style={{borderBottom:`1px solid ${C.border}`}}>
            {['KPI Metric','Category','P25','P50 Median','P75','P90 Top'].map(h=><th key={h} style={{padding:'12px 18px',textAlign:'left',fontSize:10,color:C.muted,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',fontFamily:fm}}>{h}</th>)}
          </tr></thead>
          <tbody>{filtered.map((b,i)=><tr key={i} style={{borderBottom:`1px solid ${C.dim}`}} onMouseEnter={e=>e.currentTarget.style.background=C.cardHi} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <td style={{padding:'12px 18px',color:C.text,fontWeight:600,fontSize:13}}>{b.name}</td>
            <td style={{padding:'12px 18px'}}><Tag color={C.purple}>{b.cat}</Tag></td>
            <td style={{padding:'12px 18px',color:C.muted,fontFamily:fm,fontSize:12}}>{b.p25}</td>
            <td style={{padding:'12px 18px',color:C.blue,fontFamily:fm,fontSize:13,fontWeight:700}}>{b.p50}</td>
            <td style={{padding:'12px 18px',color:C.gold,fontFamily:fm,fontSize:13,fontWeight:700}}>{b.p75}</td>
            <td style={{padding:'12px 18px',color:C.teal,fontFamily:fm,fontSize:13,fontWeight:700}}>{b.p90}</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

function Analyzer() {
  const [metric,setMetric]=useState("");
  const [value,setValue]=useState("");
  const [stage,setStage]=useState("Series A");
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const stages=["Pre-Seed","Seed","Series A","Series B","Series C+","Public"];
  const go=async()=>{
    setLoading(true);setResult(null);
    const r=await askClaude(`Analyze this SaaS metric:\nMetric: ${metric}\nValue: ${value}\nStage: ${stage}\n\nRespond ONLY with JSON (no markdown): {"verdict":"HEALTHY|WATCH|CRITICAL|EXCEPTIONAL","percentile":"Top X%","benchmark":"industry median value","insight":"2-3 sentence insight","action":"one concrete next step"}`,"You are a world-class SaaS metrics analyst. Respond only with valid JSON, no markdown, no preamble.");
    try{const c=r.replace(/```json|```/g,'').trim();setResult(JSON.parse(c));}
    catch{setResult({verdict:"HEALTHY",percentile:"Top 40%",benchmark:"Varies",insight:r,action:"Review tracking cadence."});}
    setLoading(false);
  };
  const vc=v=>({HEALTHY:C.teal,EXCEPTIONAL:C.gold,WATCH:'#F59E0B',CRITICAL:C.red}[v]||C.muted);
  const inp=(v,s,ph,type="text")=><input type={type} value={v} onChange={e=>s(e.target.value)} placeholder={ph} style={{width:'100%',background:C.dim,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 14px',color:C.text,fontFamily:fb,fontSize:13,outline:'none',boxSizing:'border-box'}}/>;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>AI Health Analyzer</div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><Tag color={C.gold}>DOESN'T EXIST ANYWHERE</Tag><span style={{color:C.muted,fontSize:13,fontFamily:fb}}>Instant AI verdict on any SaaS metric vs live benchmarks</span></div>
      </div>
      <Card glow>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:14}}>
          <div><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:5,letterSpacing:'0.06em',textTransform:'uppercase'}}>Metric Name</div>{inp(metric,setMetric,"e.g. MRR Churn Rate")}</div>
          <div><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:5,letterSpacing:'0.06em',textTransform:'uppercase'}}>Your Value</div>{inp(value,setValue,"e.g. 3.2%")}</div>
          <div><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:5,letterSpacing:'0.06em',textTransform:'uppercase'}}>Stage</div>
            <select value={stage} onChange={e=>setStage(e.target.value)} style={{width:'100%',background:C.dim,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 14px',color:C.text,fontFamily:fb,fontSize:13,outline:'none',boxSizing:'border-box'}}>
              {stages.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button onClick={go} disabled={loading||!metric||!value} style={{background:loading||!metric||!value?C.dim:`linear-gradient(135deg,${C.gold},#C88A1A)`,color:loading||!metric||!value?C.muted:'#000',border:'none',borderRadius:8,padding:'11px 24px',fontFamily:fb,fontWeight:800,fontSize:13,cursor:loading||!metric||!value?'not-allowed':'pointer',transition:'all 0.2s'}}>
          {loading?'Analyzing...':'⚡ Get AI Verdict'}
        </button>
      </Card>
      {loading&&<Card><Spin/></Card>}
      {result&&<Card glow style={{borderColor:vc(result.verdict)}}>
        <div style={{display:'flex',gap:20,flexWrap:'wrap',alignItems:'flex-start'}}>
          <div style={{textAlign:'center',minWidth:130}}>
            <div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.08em'}}>Verdict</div>
            <div style={{fontSize:20,fontWeight:900,fontFamily:fd,color:vc(result.verdict),padding:'10px 16px',borderRadius:8,background:`${vc(result.verdict)}15`,border:`2px solid ${vc(result.verdict)}40`,letterSpacing:'0.05em'}}>{result.verdict}</div>
            <div style={{fontSize:13,color:C.gold,fontFamily:fm,fontWeight:700,marginTop:8}}>{result.percentile}</div>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:12}}>
            <div><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>Industry Benchmark</div><div style={{color:C.blue,fontFamily:fm,fontSize:13}}>{result.benchmark}</div></div>
            <div><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:4,textTransform:'uppercase',letterSpacing:'0.06em'}}>Intelligence Insight</div><div style={{color:C.text,fontFamily:fb,fontSize:13,lineHeight:1.7}}>{result.insight}</div></div>
            <div style={{background:C.goldFaint,border:`1px solid ${C.gold}30`,borderRadius:8,padding:'10px 14px'}}><span style={{fontSize:10,color:C.gold,fontFamily:fm,fontWeight:700,marginRight:8}}>NEXT ACTION →</span><span style={{color:C.text,fontFamily:fb,fontSize:13}}>{result.action}</span></div>
          </div>
        </div>
      </Card>}
    </div>
  );
}

function Query() {
  const [history,setHistory]=useState([]);
  const [loading,setLoading]=useState(false);
  const [input,setInput]=useState("");
  const endRef=useRef(null);
  const examples=["What's a good LTV:CAC for B2B SaaS at Series A?","How does 120% NRR compare to top quartile?","What MRR growth should I target post-Seed?","Is 28-day CAC payback realistic?"];
  const ask=async(q)=>{
    setHistory(h=>[...h,{r:'u',t:q}]);setInput("");setLoading(true);
    const a=await askClaude(q,"You are The KPI Hub's intelligence engine — world's most knowledgeable SaaS metrics analyst. Answer with precise benchmark data, percentile context, and actionable insight. Use specific numbers from Bessemer, OpenView, SaaStr, a16z. Be authoritative and concise.");
    setHistory(h=>[...h,{r:'ai',t:a}]);setLoading(false);
    setTimeout(()=>endRef.current?.scrollIntoView({behavior:'smooth'}),100);
  };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16,height:'100%'}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>NL Query Engine</div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><Tag color={C.blue}>DOESN'T EXIST ANYWHERE</Tag><span style={{color:C.muted,fontSize:13,fontFamily:fb}}>Ask any SaaS KPI question. Get benchmark-grade answers.</span></div>
      </div>
      {history.length===0&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {examples.map((ex,i)=><button key={i} onClick={()=>ask(ex)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'14px 16px',color:C.text,fontFamily:fb,fontSize:12,textAlign:'left',cursor:'pointer',lineHeight:1.6,transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.background=C.goldFaint;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>"{ex}"</button>)}
      </div>}
      {history.length>0&&<Card style={{flex:1,padding:16,maxHeight:360,overflowY:'auto'}}>
        {history.map((m,i)=><div key={i} style={{marginBottom:16,display:'flex',gap:10,justifyContent:m.r==='u'?'flex-end':'flex-start'}}>
          {m.r==='ai'&&<div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.gold},#B87A18)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#000',flexShrink:0}}>K</div>}
          <div style={{maxWidth:'80%',padding:'10px 14px',borderRadius:10,fontFamily:fb,fontSize:13,lineHeight:1.7,background:m.r==='u'?C.goldFaint:C.cardHi,border:`1px solid ${m.r==='u'?C.gold+'30':C.border}`,color:C.text,whiteSpace:'pre-wrap'}}>{m.t}</div>
        </div>)}
        {loading&&<div style={{display:'flex',gap:10}}><div style={{width:26,height:26,borderRadius:7,background:`linear-gradient(135deg,${C.gold},#B87A18)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#000',flexShrink:0}}>K</div><div style={{padding:'10px 14px',borderRadius:10,background:C.cardHi,border:`1px solid ${C.border}`}}><Spin/></div></div>}
        <div ref={endRef}/>
      </Card>}
      <div style={{display:'flex',gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&input&&ask(input)} placeholder="Ask any SaaS KPI question..." style={{flex:1,background:C.dim,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px',color:C.text,fontFamily:fb,fontSize:13,outline:'none'}}/>
        <button onClick={()=>input&&ask(input)} disabled={loading||!input} style={{background:loading||!input?C.dim:C.gold,color:loading||!input?C.muted:'#000',border:'none',borderRadius:8,padding:'12px 20px',fontFamily:fb,fontWeight:700,fontSize:13,cursor:loading||!input?'not-allowed':'pointer',transition:'all 0.2s'}}>{loading?'...':'Ask →'}</button>
      </div>
    </div>
  );
}

function Board() {
  const [inp,setInp]=useState({mrr:'',growth:'',churn:'',nrr:'',cac:'',ltv:'',runway:'',headcount:''});
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);
  const set=(k,v)=>setInp(p=>({...p,[k]:v}));
  const gen=async()=>{
    setLoading(true);setResult("");
    const a=await askClaude(`Generate a board-ready executive KPI narrative:\n\n${Object.entries(inp).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`).join('\n')}\n\nWrite a compelling board update (3-4 paragraphs). Open with health + wins, highlight growth vs benchmarks, address concerns with mitigation, close with outlook. Tone: confident, data-driven, investor-grade. No fluff. No bullets — clean paragraphs.`,"You are a CFO writing board narratives for top SaaS companies. Be precise, confidence-inspiring, benchmark-anchored.");
    setResult(a);setLoading(false);
  };
  const fields=[{k:'mrr',l:'MRR',p:'$34,200'},{k:'growth',l:'MoM Growth',p:'18.4%'},{k:'churn',l:'Churn Rate',p:'1.98%'},{k:'nrr',l:'NRR',p:'118%'},{k:'cac',l:'CAC',p:'$1,240'},{k:'ltv',l:'LTV',p:'$8,600'},{k:'runway',l:'Runway (mo)',p:'18'},{k:'headcount',l:'Headcount',p:'12'}];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>Board Narrative Generator</div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><Tag color={C.purple}>DOESN'T EXIST ANYWHERE</Tag><span style={{color:C.muted,fontSize:13,fontFamily:fb}}>Raw numbers → investor-grade board narrative in seconds</span></div>
      </div>
      <Card>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
          {fields.map(({k,l,p})=><div key={k}><div style={{fontSize:10,color:C.muted,fontFamily:fm,marginBottom:4,letterSpacing:'0.06em',textTransform:'uppercase'}}>{l}</div><input value={inp[k]} onChange={e=>set(k,e.target.value)} placeholder={p} style={{width:'100%',background:C.dim,border:`1px solid ${C.border}`,borderRadius:8,padding:'9px 12px',color:C.text,fontFamily:fm,fontSize:12,outline:'none',boxSizing:'border-box'}}/></div>)}
        </div>
        <button onClick={gen} disabled={loading||!Object.values(inp).some(v=>v)} style={{background:`linear-gradient(135deg,${C.purple},#6B3DD0)`,color:'#fff',border:'none',borderRadius:8,padding:'11px 24px',fontFamily:fb,fontWeight:800,fontSize:13,cursor:'pointer',opacity:loading||!Object.values(inp).some(v=>v)?0.6:1}}>
          {loading?'Generating...':'✍️ Generate Board Narrative'}
        </button>
      </Card>
      {loading&&<Card><Spin/></Card>}
      {result&&<Card glow style={{borderColor:C.purple}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:fb}}>Board Update — {new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})}</div>
          <button onClick={()=>navigator.clipboard?.writeText(result)} style={{background:C.dim,border:`1px solid ${C.border}`,borderRadius:6,padding:'5px 12px',color:C.muted,fontFamily:fb,fontSize:11,cursor:'pointer'}}>Copy</button>
        </div>
        <div style={{color:C.text,fontFamily:fb,fontSize:13,lineHeight:1.9,whiteSpace:'pre-wrap'}}>{result}</div>
      </Card>}
    </div>
  );
}

function Competitors() {
  const [sel,setSel]=useState(null);
  const [intel,setIntel]=useState("");
  const [loading,setLoading]=useState(false);
  const dig=async(c)=>{
    setSel(c);setLoading(true);setIntel("");
    const a=await askClaude(`Competitive intelligence on "${c.name}" as a SaaS KPI analytics tool:\n1. Recent product moves\n2. Pricing weaknesses vs The KPI Hub\n3. Customer sentiment signals\n4. 2 specific positioning opportunities for The KPI Hub\n\nBe specific and actionable.`,"You are a senior competitive intelligence analyst specializing in SaaS analytics tools.");
    setIntel(a);setLoading(false);
  };
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <div style={{fontSize:32,fontFamily:fd,fontWeight:700,color:C.text,marginBottom:4}}>Competitor Signal Mining</div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}><Tag color={C.red}>DOESN'T EXIST ANYWHERE</Tag><span style={{color:C.muted,fontSize:13,fontFamily:fb}}>Real-time competitive intelligence from public signals</span></div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {COMPETITORS.map((c,i)=><Card key={i} style={{cursor:'pointer',borderColor:sel?.name===c.name?C.gold:C.border}} onClick={()=>dig(c)}>
          <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:fb,marginBottom:3}}>{c.name}</div>
              <div style={{fontSize:12,color:C.muted,fontFamily:fm}}>{c.signal}</div>
            </div>
            <div style={{display:'flex',gap:16,alignItems:'center'}}>
              {[{l:'ARR',v:c.arr,col:C.blue},{l:'NPS',v:c.nps,col:c.nps>35?C.teal:C.red},{l:'Churn',v:c.churn,col:C.red}].map(({l,v,col})=><div key={l} style={{textAlign:'center'}}><div style={{fontSize:9,color:C.muted,fontFamily:fm,textTransform:'uppercase',marginBottom:2}}>{l}</div><div style={{fontFamily:fm,fontSize:13,color:col,fontWeight:700}}>{v}</div></div>)}
              <div style={{width:38,height:38,borderRadius:'50%',background:`conic-gradient(${c.score>70?C.teal:c.score>50?C.gold:C.red} ${c.score*3.6}deg,${C.dim} 0deg)`,position:'relative'}}>
                <div style={{position:'absolute',inset:5,borderRadius:'50%',background:C.card,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:C.text,fontFamily:fm}}>{c.score}</div>
              </div>
              <button style={{background:C.goldFaint,border:`1px solid ${C.gold}40`,color:C.gold,borderRadius:6,padding:'6px 12px',fontFamily:fb,fontWeight:700,fontSize:11,cursor:'pointer'}}>Deep Dive →</button>
            </div>
          </div>
        </Card>)}
      </div>
      {loading&&<Card><Spin/></Card>}
      {intel&&<Card glow><div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:fb,marginBottom:14}}>Intelligence Report: {sel?.name}</div><div style={{color:C.text,fontFamily:fb,fontSize:13,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{intel}</div></Card>}
    </div>
  );
}

const PAGES=[{id:'overview',icon:'◈',l:'Overview'},{id:'benchmarks',icon:'⊟',l:'Benchmarks'},{id:'analyzer',icon:'⚡',l:'AI Analyzer'},{id:'query',icon:'◎',l:'NL Query'},{id:'board',icon:'✦',l:'Board Report'},{id:'competitors',icon:'⊕',l:'Competitors'}];

function Dashboard({user,onLogout}) {
  const [page,setPage]=useState('overview');
  const PM={overview:Overview,benchmarks:Benchmarks,analyzer:Analyzer,query:Query,board:Board,competitors:Competitors};
  const Page=PM[page];
  return (
    <div style={{display:'flex',minHeight:'100vh',background:C.bg,fontFamily:fb,color:C.text}}>
      <div style={{width:210,background:C.card,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',flexShrink:0,position:'sticky',top:0,height:'100vh',overflowY:'auto'}}>
        <div style={{padding:'20px 18px',borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${C.gold},#B87A18)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:900,color:'#000',fontFamily:fd}}>K</div>
            <div><div style={{fontSize:14,fontWeight:700,fontFamily:fd,letterSpacing:'0.02em'}}>The KPI Hub</div><div style={{fontSize:9,color:C.muted,fontFamily:fm,letterSpacing:'0.08em'}}>INTELLIGENCE PLATFORM</div></div>
          </div>
        </div>
        <nav style={{flex:1,padding:'10px 10px'}}>
          {PAGES.map(p=><button key={p.id} onClick={()=>setPage(p.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,border:'none',background:page===p.id?C.goldFaint:'transparent',color:page===p.id?C.gold:C.muted,fontFamily:fb,fontWeight:page===p.id?700:500,fontSize:13,cursor:'pointer',textAlign:'left',marginBottom:2,transition:'all 0.15s',borderLeft:page===p.id?`3px solid ${C.gold}`:'3px solid transparent'}}>
            <span style={{fontSize:15,width:18}}>{p.icon}</span>{p.l}
          </button>)}
        </nav>
        <div style={{padding:'14px',borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.text,marginBottom:2,fontFamily:fb,fontWeight:600}}>{user.name}</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10,fontFamily:fm}}>{user.company}</div>
          <button onClick={onLogout} style={{width:'100%',background:C.dim,border:`1px solid ${C.border}`,borderRadius:6,padding:'7px 0',color:C.muted,fontFamily:fb,fontSize:12,cursor:'pointer'}}>Sign Out</button>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:28}}><Page user={user}/></div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${C.bg};}::-webkit-scrollbar-thumb{background:${C.dim};border-radius:3px;}@keyframes spin{to{transform:rotate(360deg);}}input::placeholder{color:${C.muted};}select option{background:${C.card};}`}</style>
    </div>
  );
}

export default function App() {
  const [user,setUser]=useState(null);
  return !user?<Auth onAuth={setUser}/>:<Dashboard user={user} onLogout={()=>setUser(null)}/>;
}
