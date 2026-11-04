"use client";

import React, { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
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
      <div className={`w-[76px] h-8 rounded-full border-2 border-black/30 bg-stone-200 dark:bg-stone-800 ${className}`} />
    );
  }

  const isLight = theme === "light";

  return (
    <div className={`inline-flex items-center font-mono select-none ${className}`}>
      {/* ── RETRO-COOL MECHANICAL THEME SLIDER SWITCH (LIGHT // DARK) ── */}
      <button
        type="button"
        onClick={toggleTheme}
        role="switch"
        aria-checked={!isLight}
        aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        title={isLight ? "Active Theme: LIGHT (Click for DARK)" : "Active Theme: DARK (Click for LIGHT)"}
        className={`group relative inline-flex h-8 w-[76px] shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 transition-all duration-300 active:translate-y-0.5 ${
          isLight
            ? "border-black bg-amber-300 hover:bg-amber-200 shadow-[2.5px_2.5px_0_#000] active:shadow-[1px_1px_0_#000]"
            : "border-white/80 bg-[#0c0d14] hover:bg-black shadow-[2.5px_2.5px_0_#fff] active:shadow-[1px_1px_0_#fff]"
        }`}
      >
        {/* Track Typography (LIGHT / DARK) */}
        <span className="absolute inset-0 flex items-center justify-between px-2.5 text-[9px] font-mono font-black tracking-wider pointer-events-none select-none">
          <span
            className={`transition-all duration-200 ${
              isLight ? "opacity-0 -translate-x-1" : "opacity-100 translate-x-0 text-cyan-300 font-black drop-shadow-[0_0_6px_rgba(103,232,249,0.6)]"
            }`}
          >
            DARK
          </span>
          <span
            className={`transition-all duration-200 ${
              isLight ? "opacity-100 translate-x-0 text-stone-950 font-black" : "opacity-0 translate-x-1"
            }`}
          >
            LIGHT
          </span>
        </span>

        {/* Sliding Circular Knob with Spring Physics */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          animate={{ x: isLight ? 0 : 44 }}
          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black shadow-[1px_1px_0_#000] transition-colors duration-200 ${
            isLight
              ? "bg-white text-amber-500"
              : "bg-white text-indigo-950"
          }`}
        >
          {isLight ? (
            <Sun className="h-3.5 w-3.5 animate-[spin_8s_linear_infinite]" />
          ) : (
            <Moon className="h-3.5 w-3.5 fill-indigo-900 text-indigo-900" />
          )}
        </motion.span>
      </button>
    </div>
  );
}
