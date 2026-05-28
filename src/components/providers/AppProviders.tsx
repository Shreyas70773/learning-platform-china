'use client';

import { AuthProvider } from './auth';
import { ProgressProvider } from './progress';
import { Preloader } from '@/components/Preloader';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>
        <Preloader />
        {children}
      </ProgressProvider>
    </AuthProvider>
  );
}
