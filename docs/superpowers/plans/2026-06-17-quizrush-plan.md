# QuizRush 答题闯关 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建生活常识答题闯关 SPA，含 AI 题目生成、CSS 动画角色、血量升级系统、存档功能。

**Architecture:** Next.js 15 App Router 全栈单体。React 前端 + API Route 后端代理 DeepSeek。Zustand 状态管理，Tailwind CSS 样式，localStorage 持久化。

**Tech Stack:** Next.js 15, React 19, TypeScript, Zustand, Tailwind CSS v4, DeepSeek API

---

### Task 1: 项目脚手架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `.env.local`
- Run: `npm install`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "quizrush",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.0.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: 创建 next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: 创建 postcss.config.mjs**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: 创建 .env.local**

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

- [ ] **Step 6: 安装依赖并验证**

Run: `cd "C:\Users\bushi\Desktop\答题" && npm install`
Expected: 无错误安装完成

- [ ] **Step 7: Commit**

```
git add package.json tsconfig.json next.config.ts postcss.config.mjs .env.local .gitignore package-lock.json
git commit -m "chore: scaffold Next.js project with TypeScript and Tailwind CSS"
```

---

### Task 2: 类型定义

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: 创建类型文件**

```typescript
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
```

- [ ] **Step 2: Commit**

```
git add types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: 游戏常量

**Files:**
- Create: `lib/constants.ts`

- [ ] **Step 1: 创建常量文件**

```typescript
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
```

- [ ] **Step 2: Commit**

```
git add lib/constants.ts
git commit -m "feat: add game constants"
```

---

### Task 4: 兜底题库

**Files:**
- Create: `lib/fallback-questions.ts`

- [ ] **Step 1: 创建 20 道预置题目**

```typescript
// lib/fallback-questions.ts
import { Question } from '@/types';

