import { COLORS, platformColor, formatNumber, formatPct } from '../lib/brand';

// ── Skeleton loader ────────────────────────────────────────────
export function Skeleton({ height = 20, width = '100%', radius = 6 }) {
  return (
    <div style={{
      height, width, borderRadius: radius,
      background: `linear-gradient(90deg, ${COLORS.surface} 25%, ${COLORS.elevated} 50%, ${COLORS.surface} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

// ── Sección label ──────────────────────────────────────────────
export function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 2,
      color: COLORS.amarilloRayo,
      textTransform: 'uppercase',
      marginBottom: 10,
    }}>
      {children}
    </p>
  );
}

// ── Card wrapper ───────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.borderDim}`,
      borderRadius: 14,
      padding: '16px 18px',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Card title ─────────────────────────────────────────────────
export function CardTitle({ icon, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize: 16, color: COLORS.amarilloRayo }} aria-hidden="true" />}
      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary }}>{children}</span>
    </div>
  );
}

// ── KPI card ───────────────────────────────────────────────────
export function KpiCard({ platform, value, label, delta, loading }) {
  const color = platformColor(platform);
  const isUp  = delta > 0;
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.borderDim}`,
      borderRadius: 12,
      padding: '14px 14px 12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
      <p style={{ fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace", marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {platform}
      </p>
      {loading
        ? <Skeleton height={28} width={80} />
        : <p style={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>{formatNumber(value)}</p>
      }
      <p style={{ fontSize: 10, color: COLORS.textSecondary, marginTop: 3 }}>{label}</p>
      {delta != null && (
        <p style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", marginTop: 5, color: isUp ? COLORS.verdeMenta : COLORS.naranja }}>
          {isUp ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% esta semana
        </p>
      )}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────
export function Badge({ children, color = COLORS.amarilloRayo }) {
  return (
    <span style={{
      fontSize: 10,
      background: color + '18',
      color,
      border: `1px solid ${color}33`,
      borderRadius: 20,
      padding: '3px 9px',
      fontFamily: "'Space Mono',monospace",
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

// ── Bar row ────────────────────────────────────────────────────
export function BarRow({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 11, color: COLORS.textSecondary, width: 76, fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, background: COLORS.elevated, borderRadius: 3, height: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: 5, background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, color: COLORS.textPrimary, width: 44, textAlign: 'right', fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
        {typeof value === 'number' && value < 100 ? formatPct(value) : formatNumber(value)}
      </span>
    </div>
  );
}

// ── Action button ──────────────────────────────────────────────
export function ActionBtn({ icon, children, accent = COLORS.amarilloRayo, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left',
        background: hovered ? COLORS.elevated : COLORS.card,
        border: `1px solid ${hovered ? accent + '55' : COLORS.borderDim}`,
        borderRadius: 10,
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 9,
        cursor: 'pointer',
        color: hovered ? accent : COLORS.textSecondary,
        fontFamily: "'Syne',sans-serif",
        fontSize: 12,
        transition: 'all 0.15s',
      }}
    >
      {icon && <i className={`ti ${icon}`} style={{ fontSize: 16, color: accent }} aria-hidden="true" />}
      {children}
    </button>
  );
}

// ── Sentiment dot ──────────────────────────────────────────────
export function SentimentDot({ sentiment }) {
  const map = {
    positive: { color: COLORS.verdeMenta, label: 'positivo' },
    neutral:  { color: COLORS.textMuted,  label: 'neutral' },
    negative: { color: COLORS.naranja,    label: 'negativo' },
  };
  const s = map[sentiment] ?? map.neutral;
  return (
    <span style={{ fontSize: 10, color: s.color, fontFamily: "'Space Mono',monospace" }}>
      ● {s.label}
    </span>
  );
}

// ── Status indicator ───────────────────────────────────────────
export function StatusDot({ active, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace" }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? COLORS.verdeMenta : '#333', display: 'inline-block' }} />
      {label}
    </span>
  );
}

// ── Loading spinner ────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{
        width: 28, height: 28,
        border: `2px solid ${COLORS.borderDim}`,
        borderTop: `2px solid ${COLORS.amarilloRayo}`,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

// ── Error message ──────────────────────────────────────────────
export function ErrorMsg({ message }) {
  return (
    <div style={{
      background: COLORS.naranja + '15',
      border: `1px solid ${COLORS.naranja}33`,
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12,
      color: COLORS.naranja,
      fontFamily: "'Space Mono',monospace",
    }}>
      <i className="ti ti-alert-triangle" style={{ marginRight: 6 }} aria-hidden="true" />
      {message}
    </div>
  );
}

import React from 'react';
