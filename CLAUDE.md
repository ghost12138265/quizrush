# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

No test suite or linter is configured.

## Architecture

This is a **Next.js 15 App Router** quiz game for Chinese audiences — life-skills trivia with AI-generated questions, CSS-drawn character progression, and health-based stage advancement.

### Data flow

1. User picks a mode (`level` or `endless`) on the main menu (`app/page.tsx` → `MainMenu`).
2. Router navigates to `app/game/page.tsx` with `?mode=` (and `?resume=true` for continue).
3. `GamePageContent` calls `startGame()` on the Zustand store, which sets `status: 'playing'`.
4. When `status === 'playing'` and `currentQuestion === null`, a `useEffect` triggers `preloadQueue()` (fetches 5 questions from `/api/generate-question`).
5. Questions arrive → `appendToQueue()` adds them → another `useEffect` calls `nextQuestion()` which shifts the first question off the queue into `currentQuestion`.
6. On answer select: `handleSelect()` sets a 400ms highlight, then calls `selectAnswer()` (updates health/score/stage/combo in the store), then 300ms later shows `ResultOverlay` for 2 seconds.
7. After result display: if stage increased → show `LevelUpModal`; if health ≤ 0 → `status: 'gameover'`; otherwise clear `currentQuestion` which cycles back to step 4.

### State management (Zustand)

All game state lives in `lib/game-store.ts` — a single Zustand store (`useGameStore`) combining `GameState` + `GameActions`. Components never manage game state locally except for transient UI state (selected answer highlight, modal visibility).

Key state transitions:
- `idle` → `playing` (startGame)
- `playing` → `answering` (selectAnswer) → percolates back to `playing` after 2s
- `playing` → `gameover` (health ≤ 0)

Stage thresholds are computed from health, not tracked independently — `getStageForHealth()` iterates thresholds 5→1 and returns the highest qualifying stage ≥ current stage (stages never regress).

### AI question generation

`app/api/generate-question/route.ts` is a **server-side proxy** to the DeepSeek Chat API. It:
- Constructs a Chinese-language system prompt for life-skills trivia
- Retries up to 3 times on failure
- Validates JSON output shape (`question`, `options[4]`, `answer` ∈ A-D, `difficulty`)
- Falls back to `lib/fallback-questions.ts` (20 hardcoded questions) if all retries fail
- Caches generated questions server-side via `lib/question-cache.ts` (in-memory `Map`, hash-based dedup, max 500 entries)

The frontend client is `lib/ai.ts` — `fetchQuestion()` calls the API route, `preloadQueue()` batches N requests sequentially.

Environment: `.env.local` must contain `DEEPSEEK_API_KEY` and optionally `DEEPSEEK_BASE_URL`. Without a key, the API returns 500 and the game uses fallback questions automatically.

### Persistence

`lib/save.ts` wraps `localStorage` with versioned save data (`SAVE_VERSION = 1`). Features:
- Auto-save on every answered question
- Continue-game detection on main menu
- JSON export (downloads a `.json` file) / import (file picker upload)
- Version mismatch → clears stale saves silently

### Components

- **Character** (`components/Character.tsx`) — Pure CSS character with stage-based accessories (hat at stage 2, cape at stage 3, shimmer glow at stage 4, crown at stage 5). Emotion drives CSS animation class (`anim-idle`, `anim-happy`, `anim-hurt`, `anim-levelup`, `anim-dead`).
- **HealthBar** — Shows stage badge, color-coded health bar (green > 50% > orange > 25% > red), and score.
- **QuestionCard** — Renders question text + difficulty stars + 4 `OptionButton`s.
- **OptionButton** — A/B/C/D with color-coded labels and state-based styling (default/selected/correct/wrong).
- **ResultOverlay** — Blurred overlay showing ✅/❌, HP change, and explanation.
- **LevelUpModal** — Full-screen modal with stage transition animation and new max health announcement.
- **GameOverScreen** — Final score, stage reached, restart/menu buttons.
- **MainMenu** — Mode selection, continue-game detection, save manager access.
- **SaveManager** — Export/import save JSON via file download/upload.

### Styling

Tailwind CSS 4 with `@import "tailwindcss"` in `app/globals.css`. Components use inline `style` objects rather than Tailwind utility classes. Keyframe animations (float, jump, shake, scaleUp, fallDown, shimmer, fadeIn, fadeInUp, bounceIn, scaleIn) are defined in `globals.css`.

### Key constants

See `lib/constants.ts`:
- `HEALTH_GAIN = 10`, `HEALTH_LOSS = 15`, `COMBO_BONUS = 5` (at every 5-combo threshold)
- `ANSWER_DISPLAY_MS = 2000` — result overlay duration
- `PRELOAD_QUEUE_SIZE = 5` — questions fetched ahead
- `MAX_QUESTIONS_PER_SESSION = 200`

### Types

All shared types are in `types/index.ts`: `GameMode`, `GameStatus`, `CharacterEmotion`, `Question`, `AnswerRecord`, `GameState`, `SaveData`, `GenerateQuestionRequest/Response`, and `STAGE_NAMES`.
