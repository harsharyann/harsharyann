"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 250,
    damping: 28,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 origin-left z-[100] shadow-[0_0_8px_rgba(245,158,11,0.6)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
