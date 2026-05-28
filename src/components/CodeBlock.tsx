'use client';

import { useMemo, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import javascript from 'highlight.js/lib/languages/javascript';
import markdown from 'highlight.js/lib/languages/markdown';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('markdown', markdown);

const ALIASES: Record<string, string> = { js: 'javascript', sh: 'bash', shell: 'bash' };
const LANG_LABEL: Record<string, string> = {
  python: 'Python',
  bash: '终端命令',
  json: 'JSON',
  javascript: 'JavaScript',
  markdown: 'Markdown',
};

const CJK = /[一-鿿]/;
const COMMAND_START =
  /^\s*(\/|\$\s|claude\b|npm\b|npx\b|git\b|cd\b|mkdir\b|cp\b|mv\b|ls\b|rm\b|cat\b|python3?\b|pip3?\b|node\b|curl\b)/;

function hasCJK(s: string): boolean {
  return CJK.test(s);
}

function looksLikeCommand(code: string): boolean {
  const firstLine = code.trim().split('\n')[0] ?? '';
  return COMMAND_START.test(firstLine);
}

export function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const normalized = (lang && ALIASES[lang]) || lang;

  // Label: explicit language; else a shell command; else a Chinese prompt.
  const label = normalized
    ? (LANG_LABEL[normalized] ?? normalized)
    : looksLikeCommand(code)
      ? '终端命令'
      : hasCJK(code)
        ? '提示词 · 发给 Claude'
        : '终端命令';

  const html = useMemo(() => {
    if (normalized && hljs.getLanguage(normalized)) {
      try {
        return hljs.highlight(code, { language: normalized }).value;
      } catch {
        return null;
      }
    }
    return null;
  }, [code, normalized]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable; ignore */
    }
  }

  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-line-2 bg-[oklch(0.99_0.003_70)] shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wide text-ink-3">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-[transform,background-color,color] duration-150 ease-out-quint active:scale-[0.96]',
            copied
              ? 'bg-success-tint text-success-ink'
              : 'text-brand-ink hover:bg-brand-tint',
          )}
          aria-label={copied ? '已复制' : '复制'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> 已复制
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> 复制
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 text-[0.86rem] leading-relaxed">
        {html ? (
          <code className="hljs font-mono" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <code className="hljs font-mono">{code}</code>
        )}
      </pre>
    </div>
  );
}
