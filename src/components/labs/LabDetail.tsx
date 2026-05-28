'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock, Check, CircleCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Breadcrumb, Pill } from '@/components/ui/Indicators';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Markdown } from '@/components/Markdown';
import { LabSteps } from './LabSteps';
import { useProgress } from '@/components/providers/progress';
import { formatMinutes, type Lab } from '@/data/labs';
import { promoteLabSteps, extractLabSteps } from '@/lib/markdown';
import { labDone } from '@/lib/progress';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';

export function LabDetail({
  track,
  lab,
  list,
}: {
  track: 'practical' | 'ai';
  lab: Lab;
  list: Lab[];
}) {
  const { progress, update } = useProgress();
  const done = labDone(progress, track, lab.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = useMemo(() => extractLabSteps(lab.body), [lab.body]);
  const body = useMemo(() => promoteLabSteps(lab.body), [lab.body]);

  const idx = list.findIndex((l) => l.id === lab.id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;

  const crumbLabel = track === 'practical' ? '实战实验室' : 'AI 实验室';
  const listHref = `/labs/${track}`;

  async function markComplete() {
    setSaving(true);
    setError(null);
    try {
      await update({ type: 'lab', track, id: lab.id, completed: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
      <Breadcrumb
        items={[
          { label: '主页', href: '/dashboard' },
          { label: crumbLabel, href: listHref },
          { label: `Lab ${lab.id}` },
        ]}
      />

      <header className="mt-4">
        <div className="text-sm font-medium text-brand-ink">Lab {lab.id}</div>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-[2.1rem]">
          {lab.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <Pill tone="neutral" icon={<Clock className="h-3.5 w-3.5" />}>
            {formatMinutes(lab.minutes)}
          </Pill>
          {done && (
            <Pill tone="success" icon={<CircleCheck className="h-3.5 w-3.5" />}>
              已完成
            </Pill>
          )}
        </div>
      </header>

      {steps.length > 0 && (
        <div className="mt-7">
          <LabSteps storageKey={`nsi_steps_${track}_${lab.id}`} steps={steps} />
        </div>
      )}

      <article className="mt-8">
        <Markdown>{body}</Markdown>
      </article>

      <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {done ? (
          <div className="flex items-center gap-2 text-success-ink">
            <CircleCheck className="h-5 w-5" />
            <span className="text-sm font-medium">这个实验你已完成</span>
          </div>
        ) : (
          <p className="text-sm text-ink-3">做完之后，把它标记为完成。</p>
        )}
        <div className="flex items-center gap-3">
          {!done && (
            <Button onClick={markComplete} loading={saving}>
              <Check className="h-4 w-4" />
              标记此实验为完成
            </Button>
          )}
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-danger-ink">{error}</p>}

      <nav className="mt-8 flex items-center justify-between gap-3">
        {prev ? (
          <Link href={`/labs/${track}/${prev.id}`} className={buttonClasses('secondary', 'sm')}>
            <ArrowLeft className="h-4 w-4" /> 上一个
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/labs/${track}/${next.id}`} className={buttonClasses('secondary', 'sm')}>
            下一个 <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <Link href={listHref} className={buttonClasses('ghost', 'sm')}>
            返回列表
          </Link>
        )}
      </nav>
    </div>
  );
}
