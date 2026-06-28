'use client';

import { KnowledgeEntry, KnowledgeCategory } from '@/types';
import { CATEGORY_INFO } from '@/lib/constants';

interface KnowledgeModalProps {
  entry: KnowledgeEntry;
  onClose: () => void;
}

export default function KnowledgeModal({ entry, onClose }: KnowledgeModalProps) {
  const catInfo = CATEGORY_INFO[entry.category as KnowledgeCategory];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        animation: 'fadeIn 0.25s ease',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#1a1a2e',
          borderRadius: 16,
          border: `2px solid ${catInfo.color}`,
          maxWidth: 420,
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 0.3s ease',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 可滚动内容区 */}
        <div style={{
          padding: '24px 24px 16px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {/* 分类标签 */}
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: 'inline-block',
              padding: '3px 12px',
              borderRadius: 8,
              background: `${catInfo.color}22`,
              color: catInfo.color,
              fontSize: 12,
              fontWeight: 600,
            }}>
              {catInfo.emoji} {catInfo.label}
            </span>
          </div>

          {/* 标题 */}
          <h2 style={{
            margin: '0 0 16px',
            fontSize: 18,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.5,
          }}>
            {entry.title}
          </h2>

          {/* 正文 */}
          <div style={{
            fontSize: 14,
            color: '#e0e0e0',
            lineHeight: 1.9,
            marginBottom: 20,
          }}>
            {entry.content}
          </div>

          {/* 分隔线 */}
          <div style={{
            height: 1,
            background: '#333',
            marginBottom: 14,
          }} />

          {/* 来源信息 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            marginBottom: 8,
          }}>
            <div style={{
              fontSize: 12,
              color: '#888',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>📖</span>
              <span>信息来源：{entry.sourceName}</span>
            </div>
            {entry.sourceUrl && (
              <a
                href={entry.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: '#4FC3F7',
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                  marginLeft: 22,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                🔗 {entry.sourceUrl}
              </a>
            )}
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #333',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 24px',
              fontSize: 14,
              fontWeight: 600,
              background: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
