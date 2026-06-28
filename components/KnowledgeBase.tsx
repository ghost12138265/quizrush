'use client';

import { useState, useMemo } from 'react';
import knowledgeData from '@/data/knowledge';
import { KnowledgeEntry, KnowledgeCategory } from '@/types';
import { KNOWLEDGE_CATEGORIES, CATEGORY_INFO } from '@/lib/constants';
import KnowledgeCard from './KnowledgeCard';
import KnowledgeModal from './KnowledgeModal';

interface KnowledgeBaseProps {
  onBack: () => void;
}

export default function KnowledgeBase({ onBack }: KnowledgeBaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  const filteredEntries = useMemo(() => {
    let entries = knowledgeData;

    if (selectedCategory !== 'all') {
      entries = entries.filter(e => e.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      entries = entries.filter(
        e => e.title.includes(q) || e.content.includes(q),
      );
    }

    return entries;
  }, [selectedCategory, searchQuery]);

  return (
    <div style={{
      maxWidth: 420,
      margin: '0 auto',
      minHeight: '100vh',
      padding: '16px 16px 32px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 顶部栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: '#888',
            border: '1px solid #444',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ← 返回
        </button>
        <h1 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: '#fff',
        }}>
          📚 知识库
        </h1>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#1e1e2e',
          borderRadius: 12,
          padding: '10px 14px',
          border: '1px solid #333',
        }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索知识…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f0f0f0',
              fontSize: 14,
              minWidth: 0,
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#888',
                cursor: 'pointer',
                fontSize: 16,
                padding: '2px 6px',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 分类标签 */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        overflowX: 'auto',
        paddingBottom: 4,
        flexWrap: 'nowrap',
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            background: selectedCategory === 'all' ? '#666' : '#2a2a3e',
            color: selectedCategory === 'all' ? '#fff' : '#888',
          }}
        >
          全部
        </button>
        {KNOWLEDGE_CATEGORIES.map(cat => {
          const info = CATEGORY_INFO[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                border: isActive ? `2px solid ${info.color}` : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: isActive ? `${info.color}22` : '#2a2a3e',
                color: isActive ? info.color : '#888',
              }}
            >
              {info.emoji} {info.label}
            </button>
          );
        })}
      </div>

      {/* 结果计数 */}
      <div style={{
        fontSize: 12,
        color: '#666',
        marginBottom: 12,
      }}>
        共 {filteredEntries.length} 条结果
      </div>

      {/* 结果列表 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        flex: 1,
      }}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              onClick={(e) => setSelectedEntry(e)}
              index={index}
            />
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#666',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 15, marginBottom: 4 }}>暂无匹配结果</div>
            <div style={{ fontSize: 13, color: '#555' }}>
              试试其他关键词或切换分类
            </div>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div style={{
        textAlign: 'center',
        marginTop: 20,
        fontSize: 11,
        color: '#555',
        lineHeight: 1.6,
      }}>
        知识来源于权威机构公开信息，仅供参考
      </div>

      {/* 详情弹窗 */}
      {selectedEntry && (
        <KnowledgeModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
