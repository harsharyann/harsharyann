"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Code2,
  Terminal,
  Cpu,
  BarChart3,
  Layers,
  Pause,
  Play,
} from "lucide-react"
import { GithubIcon } from "@/components/SocialIcons"
import { Project } from "@/data/portfolioData"

export interface CircularProjectsCarouselProps {
  projects: Project[]
  autoplay?: boolean
  className?: string
}

function calculateGap(width: number): number {
  if (width < 480) return 42
  if (width < 768) return 60
  if (width < 1024) return 72
  const minWidth = 1024
  const maxWidth = 1456
  const minGap = 75
  const maxGap = 105
  if (width <= minWidth) return minGap
  if (width >= maxWidth) {
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth))
  }
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth))
}

export function CircularProjectsCarousel({
  projects = [],
  autoplay = true,
  className = "",
}: CircularProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoplay)
  const [containerWidth, setContainerWidth] = useState(1200)

  const imageContainerRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  const projectsLength = projects.length

  // Touch Swipe Handlers for Buttery Mobile Experience
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches || e.touches.length === 0) return
    touchStartXRef.current = e.touches[0].clientX
    touchStartYRef.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    if (!e.changedTouches || e.changedTouches.length === 0) return
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const diffX = touchStartXRef.current - touchEndX
    const diffY = (touchStartYRef.current || 0) - touchEndY

    // Only trigger if horizontal swipe exceeds vertical drag
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
    touchStartXRef.current = null
    touchStartYRef.current = null
  }

  // Safety clamp activeIndex if projects list changes
  useEffect(() => {
    setActiveIndex(0)
  }, [projects])

  const activeProject = useMemo(() => {
    if (!projectsLength) return null
    return projects[activeIndex] || projects[0]
  }, [activeIndex, projects, projectsLength])

  // Responsive container width measuring
  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!projectsLength) return
    setActiveIndex((prev) => (prev + 1) % projectsLength)
  }, [projectsLength])

  const handlePrev = useCallback(() => {
    if (!projectsLength) return
    setActiveIndex((prev) => (prev - 1 + projectsLength) % projectsLength)
  }, [projectsLength])

  const goTo = useCallback((idx: number) => {
    setActiveIndex(idx)
  }, [])

  // Autoplay loop
  useEffect(() => {
    if (isAutoPlaying && projectsLength > 1) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext()
      }, 5500)
    }
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    }
  }, [isAutoPlaying, projectsLength, handleNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev()
      else if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handlePrev, handleNext])

  // Compute 3D perspective transforms for each project card
  function getCard3DStyle(index: number): React.CSSProperties {
    const transformTransition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease"
    if (projectsLength <= 1) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1)",
        transition: transformTransition,
      }
    }

    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.75
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + projectsLength) % projectsLength === index
    const isRight = (activeIndex + 1) % projectsLength === index
    const isMobile = containerWidth < 640

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1)",
        transition: transformTransition,
      }
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: isMobile
          ? `translateX(-${gap * 0.65}px) translateY(-${maxStickUp * 0.4}px) scale(0.9)`
          : `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(16deg)`,
        transition: transformTransition,
        cursor: "pointer",
      }
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: isMobile
          ? `translateX(${gap * 0.65}px) translateY(-${maxStickUp * 0.4}px) scale(0.9)`
          : `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-16deg)`,
        transition: transformTransition,
        cursor: "pointer",
      }
    }

    // Hidden cards - completely skipped from rasterization for max FPS
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      visibility: "hidden",
      transform: "translateX(0px) translateY(0px) scale(0.7)",
      transition: transformTransition,
    }
  }

  // 5 Distinct, Vibrant Color Themes for Project Cards (Amber, Emerald, Indigo, Cyan, Rose)
  const getProjectTheme = (cat: string, idx: number) => {
    const c = (cat || "").toLowerCase()
    let palette = idx % 5
    if (c.includes("machine learning") || c.includes("ai")) {
      palette = 0 // Amber Gold
    } else if (c.includes("data") || c.includes("analytics")) {
      palette = 1 // Fresh Emerald
    } else if (c.includes("web") || c.includes("tool")) {
      palette = 2 // Royal Indigo
    } else if (c.includes("python") || c.includes("basic") || c.includes("calc")) {
      palette = 3 // Ocean Cyan
    } else if (c.includes("algorithm") || c.includes("math")) {
      palette = 4 // Coral Rose
    }

    const PALETTES = [
      // 0: Amber Gold (Warm, energetic)
      {
        accent: "#f59e0b",
        accentDark: "#d97706",
        cardBg: "bg-gradient-to-br from-[#fffdf8] via-[#fffbeb] to-[#fef3c7] dark:from-[#181510] dark:via-[#1e1a14] dark:to-[#13110c]",
        borderColor: "border-amber-400/80 dark:border-amber-500/50",
        shadowColor: "#d97706",
        tagBg: "bg-amber-100/90 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/60",
        iconBoxBg: "bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700/70 text-amber-800 dark:text-amber-300",
        pillDot: "bg-amber-500",
        schematicStroke: "stroke-amber-600/20 dark:stroke-amber-400/20",
        schematicFill: "fill-amber-600/15 dark:fill-amber-400/15",
      },
      // 1: Fresh Emerald (Clean, analytical)
      {
        accent: "#10b981",
        accentDark: "#059669",
        cardBg: "bg-gradient-to-br from-[#f8fdfa] via-[#ecfdf5] to-[#d1fae5] dark:from-[#0d1813] dark:via-[#122019] dark:to-[#0a140f]",
        borderColor: "border-emerald-400/80 dark:border-emerald-500/50",
        shadowColor: "#059669",
        tagBg: "bg-emerald-100/90 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-700/60",
        iconBoxBg: "bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-700/70 text-emerald-800 dark:text-emerald-300",
        pillDot: "bg-emerald-500",
        schematicStroke: "stroke-emerald-600/20 dark:stroke-emerald-400/20",
        schematicFill: "fill-emerald-600/15 dark:fill-emerald-400/15",
      },
      // 2: Royal Indigo (Modern, intellectual)
      {
        accent: "#6366f1",
        accentDark: "#4f46e5",
        cardBg: "bg-gradient-to-br from-[#f9f8ff] via-[#eef2ff] to-[#e0e7ff] dark:from-[#111322] dark:via-[#17192c] dark:to-[#0d0e1c]",
        borderColor: "border-indigo-400/80 dark:border-indigo-500/50",
        shadowColor: "#4f46e5",
        tagBg: "bg-indigo-100/90 text-indigo-950 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-700/60",
        iconBoxBg: "bg-indigo-100 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700/70 text-indigo-800 dark:text-indigo-300",
        pillDot: "bg-indigo-500",
        schematicStroke: "stroke-indigo-600/20 dark:stroke-indigo-400/20",
        schematicFill: "fill-indigo-600/15 dark:fill-indigo-400/15",
      },
      // 3: Ocean Cyan (Precise, tech-forward)
      {
        accent: "#06b6d4",
        accentDark: "#0891b2",
        cardBg: "bg-gradient-to-br from-[#f6fcfe] via-[#ecfeff] to-[#cffafe] dark:from-[#0b171c] dark:via-[#102027] dark:to-[#081216]",
        borderColor: "border-cyan-400/80 dark:border-cyan-500/50",
        shadowColor: "#0891b2",
        tagBg: "bg-cyan-100/90 text-cyan-950 border-cyan-300 dark:bg-cyan-950/80 dark:text-cyan-200 dark:border-cyan-700/60",
        iconBoxBg: "bg-cyan-100 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-700/70 text-cyan-800 dark:text-cyan-300",
        pillDot: "bg-cyan-500",
        schematicStroke: "stroke-cyan-600/20 dark:stroke-cyan-400/20",
        schematicFill: "fill-cyan-600/15 dark:fill-cyan-400/15",
      },
      // 4: Coral Rose (Playful, vibrant)
      {
        accent: "#f43f5e",
        accentDark: "#e11d48",
        cardBg: "bg-gradient-to-br from-[#fff7f8] via-[#ffe4e6] to-[#fecdd3] dark:from-[#1c1014] dark:via-[#24141a] dark:to-[#140b0f]",
        borderColor: "border-rose-400/80 dark:border-rose-500/50",
        shadowColor: "#e11d48",
        tagBg: "bg-rose-100/90 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700/60",
        iconBoxBg: "bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-700/70 text-rose-800 dark:text-rose-300",
        pillDot: "bg-rose-500",
        schematicStroke: "stroke-rose-600/20 dark:stroke-rose-400/20",
        schematicFill: "fill-rose-600/15 dark:fill-rose-400/15",
      },
    ]

    return PALETTES[palette]
  }

  // Helper icon based on category
  const getCategoryIcon = (cat: string) => {
    const c = (cat || "").toLowerCase()
    if (c.includes("machine learning") || c.includes("ai")) return <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
    if (c.includes("data") || c.includes("analytics")) return <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
    if (c.includes("web") || c.includes("tool")) return <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
    if (c.includes("python") || c.includes("basic") || c.includes("calc")) return <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
    return <Code2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
  }

  if (!projectsLength || !activeProject) {
    return (
      <div className="sketch-box p-12 text-center font-mono text-sm">
        No projects found in this selection.
      </div>
    )
  }

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* 3D Showcase Stage Bento Container — Liquid Glass Surface */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-[28px] sm:rounded-[32px] liquid-bento-card relative overflow-hidden">

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: 3D Perspective Card Deck (Perspective 1000px)
          ========================================================================= */}
          <div className="lg:col-span-6 w-full flex flex-col items-center justify-center">
            <div
              className="relative w-full h-[265px] sm:h-[295px] md:h-[325px] flex items-center justify-center select-none touch-pan-y"
              style={{ perspective: "1000px" }}
              ref={imageContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {projects.map((proj, idx) => {
                const isActive = idx === activeIndex
                const style = getCard3DStyle(idx)
                const theme = getProjectTheme(proj.category, idx)

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      if (!isActive) goTo(idx)
                    }}
                    style={{
                      ...style,
                      boxShadow: isActive
                        ? "0 14px 28px -10px rgba(0,0,0,0.22), 3px 4px 0 #000"
                        : "0 6px 16px -6px rgba(0,0,0,0.12), 2px 2px 0 #000",
                    }}
                    className={`absolute inset-0 w-full h-full rounded-[28px] p-1 transition-all duration-300 overflow-hidden flex flex-col justify-between select-none ${
                      isActive
                        ? "border-2 border-black dark:border-white shadow-xl"
                        : "border-2 border-stone-800/40 dark:border-stone-700/60"
                    }`}
                    title={isActive ? proj.title : `Click to view ${proj.title}`}
                  >
                    {/* Visual Card Canvas with Dynamic 5-Palette Clean Craft Theme */}
                    <div
                      className={`relative w-full h-full rounded-[24px] p-3.5 sm:p-4 ${theme.cardBg} border ${theme.borderColor} flex flex-col justify-between overflow-hidden shadow-xs`}
                    >
                      {/* Subtle Paper Grain Texture Overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]"
                        aria-hidden="true"
                      />

                      {/* Schematic Diagram Background watermark */}
                      <svg
                        className="absolute right-0 bottom-2 w-44 h-24 opacity-30 pointer-events-none"
                        viewBox="0 0 160 80"
                        fill="none"
                      >
                        <path
                          d="M10,65 L35,50 L65,58 L95,30 L125,45 L155,18"
                          className={theme.schematicStroke}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10,40 H40 V60 H85 V25 H150"
                          className={theme.schematicStroke}
                          strokeWidth="1.2"
                          strokeDasharray="4 3"
                        />
                        <circle cx="95" cy="30" r="3.5" className={theme.schematicFill} />
                        <circle cx="155" cy="18" r="4" className={theme.schematicFill} />
                        <rect x="61" y="54" width="7" height="7" rx="1.5" className={theme.schematicFill} />
                      </svg>

                      {/* Card Header Bar: Project Sequence Badge + Category Pill */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        {/* Project Tag */}
                        <div className="flex items-center gap-1.5 bg-black/85 dark:bg-white/90 px-2.5 py-1 rounded-full border border-black/20 shadow-xs">
                          <span className={`w-2 h-2 rounded-full ${theme.pillDot} animate-pulse`} />
                          <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-white dark:text-black">
                            PROJ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                        </div>

                        {/* Category Pill */}
                        <div
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border shadow-xs ${theme.tagBg}`}
                        >
                          <span className="scale-95">{getCategoryIcon(proj.category)}</span>
                          <span>{proj.category}</span>
                        </div>
                      </div>

                      {/* Card Center Visual: Icon Badge + Prominent Title + Tagline (NO DUPLICATE CATEGORY) */}
                      <div className="relative z-10 my-auto py-1 sm:py-2 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-xs ${theme.iconBoxBg}`}
                          >
                            {getCategoryIcon(proj.category)}
                          </div>
                          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            ENGINEERING BUILD
                          </span>
                        </div>

                        {/* Title with Amanojaku font */}
                        <h4 className="text-base sm:text-lg lg:text-xl font-hero-heading uppercase tracking-wide text-stone-950 dark:text-stone-50 line-clamp-2 leading-tight">
                          {proj.title}
                        </h4>

                        {/* Tagline with Drawing Kids font */}
                        <p className="text-[12px] sm:text-[13px] font-drawing-kids text-stone-700 dark:text-stone-300 line-clamp-2 leading-snug font-medium">
                          {proj.tagline}
                        </p>
                      </div>

                      {/* Card Footer: Tech Chips + Quick Code Action */}
                      <div className="relative z-10 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 overflow-hidden">
                          {proj.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-white/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-200 border border-stone-300/80 dark:border-stone-700/80 shadow-xs flex items-center gap-1"
                            >
                              <span style={{ color: theme.accentDark }}>✦</span> {tech}
                            </span>
                          ))}
                          {proj.technologies.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-stone-600 dark:text-stone-400 font-bold bg-stone-100/90 dark:bg-stone-800/90 border border-stone-300/60 dark:border-stone-700/60">
                              +{proj.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Front Card Micro-Action for quick GitHub peek */}
                        {isActive && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider bg-black text-white hover:bg-stone-800 dark:bg-white dark:text-black dark:hover:bg-stone-200 border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] flex items-center gap-1 transition-all hover:scale-105 cursor-pointer shrink-0"
                            title="View Code on GitHub"
                          >
                            <span>CODE</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Stepper Dots Indicator */}
            {projectsLength > 1 && (
              <div className="flex items-center gap-1.5 mt-3 pt-1">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Jump to project ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeIndex
                        ? "w-6 bg-black dark:bg-white"
                        : "w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Animated Project Dossier & Controls (Framer Motion)
          ========================================================================= */}
          <div className="lg:col-span-6 w-full flex flex-col justify-between space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeInOut" }}
                className="space-y-3.5"
              >
                {/* Header Meta Stamp & Category Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b-2 border-black/15 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="sketch-stamp text-[10px] bg-black text-white dark:bg-white dark:text-black font-black">
                      FEATURED BUILD 0{activeIndex + 1} / 0{projectsLength}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400">
                      [{activeProject.id}]
                    </span>
                  </div>

                  <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black dark:border-white bg-amber-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fff]">
                    {activeProject.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-hero-heading uppercase text-black dark:text-white tracking-wide leading-snug">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-drawing-kids font-bold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeProject.tagline}</span>
                  </p>
                </div>

                {/* Project Description */}
                <p className="text-stone-800 dark:text-stone-200 text-xs sm:text-[13px] leading-relaxed line-clamp-3 font-normal">
                  {activeProject.description}
                </p>

                {/* Highlights Checklist */}
                {activeProject.features && activeProject.features.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                      ENGINEERING HIGHLIGHTS:
                    </span>
                    <ul className="space-y-0.5 text-xs text-stone-800 dark:text-stone-200 font-medium">
                      {activeProject.features.slice(0, 3).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="leading-tight text-[11.5px]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Observations & Metrics Box */}
                {activeProject.metrics && activeProject.metrics.length > 0 && (
                  <div className="p-2.5 rounded-lg border-2 border-black/20 dark:border-stone-700 bg-white dark:bg-stone-900/80 shadow-[2px_2px_0_rgba(0,0,0,0.1)] space-y-1">
                    <div className="flex items-center justify-between font-mono text-[9px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">
                      <span>KEY BENCHMARKS</span>
                      <span className="text-xs">📊</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                      {activeProject.metrics.map((m, i) => (
                        <span
                          key={i}
                          className="font-bold text-black dark:text-white flex items-center gap-1 bg-amber-50 dark:bg-stone-800 px-2 py-0.5 rounded border border-amber-300 dark:border-stone-600"
                        >
                          <span className="text-amber-600 dark:text-amber-400 text-[10px]">✦</span>
                          <span>{m}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                    TECH STACK &amp; TOOLS:
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono text-xs">
                    {activeProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="border border-black dark:border-white bg-white dark:bg-stone-800 text-black dark:text-white px-2 py-0.5 rounded-full font-bold shadow-[1px_1px_0_#000] dark:shadow-[1px_1px_0_#fff] text-[10px]"
                      >
                        ✦ {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: GitHub Repo & Live Demo */}
                <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-black uppercase tracking-wider py-2.5 px-5 rounded-xl bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[3px_3px_0_#f59e0b] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 flex-1"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  {activeProject.liveUrl && (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono font-black uppercase tracking-wider py-2.5 px-5 rounded-xl bg-white text-black dark:bg-stone-900 dark:text-white border-2 border-black dark:border-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 flex-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stepper Navigation Bar matching the Circular style */}
            <div className="pt-4 border-t-2 border-dashed border-black/20 dark:border-stone-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-stone-600 dark:text-stone-400">
                  Browse Projects:
                </span>
                <span className="font-mono text-xs font-black text-black dark:text-white px-2.5 py-0.5 rounded-md border border-black dark:border-white bg-white dark:bg-stone-800">
                  {activeIndex + 1 < 10 ? `0${activeIndex + 1}` : activeIndex + 1} / {projectsLength < 10 ? `0${projectsLength}` : projectsLength}
                </span>
              </div>

              {/* Prev / Next Circular Buttons */}
              <div className="flex items-center gap-3">
                {/* Autoplay Toggle */}
                {projectsLength > 1 && (
                  <button
                    type="button"
                    onClick={() => setIsAutoPlaying((prev) => !prev)}
                    className="p-2 rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-xs"
                    title={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
                    aria-label={isAutoPlaying ? "Pause Autoplay" : "Resume Autoplay"}
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border-2 border-black dark:border-white bg-white dark:bg-stone-900 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] active:translate-y-[1px] transition-all flex items-center justify-center cursor-pointer group"
                  aria-label="Previous project"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border-2 border-black dark:border-white bg-white dark:bg-stone-900 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] active:translate-y-[1px] transition-all flex items-center justify-center cursor-pointer group"
                  aria-label="Next project"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
