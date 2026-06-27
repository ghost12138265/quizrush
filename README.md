# 🏰 QuizRush — 答题闯关

> 生活常识答题闯关小游戏。AI 出题 · CSS 卡通角色 · 血量升级 · 存档系统。

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6)

## ✨ 特性

- 🤖 **AI 智能出题** — DeepSeek API 驱动，题目永不重复
- 🎨 **CSS 卡通角色** — 纯 CSS 绘制 Q 版小人，5 种表情 + 阶位外观进化
- ❤️ **血量升级系统** — 答对加血，答错扣血，5 个阶位（新手→大师）
- 💾 **存档管理** — 自动存档 + JSON 导出/导入
- 🎯 **双模式** — 闯关模式（难度递增） + 无限挑战
- 📱 **移动端适配** — 320px+ 响应式，深色护眼主题
- 🛡️ **离线兜底** — AI 不可用时自动切换 20 道内置题库

## 🎮 玩法

| 操作 | 效果 |
|------|------|
| 答对 | +10 HP，角色跳跃欢呼 |
| 答错 | -15 HP，角色抖动受伤 |
| 连击 5+ | 额外 +5 HP |
| 血量达标 | 阶位晋升，解锁新外观 |

### 阶位表

| 阶位 | 称号 | 血量需求 | 最大血量 | 外观 |
|------|------|----------|----------|------|
| 1 | 新手 | 初始 100 | 120 | 基础小人 |
| 2 | 学徒 | 120+ | 150 | +帽子 |
| 3 | 达人 | 150+ | 200 | +披风 |
| 4 | 专家 | 200+ | 300 | +光效 |
| 5 | 大师 | 300+ | 500 | +王冠 |

## 🚀 快速开始

```bash
# 1. 克隆
git clone https://github.com/Xuaaaan/quizrush.git
cd quizrush

# 2. 安装依赖
npm install

# 3. 配置 API Key
cp .env.local.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 4. 启动
npm run dev
# 打开 http://localhost:3000
```

> 未配置 API Key 时，游戏自动使用内置题库，仍可正常游玩。

## 🛠️ 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Next.js 15 (App Router) |
| 前端 | React 19 + TypeScript |
| 状态管理 | Zustand 5 |
| 样式 | Tailwind CSS 4 + CSS Keyframes |
| AI | DeepSeek Chat API（后端代理） |
| 持久化 | localStorage + JSON 导出/导入 |

## 📁 项目结构

```
quizrush/
├── app/
│   ├── page.tsx              # 主菜单
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式 + 动画
│   ├── game/page.tsx         # 游戏核心页面
│   └── api/generate-question/
│       └── route.ts          # AI 题目生成 API
├── components/
│   ├── Character.tsx         # CSS 卡通角色
│   ├── HealthBar.tsx         # 血量条
│   ├── QuestionCard.tsx      # 题目卡片
│   ├── OptionButton.tsx      # 选项按钮
│   ├── ResultOverlay.tsx     # 答题结果
│   ├── LevelUpModal.tsx      # 升级弹窗
│   ├── GameOverScreen.tsx    # 游戏结束
│   ├── MainMenu.tsx          # 主菜单
│   └── SaveManager.tsx       # 存档管理
├── lib/
│   ├── game-store.ts         # Zustand 状态
│   ├── ai.ts                 # AI 客户端
│   ├── save.ts               # 存档逻辑
│   ├── constants.ts          # 游戏常量
│   ├── question-cache.ts     # 题目缓存/去重
│   └── fallback-questions.ts # 20 道兜底题库
└── types/
    └── index.ts              # 类型定义
```

## 📄 License

MIT © Xuaaaan
