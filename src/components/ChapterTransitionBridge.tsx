"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

interface ChapterTransitionBridgeProps {
  fromChapter: string;
  fromName: string;
  toChapter: string;
  toName: string;
  targetId: string;
  accentFrom: string;
  accentTo: string;
  icon: string;
  tagline: string;
}

export function ChapterTransitionBridge({
  fromChapter,
  fromName,
  toChapter,
  toName,
  targetId,
  accentFrom,
  accentTo,
  icon,
  tagline,
}: ChapterTransitionBridgeProps) {
  const scrollToNext = () => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center select-none overflow-hidden">
      
      {/* ── 1. CONNECTING THREAD (Dashed Vertical Line with Pulse) ── */}
      <div className="relative flex flex-col items-center h-14 sm:h-18">
        {/* Top Connecting Node */}
        <div
          className="w-2.5 h-2.5 rounded-full border-2 border-black dark:border-white shadow-xs z-10"
          style={{ backgroundColor: accentFrom }}
        />

        {/* Vertical Dashed Conduit Line */}
        <div className="w-0.5 flex-1 border-l-2 border-dashed border-black/30 dark:border-white/30 my-1 relative overflow-hidden">
          {/* Animated Liquid Flow Light moving down */}
          <motion.div
            className="w-full h-8 absolute top-0"
            style={{
              background: `linear-gradient(to bottom, transparent, ${accentTo}, transparent)`,
            }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Directional Downward Arrow */}
        <ArrowDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 -mt-0.5" />
      </div>

      {/* ── 2. INTERACTIVE CHAPTER GLIDE CARD (Clickable Scroll Transition) ── */}
      <motion.button
        type="button"
        onClick={scrollToNext}
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full max-w-xl p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-2 border-black dark:border-white/40 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] text-left cursor-pointer transition-all overflow-hidden"
        style={{
          boxShadow: `4px 4px 0 ${accentTo}, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.7)`,
        }}
        aria-label={`Scroll down to ${toName}`}
      >
        {/* Ambient Hover Gradient Sheen */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accentTo}, transparent 70%)`,
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Header: Progression Indicator */}
            <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-wider">
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: accentFrom }}
              >
                #{fromChapter}
              </span>
              <span className="text-stone-400 dark:text-stone-500 font-bold">───►</span>
              <span
                className="px-2 py-0.5 rounded-full text-white shadow-xs"
                style={{ backgroundColor: accentTo }}
              >
                #{toChapter}
              </span>
              <span className="text-stone-500 dark:text-stone-400 font-bold hidden sm:inline">
                NEXT CHAPTER
              </span>
            </div>

            {/* Title & Emoji Icon */}
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl shrink-0 group-hover:rotate-12 transition-transform duration-300">
                {icon}
              </span>
              <h4 className="font-hero-heading text-base sm:text-lg uppercase tracking-wide text-black dark:text-white truncate">
                {toName}
              </h4>
            </div>

            {/* Tagline Narrative */}
            <p className="text-stone-600 dark:text-stone-300 font-mono text-[11px] leading-relaxed line-clamp-1">
              {tagline}
            </p>
          </div>

          {/* Right Action: Gliding Bouncing Button */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-black transition-transform group-hover:translate-y-0.5"
              style={{ backgroundColor: accentTo }}
            >
              <ArrowDown className="w-5 h-5 text-white stroke-[2.5] animate-bounce" />
            </div>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 hidden sm:block">
              GLIDE ↓
            </span>
          </div>
        </div>
      </motion.button>

      {/* ── 3. LOWER THREAD EXTENSION ── */}
      <div className="w-0.5 h-6 sm:h-8 border-l-2 border-dashed border-black/30 dark:border-white/30" />
    </div>
  );
}
