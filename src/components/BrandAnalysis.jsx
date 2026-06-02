import { Card, CardTitle, Badge, Spinner, ErrorMsg } from './ui';
import { useBrandAnalysis } from '../hooks/useData';
import { COLORS } from '../lib/brand';

const PILARES = ['Gemelas', 'Parchadas', 'Empáticas', 'Energía', 'Versatilidad'];
const PILAR_COLORS = [COLORS.amarilloRayo, COLORS.azulCielo, COLORS.verdeMenta, COLORS.naranja, COLORS.blancoNube];
const PILAR_SCORES = [9.4, 8.8, 8.5, 9.1, 7.9]; // Demo

function ScoreBar({ score, color }) {
  return (
    <div style={{ flex: 1, background: COLORS.card, borderRadius: 3, height: 4, overflow: 'hidden' }}>
      <div style={{ width: `${(score / 10) * 100}%`, height: 4, background: color, borderRadius: 3 }} />
    </div>
  );
}

export default function BrandAnalysis() {
  const { data, loading, error } = useBrandAnalysis();

  const analysis = data || null;

  const temas = analysis?.content_performance?.best_topics
    || ['complicidad', 'amor cotidiano', 'familia', 'autenticidad', 'humor'];

  const comunicacion = analysis?.communication_style?.language_register || 'cotidiano, sin filtros';
  const resumen = analysis?.brand_identity?.brand_personality
    || 'Energía Cómplice — dos fuerzas distintas que se amplifican mutuamente en arte auténtico';

  return (
    <Card>
      <CardTitle icon="ti-sparkles">análisis de marca — IA</CardTitle>

      {loading && <Spinner />}
      {error   && <ErrorMsg message="Conecta el backend para ver el análisis de IA" />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        <div style={{ background: COLORS.elevated, borderRadius: 9, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            concepto central
          </p>
          <p style={{ fontSize: 12, color: COLORS.textPrimary, lineHeight: 1.45 }}>{resumen}</p>
        </div>

        <div style={{ background: COLORS.elevated, borderRadius: 9, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            tono de comunicación
          </p>
          <p style={{ fontSize: 12, color: COLORS.textPrimary }}>{comunicacion}</p>
        </div>

        <div style={{ background: COLORS.elevated, borderRadius: 9, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            temas predominantes
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {temas.map((t, i) => (
              <Badge key={t} color={i % 2 === 0 ? COLORS.amarilloRayo : COLORS.azulCielo}>{t}</Badge>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.elevated, borderRadius: 9, padding: '10px 12px' }}>
          <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            pilares de marca
          </p>
          {PILARES.map((pilar, i) => (
            <div key={pilar} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PILAR_COLORS[i], flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: COLORS.textPrimary, width: 84, flexShrink: 0 }}>{pilar}</span>
              <ScoreBar score={PILAR_SCORES[i]} color={PILAR_COLORS[i]} />
              <span style={{ fontSize: 11, fontWeight: 700, color: PILAR_COLORS[i], width: 28, textAlign: 'right', fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                {PILAR_SCORES[i].toFixed(1)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </Card>
  );
}
