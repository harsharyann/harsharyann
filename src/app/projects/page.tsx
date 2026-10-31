"use client"

import React, { useState } from "react"
import Link from "next/link"
import { portfolioData, Project } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  Layers,
  Terminal,
  Send,
  Code2,
  Cpu,
} from "lucide-react"
import { GithubIcon } from "@/components/SocialIcons"

/**
 * Handcrafted Doodle #1 — The Alchemist's Lab Flask 🧪
 * Bubbling with logic and mathematical sparks
 */
function LabFlaskDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 110"
        className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] filter overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Floating math / code bubbles */}
        <circle cx="50" cy="12" r="3.5" fill="#f59e0b" stroke="none" />
        <circle cx="34" cy="22" r="2.5" fill="#10b981" stroke="none" />
        <circle cx="68" cy="18" r="4.5" fill="#8b5cf6" stroke="none" />
        <path d="M 46 26 L 50 30 M 50 26 L 46 30" stroke="#06b6d4" strokeWidth="2" />

        {/* Flask Neck & Lip */}
        <rect x="42" y="32" width="16" height="5" rx="1.5" fill="#ffffff" stroke="#000000" className="dark:fill-stone-800 dark:stroke-white" />
        <path d="M 45 37 L 45 52" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
        <path d="M 55 37 L 55 52" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />

        {/* Conical Flask Body */}
        <path
          d="M 45 52 L 20 94 C 18 97 21 102 26 102 L 74 102 C 79 102 82 97 80 94 L 55 52 Z"
          fill="#faf5ff"
          stroke="#000000"
          className="dark:fill-purple-950/30 dark:stroke-white"
          strokeWidth="2.6"
        />

        {/* Liquid level with wavy surface */}
        <path
          d="M 28 82 Q 40 76 50 82 Q 60 88 72 82 L 77 98 C 76 100 74 101 71 101 L 29 101 C 26 101 24 100 23 98 Z"
          fill="#c084fc"
          stroke="#7e22ce"
          className="dark:fill-purple-500/60 dark:stroke-purple-300"
          strokeWidth="2"
        />

        {/* Bubbles in liquid */}
        <circle cx="38" cy="91" r="2" fill="#ffffff" stroke="none" />
        <circle cx="58" cy="88" r="2.8" fill="#ffffff" stroke="none" />
        <circle cx="48" cy="94" r="1.5" fill="#ffffff" stroke="none" />

        {/* Reflection shine line */}
        <path d="M 28 88 L 32 68" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>

      {/* Handwritten marginal note */}
      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-purple-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-xs font-bold rotate-[2deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-purple-950 dark:text-purple-200 text-sm">
          algorithms in the lab 🧪
        </span>
      </div>
    </div>
  )
}

/**
 * Handcrafted Doodle #2 — The Terminal Window 💻
 */
function TerminalDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 120 70"
        className="w-24 sm:w-28 h-14 overflow-visible drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Terminal Window Box */}
        <rect
          x="6"
          y="6"
          width="108"
          height="58"
          rx="6"
          fill="#ffffff"
          stroke="#000000"
          className="dark:fill-stone-900 dark:stroke-white"
          strokeWidth="2.4"
        />
        {/* Header Bar with 3 Dots */}
        <line x1="6" y1="20" x2="114" y2="20" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
        <circle cx="16" cy="13" r="2.5" fill="#f43f5e" stroke="none" />
        <circle cx="24" cy="13" r="2.5" fill="#fbbf24" stroke="none" />
        <circle cx="32" cy="13" r="2.5" fill="#10b981" stroke="none" />

        {/* Code Prompt Text */}
        <path d="M 16 32 L 22 37 L 16 42" stroke="#0284c7" className="dark:stroke-cyan-400" strokeWidth="2.2" />
        <line x1="28" y1="37" x2="62" y2="37" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" strokeDasharray="6 3" />
        <path d="M 16 51 L 44 51" stroke="#8b5cf6" className="dark:stroke-purple-400" strokeWidth="2" />
        <rect x="48" y="47" width="5" height="8" fill="#10b981" stroke="none" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-sky-700 dark:text-cyan-300 rotate-[-1.5deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        clean, tested logic ⚡
      </span>
    </div>
  )
}

/**
 * Handcrafted Doodle #3 — The Blastoff Rocket 🚀
 */
function RocketDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 110 90"
        className="w-20 sm:w-24 h-16 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Exhaust flame & smoke puffs */}
        <path
          d="M 28 64 Q 18 72 24 82 Q 32 78 34 84 Q 40 76 44 80 Q 42 70 38 64"
          fill="#f97316"
          stroke="#ea580c"
          strokeWidth="2"
        />
        <circle cx="16" cy="84" r="3" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx="28" cy="86" r="2.5" fill="#fef08a" stroke="#f59e0b" strokeWidth="1.5" />

        {/* Rocket Body */}
        <g transform="rotate(40 45 45)">
          {/* Wings / Fins */}
          <polygon points="30,48 18,60 32,56" fill="#f43f5e" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
          <polygon points="50,48 62,60 48,56" fill="#f43f5e" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />

          {/* Fuselage */}
          <path
            d="M 32 54 C 30 40 34 24 40 14 C 46 24 50 40 48 54 Z"
            fill="#ffffff"
            stroke="#000000"
            className="dark:fill-stone-800 dark:stroke-white"
            strokeWidth="2.4"
          />

          {/* Cockpit Porthole */}
          <circle cx="40" cy="30" r="4.5" fill="#38bdf8" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
          <circle cx="41.5" cy="28.5" r="1.5" fill="#ffffff" stroke="none" />

          {/* Nose cone tint */}
          <path d="M 37 20 C 39 16 41 16 43 20 Z" fill="#f43f5e" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
        </g>
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 rotate-[1deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        ready to launch 🚀
      </span>
    </div>
  )
}

