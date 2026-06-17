'use client';

import { Question } from '@/types';
import OptionButton from './OptionButton';
import { SELECT_HIGHLIGHT_MS } from '@/lib/constants';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  answerState: Record<string, 'default' | 'selected' | 'correct' | 'wrong'>;
  disabled: boolean;
  onSelect: (label: string) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  answerState,
  disabled,
  onSelect,
}: QuestionCardProps) {
  const labels = ['A', 'B', 'C', 'D'] as const;
  const difficultyStars = '★'.repeat(question.difficulty) + '☆'.repeat(5 - question.difficulty);

  return (
    <div style={{
      animation: 'fadeInUp 0.4s ease',
    }}>
      <div style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 6,
        background: 'rgba(255,152,0,0.2)',
        color: '#FF9800',
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 10,
      }}>
        难度 {difficultyStars}
      </div>

      <div style={{
        background: '#1e1e2e',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 16,
        border: '1px solid #333',
      }}>
        <p style={{
          margin: 0,
          fontSize: 16,
          lineHeight: 1.7,
          color: '#f0f0f0',
        }}>
          {question.question}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {labels.map(label => (
          <OptionButton
            key={label}
            label={label}
            text={question.options[labels.indexOf(label)]}
            onClick={() => onSelect(label)}
            disabled={disabled}
            state={answerState[label] || 'default'}
          />
        ))}
      </div>
    </div>
  );
}
