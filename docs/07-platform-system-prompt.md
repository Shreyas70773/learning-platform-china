# System Prompt — Northstar Impacts AI Learning Platform

You are building a complete internal learning platform called the **Northstar Impacts AI Learning Platform**. This document is your full specification. Read all of it before starting. Build the entire thing end-to-end, deployable to Netlify, with the UI in Simplified Chinese.

---

## 1. Mission and audience

This is an internal training portal for a Chinese-based procurement team learning to use AI in their daily work (sourcing steel, contacting suppliers, building RFQs, etc.). Their environment is Claude Code on a DeepSeek model backend. They access the platform from mainland China; the admin (Northstar Impacts) accesses it from India.

The platform must:

- Load and work reliably from mainland China and India (host on Netlify, no Supabase, no GFW-blocked dependencies).
- Be entirely in Simplified Chinese for users (UI labels, navigation, buttons, error messages).
- Feel seamless — one part flowing into the next, no jarring transitions, no broken states.
- Have genuinely excellent UI and UX. The user has been explicit that this matters.

---

## 2. Tech stack (fixed choices)

- **Framework:** React 18+ with **Vite**.
- **Styling:** **Tailwind CSS**.
- **Animation:** **Framer Motion** (required for the curtain preloader and page transitions).
- **Icons:** **Lucide React**.
- **Routing:** **React Router** (v6+).
- **Auth:** Custom email/password using **Netlify Functions + bcrypt**, with user records in **Netlify Blobs** (Netlify's own key-value store). Do not use Supabase, Firebase Auth, Auth0, or Clerk.
- **Progress storage:** Netlify Blobs (one key per user, JSON value with completion + quiz scores).
- **Deployment:** Netlify (Vite build, Functions in `netlify/functions/`).

If you would benefit from any UI component primitives, use **shadcn/ui** (it sits on top of Radix and Tailwind — no extra runtime dependencies that would matter from China).

---

## 3. Brand and visual identity

- **Company name:** Northstar Impacts
- **Platform name:** Northstar Impacts AI 学习平台 (UI label)
- **Logo:** Northstar Impacts logo, provided as `public/logo.svg` (or `.png`). Place it where placeholder until provided.
- **Color palette:** Pick a professional, modern palette anchored on the brand. If no brand colors are provided, default to a deep navy primary (`#0B1F3A` range), a warm accent (`#E8B547` range — "northstar gold"), neutral grays for body, and generous whitespace.
- **Typography:** A clean modern sans for UI (Inter or similar via Google Fonts — check it's fetchable in China; if uncertain, self-host the font files in `public/fonts/`). For Chinese text, ensure a fallback to `Noto Sans SC` or system Chinese fonts.
- **Tone of visuals:** Professional, not flashy. Substance over decoration. Generous whitespace. No stock illustrations.

The user will provide three or four UI/UX design skills (Anthropic SKILL.md format) — **read those first** before designing components and follow their guidance for spacing, typography, color tokens, and component patterns.

---

## 4. App routes and structure

```
/                       Preloader → redirects based on auth state
/login                  Login page
/dashboard              Main dashboard (4 large cards)
/video                  Watch the learning video
/theory                 Theory module list
/theory/:moduleId       Single theory module (1 through 6) + quiz at the end
/labs/practical         Practical Labs list
/labs/practical/:labId  Single practical lab
/labs/ai                AI Labs list (7 labs — six topics plus Browser Agents)
/labs/ai/:labId         Single AI lab
```

All routes after `/login` require auth. Unauthenticated requests redirect to `/login`.

---

## 5. The preloader (curtain animation)

Show on **every** site load, before the first route renders.

**Visual:**
- Full-viewport overlay, fixed position, top-most z-index.
- The Northstar Impacts logo is centered.
- Background of the overlay is the brand primary color (deep navy by default).

**Animation sequence (Framer Motion):**
1. Overlay starts covering the full viewport. Logo appears centered, fading in over ~300 ms.
2. Logo holds for ~500 ms.
3. The entire overlay (logo included) slides **upward** out of the viewport — `translateY(-100%)` — over ~800 ms with `ease: [0.65, 0, 0.35, 1]` (a sharp-then-smooth cubic-bezier that feels like a stage curtain rising).
4. Once the curtain is gone, the underlying route is interactive.

**Total duration:** ~1.6 seconds.

**On subsequent navigations within the app:** do *not* re-run the preloader. Only on a fresh page load. Use a small Framer Motion page-transition (fade or subtle slide) for in-app navigation.

---

## 6. Login page (`/login`)

**Layout:** Centered card on a clean background. The card contains:

- Northstar Impacts logo at the top (smaller than preloader).
- Heading: 欢迎回来 (Welcome back).
- Email field (`type=email`).
- Password field (`type=password`).
- "Remember me" toggle (optional).
- Login button (登录).
- Inline error message area below the form for failed logins (e.g. "邮箱或密码错误").

**Auth flow:**
1. User submits credentials.
2. POST to `/.netlify/functions/login` with `{ email, password }`.
3. The function reads the user record from Netlify Blobs (key: `user:<email>`), uses bcrypt to compare the hash, and on success issues a signed JWT (use `jsonwebtoken` library, secret in environment variable `JWT_SECRET`) with a 7-day expiry.
4. Frontend stores the JWT in `localStorage` under key `nsi_token` and redirects to `/dashboard`.
5. All authed pages and Function calls verify the JWT.

**User provisioning:** there is no public signup. A separate `addUser.js` Netlify Function (or admin script) creates user records — admin runs it once per team member, providing email and a default password. User can change their password from a profile page (optional v2 feature; skip for v1).

---

## 7. Dashboard (`/dashboard`)

**Top of page:** small header bar with the Northstar Impacts logo on the left, the user's name + a logout button on the right. Logout clears the JWT and redirects to `/login`.

**Main area:** four large clickable cards in a 2×2 grid (or 1 column on mobile). Each card:

- A clean icon (Lucide React).
- A bold Chinese title.
- A short Chinese description.
- A subtle progress indicator (e.g. "已完成 3/6 章" — "3/6 chapters complete") for sections that track progress.
- Hover state: slight elevation and accent border.

**The four cards:**

1. **看学习视频** (Watch the learning video)
   - Description: 看完整概念视频，了解 AI 在采购中的应用 (Watch the full conceptual video — AI in procurement)
   - Click → `/video`

2. **阅读理论内容** (Read the theory content)
   - Description: 六章详细内容，每章后有理解测试 (Six detailed chapters, each with a comprehension quiz at the end)
   - Progress: `X/6 章完成`
   - Click → `/theory`

3. **实战实验室** (Practical Labs)
   - Description: 六个动手实验，跟着步骤亲自做一遍 (Six hands-on labs — follow the steps and do it yourself)
   - Progress: `X/6 实验完成`
   - Click → `/labs/practical`

4. **AI 实验室** (AI Labs)
   - Description: 用 AI 完成实验，加上浏览器代理介绍 (Same labs done with AI, plus an introduction to browser agents)
   - Progress: `X/7 实验完成`
   - Click → `/labs/ai`

---

## 8. Video section (`/video`)

- Centered video player (use the native `<video>` element with controls).
- Video file: `public/learning-video.mp4` (admin will place this file).
- Below the player: a short Chinese caption explaining what the video covers.
- A "标记为完成" (Mark as complete) button that updates progress and returns to dashboard.
- "返回主页" (Back to dashboard) link in the header.

---

## 9. Theory section (`/theory` and `/theory/:moduleId`)

### `/theory` (list view)

A vertical list of the six modules, each as a card:

1. 第一章: API — 软件之间的对话
2. 第二章: MCP — 给 AI 装上"双手"
3. 第三章: 技能 (Skills) — 把你的方法写下来一次
4. 第四章: 子代理 — 专门化的助手
5. 第五章: 多代理编排 — 协调多个 AI 一起干活
6. 第六章: 评估 — 知道 AI 是否真的在工作

Each card shows: chapter number, title, completion status (未开始 / 进行中 / 已通过), and the user's quiz score if they've taken it.

Modules unlock sequentially — Module N is locked until Module N-1's quiz is passed. Show locked modules with a lock icon and a tooltip explaining they need to complete the previous module's quiz first.

### `/theory/:moduleId` (single module)

**Top:** breadcrumb (主页 / 理论内容 / 第 X 章). Module title.

**Body:** the content of that module, pulled from `05-theory-content-chinese.md`. Render the markdown to clean HTML — proper headings, paragraphs, code blocks, emphasis. Use a markdown library (`react-markdown` + `remark-gfm`). Tailwind Typography (`@tailwindcss/typography`) for readable prose.

**At the end of the chapter content:** a "开始测试" (Start the quiz) button. Clicking it reveals the quiz inline (or navigates to a quiz subpage — your choice, but inline is smoother).

---

## 10. Quiz system (the part that must NOT be dummy)

This is the hardest part to get right. Generate the quizzes with **real care** — they are how the team proves to themselves they understood, not box-checking.

### Quiz structure per module

- **8 to 12 questions** per quiz.
- **Mix of question types:**
  - Multiple choice (single correct answer): 4–5 per quiz
  - Multiple correct (more than one option may be correct, learner must select all): 2–3 per quiz
  - Short answer / fill-in-the-blank: 2–3 per quiz (compare with a list of acceptable answers, case-insensitive, whitespace-tolerant)
- **Question content rules** (this is the bar — apply it strictly):
  - Questions must test **understanding**, not memorization. Ask "why," "when," and "what would you do" — not just "what is."
  - Include at least one **applied scenario** per quiz ("Given that you need to compare three supplier quotes in different currencies, which of the following would you use, and why?").
  - Include at least one **"when NOT to use"** question per quiz. This is the difference between understanding and cargo-culting.
  - Include at least one **composition** question per quiz where the learner must explain how the current concept relates to one of the others (e.g. "MCP and Skills — what's the difference, and why do you need both?").
  - No trick questions. No questions that hinge on a single word in the source text.
  - Distractors (wrong MC answers) should be **plausible** — represent common misconceptions, not obviously wrong throwaways.

### Quiz scoring

- Passing score: **70%** (calculate as `correct / total >= 0.7`).
- Below 70%: show a clear Chinese message:
  > "你的得分是 X%。建议你回到本章内容重新看一遍，或者把你不理解的部分直接问你的 AI 助手——它可以解释得更详细。等你觉得准备好了再来一次测试。"
  >
  > (Your score is X%. We recommend going back through the chapter, or asking your AI assistant about the parts that are unclear — it can explain in more depth. Come back to the quiz when you're ready.)
- After answering each question, show inline feedback: ✅ or ❌ with a brief explanation of why. This is how learning happens. Do not hide the right answer until the end.
- On passing: a clean "通过" (Passed) screen with the score, and a "进入下一章" (Continue to next chapter) button.

### How to generate the actual quiz questions

For each of the six modules, read the corresponding chapter in `05-theory-content-chinese.md` carefully. Write the questions so a learner who genuinely absorbed the chapter would pass, and one who skimmed would fail. Sample question patterns to use:

- "API 是什么？请选出最准确的描述：" (multiple choice, definition)
- "你想让 Claude 读取本机的报价文件并把数据整理成表格。下面哪两个工具/概念是必需的？" (multi-select, applied)
- "下面哪种情况下，你**不应该**用多代理编排？" (single MC, "when not")
- "MCP 和 Skills 各自解决了什么不同的问题？" (short answer, composition)
- "为什么在我们的 DeepSeek 后端上，评估（Evals）特别重要？" (short answer, applied to their reality)

Generate the full quiz JSON for all six modules. Store quiz definitions in a single TypeScript file: `src/data/quizzes.ts`. Schema:

```ts
type Question = {
  id: string;
  type: 'single' | 'multiple' | 'shortAnswer';
  question: string;          // Chinese
  options?: string[];        // for single/multiple
  correctAnswer: number | number[] | string[]; // index for single, indexes for multiple, accepted strings for shortAnswer
  explanation: string;       // Chinese — shown after answer
};

type Quiz = {
  moduleId: 1 | 2 | 3 | 4 | 5 | 6;
  questions: Question[];
};
```

---

## 11. Practical Labs section (`/labs/practical`)

### `/labs/practical` (list view)

The six labs from `06-lab-modules-chinese.md`, each as a card with title, brief description, estimated time, and completion status.

### `/labs/practical/:labId` (single lab)

Render the lab markdown content. Critical UX requirements:

- **All Chinese prompts that the user pastes into Claude Code must be in clearly-bordered, copyable code blocks** with a "复制" (Copy) button on each — one click copies to clipboard.
- **All shell commands** likewise in copyable code blocks.
- **All Python or other code** in syntax-highlighted code blocks (use `react-syntax-highlighter` or similar) with a copy button.
- Step numbering must be clear and large.
- An "标记此实验为完成" (Mark this lab complete) button at the bottom.
- A subtle progress dot/checkmark next to each step the user can manually tick off as they go (stored in localStorage, syncs to Netlify Blobs).

---

## 12. AI Labs section (`/labs/ai` and `/labs/ai/:labId`)

Same six labs as Practical Labs, plus a **seventh lab on Browser Agents.**

### Lab 7: 浏览器代理 (Browser Agents)

This is a new lab you generate. Goal: introduce the team to AI browser agents — AIs that drive a real browser on the user's behalf to do research, fill forms, scrape data, etc.

**Suggested content for Lab 7** (write it in Simplified Chinese, same style/structure as the other six labs):

- **目标:** Introduce browser agents — AI that uses a browser like a human, on your behalf. Show one concrete procurement task done by a browser agent.
- **准备:** A Chromium-based browser, Claude in Chrome extension or equivalent (Anthropic's beta product) **OR** if not available, use the Playwright MCP from Lab 2 as the fallback "manual browser agent."
- **步骤:**
  1. Install the browser agent (Claude in Chrome or equivalent). Explain on screen what a browser agent fundamentally is — an AI that *sees* the page (via screenshots or DOM access) and *acts* (clicks, types) the same way a person does.
  2. Give it a real procurement task in Chinese, e.g.: "去 1688.com，搜索 'A516 钢板'，找出排名前 5 的供应商，把他们的店铺名、主营产品、报价范围整理成一个列表。"
  3. Watch the agent navigate, click, scroll, extract. Discuss what it did vs how you'd do it manually.
  4. Try a second task: "去 SteelHome 网站，找一下最新一周的中厚板市场行情，整理一份简报。"
  5. Discuss limits — browser agents can be slow, can break on weird pages, can be expensive. When to use them vs API/MCP vs human.
- **延伸:** Combine browser agents with subagents — let a subagent invoke browser actions to research suppliers in depth.

The same UX rules as the other labs apply (copyable code/prompts, step ticking, mark complete).

---

## 13. Auth and Netlify Functions

### Functions to implement (`netlify/functions/`)

- `login.js` — POST `{ email, password }`. Reads user from Blobs (`user:<email>`), bcrypt-compares password, returns JWT on success.
- `verify.js` — GET, takes Bearer JWT, returns user info if valid.
- `getProgress.js` — GET, returns the user's progress record from Blobs (`progress:<userId>`).
- `updateProgress.js` — POST `{ key, value }`, merges into the user's progress record in Blobs.
- `quizSubmit.js` — POST `{ moduleId, answers }`, computes score, returns `{ score, passed, perQuestion: [...] }`, saves to progress.
- `addUser.js` — admin-only (gated by a separate `ADMIN_SECRET` env var), creates a user record. Run manually to provision users.

### Environment variables (Netlify dashboard)

- `JWT_SECRET` — for signing tokens.
- `ADMIN_SECRET` — gates `addUser.js`.
- `NETLIFY_BLOBS_TOKEN` if needed (usually auto-injected on Netlify).

### Blob keys (data model)

- `user:<email>` → `{ id, email, name, passwordHash, createdAt }`
- `progress:<userId>` → `{ video: { completed: bool, completedAt: ... }, theory: { 1: { quizScore, passed, attemptedAt }, 2: { ... }, ... }, labsPractical: { 1: { completed, completedAt }, 2: { ... }, ... }, labsAI: { 1: { ... }, ..., 7: { ... } } }`

---

## 14. Page transitions and overall UX feel

- Use `AnimatePresence` from Framer Motion to handle route changes. A short fade (~250 ms) on enter/exit is enough. Don't over-animate.
- Buttons and interactive elements have hover and active states.
- Loading states everywhere there's a Netlify Function call — skeleton screens or subtle spinners (Lucide `Loader2` with `animate-spin`).
- Empty states (e.g. no progress yet) handled gracefully with friendly Chinese copy.
- Error states handled gracefully — if a Function call fails, show a friendly Chinese error with a "重试" (Retry) button. Never a raw stack trace or a broken-looking page.
- Mobile: the platform is primarily used on desktop, but it must not look broken on mobile (around 375px width). Single-column layouts on mobile, hamburger nav if needed.

---

## 15. Content sources (provided files — do not regenerate)

Use these as the canonical content source:

- `05-theory-content-chinese.md` — the six theory chapters, in Simplified Chinese.
- `06-lab-modules-chinese.md` — the six lab modules, in Simplified Chinese.
- `learning-video.mp4` — the NotebookLM explainer video.
- Northstar Impacts logo file (admin will provide).

Place the content files in `src/content/` and import them via Vite's raw-loader (`?raw`). Do not paraphrase or rewrite. Render the markdown faithfully.

---

## 16. Definition of done

The platform is complete when:

- [ ] Preloader curtain animation runs smoothly on first load, doesn't re-run on in-app navigation.
- [ ] Login works against the Netlify Function backend; bad credentials show clean error.
- [ ] Dashboard shows all four cards with live progress indicators.
- [ ] Video section plays the MP4 and tracks completion.
- [ ] All six theory modules render the markdown content correctly (including code blocks and emphasis).
- [ ] All six quizzes are generated to the standard in Section 10 — not dummy questions, real comprehension testing.
- [ ] Module unlock logic works (Module N+1 locked until Module N quiz passed).
- [ ] Below-threshold quiz score shows the recommendation message.
- [ ] All six practical labs render with copyable code/prompt blocks.
- [ ] All seven AI labs render (six topics + browser agents), with the browser agents lab properly written in Chinese in the same style as the others.
- [ ] All progress persists per user across sessions.
- [ ] Build deploys cleanly to Netlify.
- [ ] No Supabase, no Firebase, no third-party auth provider.
- [ ] Site loads cleanly from a China-based network (verify by asking the admin to test).

---

## 17. UI/UX skills (read before designing)

The admin will attach three or four AI design skills before you begin. **Read them all before writing any component code.** They will encode the spacing, typography, color, and component patterns to follow. Treat them as authoritative for visual decisions; this document is authoritative for structure and behavior.

---

## 18. Final note on tone

The team this is built for is technical, busy, and culturally direct. They prefer substance to flash. Build the platform that respects them — clean, fast, working, no fluff. The curtain animation is the one moment of brand drama; everything after that should be quiet, confident, and functional.

Build the whole thing. Don't stop and ask questions — every decision you'd need to ask is specified above. If something is genuinely under-specified, pick the most professional and conservative option and proceed.
