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

const DAYS   = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const PCOLORS = { instagram:C.yellow, tiktok:C.blue, youtube:C.orange, spotify:C.green, twitter:'#f0f0e8' };
const PICONS  = { instagram:'📸', tiktok:'🎵', youtube:'▶️', spotify:'🎧', twitter:'🐦' };

function TopBar({ onBack }) {
  return (
    <div style={{background:'#111',borderBottom:`1px solid ${C.border}`,padding:'13px 24px',display:'flex',alignItems:'center',gap:14}}>
      <button onClick={onBack} style={{background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:'6px 12px',color:C.secondary,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>← Volver</button>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>Parrilla de Contenido</div>
        <div style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1}}>PLANIFICADOR SEMANAL · DOS RAYOS</div>
      </div>
    </div>
  );
}

function AddModal({ day, onClose, onSave }) {
  const [platform, setPlatform] = useState('instagram');
  const [title,    setTitle]    = useState('');
  const [format,   setFormat]   = useState('reel');
  const [notes,    setNotes]    = useState('');

  const formats = { instagram:['reel','post','story','carrusel'], tiktok:['video','dueto','live'], youtube:['video','short','live'], spotify:['single','ep','playlist'], twitter:['tweet','hilo'] };

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}>
      <div style={{background:C.surface,border:`1px solid ${C.borderMid}`,borderRadius:14,padding:24,width:'100%',maxWidth:420}}>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:4}}>Agregar publicación</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:18}}>{day}</div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Plataforma</label>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {Object.keys(PCOLORS).map(p => (
              <button key={p} onClick={() => { setPlatform(p); setFormat(formats[p][0]); }}
                style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${platform===p?PCOLORS[p]:C.borderMid}`,background:platform===p?PCOLORS[p]+'20':'transparent',color:platform===p?PCOLORS[p]:C.secondary,fontSize:11,cursor:'pointer',fontFamily:'monospace'}}>
                {PICONS[p]} {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Título / Tema</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ej: Reaccionando a comentarios de fans"
            style={{width:'100%',padding:'9px 12px',background:'#0d0d0d',border:`1px solid ${C.borderMid}`,borderRadius:8,color:C.text,fontSize:12,outline:'none',fontFamily:'inherit'}}/>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Formato</label>
          <select value={format} onChange={e=>setFormat(e.target.value)}
            style={{width:'100%',padding:'9px 12px',background:'#0d0d0d',border:`1px solid ${C.borderMid}`,borderRadius:8,color:C.text,fontSize:12,outline:'none',fontFamily:'inherit'}}>
            {(formats[platform]||[]).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div style={{marginBottom:20}}>
          <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:6}}>Notas (opcional)</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Ideas, hora de publicación..."
            style={{width:'100%',padding:'9px 12px',background:'#0d0d0d',border:`1px solid ${C.borderMid}`,borderRadius:8,color:C.text,fontSize:12,outline:'none',fontFamily:'inherit',resize:'vertical'}}/>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:'10px 0',background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,color:C.secondary,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}>Cancelar</button>
          <button onClick={() => onSave({ platform, title, format, notes })} disabled={!title}
            style={{flex:2,padding:'10px 0',background:C.yellow,border:'none',borderRadius:8,color:'#0a0a0a',fontSize:12,fontWeight:700,cursor:title?'pointer':'not-allowed',fontFamily:'inherit'}}>
            ⚡ Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const navigate  = useNavigate();
  const now       = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year]    = useState(now.getFullYear());
  const [posts,   setPosts]   = useState({});
  const [modal,   setModal]   = useState(null);
  const [ideas,   setIdeas]   = useState([]);
  const [dbEvents,setDbEvents]= useState({});

  useEffect(() => { loadCalendar(); loadIdeas(); }, [month, year]);

  async function loadCalendar() {
    try {
      const res  = await fetch(`${API}/api/calendar?month=${month+1}&year=${year}`);
      const data = await res.json();
      const grouped = {};
      (data.data||[]).forEach(ev => {
        const d = new Date(ev.scheduled_at).getDate();
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push(ev);
      });
      setDbEvents(grouped);
    } catch(e) { console.error(e); }
  }

  async function loadIdeas() {
    try {
      const res  = await fetch(`${API}/api/analysis/content-ideas?limit=10`);
      const data = await res.json();
      setIdeas(data.data || []);
    } catch(e) { console.error(e); }
  }

  async function savePost(day, postData) {
    const date = new Date(year, month, day);
    date.setHours(12, 0, 0, 0);
    try {
      await fetch(`${API}/api/calendar`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ platform:postData.platform, scheduled_at:date.toISOString(), title:postData.title, notes:postData.notes }),
      });
      setPosts(prev => ({ ...prev, [day]: [...(prev[day]||[]), postData] }));
    } catch(e) { console.error(e); }
    setModal(null);
    loadCalendar();
  }

  function buildGrid() {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const startOffset = (firstDay + 6) % 7;
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }

  const cells = buildGrid();
  const today = now.getDate();
  const isThisMonth = now.getMonth() === month && now.getFullYear() === year;

  const allPosts = (day) => [
    ...(posts[day]||[]),
    ...(dbEvents[day]||[]).map(e => ({ platform:e.platform, title:e.title||e.topic, format:e.format })),
  ];

  return (
    <div style={{minHeight:'100vh',background:C.bg,color:C.text,fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif'}}>
      <TopBar onBack={() => navigate('/')} />

      {modal && <AddModal day={`${modal} de ${MONTHS[month]} ${year}`} onClose={() => setModal(null)} onSave={(data) => savePost(modal, data)}/>}

      <div style={{padding:'24px',maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 300px',gap:20}}>
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <h1 style={{fontSize:22,fontWeight:800,color:C.yellow}}>📅 Parrilla Semanal</h1>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <button onClick={() => setMonth(m => m>0?m-1:11)} style={{background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:'6px 12px',color:C.secondary,fontSize:14,cursor:'pointer'}}>‹</button>
              <span style={{fontSize:14,fontWeight:600,color:C.text,minWidth:140,textAlign:'center'}}>{MONTHS[month]} {year}</span>
              <button onClick={() => setMonth(m => m<11?m+1:0)} style={{background:C.elevated,border:`1px solid ${C.borderMid}`,borderRadius:8,padding:'6px 12px',color:C.secondary,fontSize:14,cursor:'pointer'}}>›</button>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:4}}>
            {DAYS.map(d => <div key={d} style={{textAlign:'center',fontSize:11,color:C.muted,fontFamily:'monospace',padding:'4px 0'}}>{d.slice(0,3).toUpperCase()}</div>)}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
            {cells.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`}/>;
              const dayPosts = allPosts(day);
              const isToday  = isThisMonth && day === today;
              return (
                <div key={day} onClick={() => setModal(day)}
                  style={{minHeight:80,background:dayPosts.length>0?C.elevated:C.surface,border:`1px solid ${isToday?C.yellow:C.border}`,borderRadius:8,padding:'6px 7px',cursor:'pointer'}}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.yellow+'88'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = isToday?C.yellow:C.border}>
                  <div style={{fontSize:11,fontFamily:'monospace',color:isToday?C.yellow:C.secondary,fontWeight:isToday?700:400,marginBottom:4}}>{day}</div>
                  {dayPosts.slice(0,3).map((p,i) => {
                    const color = PCOLORS[p.platform] || C.secondary;
                    return <div key={i} style={{fontSize:9,background:color+'20',color,borderRadius:3,padding:'2px 5px',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:'monospace'}}>{PICONS[p.platform]} {p.title||p.format}</div>;
                  })}
                  {dayPosts.length > 3 && <div style={{fontSize:9,color:C.muted,fontFamily:'monospace'}}>+{dayPosts.length-3} más</div>}
                </div>
              );
            })}
          </div>

          <div style={{display:'flex',gap:14,marginTop:12,flexWrap:'wrap'}}>
            {Object.entries(PCOLORS).map(([p,color]) => (
              <span key={p} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:C.muted,fontFamily:'monospace'}}>
                <span style={{width:8,height:8,borderRadius:2,background:color,display:'inline-block'}}/>{p}
              </span>
            ))}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:'14px 16px'}}>
            <div style={{fontSize:11,fontWeight:700,color:C.yellow,fontFamily:'monospace',letterSpacing:1,textTransform:'uppercase',marginBottom:12}}>💡 Ideas disponibles</div>
            {ideas.length === 0
              ? <p style={{fontSize:12,color:C.muted}}>Sincroniza primero para ver ideas de IA</p>
              : ideas.slice(0,8).map((idea,i) => {
                  const color = PCOLORS[idea.platform] || C.secondary;
                  return (
                    <div key={i} style={{padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
                      <div style={{fontSize:10,color,fontFamily:'monospace',textTransform:'uppercase',marginBottom:3}}>{PICONS[idea.platform]} {idea.platform} · {idea.format}</div>
                      <div style={{fontSize:12,color:C.text,lineHeight:1.4}}>{idea.topic}</div>
                      <div style={{fontSize:10,color:C.muted,marginTop:2,fontFamily:'monospace'}}>tendencia {Number(idea.trend_score||0).toFixed(1)}/10</div>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}