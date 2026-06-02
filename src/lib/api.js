/**
 * Cliente API — conecta con el backend de Dos Rayos
 * Cambia BASE_URL si tu backend corre en otro puerto o dominio
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchAPI(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Error ${res.status}: ${path}`);
  return res.json();
}

async function postAPI(path, body = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  // ── Resumen ejecutivo ──────────────────────────────────────
  getSummary:        () => fetchAPI('/api/summary'),

  // ── Métricas por plataforma ────────────────────────────────
  getMetrics:        () => fetchAPI('/api/metrics'),
  getMetricHistory:  (platform, days = 30) =>
    fetchAPI(`/api/metrics/${platform}/history?days=${days}`),

  // ── Publicaciones ──────────────────────────────────────────
  getPosts:          (platform, limit = 20) =>
    fetchAPI(`/api/posts?platform=${platform}&limit=${limit}`),
  getTopPosts:       (platform) =>
    fetchAPI(`/api/posts/top${platform ? `?platform=${platform}` : ''}`),

  // ── Comentarios ────────────────────────────────────────────
  getComments:       (platform, limit = 50) =>
    fetchAPI(`/api/comments?platform=${platform}&limit=${limit}`),

  // ── Análisis IA ────────────────────────────────────────────
  getBrandAnalysis:  () => fetchAPI('/api/analysis/brand'),
  getContentIdeas:   (platform) =>
    fetchAPI(`/api/analysis/content-ideas${platform ? `?platform=${platform}` : ''}`),
  getTopics:         () => fetchAPI('/api/analysis/topics'),

  // ── Calendario ─────────────────────────────────────────────
  getCalendar:       (month, year) =>
    fetchAPI(`/api/calendar?month=${month}&year=${year}`),
  addToCalendar:     (data) => postAPI('/api/calendar', data),

  // ── Sincronización ─────────────────────────────────────────
  syncAll:           (config = {}) => postAPI('/api/sync', config),

  // ── Estado de conexiones ───────────────────────────────────
  getAuthStatus:     () => fetchAPI('/auth/status'),
};
