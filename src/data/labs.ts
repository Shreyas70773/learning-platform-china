import raw from '@/content/06-lab-modules-chinese.md';
import lab7 from '@/content/lab-7-browser-agents.md';
import { splitSections, stripTrailingRule } from '@/lib/markdown';

export type Lab = {
  id: number; // 1..7
  title: string;
  minutes: number; // estimated time
  blurb: string; // short card description (faithful summary of 目标)
  body: string; // markdown body (heading line removed)
};

// Card metadata. Times are taken from each lab's 准备 section.
const META: Record<number, { minutes: number; blurb: string }> = {
  1: { minutes: 10, blurb: '用一次真实的 API 调用拿到当天钢价，看清 API 的本质。' },
  2: {
    minutes: 60,
    blurb: '给 Claude 连上搜索、文件、浏览器三类 MCP 工具，从"只能说话"到"能做事"。',
  },
  3: {
    minutes: 45,
    blurb: '安装官方 docx 与 xlsx 技能，生成可直接发送的询价函和带公式的比较表。',
  },
  4: { minutes: 45, blurb: '创建供应商研究子代理，对多家供应商产出结构一致的研究简报。' },
  5: { minutes: 60, blurb: '体验多代理编排，并诚实地认识它当前的局限。' },
  6: { minutes: 45, blurb: '搭一个小型评估系统，亲眼看它抓出被故意打破的技能。' },
  7: { minutes: 45, blurb: '认识浏览器代理，让 AI 像人一样操作网页完成采购任务。' },
};

function parseSourceLabs(): Lab[] {
  const { sections } = splitSections(raw);
  const labs: Lab[] = [];

  for (const { heading, body } of sections) {
    const m = heading.match(/^Lab\s+(\d+)\s*[:：]\s*(.+)$/);
    if (m) {
      const id = Number(m[1]);
      if (!META[id]) continue;
      labs.push({
        id,
        title: m[2].trim(),
        minutes: META[id].minutes,
        blurb: META[id].blurb,
        body: stripTrailingRule(body),
      });
    }
  }

  return labs.sort((a, b) => a.id - b.id);
}

const sourceLabs = parseSourceLabs(); // ids 1..6

const LAB_7: Lab = {
  id: 7,
  title: '浏览器代理（Browser Agents）',
  minutes: META[7].minutes,
  blurb: META[7].blurb,
  body: stripTrailingRule(lab7),
};

/** Practical Labs: the six hands-on labs. */
export const PRACTICAL_LABS: Lab[] = sourceLabs;
/** AI Labs: the same six labs plus the Browser Agents lab. */
export const AI_LABS: Lab[] = [...sourceLabs, LAB_7];

export const PRACTICAL_COUNT = PRACTICAL_LABS.length; // 6
export const AI_COUNT = AI_LABS.length; // 7

export function getLab(track: 'practical' | 'ai', id: number): Lab | null {
  const list = track === 'practical' ? PRACTICAL_LABS : AI_LABS;
  return list.find((l) => l.id === id) ?? null;
}

export function formatMinutes(m: number): string {
  if (m >= 60) {
    const h = m / 60;
    return Number.isInteger(h) ? `约 ${h} 小时` : `约 ${(m / 60).toFixed(1)} 小时`;
  }
  return `约 ${m} 分钟`;
}
