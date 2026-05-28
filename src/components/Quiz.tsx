'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, X, CheckCircle2, ArrowRight, RotateCcw, BookOpen, PartyPopper } from 'lucide-react';
import { getQuiz, type Question } from '@/data/quizzes';
import { gradeQuiz, isAnswerCorrect, type UserAnswer, type QuizResult } from '@/lib/quiz';
import { apiSubmitQuiz, ApiError } from '@/lib/api';
import { useProgress } from '@/components/providers/progress';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Props = {
  moduleId: number;
  nextModuleId: number | null;
  onBackToContent: () => void;
};

export function Quiz({ moduleId, nextModuleId, onBackToContent }: Props) {
  const quiz = getQuiz(moduleId);
  const router = useRouter();
  const { adopt } = useProgress();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!quiz) return null;
  const total = quiz.questions.length;
  const q = quiz.questions[index];
  const isLast = index === total - 1;
  const current = answers[q.id];
  const hasAnswer = answerProvided(q, current);

  function setAnswer(value: UserAnswer) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
  }

  async function finish(finalAnswers: Record<string, UserAnswer>) {
    const local = gradeQuiz(moduleId, finalAnswers);
    setResult(local);
    setSubmitting(true);
    setSaveError(null);
    try {
      const res = await apiSubmitQuiz(moduleId, finalAnswers);
      adopt(res.progress);
      setResult({
        moduleId: res.moduleId,
        total: res.total,
        correctCount: res.correctCount,
        score: res.score,
        passed: res.passed,
        perQuestion: res.perQuestion,
      });
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : '进度保存失败');
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (isLast) {
      void finish(answers);
    } else {
      setIndex((i) => i + 1);
      setChecked(false);
    }
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setChecked(false);
    setResult(null);
    setSaveError(null);
  }

  // ── Result screen ───────────────────────────────────────────────
  if (result) {
    return (
      <ResultScreen
        result={result}
        submitting={submitting}
        saveError={saveError}
        nextModuleId={nextModuleId}
        onRetake={restart}
        onBackToContent={onBackToContent}
        onRetrySave={() => void finish(answers)}
        onNext={() => nextModuleId && router.push(`/theory/${nextModuleId}`)}
        onToList={() => router.push('/theory')}
      />
    );
  }

  const correct = checked ? isAnswerCorrect(q, current) : false;

  // ── Question stepper ────────────────────────────────────────────
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="font-mono text-sm font-medium text-ink-3">
          第 {index + 1} / {total} 题
        </span>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-2 sm:w-48">
          <div
            className="h-full origin-left rounded-full bg-brand transition-transform duration-300 ease-out-quint"
            style={{ transform: `scaleX(${(index + (checked ? 1 : 0)) / total})` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, transform: 'translateY(8px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-brand-ink">
            {questionTypeLabel(q.type)}
          </div>
          <h3 className="font-display text-xl font-semibold leading-snug text-ink">
            {q.question}
          </h3>

          <div className="mt-5">
            {q.type === 'shortAnswer' ? (
              <ShortAnswerInput
                value={typeof current === 'string' ? current : ''}
                checked={checked}
                correct={correct}
                onChange={setAnswer}
              />
            ) : (
              <OptionList
                question={q}
                value={current}
                checked={checked}
                onSelect={setAnswer}
              />
            )}
          </div>

          {checked && <Feedback correct={correct} question={q} answer={current} />}
        </motion.div>
      </AnimatePresence>

      <div className="mt-7 flex justify-end">
        {!checked ? (
          <Button onClick={() => setChecked(true)} disabled={!hasAnswer}>
            提交答案
          </Button>
        ) : (
          <Button onClick={next} loading={isLast && submitting}>
            {isLast ? '查看结果' : '下一题'}
            {!isLast && <ArrowRight className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
function answerProvided(q: Question, a: UserAnswer | undefined): boolean {
  if (a === undefined) return false;
  if (q.type === 'multiple') return Array.isArray(a) && a.length > 0;
  if (q.type === 'shortAnswer') return typeof a === 'string' && a.trim().length > 0;
  return typeof a === 'number';
}

function questionTypeLabel(t: Question['type']): string {
  if (t === 'single') return '单选题';
  if (t === 'multiple') return '多选题 · 选出所有正确项';
  return '简答题 · 填写关键词';
}

function OptionList({
  question,
  value,
  checked,
  onSelect,
}: {
  question: Question;
  value: UserAnswer | undefined;
  checked: boolean;
  onSelect: (v: UserAnswer) => void;
}) {
  const multiple = question.type === 'multiple';
  const selected = new Set<number>(
    multiple ? ((value as number[]) ?? []) : value === undefined ? [] : [value as number],
  );
  const correctSet = new Set<number>(
    multiple ? (question.correctAnswer as number[]) : [question.correctAnswer as number],
  );

  function toggle(i: number) {
    if (multiple) {
      const arr = new Set(selected);
      arr.has(i) ? arr.delete(i) : arr.add(i);
      onSelect([...arr].sort((a, b) => a - b));
    } else {
      onSelect(i);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {(question.options ?? []).map((opt, i) => {
        const isSelected = selected.has(i);
        const isCorrect = correctSet.has(i);
        let tone = 'border-line-2 bg-surface hover:border-ink-3/40';
        if (!checked && isSelected) tone = 'border-brand bg-brand-tint';
        if (checked && isCorrect) tone = 'border-success/60 bg-success-tint';
        if (checked && isSelected && !isCorrect) tone = 'border-danger/60 bg-danger-tint';

        return (
          <button
            key={i}
            type="button"
            disabled={checked}
            onClick={() => toggle(i)}
            className={cn(
              'flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-[transform,background-color,border-color] duration-150 ease-out-quint',
              !checked && 'active:scale-[0.99]',
              tone,
            )}
          >
            <span
              className={cn(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center border text-xs',
                multiple ? 'rounded-md' : 'rounded-full',
                isSelected || (checked && isCorrect)
                  ? 'border-transparent'
                  : 'border-line-2',
                checked && isCorrect && 'bg-success text-[oklch(0.99_0.01_60)]',
                checked && isSelected && !isCorrect && 'bg-danger text-[oklch(0.99_0.01_60)]',
                !checked && isSelected && 'bg-brand text-[oklch(0.99_0.01_60)]',
              )}
            >
              {checked && isCorrect && <Check className="h-3.5 w-3.5" />}
              {checked && isSelected && !isCorrect && <X className="h-3.5 w-3.5" />}
              {!checked && isSelected && (multiple ? <Check className="h-3.5 w-3.5" /> : '•')}
            </span>
            <span className={cn('text-[0.95rem] leading-relaxed', checked ? 'text-ink-2' : 'text-ink')}>
              {opt}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ShortAnswerInput({
  value,
  checked,
  correct,
  onChange,
}: {
  value: string;
  checked: boolean;
  correct: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      disabled={checked}
      onChange={(e) => onChange(e.target.value)}
      placeholder="在此输入你的答案…"
      className={cn(
        'h-12 w-full rounded-xl border bg-surface px-4 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3',
        !checked && 'border-line-2 focus:border-brand',
        checked && correct && 'border-success/60 bg-success-tint',
        checked && !correct && 'border-danger/60 bg-danger-tint',
      )}
    />
  );
}

function Feedback({
  correct,
  question,
  answer,
}: {
  correct: boolean;
  question: Question;
  answer: UserAnswer | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(6px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'mt-5 rounded-xl px-4 py-3.5',
        correct ? 'bg-success-tint' : 'bg-danger-tint',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 text-sm font-semibold',
          correct ? 'text-success-ink' : 'text-danger-ink',
        )}
      >
        {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        {correct ? '回答正确' : '回答错误'}
      </div>
      {question.type === 'shortAnswer' && !correct && (
        <p className="mt-1.5 text-sm text-ink-2">
          参考答案：{(question.correctAnswer as string[]).join(' / ')}
        </p>
      )}
      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{question.explanation}</p>
    </motion.div>
  );
}

function ResultScreen({
  result,
  submitting,
  saveError,
  nextModuleId,
  onRetake,
  onBackToContent,
  onRetrySave,
  onNext,
  onToList,
}: {
  result: QuizResult;
  submitting: boolean;
  saveError: string | null;
  nextModuleId: number | null;
  onRetake: () => void;
  onBackToContent: () => void;
  onRetrySave: () => void;
  onNext: () => void;
  onToList: () => void;
}) {
  const { passed, score, correctCount, total } = result;

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'scale(0.98)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div
        className={cn(
          'mx-auto grid h-16 w-16 place-items-center rounded-2xl',
          passed ? 'bg-success-tint text-success-ink' : 'bg-brand-tint text-brand-ink',
        )}
      >
        {passed ? <PartyPopper className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
      </div>

      <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink">
        {passed ? '通过' : '再接再厉'}
      </h2>
      <p className="mt-2 font-mono text-lg text-ink-2 tnum">
        得分 {score}%（{correctCount}/{total}）
      </p>

      {passed ? (
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          你已掌握本章内容。{nextModuleId ? '下一章已为你解锁。' : '六章全部完成，去做实验吧。'}
        </p>
      ) : (
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-2">
          你的得分是 {score}%。建议你回到本章内容重新看一遍，或者把你不理解的部分直接问你的 AI
          助手，它可以解释得更详细。等你觉得准备好了再来一次测试。
        </p>
      )}

      {submitting && <p className="mt-4 text-sm text-ink-3">正在保存进度…</p>}
      {saveError && (
        <div className="mx-auto mt-4 flex max-w-sm items-center justify-center gap-3 text-sm text-danger-ink">
          <span>进度保存失败。</span>
          <button onClick={onRetrySave} className="font-medium underline underline-offset-2">
            重试
          </button>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        {passed ? (
          <>
            {nextModuleId ? (
              <Button onClick={onNext}>
                进入下一章 <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={onToList}>
                <CheckCircle2 className="h-4 w-4" /> 返回理论列表
              </Button>
            )}
            <Button variant="ghost" onClick={onToList}>
              返回理论列表
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onBackToContent} variant="secondary">
              <BookOpen className="h-4 w-4" /> 回到本章内容
            </Button>
            <Button onClick={onRetake}>
              <RotateCcw className="h-4 w-4" /> 重新测试
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
