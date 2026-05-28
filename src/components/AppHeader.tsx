'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/components/providers/auth';

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/dashboard"
          className="rounded-md transition-transform duration-150 ease-out-quint active:scale-[0.98]"
          aria-label="返回主页"
        >
          <Logo variant="full" className="text-lg" />
        </Link>
        <div className="flex items-center gap-1.5">
          {user && (
            <span className="mr-1 hidden text-sm text-ink-2 sm:inline">{user.name}</span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-2 transition-[transform,background-color,color] duration-150 ease-out-quint hover:bg-surface-2 hover:text-ink active:scale-[0.97]"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">退出</span>
          </button>
        </div>
      </div>
    </header>
  );
}
