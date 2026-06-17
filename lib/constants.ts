// lib/constants.ts

export const INITIAL_HEALTH = 100;
export const HEALTH_GAIN = 10;
export const HEALTH_LOSS = 15;
export const COMBO_BONUS = 5;
export const COMBO_THRESHOLD = 5; // 连续答对 N 题触发额外加分

export const STAGE_THRESHOLDS: Record<number, { title: string; healthRequired: number; maxHealth: number }> = {
  1: { title: '新手', healthRequired: 0, maxHealth: 120 },
  2: { title: '学徒', healthRequired: 120, maxHealth: 150 },
  3: { title: '达人', healthRequired: 150, maxHealth: 200 },
  4: { title: '专家', healthRequired: 200, maxHealth: 300 },
  5: { title: '大师', healthRequired: 300, maxHealth: 500 },
};

export const SAVE_KEY = 'quizrush_save_v1';
export const SAVE_VERSION = 1;

export const PRELOAD_QUEUE_SIZE = 5;

export const ANSWER_DISPLAY_MS = 2000; // 答案展示 2 秒
export const SELECT_HIGHLIGHT_MS = 500; // 选项高亮 0.5 秒

export const QUESTION_TOPICS = [
  '健康养生', '饮食营养', '安全急救', '社交礼仪',
  '理财消费', '环保节能', '科技数码', '法律常识',
];

export const MAX_QUESTIONS_PER_SESSION = 200;
