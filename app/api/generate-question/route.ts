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
    ? Math.min(stage, 5)
    : Math.ceil(Math.random() * 5);

  let prompt = `请生成一道难度为${difficulty}的生活常识单选题。`;
  if (previousIds.length > 0) {
    prompt += `\n请不要与以下已出题目重复（题号参考）：${previousIds.slice(-10).join(', ')}`;
  }
  return prompt;
}

function tryParseQuestion(raw: string): Question | null {
  try {
    const trimmed = raw.trim();
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
