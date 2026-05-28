'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock, ArrowLeft, ClipboardCheck } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Indicators';
import { Button } from '@/components/ui/Button';
import { Markdown } from '@/components/Markdown';
import { Quiz } from '@/components/Quiz';
import { LoadingState } from '@/components/ui/States';
import { useProgress } from '@/components/providers/progress';
import { getTheoryModule, THEORY_CONCLUSION, THEORY_COUNT } from '@/data/theory';
import { isModuleUnlocked } from '@/lib/progress';

export default function TheoryModulePage({ params }: { params: { moduleId: string } }) {
  const id = Number(params.moduleId);
  const moduleData = useMemo(() => getTheoryModule(id), [id]);
  const { progress, loading } = useProgress();
  const [showQuiz, setShowQuiz] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  if (!moduleData) notFound();

  const unlocked = isModuleUnlocked(progress, id);
  const nextModuleId = id < THEORY_COUNT ? id + 1 : null;

  function backToContent() {
    setShowQuiz(false);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div ref={topRef} className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: '主页', href: '/dashboard' },
          { label: '理论内容', href: '/theory' },
          { label: moduleData.label },
        ]}
      />

      <header className="mt-4">
        <div className="text-sm font-medium text-brand-ink">{moduleData.label}</div>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
          {moduleData.title}
        </h1>
      </header>

      {loading ? (
        <LoadingState />
      ) : !unlocked ? (
        <LockedNotice />
      ) : showQuiz ? (
        <section className="mt-8">
          <button
            onClick={backToContent}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 transition-colors hover:text-brand-ink"
          >
            <ArrowLeft className="h-4 w-4" /> 返回章节内容
          </button>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
            <Quiz moduleId={id} nextModuleId={nextModuleId} onBackToContent={backToContent} />
          </div>
        </section>
      ) : (
        <>
          <article className="mt-7">
            <Markdown>{moduleData.body}</Markdown>
            {id === THEORY_COUNT && THEORY_CONCLUSION && (
              <div className="mt-12 rounded-2xl border border-line bg-surface-2 p-6 sm:p-7">
                <h2 className="mb-3 font-display text-xl font-bold text-ink">结语：整套体系</h2>
                <Markdown>{THEORY_CONCLUSION}</Markdown>
              </div>
            )}
          </article>

          <section className="mt-12 rounded-2xl border border-brand-tint-2 bg-brand-tint/50 p-6 text-center sm:p-8">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-surface text-brand-ink shadow-sm">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">准备好了吗？</h2>
            <p className="mx-auto mt-1.5 max-w-md text-ink-2">
              用一次小测试检验你的理解。达到 70% 即可解锁下一章。
            </p>
            <Button className="mt-5" size="lg" onClick={() => setShowQuiz(true)}>
              开始测试
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

function LockedNotice() {
  return (
    <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line-2 bg-surface px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-ink-3">
        <Lock className="h-6 w-6" />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">本章尚未解锁</h2>
        <p className="mt-1.5 max-w-sm text-sm text-ink-3">
          需要先通过上一章的理解测试，才能开始本章。
        </p>
      </div>
      <Link
        href="/theory"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> 返回理论列表
      </Link>
    </div>
  );
}
