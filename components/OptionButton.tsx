'use client';

interface OptionButtonProps {
  label: string;
  text: string;
  onClick: () => void;
  disabled: boolean;
  state: 'default' | 'selected' | 'correct' | 'wrong';
}

const LABEL_COLORS: Record<string, string> = {
  A: '#F44336', B: '#2196F3', C: '#4CAF50', D: '#FF9800',
};

const STATE_STYLES: Record<string, React.CSSProperties> = {
  default: { background: '#2a2a2a' },
  selected: { background: '#444', borderColor: '#FFD700' },
  correct: { background: '#1B5E20', borderColor: '#4CAF50' },
  wrong: { background: '#4E1515', borderColor: '#F44336' },
};

export default function OptionButton({ label, text, onClick, disabled, state }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${state === 'default' ? '#444' : STATE_STYLES[state].borderColor}`,
        borderRadius: 12,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        color: '#fff',
        fontSize: 15,
        lineHeight: 1.4,
        ...STATE_STYLES[state],
      }}
    >
      <span style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: LABEL_COLORS[label],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
        color: '#fff',
      }}>
        {label}
      </span>
      <span style={{ flex: 1 }}>{text.replace(/^[A-D][.、，]\s*/, '')}</span>
    </button>
  );
}
