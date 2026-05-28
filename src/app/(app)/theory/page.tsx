'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight } from 'lucide-react';
import { Breadcrumb, Pill } from '@/components/ui/Indicators';
import { useProgress } from '@/components/providers/progress';
import { THEORY_MODULES } from '@/data/theory';
import { moduleStatus, moduleScore } from '@/lib/progress';
import { cn } from '@/lib/utils';

export default function TheoryListPage() {
  const { progress } = useProgress();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <Breadcrumb items={[{ label: '主页', href: '/dashboard' }, { label: '理论内容' }]} />

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">理论内容</h1>
      <p className="mt-2 max-w-prose text-ink-2">
        六章讲清"为什么"。每章十分钟内读完，章末有一次理解测试。通过当前章，下一章才会解锁。
      </p>

      <ol className="mt-7 flex flex-col gap-3">
        {THEORY_MODULES.map((m, i) => {
          const status = moduleStatus(progress, m.id);
          const locked = status === 'locked';
          const passed = status === 'passed';
          const score = moduleScore(progress, m.id);

          const inner = (
            <>
              <div
                className={cn(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-bold tabular-nums',
                  locked && 'bg-surface-2 text-ink-3',
                  passed && 'bg-success-tint text-success-ink',
                  !locked && !passed && 'bg-brand-tint text-brand-ink',
                )}
              >
                {passed ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : m.id}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-ink-3">{m.label}</div>
                <h2
                  className={cn(
                    'truncate font-display text-base font-semibold sm:text-lg',
                    locked ? 'text-ink-3' : 'text-ink',
                  )}
                >
                  {m.title}
                </h2>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {status === 'passed' && (
                  <Pill tone="success">已通过{score !== null ? ` · ${score}分` : ''}</Pill>
                )}
                {status === 'inProgress' && <Pill tone="brand">进行中</Pill>}
                {status === 'notStarted' && <Pill tone="neutral">未开始</Pill>}
                {status === 'locked' && <Pill tone="muted">未解锁</Pill>}
                {!locked && <ChevronRight className="h-5 w-5 text-ink-3" />}
              </div>
            </>
          );

          const baseRow =
            'flex items-center gap-4 rounded-2xl border bg-surface px-4 py-4 sm:px-5';

          return (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            >
              {locked ? (
                <div
                  className={cn(baseRow, 'cursor-not-allowed border-dashed border-line opacity-80')}
                  title="需要先通过上一章的测试才能解锁"
                >
                  {inner}
                </div>
              ) : (
                <Link
                  href={`/theory/${m.id}`}
                  className={cn(
                    baseRow,
                    'border-line shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-0.5 hover:border-brand-tint-2 hover:shadow-md active:translate-y-0',
                  )}
                >
                  {inner}
                </Link>
              )}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
