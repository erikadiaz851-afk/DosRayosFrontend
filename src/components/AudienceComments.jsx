import { useState } from 'react';
import { Card, CardTitle, SentimentDot, Spinner, ErrorMsg } from './ui';
import { useComments } from '../hooks/useData';
import { COLORS, platformColor } from '../lib/brand';

const DEMO_COMMENTS = [
  { id: 1, platform: 'instagram', username: 'mariana_flores', comment_text: 'Son literalmente la misma persona y a la vez completamente distintas, eso no tiene explicación 😭', sentiment: 'positive', published_at: '2026-01-20T14:32:00Z' },
  { id: 2, platform: 'tiktok',    username: 'juanpipa99',     comment_text: 'Esta canción me lleva a cuando era chico con mis hermanos, qué nostalgia tan bacana', sentiment: 'positive', published_at: '2026-01-20T12:10:00Z' },
  { id: 3, platform: 'youtube',   username: 'vale.restrepo',  comment_text: 'Cuándo sale el nuevo sencillo?? Llevo semanas esperando 🙏', sentiment: 'neutral', published_at: '2026-01-19T18:44:00Z' },
  { id: 4, platform: 'instagram', username: 'luna.sanz',      comment_text: 'Me identifico tanto con la letra, es como si me hubieran escrito la canción a mí', sentiment: 'positive', published_at: '2026-01-19T10:05:00Z' },
  { id: 5, platform: 'tiktok',    username: 'camilo_rayo',    comment_text: 'El Amarillo Rayo de su ropa es demasiado icónico, siempre igual y siempre distintas', sentiment: 'positive', published_at: '2026-01-18T22:17:00Z' },
  { id: 6, platform: 'youtube',   username: 'andreita_mx',    comment_text: 'Pensé que solo eran para reel pero la profundidad de sus letras me dejó sin palabras', sentiment: 'positive', published_at: '2026-01-18T09:30:00Z' },
];

function Avatar({ name, platform }) {
  const initials = name?.slice(0, 2).toUpperCase() || '??';
  const color    = platformColor(platform);
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: color + '25',
      border: `1px solid ${color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 700, color, flexShrink: 0,
      fontFamily: "'Space Mono',monospace",
    }}>
      {initials}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `hace ${Math.round(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.round(diff / 3600)}h`;
  return `hace ${Math.round(diff / 86400)}d`;
}

export default function AudienceComments() {
  const [platform, setPlatform] = useState('');
  const { data, loading, error } = useComments(platform, 20);

  const comments = (data?.length ? data : DEMO_COMMENTS)
    .filter(c => !platform || c.platform === platform)
    .slice(0, 8);

  return (
    <Card>
      <CardTitle icon="ti-message-circle">últimos comentarios de audiencia</CardTitle>

      {/* Filtro plataforma */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {['', 'instagram', 'tiktok', 'youtube'].map(p => {
          const active = platform === p;
          const color  = p ? platformColor(p) : COLORS.amarilloRayo;
          return (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                fontSize: 10, fontFamily: "'Space Mono',monospace",
                padding: '3px 10px', borderRadius: 20,
                border: `1px solid ${active ? color : COLORS.borderDim}`,
                background: active ? color + '18' : 'transparent',
                color: active ? color : COLORS.textMuted,
                cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}
            >
              {p || 'todas'}
            </button>
          );
        })}
      </div>

      {loading && <Spinner />}
      {error   && <ErrorMsg message="No se pudieron cargar los comentarios" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto' }}>
        {comments.map(c => (
          <div key={c.id} style={{ background: COLORS.elevated, borderRadius: 9, padding: '10px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <Avatar name={c.username} platform={c.platform} />
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.textPrimary }}>{c.username}</span>
              <span style={{ fontSize: 9, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginLeft: 'auto' }}>
                {c.platform?.toUpperCase()} · {timeAgo(c.published_at)}
              </span>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.45 }}>{c.comment_text}</p>
            <div style={{ marginTop: 5 }}>
              <SentimentDot sentiment={c.sentiment} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
