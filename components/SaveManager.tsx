'use client';

import { useState } from 'react';
import { exportSave, importSave } from '@/lib/save';

interface SaveManagerProps {
  onClose: () => void;
}

export default function SaveManager({ onClose }: SaveManagerProps) {
  const [message, setMessage] = useState('');

  const handleExport = () => {
    const data = exportSave();
    if (!data) {
      setMessage('没有存档可导出');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quizrush_save_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('存档已导出');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const success = importSave(reader.result as string);
        setMessage(success ? '存档已导入，刷新页面后可继续' : '导入失败：存档格式不正确');
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      zIndex: 200,
    }}>
      <div style={{
        background: '#1a1a2e',
        borderRadius: 16,
        padding: '28px 32px',
        textAlign: 'center',
        border: '1px solid #444',
        minWidth: 280,
      }}>
        <h3 style={{ margin: '0 0 20px', color: '#fff', fontSize: 18 }}>💾 存档管理</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={handleExport} style={{
            padding: '10px',
            fontSize: 14,
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
          }}>
            📤 导出存档
          </button>
          <button onClick={handleImport} style={{
            padding: '10px',
            fontSize: 14,
            background: '#FF9800',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
          }}>
            📥 导入存档
          </button>
          <button onClick={onClose} style={{
            padding: '10px',
            fontSize: 14,
            background: 'transparent',
            color: '#aaa',
            border: '1px solid #444',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 600,
          }}>
            关闭
          </button>
        </div>

        {message && (
          <p style={{ marginTop: 12, color: '#4FC3F7', fontSize: 13 }}>{message}</p>
        )}
      </div>
    </div>
  );
}
