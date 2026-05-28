import { NextResponse } from 'next/server';
import { authFromRequest } from '@/lib/server/jwt';
import { getProgress, saveProgress } from '@/lib/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = authFromRequest(req);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const progress = await getProgress(user.id);
  return NextResponse.json({ progress });
}

type Update =
  | { type: 'video'; completed: boolean }
  | { type: 'lab'; track: 'practical' | 'ai'; id: number; completed: boolean };

export async function POST(req: Request) {
  const user = authFromRequest(req);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const body = (await req.json()) as Update;
    const progress = await getProgress(user.id);
    const now = new Date().toISOString();

    if (body.type === 'video') {
      progress.video = body.completed
        ? { completed: true, completedAt: now }
        : { completed: false };
    } else if (body.type === 'lab' && (body.track === 'practical' || body.track === 'ai')) {
      const bucket = body.track === 'practical' ? progress.labsPractical : progress.labsAI;
      bucket[String(body.id)] = body.completed
        ? { completed: true, completedAt: now }
        : { completed: false };
    } else {
      return NextResponse.json({ error: '无效的请求' }, { status: 400 });
    }

    await saveProgress(user.id, progress);
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: '保存失败，请稍后重试' }, { status: 500 });
  }
}
