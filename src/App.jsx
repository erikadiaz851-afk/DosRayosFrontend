import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';



function LoadingScreen() {
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <div style={{width:32,height:32,border:'2px solid #1e1e1e',borderTop:'2px solid #FFCE47',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'#444',fontSize:12,fontFamily:'monospace',letterSpacing:1}}>CARGANDO DOS RAYOS...</p>
    </div>
  );
}

function AppRouter() {
  const { user, loading }      = useAuth();
  const [showReg, setShowReg]  = useState(false);
  if (loading) return <LoadingScreen />;
  if (!user) return showReg
    ? <RegisterPage onSwitch={()=>setShowReg(false)} />
    : <LoginPage    onSwitch={()=>setShowReg(true)} />;
  return <Dashboard />;
}

export default function App() {
  return <AuthProvider><AppRouter /></AuthProvider>;
}