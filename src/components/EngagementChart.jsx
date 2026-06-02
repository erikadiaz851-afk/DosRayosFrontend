import { useEffect, useRef } from 'react';
import { Card, CardTitle, BarRow, Spinner, ErrorMsg } from './ui';
import { useMetrics, useMetricHistory } from '../hooks/useData';
import { COLORS, platformColor, formatPct } from '../lib/brand';

export default function EngagementChart() {
  const { data: metrics, loading, error } = useMetrics();
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  // Construir datasets para Chart.js desde el histórico real
  const ig  = useMetricHistory('instagram', 28);
  const tt  = useMetricHistory('tiktok', 28);
  const yt  = useMetricHistory('youtube', 28);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (typeof window.Chart === 'undefined') return;

    const makeDataset = (history, label, color, dash = []) => ({
      label,
      data: history?.map(h => Number((h.engagement_rate || 0) * 100).toFixed(2)) || [3.8, 4.1, 3.9, 4.2],
      borderColor: color,
      backgroundColor: color + '12',
      borderDash: dash,
      tension: 0.4,
      pointRadius: 3,
      borderWidth: 2,
    });

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new window.Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: ig.data?.map((_, i) => `Sem ${i + 1}`) || ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [
          makeDataset(ig.data,  'Instagram', COLORS.amarilloRayo),
          makeDataset(tt.data,  'TikTok',    COLORS.azulCielo,  [5, 3]),
          makeDataset(yt.data,  'YouTube',   COLORS.naranja,    [2, 2]),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: COLORS.elevated,
            titleColor: COLORS.amarilloRayo,
            bodyColor: COLORS.textSecondary,
            borderColor: COLORS.borderMid,
            borderWidth: 1,
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${Number(ctx.raw).toFixed(1)}%` },
          },
        },
        scales: {
          x: {
            grid: { color: COLORS.borderDim },
            ticks: { color: COLORS.textMuted, font: { size: 10, family: 'Space Mono' } },
          },
          y: {
            grid: { color: COLORS.borderDim },
            ticks: {
              color: COLORS.textMuted,
              font: { size: 10, family: 'Space Mono' },
              callback: v => Number(v).toFixed(1) + '%',
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); };
  }, [ig.data, tt.data, yt.data]);

  const engagementBars = metrics
    ? metrics
        .filter(m => m.engagement_rate)
        .sort((a, b) => b.engagement_rate - a.engagement_rate)
        .slice(0, 5)
    : [];

  const maxEng = Math.max(...engagementBars.map(m => m.engagement_rate || 0), 0.1);

  return (
    <Card>
      <CardTitle icon="ti-chart-line">engagement por plataforma</CardTitle>

      {/* Leyenda manual */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10, fontSize: 11, color: COLORS.textMuted }}>
        {[['Instagram', COLORS.amarilloRayo, []], ['TikTok', COLORS.azulCielo, [5,3]], ['YouTube', COLORS.naranja, [2,2]]].map(([lbl, col]) => (
          <span key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: col, display: 'inline-block' }} />
            {lbl}
          </span>
        ))}
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', width: '100%', height: 160 }}>
        <canvas
          id="engagementChart"
          ref={canvasRef}
          role="img"
          aria-label="Gráfica de evolución de engagement semanal por plataforma"
        >
          Engagement semanal por plataforma: Instagram, TikTok y YouTube
        </canvas>
      </div>

      {/* Barras resumen */}
      {error && <ErrorMsg message="No se pudo cargar el engagement" />}
      {loading && <Spinner />}
      {!loading && engagementBars.length > 0 && (
        <div style={{ marginTop: 14 }}>
          {engagementBars.map(m => (
            <BarRow
              key={m.platform}
              label={m.platform}
              value={Number((m.engagement_rate * 100).toFixed(1))}
              max={maxEng * 100}
              color={platformColor(m.platform)}
            />
          ))}
        </div>
      )}

      {/* Si no hay datos reales, mostrar datos demo */}
      {!loading && engagementBars.length === 0 && (
        <div style={{ marginTop: 14 }}>
          {[['instagram', 4.2, COLORS.amarilloRayo], ['tiktok', 7.8, COLORS.azulCielo], ['youtube', 3.1, COLORS.naranja], ['twitter', 1.7, COLORS.verdeMenta]].map(([p, v, c]) => (
            <BarRow key={p} label={p} value={v} max={10} color={c} />
          ))}
        </div>
      )}
    </Card>
  );
}
