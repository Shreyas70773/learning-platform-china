#!/usr/bin/env node
// Provision a learning-platform user. There is no public signup.
//
// Usage:
//   SITE_URL=https://your-site.netlify.app ADMIN_SECRET=xxxx \
//     node scripts/add-user.mjs <email> <password> ["显示名称"]

const [, , email, password, name] = process.argv;
const base = process.env.SITE_URL;
const secret = process.env.ADMIN_SECRET;

if (!email || !password) {
  console.error(
    '用法: SITE_URL=... ADMIN_SECRET=... node scripts/add-user.mjs <email> <password> [name]',
  );
  process.exit(1);
}
if (!base || !secret) {
  console.error('请设置环境变量 SITE_URL 与 ADMIN_SECRET');
  process.exit(1);
}

const res = await fetch(`${base.replace(/\/$/, '')}/api/admin/add-user`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
  body: JSON.stringify({ email, password, name }),
});

const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error(`创建失败 (${res.status}):`, data.error ?? '');
  process.exit(1);
}
console.log('已创建用户:', data.user?.email);
