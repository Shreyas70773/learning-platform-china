import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';

// Self-hosted at build time by next/font — no runtime Google request,
// so it loads reliably from mainland China. CJK glyphs fall through to
// the system stack (PingFang SC / Microsoft YaHei / Noto Sans SC).
const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NorthStar Impex AI 学习平台',
  description: '面向采购团队的 AI 实战学习平台 — 视频、理论、动手实验与理解测试。',
  icons: { icon: '/favicon.svg' },
  // The UI is Simplified Chinese by design; stop browsers from auto-translating
  // it, which mutates the DOM and crashes React (insertBefore NotFoundError).
  other: { google: 'notranslate' },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" translate="no" className={`${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-paper font-sans text-ink antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
