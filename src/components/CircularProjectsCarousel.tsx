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

  const projectsLength = projects.length

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
    if (projectsLength <= 1) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4, 2, .3, 1)",
      }
    }

    const gap = calculateGap(containerWidth)
    const maxStickUp = gap * 0.75
    const isActive = index === activeIndex
    const isLeft = (activeIndex - 1 + projectsLength) % projectsLength === index
    const isRight = (activeIndex + 1) % projectsLength === index

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4, 2, .3, 1)",
      }
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(16deg)`,
        transition: "all 0.8s cubic-bezier(.4, 2, .3, 1)",
        cursor: "pointer",
      }
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.85,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-16deg)`,
        transition: "all 0.8s cubic-bezier(.4, 2, .3, 1)",
        cursor: "pointer",
      }
    }

    // Hidden cards
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transform: "translateX(0px) translateY(0px) scale(0.7) rotateY(0deg)",
      transition: "all 0.8s cubic-bezier(.4, 2, .3, 1)",
    }
  }

  // Helper icon based on category
  const getCategoryIcon = (cat: string) => {
    const c = (cat || "").toLowerCase()
    if (c.includes("machine learning") || c.includes("ai")) return <Cpu className="w-5 h-5 text-purple-400" />
    if (c.includes("data") || c.includes("analytics")) return <BarChart3 className="w-5 h-5 text-emerald-400" />
    if (c.includes("web") || c.includes("tool")) return <Terminal className="w-5 h-5 text-sky-400" />
    return <Code2 className="w-5 h-5 text-amber-400" />
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
      {/* 3D Showcase Stage Container with Neo-Brutalist Frame — Compact & Proportional */}
      <div className="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border-2 border-black dark:border-stone-700 bg-gradient-to-br from-[#f8f6f0] via-white to-[#f5f2ea] dark:from-[#0d0e12] dark:via-[#13141a] dark:to-[#0a0a0d] shadow-[6px_8px_0_#18181b] dark:shadow-[6px_8px_0_#27272a] relative overflow-hidden">
        
        {/* Subtle Background Studio Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
          style={{
            backgroundImage: "radial-gradient(#18181b 0.75px, transparent 0.75px)",
            backgroundSize: "20px 20px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: 3D Perspective Card Deck (Perspective 1000px)
          ========================================================================= */}
          <div className="lg:col-span-6 w-full flex flex-col items-center justify-center">
            <div
              className="relative w-full h-[250px] sm:h-[285px] md:h-[315px] flex items-center justify-center select-none"
              style={{ perspective: "1000px" }}
              ref={imageContainerRef}
            >
              {projects.map((proj, idx) => {
                const isActive = idx === activeIndex
                const style = getCard3DStyle(idx)

                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      if (!isActive) goTo(idx)
                    }}
                    style={style}
                    className="absolute inset-0 w-full h-full rounded-2xl p-1 bg-stone-900 border-2 border-black dark:border-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.38),3px_5px_0_#000] overflow-hidden flex flex-col justify-between select-none"
                    title={isActive ? proj.title : `Click to view ${proj.title}`}
                  >
                    {/* Visual Card Canvas with Dynamic Gradient */}
                    <div
                      className={`relative w-full h-full rounded-xl p-3.5 sm:p-4 bg-gradient-to-br ${proj.imageGradient} flex flex-col justify-between overflow-hidden text-white`}
                    >
                      {/* Blueprint dot pattern overlay */}
                      <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          backgroundImage: "radial-gradient(#ffffff 0.75px, transparent 0.75px)",
                          backgroundSize: "12px 12px",
                        }}
                      />

                      {/* Card Header Bar */}
                      <div className="relative z-10 flex items-center justify-between gap-2">
                        {/* Terminal 3 Dots */}
                        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/90 ml-0.5">
                            PROJ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </span>
                        </div>

                        {/* Category Badge */}
                        <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono font-black uppercase tracking-wider border border-white/20 text-white flex items-center gap-1">
                          {getCategoryIcon(proj.category)}
                          <span>{proj.category}</span>
                        </div>
                      </div>

                      {/* Card Center Visual: Title & Neural Schematic */}
                      <div className="relative z-10 my-auto py-2 space-y-1.5">
                        <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
                          {getCategoryIcon(proj.category)}
                        </div>
                        <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-white drop-shadow-md line-clamp-2">
                          {proj.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs font-mono text-white/85 line-clamp-2 leading-snug drop-shadow-sm">
                          {proj.tagline}
                        </p>
                      </div>

                      {/* Card Footer: Tech Chips */}
                      <div className="relative z-10 pt-1.5 border-t border-white/20 flex flex-wrap items-center gap-1">
                        {proj.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-md text-[9px] font-mono font-bold text-white/90 border border-white/15"
                          >
                            ✦ {tech}
                          </span>
                        ))}
                        {proj.technologies.length > 3 && (
                          <span className="text-[9px] font-mono text-white/70 font-bold">
                            +{proj.technologies.length - 3}
                          </span>
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
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white tracking-tight leading-snug">
                    {activeProject.title}
                  </h3>
                  <p className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeProject.tagline}</span>
                  </p>
                </div>

                {/* Animated Word-by-Word Description */}
                <p className="text-stone-800 dark:text-stone-200 text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                  {activeProject.description.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ filter: "blur(6px)", opacity: 0, y: 3 }}
                      animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.18,
                        ease: "easeInOut",
                        delay: 0.012 * i,
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
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
