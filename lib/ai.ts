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
      break;
    }
  }

  return questions;
}
