'use client';

import { STAGE_NAMES } from '@/types';

interface GameOverScreenProps {
  score: number;
  stage: number;
  mode: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverScreen({ score, stage, mode, onRestart, onMainMenu }: GameOverScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0000 0%, #0d0d1a 100%)',
        borderRadius: 20,
        padding: '36px 44px',
        textAlign: 'center',
        border: '2px solid #F44336',
        maxWidth: 360,
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>💔</div>
        <div style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#F44336',
          marginBottom: 16,
        }}>
          {mode === 'level' ? '闯关失败' : '游戏结束'}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>
            本次成绩
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD700' }}>{score}</div>
              <div style={{ fontSize: 11, color: '#888' }}>答对题数</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4FC3F7' }}>{STAGE_NAMES[stage]}</div>
              <div style={{ fontSize: 11, color: '#888' }}>最终阶位</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRestart}
            style={{
              padding: '12px',
              fontSize: 16,
              fontWeight: 700,
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMainMenu}
            style={{
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              background: 'transparent',
              color: '#aaa',
              border: '1px solid #444',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            🏠 返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
