// lib/question-cache.ts
import { Question } from '@/types';
import fs from 'fs';
import path from 'path';

const cache = new Map<string, { question: Question; createdAt: number }>();

const PERSIST_FILE = path.join(process.cwd(), 'data', 'questions.json');
const MAX_CACHE_SIZE = 500;

// 持久化题库（从磁盘加载）
let persistentBank: Question[] = [];
let persistentIds: Set<string> = new Set();

function hashText(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `q_${Math.abs(hash).toString(36)}`;
}

/** 从磁盘加载持久化题目 */
function loadPersistentBank(): void {
  try {
    if (fs.existsSync(PERSIST_FILE)) {
      const raw = fs.readFileSync(PERSIST_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        persistentBank = data;
        persistentIds = new Set(data.map((q: Question) => q.id));
        // 同时加载到内存缓存
        for (const q of data) {
          const key = hashText(q.question);
          if (!cache.has(key)) {
            cache.set(key, { question: q, createdAt: Date.now() });
          }
        }
        console.log(`[题库] 从磁盘加载了 ${persistentBank.length} 道题目`);
      }
    }
  } catch (err) {
    console.error('[题库] 加载持久化题目失败:', err);
  }
}

/** 保存新题目到磁盘 */
function saveToPersistentBank(question: Question): void {
  try {
    // 去重
    if (persistentIds.has(question.id)) return;

    persistentBank.push(question);
    persistentIds.add(question.id);

    // 限制持久化题库大小
    if (persistentBank.length > MAX_CACHE_SIZE) {
      const removed = persistentBank.splice(0, persistentBank.length - MAX_CACHE_SIZE);
      for (const q of removed) {
        persistentIds.delete(q.id);
      }
    }

    // 确保目录存在
    const dir = path.dirname(PERSIST_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(PERSIST_FILE, JSON.stringify(persistentBank, null, 2), 'utf-8');
  } catch (err) {
    console.error('[题库] 保存题目到磁盘失败:', err);
  }
}

export function addToCache(question: Question): void {
  const key = hashText(question.question);
  if (!cache.has(key)) {
    cache.set(key, { question, createdAt: Date.now() });
  }
  // 限制内存缓存大小
  if (cache.size > MAX_CACHE_SIZE) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt)[0];
    if (oldest) cache.delete(oldest[0]);
  }
  // 同时持久化到磁盘
  saveToPersistentBank(question);
}

export function isDuplicate(questionText: string): boolean {
  const key = hashText(questionText);
  if (cache.has(key)) return true;

  // 也检查持久化题库（题目文本匹配）
  for (const q of persistentBank) {
    if (hashText(q.question) === key) return true;
  }
  return false;
}

export function cacheSize(): number {
  return cache.size;
}

export function persistentBankSize(): number {
  return persistentBank.length;
}

/** 从持久化题库中随机获取题目 */
export function getFromPersistentBank(excludeIds: string[] = []): Question | null {
  const excludeSet = new Set(excludeIds);
  const available = persistentBank.filter(q => !excludeSet.has(q.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// 服务启动时自动加载持久化题库
loadPersistentBank();
