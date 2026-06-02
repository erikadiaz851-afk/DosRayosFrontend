import { Card, CardTitle, ActionBtn } from './ui';
import { useTopics } from '../hooks/useData';
import { COLORS } from '../lib/brand';
import { api } from '../lib/api';

// ── Trending Topics ────────────────────────────────────────────
const DEMO_TOPICS = [
  { topic: 'gemelas idénticas', pct: 92, alt: false },
  { topic: 'proceso creativo',  pct: 78, alt: true  },
  { topic: 'letra cotidiana',   pct: 71, alt: false },
  { topic: 'ritmos tropicales', pct: 65, alt: true  },
  { topic: 'humor / espontáneo',pct: 58, alt: false },
  { topic: 'contenido familiar',pct: 44, alt: true  },
];

export function TrendingTopics() {
  const { data } = useTopics();

  const topics = data?.main_topics
    ? data.main_topics.map((t, i) => ({
        topic: t,
        pct: Math.max(10, 90 - i * 12),
        alt: i % 2 !== 0,
      }))
    : DEMO_TOPICS;

  return (
    <Card>
      <CardTitle icon="ti-trending-up">temas en tendencia</CardTitle>
      <div>
        {topics.map(({ topic, pct, alt }) => (
          <div
            key={topic}
            style={{
              display: 'flex', alignItems: 'center',
              padding: '7px 0',
              borderBottom: `1px solid ${COLORS.borderDim}`,
            }}
          >
            <span style={{ fontSize: 12, color: COLORS.textPrimary, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
              {topic}
            </span>
            <div style={{ width: 80, background: COLORS.elevated, borderRadius: 3, height: 4, flexShrink: 0, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: 4, background: alt ? COLORS.azulCielo : COLORS.amarilloRayo, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 10, color: COLORS.textMuted, width: 32, textAlign: 'right', fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Quick Actions ──────────────────────────────────────────────
export function QuickActions({ onSyncing }) {
  async function handleSync() {
    onSyncing?.(true);
    try {
      await api.syncAll();
    } finally {
      onSyncing?.(false);
    }
  }

  return (
    <Card>
      <CardTitle icon="ti-bolt">acciones rápidas</CardTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ActionBtn icon="ti-bulb" onClick={() => window.location.href = '#ideas'}>
          generar ideas de contenido
        </ActionBtn>
        <ActionBtn icon="ti-heart" accent={COLORS.azulCielo} onClick={() => window.location.href = '#comments'}>
          analizar sentimiento audiencia
        </ActionBtn>
        <ActionBtn icon="ti-calendar" onClick={() => window.location.href = '#calendar'}>
          planear parrilla semanal
        </ActionBtn>
        <ActionBtn icon="ti-sparkles" accent={COLORS.azulCielo} onClick={() => window.location.href = '#brand'}>
          análisis de marca completo
        </ActionBtn>
        <ActionBtn icon="ti-refresh" onClick={handleSync}>
          sincronizar plataformas
        </ActionBtn>
      </div>
    </Card>
  );
}
