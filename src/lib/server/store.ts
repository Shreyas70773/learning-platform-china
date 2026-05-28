// Server-only: Netlify Blobs access. Imported exclusively by Node-runtime
// route handlers. When deployed on Netlify, the Blobs context is injected
// automatically (no token needed). Locally, run via `netlify dev`.
import { getStore } from '@netlify/blobs';
import type { Progress } from '@/lib/types';
import { normalizeProgress, emptyProgress } from '@/lib/progress';

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

function store() {
  // A single namespace, keyed `user:<email>` and `progress:<userId>`.
  return getStore({ name: 'nsi', consistency: 'strong' });
}

function userKey(email: string): string {
  return `user:${email.trim().toLowerCase()}`;
}

function progressKey(userId: string): string {
  return `progress:${userId}`;
}

export async function getUser(email: string): Promise<UserRecord | null> {
  return (await store().get(userKey(email), { type: 'json' })) as UserRecord | null;
}

export async function saveUser(user: UserRecord): Promise<void> {
  await store().setJSON(userKey(user.email), user);
}

export async function getProgress(userId: string): Promise<Progress> {
  const raw = (await store().get(progressKey(userId), {
    type: 'json',
  })) as Partial<Progress> | null;
  return raw ? normalizeProgress(raw) : emptyProgress();
}

export async function saveProgress(userId: string, progress: Progress): Promise<void> {
  await store().setJSON(progressKey(userId), progress);
}
