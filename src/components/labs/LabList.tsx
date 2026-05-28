'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Check, ChevronRight } from 'lucide-react';
import { Breadcrumb, Pill, ProgressMeter } from '@/components/ui/Indicators';
import { useProgress } from '@/components/providers/progress';
import { formatMinutes, type Lab } from '@/data/labs';
import { labDone, labsDoneCount } from '@/lib/progress';
import { cn } from '@/lib/utils';

export function LabList({
  track,
  labs,
  title,
  subtitle,
}: {
  track: 'practical' | 'ai';
  labs: Lab[];
  title: string;
  subtitle: string;
}) {
  const { progress } = useProgress();
  const crumbLabel = track === 'practical' ? '实战实验室' : 'AI 实验室';

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <Breadcrumb items={[{ label: '主页', href: '/dashboard' }, { label: crumbLabel }]} />

      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 max-w-prose text-ink-2">{subtitle}</p>

      <div className="mt-6">
        <ProgressMeter done={labsDoneCount(progress, track)} total={labs.length} label="实验完成" />
      </div>

      <ol className="mt-7 flex flex-col gap-3">
        {labs.map((lab, i) => {
          const isDone = labDone(progress, track, lab.id);
          return (
            <motion.li
              key={lab.id}
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
            >
              <Link
                href={`/labs/${track}/${lab.id}`}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-surface px-4 py-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out-quint hover:-translate-y-0.5 hover:border-brand-tint-2 hover:shadow-md active:translate-y-0 sm:px-5"
              >
                <div
                  className={cn(
                    'grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-lg font-bold tabular-nums',
                    isDone ? 'bg-success-tint text-success-ink' : 'bg-brand-tint text-brand-ink',
                  )}
                >
                  {isDone ? <Check className="h-5 w-5" /> : lab.id}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ink-3">Lab {lab.id}</span>
                    <Pill tone="neutral" icon={<Clock className="h-3 w-3" />} className="py-0.5">
                      {formatMinutes(lab.minutes)}
                    </Pill>
                    {isDone && <Pill tone="success">已完成</Pill>}
                  </div>
                  <h2 className="mt-1 font-display text-base font-semibold text-ink sm:text-lg">
                    {lab.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{lab.blurb}</p>
                </div>

                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-ink-3 transition-transform duration-200 ease-out-quint group-hover:translate-x-0.5 group-hover:text-brand-ink" />
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
