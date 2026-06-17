'use client';

import { STAGE_NAMES } from '@/types';

interface LevelUpModalProps {
  fromStage: number;
  toStage: number;
  newMaxHealth: number;
  onContinue: () => void;
}

const STAGE_EMOJI: Record<number, string> = { 1: '😶', 2: '🧑‍🎓', 3: '🦸', 4: '✨', 5: '👑' };

export default function LevelUpModal({ fromStage, toStage, newMaxHealth, onContinue }: LevelUpModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 20,
        padding: '32px 40px',
        textAlign: 'center',
        border: '2px solid #FFD700',
        animation: 'scaleIn 0.5s ease',
        maxWidth: 340,
      }}>
        <div style={{ fontSize: 16, color: '#FFD700', fontWeight: 600, marginBottom: 12 }}>
          🎉 恭喜升级！
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontSize: 50,
          marginBottom: 8,
        }}>
          <span>{STAGE_EMOJI[fromStage]}</span>
          <span style={{ fontSize: 24, color: '#FFD700' }}>→</span>
          <span style={{ animation: 'bounceIn 0.5s ease' }}>{STAGE_EMOJI[toStage]}</span>
        </div>

        <div style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#FFD700',
          marginBottom: 6,
        }}>
          {STAGE_NAMES[fromStage]} → {STAGE_NAMES[toStage]}
        </div>

        <div style={{ color: '#aaa', fontSize: 14, marginBottom: 20 }}>
          最大血量提升至 <span style={{ color: '#4CAF50', fontWeight: 700 }}>{newMaxHealth}</span>
          {toStage >= 3 && <span style={{ display: 'block', marginTop: 4 }}>解锁新外观！</span>}
        </div>

        <button
          onClick={onContinue}
          style={{
            padding: '10px 32px',
            fontSize: 16,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF9800, #FF5722)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          继续闯关 →
        </button>
      </div>
    </div>
  );
}
