'use client';

import { KnowledgeEntry, KnowledgeCategory } from '@/types';
import { CATEGORY_INFO } from '@/lib/constants';

interface KnowledgeCardProps {
  entry: KnowledgeEntry;
  onClick: (entry: KnowledgeEntry) => void;
  index: number;
}

export default function KnowledgeCard({ entry, onClick, index }: KnowledgeCardProps) {
  const catInfo = CATEGORY_INFO[entry.category as KnowledgeCategory];
  const excerpt = entry.content.length > 80
    ? entry.content.slice(0, 80) + '…'
    : entry.content;

  return (
    <div
      onClick={() => onClick(entry)}
      style={{
        background: '#1e1e2e',
        borderRadius: 12,
        padding: '14px 16px',
        border: '1px solid #333',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, transform 0.15s ease',
        animation: `fadeInUp 0.35s ease ${index * 50}ms both`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = catInfo.color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#333';
      }}
    >
      {/* 顶部：分类标签 */}
      <div style={{ marginBottom: 8 }}>
        <span style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 6,
          background: `${catInfo.color}22`,
          color: catInfo.color,
          fontSize: 11,
          fontWeight: 600,
        }}>
          {catInfo.emoji} {catInfo.label}
        </span>
      </div>

      {/* 标题 */}
      <h3 style={{
        margin: '0 0 6px',
        fontSize: 15,
        fontWeight: 700,
        color: '#f0f0f0',
        lineHeight: 1.5,
      }}>
        {entry.title}
      </h3>

      {/* 摘要 */}
      <p style={{
        margin: '0 0 8px',
        fontSize: 13,
        color: '#aaa',
        lineHeight: 1.6,
      }}>
        {excerpt}
      </p>

      {/* 来源 */}
      <div style={{
        fontSize: 11,
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <span>📎</span>
        <span>来源：{entry.sourceName}</span>
      </div>
    </div>
  );
}
