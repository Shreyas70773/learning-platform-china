import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — all OKLCH, defined in globals.css.
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        brand: 'var(--brand)',
        'brand-strong': 'var(--brand-strong)',
        'brand-ink': 'var(--brand-ink)',
        'brand-tint': 'var(--brand-tint)',
        'brand-tint-2': 'var(--brand-tint-2)',
        success: 'var(--success)',
        'success-ink': 'var(--success-ink)',
        'success-tint': 'var(--success-tint)',
        danger: 'var(--danger)',
        'danger-ink': 'var(--danger-ink)',
        'danger-tint': 'var(--danger-tint)',
        gold: 'var(--gold)',
      },
      fontFamily: {
        sans: [
          'var(--font-space-grotesk)',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'var(--font-space-grotesk)',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
        mono: [
          'var(--font-jetbrains-mono)',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'ui-monospace',
          'monospace',
        ],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.625rem',
        md: '0.625rem',
        lg: '0.875rem',
        xl: '1.125rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        // Warm-tinted, layered, low-opacity. No hard black shadows.
        xs: '0 1px 2px 0 oklch(0.4 0.04 40 / 0.05)',
        sm: '0 1px 2px 0 oklch(0.4 0.04 40 / 0.06), 0 1px 3px 0 oklch(0.4 0.04 40 / 0.05)',
        DEFAULT:
          '0 2px 4px -1px oklch(0.4 0.04 40 / 0.06), 0 4px 12px -2px oklch(0.4 0.04 40 / 0.07)',
        md: '0 4px 8px -2px oklch(0.4 0.04 40 / 0.07), 0 10px 24px -4px oklch(0.4 0.04 40 / 0.08)',
        lg: '0 8px 16px -4px oklch(0.4 0.04 40 / 0.08), 0 20px 40px -8px oklch(0.4 0.04 40 / 0.10)',
        brand:
          '0 6px 16px -4px oklch(0.585 0.214 27 / 0.28), 0 2px 6px -2px oklch(0.585 0.214 27 / 0.22)',
      },
      transitionTimingFunction: {
        // emil-design-eng: strong custom curves, not weak CSS defaults.
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        curtain: 'cubic-bezier(0.65, 0, 0.35, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      maxWidth: {
        prose: '70ch',
        content: '72rem',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 320ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [
    typography,
    // Custom prose theme is layered in globals.css via the `prose-nsi` class.
  ],
};

export default config;
