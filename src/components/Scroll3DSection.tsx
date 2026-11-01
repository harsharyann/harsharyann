"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Scroll3DSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  chapterNumber?: string;
  chapterName?: string;
  accentColor?: string;
}

export function Scroll3DSection({
  children,
  id,
  className = "",
  chapterNumber,
  chapterName,
  accentColor = "#f59e0b",
}: Scroll3DSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth physics spring for organic, tactile 3D transitions
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // 3D Perspective Transformations:
  // 1. Entrance tilt: starts tilted forward (+7deg), snaps flat (0deg) at center viewport, then tilts back (-5deg) on exit
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [7, 0, 0, -5]);
  // 2. Depth scale: starts slightly smaller (0.95), scales to full 1.0, gently pulls back (0.97)
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.97]);
  // 3. Opacity reveal: smooth fade-in
  const opacity = useTransform(smoothProgress, [0, 0.16, 0.84, 1], [0.35, 1, 1, 0.4]);
  // 4. Parallax vertical travel
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -30]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ perspective: "1500px" }}
    >
      {/* ── 3D CHAPTER BOOKMARK RIBBON (Visual Section Transition Bridge) ── */}
      {chapterNumber && chapterName && (
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-stone-900 border-2 border-black dark:border-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] font-mono text-xs select-none"
            style={{
              boxShadow: `3px 3px 0 ${accentColor}`,
            }}
          >
            <span
              className="px-2 py-0.5 rounded-full text-[10px] text-white font-black"
              style={{ backgroundColor: accentColor }}
            >
              CHAPTER {chapterNumber}
            </span>
            <span className="font-hero-heading uppercase tracking-wide text-black dark:text-white text-sm">
              {chapterName}
            </span>
            <span className="text-stone-400">✦</span>
          </motion.div>
        </div>
      )}

      {/* ── 3D PERSPECTIVE DECK ── */}
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformOrigin: "center top",
          transformStyle: "preserve-3d",
        }}
        className="w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
