import { useState } from 'react';
import { Card, CardTitle } from './ui';
import { useCalendar } from '../hooks/useData';
import { COLORS } from '../lib/brand';
import dayjs from 'dayjs';

const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function buildCalendarGrid(year, month) {
  const first = dayjs(`${year}-${String(month).padStart(2,'0')}-01`);
  const daysInMonth = first.daysInMonth();
  const startDow = (first.day() + 6) % 7; // Lunes = 0
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function dayColor(entries) {
  if (!entries?.length) return null;
  const plats = entries.map(e => e.platform || '');
  if (plats.some(p => ['instagram', 'tiktok'].includes(p))) return COLORS.amarilloRayo;
  return COLORS.azulCielo;
}

export default function ContentCalendar() {
  const now   = dayjs();
  const [month, setMonth] = useState(now.month() + 1);
  const [year]  = useState(now.year());
  const { data } = useCalendar(month, year);

  const cells = buildCalendarGrid(year, month);

  // Agrupar eventos por día
  const byDay = {};
  (data || []).forEach(ev => {
    const d = dayjs(ev.scheduled_at).date();
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(ev);
  });

  // Demo: algunos días marcados
  const demoMarked = { 3: 'ig', 7: 'yt', 10: 'ig', 13: 'yt', 15: 'ig', 18: 'yt', 20: 'ig', 22: 'yt', 24: 'ig', 26: 'yt', 28: 'ig', 30: 'yt' };

  const todayDay = now.month() + 1 === month ? now.date() : null;

  return (
    <Card>
      <CardTitle icon="ti-calendar">parrilla de contenido</CardTitle>

      {/* Nav mes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <button
          onClick={() => setMonth(m => m > 1 ? m - 1 : 12)}
          style={{ background: 'none', border: 'none', color: COLORS.amarilloRayo, cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
          aria-label="Mes anterior"
        >
          <i className="ti ti-chevron-left" aria-hidden="true" />
        </button>
        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.textPrimary, fontFamily: "'Space Mono',monospace" }}>
          {dayjs(`${year}-${String(month).padStart(2,'0')}-01`).format('MMMM YYYY').toUpperCase()}
        </span>
        <button
          onClick={() => setMonth(m => m < 12 ? m + 1 : 1)}
          style={{ background: 'none', border: 'none', color: COLORS.amarilloRayo, cursor: 'pointer', fontSize: 16, padding: '0 4px' }}
          aria-label="Mes siguiente"
        >
          <i className="ti ti-chevron-right" aria-hidden="true" />
        </button>
      </div>

      {/* Cabecera días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 3 }}>
        {DAYS.map(d => (
          <div key={d} style={{ fontSize: 9, textAlign: 'center', color: COLORS.textMuted, fontFamily: "'Space Mono',monospace" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid días */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} style={{ aspectRatio: '1' }} />;

          const entries = byDay[day];
          const demoColor = demoMarked[day];
          const dotColor  = entries?.length
            ? dayColor(entries)
            : demoColor === 'ig' ? COLORS.amarilloRayo
            : demoColor === 'yt' ? COLORS.azulCielo
            : null;

          const isToday = day === todayDay;

          return (
            <div
              key={day}
              style={{
                aspectRatio: '1',
                borderRadius: 5,
                background: dotColor ? dotColor + '18' : COLORS.elevated,
                border: `1px solid ${isToday ? COLORS.amarilloRayo : dotColor ? dotColor + '44' : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: dotColor ?? COLORS.textMuted,
                fontFamily: "'Space Mono',monospace",
                fontWeight: dotColor ? 700 : 400,
                cursor: dotColor ? 'pointer' : 'default',
              }}
              title={entries?.map(e => e.title || e.platform).join(', ')}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 10, color: COLORS.textMuted, fontFamily: "'Space Mono',monospace" }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.amarilloRayo + '33', border: `1px solid ${COLORS.amarilloRayo}`, display: 'inline-block' }} />
          Instagram / TikTok
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.azulCielo + '33', border: `1px solid ${COLORS.azulCielo}`, display: 'inline-block' }} />
          YouTube / Spotify
        </span>
      </div>
    </Card>
  );
}
