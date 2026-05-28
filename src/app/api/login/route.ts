import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUser } from '@/lib/server/store';
import { signToken } from '@/lib/server/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: '请输入邮箱和密码' }, { status: 400 });
    }

    const user = await getUser(email);
    // Same message whether the user is missing or the password is wrong.
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !ok) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const authUser = { id: user.id, email: user.email, name: user.name };
    return NextResponse.json({ token: signToken(authUser), user: authUser });
  } catch {
    return NextResponse.json({ error: '服务器出错，请稍后重试' }, { status: 500 });
  }
}
