import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const C = { surface:'#141414', border:'#222', yellow:'#FFCE47', blue:'#89C6E9', red:'#ff6b6b', text:'#f0f0e8', muted:'#666' };

export default function UserMenu() {
  const auth = useAuth();
  if (!auth) return null;
  const { user, logout } = auth;
  const [open, setOpen] = useState(false);
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || '??';

  function handleLogout() {
  localStorage.removeItem('dr_token');
  window.location.href = '/';
}

  return (
    <div style={{position:'relative'}}>
      <div onClick={()=>setOpen(!open)} style={{width:32,height:32,borderRadius:'50%',background:C.yellow+'25',border:`1px solid ${C.yellow}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.yellow,cursor:'pointer',fontFamily:'monospace'}}>
        {initials}
      </div>
      {open && (
        <>
          <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,zIndex:99}}/>
          <div style={{position:'absolute',top:40,right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 0',minWidth:180,zIndex:100,boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>
            <div style={{padding:'8px 14px 10px',borderBottom:`1px solid ${C.border}`}}>
              <p style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:2}}>{user?.name}</p>
              <p style={{fontSize:11,color:C.muted,fontFamily:'monospace'}}>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={{width:'100%',textAlign:'left',padding:'8px 14px',background:'none',border:'none',color:C.red,fontSize:12,cursor:'pointer',fontFamily:'inherit'}}
              onMouseEnter={e=>e.target.style.background='#1a0000'}
              onMouseLeave={e=>e.target.style.background='none'}
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}