export const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'fb-01',
    question: '夏天被蚊虫叮咬后，最科学的做法是？',
    options: ['A. 用唾液涂抹止痒', 'B. 用肥皂水清洗后冷敷', 'C. 立即用手抓挠破皮', 'D. 涂抹酱油消毒'],
    answer: 'B',
    difficulty: 2,
    explanation: '肥皂水能中和蚁酸，冷敷可缓解肿胀瘙痒。抓挠会导致感染。',
  },
  {
    id: 'fb-02',
    question: '以下哪种食物最容易导致食物中毒？',
    options: ['A. 未煮熟的四季豆', 'B. 新鲜苹果', 'C. 白米饭', 'D. 煮熟的土豆'],
    answer: 'A',
    difficulty: 2,
    explanation: '未煮熟的四季豆含有皂苷和血球凝集素，食用后会引起恶心、呕吐、腹泻等中毒症状。',
  },
  {
    id: 'fb-03',
    question: '遇到火灾时，正确的逃生方式是？',
    options: ['A. 乘坐电梯快速下楼', 'B. 用湿毛巾捂口鼻弯腰前进', 'C. 躲在衣柜里等待救援', 'D. 打开窗户跳楼逃生'],
    answer: 'B',
    difficulty: 1,
    explanation: '火灾时电梯可能断电，浓烟向上聚集，弯腰并用湿毛巾捂住口鼻可减少吸入有毒烟气。',
  },
  {
    id: 'fb-04',
    question: '每天最佳睡眠时长大约是？',
    options: ['A. 4-5小时', 'B. 7-8小时', 'C. 10-12小时', 'D. 越久越好'],
    answer: 'B',
    difficulty: 1,
    explanation: '成年人每天7-8小时睡眠最有利于身体恢复和大脑功能，过少或过多都不健康。',
  },
  {
    id: 'fb-05',
    question: '银行卡密码设置最安全的是？',
    options: ['A. 生日日期', 'B. 123456', 'C. 无规律随机数字', 'D. 手机号后6位'],
    answer: 'C',
    difficulty: 1,
    explanation: '无规律随机数字最安全。生日、手机号等个人信息容易被别人猜到。',
  },
  {
    id: 'fb-06',
    question: '吃完饭后多久刷牙最合适？',
    options: ['A. 立即刷牙', 'B. 半小时后', 'C. 2小时后', 'D. 饭前刷就行'],
    answer: 'B',
    difficulty: 3,
    explanation: '饭后口腔呈酸性，立即刷牙会损伤牙釉质。建议等半小时口腔酸碱度恢复后再刷。',
  },
  {
    id: 'fb-07',
    question: '哪种做法最能节省家庭用电？',
    options: ['A. 频繁开关灯', 'B. 将空调温度设为26°C', 'C. 电器长期待机', 'D. 冰箱塞满不留空隙'],
    answer: 'B',
    difficulty: 2,
    explanation: '空调设为26°C是最节能的制冷温度。频繁开关反而耗电，电器待机也耗电，冰箱过满影响制冷效率。',
  },
  {
    id: 'fb-08',
    question: '运动时脚崴了（踝关节扭伤），第一时间应该？',
    options: ['A. 热毛巾敷', 'B. 马上按摩揉搓', 'C. 冰敷并抬高', 'D. 继续坚持运动'],
    answer: 'C',
    difficulty: 2,
    explanation: '急性扭伤应遵循RICE原则：休息(Rest)、冰敷(Ice)、加压(Compression)、抬高(Elevation)。24-48小时内忌热敷。',
  },
  {
    id: 'fb-09',
    question: '以下哪种饮用水方式最健康？',
    options: ['A. 只喝纯净水', 'B. 每天喝足量白开水', 'C. 渴了才喝水', 'D. 用饮料代替水'],
    answer: 'B',
    difficulty: 1,
    explanation: '每天喝足量白开水（约1500-2000ml）最健康。纯净水缺乏矿物质，渴了才喝说明已缺水，饮料含糖不宜替代水。',
  },
  {
    id: 'fb-10',
    question: '收到陌生中奖短信链接，应该怎么办？',
    options: ['A. 点击链接查看详情', 'B. 按提示填写个人信息', 'C. 忽略并删除', 'D. 回复短信询问'],
    answer: 'C',
    difficulty: 1,
    explanation: '陌生中奖短信多为诈骗，点击链接可能泄露信息或感染病毒。应直接忽略删除。',
  },
  {
    id: 'fb-11',
    question: '使用微波炉加热食物，哪种容器最安全？',
    options: ['A. 金属碗', 'B. 普通塑料袋', 'C. 陶瓷碗', 'D. 一次性泡沫餐盒'],
    answer: 'C',
    difficulty: 2,
    explanation: '陶瓷碗安全。金属会引发火花，普通塑料和泡沫加热会释放有毒物质，需用微波炉专用容器。',
  },
  {
    id: 'fb-12',
    question: '垃圾分类中，过期药品属于哪类？',
    options: ['A. 可回收物', 'B. 厨余垃圾', 'C. 有害垃圾', 'D. 其他垃圾'],
    answer: 'C',
    difficulty: 2,
    explanation: '过期药品含有害化学成分，属于有害垃圾，不能随意丢弃以免污染环境。',
  },
  {
    id: 'fb-13',
    question: '电脑突然蓝屏，最应该先做什么？',
    options: ['A. 狂按键盘恢复', 'B. 记下错误代码后重启', 'C. 立刻拔电源', 'D. 拍打电脑主机'],
    answer: 'B',
    difficulty: 2,
    explanation: '记下蓝屏错误代码有助于诊断问题。直接拔电源可能损坏硬盘，应正常重启。',
  },
  {
    id: 'fb-14',
    question: '以下哪种做法最容易伤胃？',
    options: ['A. 少量多餐', 'B. 长期不吃早餐', 'C. 细嚼慢咽', 'D. 饭后散步'],
    answer: 'B',
    difficulty: 2,
    explanation: '长期不吃早餐会导致胃酸直接侵蚀胃黏膜，是胃炎、胃溃疡的重要诱因。',
  },
  {
    id: 'fb-15',
    question: '乘坐网约车时，为了安全应该？',
    options: ['A. 上车前不核对车牌', 'B. 将行程信息分享给亲友', 'C. 坐副驾驶位', 'D. 上车后关闭手机'],
    answer: 'B',
    difficulty: 1,
    explanation: '将行程分享给亲友是最重要的安全习惯。同时应核对车牌、坐后排并保持手机畅通。',
  },
  {
    id: 'fb-16',
    question: '哪种食品保存方法不科学？',
    options: ['A. 肉类冷冻保存', 'B. 剩菜趁热放入冰箱', 'C. 干货密封保存', 'D. 绿叶菜冷藏保存'],
    answer: 'B',
    difficulty: 3,
    explanation: '剩菜应放凉后(不超2小时)再进冰箱。热菜直接放入会升高冰箱温度，影响其他食物保鲜，也增加能耗。',
  },
  {
    id: 'fb-17',
    question: '面试时以下哪种行为最加分？',
    options: ['A. 迟到以显忙碌', 'B. 对前公司大肆批评', 'C. 提前了解公司背景并提问', 'D. 薪资要求越高越好'],
    answer: 'C',
    difficulty: 2,
    explanation: '提前了解公司背景并准备有深度的问题，展现诚意和职业素养，是面试加分项。',
  },
  {
    id: 'fb-18',
    question: '长期使用耳机对听力有损害，正确的做法是？',
    options: ['A. 音量开最大沉浸体验', 'B. 遵循60-60原则', 'C. 睡觉也戴着耳机', 'D. 只用一只耳朵听'],
    answer: 'B',
    difficulty: 2,
    explanation: '60-60原则：音量不超过最大音量的60%，每次使用不超过60分钟。能有效保护听力。',
  },
  {
    id: 'fb-19',
    question: '网上购物收到瑕疵商品，首先该怎么做？',
    options: ['A. 直接给差评', 'B. 拍照留证后联系卖家', 'C. 自行修理', 'D. 扔掉重买'],
    answer: 'B',
    difficulty: 1,
    explanation: '拍照留证后联系卖家协商退换或补偿。如卖家不配合，可申请平台介入或12315投诉。',
  },
  {
    id: 'fb-20',
    question: '哪种天气最适合户外运动？',
    options: ['A. 大雾霾天', 'B. 雷暴天气', 'C. 晴天气温适宜', 'D. 大风沙尘天'],
    answer: 'C',
    difficulty: 1,
    explanation: '晴朗、气温适宜、空气质量好的天气最适合户外运动。雾霾天伤肺，雷暴天危险，大风天容易着凉。',
  },
];
```

- [ ] **Step 2: Commit**

```
git add lib/fallback-questions.ts
git commit -m "feat: add 20 fallback questions for AI failure"
```

---

### Task 5: 存档逻辑

**Files:**
- Create: `lib/save.ts`

- [ ] **Step 1: 创建存档模块**

```typescript
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
```

- [ ] **Step 2: Commit**

```
git add lib/save.ts
git commit -m "feat: add save/load/export/import logic"
```

---

### Task 6: 题目缓存（服务端）

**Files:**
- Create: `lib/question-cache.ts`

- [ ] **Step 1: 创建服务端缓存**

```typescript
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
```

- [ ] **Step 2: Commit**

```
git add lib/question-cache.ts
git commit -m "feat: add server-side question cache with dedup"
```

---

### Task 7: AI 题目生成 API

**Files:**
- Create: `app/api/generate-question/route.ts`
- Modify: `lib/question-cache.ts` (已有)

- [ ] **Step 1: 创建 API Route**

```typescript
// app/api/generate-question/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GenerateQuestionRequest, GenerateQuestionResponse, Question } from '@/types';
import { addToCache, isDuplicate } from '@/lib/question-cache';
import { FALLBACK_QUESTIONS } from '@/lib/fallback-questions';

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

