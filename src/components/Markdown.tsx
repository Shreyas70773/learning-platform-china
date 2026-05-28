'use client';

import { isValidElement } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';

const components: Components = {
  // Fenced code blocks become copyable, highlighted CodeBlocks.
  pre({ children }) {
    const child = Array.isArray(children) ? children[0] : children;
    if (isValidElement(child)) {
      const props = child.props as { className?: string; children?: React.ReactNode };
      const lang = /language-(\w+)/.exec(props.className ?? '')?.[1];
      const code = String(props.children ?? '').replace(/\n$/, '');
      return <CodeBlock code={code} lang={lang} />;
    }
    return <pre>{children}</pre>;
  },
  a({ href, children }) {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {children}
      </a>
    );
  },
};

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('prose prose-nsi max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
