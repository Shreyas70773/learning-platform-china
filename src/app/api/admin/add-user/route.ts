import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getUser, saveUser } from '@/lib/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin-only user provisioning. Gated by the ADMIN_SECRET env var, sent in the
// `x-admin-secret` header. There is no public signup.
export async function POST(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const provided = req.headers.get('x-admin-secret');
  if (!adminSecret || provided !== adminSecret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { email, name, password } = (await req.json()) as {
      email?: string;
      name?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await getUser(normalizedEmail)) {
      return NextResponse.json({ error: 'user already exists' }, { status: 409 });
    }

    const user = {
      id: randomUUID(),
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    };
    await saveUser(user);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch {
    return NextResponse.json({ error: 'failed to create user' }, { status: 500 });
  }
}
