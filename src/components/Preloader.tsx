'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { PLATFORM_SHORT } from '@/lib/brand';

// The one moment of brand drama: a deep-red curtain holding the mark, then
// rising like a stage curtain. Lives in the root layout, so it plays on a
// fresh page load but not on in-app navigation (the layout persists).
export function Preloader() {
  const [lifted, setLifted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    // fade-in (~300ms) + hold (~500ms) before the curtain rises.
    const hold = reduce ? 450 : 800;
    const t = setTimeout(() => setLifted(true), hold);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!lifted && (
        <motion.div
          key="curtain"
          aria-hidden
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
          style={{
            backgroundColor: 'var(--brand-strong)',
            backgroundImage:
              'radial-gradient(120% 90% at 50% 28%, oklch(0.6 0.2 27) 0%, oklch(0.5 0.2 27) 42%, oklch(0.4 0.17 27) 100%)',
          }}
          initial={{ transform: 'translateY(0%)' }}
          exit={
            reduce
              ? { opacity: 0 }
              : { transform: 'translateY(-100%)' }
          }
          transition={{
            duration: reduce ? 0.3 : 0.8,
            ease: [0.65, 0, 0.35, 1],
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, transform: 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo variant="full" tone="inverse" className="text-3xl md:text-[2.5rem]" />
            <span className="text-sm font-medium tracking-[0.3em] text-[oklch(0.97_0.012_60_/_0.7)]">
              {PLATFORM_SHORT}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
