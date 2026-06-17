'use client';

import { Question, CharacterEmotion } from '@/types';

interface ResultOverlayProps {
  question: Question;
  correct: boolean;
  healthChange: number;
  emotion: CharacterEmotion;
}

export default function ResultOverlay({ question, correct, healthChange, emotion }: ResultOverlayProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: correct ? 'rgba(0,128,0,0.15)' : 'rgba(255,0,0,0.15)',
      backdropFilter: 'blur(4px)',
      borderRadius: 16,
      zIndex: 10,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        fontSize: 60,
        animation: 'bounceIn 0.5s ease',
        marginBottom: 8,
      }}>
        {correct ? '✅' : '❌'}
      </div>

      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color: correct ? '#4CAF50' : '#F44336',
        marginBottom: 8,
      }}>
        {correct ? `+${healthChange}` : `${healthChange}`} HP
      </div>

      <div style={{
        maxWidth: 320,
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13,
        lineHeight: 1.6,
        padding: '0 16px',
      }}>
        {question.explanation}
      </div>
    </div>
  );
}
