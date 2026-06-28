'use client';

import { useState } from 'react';
import { loadSave } from '@/lib/save';
import { AnswerRecord } from '@/types';

interface WrongBookProps {
  onBack: () => void;
}

const LABEL_MAP: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

export default function WrongBook({ onBack }: WrongBookProps) {
  const save = typeof window !== 'undefined' ? loadSave() : null;
  const wrongAnswers = (save?.history || []).filter(r => !r.correct);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: '0 auto',
      minHeight: '100vh',
      padding: '16px 16px 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
      }}>
        <button onClick={onBack} style={{
          padding: '6px 12px', background: 'transparent', color: '#888',
          border: '1px solid #444', borderRadius: 8, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          ← 返回
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>
          📝 错题本
        </h1>
        {wrongAnswers.length > 0 && (
          <span style={{ color: '#888', fontSize: 13, marginLeft: 'auto' }}>
            {wrongAnswers.length} 题
          </span>
        )}
      </div>

      {wrongAnswers.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: '#666', textAlign: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <div style={{ fontSize: 16 }}>暂无错题</div>
          <div style={{ fontSize: 13, color: '#555' }}>继续保持！</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {wrongAnswers.map((record, index) => {
            const isOpen = expanded.has(record.questionId);
            const correctIdx = LABEL_MAP[record.correctAnswer] ?? 0;
            const userIdx = LABEL_MAP[record.selectedAnswer] ?? 0;

            return (
              <div
                key={record.questionId}
                onClick={() => toggle(record.questionId)}
                style={{
                  background: '#1e1e2e',
                  borderRadius: 12,
                  padding: '14px 16px',
                  border: isOpen ? '1px solid #F44336' : '1px solid #333',
                  cursor: 'pointer',
                  animation: `fadeInUp 0.3s ease ${index * 60}ms both`,
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* 标题行 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 11, color: '#F44336', fontWeight: 700,
                    background: 'rgba(244,67,54,0.15)', padding: '2px 8px', borderRadius: 4,
                  }}>
                    答错
                  </span>
                  <span style={{ fontSize: 12, color: '#888' }}>
                    {new Date(record.timestamp).toLocaleString('zh-CN')}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: '#666' }}>
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>

                {/* 题目 */}
                <div style={{
                  fontSize: 14, color: '#e0e0e0', lineHeight: 1.6, marginBottom: 8,
                }}>
                  {record.questionText || '（题目已过期）'}
                </div>

                {/* 选项 */}
                {record.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 4 }}>
                    {record.options.map((opt, i) => {
                      const isCorrect = i === correctIdx;
                      const isUser = i === userIdx;
                      return (
                        <span key={i} style={{
                          fontSize: 12, padding: '4px 10px', borderRadius: 6,
                          background: isCorrect ? 'rgba(76,175,80,0.15)' : isUser ? 'rgba(244,67,54,0.12)' : 'transparent',
                          color: isCorrect ? '#4CAF50' : isUser ? '#F44336' : '#888',
                          fontWeight: isCorrect || isUser ? 600 : 400,
                        }}>
                          {isCorrect && '✅ '}{isUser && !isCorrect && '❌ '}
                          {opt}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* 展开详情 */}
                {isOpen && (
                  <div style={{
                    marginTop: 10, padding: '12px 14px',
                    background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                    animation: 'fadeIn 0.2s ease',
                  }}>
                    <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>
                      📖 解析
                    </div>
                    <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7 }}>
                      {record.explanation || '暂无解析'}
                    </div>
                    <div style={{
                      marginTop: 8, fontSize: 12, color: '#4CAF50', fontWeight: 600,
                    }}>
                      正确答案：{record.correctAnswer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button onClick={onBack} style={{
        marginTop: 20, padding: '10px', background: '#555', color: '#fff',
        border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
      }}>
        返回主菜单
      </button>
    </div>
  );
}
