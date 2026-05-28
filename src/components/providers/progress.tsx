'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Progress } from '@/lib/types';
import { apiGetProgress, apiUpdateProgress, type ProgressUpdate } from '@/lib/api';
import { emptyProgress } from '@/lib/progress';
import { useAuth } from './auth';

type ProgressContextValue = {
  progress: Progress;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  update: (u: ProgressUpdate) => Promise<void>;
  // Adopt a progress object returned by another endpoint (e.g. quiz submit).
  adopt: (p: Progress) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [progress, setProgress] = useState<Progress>(emptyProgress());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { progress } = await apiGetProgress();
      setProgress(progress);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载进度失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authed') {
      void reload();
    } else if (status === 'guest') {
      setProgress(emptyProgress());
    }
  }, [status, reload]);

  const update = useCallback(async (u: ProgressUpdate) => {
    const { progress } = await apiUpdateProgress(u);
    setProgress(progress);
  }, []);

  const adopt = useCallback((p: Progress) => setProgress(p), []);

  return (
    <ProgressContext.Provider value={{ progress, loading, error, reload, update, adopt }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
