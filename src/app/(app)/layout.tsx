import { RequireAuth } from '@/components/RequireAuth';
import { AppHeader } from '@/components/AppHeader';
import { ScrollProgress } from '@/components/ScrollProgress';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <ScrollProgress />
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </RequireAuth>
  );
}
