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

  // Track scroll progress of this specific section across the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Silky spring physics for scroll-driven transition
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // Dynamic 3D Scale: blooms from 0.94 -> 1.0 at center -> 0.96 on exit
  const scale = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [0.94, 1, 1, 0.96]);

  // Smooth Opacity fade: 0.35 -> 1.0 -> 0.45
  const opacity = useTransform(smoothProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.45]);

  // Parallax Y offset
  const y = useTransform(smoothProgress, [0, 0.22, 0.78, 1], [40, 0, 0, -30]);

  // Subtle 3D perspective tilt (page curl effect on scroll)
  const rotateX = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [3.5, 0, 0, -2.5]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full scroll-mt-14 sm:scroll-mt-20 ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* ── CHAPTER AMBIENT TRANSITION SEAM (Glowing threshold line) ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-4xl h-[1.5px] opacity-40 blur-[0.5px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* ── 3D CHAPTER BOOKMARK RIBBON ── */}
      {chapterNumber && chapterName && (
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-3 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 18 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="group relative inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-white/75 dark:bg-stone-900/75 backdrop-blur-2xl border-2 border-black dark:border-white select-none transition-all hover:-translate-y-0.5"
            style={{
              boxShadow: `4px 4px 0 ${accentColor}, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)`,
            }}
          >
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-widest shadow-xs"
              style={{ backgroundColor: accentColor }}
            >
              #{chapterNumber}
            </span>
            <span className="font-hero-heading text-sm sm:text-base uppercase tracking-wider text-black dark:text-white">
              {chapterName}
            </span>
            <span
              className="font-bold group-hover:rotate-45 transition-transform"
              style={{ color: accentColor }}
            >
              ✦
            </span>
          </motion.div>
        </div>
      )}

      {/* ── 3D PERSPECTIVE SCROLL-LINKED REVEAL CONTAINER ── */}
      <motion.div
        style={{
          scale,
          opacity,
          y,
          rotateX,
          transformOrigin: "center top",
        }}
        className="w-full transform-gpu will-change-transform"
      >
        {children}
      </motion.div>

      {/* ── BOTTOM CHAPTER EXIT SEAM (Soft subtle fade) ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 max-w-3xl h-[1px] opacity-25"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
