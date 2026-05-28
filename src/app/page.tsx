'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth';

// Root: once auth resolves, send authed users to the dashboard and everyone
// else to login. The curtain preloader covers this resolution on first load.
export default function Home() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authed') router.replace('/dashboard');
    else if (status === 'guest') router.replace('/login');
  }, [status, router]);

  return <div className="min-h-dvh bg-paper" aria-hidden />;
}
