import Link from 'next/link';
import { Fragment } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'brand' | 'success' | 'muted';

const TONES: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-2',
  brand: 'bg-brand-tint text-brand-ink',
  success: 'bg-success-tint text-success-ink',
  muted: 'bg-surface-2 text-ink-3',
};

export function Pill({
  tone = 'neutral',
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function ProgressMeter({
  done,
  total,
  label,
  className,
}: {
  done: number;
  total: number;
  label?: string;
  className?: string;
}) {
  const ratio = total > 0 ? Math.min(1, done / total) : 0;
  const complete = done >= total && total > 0;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-3">{label ?? '进度'}</span>
        <span className={cn('font-mono font-medium tnum', complete ? 'text-success-ink' : 'text-ink-2')}>
          {done}/{total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            'h-full origin-left rounded-full transition-transform duration-500 ease-out-quint',
            complete ? 'bg-success' : 'bg-brand',
          )}
          style={{ transform: `scaleX(${ratio})` }}
        />
      </div>
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="面包屑" className="flex flex-wrap items-center gap-1.5 text-sm text-ink-3">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-line-2">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="rounded transition-colors duration-150 hover:text-brand-ink"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-ink-2">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
