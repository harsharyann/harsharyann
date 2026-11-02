"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePortfolio } from "@/context/PortfolioContext"
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive"
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
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react"

/**
 * Handcrafted Bespoke Doodle #1 — The Thinker's Spark
 */
function ThinkerLightbulbDoodle({ className = "", isPhone = false }: { className?: string; isPhone?: boolean }) {
  if (isPhone) {
    return (
      <div className={`relative inline-flex items-center align-middle ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 100 120"
          className="w-8 h-10 drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)] filter"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
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
            className="dark:stroke-white dark:fill-amber-300/40"
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
      </div>
    );
  }

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
        <path d="M 50 8 L 50 18" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 22 20 L 30 28" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 78 20 L 70 28" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 12 52 L 22 52" stroke="#f59e0b" strokeWidth="2.8" />
        <path d="M 88 52 L 78 52" stroke="#f59e0b" strokeWidth="2.8" />

        <path
          d="M 32 76 C 22 68 18 55 20 42 C 24 24 38 18 50 18 C 62 18 76 24 80 42 C 82 55 78 68 68 76 L 68 88 L 32 88 Z"
          fill="#fef08a"
          stroke="#000000"
          className="dark:stroke-white dark:fill-amber-300/30"
          strokeWidth="2.6"
        />

        <circle cx="44" cy="46" r="3.5" fill="#000000" className="dark:fill-white" stroke="none" />
        <circle cx="58" cy="46" r="3.5" fill="#000000" className="dark:fill-white" stroke="none" />
        <circle cx="45.5" cy="44.5" r="1.2" fill="#ffffff" stroke="none" />
        <circle cx="59.5" cy="44.5" r="1.2" fill="#ffffff" stroke="none" />

        <path d="M 48 54 Q 51 58 54 54" stroke="#000000" className="dark:stroke-white" strokeWidth="2" fill="none" />
        <path d="M 40 34 Q 45 28 50 34 Q 55 28 60 34" stroke="#f59e0b" strokeWidth="2.2" fill="none" />

        <path d="M 36 94 L 64 94" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
        <path d="M 39 100 L 61 100" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
        <path d="M 44 106 L 56 106" stroke="#000000" className="dark:stroke-white" strokeWidth="2.4" />
      </svg>

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
        <path
          d="M 8 28 C 35 12, 55 48, 75 32 C 90 20, 95 10, 115 24 C 128 32, 138 36, 150 30"
          stroke="#8b5cf6"
          strokeWidth="2.6"
          className="dark:stroke-purple-400"
          strokeDasharray="4 4"
        />
        <path
          d="M 140 22 L 152 30 L 142 38"
          stroke="#8b5cf6"
          strokeWidth="2.8"
          className="dark:stroke-purple-400"
          fill="none"
        />
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
        <path
          d="M 6 38 Q 28 46 44 32 Q 58 18 48 10 Q 38 4 36 22 Q 38 38 68 30 Q 88 24 104 22"
          stroke="#06b6d4"
          strokeWidth="2.2"
          strokeDasharray="3 3.5"
          className="dark:stroke-cyan-400"
        />
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

/**
 * Handcrafted Bespoke Doodle #4 — The Experience Briefcase
 */
function ExperienceBriefcaseDoodle() {
  return (
    <div className="relative inline-flex items-center gap-1.5 select-none" aria-hidden="true">
      <svg
        className="w-8 sm:w-10 h-6 sm:h-7 text-amber-500 dark:text-amber-400 rotate-[3deg]"
        viewBox="0 0 44 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Handle */}
        <path d="M 16 8 C 16 3, 28 3, 28 8" />
        {/* Bag outline */}
        <rect x="4" y="8" width="36" height="21" rx="3" fill="#fef3c7" stroke="currentColor" />
        {/* Straps / latches */}
        <line x1="14" y1="8" x2="14" y2="29" stroke="currentColor" strokeDasharray="2 2" />
        <line x1="30" y1="8" x2="30" y2="29" stroke="currentColor" strokeDasharray="2 2" />
        {/* Center lock */}
        <rect x="20" y="15" width="4" height="4" rx="1" fill="#f59e0b" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span
        className="hidden sm:inline font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400 tracking-wider"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        work track 💼
      </span>
    </div>
  )
}

/**
 * Content Highlighter Parser:
 * Supports:
 * - `{{#color|custom colored highlight}}` (Any arbitrary hex color!)
 * - `==yellow / default highlight==`
 * - `^^cyan highlight^^`
 * - `**bold text**`
 * - Auto-highlighting of comma-separated keywords
 */
export function FormattedHighlightedText({
  text,
  highlightKeywords = "",
  highlightColor = "#f59e0b",
}: {
  text: string;
  highlightKeywords?: string;
  highlightColor?: string;
}) {
  if (!text) return null;

  const paragraphs = text.split("\n\n");
  const keywordsList = highlightKeywords
    ? highlightKeywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  const parseLine = (line: string) => {
    const tokens: React.ReactNode[] = [];
    // Matches {{#HEX|text}} or ==text== or ^^text^^ or **text**
    const regex = /(\{\{#[0-9a-fA-F]{3,8}\|.+?\}\}|==.+?==|\^\^.+?\^\^|\*\*.+?\*\*)/g;
    const parts = line.split(regex);

    parts.forEach((part, idx) => {
      if (!part) return;

      // 1. Custom Arbitrary Color: {{#HEX|inner}}
      if (part.startsWith("{{#") && part.endsWith("}}")) {
        const pipeIdx = part.indexOf("|");
        if (pipeIdx > 3) {
          const customColor = part.slice(2, pipeIdx);
          const inner = part.slice(pipeIdx + 1, -2);
          tokens.push(
            <span
              key={idx}
              className="font-bold transition-colors duration-200"
              style={{ color: customColor }}
            >
              {inner}
            </span>
          );
          return;
        }
      }

      // 2. Default Highlight: ==inner==
      if (part.startsWith("==") && part.endsWith("==")) {
        const inner = part.slice(2, -2);
        tokens.push(
          <span
            key={idx}
            className="font-bold transition-colors duration-200"
            style={{ color: highlightColor || "#f59e0b" }}
          >
            {inner}
          </span>
        );
        return;
      }

      // 3. Cyan Highlight: ^^inner^^
      if (part.startsWith("^^") && part.endsWith("^^")) {
        const inner = part.slice(2, -2);
        tokens.push(
          <span
            key={idx}
            className="font-bold transition-colors duration-200"
            style={{ color: "#06b6d4" }}
          >
            {inner}
          </span>
        );
        return;
      }

      // 4. Bold: **inner**
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        tokens.push(
          <strong key={idx} className="font-black text-black dark:text-white">
            {inner}
          </strong>
        );
        return;
      }

      // 5. Keyword Auto-Matching
      if (keywordsList.length > 0) {
        const escaped = keywordsList
          .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|");
        const kwRegex = new RegExp(`(${escaped})`, "gi");
        const subParts = part.split(kwRegex);
        subParts.forEach((sub, sIdx) => {
          const isMatch = keywordsList.some(
            (kw) => kw.toLowerCase() === sub.toLowerCase()
          );
          if (isMatch) {
            tokens.push(
              <span
                key={`${idx}-${sIdx}`}
                className="font-bold transition-colors duration-200"
                style={{ color: highlightColor || "#f59e0b" }}
              >
                {sub}
              </span>
            );
          } else {
            tokens.push(sub);
          }
        });
      } else {
        tokens.push(part);
      }
    });

    return tokens;
  };

  return (
    <>
      {paragraphs.map((p, pIdx) => (
        <p key={pIdx} className="leading-relaxed whitespace-pre-line">
          {parseLine(p)}
        </p>
      ))}
    </>
  );
}

const BENCHMARK_STICKER_THEMES = [
  {
    bg: "bg-amber-100/90 dark:bg-amber-950/40",
    border: "border-black dark:border-amber-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f59e0b]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#fbbf24]",
    tape: "bg-amber-300/90 dark:bg-amber-500/60",
    valueText: "text-amber-950 dark:text-amber-200",
    labelText: "text-amber-900 dark:text-amber-300",
    sublabel: "text-amber-800/80 dark:text-amber-400/80",
    badgeBg: "bg-amber-200/90 text-amber-950 dark:bg-amber-900/80 dark:text-amber-200 border-amber-950/20 dark:border-amber-400/30",
    icon: "✨",
    tag: "SPECIALTY",
    tilt: "-rotate-1 sm:-rotate-2",
  },
  {
    bg: "bg-emerald-100/90 dark:bg-emerald-950/40",
    border: "border-black dark:border-emerald-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#10b981]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#34d399]",
    tape: "bg-emerald-300/90 dark:bg-emerald-500/60",
    valueText: "text-emerald-950 dark:text-emerald-200",
    labelText: "text-emerald-900 dark:text-emerald-300",
    sublabel: "text-emerald-800/80 dark:text-emerald-400/80",
    badgeBg: "bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/80 dark:text-emerald-200 border-emerald-950/20 dark:border-emerald-400/30",
    icon: "⚡",
    tag: "PROJECTS",
    tilt: "rotate-1 sm:rotate-2",
  },
  {
    bg: "bg-cyan-100/90 dark:bg-cyan-950/40",
    border: "border-black dark:border-cyan-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#06b6d4]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#22d3ee]",
    tape: "bg-cyan-300/90 dark:bg-cyan-500/60",
    valueText: "text-cyan-950 dark:text-cyan-200",
    labelText: "text-cyan-900 dark:text-cyan-300",
    sublabel: "text-cyan-800/80 dark:text-cyan-400/80",
    badgeBg: "bg-cyan-200/90 text-cyan-950 dark:bg-cyan-900/80 dark:text-cyan-200 border-cyan-950/20 dark:border-cyan-400/30",
    icon: "🏆",
    tag: "HONORS",
    tilt: "-rotate-1 sm:-rotate-1.5",
  },
  {
    bg: "bg-rose-100/90 dark:bg-rose-950/40",
    border: "border-black dark:border-rose-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f43f5e]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#fb7185]",
    tape: "bg-rose-300/90 dark:bg-rose-500/60",
    valueText: "text-rose-950 dark:text-rose-200",
    labelText: "text-rose-900 dark:text-rose-300",
    sublabel: "text-rose-800/80 dark:text-rose-400/80",
    badgeBg: "bg-rose-200/90 text-rose-950 dark:bg-rose-900/80 dark:text-rose-200 border-rose-950/20 dark:border-rose-400/30",
    icon: "🔥",
    tag: "SOLVED",
    tilt: "rotate-1 sm:rotate-2",
  },
  {
    bg: "bg-violet-100/90 dark:bg-violet-950/40",
    border: "border-black dark:border-violet-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#8b5cf6]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#a78bfa]",
    tape: "bg-violet-300/90 dark:bg-violet-500/60",
    valueText: "text-violet-950 dark:text-violet-200",
    labelText: "text-violet-900 dark:text-violet-300",
    sublabel: "text-violet-800/80 dark:text-violet-400/80",
    badgeBg: "bg-violet-200/90 text-violet-950 dark:bg-violet-900/80 dark:text-violet-200 border-violet-950/20 dark:border-violet-400/30",
    icon: "🚀",
    tag: "METRICS",
    tilt: "-rotate-1",
  },
];

export function AboutSection({ id = "about" }: { id?: string }) {
  const { data: portfolio } = usePortfolio()
  const { personal, skills, quickStats, milestones, experiences } = portfolio

  // Dynamic experience items with fallback
  const experiencesList = (experiences && experiences.length > 0)
    ? experiences
    : [
        {
          id: "exp-1",
          role: "Teaching Assistant",
          company: "Indian Institute of Technology Madras (IIT Madras)",
          companyUrl: "https://www.iitm.ac.in",
          location: "Chennai, India",
          period: "2024 – Present",
          type: "Academic & Mentorship",
          isCurrent: true,
          description:
            "Guiding undergraduate student cohorts in fundamental computer science, Python programming, and algorithmic problem-solving methodologies.",
          highlights: [
            "Mentoring 150+ students through hands-on computational labs and code reviews.",
            "Assisting course instructors in designing rigorous algorithm and data structure problem sets.",
            "Hosting interactive problem-solving clinics bridging mathematical theory with Python code.",
          ],
          skillsUsed: ["Python", "Algorithms", "Data Structures", "Computational Thinking", "Mentorship"],
        },
      ];

  // Dynamic milestone phases from portfolio state with fallback
  const timelineMilestones = (milestones && milestones.length > 0)
    ? milestones
    : [
        {
          period: "Foundations",
          phaseNumber: "01",
          title: "Algorithmic Intuition & Logic",
          subtitle: "Python, C & Core Problem Solving",
          description:
            "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems.",
        },
        {
          period: "Data & Math",
          phaseNumber: "02",
          title: "Exploratory Modeling & Linear Algebra",
          subtitle: "Vectorized Computations & Analytics",
          description:
            "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks.",
        },
        {
          period: "Frontiers",
          phaseNumber: "03",
          title: "Modern AI Systems & Interactive Tools",
          subtitle: "Full-Stack AI Prototypes & Deployment",
          description:
            "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows.",
        },
      ];

  const milestoneThemes = [
    {
      badgeBg: "bg-amber-400 text-black dark:bg-amber-400 dark:text-black",
      shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
      border: "border-amber-300 dark:border-amber-500/60",
      accentText: "text-amber-700 dark:text-amber-300",
      bgLight: "bg-amber-50/60 dark:bg-stone-900/80",
    },
    {
      badgeBg: "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white",
      shadow: "shadow-[4px_4px_0_#10b981] dark:shadow-[4px_4px_0_#34d399]",
      border: "border-emerald-300 dark:border-emerald-500/60",
      accentText: "text-emerald-700 dark:text-emerald-300",
      bgLight: "bg-emerald-50/60 dark:bg-stone-900/80",
    },
    {
      badgeBg: "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white",
      shadow: "shadow-[4px_4px_0_#6366f1] dark:shadow-[4px_4px_0_#818cf8]",
      border: "border-indigo-300 dark:border-indigo-500/60",
      accentText: "text-indigo-700 dark:text-indigo-300",
      bgLight: "bg-indigo-50/60 dark:bg-stone-900/80",
    },
  ];

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12 sm:space-y-16 scroll-mt-14">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>{personal.aboutHeading || "Behind the Terminal"}</span>
              {/* On phone: Cute idea spark doodle placed directly next to 'TERMINAL' */}
              <span className="inline-flex lg:hidden shrink-0 -mt-1 sm:-mt-2">
                <ThinkerLightbulbDoodle isPhone />
              </span>
            </h2>
            <svg className="w-48 sm:w-64 h-3 text-amber-500 overflow-visible" viewBox="0 0 240 10" fill="none" aria-hidden="true">
              <path d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 leading-relaxed">
              {personal.aboutSubtitle || "Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed."}
            </p>
          </div>

          {/* On laptop & desktop: keep the right-hand Thinker Doodle with speech bubble */}
          <div className="hidden lg:block self-start lg:self-end">
            <ThinkerLightbulbDoodle />
          </div>
        </div>
      </div>

      {/* ── PROFILE & BIO ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Unified Bespoke Physical Exhibition Frame */}
        <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-3">
          {/* Top Washi Tape (Realistic artist tape holding frame to graph paper) */}
          <div className="w-28 sm:w-32 h-6 bg-[#fde047]/80 dark:bg-[#fde047]/45 border-t border-b border-black/25 shadow-xs rotate-[-1.5deg] mx-auto sm:ml-10 -mb-4 z-20 relative backdrop-blur-xs rounded-[2px]" />

          {/* Single Unified Frame Body */}
          <div className="relative group mx-auto sm:mx-0 w-full max-w-[340px] sm:max-w-[380px] rounded-2xl bg-[#fffdfa] dark:bg-[#13141b] border-2 sm:border-3 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] p-4 sm:p-5 space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] dark:hover:shadow-[10px_10px_0_#fff]">
            
            {/* Top Inset Photo Recess */}
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden border-2 border-black/20 dark:border-white/20 bg-stone-200 dark:bg-stone-900 shadow-inner group">
              <Image
                src={formatGoogleDriveImageUrl(personal.aboutPhotoUrl || personal.coverPhotoUrl)}
                alt={personal.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 640px) 320px, 380px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500 select-none"
              />

              {/* Photo Corner Mounting Brackets */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-black/60 dark:border-white/60 pointer-events-none" />
            </div>

            {/* ── Integrated Lower Chin (Inside the SAME frame) ── */}
            <div className="pt-2.5 border-t-2 border-dashed border-stone-300 dark:border-stone-700/80 space-y-2.5">
              {/* Name */}
              <div>
                <h3 className="font-['Space_Grotesk'] text-2xl font-black uppercase tracking-tight text-black dark:text-white leading-none">
                  {personal.name || "HARSH ARYAN"}
                </h3>
              </div>

              {/* Current Work: Teaching Assistant & IIT Madras (Directly underneath, no building emoji) */}
              <div className="flex flex-col items-start gap-1 pt-0.5">
                {/* Current Work / Role */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 dark:border-emerald-500/40 text-stone-900 dark:text-stone-100 font-mono text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{personal.aboutCurrentWork || personal.role || "Teaching Assistant"}</span>
                </div>

                {/* IIT Madras directly underneath (Clean, NO building emoji) */}
                <div className="inline-flex items-center px-3 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 border border-amber-300/80 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 font-mono text-xs font-bold shadow-2xs">
                  <span>{personal.aboutWorkPlace || "IIT Madras"}</span>
                </div>
              </div>

              {/* Location — Clean, no college / building clutter */}
              {personal.location && (
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center gap-1.5 text-[11px] font-mono text-stone-600 dark:text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{personal.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Statement, Bio with Live Highlighter, and Quick Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-4 text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
            <div className="flex items-center gap-3 pb-0.5">
              <span className="font-hero-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-amber-600 dark:text-amber-400">
                Persona
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 border-2 border-black dark:border-amber-400/80 text-black dark:text-amber-200 font-mono text-[10px] font-black uppercase shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fbbf24]">
                STATEMENT
              </span>
            </div>
            <div className="font-semibold text-lg sm:text-xl text-black dark:text-white leading-snug">
              <FormattedHighlightedText
                text={personal.headline}
                highlightKeywords={personal.aboutHighlightedWords}
                highlightColor={personal.aboutHighlightColor}
              />
            </div>
            <div className="space-y-3 pt-1 text-stone-700 dark:text-stone-300">
              <FormattedHighlightedText
                text={personal.bio}
                highlightKeywords={personal.aboutHighlightedWords}
                highlightColor={personal.aboutHighlightColor}
              />
            </div>
          </div>

          {/* Quick Stats Grid (Colourful Sketchbook Sticker Cards) */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_#f59e0b] -rotate-1 select-none">
                  <span>🏷️</span>
                  <span>KEY BENCHMARKS</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-widest uppercase hidden sm:inline">
                  // VERIFIED METRICS
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 italic hidden md:inline">
                ✦ interactive stickers
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-1.5">
              {quickStats?.map((st, i) => {
                const theme = BENCHMARK_STICKER_THEMES[i % BENCHMARK_STICKER_THEMES.length];
                return (
                  <div
                    key={i}
                    className={`group relative pt-3.5 pb-2.5 px-3 sm:px-3.5 rounded-2xl border-2 ${theme.border} ${theme.bg} ${theme.shadow} ${theme.hoverShadow} ${theme.tilt} transition-all duration-200 hover:rotate-0 hover:-translate-y-1.5 hover:scale-[1.03] select-none cursor-default`}
                  >
                    {/* Realistic Washi Tape pinned at top */}
                    <div
                      className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-2.5 ${theme.tape} border border-black/25 dark:border-white/20 shadow-xs rotate-[-1deg] rounded-xs backdrop-blur-xs pointer-events-none z-10`}
                      aria-hidden="true"
                    />

                    {/* Top Row: Mini Tag Badge & Index */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9px] font-mono font-black uppercase tracking-wider border ${theme.badgeBg}`}
                      >
                        <span>{theme.icon}</span>
                        <span>{theme.tag}</span>
                      </span>
                      <span className="text-[9.5px] font-mono font-bold text-black/35 dark:text-white/40">
                        #{String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Big Metric Value */}
                    <div
                      className={`text-xl sm:text-2xl font-black font-mono tracking-tight leading-none ${theme.valueText}`}
                    >
                      {st.value}
                    </div>

                    {/* Label */}
                    <div
                      className={`text-[10.5px] sm:text-[11px] font-mono font-black uppercase tracking-wider mt-1.5 leading-tight ${theme.labelText}`}
                    >
                      {st.label}
                    </div>

                    {/* Sublabel */}
                    {st.sublabel && (
                      <div
                        className={`text-[9px] font-mono truncate mt-0.5 leading-tight font-medium ${theme.sublabel}`}
                      >
                        {st.sublabel}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
                className="p-5 rounded-[28px] liquid-bento-card space-y-3"
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

      {/* ── PROFESSIONAL EXPERIENCE (Conditional Show/Hide) ── */}
      {personal?.showExperienceSection !== false && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black/15 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="sketch-stamp bg-amber-400 text-black font-black">
                WORK &amp; LEADERSHIP
              </span>
              <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
                [EXPERIENCE]
              </span>
            </div>
            <ExperienceBriefcaseDoodle />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {experiencesList.map((exp, idx) => {
              const cardThemes = [
                {
                  border: "border-black dark:border-white",
                  shadow: "shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]",
                  badgeBg: "bg-amber-400 text-black",
                  accent: "text-amber-700 dark:text-amber-400",
                },
                {
                  border: "border-black dark:border-white",
                  shadow: "shadow-[6px_6px_0_#10b981] dark:shadow-[6px_6px_0_#34d399]",
                  badgeBg: "bg-emerald-500 text-white",
                  accent: "text-emerald-700 dark:text-emerald-400",
                },
                {
                  border: "border-black dark:border-white",
                  shadow: "shadow-[6px_6px_0_#6366f1] dark:shadow-[6px_6px_0_#818cf8]",
                  badgeBg: "bg-indigo-600 text-white",
                  accent: "text-indigo-700 dark:text-indigo-400",
                },
              ];
              const t = cardThemes[idx % cardThemes.length];

              return (
                <div
                  key={exp.id || idx}
                  className={`p-6 sm:p-7 rounded-[26px] bg-[#fffdfa] dark:bg-[#13141b] border-2 sm:border-3 ${t.border} ${t.shadow} space-y-4 transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Top Bar: Role Title & Status Pills */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-black uppercase text-black dark:text-white tracking-tight leading-tight">
                          {exp.role}
                        </h3>
                        {exp.type && (
                          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 font-mono text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase">
                            ✦ {exp.type}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-stone-600 dark:text-stone-400">
                        {/* Company */}
                        <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-200">
                          <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          {exp.companyUrl ? (
                            <Link
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-amber-600 dark:hover:text-amber-400 inline-flex items-center gap-1"
                            >
                              <span>{exp.company}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span>{exp.company}</span>
                          )}
                        </div>

                        {/* Location */}
                        {exp.location && (
                          <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                            <span>•</span>
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Period & Active Status Badge */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {exp.isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-900 dark:text-emerald-300 font-mono text-xs font-black shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span>{exp.period || "Current"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-mono text-xs font-bold">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          <span>{exp.period}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description Paragraph */}
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      {exp.description}
                    </p>
                  )}

                  {/* Highlights Bullet List */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        [KEY CONTRIBUTIONS &amp; IMPACT]
                      </div>
                      <ul className="space-y-1.5">
                        {exp.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed"
                          >
                            <span className="text-amber-500 font-black shrink-0 mt-0.5">✦</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills / Stack Chips */}
                  {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-dashed border-stone-200 dark:border-stone-800">
                      <span className="font-mono text-[10px] font-bold text-stone-400 uppercase mr-1">
                        Domain:
                      </span>
                      {exp.skillsUsed.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-full border border-black/15 dark:border-white/15 bg-stone-100 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-mono text-[11px] font-bold"
                        >
                          ✦ {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TRAJECTORY MILESTONES (Conditional Show/Hide) ── */}
      {personal?.showDevelopmentTrajectory !== false && (
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
            {timelineMilestones.map((m, idx) => {
              const theme = milestoneThemes[idx % milestoneThemes.length];
              return (
                <div
                  key={m.phaseNumber || idx}
                  className="p-5 rounded-[28px] liquid-bento-card space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${theme.badgeBg}`}>
                        PHASE {m.phaseNumber}
                      </span>
                      <span className={`font-mono text-xs font-bold ${theme.accentText}`}>
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
              );
            })}
          </div>
        </div>
      )}
    </section>
  )
}
