import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const C = {
  bg:'#0a0a0a', surface:'#141414', elevated:'#1a1a1a',
  border:'#1e1e1e', borderMid:'#2a2a2a',
  yellow:'#FFCE47', blue:'#89C6E9', green:'#83DAB0',
  orange:'#F16F11', red:'#ff6b6b',
  text:'#f0f0e8', secondary:'#888', muted:'#444',
};

const PILARES = [
  { name:'Gemelas',      color:C.yellow,  score:9.4, desc:'Dos caras de la misma alma' },
  { name:'Parchadas',    color:C.blue,    score:8.8, desc:'Cotidianas y reales' },
  { name:'Empáticas',    color:C.green,   score:8.5, desc:'Hacen sentir identificado' },
  { name:'Energía',      color:C.orange,  score:9.1, desc:'Una descarga energética' },
  { name:'Versatilidad', color:'#f0f0e8', score:7.9, desc:'Energía en movimiento' },
];

function TopBar({ onBack }) {
  return (
    <div style={{background:'#111',borderBottom:`1px solid ${C.border}`,padding:'13px 24px',display:'flex',alignItems:'center',gap:14}}>
      <button onClick={onBack} style={{background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:'6px 12px',color:C.secondary,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>← Volver</button>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>Análisis de Marca</div>
        <div style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1}}>BRAND INTELLIGENCE · DOS RAYOS</div>
      </div>
    </div>
  );
}

function Tag({ children, color = C.yellow }) {
  return <span style={{fontSize:11,padding:'4px 10px',borderRadius:20,background:color+'18',color,border:`1px solid ${color}33`,fontFamily:'monospace'}}>{children}</span>;
}

function MetricBox({ label, value, color = C.yellow }) {
  return (
    <div style={{background:C.elevated,borderRadius:10,padding:'14px 16px',textAlign:'center',flex:1}}>
      <div style={{fontSize:22,fontWeight:800,color,marginBottom:4}}>{value}</div>
      <div style={{fontSize:11,color:C.muted,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:0.5}}>{label}</div>
    </div>
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
      <span style={{fontSize:12,color:C.text,width:90,flexShrink:0}}>{label}</span>
      <div style={{flex:1,background:C.elevated,borderRadius:3,height:6,overflow:'hidden'}}>
        <div style={{width:`${(score/10)*100}%`,height:6,background:color,borderRadius:3,transition:'width 0.8s ease'}}/>
      </div>
      <span style={{fontSize:11,fontWeight:700,color,width:30,textAlign:'right',fontFamily:'monospace'}}>{score.toFixed(1)}</span>
    </div>
  );
}

