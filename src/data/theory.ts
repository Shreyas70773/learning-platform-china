import raw from '@/content/05-theory-content-chinese.md';
import { splitSections, stripTrailingRule, stripLeadingH1 } from '@/lib/markdown';

export type TheoryModule = {
  id: number; // 1..6
  label: string; // 第一章
  title: string; // API — 软件之间的对话
  body: string; // markdown body (heading line removed)
};

const NUM: Record<string, number> = {
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
};

function parse() {
  const { intro, sections } = splitSections(raw);
  let conclusion = '';
  const modules: TheoryModule[] = [];

  for (const { heading, body } of sections) {
    const m = heading.match(/^第([一二三四五六])章[：:]\s*(.+)$/);
    if (m) {
      modules.push({
        id: NUM[m[1]],
        label: `第${m[1]}章`,
        title: m[2].trim(),
        body: stripTrailingRule(body),
      });
    } else if (/^结语/.test(heading)) {
      conclusion = stripTrailingRule(body);
    }
  }

  modules.sort((a, b) => a.id - b.id);
  return { intro: stripLeadingH1(intro), conclusion, modules };
}

const parsed = parse();

export const THEORY_INTRO = parsed.intro;
export const THEORY_CONCLUSION = parsed.conclusion;
export const THEORY_MODULES = parsed.modules;
export const THEORY_COUNT = parsed.modules.length;

export function getTheoryModule(id: number): TheoryModule | null {
  return THEORY_MODULES.find((m) => m.id === id) ?? null;
}
