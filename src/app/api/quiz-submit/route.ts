import { NextResponse } from 'next/server';
import { authFromRequest } from '@/lib/server/jwt';
import { getProgress, saveProgress } from '@/lib/server/store';
import { gradeQuiz, type UserAnswer } from '@/lib/quiz';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const user = authFromRequest(req);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  try {
    const { moduleId, answers } = (await req.json()) as {
      moduleId?: number;
      answers?: Record<string, UserAnswer>;
    };

    const result = gradeQuiz(Number(moduleId), answers ?? {});
    if (!result) {
      return NextResponse.json({ error: '无效的模块' }, { status: 400 });
    }

    // Persist: keep the best score, and stay passed once passed.
    const progress = await getProgress(user.id);
    const key = String(result.moduleId);
    const prev = progress.theory[key];
    progress.theory[key] = {
      quizScore: Math.max(result.score, prev?.quizScore ?? 0),
      passed: Boolean(prev?.passed) || result.passed,
      attemptedAt: new Date().toISOString(),
    };
    await saveProgress(user.id, progress);

    return NextResponse.json({ ...result, progress });
  } catch {
    return NextResponse.json({ error: '提交失败，请稍后重试' }, { status: 500 });
  }
}