const SYSTEM_PROMPT = `你是生活常识题库专家。为用户生成一道关于生活常识的单选题。

要求：
1. 题目贴近日常生活（健康、饮食、安全、社交、理财、环保、科技等领域）
2. 四个选项（A/B/C/D），只有一个正确答案
3. 答案必须准确、有科学依据
4. 选项之间互斥，表述清晰
5. 提供简短的解释说明（为什么正确）
6. 难度1-5：1最简单5最难

严格按以下JSON格式输出（不要输出其他内容）：
{"question":"题目内容","options":["A. 选项A","B. 选项B","C. 选项C","D. 选项D"],"answer":"A","difficulty":3,"explanation":"解释说明"}`;

function buildUserPrompt(mode: string, stage: number, previousIds: string[]): string {
  const difficulty = mode === 'level'
    ? Math.min(stage, 5)  // 闯关模式：难度随阶位
    : Math.ceil(Math.random() * 5); // 无限模式：随机难度

  let prompt = `请生成一道难度为${difficulty}的生活常识单选题。`;
  if (previousIds.length > 0) {
    prompt += `\n请不要与以下已出题目重复（题号参考）：${previousIds.slice(-10).join(', ')}`;
  }
  return prompt;
}

function tryParseQuestion(raw: string): Question | null {
  try {
    // 尝试直接解析 JSON
    const trimmed = raw.trim();
    // 去除可能的 markdown 代码块标记
    const cleaned = trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    if (
      typeof parsed.question !== 'string' ||
      !Array.isArray(parsed.options) ||
      parsed.options.length !== 4 ||
      typeof parsed.answer !== 'string' ||
      !['A', 'B', 'C', 'D'].includes(parsed.answer) ||
      typeof parsed.difficulty !== 'number'
    ) {
      return null;
    }

    return {
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      question: parsed.question,
      options: parsed.options as [string, string, string, string],
      answer: parsed.answer,
      difficulty: Math.max(1, Math.min(5, Math.round(parsed.difficulty))),
      explanation: parsed.explanation || '请查看正确答案。',
    };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateQuestionRequest = await request.json();
    const { mode, stage, previousQuestionIds } = body;

    // 尝试调用 DeepSeek
    let question: Question | null = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!question && attempts < maxAttempts) {
      attempts++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const resp = await fetch(`${DEEPSEEK_BASE_URL}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: buildUserPrompt(mode, stage, previousQuestionIds) },
            ],
            temperature: 0.8,
            max_tokens: 800,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (resp.ok) {
          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content || '';
          const parsed = tryParseQuestion(content);
          if (parsed && !isDuplicate(parsed.question)) {
            question = parsed;
            addToCache(question);
          }
        }
      } catch {
        // 重试
      }
    }

    // AI 生成失败，使用兜底题库
    if (!question) {
      const usedIds = new Set(previousQuestionIds);
      const available = FALLBACK_QUESTIONS.filter(q => !usedIds.has(q.id));
      if (available.length > 0) {
        question = available[Math.floor(Math.random() * available.length)];
      } else {
        // 全部用完，随机出一道
        question = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      }
    }

    const response: GenerateQuestionResponse = {
      question,
      cached: false,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: '生成题目失败' },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Commit**

```
git add app/api/generate-question/route.ts
git commit -m "feat: add AI question generation API route with DeepSeek"
```

---

### Task 8: Zustand 游戏状态

**Files:**
- Create: `lib/game-store.ts`

- [ ] **Step 1: 创建 Zustand Store**

```typescript
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
import { saveGame, loadSave, clearSave, hasSave } from './save';

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
      return Math.max(currentStage, s); // 不会降级
    }
  }
  return currentStage;
}

