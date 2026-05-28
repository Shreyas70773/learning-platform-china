#!/usr/bin/env node
// Create a user in the LOCAL dev store (.data/blobs.json) so you can log in with
// `npm run dev` — no Netlify, no env vars, no running server required.
//
// Usage:
//   node scripts/seed-local-user.mjs <email> <password> ["显示名称"]
//
// (For the deployed site, use scripts/add-user.mjs instead.)

import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const [, , email, password, name] = process.argv;
if (!email || !password) {
  console.error('用法: node scripts/seed-local-user.mjs <email> <password> [name]');
  process.exit(1);
}

const DATA_FILE = path.join(process.cwd(), '.data', 'blobs.json');
let all = {};
try {
  all = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
} catch {
  /* fresh store */
}

const e = email.trim().toLowerCase();
all[`user:${e}`] = {
  id: randomUUID(),
  email: e,
  name: name || e,
  passwordHash: await bcrypt.hash(password, 10),
  createdAt: new Date().toISOString(),
};

await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), 'utf8');
console.log(`已在本地创建测试用户：${e}（数据写入 .data/blobs.json）`);
