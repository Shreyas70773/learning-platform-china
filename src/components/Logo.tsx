import { cn } from '@/lib/utils';
import { BRAND_NAME, STAR_PATH } from '@/lib/brand';

type Tone = 'brand' | 'inverse';

const STAR_FILL: Record<Tone, string> = {
  brand: 'var(--brand)',
  inverse: 'oklch(0.97 0.012 60)',
};

const WORD_COLOR: Record<Tone, string> = {
  brand: 'text-ink',
  inverse: 'text-[oklch(0.97_0.012_60)]',
};

export function Logo({
  variant = 'full',
  tone = 'brand',
  className,
}: {
  variant?: 'full' | 'mark';
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-2.5 font-display', className)}
      aria-label={BRAND_NAME}
      role="img"
    >
      <svg
        viewBox="0 0 100 100"
        className="h-[1.1em] w-[1.1em] shrink-0"
        aria-hidden="true"
      >
        <path d={STAR_PATH} fill={STAR_FILL[tone]} />
      </svg>
      {variant === 'full' && (
        <span
          className={cn(
            'whitespace-nowrap font-bold leading-none tracking-tight',
            WORD_COLOR[tone],
          )}
        >
          NorthStar&nbsp;Impex
        </span>
      )}
    </span>
  );
}
