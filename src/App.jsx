import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import Dashboard         from './components/Dashboard';
import SentimentPage     from './pages/SentimentPage';
import CalendarPage      from './pages/CalendarPage';
import BrandAnalysisPage from './pages/AnalysisPage';

function LoadingScreen() {
  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{width:32,height:32,border:'2px solid #1e1e1e',borderTop:'2px solid #FFCE47',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
      <p style={{color:'#444',fontSize:12,fontFamily:'monospace',letterSpacing:1}}>CARGANDO DOS RAYOS...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user)    return <Navigate to="/" replace />;
  return children;
}

function LoginAndRegister() {
  const [showReg, setShowReg] = useState(false);
  return showReg
    ? <RegisterPage onSwitch={() => setShowReg(false)} />
    : <LoginPage    onSwitch={() => setShowReg(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"         element={<PublicRoute><LoginAndRegister /></PublicRoute>} />
          <Route path="/"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/sentimientos"  element={<ProtectedRoute><SentimentPage /></ProtectedRoute>} />
          <Route path="/parrilla"      element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/analisis-marca"element={<ProtectedRoute><BrandAnalysisPage /></ProtectedRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}