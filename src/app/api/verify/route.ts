import { NextResponse } from 'next/server';
import { authFromRequest } from '@/lib/server/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = authFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: '未登录或登录已过期' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
