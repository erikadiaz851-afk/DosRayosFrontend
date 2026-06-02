import { useState } from 'react';
import { useAuthStatus } from '../hooks/useData';
import { COLORS, platformColor } from '../lib/brand';
import { StatusDot } from './ui';
import MetricsSection    from './MetricsSection';
import EngagementChart   from './EngagementChart';
import ContentIdeas      from './ContentIdeas';
import AudienceComments  from './AudienceComments';
import BrandAnalysis     from './BrandAnalysis';
import ContentCalendar   from './ContentCalendar';
import { TrendingTopics, QuickActions } from './Widgets';

// ── Inline global styles injected once ────────────────────────
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: #080808; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
`;

// ── Two-bolt logo mark ─────────────────────────────────────────
function BoltMark() {
  const bolt = {
    display: 'block', width: 9, height: 22,
    background: COLORS.amarilloRayo,
    clipPath: 'polygon(60% 0%,100% 0%,40% 50%,100% 50%,0% 100%,60% 100%,20% 50%,0% 50%)',
  };
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <span style={bolt} />
      <span style={{ ...bolt, background: COLORS.azulCielo, marginTop: 4 }} />
    </div>
  );
}

// ── Top bar ────────────────────────────────────────────────────
function TopBar({ syncing }) {
  const { data: authStatus } = useAuthStatus();
  const platforms = authStatus?.status || {};

  return (
    <header style={{
      background: '#0f0f0f',
      borderBottom: `1px solid ${COLORS.borderDim}`,
      padding: '13px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <BoltMark />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.amarilloRayo, fontFamily: "'Syne',sans-serif", letterSpacing: '-0.5px', lineHeight: 1 }}>
            DOS <span style={{ color: COLORS.azulCielo }}>RAYOS</span>
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginTop: 1 }}>
            BRAND INTELLIGENCE · ENE 2026
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {Object.entries(platforms).map(([p, on]) => (
            <StatusDot key={p} active={on} label={p} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: syncing ? COLORS.naranja : COLORS.amarilloRayo,
          }} />
          <span style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace" }}>
            {syncing ? 'SINCRONIZANDO...' : 'EN LÍNEA'}
          </span>
        </div>
      </div>
    </header>
  );
}

// ── Footer ─────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: '#0f0f0f',
      borderTop: `1px solid ${COLORS.borderDim}`,
      padding: '10px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <span style={{ fontSize: 10, color: '#333', fontFamily: "'Space Mono',monospace" }}>
        DOS RAYOS BRAND INTELLIGENCE · ANYMAL MEDIA · ENE 2026
      </span>
      <span style={{ fontSize: 10, color: '#333', fontFamily: "'Space Mono',monospace" }}>
        "DOS PIEZAS DE UN MISMO CIELO"
      </span>
    </footer>
  );
}

// ── Section wrapper ────────────────────────────────────────────
function Section({ id, label, children }) {
  return (
    <section id={id} aria-label={label} style={{ display: 'contents' }}>
      {children}
    </section>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [syncing, setSyncing] = useState(false);

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div style={{
        background: '#080808',
        color: COLORS.textPrimary,
        fontFamily: "'Syne',sans-serif",
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <TopBar syncing={syncing} />

        {/* Scanline overlay */}
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <main style={{ position: 'relative', zIndex: 1, flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* KPIs */}
          <Section id="metrics" label="Métricas totales por plataforma">
            <MetricsSection />
          </Section>

          {/* Row 2: engagement + ideas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Section id="engagement" label="Engagement por plataforma">
              <EngagementChart />
            </Section>
            <Section id="ideas" label="Ideas de contenido generadas por IA">
              <ContentIdeas />
            </Section>
          </div>

          {/* Row 3: comments + brand */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            <Section id="comments" label="Últimos comentarios de audiencia">
              <AudienceComments />
            </Section>
            <Section id="brand" label="Análisis de marca con IA">
              <BrandAnalysis />
            </Section>
          </div>

          {/* Row 4: trending + calendar + actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <TrendingTopics />
            <Section id="calendar" label="Parrilla de contenido mensual">
              <ContentCalendar />
            </Section>
            <QuickActions onSyncing={setSyncing} />
          </div>

        </main>

        <Footer />
      </div>
    </>
  );
}
