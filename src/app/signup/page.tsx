'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/providers/auth';
import { ApiError } from '@/lib/api';
import { PLATFORM_SHORT } from '@/lib/brand';

export default function SignupPage() {
  const { status, signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authed') router.replace('/dashboard');
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('密码至少需要 6 位');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '注册失败，请稍后重试');
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, transform: 'translateY(10px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="w-full max-w-[26rem]"
      >
        <div className="mb-7 flex flex-col items-center gap-2.5">
          <Logo variant="full" className="text-2xl" />
          <span className="text-xs font-medium tracking-[0.28em] text-ink-3">
            {PLATFORM_SHORT}
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-7 shadow-md sm:p-8">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">创建账号</h1>
          <p className="mt-1.5 text-sm text-ink-3">注册后即可开始学习，进度会单独为你保存。</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-ink-2">
                姓名
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 rounded-lg border border-line-2 bg-paper px-3.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-brand"
                placeholder="你的名字"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-ink-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-lg border border-line-2 bg-paper px-3.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-brand"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-ink-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-lg border border-line-2 bg-paper px-3.5 text-ink outline-none transition-colors duration-150 placeholder:text-ink-3 focus:border-brand"
                placeholder="至少 6 位"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg bg-danger-tint px-3.5 py-2.5 text-sm text-danger-ink"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="mt-1 w-full">
              注册并开始学习
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-ink-3">
          已经有账号了？{' '}
          <Link href="/login" className="font-medium text-brand-ink hover:underline">
            去登录
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
