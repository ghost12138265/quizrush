'use client';

import { useState, useEffect } from 'react';
import { hasSave, loadSave } from '@/lib/save';
import { STAGE_NAMES } from '@/types';
import SaveManager from './SaveManager';
import Character from './Character';

interface MainMenuProps {
  onStart: (mode: 'level' | 'endless', resumeData?: ReturnType<typeof loadSave>) => void;
  onKnowledgeBase: () => void;
  onWrongBook: () => void;
}

export default function MainMenu({ onStart, onKnowledgeBase, onWrongBook }: MainMenuProps) {
  const [saveExists, setSaveExists] = useState(false);
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [savePreview, setSavePreview] = useState<{ stage: number; score: number; mode: string; wrongCount: number } | null>(null);
  const [hasWrongAnswers, setHasWrongAnswers] = useState(false);

  useEffect(() => {
    const exists = hasSave();
    setSaveExists(exists);
    if (exists) {
      const data = loadSave();
      if (data) {
        const wrongCount = data.history?.filter(r => !r.correct).length || 0;
        setHasWrongAnswers(wrongCount > 0);
        setSavePreview({ stage: data.stage, score: data.score, mode: data.mode, wrongCount });
      }
    }
  }, []);

  const handleContinue = () => {
    const data = loadSave();
    if (data) {
      onStart(data.mode as 'level' | 'endless', data);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 24,
      gap: 16,
    }}>
      <Character stage={savePreview?.stage || 1} emotion="normal" animating={false} />

      <h1 style={{
        fontSize: 32,
        fontWeight: 800,
        color: '#fff',
        margin: 0,
        textAlign: 'center',
      }}>
        答题闯关
      </h1>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 8px' }}>
        生活常识 · AI 出题 · 每日挑战
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240 }}>
        <button onClick={() => onStart('level')} style={btnStyle('#4CAF50')}>
          🏰 闯关模式
        </button>
        <button onClick={() => onStart('endless')} style={btnStyle('#2196F3')}>
          ♾️ 无限挑战
        </button>

        {saveExists && savePreview && (
          <button onClick={handleContinue} style={btnStyle('#FF9800')}>
            💾 继续游戏
            <span style={{ display: 'block', fontSize: 11, color: '#ffcc80', marginTop: 2 }}>
              {STAGE_NAMES[savePreview.stage]} · {savePreview.mode === 'level' ? '闯关' : '无限'} · ⭐{savePreview.score}
            </span>
          </button>
        )}

        <button onClick={() => setShowSaveManager(true)} style={btnStyle('#555')}>
          💾 存档管理
        </button>

        <button onClick={onKnowledgeBase} style={btnStyle('#9C27B0')}>
          📚 知识库
        </button>

        {hasWrongAnswers && (
          <button onClick={onWrongBook} style={btnStyle('#F44336')}>
            📝 错题本
            <span style={{ display: 'block', fontSize: 11, color: '#ffccbc', marginTop: 2 }}>
              {savePreview?.wrongCount || 0} 道错题
            </span>
          </button>
        )}
      </div>

      {showSaveManager && (
        <SaveManager onClose={() => {
          setShowSaveManager(false);
          setSaveExists(hasSave());
          const data = loadSave();
          if (data) {
            const wrongCount = data.history?.filter(r => !r.correct).length || 0;
            setHasWrongAnswers(wrongCount > 0);
            setSavePreview({ stage: data.stage, score: data.score, mode: data.mode, wrongCount });
          }
        }} />
      )}
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: 700,
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
    width: '100%',
  };
}
