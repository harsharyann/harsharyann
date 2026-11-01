"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { portfolioData } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import { formatGoogleDriveImageUrl, isGoogleDriveUrl } from "@/lib/googleDrive"
import {
  Brain,
  Code2,
  FolderGit2,
  Compass,
  Sparkles,
  GraduationCap,
  MapPin,
  Laptop,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react"

/**
 * Handcrafted Bespoke Doodle #1 — The Thinker's Spark
 */
function ThinkerLightbulbDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 120"
        className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] filter"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Glow rays */}
        <path d="M 50 8 L 50 18" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 22 20 L 30 28" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 78 20 L 70 28" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 12 52 L 22 52" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 88 52 L 78 52" stroke="#f59e0b" strokeWidth="2.8" />

        {/* Bulb body with warm yellow fill */}
        <path
          d="M 32 76 C 22 68 18 55 20 42 C 24 24 38 18 50 18 C 62 18 76 24 80 42 C 82 55 78 68 68 76 L 68 88 L 32 88 Z"
          fill="#fef08a"
          stroke="#000000"
          className="dark:stroke-white dark:fill-amber-300/30"
          strokeWidth="2.6"
        />

        {/* Playful cartoon eyes looking right */}
        <circle cx="44" cy="46" r="3.5" fill="#000000" className="dark:fill-white" stroke="none" />
        <circle cx="58" cy="46" r="3.5" fill="#000000" className="dark:fill-white" stroke="none" />
        <circle cx="45.5" cy="44.5" r="1.2" fill="#ffffff" stroke="none" />
        <circle cx="59.5" cy="44.5" r="1.2" fill="#ffffff" stroke="none" />

        {/* Happy little mouth */}
        <path d="M 48 54 Q 51 58 54 54" stroke="#000000" className="dark:stroke-white" strokeWidth="2" fill="none" />

        {/* Filament squiggle */}
        <path
          d="M 40 34 Q 45 28 50 34 Q 55 28 60 34"
          stroke="#f59e0b"
          strokeWidth="2.2"
          fill="none"
        />

        {/* Screw base & contact point */}
        <path d="M 36 94 L 64 94" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
        <path d="M 39 100 L 61 100" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
        <path d="M 44 106 L 56 106" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
      </svg>

      {/* Handwritten speech bubble */}
      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-amber-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-xs font-bold rotate-[-2deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-amber-950 dark:text-amber-200 text-sm">
          curiosity &gt; complexity 💡
        </span>
      </div>
    </div>
  )
}

/**
 * Handcrafted Bespoke Doodle #2 — The Trajectory Arrow
 */
function TrajectoryArrowDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 160 60"
        className="w-28 sm:w-36 h-12 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Playful swooping loop arrow */}
        <path
          d="M 8 28 C 35 12, 55 48, 75 32 C 90 20, 95 10, 115 24 C 128 32, 138 36, 150 30"
          stroke="#8b5cf6"
          strokeWidth="2.6"
          className="dark:stroke-purple-400"
          strokeDasharray="4 4"
        />
        {/* Arrow head */}
        <path
          d="M 140 22 L 152 30 L 142 38"
          stroke="#8b5cf6"
          strokeWidth="2.8"
          className="dark:stroke-purple-400"
          fill="none"
        />
        {/* Tiny hand-drawn stars around it */}
        <path d="M 38 12 L 40 18 L 46 20 L 40 22 L 38 28 L 36 22 L 30 20 L 36 18 Z" fill="#f59e0b" stroke="none" />
        <path d="M 102 44 L 103 48 L 107 49 L 103 50 L 102 54 L 101 50 L 97 49 L 101 48 Z" fill="#10b981" stroke="none" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 rotate-[-2deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        step by step ✍️
      </span>
    </div>
  )
}

/**
 * Handcrafted Bespoke Doodle #3 — The Paper Plane Flight
 */
function PaperPlaneFlightDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 140 50"
        className="w-28 sm:w-36 h-12 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Looping flight dashed trail */}
        <path
          d="M 6 38 Q 28 46 44 32 Q 58 18 48 10 Q 38 4 36 22 Q 38 38 68 30 Q 88 24 104 22"
          stroke="#06b6d4"
          strokeWidth="2.2"
          strokeDasharray="3 3.5"
          className="dark:stroke-cyan-400"
        />
        {/* Paper airplane body */}
        <g transform="translate(104, 8) rotate(-14)">
          <polygon
            points="0,14 26,0 12,18 0,14"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.2"
            className="dark:fill-stone-900 dark:stroke-white"
          />
          <polygon
            points="12,18 26,0 20,20 12,18"
            fill="#e0f2fe"
            stroke="#000000"
            strokeWidth="2.2"
            className="dark:fill-cyan-900/60 dark:stroke-white"
          />
          <polygon
            points="12,18 16,22 17,19"
            fill="#38bdf8"
            stroke="#000000"
            strokeWidth="1.8"
            className="dark:stroke-white"
          />
        </g>
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 rotate-[1.5deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        ready for launch ✈️
      </span>
    </div>
  )
}

export function AboutSection({ id = "about" }: { id?: string }) {
  const { data: portfolio } = usePortfolio()
  const { personal, skills, projects, quickStats } = portfolio
  const featuredProjects = projects.slice(0, 3)

  // Color-coded milestone phases
  const timelineMilestones = [
    {
      period: "Foundations",
      phaseNumber: "01",
      title: "Algorithmic Intuition & Logic",
      subtitle: "Python, C & Core Problem Solving",
      description:
        "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems.",
      theme: {
        badgeBg: "bg-amber-400 text-black dark:bg-amber-400 dark:text-black",
        shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
        border: "border-amber-300 dark:border-amber-500/60",
        accentText: "text-amber-700 dark:text-amber-300",
        bgLight: "bg-amber-50/60 dark:bg-stone-900/80",
      },
    },
    {
      period: "Data & Math",
      phaseNumber: "02",
      title: "Exploratory Modeling & Linear Algebra",
      subtitle: "Vectorized Computations & Analytics",
      description:
        "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks.",
      theme: {
        badgeBg: "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white",
        shadow: "shadow-[4px_4px_0_#10b981] dark:shadow-[4px_4px_0_#34d399]",
        border: "border-emerald-300 dark:border-emerald-500/60",
        accentText: "text-emerald-700 dark:text-emerald-300",
        bgLight: "bg-emerald-50/60 dark:bg-stone-900/80",
      },
    },
    {
      period: "Frontiers",
      phaseNumber: "03",
      title: "Modern AI Systems & Interactive Tools",
      subtitle: "Full-Stack AI Prototypes & Deployment",
      description:
        "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows.",
      theme: {
        badgeBg: "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white",
        shadow: "shadow-[4px_4px_0_#6366f1] dark:shadow-[4px_4px_0_#818cf8]",
        border: "border-indigo-300 dark:border-indigo-500/60",
        accentText: "text-indigo-700 dark:text-indigo-300",
        bgLight: "bg-indigo-50/60 dark:bg-stone-900/80",
      },
    },
  ]

  const scrollTo = (targetId: string) => {
    const el = document.getElementById(targetId)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12 sm:space-y-16 scroll-mt-14">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-amber-400 text-black font-black shadow-[2px_2px_0_#000]">
              CHAPTER 02 • THE ARCHITECT &amp; MIND
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-400 text-amber-800 dark:text-amber-300 font-bold">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Machine Learning &amp; AI
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              100% Code Integrity
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
              Behind the Terminal
            </h2>
            <svg className="w-48 sm:w-64 h-3 text-amber-500 overflow-visible" viewBox="0 0 240 10" fill="none" aria-hidden="true">
              <path d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 leading-relaxed">
              Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed.
            </p>
          </div>

          <div className="self-start lg:self-end">
            <ThinkerLightbulbDoodle />
          </div>
        </div>
      </div>

      {/* ── PROFILE & BIO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-4">
          <div className="relative group mx-auto sm:mx-0">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-400 via-purple-500 to-indigo-600 rounded-3xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-64 h-80 sm:w-72 sm:h-88 rounded-2xl border-3 border-black dark:border-white bg-white dark:bg-stone-900 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] overflow-hidden flex items-center justify-center">
              <Image
                src={formatGoogleDriveImageUrl(personal.aboutPhotoUrl) || "/harsh-cover.jpg"}
                alt={personal.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 256px, 288px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 select-none"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 px-3 py-1 bg-amber-300 text-black border-2 border-black rounded-full font-mono text-xs font-black shadow-[2px_2px_0_#000] rotate-[3deg] select-none">
              ✦ {personal.role}
            </div>
          </div>

          <div className="w-full pt-4 flex flex-wrap gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/20 dark:border-white/20 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>{personal.location}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-black/20 dark:border-white/20 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>{personal.degree}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4 text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            <p className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              [PERSONAL STATEMENT]
            </p>
            <p className="font-semibold text-lg text-black dark:text-white">
              {personal.headline}
            </p>
            <p>{personal.bio}</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {quickStats?.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border-2 border-black dark:border-white/20 bg-white dark:bg-stone-900 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] space-y-0.5"
              >
                <div className="text-xl sm:text-2xl font-black text-black dark:text-white font-mono">
                  {st.value}
                </div>
                <div className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tight">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TECHNICAL ARSENAL ── */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/15 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="sketch-stamp bg-indigo-600 text-white font-black">
              CORE CAPABILITIES
            </span>
            <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [STACK OVERVIEW]
            </span>
          </div>
          <PaperPlaneFlightDoodle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills?.map((group, idx) => {
            const themes = [
              {
                bg: "bg-amber-50/50 dark:bg-stone-900",
                shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
                text: "text-amber-900 dark:text-amber-300",
                icon: <Code2 className="w-4 h-4 text-amber-600" />,
              },
              {
                bg: "bg-purple-50/50 dark:bg-stone-900",
                shadow: "shadow-[4px_4px_0_#8b5cf6] dark:shadow-[4px_4px_0_#a855f7]",
                text: "text-purple-900 dark:text-purple-300",
                icon: <Brain className="w-4 h-4 text-purple-600" />,
              },
              {
                bg: "bg-cyan-50/50 dark:bg-stone-900",
                shadow: "shadow-[4px_4px_0_#06b6d4] dark:shadow-[4px_4px_0_#38bdf8]",
                text: "text-cyan-900 dark:text-cyan-300",
                icon: <Laptop className="w-4 h-4 text-cyan-600" />,
              },
            ];
            const t = themes[idx % themes.length];
            return (
              <div
                key={group.category}
                className={`p-5 rounded-2xl border-2 border-black dark:border-white/20 ${t.bg} ${t.shadow} space-y-3`}
              >
                <div className={`flex items-center gap-2 font-mono text-xs font-black uppercase ${t.text}`}>
                  {t.icon}
                  <span>{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  {group.items?.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-full border border-black/20 dark:border-white/20 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold shadow-xs"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TRAJECTORY MILESTONES ── */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/15 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="sketch-stamp bg-emerald-600 text-white font-black">
              DEVELOPMENT TRAJECTORY
            </span>
            <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [ROADMAP]
            </span>
          </div>
          <TrajectoryArrowDoodle />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timelineMilestones.map((m) => (
            <div
              key={m.phaseNumber}
              className={`p-5 rounded-2xl border-2 ${m.theme.border} ${m.theme.bgLight} ${m.theme.shadow} space-y-3 flex flex-col justify-between`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${m.theme.badgeBg}`}>
                    PHASE {m.phaseNumber}
                  </span>
                  <span className={`font-mono text-xs font-bold ${m.theme.accentText}`}>
                    {m.period}
                  </span>
                </div>
                <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                  {m.title}
                </h3>
                <p className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400">
                  {m.subtitle}
                </p>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CALL TO ACTION BANNER ── */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-black dark:border-white/20 bg-gradient-to-r from-amber-100 via-rose-50 to-indigo-50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-900 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
            Want to build something groundbreaking together?
          </h3>
          <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 max-w-xl">
            Always open to discussing machine learning research, hackathon teams, and summer internship opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Desk</span>
          </button>
          <button
            type="button"
            onClick={() => scrollTo("projects")}
            className="px-5 py-2.5 rounded-full bg-white text-black dark:bg-stone-900 dark:text-white font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#06b6d4] hover:-translate-y-0.5 transition-transform flex items-center gap-2 cursor-pointer"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </button>
        </div>
      </div>
    </section>
  )
}
