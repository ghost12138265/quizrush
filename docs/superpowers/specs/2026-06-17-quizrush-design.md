# QuizRush 答题闯关 — 设计规格

## 概述

生活常识答题闯关小游戏。AI 生成题目，CSS 卡通角色，血量/升级系统，存档功能。Web SPA。

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 15 (App Router) |
| 前端 | React 19 + TypeScript |
| 状态管理 | Zustand |
| 样式 | Tailwind CSS + CSS Keyframes |
| AI | DeepSeek API（后端代理） |
| 持久化 | localStorage + JSON 导出/导入 |
| 部署 | Vercel / Node.js |

## 项目结构

```
quizrush/
├── app/
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页/主菜单
│   ├── game/
│   │   ├── page.tsx            # 游戏页面（答题界面）
│   │   └── layout.tsx          # 游戏布局（含角色 + 顶栏）
│   ├── api/
│   │   └── generate-question/
│   │       └── route.ts        # AI 题目生成 API
│   └── globals.css
├── components/
│   ├── Character.tsx            # CSS 卡通角色（动画+状态切换）
│   ├── HealthBar.tsx            # 血量条
│   ├── QuestionCard.tsx         # 题目卡片
│   ├── OptionButton.tsx         # 选项按钮
│   ├── ResultOverlay.tsx        # 答对/答错弹窗
│   ├── LevelUpModal.tsx         # 升级动画模态
│   ├── GameOverScreen.tsx       # 游戏结束
│   ├── MainMenu.tsx             # 主菜单
│   └── SaveManager.tsx          # 存档管理面板
├── lib/
│   ├── game-store.ts           # Zustand 游戏状态
│   ├── ai.ts                   # AI API 客户端（前端调用后端）
│   ├── save.ts                 # 存档读写逻辑
│   ├── question-cache.ts       # 题目缓存/去重
│   └── constants.ts            # 游戏常量（血量/阈值等）
├── types/
│   └── index.ts                # 类型定义
├── tailwind.config.ts
└── next.config.ts
```

## 数据模型

```typescript
interface GameState {
  mode: 'level' | 'endless';
  health: number;
  score: number;
  combo: number;
  stage: number;            // 1-5
  currentQuestion: Question | null;
  questionQueue: Question[];
  history: AnswerRecord[];
  status: 'idle' | 'playing' | 'answering' | 'result' | 'gameover';
}

interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];  // ["A...", "B...", "C...", "D..."]
  answer: string;           // "A" | "B" | "C" | "D"
  difficulty: number;       // 1-5
  explanation: string;
}

interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  timestamp: number;
}

interface SaveData {
  mode: 'level' | 'endless';
  health: number;
  maxHealth: number;
  score: number;
  stage: number;
  highScore: number;
  history: AnswerRecord[];
  savedAt: string;
  version: number;
}
```

## 游戏规则

### 血量系统
- 初始血量 100，答对 +10，答错 -15
- 连击奖励：连续答对 5 题额外 +5
- 血量 ≤ 0 → 游戏结束

### 阶段升级
| 阶位 | 称号 | 所需血量 | 最大血量上限 | 角色外观变化 |
|------|------|----------|-------------|-------------|
| 1 | 新手 | 100（初始） | 120 | 基础小人 |
| 2 | 学徒 | 120+ | 150 | +帽子 |
| 3 | 达人 | 150+ | 200 | +披风 |
| 4 | 专家 | 200+ | 300 | +光效 |
| 5 | 大师 | 300+ | 500 | +王冠 |

升级时触发动画弹窗，最大血量上限提升。

### 双模式

**闯关模式：**
- 难度从 1 开始，随阶位递增
- 预设关卡数（可配置，默认无终点——直到血量耗尽）
- 历史/统计持久化

**无限挑战：**
- 难度随机 1-5
- 纯看存活时间/答对数
- 不与闯关模式共享进度

## AI 题目生成

### API 路由

`POST /api/generate-question`

请求体：
```json
{
  "mode": "level",
  "stage": 3,
  "previousQuestionIds": ["abc123", "def456"]
}
```

响应：
```json
{
  "question": {
    "id": "ghi789",
    "question": "...",
    "options": ["A...", "B...", "C...", "D..."],
    "answer": "B",
    "difficulty": 3,
    "explanation": "..."
  }
}
```

### 内部逻辑
1. 构造 System Prompt（含难度参数 + 已出题黑名单）
2. 调用 DeepSeek Chat API
3. 解析 JSON 响应并验证
4. 存入内存缓存（textHash → question）
5. 返回前端

### 缓存
- 服务端内存 Map，同进程不重复
- 闯关模式预取 5 题队列，减少等待

### 错误处理
- API 超时 / 返回格式异常 → 使用预置的 20 道兜底题库（硬编码）
- 网络错误 → 前端显示重试按钮

## 角色动画

CSS 纯绘制的 Q 版卡通小人，用 div + CSS 构建：

- **表情系统**：5 种表情（正常/开心/受伤/升级/死亡）通过 CSS class 切换
- **动画**：
  - 待机：轻微上下浮动（2s loop）
  - 答对：跳跃 + 旋转 + 表情变开心
  - 答错：缩小 + 抖动 + 表情变受伤
  - 升级：放大 + 金光 + 装备闪现
  - 死亡：灰度 + 倒下
- **外观配件**（CSS 绘制）按阶位叠加显示

## 存档系统

### 自动存档
- localStorage 自动保存，每答完一题触发
- 存档键：`quizrush_save_v1`

### 手动操作
- 主菜单「继续游戏」→ 检测存档，有则继续
- 「存档管理」面板：
  - 导出存档为 JSON 文件下载
  - 导入 JSON 文件恢复进度
  - 新建游戏（清除当前存档）

### 兼容
- 存档含 `version` 字段，后续版本变更时做迁移

## UI 流程

```
主菜单 → 选模式 → 答题界面（循环） → 升级弹窗（阈值触发）
                                      → 游戏结束 → 回主菜单
```

### 答题界面交互
1. 题目出现（渐入动画）
2. 玩家点击选项 → 按钮高亮 0.5s → 显示结果
3. 答对：角色跳跃 + 血量条绿色动画增长
4. 答错：角色抖动 + 血量条红色动画缩减
5. 显示解析文字 1.5s
6. 自动出下一题 / 升级弹窗 / 游戏结束

## 非功能性需求

- 首屏加载 < 3s
- AI 题目生成 < 5s（含提示 loading 动画）
- 移动端适配（320px+）
- 深色主题（护眼游戏场景）

---

**设计确认：** 以上全部章节已经过用户逐节确认。