export default function ProjectsPage() {
  const { data: portfolio } = usePortfolio()
  const projectsList: Project[] = portfolio?.projects || portfolioData.projects
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = [
    { label: "All", name: "ALL PROJECTS", color: "all" },
    { label: "Machine Learning", name: "MACHINE LEARNING", color: "purple" },
    { label: "Data Analysis", name: "DATA ANALYSIS", color: "emerald" },
    { label: "Web & AI Tools", name: "WEB & AI TOOLS", color: "cyan" },
    { label: "Python Basics", name: "PYTHON BASICS", color: "amber" },
  ]

  const filtered =
    activeCategory === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeCategory)

  // Color theme definitions for project cards based on category
  const themeMap: Record<
    string,
    {
      accent: string
      border: string
      cardBg: string
      shadow: string
      washi: string
      stampBg: string
      badgeClass: string
      metricsBox: string
      metricBullet: string
      techPill: string
      btnPrimary: string
      btnSecondary: string
    }
  > = {
    "Machine Learning": {
      accent: "#8b5cf6",
      border: "border-black dark:border-purple-400/80",
      cardBg:
        "bg-gradient-to-br from-violet-50/75 via-white to-purple-50/35 dark:from-stone-900 dark:via-purple-950/25 dark:to-stone-900",
      shadow: "shadow-[6px_6px_0_#8b5cf6] dark:shadow-[6px_6px_0_#a855f7]",
      washi: "bg-purple-200/90 dark:bg-purple-400/30",
      stampBg: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
      badgeClass:
        "bg-purple-100 text-purple-900 border-purple-400 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-600",
      metricsBox:
        "bg-purple-50/90 dark:bg-stone-800/80 border-purple-200 dark:border-purple-800/80 text-purple-950 dark:text-purple-200",
      metricBullet: "text-purple-600 dark:text-purple-400",
      techPill:
        "border-purple-300 dark:border-purple-700 bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 shadow-[1px_1px_0_#8b5cf6]",
      btnPrimary:
        "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff]",
      btnSecondary:
        "border-2 border-purple-600 dark:border-purple-400 text-purple-800 dark:text-purple-200 bg-white dark:bg-stone-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-[2.5px_2.5px_0_#8b5cf6]",
    },
    "Data Analysis": {
      accent: "#10b981",
      border: "border-black dark:border-emerald-400/80",
      cardBg:
        "bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/35 dark:from-stone-900 dark:via-emerald-950/25 dark:to-stone-900",
      shadow: "shadow-[6px_6px_0_#10b981] dark:shadow-[6px_6px_0_#34d399]",
      washi: "bg-emerald-200/90 dark:bg-emerald-400/30",
      stampBg: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white",
      badgeClass:
        "bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600",
      metricsBox:
        "bg-emerald-50/90 dark:bg-stone-800/80 border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200",
      metricBullet: "text-emerald-600 dark:text-emerald-400",
      techPill:
        "border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-200 shadow-[1px_1px_0_#10b981]",
      btnPrimary:
        "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff]",
      btnSecondary:
        "border-2 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-[2.5px_2.5px_0_#10b981]",
    },
    "Web & AI Tools": {
      accent: "#06b6d4",
      border: "border-black dark:border-sky-400/80",
      cardBg:
        "bg-gradient-to-br from-sky-50/75 via-white to-cyan-50/35 dark:from-stone-900 dark:via-sky-950/25 dark:to-stone-900",
      shadow: "shadow-[6px_6px_0_#0284c7] dark:shadow-[6px_6px_0_#38bdf8]",
      washi: "bg-sky-200/90 dark:bg-sky-400/30",
      stampBg: "bg-sky-600 text-white dark:bg-sky-500 dark:text-white",
      badgeClass:
        "bg-sky-100 text-sky-900 border-sky-400 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-600",
      metricsBox:
        "bg-sky-50/90 dark:bg-stone-800/80 border-sky-200 dark:border-sky-800/80 text-sky-950 dark:text-sky-200",
      metricBullet: "text-sky-600 dark:text-sky-400",
      techPill:
        "border-sky-300 dark:border-sky-700 bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-200 shadow-[1px_1px_0_#0284c7]",
      btnPrimary:
        "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff]",
      btnSecondary:
        "border-2 border-sky-600 dark:border-sky-400 text-sky-800 dark:text-sky-200 bg-white dark:bg-stone-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 shadow-[2.5px_2.5px_0_#0284c7]",
    },
    "Python Basics": {
      accent: "#f59e0b",
      border: "border-black dark:border-amber-400/80",
      cardBg:
        "bg-gradient-to-br from-amber-50/75 via-white to-orange-50/35 dark:from-stone-900 dark:via-amber-950/25 dark:to-stone-900",
      shadow: "shadow-[6px_6px_0_#f59e0b] dark:shadow-[6px_6px_0_#fbbf24]",
      washi: "bg-amber-200/90 dark:bg-amber-400/30",
      stampBg: "bg-amber-500 text-black dark:bg-amber-400 dark:text-black",
      badgeClass:
        "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-600",
      metricsBox:
        "bg-amber-50/90 dark:bg-stone-800/80 border-amber-200 dark:border-amber-800/80 text-amber-950 dark:text-amber-200",
      metricBullet: "text-amber-600 dark:text-amber-400",
      techPill:
        "border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-amber-800 dark:text-amber-200 shadow-[1px_1px_0_#f59e0b]",
      btnPrimary:
        "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-400 dark:hover:bg-amber-500 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff]",
      btnSecondary:
        "border-2 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-[2.5px_2.5px_0_#f59e0b]",
    },
  }

  // Fallback theme
  const defaultTheme = themeMap["Machine Learning"]

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12">
      {/* =========================================================================
          PAGE HEADER with Thematic Badge, Stats Strip, & DOODLE #1 (Lab Flask)
      ========================================================================= */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-purple-600 text-white font-black shadow-[2px_2px_0_#000]">
              CHAPTER 03 • LAB EXPERIMENTS &amp; BUILDS
            </span>
            <span className="hidden sm:inline-block font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [OPEN REPOSITORIES]
            </span>
          </div>

          {/* Micro Stats Pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-400 text-purple-800 dark:text-purple-300 font-bold">
              <Code2 className="w-3 h-3 text-purple-500" />
              6 Hands-On Projects
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              100% Reproducible
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
              Projects &amp; Builds
            </h1>

            {/* Hand-drawn colorful squiggle underline */}
            <svg
              className="w-48 sm:w-64 h-3 text-purple-500 overflow-visible"
              viewBox="0 0 240 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>

            <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 leading-relaxed">
              End-to-end exploratory data analysis, foundational machine learning algorithms, and scientific Python tools engineered with clean code and mathematical rigor.
            </p>
          </div>

          {/* BESPOKE DOODLE #1: The Alchemist's Lab Flask */}
          <div className="self-start lg:self-end">
            <LabFlaskDoodle />
          </div>
        </div>

        {/* =========================================================================
            COLORFUL CATEGORY FILTER PILLS
        ========================================================================= */}
        <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          {categories.map((cat) => {
            const count =
              cat.label === "All"
                ? projectsList.length
                : projectsList.filter((p) => p.category === cat.label).length

            const isActive = activeCategory === cat.label

            // Distinct active styling based on category
            let activeStyle = "bg-black text-white shadow-[3px_3px_0_#8b5cf6]"
            if (cat.color === "purple") {
              activeStyle = "bg-purple-600 text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]"
            } else if (cat.color === "emerald") {
              activeStyle = "bg-emerald-600 text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]"
            } else if (cat.color === "cyan") {
              activeStyle = "bg-sky-600 text-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]"
            } else if (cat.color === "amber") {
              activeStyle = "bg-amber-400 text-black shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff]"
            }

            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.label)}
                className={`px-3.5 py-1.5 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? activeStyle
                    : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#666]"
                }`}
              >
                {isActive && <Sparkles className="w-3 h-3 text-amber-300" />}
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-bold">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          PROJECTS GRID — High-Craft Color-Coded Dossiers
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {filtered.map((proj, idx) => {
          const t = themeMap[proj.category] || defaultTheme

          return (
            <article
              key={proj.id}
              id={proj.id}
              className={`scroll-mt-28 p-6 sm:p-7 rounded-xl border-2 ${t.border} ${t.cardBg} ${t.shadow} flex flex-col justify-between group space-y-6 relative transition-all duration-200 hover:-translate-y-1`}
            >
              {/* Tilted Pastel Washi-Tape Sticker in Top Right Corner */}
              <div
                className={`absolute -top-3 right-8 w-20 h-5 ${t.washi} border border-black/35 dark:border-white/35 rotate-[2.5deg] rounded-sm pointer-events-none shadow-xs z-10`}
                aria-hidden="true"
              />

              <div className="space-y-4">
                {/* Header Meta Stamp & Category Tag */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-black/20 dark:border-stone-700 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`sketch-stamp ${t.stampBg}`}>
                      PROJ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] font-bold text-stone-500 dark:text-stone-400">
                      ID: {proj.id}
                    </span>
                  </div>

                  <span
                    className={`font-black uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-full border ${t.badgeClass}`}
                  >
                    {proj.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white tracking-tight group-hover:underline leading-snug">
                    {proj.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mt-1.5 leading-snug">
                    {proj.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                  {proj.description}
                </p>

                {/* Core Features Checklist */}
                {proj.features && proj.features.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                      ENGINEERING HIGHLIGHTS:
                    </span>
                    <ul className="space-y-1 text-xs text-stone-800 dark:text-stone-200 font-medium">
                      {proj.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 mt-0.5 shrink-0"
                            style={{ color: t.accent }}
                          />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Metrics / Observations Box */}
                {proj.metrics && proj.metrics.length > 0 && (
                  <div className={`p-3.5 rounded-lg border ${t.metricsBox} space-y-1.5`}>
                    <div className="flex items-center justify-between font-mono text-[10px] font-black uppercase tracking-wider">
                      <span>KEY OBSERVATIONS &amp; METRICS</span>
                      <span className="text-xs">📊</span>
                    </div>
                    <div className="flex flex-wrap gap-2 font-mono text-xs">
                      {proj.metrics.map((m, i) => (
                        <span
                          key={i}
                          className="font-black text-black dark:text-white flex items-center gap-1.5 bg-white/70 dark:bg-stone-900/60 px-2 py-0.5 rounded border border-black/10 dark:border-white/10"
                        >
                          <span className={`${t.metricBullet} text-xs`}>✦</span>
                          <span>{m}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                    TECH STACK &amp; FRAMEWORKS:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`border px-2.5 py-0.5 rounded-full font-bold ${t.techPill}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons: GitHub & Live Demo */}
              <div className="pt-4 border-t-2 border-dashed border-black/20 dark:border-stone-700 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-xs font-mono font-black uppercase tracking-wider py-2.5 px-4 rounded-md flex-1 text-center flex items-center justify-center gap-2 border-2 border-black dark:border-white transition-all duration-150 ${t.btnPrimary}`}
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-xs font-mono font-black uppercase tracking-wider py-2.5 px-4 rounded-md flex-1 text-center flex items-center justify-center gap-2 transition-all duration-150 ${t.btnSecondary}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* =========================================================================
          BOTTOM CALLOUT: The Builder's Workbench
          (Features Doodle #3: The Blastoff Rocket)
      ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-xl border-2 border-black dark:border-white bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 dark:from-stone-900 dark:via-purple-950/30 dark:to-stone-900 shadow-[6px_6px_0_#8b5cf6] dark:shadow-[6px_6px_0_#a855f7] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="font-mono text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>OPEN FOR EXPERIMENTS &amp; INTERNSHIPS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white">
            Have a dataset to model or an algorithm to build?
          </h3>
          <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 max-w-xl">
            Check out the code on GitHub or reach out to discuss machine learning applications, EDA workflows, and hackathons.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {/* BESPOKE DOODLE #3: Rocket Doodle */}
          <RocketDoodle className="hidden lg:inline-flex" />

          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Desk</span>
          </Link>

          <a
            href="https://github.com/harsharyann"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-white text-black dark:bg-stone-900 dark:text-white font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#06b6d4] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Profile</span>
          </a>
        </div>
      </div>
    </div>
  )
}
