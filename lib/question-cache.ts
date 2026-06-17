// lib/question-cache.ts
import { Question } from '@/types';

const cache = new Map<string, { question: Question; createdAt: number }>();

function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `q_${Math.abs(hash).toString(36)}`;
}

export function getCached(textHints: string): Question | null {
  for (const [key, entry] of cache) {
    if (key.includes(textHints)) return entry.question;
  }
  return null;
}

export function addToCache(question: Question): void {
  const key = hashText(question.question);
  if (!cache.has(key)) {
    cache.set(key, { question, createdAt: Date.now() });
  }
  // 限制缓存大小
  if (cache.size > 500) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
    if (oldest) cache.delete(oldest[0]);
  }
}

export function isDuplicate(questionText: string): boolean {
  const key = hashText(questionText);
  return cache.has(key);
}

export function cacheSize(): number {
  return cache.size;
}
