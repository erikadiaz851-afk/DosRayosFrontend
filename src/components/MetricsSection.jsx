import { KpiCard, SectionLabel } from './ui';
import { useMetrics } from '../hooks/useData';
import { COLORS } from '../lib/brand';

const PLATFORM_ORDER = ['instagram', 'tiktok', 'youtube', 'spotify', 'twitter', 'deezer', 'facebook', 'apple_music'];

// Deltas de ejemplo — en producción vendrían del histórico comparado
const MOCK_DELTAS = {
  instagram: 3.4, tiktok: 8.1, youtube: 1.2,
  spotify: 5.7, twitter: -0.3, deezer: 2.0,
  facebook: 0.8, apple_music: null,
};

export default function MetricsSection() {
  const { data, loading } = useMetrics();

  // Construir lista de plataformas desde la API o mostrar placeholders
  const platforms = loading
    ? PLATFORM_ORDER.map(p => ({ platform: p, followers: null }))
    : (data || []).sort(
        (a, b) => PLATFORM_ORDER.indexOf(a.platform) - PLATFORM_ORDER.indexOf(b.platform)
      );

  return (
    <section aria-label="Métricas de plataformas">
      <SectionLabel>⚡ alcance total — todas las plataformas</SectionLabel>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
      }}>
        {platforms.map(p => (
          <KpiCard
            key={p.platform}
            platform={p.platform}
            value={p.followers}
            label="seguidores"
            delta={MOCK_DELTAS[p.platform]}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}
