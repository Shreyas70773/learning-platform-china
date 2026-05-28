import { RequireAuth } from '@/components/RequireAuth';
import { AppHeader } from '@/components/AppHeader';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </RequireAuth>
  );
}
