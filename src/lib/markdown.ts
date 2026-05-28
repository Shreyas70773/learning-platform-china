// Split markdown into top-level `## ` sections, while ignoring any `## `
// lines that live inside fenced code blocks (```/~~~). Several labs embed
// markdown templates inside code fences, so a naive split would truncate them.

export type Section = { heading: string; body: string };

export function splitSections(raw: string): {
  intro: string;
  sections: Section[];
} {
  const lines = raw.split('\n');
  let inFence = false;
  let fenceChar = '';

  const intro: string[] = [];
  const sections: { heading: string; body: string[] }[] = [];
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const ch = fence[1][0];
      if (!inFence) {
        inFence = true;
        fenceChar = ch;
      } else if (ch === fenceChar) {
        inFence = false;
        fenceChar = '';
      }
    }

    if (!inFence && /^## /.test(line)) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^##\s+/, '').trim(), body: [] };
      continue;
    }

    if (current) current.body.push(line);
    else intro.push(line);
  }
  if (current) sections.push(current);

  return {
    intro: intro.join('\n').trim(),
    sections: sections.map((s) => ({
      heading: s.heading,
      body: s.body.join('\n'),
    })),
  };
}

export function stripTrailingRule(s: string): string {
  return s.replace(/\n+-{3,}\s*$/, '').trim();
}

/** Drop a leading `# ...` H1 line (we render our own page headers). */
export function stripLeadingH1(s: string): string {
  return s.replace(/^#\s+.*\n?/, '').trim();
}

const STEP_LINE = /^\*\*(第[一二三四五六七八九十]+步)[：:]\s*([^*\n]+?)\*\*\s*$/gm;

/** Promote standalone `**第N步：...**` lines to H4 headings for clear hierarchy. */
export function promoteLabSteps(body: string): string {
  return body.replace(STEP_LINE, '#### $1：$2');
}

/** Pull out the lab's step titles for the progress checklist. */
export function extractLabSteps(body: string): { label: string; title: string }[] {
  const re = new RegExp(STEP_LINE.source, 'gm');
  const steps: { label: string; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    steps.push({ label: m[1], title: m[2].trim() });
  }
  return steps;
}
