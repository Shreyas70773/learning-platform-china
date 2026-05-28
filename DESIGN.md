# DESIGN.md — NorthStar Impex AI 学习平台

The visual system. Register: **product** (the design serves the content). The one
moment of brand expression is the curtain preloader; everything after is quiet,
confident, and functional.

## Color (OKLCH, light theme)

All tokens live in `src/app/globals.css`. No `#000` / `#fff` anywhere; neutrals are
warm-tinted toward the brand hue. Strategy: **restrained** — warm paper neutrals with
red as the single locked accent.

| Token | Use |
| --- | --- |
| `--paper` `oklch(0.977 0.005 60)` | page background (warm paper) |
| `--surface` / `--surface-2` | cards / sunken (code, wells) |
| `--ink` / `--ink-2` / `--ink-3` | primary / secondary / muted text |
| `--line` / `--line-2` | borders |
| `--brand` `oklch(0.585 0.214 27)` | the logo star red; icons, active, accents |
| `--brand-strong` | button fill (AA with cream text) |
| `--brand-ink` | red text on light (AA) |
| `--brand-tint` / `--brand-tint-2` | red washes (selected, hover, inline code) |
| `--success*` / `--danger*` | quiz correct (green) / incorrect + errors |

Red is anchored on the real NorthStar Impex logo star. It is brand-authentic, culturally
resonant for a China-facing product, and deliberately avoids the procurement→navy+gold
category reflex.

## Typography

No generic fonts. Self-hosted via `next/font` (no Google `<link>`; loads from China):

- **Space Grotesk** — display + Latin UI (`font-sans` / `font-display`).
- **JetBrains Mono** — code blocks (`font-mono`).
- **CJK** falls through to the system stack: PingFang SC → Microsoft YaHei → Noto Sans SC.
  Zero font download for the bulk Chinese text — fast in mainland China.

Prose (`.prose-nsi`): 1.0625rem, line-height 1.85, 70ch measure, tuned for Simplified
Chinese. Hierarchy via scale + weight, never flat.

## Elevation, radius, motion

- Shadows are warm-tinted and layered; never hard black. Scale `xs → lg`, plus `shadow-brand`.
- One radius system (`sm 0.375 → 2xl 1.5rem`); cards use `xl`/`2xl`.
- Motion (per emil-design-eng): `transform`/`opacity` only, custom ease-out curves
  (`ease-out-quint`, `ease-out-expo`), UI transitions < 250ms, `:active` scale 0.97 on
  pressables. The curtain uses `cubic-bezier(0.65,0,0.35,1)` over 800ms. `prefers-reduced-motion`
  respected globally.

## Component notes

- Cards are used only as navigation affordances (dashboard, lists); never nested.
- No side-stripe accent borders, no gradient text, no glassmorphism, no em dashes in UI copy.
- Code blocks: bordered, header with a label (终端命令 / 提示词 / language) + a one-click
  复制 button; highlight.js theme matched to the palette.
- Quiz feedback: green for correct, red for incorrect, inline after each question.