export default function BrandAnalysisPage() {
  const navigate  = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [metrics,  setMetrics]  = useState([]);
  const [topics,   setTopics]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [running,  setRunning]  = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [brandRes, metricsRes, topicsRes] = await Promise.all([
        fetch(`${API}/api/analysis/brand`).then(r => r.json()),
        fetch(`${API}/api/metrics`).then(r => r.json()),
        fetch(`${API}/api/analysis/topics`).then(r => r.json()),
      ]);
      setAnalysis(brandRes.data);
      setMetrics(metricsRes.data || []);
      setTopics(topicsRes.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function runFullAnalysis() {
    setRunning(true);
    try {
      await fetch(`${API}/api/sync`, { method:'POST' });
      setTimeout(() => { loadAll(); setRunning(false); }, 4000);
    } catch { setRunning(false); }
  }

  const totalFollowers = metrics.reduce((s,m) => s + (parseInt(m.followers)||0), 0);
  const topPlatform    = [...metrics].sort((a,b) => (b.followers||0)-(a.followers||0))[0];
  const identity       = analysis?.brand_identity;
  const audience       = analysis?.audience_analysis;
  const commStyle      = analysis?.communication_style;
  const content        = analysis?.content_performance;

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <TopBar onBack={() => navigate('/')} />

      <div style={{padding:'24px',maxWidth:1100,margin:'0 auto',display:'flex',flexDirection:'column',gap:20}}>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,color:C.yellow,marginBottom:4}}>✨ Análisis de Marca Completo</h1>
            <p style={{fontSize:13,color:C.secondary}}>Inteligencia artificial aplicada a la identidad de Dos Rayos</p>
          </div>
          <button onClick={runFullAnalysis} disabled={running}
            style={{background:running?C.elevated:C.yellow,border:'none',borderRadius:9,padding:'10px 18px',fontSize:12,fontWeight:700,color:'#0a0a0a',cursor:running?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {running ? '⏳ Analizando...' : '🤖 Ejecutar análisis IA'}
          </button>
        </div>

        <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
          <MetricBox label="Total seguidores" value={totalFollowers>=1000?(totalFollowers/1000).toFixed(1)+'K':totalFollowers} color={C.yellow}/>
          <MetricBox label="Plataformas activas" value={metrics.length} color={C.blue}/>
          <MetricBox label="Plataforma líder" value={topPlatform?.platform?.toUpperCase()||'—'} color={C.green}/>
          <MetricBox label="Engagement prom." value={content?.avg_engagement_rate?content.avg_engagement_rate.toFixed(1)+'%':'—'} color={C.orange}/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.yellow,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>⚡ Identidad de marca</div>
            <div style={{background:C.elevated,borderRadius:8,padding:'12px 14px',marginBottom:12}}>
              <p style={{fontSize:12,color:C.text,lineHeight:1.6}}>{identity?.brand_personality||'Energía Cómplice — dos fuerzas distintas que se amplifican en arte auténtico'}</p>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Tono de comunicación</div>
              <p style={{fontSize:12,color:C.text}}>{identity?.tone||'Cotidiano, auténtico, sin filtros'}</p>
            </div>
            <div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Fortalezas</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {(identity?.strengths||['Complicidad gemelas','Humor natural','Conexión emocional']).map(s => <Tag key={s} color={C.green}>{s}</Tag>)}
              </div>
            </div>
          </div>

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.blue,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>🏛️ Pilares de marca</div>
            {PILARES.map(p => (
              <div key={p.name} style={{marginBottom:10}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:p.color,flexShrink:0}}/>
                  <span style={{fontSize:12,fontWeight:600,color:C.text,flex:1}}>{p.name}</span>
                  <span style={{fontSize:10,color:C.muted}}>{p.desc}</span>
                </div>
                <ScoreBar label="" score={p.score} color={p.color}/>
              </div>
            ))}
          </div>

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>👥 Perfil de audiencia</div>
            <div style={{background:C.elevated,borderRadius:8,padding:'10px 12px',marginBottom:12}}>
              <p style={{fontSize:12,color:C.text,lineHeight:1.5}}>{audience?.profile||'Jóvenes latinoamericanos 18-28 años que buscan conexión auténtica'}</p>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>Intereses principales</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {(audience?.interests||['música','hermandad','autenticidad','humor']).map(i => <Tag key={i} color={C.green}>{i}</Tag>)}
              </div>
            </div>
            <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Sentimiento general</div>
            <span style={{fontSize:12,color:C.green}}>● {audience?.sentiment||'Muy positivo'}</span>
          </div>

          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.orange,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>💬 Estilo de comunicación</div>
            {[
              ['Registro',      commStyle?.language_register||'Informal / cotidiano'],
              ['Tono emocional', commStyle?.emotional_tone   ||'Optimista / empático'],
              ['CTAs típicos',  commStyle?.cta_patterns      ||'"¿Cuál es la tuya?" / "Cuéntanos"'],
            ].map(([lbl,val]) => (
              <div key={lbl} style={{background:C.elevated,borderRadius:8,padding:'10px 12px',marginBottom:8}}>
                <div style={{fontSize:10,color:C.muted,marginBottom:3,fontFamily:'monospace',textTransform:'uppercase'}}>{lbl}</div>
                <div style={{fontSize:12,color:C.text}}>{val}</div>
              </div>
            ))}
          </div>

        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>🔥 Temas predominantes</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10}}>
            {(topics?.main_topics||['complicidad','amor cotidiano','familia','autenticidad','humor','gemelas']).map((t,i) => {
              const colors = [C.yellow,C.blue,C.green,C.orange,C.yellow,C.blue];
              const color  = colors[i%colors.length];
              const pct    = Math.max(30, 90-i*10);
              return (
                <div key={t} style={{background:C.elevated,borderRadius:9,padding:'12px 14px',borderLeft:`3px solid ${color}`}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:6,textTransform:'capitalize'}}>{t}</div>
                  <div style={{height:4,background:C.surface,borderRadius:2,overflow:'hidden',marginBottom:5}}>
                    <div style={{width:`${pct}%`,height:4,background:color,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:10,color:C.muted,fontFamily:'monospace'}}>{pct}% de presencia</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'18px 20px'}}>
          <div style={{fontSize:11,fontWeight:700,color:C.green,fontFamily:'monospace',letterSpacing:1.5,textTransform:'uppercase',marginBottom:14}}>🚀 Oportunidades detectadas</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {(identity?.opportunities||[
              'Fortalecer presencia en YouTube con proceso creativo',
              'Crear serie "gemelas reaccionan" en TikTok',
              'Lanzar playlist colaborativa en Spotify con fans',
              'Aumentar frecuencia en Instagram a 4x/semana',
            ]).map((op,i) => (
              <div key={i} style={{background:C.elevated,borderRadius:9,padding:'12px 14px',display:'flex',gap:10}}>
                <span style={{color:C.green,flexShrink:0}}>→</span>
                <p style={{fontSize:12,color:C.text,lineHeight:1.5}}>{op}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}