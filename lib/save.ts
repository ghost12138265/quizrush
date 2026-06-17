// lib/save.ts
import { SaveData, GameMode, AnswerRecord } from '@/types';
import { SAVE_KEY, SAVE_VERSION, INITIAL_HEALTH } from './constants';

export function hasSave(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function loadSave(): SaveData | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const data: SaveData = JSON.parse(raw);
    if (data.version !== SAVE_VERSION) {
      // 版本不匹配，清除旧存档
      clearSave();
      return null;
    }
    return data;
  } catch {
    clearSave();
    return null;
  }
}

export function saveGame(
  mode: GameMode,
  health: number,
  maxHealth: number,
  score: number,
  stage: number,
  highScore: number,
  history: AnswerRecord[],
): void {
  if (typeof window === 'undefined') return;
  const data: SaveData = {
    mode,
    health,
    maxHealth,
    score,
    stage,
    highScore,
    history,
    savedAt: new Date().toISOString(),
    version: SAVE_VERSION,
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function clearSave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SAVE_KEY);
}

export function exportSave(): string | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SAVE_KEY);
  return raw;
}

export function importSave(jsonStr: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const data: SaveData = JSON.parse(jsonStr);
    if (data.version !== SAVE_VERSION) return false;
    if (typeof data.health !== 'number' || typeof data.stage !== 'number') return false;
    localStorage.setItem(SAVE_KEY, jsonStr);
    return true;
  } catch {
    return false;
  }
}

export function getInitialHealth(stage: number): number {
  return INITIAL_HEALTH;
}
