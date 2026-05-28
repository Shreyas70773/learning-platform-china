'use client';

import { useEffect, useState } from 'react';
import { Check, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = { label: string; title: string };

// Per-step ticking, persisted in localStorage (a local convenience; lab-level
// completion is what syncs to the backend). Keyed by track + lab id.
export function LabSteps({ storageKey, steps }: { storageKey: string; steps: Step[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => steps.map(() => false));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const arr = JSON.parse(raw) as boolean[];
        if (Array.isArray(arr) && arr.length === steps.length) setChecked(arr);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  function toggle(i: number) {
    setChecked((prev) => {
      const nextArr = prev.map((v, idx) => (idx === i ? !v : v));
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextArr));
      } catch {
        /* ignore */
      }
      return nextArr;
    });
  }

  if (steps.length === 0) return null;
  const doneCount = checked.filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-display font-semibold text-ink">
          <ListChecks className="h-5 w-5 text-brand-ink" />
          动手清单
        </div>
        <span className="font-mono text-sm font-medium tnum text-ink-3">
          {ready ? doneCount : 0}/{steps.length} 步
        </span>
      </div>
      <ol className="flex flex-col gap-1">
        {steps.map((step, i) => {
          const isDone = ready && checked[i];
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-surface-2"
              >
                <span
                  className={cn(
                    'grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors duration-150',
                    isDone
                      ? 'border-transparent bg-success text-[oklch(0.99_0.01_60)]'
                      : 'border-line-2 group-hover:border-ink-3/50',
                  )}
                >
                  {isDone && <Check className="h-3.5 w-3.5" />}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    isDone ? 'text-ink-3 line-through' : 'text-ink-2',
                  )}
                >
                  <span className="font-medium text-ink-3">{step.label}</span>
                  <span className="mx-1.5 text-line-2">·</span>
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
