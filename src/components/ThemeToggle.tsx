"use client";

import React, { useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("portfolio-theme") as "dark" | "light") || "dark";
    }
    return "dark";
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  if (!isClient) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-800/40 border border-slate-700/50" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full border border-slate-700/60 dark:border-slate-800 bg-slate-800/50 dark:bg-slate-900/60 text-slate-300 dark:text-slate-200 hover:text-white hover:border-indigo-500/50 transition-all duration-200 shadow-sm cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
