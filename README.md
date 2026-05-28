# NorthStar Impex AI 学习平台

An internal training portal that teaches a China-based procurement team how to use AI
(Claude Code on a DeepSeek backend) in daily work. Entirely in Simplified Chinese: one
learning video, six theory chapters with real comprehension quizzes, six practical labs,
and seven AI labs (the six plus a Browser Agents lab). Per-user progress persists.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + `@tailwindcss/typography`
- **Framer Motion** (curtain preloader, page transitions)
- **Lucide** icons, **react-markdown** + **remark-gfm**, **highlight.js**
- **Auth:** custom email/password — JWT (`jsonwebtoken`) + `bcryptjs`, users in **Netlify Blobs**
- **Backend:** Next.js route handlers under `src/app/api/` (no Supabase / Firebase / third-party auth)
- **Fonts:** Space Grotesk + JetBrains Mono, self-hosted via `next/font` (no Google `<link>`;
  loads reliably from mainland China). Chinese text uses the system CJK stack.

## Local development

Zero-config: `npm run dev` uses a local JSON store (`.data/blobs.json`) and a dev JWT
secret, so the full app (login, progress, quizzes) works offline without Netlify.

```bash
npm install
node scripts/seed-local-user.mjs test@demo.com demo1234 "测试用户"   # create a test login
npm run dev                                                          # http://localhost:3000
```

Then log in at `/login` with `test@demo.com` / `demo1234`.

To exercise the real Netlify Blobs backend locally instead, use the Netlify CLI:

```bash
npm i -g netlify-cli
netlify dev          # serves the app + functions + Netlify Blobs context
```

In that case create a `.env.local` from `.env.example` with `JWT_SECRET` and `ADMIN_SECRET`.

## Deploy to Netlify

1. Push this repo to GitHub and create a new site from it in Netlify. Netlify auto-detects
   Next.js and applies its Next runtime (route handlers become functions; Blobs are provisioned
   automatically — no token needed).
2. Set environment variables (Site settings → Environment variables):
   - `JWT_SECRET` — a long random string for signing login tokens
   - `ADMIN_SECRET` — gates user provisioning
3. Deploy. The learning video ships at `public/learning-video.mp4`.

## Provisioning users (no public signup)

The admin creates each account once. Either call the endpoint directly, or use the script:

```bash
SITE_URL=https://your-site.netlify.app ADMIN_SECRET=xxxx \
  node scripts/add-user.mjs someone@northstarimpex.com "their-password" "显示名称"
```

This POSTs to `/api/admin/add-user` with the `x-admin-secret` header. Users log in at `/login`;
there is no self-signup.

## API routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/login` | POST | email + password → JWT (7-day) |
| `/api/verify` | GET | validate Bearer token |
| `/api/progress` | GET / POST | read progress / update video & lab completion |
| `/api/quiz-submit` | POST | grade a quiz, persist best score + pass state |
| `/api/admin/add-user` | POST | admin-only user creation (`x-admin-secret`) |

## Content & data

- Source content (do not paraphrase): `src/content/05-theory-content-chinese.md`,
  `src/content/06-lab-modules-chinese.md`. Imported raw and rendered faithfully.
- `src/content/lab-7-browser-agents.md` — the Browser Agents lab, authored in the same style.
- `src/data/theory.ts`, `src/data/labs.ts` — parse the markdown into modules/labs (fence-aware).
- `src/data/quizzes.ts` — the six comprehension quizzes (real understanding checks, not dummies).

## Project structure

```
src/
  app/
    (app)/            # authenticated shell (RequireAuth + header)
      dashboard, video, theory[/…], labs/practical[/…], labs/ai[/…]
    api/              # route handlers (login, verify, progress, quiz-submit, admin/add-user)
    login/            # public login page
    layout.tsx        # fonts + providers + curtain preloader
    template.tsx      # page transition
  components/         # Logo, Preloader, Quiz, Markdown, CodeBlock, header, labs/, ui/
  data/               # theory, labs, quizzes
  lib/                # api client, auth/progress types & helpers, server/ (jwt, blobs)
  content/            # source markdown
```

See `PRODUCT.md` and `DESIGN.md` for the product and visual systems.
