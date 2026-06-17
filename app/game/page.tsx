// app/game/page.tsx
'use client';

import { useEffect, useCallback, useRef, useState, Suspense } from 'react';
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

function GamePageContent() {
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
        }
      })
      .catch(() => {
        // 错误已由 AI 客户端处理（使用兜底题库）
      })
      .finally(() => setQuestionsLoading(false));
  }, [status, currentQuestion, questionQueue.length, questionsLoading]);

  // 当队列有题且暂无当前题目时，取下一题
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
      setQuestion(null as any);
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

export default function GamePage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: '#888', fontSize: 18,
      }}>
        ⏳ 加载中...
      </div>
    }>
      <GamePageContent />
    </Suspense>
  );
}
