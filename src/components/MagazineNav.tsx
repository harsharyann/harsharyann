"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface NavPage {
  name: string;
  path: string;
  chapter: string;
  badge: string;
  shortLabel: string;
  accentHex: string;
  activeClassLight: string;
  hoverClassLight: string;
  icon: (active: boolean) => React.ReactNode;
}

export function MagazineNav() {
  const pathname = usePathname();

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
      shortLabel: "About",
      accentHex: "#f59e0b", // Warm Amber
      activeClassLight: "bg-amber-300 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-amber-100 hover:text-black hover:-rotate-1",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? "2.6" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "Projects",
      path: "/projects",
      chapter: "03",
      badge: "Work",
      shortLabel: "Projects",
      accentHex: "#6366f1", // Electric Indigo
      activeClassLight: "bg-indigo-600 text-white shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-indigo-100 hover:text-indigo-900 hover:rotate-1",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? "2.6" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      name: "Certificates",
      path: "/certificates",
      chapter: "04",
      badge: "Awards",
      shortLabel: "Certs",
      accentHex: "#10b981", // Emerald
      activeClassLight: "bg-emerald-400 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-emerald-100 hover:text-emerald-900 hover:-rotate-1",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? "2.6" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      name: "Contact",
      path: "/contact",
      chapter: "05",
      badge: "Say Hi",
      shortLabel: "Contact",
      accentHex: "#f43f5e", // Rose Coral
      activeClassLight: "bg-rose-400 text-black shadow-[3px_3px_0_#000]",
      hoverClassLight: "hover:bg-rose-100 hover:text-rose-900 hover:rotate-1",
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? "2.6" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* ── Top Header (Desktop & Mobile) ── */}
      <header className="w-full sticky top-0 z-40 bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-black/10 dark:border-stone-800 py-2.5 px-4 sm:px-6 transition-colors duration-200">
        <div className="max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Link to Cover */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2 font-mono text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-3.5 py-1.5 rounded-full tracking-wider border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#555] dark:shadow-[2.5px_2.5px_0_#aaa] hover:-translate-y-0.5 active:translate-y-0.5 transition-all select-none"
            title="Return to Cover"
          >
            {/* Mascot Smiley */}
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

            <span className="text-[10px] text-stone-400 group-hover:text-white dark:group-hover:text-black transition-colors font-sans">
              ↵
            </span>
          </Link>

          {/* Desktop Navigation Pills */}
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
                  <span
                    className={`flex items-center justify-center ${
                      isActive ? "" : "text-black dark:text-stone-300"
                    }`}
                  >
                    {p.icon(isActive)}
                  </span>

                  <span>{p.name}</span>

                  {isActive && (
                    <span
                      className="absolute -top-2 -right-1 text-[11px] text-amber-500 dark:text-amber-300 animate-pulse pointer-events-none select-none"
                      aria-hidden="true"
                    >
                      ✦
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Theme Switcher in Desktop Nav */}
            <div className="ml-2 pl-2 border-l-2 border-black/20 dark:border-white/20">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Top Header: Theme Toggle (Clean, zero hamburger clutter) */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── iOS-Style Floating Bottom Navigation Dock (Mobile Only) ── */}
      <nav
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[390px] backdrop-blur-2xl bg-white/85 dark:bg-stone-900/85 border border-black/15 dark:border-white/15 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] p-1.5 flex items-center justify-between gap-1 select-none"
        aria-label="iOS Mobile Navigation Bar"
      >
        {/* Cover / Home Button */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-90 ${
            pathname === "/"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold scale-[1.03]"
              : "text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white"
          }`}
          title="Return to Cover"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[10px] font-mono tracking-tight font-bold uppercase mt-0.5">
            Cover
          </span>
        </Link>

        {/* Inner Pages: About, Projects, Certs, Contact */}
        {pages.map((p) => {
          const isActive = pathname === p.path;
          return (
            <Link
              key={p.path}
              href={p.path}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-full transition-all duration-200 active:scale-90 ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-sm font-bold scale-[1.03]"
                  : "text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center">
                {p.icon(isActive)}
              </span>
              <span className="text-[10px] font-mono tracking-tight font-bold uppercase mt-0.5">
                {p.shortLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