function getMaxHealth(stage: number): number {
  return STAGE_THRESHOLDS[stage]?.maxHealth || 120;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 初始状态
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
```

- [ ] **Step 2: Commit**

```
git add lib/game-store.ts
git commit -m "feat: add Zustand game store with all rules"
```

---

### Task 9: AI 客户端（前端）

**Files:**
- Create: `lib/ai.ts`

- [ ] **Step 1: 创建前端 AI 调用模块**

```typescript
// lib/ai.ts
import { GenerateQuestionRequest, GenerateQuestionResponse, Question } from '@/types';

export async function fetchQuestion(
  mode: string,
  stage: number,
  previousIds: string[],
): Promise<Question> {
  const body: GenerateQuestionRequest = {
    mode: mode as 'level' | 'endless',
    stage,
    previousQuestionIds: previousIds,
  };

  const resp = await fetch('/api/generate-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new Error(`生成题目失败: ${resp.status}`);
  }

  const data: GenerateQuestionResponse = await resp.json();
  return data.question;
}

export async function preloadQueue(
  mode: string,
  stage: number,
  previousIds: string[],
  count: number,
): Promise<Question[]> {
  const questions: Question[] = [];
  const usedIds = [...previousIds];

  for (let i = 0; i < count; i++) {
    try {
      const q = await fetchQuestion(mode, stage, usedIds);
      questions.push(q);
      usedIds.push(q.id);
    } catch {
      break; // 失败时返回已有的部分
    }
  }

  return questions;
}
```

- [ ] **Step 2: Commit**

```
git add lib/ai.ts
git commit -m "feat: add frontend AI client to call question API"
```

---

### Task 10: Character 角色组件

**Files:**
- Create: `components/Character.tsx`

- [ ] **Step 1: 创建 CSS 卡通角色**

```tsx
'use client';

import { CharacterEmotion } from '@/types';

interface CharacterProps {
  stage: number;   // 1-5
  emotion: CharacterEmotion;
  animating: boolean;
}

const HAT_COLORS = ['', '#FF9800', '#2196F3', '#9C27B0', '#FFD700'];
const CAPE_COLORS = ['', '', '', '#E91E63', '#FF5722'];

export default function Character({ stage, emotion, animating }: CharacterProps) {
  const faceMap: Record<CharacterEmotion, string> = {
    normal: '😶',
    happy: '😊',
    hurt: '😢',
    levelup: '🤩',
    dead: '😵',
  };

  const animClass = animating ? `anim-${emotion}` : 'anim-idle';

  return (
    <div className={`character-container ${animClass}`} style={{ position: 'relative', display: 'inline-block' }}>
      {/* 阶段外观配件 */}
      {stage >= 2 && (
        <div className="character-hat" style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 32,
          height: 16,
          background: HAT_COLORS[stage],
          borderRadius: '4px 4px 0 0',
          borderBottom: `3px solid ${HAT_COLORS[stage]}`,
        }} />
      )}

      {/* 身体 */}
      <div className="character-body" style={{
        width: 60,
        height: 80,
        background: 'linear-gradient(180deg, #FFDDBB 0%, #FFDDBB 40%, #4CAF50 40%, #4CAF50 60%, #3F51B5 60%, #3F51B5 100%)',
        borderRadius: '12px 12px 8px 8px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #333',
        transition: 'all 0.3s ease',
      }}>
        {/* 脸部 */}
        <div style={{
          fontSize: 28,
          marginTop: -8,
          transition: 'transform 0.3s ease',
        }}>
          {faceMap[emotion]}
        </div>

        {/* 披风 (stage 3+) */}
        {stage >= 3 && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            left: -8,
            width: 76,
            height: 30,
            background: CAPE_COLORS[stage],
            borderRadius: '0 0 50% 50%',
            opacity: 0.7,
            zIndex: -1,
          }} />
        )}

        {/* 光效 (stage 4+) */}
        {stage >= 4 && (
          <div style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 14,
            background: 'linear-gradient(45deg, #FFD700, #FF6B6B, #4FC3F7, #FFD700)',
            backgroundSize: '300% 300%',
            animation: 'shimmer 2s ease-in-out infinite',
            zIndex: -2,
            opacity: 0.5,
          }} />
        )}

        {/* 王冠 (stage 5) */}
        {stage >= 5 && (
          <div style={{
            position: 'absolute',
            top: -26,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 24,
            lineHeight: 1,
          }}>
            👑
          </div>
        )}
      </div>

      {/* 影子 */}
      <div style={{
        width: 40,
        height: 6,
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '50%',
        margin: '4px auto 0',
      }} />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/Character.tsx
git commit -m "feat: add CSS character component with stage accessories"
```

---

### Task 11: HealthBar 血量条

**Files:**
- Create: `components/HealthBar.tsx`

- [ ] **Step 1: 创建血量条组件**

```tsx
'use client';

import { STAGE_NAMES } from '@/types';

interface HealthBarProps {
  health: number;
  maxHealth: number;
  stage: number;
  score: number;
}

export default function HealthBar({ health, maxHealth, stage, score }: HealthBarProps) {
  const pct = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  const barColor = pct > 50 ? '#4CAF50' : pct > 25 ? '#FF9800' : '#F44336';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 14px',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: 12,
      backdropFilter: 'blur(8px)',
    }}>
      {/* 阶位标签 */}
      <span style={{
        background: '#FFD700',
        color: '#000',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        {STAGE_NAMES[stage]}
      </span>

      {/* 血量条 */}
      <div style={{
        flex: 1,
        minWidth: 100,
        height: 14,
        background: '#333',
        borderRadius: 7,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: barColor,
          borderRadius: 7,
          transition: 'width 0.5s ease, background 0.5s ease',
        }} />
        <span style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
          textShadow: '1px 1px 2px #000',
        }}>
          {health} / {maxHealth}
        </span>
      </div>

      {/* 分数 */}
      <span style={{ fontWeight: 700, fontSize: 14, color: '#FFD700' }}>
        ⭐ {score}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/HealthBar.tsx
git commit -m "feat: add HealthBar component with color transitions"
```

---

### Task 12: QuestionCard + OptionButton 题目组件

**Files:**
- Create: `components/QuestionCard.tsx`
- Create: `components/OptionButton.tsx`

- [ ] **Step 1: 创建 OptionButton**

```tsx
// components/OptionButton.tsx
'use client';

interface OptionButtonProps {
  label: string;       // "A", "B", "C", "D"
  text: string;        // 完整选项文本
  onClick: () => void;
  disabled: boolean;
  state: 'default' | 'selected' | 'correct' | 'wrong';
}

const LABEL_COLORS: Record<string, string> = {
  A: '#F44336', B: '#2196F3', C: '#4CAF50', D: '#FF9800',
};

const STATE_STYLES: Record<string, React.CSSProperties> = {
  default: { background: '#2a2a2a' },
  selected: { background: '#444', borderColor: '#FFD700' },
  correct: { background: '#1B5E20', borderColor: '#4CAF50' },
  wrong: { background: '#4E1515', borderColor: '#F44336' },
};

