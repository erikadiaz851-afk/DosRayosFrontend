import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const C = {
  bg:'#0a0a0a', surface:'#141414', border:'#222',
  yellow:'#FFCE47', blue:'#89C6E9', red:'#ff6b6b',
  text:'#f0f0e8', muted:'#666',
};

function Bolts() {
  const b = { display:'block', width:10, height:24, background:C.yellow,
    clipPath:'polygon(60% 0%,100% 0%,40% 50%,100% 50%,0% 100%,60% 100%,20% 50%,0% 50%)' };
  return <div style={{display:'flex',gap:3}}><span style={b}/><span style={{...b,background:C.blue,marginTop:5}}/></div>;
}

export default function LoginPage({ onSwitch }) {
  const { login }             = useAuth();
  const [email, setEmail]     = useState('');
  const [pass,  setPass]      = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try { await login(email, pass); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  const input = {
    width:'100%', padding:'10px 14px',
    background:'#0d0d0d', border:`1px solid ${C.border}`,
    borderRadius:8, color:C.text, fontSize:13,
    outline:'none', fontFamily:'inherit',
  };

  return (
    <div style={{minHeight:'100vh',background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif',backgroundImage:'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',backgroundSize:'40px 40px'}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:'36px 40px',width:'100%',maxWidth:400}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:28}}>
          <Bolts />
          <div>
            <div style={{fontSize:20,fontWeight:800,color:C.yellow,letterSpacing:-0.5}}>DOS <span style={{color:C.blue}}>RAYOS</span></div>
            <div style={{fontSize:10,color:C.muted,fontFamily:'monospace',letterSpacing:1.5}}>BRAND INTELLIGENCE</div>
          </div>
        </div>

        <h2 style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:6}}>Iniciar sesión</h2>
        <p style={{fontSize:12,color:C.muted,marginBottom:24}}>Accede al dashboard de Dos Rayos</p>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" required style={input}
              onFocus={e=>e.target.style.borderColor=C.yellow} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontSize:11,color:C.muted,fontFamily:'monospace',letterSpacing:1,textTransform:'uppercase',display:'block',marginBottom:6}}>Contraseña</label>
            <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required style={input}
              onFocus={e=>e.target.style.borderColor=C.yellow} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          {error && <div style={{background:'#1a0000',border:'1px solid #3d0000',borderRadius:8,padding:'9px 13px',fontSize:12,color:C.red,marginBottom:16}}>{error}</div>}
          <button type="submit" disabled={loading} style={{width:'100%',padding:'11px 0',background:loading?'#2a2a00':C.yellow,border:'none',borderRadius:9,fontSize:13,fontWeight:700,color:'#0a0a0a',cursor:loading?'not-allowed':'pointer',fontFamily:'inherit'}}>
            {loading ? 'Entrando...' : '⚡ Entrar al Dashboard'}
          </button>
        </form>

        <p style={{textAlign:'center',fontSize:12,color:C.muted,marginTop:20}}>
          ¿No tienes cuenta?{' '}
          <span onClick={onSwitch} style={{color:C.blue,cursor:'pointer',textDecoration:'underline'}}>Crear cuenta</span>
        </p>
      </div>
    </div>
  );
}