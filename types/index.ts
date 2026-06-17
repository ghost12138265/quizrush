// types/index.ts

export type GameMode = 'level' | 'endless';
export type GameStatus = 'idle' | 'playing' | 'answering' | 'result' | 'gameover';
export type CharacterEmotion = 'normal' | 'happy' | 'hurt' | 'levelup' | 'dead';

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  difficulty: number; // 1-5
  explanation: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  timestamp: number;
}

export interface GameState {
  mode: GameMode;
  health: number;
  maxHealth: number;
  score: number;
  combo: number;
  stage: number; // 1-5
  currentQuestion: Question | null;
  questionQueue: Question[];
  history: AnswerRecord[];
  status: GameStatus;
  emotion: CharacterEmotion;
  highScore: number;
}

export interface SaveData {
  mode: GameMode;
  health: number;
  maxHealth: number;
  score: number;
  stage: number;
  highScore: number;
  history: AnswerRecord[];
  savedAt: string;
  version: number;
}

export const STAGE_NAMES: Record<number, string> = {
  1: '新手',
  2: '学徒',
  3: '达人',
  4: '专家',
  5: '大师',
};

export interface GenerateQuestionRequest {
  mode: GameMode;
  stage: number;
  previousQuestionIds: string[];
}

export interface GenerateQuestionResponse {
  question: Question;
  cached: boolean;
}
