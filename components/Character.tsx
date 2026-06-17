'use client';

import { CharacterEmotion } from '@/types';

interface CharacterProps {
  stage: number;
  emotion: CharacterEmotion;
  animating: boolean;
}

const HAT_COLORS = ['', '#FF9800', '#2196F3', '#9C27B0', '#FFD700', '#FFD700'];
const CAPE_COLORS = ['', '', '', '#E91E63', '#FF5722', '#FF5722'];

export default function Character({ stage, emotion, animating }: CharacterProps) {
  const faceMap: Record<CharacterEmotion, string> = {
    normal: '😶',
    happy: '😊',
    hurt: '😢',
    levelup: '🤩',
    dead: '😵',
  };

  const animClass = animating ? `anim-${emotion}` : 'anim-idle';

  return (
    <div className={`character-container ${animClass}`} style={{ position: 'relative', display: 'inline-block' }}>
      {stage >= 2 && (
        <div className="character-hat" style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 32,
          height: 16,
          background: HAT_COLORS[stage],
          borderRadius: '4px 4px 0 0',
          borderBottom: `3px solid ${HAT_COLORS[stage]}`,
        }} />
      )}

      <div className="character-body" style={{
        width: 60,
        height: 80,
        background: 'linear-gradient(180deg, #FFDDBB 0%, #FFDDBB 40%, #4CAF50 40%, #4CAF50 60%, #3F51B5 60%, #3F51B5 100%)',
        borderRadius: '12px 12px 8px 8px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #333',
        transition: 'all 0.3s ease',
      }}>
        <div style={{
          fontSize: 28,
          marginTop: -8,
          transition: 'transform 0.3s ease',
        }}>
          {faceMap[emotion]}
        </div>

        {stage >= 3 && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: -8,
            width: 76,
            height: 30,
            background: CAPE_COLORS[stage],
            borderRadius: '0 0 50% 50%',
            opacity: 0.7,
            zIndex: -1,
          }} />
        )}

        {stage >= 4 && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 14,
            background: 'linear-gradient(45deg, #FFD700, #FF6B6B, #4FC3F7, #FFD700)',
            backgroundSize: '300% 300%',
            animation: 'shimmer 2s ease-in-out infinite',
            zIndex: -2,
            opacity: 0.5,
          }} />
        )}

        {stage >= 5 && (
          <div style={{
            position: 'absolute',
            top: -26,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 24,
            lineHeight: 1,
          }}>
            👑
          </div>
        )}
      </div>

      <div style={{
        width: 40,
        height: 6,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50%',
        margin: '4px auto 0',
      }} />
    </div>
  );
}
