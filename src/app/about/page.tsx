"use client";

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
 * Handcrafted Bespoke Doodle #1 — The Thinker's Spark (Lightbulb with cartoon eyes & thought bubble)
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
 * Handcrafted Bespoke Doodle #2 — The Trajectory Arrow (Loop-de-loop guidance arrow)
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
 * Handcrafted Bespoke Doodle #3 — The Paper Plane Flight (Flight loop soaring to launch)
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

export default function AboutPage() {
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
        "Deep-diving into NumPy, Pandas, multivariate statistics, and exploring datasets to extract actionable signals and predictive patterns.",
      theme: {
        badgeBg: "bg-cyan-600 text-white dark:bg-cyan-500 dark:text-white",
        shadow: "shadow-[4px_4px_0_#06b6d4] dark:shadow-[4px_4px_0_#22d3ee]",
        border: "border-cyan-300 dark:border-cyan-500/60",
        accentText: "text-cyan-700 dark:text-cyan-300",
        bgLight: "bg-cyan-50/60 dark:bg-stone-900/80",
      },
    },
    {
      period: "Machine Learning",
      phaseNumber: "03",
      title: "Deep Learning & Neural Architectures",
      subtitle: "PyTorch, Computer Vision & CNNs",
      description:
        "Building and fine-tuning neural networks from first principles. Implementing CNNs, transfer learning pipelines, and rigorous model evaluation.",
      theme: {
        badgeBg: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
        shadow: "shadow-[4px_4px_0_#8b5cf6] dark:shadow-[4px_4px_0_#a855f7]",
        border: "border-purple-300 dark:border-purple-500/60",
        accentText: "text-purple-700 dark:text-purple-300",
        bgLight: "bg-purple-50/60 dark:bg-stone-900/80",
      },
    },
    {
      period: "Systems & Vision",
      phaseNumber: "04",
      title: "Intelligent Systems & Open Source",
      subtitle: "Full-Stack AI Tooling & Deployment",
      description:
        "Deploying interactive models, developing high-performance web tooling, and contributing to open-source developer infrastructure.",
      theme: {
        badgeBg: "bg-rose-500 text-white dark:bg-rose-500 dark:text-white",
        shadow: "shadow-[4px_4px_0_#f43f5e] dark:shadow-[4px_4px_0_#fb7185]",
        border: "border-rose-300 dark:border-rose-500/60",
        accentText: "text-rose-700 dark:text-rose-300",
        bgLight: "bg-rose-50/60 dark:bg-stone-900/80",
      },
    },
  ]

  // Color-coded laboratory racks
  const labThemes = [
    {
      borderTop: "border-t-amber-500",
      badge: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-700",
      star: "text-amber-500 dark:text-amber-400",
      shadow: "shadow-[3.5px_3.5px_0_#f59e0b]",
    },
    {
      borderTop: "border-t-emerald-500",
      badge: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-700",
      star: "text-emerald-500 dark:text-emerald-400",
      shadow: "shadow-[3.5px_3.5px_0_#10b981]",
    },
    {
      borderTop: "border-t-purple-500",
      badge: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/40 dark:text-purple-200 dark:border-purple-700",
      star: "text-purple-500 dark:text-purple-400",
      shadow: "shadow-[3.5px_3.5px_0_#8b5cf6]",
    },
    {
      borderTop: "border-t-cyan-500",
      badge: "bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-200 dark:border-cyan-700",
      star: "text-cyan-500 dark:text-cyan-400",
      shadow: "shadow-[3.5px_3.5px_0_#06b6d4]",
    },
    {
      borderTop: "border-t-indigo-500",
      badge: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-700",
      star: "text-indigo-500 dark:text-indigo-400",
      shadow: "shadow-[3.5px_3.5px_0_#6366f1]",
    },
  ]

  // Color-coded project cards
  const projectBadges: Record<string, { bg: string; text: string; shadow: string; border: string }> = {
    "Data Analysis": {
      bg: "bg-emerald-100 dark:bg-emerald-950/60",
      text: "text-emerald-800 dark:text-emerald-300",
      shadow: "shadow-[3.5px_3.5px_0_#10b981]",
      border: "border-emerald-500",
    },
    "Machine Learning": {
      bg: "bg-purple-100 dark:bg-purple-950/60",
      text: "text-purple-800 dark:text-purple-300",
      shadow: "shadow-[3.5px_3.5px_0_#8b5cf6]",
      border: "border-purple-500",
    },
    "Web & AI Tools": {
      bg: "bg-cyan-100 dark:bg-cyan-950/60",
      text: "text-cyan-800 dark:text-cyan-300",
      shadow: "shadow-[3.5px_3.5px_0_#06b6d4]",
      border: "border-cyan-500",
    },
  }

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-16">
      {/* =========================================================================
          CHAPTER HEADER with Thematic Badges & Wavy Squiggle
      ========================================================================= */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-amber-400 text-black font-black shadow-[2px_2px_0_#000]">
              CHAPTER 02 • ABOUT &amp; CRAFT
            </span>
            <span className="hidden sm:inline-block font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [SKETCHBOOK DOSSIER]
            </span>
          </div>

          {/* Quick Info Tags */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-400 text-purple-800 dark:text-purple-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Teaching Assistant • IIT Madras
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-400 text-indigo-800 dark:text-indigo-300 font-bold">
              <MapPin className="w-3 h-3 text-indigo-500" />
              Chennai, India
            </span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
            About Harsh Aryan
          </h1>

          {/* Hand-drawn comic squiggle underline */}
          <svg
            className="w-48 sm:w-64 h-3 mt-1.5 text-amber-500 overflow-visible"
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

          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
            Crafting at the intersection of <strong className="text-purple-600 dark:text-purple-400 font-black">Code</strong>, <strong className="text-emerald-600 dark:text-emerald-400 font-black">Mathematics</strong> &amp; <strong className="text-cyan-600 dark:text-cyan-400 font-black">Intelligent Neural Models</strong>.
          </p>
        </div>
      </div>

      {/* =========================================================================
          MAIN STORY & POLAROID PHOTO SECTION
          (Includes Doodle #1: The Thinker's Spark Lightbulb)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative Story & Notebook Quote */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600 dark:bg-purple-400 shadow-[0_0_8px_#a855f7]" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              The Philosophy: Depth Over Hype
            </h2>
          </div>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            I am <strong className="text-purple-700 dark:text-purple-300 font-black">{personal.name}</strong>, a developer passionate about Artificial Intelligence, Data Science, and Scientific Computing. My fascination began when I wrote my first Python script to automate a repetitive task; seeing lines of logic produce tangible results sparked an obsession that has guided my work ever since.
          </p>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            While modern AI moves at breakneck speed, I believe real engineering requires solid anchors. Rather than jumping straight to high-level wrappers, I spend my time understanding the foundational mathematics—<span className="font-bold underline decoration-amber-400 decoration-2">Linear Algebra</span>, <span className="font-bold underline decoration-emerald-400 decoration-2">Multivariate Calculus</span>, and <span className="font-bold underline decoration-cyan-400 decoration-2">Probability</span>—implementing algorithms from scratch before relying on abstractions.
          </p>

          {/* Handcrafted Notebook Quote Card with DOODLE #1 */}
          <div className="relative p-6 border-2 border-black dark:border-purple-400/80 rounded-lg bg-gradient-to-br from-amber-50/80 via-purple-50/40 to-white dark:from-stone-900 dark:via-purple-950/20 dark:to-stone-900 shadow-[5px_5px_0_#8b5cf6] dark:shadow-[5px_5px_0_#a855f7] my-6 transition-transform hover:-translate-y-0.5">
            {/* Washi tape sticker */}
            <div
              className="absolute -top-3 left-8 w-24 h-5 bg-amber-200/90 dark:bg-amber-500/30 border border-black/30 dark:border-white/30 rotate-[-1.5deg] rounded-sm pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="font-mono text-[10.5px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>NOTEBOOK ENTRY #01 • PERSPECTIVE</span>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-stone-900 dark:text-stone-100 font-semibold leading-relaxed">
                  &ldquo;Master the underlying mathematics, build real-world open source systems, and engineering excellence will naturally follow.&rdquo;
                </p>
                <span className="block text-right font-mono text-xs font-bold text-stone-600 dark:text-stone-400">
                  — Harsh Aryan
                </span>
              </div>

              {/* BESPOKE DOODLE #1 (1 of 3): The Thinker's Spark */}
              <div className="self-center sm:self-auto shrink-0 pt-2 sm:pt-0">
                <ThinkerLightbulbDoodle />
              </div>
            </div>
          </div>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            When I am not writing code or studying theory, you will find me participating in hackathons, analyzing Kaggle datasets, and experimenting with clean, tactile front-end designs.
          </p>

          {/* Quick Metrics Strip — 3 Core Engineering Highlights (1st Year card removed) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {quickStats
              .filter((st) => st.label !== "Academic Standing" && !st.value.includes("1st Year"))
              .map((st, i) => {
                const borderColors = [
                  "border-purple-400 shadow-[3.5px_3.5px_0_#8b5cf6]",
                  "border-emerald-400 shadow-[3.5px_3.5px_0_#10b981]",
                  "border-amber-400 shadow-[3.5px_3.5px_0_#f59e0b]",
                ]
                return (
                  <div
                    key={st.label}
                    className={`p-3.5 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded-lg ${borderColors[i % borderColors.length]} transition-transform hover:-translate-y-1`}
                  >
                    <div className="text-2xl sm:text-3xl font-black text-black dark:text-white">
                      {st.value}
                    </div>
                    <div className="text-[11px] font-mono font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mt-0.5">
                      {st.label}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                      {st.sublabel}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Right Column: Sketchbook Polaroid Photo Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="sketch-box p-3.5 sm:p-4 bg-white dark:bg-stone-900 relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 shadow-[6px_6px_0_#8b5cf6] dark:shadow-[6px_6px_0_#a855f7] w-full max-w-sm sm:max-w-md">
            {/* Double washi tape strips pinned at the top */}
            <div
              className="absolute -top-3 left-10 w-20 h-6 bg-amber-200/90 dark:bg-amber-400/30 border border-black/40 dark:border-white/40 rotate-[-2.5deg] shadow-sm z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -top-3 right-10 w-20 h-6 bg-emerald-200/90 dark:bg-emerald-400/30 border border-black/40 dark:border-white/40 rotate-[2deg] shadow-sm z-10 pointer-events-none"
              aria-hidden="true"
            />

            {/* Inner photo border */}
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black dark:border-white rounded bg-stone-100 dark:bg-stone-800 group/photo">
              <Image
                src={formatGoogleDriveImageUrl(personal.aboutPhotoUrl) || "/harsh-cover.jpg"}
                alt={`${personal.name} - ${personal.role}`}
                fill
                priority
                unoptimized={isGoogleDriveUrl(personal.aboutPhotoUrl) || (personal.aboutPhotoUrl?.startsWith("data:") ?? false)}
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Cool corner location badge instead of duplicate name */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/80 dark:bg-black/90 backdrop-blur-sm text-white text-[10px] font-mono px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>CHENNAI • 2026</span>
              </div>
            </div>

            {/* Polaroid caption: Name ONLY ONCE with current role & location directly below */}
            <div className="pt-3.5 pb-1 space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-black text-black dark:text-white uppercase tracking-wider text-base">
                  HARSH ARYAN
                </span>
                <span className="sketch-stamp text-[10px] bg-purple-600 text-white dark:bg-purple-500 dark:text-white">
                  VERIFIED
                </span>
              </div>

              {/* Current Role & Organization directly under name */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                <span className="text-purple-700 dark:text-purple-300 font-black uppercase">
                  Teaching Assistant
                </span>
                <span className="text-stone-400 font-bold">•</span>
                <span className="text-amber-700 dark:text-amber-400 font-black uppercase">
                  IIT Madras
                </span>
              </div>

              {/* Sub-label discipline pill */}
              <div className="pt-2 border-t border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-300">
                <span className="font-bold">AI &amp; Data Science Specialist</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Role
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CORE DISCIPLINES & SPECIALIZATIONS (3 Thematic Color-Coded Pillars)
          (Features Doodle #2: The Trajectory Arrow guiding into roadmap)
      ========================================================================= */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 border-2 border-black dark:border-purple-400 flex items-center justify-center text-purple-700 dark:text-purple-300 shadow-[2px_2px_0_#8b5cf6]">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                Core Disciplines &amp; Specializations
              </h2>
              <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
                Three focal pillars engineered with mathematical rigor and production craft.
              </p>
            </div>
          </div>

          {/* BESPOKE DOODLE #2 (2 of 3): The Trajectory Guidance Arrow */}
          <TrajectoryArrowDoodle className="hidden md:inline-flex" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 01: Machine Learning (Electric Violet Theme) */}
          <div className="p-6 rounded-lg border-2 border-black dark:border-purple-400 bg-violet-50/70 dark:bg-stone-900/90 shadow-[5px_5px_0_#8b5cf6] dark:shadow-[5px_5px_0_#a855f7] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-700 text-xs font-mono">
                <span className="sketch-stamp bg-purple-600 text-white dark:bg-purple-500 dark:text-white">
                  DISCIPLINE 01
                </span>
                <span className="font-black text-purple-700 dark:text-purple-300">INTELLIGENCE</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Machine Learning &amp; Neural Models
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Developing supervised classifiers, regression models, and deep neural architectures. Focused on end-to-end model evaluation, transfer learning with ResNet, and CNN-based computer vision.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-purple-300 dark:border-purple-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-800 dark:text-purple-300 block mb-2 font-black">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-purple-300 dark:border-purple-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 shadow-[1.5px_1.5px_0_#8b5cf6]">
                  ✦ PyTorch &amp; Scikit-Learn
                </span>
                <span className="border border-purple-300 dark:border-purple-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 shadow-[1.5px_1.5px_0_#8b5cf6]">
                  ✦ CNN Radiography Screening
                </span>
                <span className="border border-purple-300 dark:border-purple-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 shadow-[1.5px_1.5px_0_#8b5cf6]">
                  ✦ Model Evaluation &amp; Metrics
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 02: Data Science & Analytics (Emerald Mint Theme) */}
          <div className="p-6 rounded-lg border-2 border-black dark:border-emerald-400 bg-emerald-50/70 dark:bg-stone-900/90 shadow-[5px_5px_0_#10b981] dark:shadow-[5px_5px_0_#34d399] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-700 text-xs font-mono">
                <span className="sketch-stamp bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white">
                  DISCIPLINE 02
                </span>
                <span className="font-black text-emerald-700 dark:text-emerald-300">ANALYTICS</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Data Science &amp; Statistical Modeling
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Extracting actionable insights from high-dimensional datasets. Mastery of vectorized data manipulation, outlier detection, hypothesis validation, and rich statistical visualization.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-emerald-300 dark:border-emerald-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-2 font-black">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-emerald-300 dark:border-emerald-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-200 shadow-[1.5px_1.5px_0_#10b981]">
                  ✦ Pandas &amp; Vectorized NumPy
                </span>
                <span className="border border-emerald-300 dark:border-emerald-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-200 shadow-[1.5px_1.5px_0_#10b981]">
                  ✦ Correlation &amp; Feature EDA
                </span>
                <span className="border border-emerald-300 dark:border-emerald-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-200 shadow-[1.5px_1.5px_0_#10b981]">
                  ✦ Interactive Seaborn &amp; Plotly
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 03: Systems & Interactive Web Craft (Cyan / Sky Theme) */}
          <div className="p-6 rounded-lg border-2 border-black dark:border-sky-400 bg-sky-50/70 dark:bg-stone-900/90 shadow-[5px_5px_0_#0284c7] dark:shadow-[5px_5px_0_#38bdf8] flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-700 text-xs font-mono">
                <span className="sketch-stamp bg-sky-600 text-white dark:bg-sky-500 dark:text-white">
                  DISCIPLINE 03
                </span>
                <span className="font-black text-sky-700 dark:text-sky-300">SYSTEMS</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Interactive Systems &amp; Web Tooling
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Bridging machine learning models with accessible user interfaces. Designing high-craft web apps with Streamlit, React, Next.js, and TypeScript with zero-friction UX.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-sky-300 dark:border-sky-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-800 dark:text-sky-300 block mb-2 font-black">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-sky-300 dark:border-sky-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-200 shadow-[1.5px_1.5px_0_#0284c7]">
                  ✦ Next.js &amp; React Architecture
                </span>
                <span className="border border-sky-300 dark:border-sky-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-200 shadow-[1.5px_1.5px_0_#0284c7]">
                  ✦ Streamlit Dashboards
                </span>
                <span className="border border-sky-300 dark:border-sky-600 px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-200 shadow-[1.5px_1.5px_0_#0284c7]">
                  ✦ Neo-Brutalist Craft &amp; UX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE ROADMAP & PROGRESS (4 Thematic Sequential Milestone Phases)
      ========================================================================= */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border-2 border-black dark:border-emerald-400 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shadow-[2px_2px_0_#10b981]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
              The Roadmap &amp; Progress
            </h2>
            <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
              Sequential evolution from algorithmic foundations to high-order neural systems.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelineMilestones.map((m) => (
            <div
              key={m.period}
              className={`p-5 rounded-lg border-2 border-black dark:border-stone-700 ${m.theme.bgLight} ${m.theme.shadow} flex flex-col justify-between space-y-3 relative group hover:-translate-y-1 transition-transform`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-black dark:border-stone-700 font-mono text-xs font-bold">
                  <span className={`sketch-stamp ${m.theme.badgeBg}`}>
                    PHASE {m.phaseNumber}
                  </span>
                  <span className="text-stone-600 dark:text-stone-300 font-bold">{m.period}</span>
                </div>
                <h3 className="text-base font-black uppercase text-black dark:text-white mt-3 leading-snug">
                  {m.title}
                </h3>
                <p className={`text-xs font-mono font-bold ${m.theme.accentText} mt-1`}>
                  {m.subtitle}
                </p>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed mt-2.5">
                  {m.description}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1 font-mono text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>MILESTONE VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TECHNICAL SKILLSET MATRIX LABORATORY (Color-Coded Racks)
      ========================================================================= */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-950/50 border-2 border-black dark:border-cyan-400 flex items-center justify-center text-cyan-700 dark:text-cyan-300 shadow-[2px_2px_0_#06b6d4]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
              Technical Skillsets &amp; Tooling
            </h2>
            <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
              Verified proficiency across programming languages, mathematical frameworks &amp; web stacks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {skills.map((skillGroup, idx) => {
            const theme = labThemes[idx % labThemes.length]
            return (
              <div
                key={skillGroup.category}
                className={`p-4 rounded-lg bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-700 ${theme.borderTop} border-t-4 ${theme.shadow} flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-black dark:border-stone-800">
                    <span className="text-[10px] font-mono font-black text-stone-500 dark:text-stone-400 uppercase">
                      LAB 0{idx + 1}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${theme.badge}`}>
                      CORE
                    </span>
                  </div>
                  <h3 className="text-sm font-black uppercase text-black dark:text-white mt-2 pb-1 leading-snug">
                    {skillGroup.category}
                  </h3>
                  <ul className="mt-2.5 space-y-1.5 font-mono text-xs">
                    {skillGroup.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                        <span className={`${theme.star} font-black text-xs shrink-0`}>✦</span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          FEATURED BUILDS & CODE
          (Features Doodle #3: The Paper Plane Flight Loop)
      ========================================================================= */}
      <div className="space-y-6 pt-6 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="sketch-stamp bg-purple-600 text-white dark:bg-purple-500 dark:text-white">
                FEATURED BUILDS
              </span>
              {/* BESPOKE DOODLE #3 (3 of 3): The Paper Plane Flight Loop */}
              <PaperPlaneFlightDoodle />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white">
              Selected Projects &amp; Implementations
            </h2>
            <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
              Interactive machine learning tooling, exploratory analytics &amp; deep learning models.
            </p>
          </div>

          <Link
            href="/projects"
            className="sketch-button-solid text-xs flex items-center gap-2 px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white rounded-md font-mono font-bold shadow-[3px_3px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform"
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Open All Projects →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => {
            const b = projectBadges[p.category] || {
              bg: "bg-indigo-100 dark:bg-indigo-950/60",
              text: "text-indigo-800 dark:text-indigo-300",
              shadow: "shadow-[3.5px_3.5px_0_#6366f1]",
              border: "border-indigo-500",
            }

            return (
              <Link
                key={p.id}
                href={`/projects#${p.id}`}
                className={`p-5 rounded-lg border-2 border-black dark:border-stone-700 bg-white dark:bg-stone-900 ${b.shadow} flex flex-col justify-between space-y-4 group hover:-translate-y-1 transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-black dark:border-stone-800 text-[10px] font-mono font-bold">
                    <span className="text-stone-500 dark:text-stone-400">PROJECT</span>
                    <span className={`px-2 py-0.5 rounded font-black uppercase ${b.bg} ${b.text}`}>
                      {p.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black uppercase text-black dark:text-white mt-3 group-hover:underline leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 line-clamp-2 leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-between font-mono text-xs font-bold text-black dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  <span className="flex items-center gap-1.5">
                    <span>Inspect Repository</span>
                  </span>
                  <span>↗</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          BOTTOM CONNECT DECK (Playful Invitation)
      ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-xl border-2 border-black dark:border-white bg-gradient-to-r from-amber-50 via-purple-50 to-cyan-50 dark:from-stone-900 dark:via-purple-950/30 dark:to-stone-900 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="font-mono text-xs font-black uppercase text-purple-700 dark:text-purple-300 flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>LET&apos;S BUILD SOMETHING EXTRAORDINARY</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white">
            Have a project, idea, or early collaboration in mind?
          </h3>
          <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 max-w-xl">
            Always open to discussing machine learning research, hackathon teams, and summer internship opportunities.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Desk</span>
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-full bg-white text-black dark:bg-stone-900 dark:text-white font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#06b6d4] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
