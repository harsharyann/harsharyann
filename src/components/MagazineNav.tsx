"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavPage {
  name: string;
  path: string;
  chapter: string;
  badge: string;
  accentHex: string;
  activeClassLight: string;
  hoverClassLight: string;
  icon: (isActive: boolean) => React.ReactNode;
}

export function MagazineNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden on root cover page
  if (pathname === "/") {
    return null;
  }

  const pages: NavPage[] = [
    {
      name: "About",
      path: "/about",
      chapter: "02",
      badge: "Bio",
      accentHex: "#f59e0b", // Warm Amber
      activeClassLight: "bg-amber-300 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-amber-100 hover:text-black hover:-rotate-1",
      icon: (isActive) => (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Hand-drawn Idea Lightbulb */}
          <path d="M9 18h6" />
          <path d="M10 21h4" />
          <path d="M12 3a6 6 0 0 0-4 10.5V16h8v-2.5A6 6 0 0 0 12 3z" />
          <path d="M12 7v3" />
        </svg>
      ),
    },
    {
      name: "Projects",
      path: "/projects",
      chapter: "03",
      badge: "Work",
      accentHex: "#6366f1", // Electric Indigo / Violet
      activeClassLight: "bg-indigo-600 text-white shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-indigo-100 hover:text-indigo-900 hover:rotate-1",
      icon: (isActive) => (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Hand-drawn Lightning Bolt */}
          <path d="M13 2L4 14h7l-2 8 11-12h-7l3-8z" />
        </svg>
      ),
    },
    {
      name: "Certificates",
      path: "/certificates",
      chapter: "04",
      badge: "Awards",
      accentHex: "#10b981", // Minty Emerald
      activeClassLight: "bg-emerald-400 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-emerald-100 hover:text-emerald-900 hover:-rotate-1",
      icon: (isActive) => (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Hand-drawn Laurel Medal */}
          <circle cx="12" cy="8.5" r="5.5" />
          <path d="M8.5 13.5L7 21l5-2.5 5 2.5-1.5-7.5" />
          <circle cx="12" cy="8.5" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      name: "Contact",
      path: "/contact",
      chapter: "05",
      badge: "Say Hi",
      accentHex: "#f43f5e", // Punchy Rose Coral
      activeClassLight: "bg-rose-400 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-rose-100 hover:text-rose-900 hover:rotate-1",
      icon: (isActive) => (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Hand-drawn Paper Airplane */}
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b-2 border-black dark:border-stone-800 py-2.5 px-3 sm:px-6 transition-colors duration-200">
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Link to Cover with Hand-Drawn Comic Mascot */}
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 font-mono text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#555] dark:shadow-[3px_3px_0_#aaa] hover:-translate-y-0.5 hover:-rotate-1 active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0_#555] transition-all"
          title="Return to Doodle Crew Cover"
        >
          {/* Cute Winking Mascot Doodle */}
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 text-amber-300 dark:text-amber-500 group-hover:rotate-12 transition-transform"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 10h.01" strokeWidth="3" />
            <path d="M14 9.5c.5.5 1 1.5 1 1.5" />
            <path d="M8 14c1.5 2 6.5 2 8 0" />
          </svg>

          <span>HARSH ARYAN</span>

          {/* Tiny Return Arrow */}
          <span className="text-[10px] text-stone-400 group-hover:text-white dark:group-hover:text-black transition-colors font-sans">
            ↵
          </span>

          {/* Doodle Tape Accents */}
          <span
            className="absolute -top-1.5 -left-1 w-3 h-1.5 bg-amber-300/80 -rotate-12 rounded-sm border border-black/30 pointer-events-none"
            aria-hidden="true"
          />
        </Link>

        {/* Desktop Navigation Pills — Tactile, Doodle-Enriched & Color-Coded */}
        <nav
          className="hidden md:flex items-center gap-2 font-mono text-xs font-bold uppercase"
          aria-label="Main Navigation"
        >
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                className={`group relative px-3.5 py-1.5 rounded-full border-2 border-black dark:border-stone-400 transition-all duration-150 flex items-center gap-1.5 select-none active:translate-x-[1px] active:translate-y-[1px] ${
                  isActive
                    ? `${p.activeClassLight} dark:bg-white dark:text-black dark:border-white dark:shadow-[3px_3px_0_#fff] scale-105 z-10 font-black`
                    : `bg-white dark:bg-stone-900 text-black dark:text-stone-200 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#888] ${p.hoverClassLight} dark:hover:bg-stone-800 dark:hover:text-white hover:-translate-y-0.5`
                }`}
              >
                {/* Hand-drawn Icon Doodle */}
                <span
                  className={`flex items-center justify-center ${
                    isActive ? "" : "text-black dark:text-stone-300"
                  }`}
                >
                  {p.icon(isActive)}
                </span>

                {/* Page Label */}
                <span>{p.name}</span>

                {/* Active Indicator: Doodle Sparkle on Top-Right */}
                {isActive && (
                  <span
                    className="absolute -top-2 -right-1 text-[11px] text-amber-500 dark:text-amber-300 animate-pulse pointer-events-none select-none"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                )}

                {/* Active Indicator: Hand-drawn Squiggle Underline */}
                {isActive && (
                  <svg
                    viewBox="0 0 60 8"
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-10 h-2 pointer-events-none text-black dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M2 5 Q 15 1, 30 5 T 58 4" />
                  </svg>
                )}
              </Link>
            );
          })}

          {/* Theme Switcher Pill right beside nav */}
          <div className="ml-2 pl-2 border-l-2 border-black/20 dark:border-white/20">
            <ThemeToggle />
          </div>
        </nav>

        {/* Right side for mobile: Theme toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-black dark:border-white rounded-lg bg-white dark:bg-stone-900 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Doodles & Color Accents */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md p-4 space-y-2.5 mt-2 rounded-b-2xl shadow-xl">
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-black dark:border-stone-700 text-sm font-mono font-bold uppercase transition-all shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#555] active:translate-x-[1px] active:translate-y-[1px] ${
                  isActive
                    ? `${p.activeClassLight} dark:bg-white dark:text-black dark:border-white`
                    : `bg-white dark:bg-stone-900 text-black dark:text-stone-200 ${p.hoverClassLight} dark:hover:bg-stone-800`
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1 rounded-md bg-black/5 dark:bg-white/10">
                    {p.icon(isActive)}
                  </span>
                  <span>{p.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-current opacity-70">
                    {p.badge}
                  </span>
                  {isActive && <span className="text-amber-500 font-bold">✦</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
