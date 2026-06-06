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

const PLATFORMS = ['todas','instagram','tiktok','youtube'];

const SENTIMENT_COLOR = { positive:C.green, neutral:C.secondary, negative:C.red };
const SENTIMENT_LABEL = { positive:'Positivo', neutral:'Neutral', negative:'Negativo' };

function TopBar({ onBack }) {
  return (
    <div style={{background:'#111',borderBottom:`1px solid ${C.border}`,padding:'13px 24px',display:'flex',alignItems:'center',gap:14}}>
      <button onClick={onBack} style={{background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:'6px 12px',color:C.secondary,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>
        ← Volver
      </button>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>Análisis de Sentimientos</div>
        <div style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1}}>AUDIENCIA · DOS RAYOS</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px',flex:1}}>
      <div style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>{label}</div>
      <div style={{fontSize:28,fontWeight:800,color,marginBottom:4}}>{value}</div>
      <div style={{height:4,background:C.elevated,borderRadius:2,overflow:'hidden',marginBottom:6}}>
        <div style={{width:`${pct}%`,height:4,background:color,borderRadius:2,transition:'width 0.6s ease'}}/>
      </div>
      <div style={{fontSize:11,color:C.secondary,fontFamily:'monospace'}}>{pct}% del total</div>
    </div>
  );
}

function CommentCard({ comment }) {
  const color = SENTIMENT_COLOR[comment.sentiment] || C.secondary;
  const label = SENTIMENT_LABEL[comment.sentiment] || 'Sin análisis';
  return (
    <div style={{background:C.elevated,borderRadius:10,padding:'12px 14px',borderLeft:`3px solid ${color}`}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
        <div style={{width:26,height:26,borderRadius:'50%',background:color+'20',border:`1px solid ${color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color,flexShrink:0,fontFamily:'monospace'}}>
          {(comment.username||'AN').slice(0,2).toUpperCase()}
        </div>
        <span style={{fontSize:12,fontWeight:600,color:C.text}}>{comment.username||'anónimo'}</span>
        <span style={{fontSize:10,color:C.muted,fontFamily:'monospace',marginLeft:'auto'}}>{comment.platform?.toUpperCase()}</span>
      </div>
      <p style={{fontSize:12,color:C.secondary,lineHeight:1.5,marginBottom:6}}>{comment.comment_text}</p>
      <span style={{fontSize:10,color,fontFamily:'monospace'}}>● {label}</span>
    </div>
  );
}

export default function SentimentPage() {
  const navigate = useNavigate();
  const [platform,  setPlatform]  = useState('todas');
  const [comments,  setComments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => { loadComments(); }, [platform]);

  async function loadComments() {
    setLoading(true);
    try {
      const url = platform === 'todas'
        ? `${API}/api/comments?limit=60`
        : `${API}/api/comments?platform=${platform}&limit=60`;
      const res  = await fetch(url);
      const data = await res.json();
      setComments(data.data || []);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function runAnalysis() {
    setAnalyzing(true);
    try {
      await fetch(`${API}/api/sync`, { method:'POST' });
      setTimeout(() => { loadComments(); setAnalyzing(false); }, 3000);
    } catch { setAnalyzing(false); }
  }

  const stats = {
    positive: comments.filter(c => c.sentiment === 'positive').length,
    neutral:  comments.filter(c => c.sentiment === 'neutral').length,
    negative: comments.filter(c => c.sentiment === 'negative').length,
    total:    comments.length,
  };

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <TopBar onBack={() => navigate('/')} />
      <div style={{padding:'24px',maxWidth:1100,margin:'0 auto',display:'flex',flexDirection:'column',gap:20}}>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:800,color:C.yellow,marginBottom:4}}>❤️ Sentimientos de la Audiencia</h1>
            <p style={{fontSize:13,color:C.secondary}}>Análisis de {stats.total} comentarios recientes</p>
          </div>
          <button onClick={runAnalysis} disabled={analyzing}
            style={{background:analyzing?C.elevated:C.yellow,border:'none',borderRadius:9,padding:'10px 18px',fontSize:12,fontWeight:700,color:'#0a0a0a',cursor:analyzing?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {analyzing ? '⏳ Analizando...' : '🔄 Actualizar análisis'}
          </button>
        </div>

        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <StatCard label="Positivos" value={stats.positive} color={C.green}     total={stats.total}/>
          <StatCard label="Neutrales" value={stats.neutral}  color={C.secondary} total={stats.total}/>
          <StatCard label="Negativos" value={stats.negative} color={C.red}       total={stats.total}/>
          <StatCard label="Total"     value={stats.total}    color={C.yellow}    total={stats.total}/>
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'16px 18px'}}>
          <div style={{fontSize:12,fontWeight:700,color:C.yellow,fontFamily:'monospace',letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>⚡ Emociones predominantes</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {['conexión','nostalgia','expectativa','identificación','admiración'].map((e,i) => (
              <span key={e} style={{fontSize:12,padding:'5px 12px',borderRadius:20,background:i%2===0?C.yellow+'18':C.blue+'18',color:i%2===0?C.yellow:C.blue,border:`1px solid ${i%2===0?C.yellow+'33':C.blue+'33'}`,fontFamily:'monospace'}}>{e}</span>
            ))}
          </div>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)}
              style={{padding:'7px 14px',borderRadius:20,border:`1px solid ${platform===p?C.yellow:C.border}`,background:platform===p?C.yellow+'18':'transparent',color:platform===p?C.yellow:C.secondary,fontSize:11,cursor:'pointer',fontFamily:'monospace',textTransform:'uppercase',letterSpacing:0.5}}>
              {p}
            </button>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {loading
            ? Array(6).fill(0).map((_,i) => <div key={i} style={{height:80,background:C.elevated,borderRadius:10}}/>)
            : comments.length === 0
              ? <div style={{textAlign:'center',padding:40,color:C.muted,fontSize:13}}>No hay comentarios para esta plataforma</div>
              : comments.map((c,i) => <CommentCard key={c.id||i} comment={c}/>)
          }
        </div>
      </div>
    </div>
  );
}