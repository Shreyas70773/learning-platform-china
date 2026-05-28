import { AlertCircle, Loader2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-ink-3', className)} aria-label="加载中" />;
}

export function LoadingState({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-3">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  message = '出了一点问题。',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-danger-tint text-danger-ink">
        <AlertCircle className="h-6 w-6" />
      </div>
      <p className="max-w-sm text-ink-2">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          重试
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line-2 bg-surface/60 px-6 py-14 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-2 text-ink-3">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-3">{description}</p>}
    </div>
  );
}
