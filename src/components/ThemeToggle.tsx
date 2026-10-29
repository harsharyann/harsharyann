"use client";

import React, { useState, useEffect } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full border-2 border-black/30 bg-stone-100 ${className}`} />
    );
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to Black & White dark mode" : "Switch to Colourful light mode"}
      title={isLight ? "Switch to Black & White Dark Mode" : "Switch to Colourful Light Mode"}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-black transition-all cursor-pointer font-mono text-xs font-bold ${
        isLight
          ? "bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]"
          : "bg-stone-900 text-white border-white hover:bg-white hover:text-black shadow-[2px_2px_0_#fff]"
      } ${className}`}
    >
      {isLight ? (
        <>
          <Palette className="w-3.5 h-3.5 text-indigo-600 transition-transform hover:rotate-12" />
          {showLabel ? <span>Colourful</span> : <span className="hidden sm:inline">Color</span>}
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform hover:rotate-45" />
          {showLabel ? <span>B&amp;W Dark</span> : <span className="hidden sm:inline">B&amp;W</span>}
        </>
      )}
    </button>
  );
}
