'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

// Fixed reading-progress bar at the very top. Fills left-to-right as the page
// scrolls. scaleX is a transform (hardware-accelerated); the spring smooths it.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-brand"
    />
  );
}
