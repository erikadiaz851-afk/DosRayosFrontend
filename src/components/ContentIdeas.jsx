import { useState } from 'react';
import { Card, CardTitle, Badge, Spinner, ErrorMsg } from './ui';
import { useContentIdeas } from '../hooks/useData';
import { COLORS, PLATFORMS } from '../lib/brand';

const PLATFORMS_LIST = ['', 'instagram', 'tiktok', 'youtube', 'spotify'];

function accentColor(platform) {
  const map = {
    instagram: COLORS.amarilloRayo,
    tiktok:    COLORS.azulCielo,
    youtube:   COLORS.naranja,
    spotify:   COLORS.verdeMenta,
    twitter:   COLORS.blancoNube,
  };
  return map[platform] ?? COLORS.amarilloRayo;
}

export default function ContentIdeas() {
  const [activePlatform, setActivePlatform] = useState('');
  const { data, loading, error } = useContentIdeas(activePlatform);

  const ideas = data || [];

  // Demo fallback
  const demoIdeas = [
    { id: 1, platform: 'instagram', format: 'Reel', topic: 'Gemelas reaccionan a comentarios de fans', hook: '¿Quién dijo esto de nosotras?', trend_score: 9.2 },
    { id: 2, platform: 'tiktok',    format: 'Video', topic: 'Una empieza la canción, la otra la termina', hook: 'Armonía de dos almas', trend_score: 8.7 },
    { id: 3, platform: 'youtube',   format: 'Vlog',  topic: 'Proceso creativo completo de un sencillo', hook: 'Desde la idea hasta el lanzamiento', trend_score: 8.1 },
    { id: 4, platform: 'spotify',   format: 'Single', topic: 'Sunny Twins — ritmo tropical de verano', hook: 'El sonido del verano colombiano', trend_score: 7.9 },
    { id: 5, platform: 'instagram', format: 'Carrusel', topic: 'Outfits coordinados: Sunny Twins 2026', hook: '¿Cuál es tu favorito?', trend_score: 7.5 },
  ];

  const displayIdeas = ideas.length > 0 ? ideas : demoIdeas;
  const filtered = activePlatform
    ? displayIdeas.filter(i => i.platform === activePlatform)
    : displayIdeas;

  return (
    <Card>
      <CardTitle icon="ti-bulb">ideas de contenido — IA</CardTitle>

      {/* Filtros de plataforma */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {PLATFORMS_LIST.map(p => {
          const active = activePlatform === p;
          const color  = accentColor(p) || COLORS.textSecondary;
          return (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              style={{
                fontSize: 10,
                fontFamily: "'Space Mono',monospace",
                padding: '4px 10px',
                borderRadius: 20,
                border: `1px solid ${active ? color : COLORS.borderDim}`,
                background: active ? color + '18' : 'transparent',
                color: active ? color : COLORS.textMuted,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {p || 'todas'}
            </button>
          );
        })}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMsg message="No se pudieron cargar las ideas" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(idea => {
          const accent = accentColor(idea.platform);
          return (
            <div
              key={idea.id}
              style={{
                background: COLORS.elevated,
                borderRadius: 9,
                padding: '10px 12px',
                borderLeft: `3px solid ${accent}`,
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontFamily: "'Space Mono',monospace", color: accent, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {idea.platform} · {idea.format}
                </span>
                {idea.hashtags?.slice(0, 2).map(h => (
                  <Badge key={h} color={accent}>{h}</Badge>
                ))}
              </div>
              <p style={{ fontSize: 12, color: COLORS.textPrimary, lineHeight: 1.4, marginBottom: 3 }}>
                {idea.topic}
              </p>
              {idea.hook && (
                <p style={{ fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic' }}>
                  "{idea.hook}"
                </p>
              )}
              <p style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, fontFamily: "'Space Mono',monospace" }}>
                tendencia {Number(idea.trend_score).toFixed(1)} / 10
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
