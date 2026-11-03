"use client"

import React, { useState } from "react"
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
  Code2,
  Cpu,
  LayoutGrid,
} from "lucide-react"
import { GithubIcon } from "@/components/SocialIcons"
import { CircularProjectsCarousel } from "@/components/CircularProjectsCarousel"

/**
 * Handcrafted Doodle #1 — The Alchemist's Lab Flask 🧪
 */
function LabFlaskDoodle({ className = "", isPhone = false }: { className?: string; isPhone?: boolean }) {
  if (isPhone) {
    return (
      <div className={`relative inline-flex items-center align-middle ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 100 110"
          className="w-8 h-9 drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)] filter overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Floating math / code bubbles */}
          <circle cx="50" cy="12" r="3" fill="#f59e0b" stroke="none" />
          <circle cx="34" cy="22" r="2.2" fill="#10b981" stroke="none" />
          <circle cx="68" cy="18" r="3.5" fill="#8b5cf6" stroke="none" />

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
          <circle cx="38" cy="91" r="1.8" fill="#ffffff" stroke="none" />
          <circle cx="58" cy="88" r="2.2" fill="#ffffff" stroke="none" />
        </svg>
      </div>
    );
  }

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

      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-purple-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] text-xs font-bold rotate-[2deg] animate-doodle-float-reverse transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_#fff] cursor-default group/sticker"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-purple-950 dark:text-purple-200 text-sm inline-flex items-center gap-1.5">
          <span>algorithms in the lab</span>
          <span className="inline-block transition-transform duration-300 group-hover/sticker:scale-125 group-hover/sticker:rotate-12 animate-spark-glow">🧪</span>
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
        className="w-24 sm:w-28 h-14 overflow-visible drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] animate-doodle-float"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
        <line x1="6" y1="20" x2="114" y2="20" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
        <circle cx="16" cy="13" r="2.5" fill="#f43f5e" stroke="none" />
        <circle cx="24" cy="13" r="2.5" fill="#fbbf24" stroke="none" />
        <circle cx="32" cy="13" r="2.5" fill="#10b981" stroke="none" />
        <path d="M 16 32 L 24 38 L 16 44" stroke="#8b5cf6" strokeWidth="2.4" />
        <line x1="28" y1="44" x2="42" y2="44" stroke="#8b5cf6" strokeWidth="2.4" />
        <line x1="16" y1="54" x2="55" y2="54" stroke="#a1a1aa" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 rotate-[-1deg] animate-doodle-float-reverse inline-block transition-transform duration-200 hover:scale-105 cursor-default"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        clean terminal logic 💻
      </span>
    </div>
  )
}

export function ProjectsSection({ id = "projects" }: { id?: string }) {
  const { data: portfolio } = usePortfolio()
  const projectsList: Project[] = (Array.isArray(portfolio?.projects)
    ? portfolio.projects
    : []).filter((p) => p.isVisible !== false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d")

  const dynamicCategoryNames = React.useMemo(() => {
    // Surface only categories that actually contain at least one project
    const fromProjects = Array.from(
      new Set((projectsList || []).map((p) => p.category?.trim()))
    ).filter(Boolean) as string[]

    return fromProjects
  }, [projectsList])

  // Reset active filter if current active category no longer exists
  React.useEffect(() => {
    if (activeCategory !== "All" && !dynamicCategoryNames.includes(activeCategory)) {
      setActiveCategory("All")
    }
  }, [activeCategory, dynamicCategoryNames])

  const COLOR_PALETTE = ["purple", "emerald", "cyan", "amber", "rose", "indigo", "teal", "orange"]

  const categories = React.useMemo(() => {
    return [
      { label: "All", name: "ALL PROJECTS", color: "all" },
      ...dynamicCategoryNames.map((name, idx) => ({
        label: name,
        name: name.toUpperCase(),
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      })),
    ]
  }, [dynamicCategoryNames])

  const filtered =
    activeCategory === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === activeCategory)

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
      shadow: "shadow-[4px_4px_0_#8b5cf6] dark:shadow-[4px_4px_0_#a855f7]",
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
        "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-purple-600 dark:border-purple-400 text-purple-800 dark:text-purple-200 bg-white dark:bg-stone-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-[2px_2px_0_#8b5cf6]",
    },
    "Data Analysis": {
      accent: "#10b981",
      border: "border-black dark:border-emerald-400/80",
      cardBg:
        "bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/35 dark:from-stone-900 dark:via-emerald-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#10b981] dark:shadow-[4px_4px_0_#34d399]",
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
        "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-[2px_2px_0_#10b981]",
    },
    "Web & AI Tools": {
      accent: "#06b6d4",
      border: "border-black dark:border-sky-400/80",
      cardBg:
        "bg-gradient-to-br from-sky-50/75 via-white to-cyan-50/35 dark:from-stone-900 dark:via-sky-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#0284c7] dark:shadow-[4px_4px_0_#38bdf8]",
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
        "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-sky-600 dark:border-sky-400 text-sky-800 dark:text-sky-200 bg-white dark:bg-stone-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 shadow-[2px_2px_0_#0284c7]",
    },
    "Python Basics": {
      accent: "#f59e0b",
      border: "border-black dark:border-amber-400/80",
      cardBg:
        "bg-gradient-to-br from-amber-50/75 via-white to-orange-50/35 dark:from-stone-900 dark:via-amber-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
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
        "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-400 dark:hover:bg-amber-500 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-[2px_2px_0_#f59e0b]",
    },
    amber: {
      accent: "#f59e0b",
      border: "border-black dark:border-amber-400/80",
      cardBg:
        "bg-gradient-to-br from-amber-50/75 via-white to-orange-50/35 dark:from-stone-900 dark:via-amber-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
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
        "bg-amber-500 hover:bg-amber-600 text-black dark:bg-amber-400 dark:hover:bg-amber-500 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-amber-500 dark:border-amber-400 text-amber-900 dark:text-amber-200 bg-white dark:bg-stone-900 hover:bg-amber-50 dark:hover:bg-amber-950/40 shadow-[2px_2px_0_#f59e0b]",
    },
    emerald: {
      accent: "#10b981",
      border: "border-black dark:border-emerald-400/80",
      cardBg:
        "bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/35 dark:from-stone-900 dark:via-emerald-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#10b981] dark:shadow-[4px_4px_0_#34d399]",
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
        "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-200 bg-white dark:bg-stone-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-[2px_2px_0_#10b981]",
    },
    cyan: {
      accent: "#06b6d4",
      border: "border-black dark:border-sky-400/80",
      cardBg:
        "bg-gradient-to-br from-sky-50/75 via-white to-cyan-50/35 dark:from-stone-900 dark:via-sky-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#0284c7] dark:shadow-[4px_4px_0_#38bdf8]",
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
        "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-sky-600 dark:border-sky-400 text-sky-800 dark:text-sky-200 bg-white dark:bg-stone-900 hover:bg-sky-50 dark:hover:bg-sky-950/40 shadow-[2px_2px_0_#0284c7]",
    },
    rose: {
      accent: "#f43f5e",
      border: "border-black dark:border-rose-400/80",
      cardBg:
        "bg-gradient-to-br from-rose-50/75 via-white to-pink-50/35 dark:from-stone-900 dark:via-rose-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#f43f5e] dark:shadow-[4px_4px_0_#fb7185]",
      washi: "bg-rose-200/90 dark:bg-rose-400/30",
      stampBg: "bg-rose-600 text-white dark:bg-rose-500 dark:text-white",
      badgeClass:
        "bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-600",
      metricsBox:
        "bg-rose-50/90 dark:bg-stone-800/80 border-rose-200 dark:border-rose-800/80 text-rose-950 dark:text-rose-200",
      metricBullet: "text-rose-600 dark:text-rose-400",
      techPill:
        "border-rose-300 dark:border-rose-700 bg-white dark:bg-stone-800 text-rose-800 dark:text-rose-200 shadow-[1px_1px_0_#f43f5e]",
      btnPrimary:
        "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-rose-600 dark:border-rose-400 text-rose-800 dark:text-rose-200 bg-white dark:bg-stone-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-[2px_2px_0_#f43f5e]",
    },
    purple: {
      accent: "#8b5cf6",
      border: "border-black dark:border-purple-400/80",
      cardBg:
        "bg-gradient-to-br from-violet-50/75 via-white to-purple-50/35 dark:from-stone-900 dark:via-purple-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#8b5cf6] dark:shadow-[4px_4px_0_#a855f7]",
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
        "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-purple-600 dark:border-purple-400 text-purple-800 dark:text-purple-200 bg-white dark:bg-stone-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 shadow-[2px_2px_0_#8b5cf6]",
    },
    indigo: {
      accent: "#6366f1",
      border: "border-black dark:border-indigo-400/80",
      cardBg:
        "bg-gradient-to-br from-indigo-50/75 via-white to-blue-50/35 dark:from-stone-900 dark:via-indigo-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#6366f1] dark:shadow-[4px_4px_0_#818cf8]",
      washi: "bg-indigo-200/90 dark:bg-indigo-400/30",
      stampBg: "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white",
      badgeClass:
        "bg-indigo-100 text-indigo-900 border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-600",
      metricsBox:
        "bg-indigo-50/90 dark:bg-stone-800/80 border-indigo-200 dark:border-indigo-800/80 text-indigo-950 dark:text-indigo-200",
      metricBullet: "text-indigo-600 dark:text-indigo-400",
      techPill:
        "border-indigo-300 dark:border-indigo-700 bg-white dark:bg-stone-800 text-indigo-800 dark:text-indigo-200 shadow-[1px_1px_0_#6366f1]",
      btnPrimary:
        "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-indigo-600 dark:border-indigo-400 text-indigo-800 dark:text-indigo-200 bg-white dark:bg-stone-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 shadow-[2px_2px_0_#6366f1]",
    },
    orange: {
      accent: "#f97316",
      border: "border-black dark:border-orange-400/80",
      cardBg:
        "bg-gradient-to-br from-orange-50/75 via-white to-amber-50/35 dark:from-stone-900 dark:via-orange-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#f97316] dark:shadow-[4px_4px_0_#fb923c]",
      washi: "bg-orange-200/90 dark:bg-orange-400/30",
      stampBg: "bg-orange-600 text-white dark:bg-orange-500 dark:text-white",
      badgeClass:
        "bg-orange-100 text-orange-900 border-orange-400 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-600",
      metricsBox:
        "bg-orange-50/90 dark:bg-stone-800/80 border-orange-200 dark:border-orange-800/80 text-orange-950 dark:text-orange-200",
      metricBullet: "text-orange-600 dark:text-orange-400",
      techPill:
        "border-orange-300 dark:border-orange-700 bg-white dark:bg-stone-800 text-orange-800 dark:text-orange-200 shadow-[1px_1px_0_#f97316]",
      btnPrimary:
        "bg-orange-600 hover:bg-orange-700 text-white dark:bg-orange-500 dark:hover:bg-orange-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-orange-600 dark:border-orange-400 text-orange-800 dark:text-orange-200 bg-white dark:bg-stone-900 hover:bg-orange-50 dark:hover:bg-orange-950/40 shadow-[2px_2px_0_#f97316]",
    },
    teal: {
      accent: "#14b8a6",
      border: "border-black dark:border-teal-400/80",
      cardBg:
        "bg-gradient-to-br from-teal-50/75 via-white to-cyan-50/35 dark:from-stone-900 dark:via-teal-950/25 dark:to-stone-900",
      shadow: "shadow-[4px_4px_0_#14b8a6] dark:shadow-[4px_4px_0_#2dd4bf]",
      washi: "bg-teal-200/90 dark:bg-teal-400/30",
      stampBg: "bg-teal-600 text-white dark:bg-teal-500 dark:text-white",
      badgeClass:
        "bg-teal-100 text-teal-900 border-teal-400 dark:bg-teal-950/60 dark:text-teal-200 dark:border-teal-600",
      metricsBox:
        "bg-teal-50/90 dark:bg-stone-800/80 border-teal-200 dark:border-teal-800/80 text-teal-950 dark:text-teal-200",
      metricBullet: "text-teal-600 dark:text-teal-400",
      techPill:
        "border-teal-300 dark:border-teal-700 bg-white dark:bg-stone-800 text-teal-800 dark:text-teal-200 shadow-[1px_1px_0_#14b8a6]",
      btnPrimary:
        "bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]",
      btnSecondary:
        "border-2 border-teal-600 dark:border-teal-400 text-teal-800 dark:text-teal-200 bg-white dark:bg-stone-900 hover:bg-teal-50 dark:hover:bg-teal-950/40 shadow-[2px_2px_0_#14b8a6]",
    },
  }

  const defaultTheme = themeMap["Machine Learning"]

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-10 sm:space-y-12 scroll-mt-14">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>{portfolio.personal.projectsHeading || "Projects and Builds"}</span>
              {/* On phone: Cute lab flask doodle placed directly next to 'BUILDS' */}
              <span className="inline-flex lg:hidden shrink-0 -mt-1 sm:-mt-2">
                <LabFlaskDoodle isPhone />
              </span>
            </h2>

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
              {portfolio.personal.projectsSubtitle || "End-to-end exploratory data analysis, foundational machine learning algorithms, and scientific Python tools engineered with clean code and mathematical rigor."}
            </p>
          </div>

          {/* On laptop & desktop: keep the right-hand Lab Flask Doodle with speech bubble */}
          <div className="hidden lg:block self-start lg:self-end">
            <LabFlaskDoodle />
          </div>
        </div>

        {/* ── FILTER PILLS & VIEW MODE SWITCHER ── */}
        {projectsList.length > 0 && (
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
              {categories.map((cat) => {
                const count =
                  cat.label === "All"
                    ? projectsList.length
                    : projectsList.filter((p) => p.category === cat.label).length

                const isActive = activeCategory === cat.label

                let activeStyle = "bg-black text-white shadow-[2.5px_2.5px_0_#8b5cf6]"
                if (cat.color === "purple") {
                  activeStyle = "bg-purple-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "emerald") {
                  activeStyle = "bg-emerald-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "cyan") {
                  activeStyle = "bg-sky-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "amber") {
                  activeStyle = "bg-amber-400 text-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "rose") {
                  activeStyle = "bg-rose-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "indigo") {
                  activeStyle = "bg-indigo-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "teal") {
                  activeStyle = "bg-teal-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                } else if (cat.color === "orange") {
                  activeStyle = "bg-orange-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                }

                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setActiveCategory(cat.label)}
                    className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? activeStyle
                        : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                    }`}
                  >
                    {isActive && <Sparkles className="w-3 h-3 text-amber-300" />}
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75 font-bold">({count})</span>
                  </button>
                )
              })}
            </div>

            {/* Perspective View Switcher: 3D Cylinder vs Grid Dossiers */}
            <div className="inline-flex items-center self-start md:self-auto p-1 rounded-full border-2 border-black dark:border-white bg-white dark:bg-stone-900 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff]">
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "3d"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>3D CYLINDER</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span>GRID DOSSIERS</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── SHOWCASE: 3D Perspective Circular Deck OR Full Color-Coded Dossiers ── */}
      {projectsList.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-[28px] border-2 border-dashed border-stone-300 dark:border-stone-700 bg-white/50 dark:bg-stone-900/40 text-center space-y-3 font-mono">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 border-2 border-black dark:border-amber-400 flex items-center justify-center shadow-[2px_2px_0_#000]">
            <FolderGit2 className="w-6 h-6 text-amber-700 dark:text-amber-300" />
          </div>
          <h3 className="text-base font-black uppercase text-stone-900 dark:text-stone-100">
            No Projects Published Yet
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
            Projects added through the Socius Admin Console will appear here automatically.
          </p>
        </div>
      ) : viewMode === "3d" ? (
        <div className="space-y-4">
          <CircularProjectsCarousel projects={filtered} />
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className="font-mono text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Prefer traditional catalog view? Switch to Full Dossier Grid ({filtered.length} projects) →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filtered.map((proj, idx) => {
            const projectColorKey = (proj.color || "").toLowerCase().trim();
            const t = themeMap[projectColorKey] || themeMap[proj.category] || defaultTheme

            return (
              <article
                key={proj.id}
                id={proj.id}
                className="scroll-mt-28 p-4 sm:p-5 rounded-[28px] liquid-bento-card flex flex-col justify-between group space-y-4 relative transition-all duration-200"
              >
                {/* Washi tape sticker */}
                <div
                  className={`absolute -top-2.5 right-6 w-16 h-4 ${t.washi} border border-black/35 dark:border-white/35 rotate-[2.5deg] rounded-xs pointer-events-none shadow-xs z-10`}
                  aria-hidden="true"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black/15 dark:border-stone-700 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`sketch-stamp text-[10.5px] ${t.stampBg}`}>
                        PROJ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                    </div>

                    <span
                      className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full border ${t.badgeClass}`}
                    >
                      {proj.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black uppercase text-black dark:text-white tracking-tight group-hover:underline leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs font-bold text-stone-700 dark:text-stone-300 mt-1 leading-snug">
                      {proj.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                    {proj.description}
                  </p>

                  {proj.features && proj.features.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                        ENGINEERING HIGHLIGHTS:
                      </span>
                      <ul className="space-y-0.5 text-[11.5px] text-stone-800 dark:text-stone-200 font-medium">
                        {proj.features.slice(0, 3).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-1.5">
                            <CheckCircle2
                              className="w-3 h-3 mt-0.5 shrink-0"
                              style={{ color: t.accent }}
                            />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {proj.metrics && proj.metrics.length > 0 && (
                    <div className={`p-2.5 rounded-lg border ${t.metricsBox} space-y-1`}>
                      <div className="flex items-center justify-between font-mono text-[9px] font-black uppercase tracking-wider">
                        <span>KEY OBSERVATIONS</span>
                        <span className="text-xs">📊</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                        {proj.metrics.map((m, i) => (
                          <span
                            key={i}
                            className="font-black text-black dark:text-white flex items-center gap-1 bg-white/70 dark:bg-stone-900/60 px-2 py-0.5 rounded border border-black/10 dark:border-white/10"
                          >
                            <span className={`${t.metricBullet} text-xs`}>✦</span>
                            <span>{m}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-black/10 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {proj.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className={`text-[9.5px] px-2 py-0.5 rounded-md font-bold border ${t.techPill}`}
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 3 && (
                      <span className="text-[9.5px] font-mono text-stone-500 dark:text-stone-400 font-bold self-center">
                        +{proj.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-black uppercase flex items-center gap-1 transition-all ${t.btnPrimary}`}
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Repo</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>

                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-black uppercase flex items-center gap-1.5 transition-all bg-red-600 hover:bg-red-500 text-white border-2 border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:-translate-y-0.5"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                        </span>
                        <span>Live</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
