'use client';

import { motion, useScroll } from 'framer-motion';

// Fixed reading-progress beam at the very top. Bound directly to scroll progress
// (scaleX, origin-left) so it tracks 1:1 in both directions: grows from the top of
// the page on the way down, retracts on the way up. No spring, so no perceived lag.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-brand"
    />
  );
}
