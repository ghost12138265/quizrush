// lib/game-store.ts
import { create } from 'zustand';
import {
  GameState, GameMode, Question, CharacterEmotion,
  AnswerRecord,
} from '@/types';
import {
  INITIAL_HEALTH, HEALTH_GAIN, HEALTH_LOSS, COMBO_BONUS,
  COMBO_THRESHOLD, STAGE_THRESHOLDS,
} from './constants';
import { saveGame, loadSave, clearSave } from './save';

interface GameActions {
  startGame: (mode: GameMode, resumeData?: ReturnType<typeof loadSave>) => void;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  setQuestion: (question: Question) => void;
  appendToQueue: (questions: Question[]) => void;
  endGame: () => void;
  resetGame: () => void;
  autoSave: () => void;
}

export type GameStore = GameState & GameActions;

function getStageForHealth(health: number, currentStage: number): number {
  for (let s = 5; s >= 1; s--) {
    if (health >= STAGE_THRESHOLDS[s].healthRequired) {
      return Math.max(currentStage, s);
    }
  }
  return currentStage;
}

function getMaxHealth(stage: number): number {
  return STAGE_THRESHOLDS[stage]?.maxHealth || 120;
}

export const useGameStore = create<GameStore>((set, get) => ({
  mode: 'level',
  health: INITIAL_HEALTH,
  maxHealth: getMaxHealth(1),
  score: 0,
  combo: 0,
  stage: 1,
  currentQuestion: null,
  questionQueue: [],
  history: [],
  status: 'idle',
  emotion: 'normal',
  highScore: 0,

  startGame: (mode, resumeData) => {
    if (resumeData) {
      set({
        mode: resumeData.mode,
        health: resumeData.health,
        maxHealth: resumeData.maxHealth,
        score: resumeData.score,
        combo: 0,
        stage: resumeData.stage,
        currentQuestion: null,
        questionQueue: [],
        history: resumeData.history,
        status: 'playing',
        emotion: 'normal',
        highScore: resumeData.highScore,
      });
    } else {
      clearSave();
      set({
        mode,
        health: INITIAL_HEALTH,
        maxHealth: getMaxHealth(1),
        score: 0,
        combo: 0,
        stage: 1,
        currentQuestion: null,
        questionQueue: [],
        history: [],
        status: 'playing',
        emotion: 'normal',
        highScore: get().highScore,
      });
    }
  },

  selectAnswer: (answer: string) => {
    const state = get();
    if (state.status !== 'playing' || !state.currentQuestion) return;

    set({ status: 'answering' });

    const correct = answer === state.currentQuestion.answer;
    const newCombo = correct ? state.combo + 1 : 0;
    let healthChange = correct ? HEALTH_GAIN : -HEALTH_LOSS;

    // 连击奖励
    if (correct && newCombo > 0 && newCombo % COMBO_THRESHOLD === 0) {
      healthChange += COMBO_BONUS;
    }

    const newHealth = Math.max(0, state.health + healthChange);
    const newScore = correct ? state.score + 1 : state.score;
    const newStage = getStageForHealth(newHealth, state.stage);
    const newMaxHealth = getMaxHealth(newStage);

    const record: AnswerRecord = {
      questionId: state.currentQuestion.id,
      selectedAnswer: answer,
      correct,
      timestamp: Date.now(),
    };

    const newHighScore = Math.max(state.highScore, newScore);

    set({
      health: newHealth,
      maxHealth: newMaxHealth,
      score: newScore,
      combo: newCombo,
      stage: newStage,
      history: [...state.history, record],
      emotion: correct ? 'happy' : 'hurt',
      highScore: newHighScore,
    });
  },

  nextQuestion: () => {
    const state = get();
    if (state.health <= 0) {
      set({ status: 'gameover', emotion: 'dead' });
      return;
    }

    const next = state.questionQueue[0];
    if (next) {
      set({
        currentQuestion: next,
        questionQueue: state.questionQueue.slice(1),
        status: 'playing',
        emotion: 'normal',
      });
    } else {
      set({ status: 'playing', emotion: 'normal', currentQuestion: null });
    }
  },

  setQuestion: (question) => {
    set({ currentQuestion: question, status: 'playing' });
  },

  appendToQueue: (questions) => {
    set(state => ({
      questionQueue: [...state.questionQueue, ...questions],
    }));
  },

  endGame: () => {
    set({ status: 'gameover', emotion: 'dead' });
    get().autoSave();
  },

  resetGame: () => {
    clearSave();
    set({
      health: INITIAL_HEALTH,
      maxHealth: getMaxHealth(1),
      score: 0,
      combo: 0,
      stage: 1,
      currentQuestion: null,
      questionQueue: [],
      history: [],
      status: 'idle',
      emotion: 'normal',
    });
  },

  autoSave: () => {
    const s = get();
    saveGame(
      s.mode,
      s.health,
      s.maxHealth,
      s.score,
      s.stage,
      s.highScore,
      s.history,
    );
  },
}));
