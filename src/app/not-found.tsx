import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { buttonClasses } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div className="flex flex-col items-center gap-5">
        <Logo variant="mark" className="text-5xl" />
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">页面未找到</h1>
          <p className="mt-1.5 text-ink-3">你访问的页面不存在，或已被移动。</p>
        </div>
        <Link href="/dashboard" className={buttonClasses('primary', 'md')}>
          返回主页
        </Link>
      </div>
    </main>
  );
}
