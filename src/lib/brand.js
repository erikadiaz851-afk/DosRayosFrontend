// ── Paleta oficial Dos Rayos (Brandbook ENE 2026) ─────────────
export const COLORS = {
  amarilloRayo:  '#FFCE47',
  azulCielo:     '#89C6E9',
  marAdentro:    '#0B2D4D',
  naranja:       '#F16F11',
  verdeMenta:    '#83DAB0',
  blancoNube:    '#F7F3E8',

  // Fondos dark
  void:          '#080808',
  base:          '#0f0f0f',
  surface:       '#141414',
  elevated:      '#1a1a1a',
  card:          '#1e1e1e',
  hover:         '#242424',

  // Bordes
  borderDim:     'rgba(255,255,255,0.06)',
  borderMid:     'rgba(255,255,255,0.11)',
  borderBright:  'rgba(255,255,255,0.18)',

  // Texto
  textPrimary:   '#f0f0e8',
  textSecondary: '#8a8a82',
  textMuted:     '#444440',
};

// ── Plataformas con color y acento ─────────────────────────────
export const PLATFORMS = {
  instagram:   { label: 'Instagram',   color: COLORS.amarilloRayo, icon: 'ti-brand-instagram' },
  tiktok:      { label: 'TikTok',      color: COLORS.azulCielo,    icon: 'ti-brand-tiktok' },
  youtube:     { label: 'YouTube',     color: COLORS.naranja,      icon: 'ti-brand-youtube' },
  spotify:     { label: 'Spotify',     color: COLORS.verdeMenta,   icon: 'ti-brand-spotify' },
  twitter:     { label: 'Twitter / X', color: COLORS.blancoNube,   icon: 'ti-brand-x' },
  deezer:      { label: 'Deezer',      color: COLORS.azulCielo,    icon: 'ti-music' },
  facebook:    { label: 'Facebook',    color: COLORS.azulCielo,    icon: 'ti-brand-facebook' },
  apple_music: { label: 'Apple Music', color: COLORS.naranja,      icon: 'ti-brand-apple' },
};

// ── Helpers ────────────────────────────────────────────────────
export function formatNumber(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return Math.round(n).toString();
}

export function formatPct(n) {
  if (n == null) return '—';
  return Number(n).toFixed(1) + '%';
}

export function platformColor(name) {
  return PLATFORMS[name]?.color ?? COLORS.textSecondary;
}
