import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getUser, saveUser } from '@/lib/server/store';
import { signToken } from '@/lib/server/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Public self-service signup: each team member creates their own account, with
// their own progress. No email verification. On success, the user is logged in.
export async function POST(req: Request) {
  try {
    const { name, email, password } = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少需要 6 位' }, { status: 400 });
    }
    if (await getUser(normalizedEmail)) {
      return NextResponse.json({ error: '该邮箱已注册，请直接登录' }, { status: 409 });
    }

    const user = {
      id: randomUUID(),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    };
    await saveUser(user);

    const authUser = { id: user.id, email: user.email, name: user.name };
    return NextResponse.json({ token: signToken(authUser), user: authUser });
  } catch (e) {
    console.error('signup failed:', e);
    const detail = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `注册失败：${detail}` }, { status: 500 });
  }
}
