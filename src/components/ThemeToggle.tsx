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
      <div className={`w-16 h-8 rounded-full border-2 border-black/30 bg-stone-200 dark:bg-stone-800 ${className}`} />
    );
  }

  const isLight = theme === "light";

  return (
    <div className={`inline-flex items-center gap-2.5 font-mono select-none ${className}`}>
      {showLabel && (
        <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
          {isLight ? "B&W: OFF" : "B&W: ON"}
        </span>
      )}

      {/* ── AUTHENTIC MECHANICAL ON/OFF SLIDER SWITCH ── */}
      <button
        type="button"
        onClick={toggleTheme}
        role="switch"
        aria-checked={!isLight}
        aria-label={isLight ? "Turn Dark Mode ON" : "Turn Dark Mode OFF"}
        title={isLight ? "Turn B&W Dark Mode ON" : "Turn Colourful Mode ON"}
        className={`group relative inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-black p-0.5 transition-colors duration-300 shadow-[2.5px_2.5px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000] ${
          isLight
            ? "bg-amber-300 hover:bg-amber-200"
            : "bg-[#090a0f] hover:bg-black"
        }`}
      >
        {/* Track ON / OFF Typography */}
        <span className="absolute inset-0 flex items-center justify-between px-2 text-[9px] font-mono font-black pointer-events-none">
          <span
            className={`transition-all duration-200 ${
              isLight ? "opacity-0 -translate-x-1" : "opacity-100 translate-x-0 text-emerald-400 font-bold"
            }`}
          >
            ON
          </span>
          <span
            className={`transition-all duration-200 ${
              isLight ? "opacity-100 translate-x-0 text-amber-950 font-bold" : "opacity-0 translate-x-1"
            }`}
          >
            OFF
          </span>
        </span>

        {/* Sliding Circular Knob with Spring Physics */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          animate={{ x: isLight ? 0 : 32 }}
          className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black shadow-[1px_1px_0_#000] transition-colors duration-200 ${
            isLight
              ? "bg-white text-amber-500"
              : "bg-white text-indigo-900"
          }`}
        >
          {isLight ? (
            <Sun className="h-3.5 w-3.5 animate-[spin_8s_linear_infinite]" />
          ) : (
            <Moon className="h-3.5 w-3.5 fill-indigo-900" />
          )}
        </motion.span>
      </button>
    </div>
  );
}
