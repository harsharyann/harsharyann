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
      className="fixed top-0 left-0 right-0 h-[3px] bg-black origin-left z-[100] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
