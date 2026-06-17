'use client';

import { STAGE_NAMES } from '@/types';

interface HealthBarProps {
  health: number;
  maxHealth: number;
  stage: number;
  score: number;
}

export default function HealthBar({ health, maxHealth, stage, score }: HealthBarProps) {
  const pct = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const barColor = pct > 50 ? '#4CAF50' : pct > 25 ? '#FF9800' : '#F44336';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 14px',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: 12,
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{
        background: '#FFD700',
        color: '#000',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        {STAGE_NAMES[stage]}
      </span>

      <div style={{
        flex: 1,
        minWidth: 100,
        height: 14,
        background: '#333',
        borderRadius: 7,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: barColor,
          borderRadius: 7,
          transition: 'width 0.5s ease, background 0.5s ease',
        }} />
        <span style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
          textShadow: '1px 1px 2px #000',
        }}>
          {health} / {maxHealth}
        </span>
      </div>

      <span style={{ fontWeight: 700, fontSize: 14, color: '#FFD700' }}>
        ⭐ {score}
      </span>
    </div>
  );
}
