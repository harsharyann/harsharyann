"use client";

import React, { useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div className={`w-24 h-9 rounded-full border border-white/20 bg-stone-900/60 backdrop-blur-md ${className}`} />
    );
  }

  const isLight = theme === "light";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      role="switch"
      aria-checked={!isLight}
      aria-label={isLight ? "Switch to Dark / B&W Mode" : "Switch to Colorful / Light Mode"}
      title={isLight ? "Switch to Dark / B&W Mode" : "Switch to Colorful / Light Mode"}
      className={`group relative inline-flex items-center gap-2 p-1.5 rounded-full backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-lg select-none ${
        isLight
          ? "bg-white/85 text-stone-900 border border-stone-200/80 shadow-[0_4px_20px_rgba(245,158,11,0.2),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:border-amber-400/60"
          : "bg-black/75 text-stone-100 border border-white/20 shadow-[0_4px_20px_rgba(99,102,241,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-indigo-400/60"
      } ${className}`}
    >
      {/* Dynamic Ambient Glow Behind Toggle */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 rounded-full blur-md opacity-40 transition-opacity duration-300 pointer-events-none group-hover:opacity-75 ${
          isLight
            ? "bg-gradient-to-r from-amber-400/40 via-rose-400/30 to-indigo-400/40"
            : "bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-cyan-400/40"
        }`}
      />

      {/* Floating Pill Knob with Spring Physics */}
      <div className="relative flex items-center gap-1.5 px-2 py-1 rounded-full z-10">
        <AnimatePresence mode="wait" initial={false}>
          {isLight ? (
            <motion.div
              key="light-mode"
              initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-sm"
            >
              <Sun className="w-3.5 h-3.5 animate-[spin_12s_linear_infinite]" />
            </motion.div>
          ) : (
            <motion.div
              key="dark-mode"
              initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className="relative flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-indigo-300 text-white shadow-sm shadow-indigo-500/50"
            >
              <Moon className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Label & Status Indicator */}
        <div className="flex items-center gap-1 font-mono text-[11px] font-black tracking-wider uppercase pr-1">
          <span
            className={`transition-colors duration-200 ${
              isLight ? "text-stone-800" : "text-stone-200"
            }`}
          >
            {isLight ? (showLabel ? "Colourful" : "Color") : (showLabel ? "B&W Dark" : "B&W")}
          </span>

          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              isLight ? "bg-amber-500 shadow-[0_0_6px_#f59e0b]" : "bg-indigo-400 shadow-[0_0_6px_#818cf8]"
            }`}
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.button>
  );
}
