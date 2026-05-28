import type { AuthUser, Progress } from '@/lib/types';
import type { QuizResult, UserAnswer } from '@/lib/quiz';

const TOKEN_KEY = 'nsi_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError('网络连接失败，请检查网络后重试', 0);
  }

  const data = await res.json().catch(() => ({}) as Record<string, unknown>);
  if (!res.ok) {
    const message = (data as { error?: string }).error ?? '请求失败，请稍后重试';
    throw new ApiError(message, res.status);
  }
  return data as T;
}

export function apiLogin(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function apiSignup(name: string, email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function apiVerify() {
  return request<{ user: AuthUser }>('/api/verify');
}

export function apiGetProgress() {
  return request<{ progress: Progress }>('/api/progress');
}

export type ProgressUpdate =
  | { type: 'video'; completed: boolean }
  | { type: 'lab'; track: 'practical' | 'ai'; id: number; completed: boolean };

export function apiUpdateProgress(update: ProgressUpdate) {
  return request<{ progress: Progress }>('/api/progress', {
    method: 'POST',
    body: JSON.stringify(update),
  });
}

export function apiSubmitQuiz(moduleId: number, answers: Record<string, UserAnswer>) {
  return request<QuizResult & { progress: Progress }>('/api/quiz-submit', {
    method: 'POST',
    body: JSON.stringify({ moduleId, answers }),
  });
}