export default function OptionButton({ label, text, onClick, disabled, state }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        border: `2px solid ${state === 'default' ? '#444' : STATE_STYLES[state].borderColor}`,
        borderRadius: 12,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        color: '#fff',
        fontSize: 15,
        lineHeight: 1.4,
        ...STATE_STYLES[state],
      }}
    >
      <span style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        background: LABEL_COLORS[label],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        flexShrink: 0,
        color: '#fff',
      }}>
        {label}
      </span>
      <span style={{ flex: 1 }}>{text.replace(/^[A-D][.、，]\s*/, '')}</span>
    </button>
  );
}
```

- [ ] **Step 2: 创建 QuestionCard**

```tsx
// components/QuestionCard.tsx
'use client';

import { Question } from '@/types';
import OptionButton from './OptionButton';
import { SELECT_HIGHLIGHT_MS } from '@/lib/constants';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | null;
  answerState: Record<string, 'default' | 'selected' | 'correct' | 'wrong'>;
  disabled: boolean;
  onSelect: (label: string) => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  answerState,
  disabled,
  onSelect,
}: QuestionCardProps) {
  const labels = ['A', 'B', 'C', 'D'] as const;

  const difficultyStars = '★'.repeat(question.difficulty) + '☆'.repeat(5 - question.difficulty);

  return (
    <div style={{
      animation: 'fadeInUp 0.4s ease',
    }}>
      {/* 难度指示 */}
      <div style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 6,
        background: 'rgba(255,152,0,0.2)',
        color: '#FF9800',
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 10,
      }}>
        难度 {difficultyStars}
      </div>

      {/* 题目文本 */}
      <div style={{
        background: '#1e1e2e',
        borderRadius: 12,
        padding: '18px 20px',
        marginBottom: 16,
        border: '1px solid #333',
      }}>
        <p style={{
          margin: 0,
          fontSize: 16,
          lineHeight: 1.7,
          color: '#f0f0f0',
        }}>
          {question.question}
        </p>
      </div>

      {/* 选项 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {labels.map(label => (
          <OptionButton
            key={label}
            label={label}
            text={question.options[labels.indexOf(label)]}
            onClick={() => onSelect(label)}
            disabled={disabled}
            state={answerState[label] || 'default'}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```
git add components/OptionButton.tsx components/QuestionCard.tsx
git commit -m "feat: add QuestionCard and OptionButton components"
```

---

### Task 13: ResultOverlay 答题结果

**Files:**
- Create: `components/ResultOverlay.tsx`

- [ ] **Step 1: 创建结果弹窗**

```tsx
// components/ResultOverlay.tsx
'use client';

import { Question, CharacterEmotion } from '@/types';

interface ResultOverlayProps {
  question: Question;
  correct: boolean;
  healthChange: number;
  emotion: CharacterEmotion;
}

export default function ResultOverlay({ question, correct, healthChange, emotion }: ResultOverlayProps) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: correct ? 'rgba(0,128,0,0.15)' : 'rgba(255,0,0,0.15)',
      backdropFilter: 'blur(4px)',
      borderRadius: 16,
      zIndex: 10,
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* 正确/错误图标 */}
      <div style={{
        fontSize: 60,
        animation: 'bounceIn 0.5s ease',
        marginBottom: 8,
      }}>
        {correct ? '✅' : '❌'}
      </div>

      {/* 血量变化 */}
      <div style={{
        fontSize: 28,
        fontWeight: 800,
        color: correct ? '#4CAF50' : '#F44336',
        marginBottom: 8,
      }}>
        {correct ? `+${healthChange}` : `${healthChange}`} HP
      </div>

      {/* 解析 */}
      <div style={{
        maxWidth: 320,
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13,
        lineHeight: 1.6,
        padding: '0 16px',
      }}>
        {question.explanation}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/ResultOverlay.tsx
git commit -m "feat: add ResultOverlay for correct/wrong feedback"
```

---

### Task 14: LevelUpModal 升级弹窗

**Files:**
- Create: `components/LevelUpModal.tsx`

- [ ] **Step 1: 创建升级模态**

```tsx
// components/LevelUpModal.tsx
'use client';

import { STAGE_NAMES } from '@/types';

interface LevelUpModalProps {
  fromStage: number;
  toStage: number;
  newMaxHealth: number;
  onContinue: () => void;
}

const STAGE_EMOJI: Record<number, string> = { 1: '😶', 2: '🧑‍🎓', 3: '🦸', 4: '✨', 5: '👑' };

