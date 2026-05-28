'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '@/lib/types';
import { apiLogin, apiVerify, clearToken, getToken, setToken } from '@/lib/api';

type AuthStatus = 'loading' | 'authed' | 'guest';

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  // Validate any stored token once on the client.
  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setStatus('guest');
      return;
    }
    apiVerify()
      .then(({ user }) => {
        if (cancelled) return;
        setUser(user);
        setStatus('authed');
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setUser(null);
        setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    setToken(token);
    setUser(user);
    setStatus('authed');
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus('guest');
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
