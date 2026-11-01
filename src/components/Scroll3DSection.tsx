"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";

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
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`relative w-full scroll-mt-6 sm:scroll-mt-10 ${className}`}
    >
      {/* ── 3D CHAPTER BOOKMARK RIBBON (Visual Transition Bridge) ── */}
      {chapterNumber && chapterName && (
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-2 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group relative inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-full bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border-2 border-black dark:border-white select-none transition-transform hover:-translate-y-0.5"
            style={{
              boxShadow: `4px 4px 0 ${accentColor}, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)`, 
            }}
          >
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white tracking-widest"
              style={{ backgroundColor: accentColor }}
            >
              #{chapterNumber}
            </span>
            <span className="font-hero-heading text-sm sm:text-base uppercase tracking-wider text-black dark:text-white">
              {chapterName}
            </span>
            <span className="text-amber-500 font-bold group-hover:rotate-45 transition-transform">✦</span>
          </motion.div>
        </div>
      )}

      {/* ── SECTION REVEAL CONTAINER (Hardware-Accelerated) ── */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
