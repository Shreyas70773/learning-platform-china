import { getQuiz, QUIZ_PASS_RATIO, type Question } from '@/data/quizzes';

// What the learner submits per question.
//   single     -> the chosen option index (number)
//   multiple   -> the chosen option indexes (number[])
//   shortAnswer-> the typed text (string)
export type UserAnswer = number | number[] | string;

export type PerQuestionResult = {
  id: string;
  correct: boolean;
  // The canonical correct answer, echoed back for feedback rendering.
  correctAnswer: Question['correctAnswer'];
  explanation: string;
};

export type QuizResult = {
  moduleId: number;
  total: number;
  correctCount: number;
  score: number; // 0..100, rounded
  passed: boolean;
  perQuestion: PerQuestionResult[];
};

// Whitespace-tolerant, case-insensitive, punctuation-insensitive normalization
// for short-answer matching (handles both Latin and CJK punctuation).
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[，。、；：,.;:!?！？"'"'`（）()【】「」《》\[\]/\\\-_·]/g, '')
    .trim();
}

function arraysEqualAsSets(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

export function isAnswerCorrect(q: Question, answer: UserAnswer | undefined): boolean {
  if (answer === undefined || answer === null) return false;

  if (q.type === 'single') {
    return typeof answer === 'number' && answer === q.correctAnswer;
  }

  if (q.type === 'multiple') {
    if (!Array.isArray(answer)) return false;
    return arraysEqualAsSets(answer as number[], q.correctAnswer as number[]);
  }

  // shortAnswer
  if (typeof answer !== 'string') return false;
  const ua = normalizeText(answer);
  if (ua.length === 0) return false;
  const accepted = (q.correctAnswer as string[]).map(normalizeText).filter(Boolean);
  // Credit the learner if their answer equals or contains an accepted key term.
  return accepted.some((acc) => ua === acc || ua.includes(acc));
}

export function gradeQuiz(
  moduleId: number,
  answers: Record<string, UserAnswer>,
): QuizResult | null {
  const quiz = getQuiz(moduleId);
  if (!quiz) return null;

  const perQuestion: PerQuestionResult[] = quiz.questions.map((q) => ({
    id: q.id,
    correct: isAnswerCorrect(q, answers[q.id]),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  const total = quiz.questions.length;
  const correctCount = perQuestion.filter((r) => r.correct).length;
  const ratio = total === 0 ? 0 : correctCount / total;

  return {
    moduleId,
    total,
    correctCount,
    score: Math.round(ratio * 100),
    passed: ratio >= QUIZ_PASS_RATIO,
    perQuestion,
  };
}
