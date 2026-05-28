// Server-only KV access. Two backends:
//   - Netlify Blobs   — used in production and under `netlify dev` (context injected)
//   - local JSON file — used for plain `npm run dev`, so the app is fully testable
//                        offline without the Netlify CLI (.data/blobs.json)
// Keyed `user:<email>` and `progress:<userId>`.
import { promises as fs } from 'fs';
import path from 'path';
import type { Progress } from '@/lib/types';
import { normalizeProgress, emptyProgress } from '@/lib/progress';

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

const useFile =
  process.env.NODE_ENV !== 'production' &&
  !process.env.NETLIFY &&
  !process.env.NETLIFY_DEV;

const DATA_FILE = path.join(process.cwd(), '.data', 'blobs.json');

async function fileReadAll(): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

async function kvGet<T>(key: string): Promise<T | null> {
  if (useFile) {
    const all = await fileReadAll();
    return (all[key] as T) ?? null;
  }
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: 'nsi', consistency: 'strong' });
  return (await store.get(key, { type: 'json' })) as T | null;
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (useFile) {
    const all = await fileReadAll();
    all[key] = value;
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf8');
    return;
  }
  const { getStore } = await import('@netlify/blobs');
  const store = getStore({ name: 'nsi', consistency: 'strong' });
  await store.setJSON(key, value);
}

const userKey = (email: string) => `user:${email.trim().toLowerCase()}`;
const progressKey = (userId: string) => `progress:${userId}`;

export async function getUser(email: string): Promise<UserRecord | null> {
  return kvGet<UserRecord>(userKey(email));
}

export async function saveUser(user: UserRecord): Promise<void> {
  await kvSet(userKey(user.email), user);
}

export async function getProgress(userId: string): Promise<Progress> {
  const raw = await kvGet<Partial<Progress>>(progressKey(userId));
  return raw ? normalizeProgress(raw) : emptyProgress();
}

export async function saveProgress(userId: string, progress: Progress): Promise<void> {
  await kvSet(progressKey(userId), progress);
}