export default function LevelUpModal({ fromStage, toStage, newMaxHealth, onContinue }: LevelUpModalProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 20,
        padding: '32px 40px',
        textAlign: 'center',
        border: '2px solid #FFD700',
        animation: 'scaleIn 0.5s ease',
        maxWidth: 340,
      }}>
        <div style={{ fontSize: 16, color: '#FFD700', fontWeight: 600, marginBottom: 12 }}>
          🎉 恭喜升级！
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontSize: 50,
          marginBottom: 8,
        }}>
          <span>{STAGE_EMOJI[fromStage]}</span>
          <span style={{ fontSize: 24, color: '#FFD700' }}>→</span>
          <span style={{ animation: 'bounceIn 0.5s ease' }}>{STAGE_EMOJI[toStage]}</span>
        </div>

        <div style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#FFD700',
          marginBottom: 6,
        }}>
          {STAGE_NAMES[fromStage]} → {STAGE_NAMES[toStage]}
        </div>

        <div style={{ color: '#aaa', fontSize: 14, marginBottom: 20 }}>
          最大血量提升至 <span style={{ color: '#4CAF50', fontWeight: 700 }}>{newMaxHealth}</span>
          {toStage >= 3 && <span style={{ display: 'block', marginTop: 4 }}>解锁新外观！</span>}
        </div>

        <button
          onClick={onContinue}
          style={{
            padding: '10px 32px',
            fontSize: 16,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF9800, #FF5722)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          继续闯关 →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/LevelUpModal.tsx
git commit -m "feat: add LevelUpModal with stage transition animation"
```

---

### Task 15: GameOverScreen 游戏结束

**Files:**
- Create: `components/GameOverScreen.tsx`

- [ ] **Step 1: 创建游戏结束屏幕**

```tsx
// components/GameOverScreen.tsx
'use client';

import { STAGE_NAMES } from '@/types';

interface GameOverScreenProps {
  score: number;
  stage: number;
  mode: string;
  onRestart: () => void;
  onMainMenu: () => void;
}

export default function GameOverScreen({ score, stage, mode, onRestart, onMainMenu }: GameOverScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      animation: 'fadeIn 0.5s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0000 0%, #0d0d1a 100%)',
        borderRadius: 20,
        padding: '36px 44px',
        textAlign: 'center',
        border: '2px solid #F44336',
        maxWidth: 360,
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>💔</div>
        <div style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#F44336',
          marginBottom: 16,
        }}>
          {mode === 'level' ? '闯关失败' : '游戏结束'}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 24,
        }}>
          <div style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>
            本次成绩
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FFD700' }}>{score}</div>
              <div style={{ fontSize: 11, color: '#888' }}>答对题数</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4FC3F7' }}>{STAGE_NAMES[stage]}</div>
              <div style={{ fontSize: 11, color: '#888' }}>最终阶位</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRestart}
            style={{
              padding: '12px',
              fontSize: 16,
              fontWeight: 700,
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            🔄 再来一局
          </button>
          <button
            onClick={onMainMenu}
            style={{
              padding: '10px',
              fontSize: 14,
              fontWeight: 600,
              background: 'transparent',
              color: '#aaa',
              border: '1px solid #444',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            🏠 返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add components/GameOverScreen.tsx
git commit -m "feat: add GameOverScreen with stats display"
```

---

### Task 16: MainMenu 主菜单

**Files:**
- Create: `components/MainMenu.tsx`
- Create: `components/SaveManager.tsx`

- [ ] **Step 1: 创建 SaveManager**

```tsx
// components/SaveManager.tsx
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
```

- [ ] **Step 2: 创建 MainMenu**

```tsx
// components/MainMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import { hasSave, loadSave } from '@/lib/save';
import { STAGE_NAMES } from '@/types';
import SaveManager from './SaveManager';
import Character from './Character';

interface MainMenuProps {
  onStart: (mode: 'level' | 'endless', resumeData?: ReturnType<typeof loadSave>) => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  const [saveExists, setSaveExists] = useState(false);
  const [showSaveManager, setShowSaveManager] = useState(false);
  const [savePreview, setSavePreview] = useState<{ stage: number; score: number; mode: string } | null>(null);

  useEffect(() => {
    const exists = hasSave();
    setSaveExists(exists);
    if (exists) {
      const data = loadSave();
      if (data) {
        setSavePreview({ stage: data.stage, score: data.score, mode: data.mode });
      }
    }
  }, []);

  const handleContinue = () => {
    const data = loadSave();
    if (data) {
      onStart(data.mode as 'level' | 'endless', data);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 24,
      gap: 16,
    }}>
      {/* 角色展示 */}
      <Character stage={savePreview?.stage || 1} emotion="normal" animating={false} />

      {/* 标题 */}
      <h1 style={{
        fontSize: 32,
        fontWeight: 800,
        color: '#fff',
        margin: 0,
        textAlign: 'center',
      }}>
        答题闯关
      </h1>
      <p style={{ color: '#888', fontSize: 14, margin: '0 0 8px' }}>
        生活常识 · AI 出题 · 每日挑战
      </p>

      {/* 按钮组 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 240 }}>
        <button onClick={() => onStart('level')} style={btnStyle('#4CAF50')}>
          🏰 闯关模式
        </button>
        <button onClick={() => onStart('endless')} style={btnStyle('#2196F3')}>
          ♾️ 无限挑战
        </button>

        {saveExists && savePreview && (
          <button onClick={handleContinue} style={btnStyle('#FF9800')}>
            💾 继续游戏
            <span style={{ display: 'block', fontSize: 11, color: '#ffcc80', marginTop: 2 }}>
              {STAGE_NAMES[savePreview.stage]} · {savePreview.mode === 'level' ? '闯关' : '无限'} · ⭐{savePreview.score}
            </span>
          </button>
        )}

        <button onClick={() => setShowSaveManager(true)} style={btnStyle('#555')}>
          💾 存档管理
        </button>
      </div>

      {/* 存档管理弹窗 */}
      {showSaveManager && (
        <SaveManager onClose={() => {
          setShowSaveManager(false);
          // 刷新存档状态
          setSaveExists(hasSave());
          const data = loadSave();
          if (data) setSavePreview({ stage: data.stage, score: data.score, mode: data.mode });
        }} />
      )}
    </div>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '14px 20px',
    fontSize: 16,
    fontWeight: 700,
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
    width: '100%',
  };
}
```

- [ ] **Step 3: Commit**

```
git add components/MainMenu.tsx components/SaveManager.tsx
git commit -m "feat: add MainMenu and SaveManager with continue/resume"
```

---

### Task 17: 游戏页面 — 核心玩法

**Files:**
- Create: `app/game/page.tsx`

这个文件将所有组件串联成完整游戏流程。

- [ ] **Step 1: 创建游戏页面（完整）**

```tsx
// app/game/page.tsx
'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/game-store';
import { fetchQuestion, preloadQueue } from '@/lib/ai';
import { PRELOAD_QUEUE_SIZE, ANSWER_DISPLAY_MS, HEALTH_GAIN, HEALTH_LOSS } from '@/lib/constants';
import Character from '@/components/Character';
import HealthBar from '@/components/HealthBar';
import QuestionCard from '@/components/QuestionCard';
import ResultOverlay from '@/components/ResultOverlay';
import LevelUpModal from '@/components/LevelUpModal';
import GameOverScreen from '@/components/GameOverScreen';
import { GameMode } from '@/types';
import { loadSave } from '@/lib/save';

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const store = useGameStore();
  const {
    mode, health, maxHealth, score, stage, combo,
    currentQuestion, questionQueue, history, status, emotion, highScore,
    startGame, selectAnswer, nextQuestion, setQuestion, appendToQueue, autoSave,
  } = store;

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<Record<string, 'default' | 'selected' | 'correct' | 'wrong'>>({});
  const [showResult, setShowResult] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [prevStage, setPrevStage] = useState(1);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const initialized = useRef(false);

  // 初始化游戏
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const modeParam = searchParams.get('mode') as GameMode | null;
    const resumeParam = searchParams.get('resume');

    if (resumeParam === 'true') {
      const data = loadSave();
      if (data) {
        startGame(data.mode, data);
        return;
      }
    }

    if (modeParam === 'level' || modeParam === 'endless') {
      startGame(modeParam);
    } else {
      router.replace('/');
    }
  }, []);

  // 加载题目
  useEffect(() => {
    if (status !== 'playing') return;
    if (currentQuestion) return;
    if (questionsLoading) return;

    if (questionQueue.length > 0) {
      nextQuestion();
      return;
    }

    // 需要获取新题目
    setQuestionsLoading(true);
    preloadQueue(mode, stage, history.map(h => h.questionId), PRELOAD_QUEUE_SIZE)
      .then(questions => {
        if (questions.length > 0) {
          appendToQueue(questions);
          // nextQuestion 会在 appendToQueue 后由新 effect 触发
        }
      })
      .catch(() => {
        // 错误已由 AI 客户端处理（使用兜底题库）
      })
      .finally(() => setQuestionsLoading(false));
  }, [status, currentQuestion, questionQueue.length, questionsLoading]);

  // 当队列有题且暂未当前题目时，取下一题
  useEffect(() => {
    if (status === 'playing' && !currentQuestion && questionQueue.length > 0) {
      nextQuestion();
    }
  }, [questionQueue, currentQuestion, status]);

  // 自动存档
  useEffect(() => {
    if (status === 'playing' && history.length > 0) {
      autoSave();
    }
  }, [history.length]);

  // 处理答题
  const handleSelect = useCallback((answer: string) => {
    if (status !== 'playing' || !currentQuestion) return;

    setSelectedAnswer(answer);
    const state: Record<string, 'default' | 'selected' | 'correct' | 'wrong'> = {
      A: 'default', B: 'default', C: 'default', D: 'default',
    };
    state[answer] = 'selected';
    setAnswerState(state);

    setPrevStage(stage);

    setTimeout(() => {
      const correct = answer === currentQuestion.answer;
      // 更新状态
      state[answer] = correct ? 'correct' : 'wrong';
      state[currentQuestion.answer] = 'correct';
      setAnswerState({ ...state });
      setLastCorrect(correct);

      selectAnswer(answer);

      setTimeout(() => {
        setShowResult(true);
      }, 300);
    }, 400);
  }, [status, currentQuestion, stage, selectAnswer]);

  // 结果展示后自动进入下一题
  useEffect(() => {
    if (!showResult) return;

    const timer = setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      setAnswerState({});

      // 检查升级
      if (stage > prevStage) {
        setShowLevelUp(true);
        return;
      }

      // 检查游戏结束
      if (health <= 0) {
        return;
      }

      // 下一题
      setQuestion(null as any); // 触发加载新题目的 effect
    }, ANSWER_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [showResult]);

  const handleLevelUpContinue = () => {
    setShowLevelUp(false);
    setPrevStage(stage);
    setQuestion(null as any);
  };

  const handleRestart = () => {
    startGame(mode);
    setShowResult(false);
    setShowLevelUp(false);
    setSelectedAnswer(null);
    setAnswerState({});
    setLastCorrect(null);
  };

  const handleMainMenu = () => {
    router.push('/');
  };

  // 加载中状态
  if (status === 'idle') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: '#888', fontSize: 18,
      }}>
        ⏳ 准备题目中...
      </div>
    );
  }

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
      <div style={{ marginBottom: 16 }}>
        <HealthBar health={health} maxHealth={maxHealth} stage={stage} score={score} />
      </div>

      {/* 角色区域 */}
      <div style={{ textAlign: 'center', marginBottom: 16, position: 'relative' }}>
        <Character
          stage={stage}
          emotion={status === 'gameover' ? 'dead' : emotion}
          animating={showResult}
        />

        {/* 连击提示 */}
        {combo >= 3 && status === 'playing' && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 20,
            fontSize: 12,
            fontWeight: 700,
            color: '#FF9800',
            animation: 'bounceIn 0.3s ease',
          }}>
            🔥 {combo}连击!
          </div>
        )}
      </div>

      {/* 题目区域 */}
      <div style={{ flex: 1, position: 'relative' }}>
        {questionsLoading && !currentQuestion && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 60, color: '#888', fontSize: 16,
          }}>
            🤔 AI 正在出题...
          </div>
        )}

        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            answerState={answerState}
            disabled={status !== 'playing'}
            onSelect={handleSelect}
          />
        )}

        {/* 结果覆盖层 */}
        {showResult && lastCorrect !== null && currentQuestion && (
          <ResultOverlay
            question={currentQuestion}
            correct={lastCorrect}
            healthChange={lastCorrect ? HEALTH_GAIN : -HEALTH_LOSS}
            emotion={lastCorrect ? 'happy' : 'hurt'}
          />
        )}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={handleMainMenu}
        style={{
          marginTop: 16,
          padding: '8px',
          background: 'transparent',
          color: '#666',
          border: 'none',
          fontSize: 13,
          cursor: 'pointer',
          alignSelf: 'center',
        }}
      >
        ← 返回主菜单
      </button>

      {/* 升级弹窗 */}
      {showLevelUp && (
        <LevelUpModal
          fromStage={prevStage}
          toStage={stage}
          newMaxHealth={maxHealth}
          onContinue={handleLevelUpContinue}
        />
      )}

      {/* 游戏结束 */}
      {status === 'gameover' && (
        <GameOverScreen
          score={score}
          stage={stage}
          mode={mode}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```
git add app/game/page.tsx
git commit -m "feat: add game page wiring all components together"
```

---

### Task 18: 根布局 + 全局样式 + 首页

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

- [ ] **Step 1: 创建 globals.css（含动画关键帧）**

```css
/* app/globals.css */
@import "tailwindcss";

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  background: #0d0d1a;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* 角色动画 */
.character-container {
  transition: transform 0.3s ease, filter 0.3s ease;
}

.anim-idle {
  animation: float 2s ease-in-out infinite;
}

.anim-happy {
  animation: jump 0.5s ease;
}

.anim-hurt {
  animation: shake 0.4s ease;
}

.anim-levelup {
  animation: scaleUp 0.6s ease;
}

.anim-dead {
  animation: fallDown 0.6s ease forwards;
  filter: grayscale(1);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes jump {
  0% { transform: translateY(0) rotate(0deg); }
  30% { transform: translateY(-20px) rotate(-5deg); }
  60% { transform: translateY(-10px) rotate(3deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

@keyframes scaleUp {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

@keyframes fallDown {
  0% { transform: rotate(0deg); opacity: 1; }
  50% { transform: rotate(15deg); opacity: 0.7; }
  100% { transform: rotate(30deg) translateY(20px); opacity: 0.5; }
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #1a1a2e;
}
::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

/* 移动端适配 */
@media (max-width: 360px) {
  body {
    font-size: 14px;
  }
}
```

- [ ] **Step 2: 创建 layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '答题闯关 - 生活常识挑战',
  description: 'AI出题，答题闯关，升级角色！',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: 创建首页（主菜单入口）**

```tsx
// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import MainMenu from '@/components/MainMenu';
import { loadSave, hasSave } from '@/lib/save';

export default function HomePage() {
  const router = useRouter();

  const handleStart = (mode: 'level' | 'endless', resumeData?: ReturnType<typeof loadSave>) => {
    if (resumeData) {
      router.push(`/game?mode=${mode}&resume=true`);
    } else {
      router.push(`/game?mode=${mode}`);
    }
  };

  return <MainMenu onStart={handleStart} />;
}
```

- [ ] **Step 4: Commit**

```
git add app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: add root layout, global styles, and main menu page"
```

---

### Task 19: 验证与调试

- [ ] **Step 1: 启动开发服务器**

```
cd "C:\Users\bushi\Desktop\答题" && npm run dev
```
Expected: Next.js 开发服务器在 http://localhost:3000 启动

- [ ] **Step 2: 验证主菜单页面**
  - 打开 http://localhost:3000
  - 验证角色展示、两个模式按钮、「存档管理」按钮
  - Expected: 页面正常渲染，无控制台错误

- [ ] **Step 3: 验证闯关模式**
  - 点击「闯关模式」
  - 验证题目加载、选项点击、血量变化
  - 验证答对时角色跳跃动画、答错时抖动动画
  - Expected: 完整流程正常运转

- [ ] **Step 4: 验证升级**
  - 连续答对多题积累血量，触发升级
  - 验证升级弹窗、角色外观变化
  - Expected: 升级动画流畅，血量上限提升

- [ ] **Step 5: 验证游戏结束**
  - 故意答错直到血量归零
  - 验证游戏结束屏幕、分数统计
  - Expected: GameOver 展示正确，可重新开始或回菜单

- [ ] **Step 6: 验证存档**
  - 游戏中退出 → 回主菜单 → 点击「继续游戏」
  - 验证进度恢复
  - 导出存档 → 清除存档 → 导入存档 → 验证恢复
  - Expected: 存档功能正常

- [ ] **Step 7: 移动端验证**
  - 使用 Chrome DevTools 切换至 375px 视口
  - 验证布局不溢出、按钮可点击
  - Expected: 移动端适配正常

- [ ] **Step 8: AI API 测试**
  - 确保 `.env.local` 中 DEEPSEEK_API_KEY 已设置
  - 进行游戏，观察 AI 题目生成
  - 未设置 API Key 时验证兜底题库是否生效
  - Expected: AI 题目生成或兜底题库均正常

- [ ] **Step 9: Commit（如有修复）**

```
git add -A
git commit -m "chore: bugfixes and polish after testing"
```

---

## 自检清单

1. Spec coverage: 每个 spec 需求都有对应 Task — 数据模型(Task2,8), 血量系统(Task8,11), 升级(Task14), 双模式(Task16,17), AI生成(Task7,9), 角色动画(Task10,18), 存档(Task5,16), UI流程(Task17)
2. No TBD/TODO placeholders ✓
3. Type consistency: `GameState`/`Question`/`SaveData` 在 types→store→components 链路一致 ✓
4. 所有文件路径使用项目根目录绝对路径 ✓
