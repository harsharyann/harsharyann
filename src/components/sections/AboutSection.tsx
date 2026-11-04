"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePortfolio } from "@/context/PortfolioContext"
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive"
import { resolveRoleTrack } from "@/lib/roleTrack"
import { resolveMilestoneStatus } from "@/lib/milestoneStatus"
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
  Terminal,
  Database,
  Cpu,
  BookOpen,
  Globe,
} from "lucide-react"

/**
 * Handcrafted Bespoke Doodle #1 — The Thinker's Spark
 */
function ThinkerLightbulbDoodle({ className = "", isPhone = false }: { className?: string; isPhone?: boolean }) {
  if (isPhone) {
    return (
      <div className={`relative inline-flex items-center align-middle animate-doodle-float ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 100 120"
          className="w-8 h-10 drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)] filter"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Glow rays with animated pulse */}
          <g className="animate-bulb-rays">
            <path d="M 50 8 L 50 18" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 22 20 L 30 28" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 78 20 L 70 28" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 12 52 L 22 52" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 88 52 L 78 52" stroke="#f59e0b" strokeWidth="2.8" />
          </g>

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
      <div className="animate-doodle-float">
        <svg
          viewBox="0 0 100 120"
          className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] filter"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Animated pulsing glow rays */}
          <g className="animate-bulb-rays">
            <path d="M 50 8 L 50 18" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 22 20 L 30 28" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 78 20 L 70 28" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 12 52 L 22 52" stroke="#f59e0b" strokeWidth="2.8" />
            <path d="M 88 52 L 78 52" stroke="#f59e0b" strokeWidth="2.8" />
          </g>

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
      </div>

      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-amber-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] text-xs font-bold rotate-[-2deg] animate-doodle-float-reverse transition-all duration-300 hover:rotate-0 hover:scale-105 hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_#fff] cursor-default group/sticker"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-amber-950 dark:text-amber-200 text-sm inline-flex items-center gap-1.5">
          <span>curiosity &gt; complexity</span>
          <span className="inline-block transition-transform duration-300 group-hover/sticker:scale-125 group-hover/sticker:rotate-12 animate-spark-glow">💡</span>
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
        className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 rotate-[-2deg] animate-doodle-float-reverse inline-block transition-transform duration-200 hover:scale-105 cursor-default"
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
        className="text-xs sm:text-sm font-bold text-cyan-700 dark:text-cyan-300 rotate-[1.5deg] animate-doodle-float inline-block transition-transform duration-200 hover:scale-105 cursor-default"
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
        className="w-8 sm:w-10 h-6 sm:h-7 text-amber-500 dark:text-amber-400 rotate-[3deg] animate-doodle-float"
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
        className="hidden sm:inline font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400 tracking-wider animate-doodle-float-reverse inline-block"
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
        const sorted = [...keywordsList].filter(Boolean).sort((a, b) => b.length - a.length);
        const escaped = sorted
          .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .filter(Boolean)
          .join("|");
        if (escaped) {
          const kwRegex = new RegExp(`(${escaped})`, "gi");
          const subParts = part.split(kwRegex);
          subParts.forEach((sub, sIdx) => {
            const isMatch = sorted.some(
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

export const BENCHMARK_STICKER_COLOR_MAP: Record<string, {
  name: string;
  hex: string;
  bg: string;
  border: string;
  shadow: string;
  hoverShadow: string;
  tape: string;
  valueText: string;
  labelText: string;
  sublabel: string;
  badgeBg: string;
  defaultIcon: string;
  defaultTag: string;
}> = {
  amber: {
    name: "Brand Amber",
    hex: "#f59e0b",
    bg: "bg-amber-100/90 dark:bg-amber-950/40",
    border: "border-black dark:border-amber-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f59e0b]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#fbbf24]",
    tape: "bg-amber-300/90 dark:bg-amber-500/60",
    valueText: "text-amber-950 dark:text-amber-200",
    labelText: "text-amber-900 dark:text-amber-300",
    sublabel: "text-amber-800/80 dark:text-amber-400/80",
    badgeBg: "bg-amber-200/90 text-amber-950 dark:bg-amber-900/80 dark:text-amber-200 border-amber-950/20 dark:border-amber-400/30",
    defaultIcon: "✨",
    defaultTag: "SPECIALTY",
  },
  emerald: {
    name: "Tech Emerald",
    hex: "#10b981",
    bg: "bg-emerald-100/90 dark:bg-emerald-950/40",
    border: "border-black dark:border-emerald-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#10b981]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#34d399]",
    tape: "bg-emerald-300/90 dark:bg-emerald-500/60",
    valueText: "text-emerald-950 dark:text-emerald-200",
    labelText: "text-emerald-900 dark:text-emerald-300",
    sublabel: "text-emerald-800/80 dark:text-emerald-400/80",
    badgeBg: "bg-emerald-200/90 text-emerald-950 dark:bg-emerald-900/80 dark:text-emerald-200 border-emerald-950/20 dark:border-emerald-400/30",
    defaultIcon: "⚡",
    defaultTag: "PROJECTS",
  },
  cyan: {
    name: "Sci-Comp Cyan",
    hex: "#06b6d4",
    bg: "bg-cyan-100/90 dark:bg-cyan-950/40",
    border: "border-black dark:border-cyan-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#06b6d4]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#22d3ee]",
    tape: "bg-cyan-300/90 dark:bg-cyan-500/60",
    valueText: "text-cyan-950 dark:text-cyan-200",
    labelText: "text-cyan-900 dark:text-cyan-300",
    sublabel: "text-cyan-800/80 dark:text-cyan-400/80",
    badgeBg: "bg-cyan-200/90 text-cyan-950 dark:bg-cyan-900/80 dark:text-cyan-200 border-cyan-950/20 dark:border-cyan-400/30",
    defaultIcon: "🏆",
    defaultTag: "HONORS",
  },
  rose: {
    name: "Coral Rose",
    hex: "#f43f5e",
    bg: "bg-rose-100/90 dark:bg-rose-950/40",
    border: "border-black dark:border-rose-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f43f5e]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#fb7185]",
    tape: "bg-rose-300/90 dark:bg-rose-500/60",
    valueText: "text-rose-950 dark:text-rose-200",
    labelText: "text-rose-900 dark:text-rose-300",
    sublabel: "text-rose-800/80 dark:text-rose-400/80",
    badgeBg: "bg-rose-200/90 text-rose-950 dark:bg-rose-900/80 dark:text-rose-200 border-rose-950/20 dark:border-rose-400/30",
    defaultIcon: "🔥",
    defaultTag: "SOLVED",
  },
  purple: {
    name: "AI Violet",
    hex: "#8b5cf6",
    bg: "bg-purple-100/90 dark:bg-purple-950/40",
    border: "border-black dark:border-purple-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#8b5cf6]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#c084fc]",
    tape: "bg-purple-300/90 dark:bg-purple-500/60",
    valueText: "text-purple-950 dark:text-purple-200",
    labelText: "text-purple-900 dark:text-purple-300",
    sublabel: "text-purple-800/80 dark:text-purple-400/80",
    badgeBg: "bg-purple-200/90 text-purple-950 dark:bg-purple-900/80 dark:text-purple-200 border-purple-950/20 dark:border-purple-400/30",
    defaultIcon: "🚀",
    defaultTag: "ACHIEVEMENTS",
  },
  indigo: {
    name: "Deep Indigo",
    hex: "#6366f1",
    bg: "bg-indigo-100/90 dark:bg-indigo-950/40",
    border: "border-black dark:border-indigo-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#6366f1]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#818cf8]",
    tape: "bg-indigo-300/90 dark:bg-indigo-500/60",
    valueText: "text-indigo-950 dark:text-indigo-200",
    labelText: "text-indigo-900 dark:text-indigo-300",
    sublabel: "text-indigo-800/80 dark:text-indigo-400/80",
    badgeBg: "bg-indigo-200/90 text-indigo-950 dark:bg-indigo-900/80 dark:text-indigo-200 border-indigo-950/20 dark:border-indigo-400/30",
    defaultIcon: "💡",
    defaultTag: "INSIGHTS",
  },
  orange: {
    name: "Sun Orange",
    hex: "#f97316",
    bg: "bg-orange-100/90 dark:bg-orange-950/40",
    border: "border-black dark:border-orange-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f97316]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#fb923c]",
    tape: "bg-orange-300/90 dark:bg-orange-500/60",
    valueText: "text-orange-950 dark:text-orange-200",
    labelText: "text-orange-900 dark:text-orange-300",
    sublabel: "text-orange-800/80 dark:text-orange-400/80",
    badgeBg: "bg-orange-200/90 text-orange-950 dark:bg-orange-900/80 dark:text-orange-200 border-orange-950/20 dark:border-orange-400/30",
    defaultIcon: "🎯",
    defaultTag: "GOALS",
  },
  teal: {
    name: "Sea Teal",
    hex: "#14b8a6",
    bg: "bg-teal-100/90 dark:bg-teal-950/40",
    border: "border-black dark:border-teal-400",
    shadow: "shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#14b8a6]",
    hoverShadow: "hover:shadow-[5px_5px_0_#000] dark:hover:shadow-[5px_5px_0_#2dd4bf]",
    tape: "bg-teal-300/90 dark:bg-teal-500/60",
    valueText: "text-teal-950 dark:text-teal-200",
    labelText: "text-teal-900 dark:text-teal-300",
    sublabel: "text-teal-800/80 dark:text-teal-400/80",
    badgeBg: "bg-teal-200/90 text-teal-950 dark:bg-teal-900/80 dark:text-teal-200 border-teal-950/20 dark:border-teal-400/30",
    defaultIcon: "🔬",
    defaultTag: "RESEARCH",
  },
};

const COLOR_SEQUENCE = ["amber", "emerald", "cyan", "rose", "purple", "indigo", "orange", "teal"];
const BENCHMARK_TILTS = ["-rotate-1 sm:-rotate-2", "rotate-1 sm:rotate-2", "-rotate-1 sm:-rotate-1.5", "rotate-1 sm:rotate-2"];

export function getBenchmarkStickerTheme(
  st: { tag?: string; icon?: string; color?: string } | undefined,
  index: number
) {
  const chosenColor = (st?.color || "").toLowerCase().trim();
  let baseTheme = BENCHMARK_STICKER_COLOR_MAP[chosenColor];

  if (!baseTheme) {
    const foundByHex = Object.values(BENCHMARK_STICKER_COLOR_MAP).find(
      (t) => t.hex.toLowerCase() === chosenColor
    );
    if (foundByHex) {
      baseTheme = foundByHex;
    } else {
      const fallbackKey = COLOR_SEQUENCE[index % COLOR_SEQUENCE.length];
      baseTheme = BENCHMARK_STICKER_COLOR_MAP[fallbackKey];
    }
  }

  return {
    ...baseTheme,
    tilt: BENCHMARK_TILTS[index % BENCHMARK_TILTS.length],
    tag: st?.tag || baseTheme.defaultTag,
    icon: st?.icon !== undefined && st.icon !== "" ? st.icon : baseTheme.defaultIcon,
  };
}

export function renderSkillIcon(iconName?: string, className = "w-4 h-4 shrink-0") {
  const norm = (iconName || "").toLowerCase().trim();
  switch (norm) {
    case "brain":
    case "ai":
      return <Brain className={className} />;
    case "code":
    case "code2":
    case "dev":
      return <Code2 className={className} />;
    case "laptop":
    case "pc":
      return <Laptop className={className} />;
    case "terminal":
    case "cli":
    case "bash":
      return <Terminal className={className} />;
    case "git":
    case "folder":
    case "github":
      return <FolderGit2 className={className} />;
    case "database":
    case "sql":
      return <Database className={className} />;
    case "cpu":
    case "chip":
    case "hardware":
      return <Cpu className={className} />;
    case "sparkles":
    case "magic":
      return <Sparkles className={className} />;
    case "book":
    case "math":
    case "theory":
      return <BookOpen className={className} />;
    case "globe":
    case "web":
      return <Globe className={className} />;
    default:
      if (iconName && iconName.length <= 4) {
        return <span className="text-sm shrink-0 leading-none">{iconName}</span>;
      }
      return <Code2 className={className} />;
  }
}

export const SKILL_CARD_COLOR_MAP: Record<string, {
  name: string;
  hex: string;
  bg: string;
  border: string;
  shadow: string;
  hoverShadow: string;
  tape: string;
  badgeBg: string;
  starColor: string;
  chipHover: string;
  iconColor: string;
}> = {
  amber: {
    name: "Brand Amber",
    hex: "#f59e0b",
    bg: "bg-[#fffef7] dark:bg-[#15161e]",
    border: "border-2 border-black dark:border-amber-400/80",
    shadow: "shadow-[5px_5px_0_#f59e0b] dark:shadow-[5px_5px_0_#fbbf24]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#f59e0b]",
    tape: "bg-amber-300 dark:bg-amber-400",
    badgeBg: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-700",
    starColor: "text-amber-500 dark:text-amber-400",
    chipHover: "hover:border-amber-500 hover:bg-amber-50/70 dark:hover:border-amber-400 dark:hover:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  emerald: {
    name: "Tech Emerald",
    hex: "#10b981",
    bg: "bg-[#fafffa] dark:bg-[#121815]",
    border: "border-2 border-black dark:border-emerald-400/80",
    shadow: "shadow-[5px_5px_0_#10b981] dark:shadow-[5px_5px_0_#34d399]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#10b981]",
    tape: "bg-emerald-300 dark:bg-emerald-400",
    badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-700",
    starColor: "text-emerald-500 dark:text-emerald-400",
    chipHover: "hover:border-emerald-500 hover:bg-emerald-50/70 dark:hover:border-emerald-400 dark:hover:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  indigo: {
    name: "Deep Indigo",
    hex: "#6366f1",
    bg: "bg-[#fafaff] dark:bg-[#151422]",
    border: "border-2 border-black dark:border-indigo-400/80",
    shadow: "shadow-[5px_5px_0_#6366f1] dark:shadow-[5px_5px_0_#818cf8]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#6366f1]",
    tape: "bg-indigo-300 dark:bg-indigo-400",
    badgeBg: "bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-700",
    starColor: "text-indigo-500 dark:text-indigo-400",
    chipHover: "hover:border-indigo-500 hover:bg-indigo-50/70 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  cyan: {
    name: "Sci-Comp Cyan",
    hex: "#06b6d4",
    bg: "bg-[#f7feff] dark:bg-[#11181c]",
    border: "border-2 border-black dark:border-cyan-400/80",
    shadow: "shadow-[5px_5px_0_#06b6d4] dark:shadow-[5px_5px_0_#38bdf8]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#06b6d4]",
    tape: "bg-cyan-300 dark:bg-cyan-400",
    badgeBg: "bg-cyan-100 text-cyan-950 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-200 dark:border-cyan-700",
    starColor: "text-cyan-500 dark:text-cyan-400",
    chipHover: "hover:border-cyan-500 hover:bg-cyan-50/70 dark:hover:border-cyan-400 dark:hover:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  rose: {
    name: "Coral Rose",
    hex: "#f43f5e",
    bg: "bg-[#fff8fa] dark:bg-[#1c1216]",
    border: "border-2 border-black dark:border-rose-400/80",
    shadow: "shadow-[5px_5px_0_#f43f5e] dark:shadow-[5px_5px_0_#fb7185]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#f43f5e]",
    tape: "bg-rose-300 dark:bg-rose-400",
    badgeBg: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-700",
    starColor: "text-rose-500 dark:text-rose-400",
    chipHover: "hover:border-rose-500 hover:bg-rose-50/70 dark:hover:border-rose-400 dark:hover:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  purple: {
    name: "AI Violet",
    hex: "#8b5cf6",
    bg: "bg-[#faf5ff] dark:bg-[#171224]",
    border: "border-2 border-black dark:border-purple-400/80",
    shadow: "shadow-[5px_5px_0_#8b5cf6] dark:shadow-[5px_5px_0_#c084fc]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#8b5cf6]",
    tape: "bg-purple-300 dark:bg-purple-400",
    badgeBg: "bg-purple-100 text-purple-950 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-700",
    starColor: "text-purple-500 dark:text-purple-400",
    chipHover: "hover:border-purple-500 hover:bg-purple-50/70 dark:hover:border-purple-400 dark:hover:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    name: "Sun Orange",
    hex: "#f97316",
    bg: "bg-[#fffaf5] dark:bg-[#1a140f]",
    border: "border-2 border-black dark:border-orange-400/80",
    shadow: "shadow-[5px_5px_0_#f97316] dark:shadow-[5px_5px_0_#fb923c]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#f97316]",
    tape: "bg-orange-300 dark:bg-orange-400",
    badgeBg: "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950/70 dark:text-orange-200 dark:border-orange-700",
    starColor: "text-orange-500 dark:text-orange-400",
    chipHover: "hover:border-orange-500 hover:bg-orange-50/70 dark:hover:border-orange-400 dark:hover:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  teal: {
    name: "Sea Teal",
    hex: "#14b8a6",
    bg: "bg-[#f4fdfc] dark:bg-[#0f1918]",
    border: "border-2 border-black dark:border-teal-400/80",
    shadow: "shadow-[5px_5px_0_#14b8a6] dark:shadow-[5px_5px_0_#2dd4bf]",
    hoverShadow: "hover:shadow-[7px_7px_0_#000] dark:hover:shadow-[7px_7px_0_#14b8a6]",
    tape: "bg-teal-300 dark:bg-teal-400",
    badgeBg: "bg-teal-100 text-teal-950 border-teal-300 dark:bg-teal-950/70 dark:text-teal-200 dark:border-teal-700",
    starColor: "text-teal-500 dark:text-teal-400",
    chipHover: "hover:border-teal-500 hover:bg-teal-50/70 dark:hover:border-teal-400 dark:hover:bg-teal-950/40",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
};

const SKILL_COLOR_SEQUENCE = ["amber", "emerald", "indigo", "cyan", "rose", "purple", "orange", "teal"];

export function getSkillGroupTheme(group: { color?: string } | undefined, idx: number) {
  const chosen = (group?.color || "").toLowerCase().trim();
  let theme = SKILL_CARD_COLOR_MAP[chosen];
  if (!theme) {
    const foundByHex = Object.values(SKILL_CARD_COLOR_MAP).find((t) => t.hex.toLowerCase() === chosen);
    if (foundByHex) {
      theme = foundByHex;
    } else {
      const fallbackKey = SKILL_COLOR_SEQUENCE[idx % SKILL_COLOR_SEQUENCE.length];
      theme = SKILL_CARD_COLOR_MAP[fallbackKey];
    }
  }
  return theme;
}

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

  // Year-wise & Station-wise (Current vs Past) Experience state
  const [activeExpYear, setActiveExpYear] = React.useState<string>("all");
  // Default to "current" roles view as requested ("current role wla openn ho jb vi aae all wala nahi")
  const [expStationFilter, setExpStationFilter] = React.useState<"current" | "past" | "all">("current");

  const isCurrentRoleItem = (exp: { isCurrent?: boolean; period?: string }) => {
    if (exp.isCurrent === true) return true;
    if (exp.isCurrent === false) return false;
    return Boolean(exp.period && /present|current|now|active/i.test(exp.period));
  };

  const parseEndYear = (period?: string) => {
    if (!period) return 0;
    const matches = period.match(/\b(20\d{2})\b/g);
    if (!matches || matches.length === 0) return 0;
    return Math.max(...matches.map(Number));
  };

  const currentExperiences = React.useMemo(() => {
    return experiencesList
      .filter(isCurrentRoleItem)
      .sort((a, b) => parseEndYear(b.period) - parseEndYear(a.period));
  }, [experiencesList]);

  const pastExperiences = React.useMemo(() => {
    return experiencesList
      .filter((exp) => !isCurrentRoleItem(exp))
      .sort((a, b) => parseEndYear(b.period) - parseEndYear(a.period));
  }, [experiencesList]);

  const expYearsList = React.useMemo(() => {
    const years = new Set<string>();
    experiencesList.forEach((exp) => {
      if (isCurrentRoleItem(exp)) {
        years.add("Current");
      }
      const match = exp.period?.match(/\b(20\d{2})\b/g);
      if (match) {
        match.forEach((y) => years.add(y));
      }
    });
    return Array.from(years).sort((a, b) => {
      if (a === "Current") return -1;
      if (b === "Current") return 1;
      return Number(b) - Number(a);
    });
  }, [experiencesList]);

  const filteredExperiences = React.useMemo(() => {
    // Current roles ALWAYS on top, followed by past roles below them
    const allSorted = [...currentExperiences, ...pastExperiences];

    let baseList = allSorted;
    if (expStationFilter === "current") {
      baseList = currentExperiences;
    } else if (expStationFilter === "past") {
      baseList = pastExperiences;
    }

    if (activeExpYear === "all") return baseList;
    if (activeExpYear === "Current") {
      return baseList.filter(isCurrentRoleItem);
    }
    return baseList.filter((exp) => exp.period?.includes(activeExpYear));
  }, [currentExperiences, pastExperiences, expStationFilter, activeExpYear]);

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
                className="object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                style={{
                  objectPosition: `${personal.aboutPhotoPositionX ?? 50}% ${personal.aboutPhotoPositionY ?? 20}%`,
                  transform: `scale(${personal.aboutPhotoZoom ?? 1})`,
                  transformOrigin: `${personal.aboutPhotoPositionX ?? 50}% ${personal.aboutPhotoPositionY ?? 20}%`,
                }}
              />

              {/* Photo Corner Mounting Brackets */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-black/60 dark:border-white/60 pointer-events-none" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-black/60 dark:border-white/60 pointer-events-none" />
            </div>

            {/* ── Integrated Lower Chin (Inside the SAME frame) ── */}
            <div className="pt-2.5 border-t-2 border-dashed border-stone-300 dark:border-stone-700/80 space-y-2.5">
              {/* Signature Name on Photo Mount */}
              <div>
                <h3 className="font-signature text-3xl sm:text-4xl font-bold tracking-wide italic text-black dark:text-white leading-tight select-none rotate-[-1deg]">
                  {personal.name || "Harsh Aryan"}
                </h3>
              </div>

              {/* Current Role & Organization: Unified Live Status Module */}
              {personal.showAboutRole !== false && (Boolean(personal.aboutCurrentWork || personal.role) || Boolean(personal.aboutWorkPlace)) && (() => {
                const rawRole = (personal.aboutCurrentWork || personal.role || "").trim();
                const workplace = (personal.aboutWorkPlace || "").trim();
                
                // If workplace exists and role already includes "@ workplace", avoid duplication
                const displayRole = workplace && rawRole.toLowerCase().includes(`@ ${workplace.toLowerCase()}`)
                  ? rawRole.replace(new RegExp(`\\s*@\\s*${workplace}`, 'i'), '').trim()
                  : rawRole;

                const track = resolveRoleTrack(
                  rawRole,
                  workplace,
                  personal.aboutRoleType,
                  personal.coverRoleTrackColor,
                  personal.aboutRoleStatusText,
                  personal.aboutRoleIcon,
                  personal.aboutRoleCardStyle
                );
                const tagText = (personal.aboutRoleTag || "").trim() || track.defaultTag;

                return (
                  <div
                    className="group/roleCard relative w-full overflow-hidden rounded-xl p-3 border-2 border-black dark:border-white shadow-[3.5px_3.5px_0_#000] dark:shadow-[3.5px_3.5px_0_#fff] bg-[#fffdfa] dark:bg-stone-900 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0_#000] dark:hover:shadow-[4.5px_4.5px_0_#fff]"
                    style={track.cardStyle}
                  >
                    {/* Technical blueprint grid texture */}
                    <div 
                      className="absolute inset-0 opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                        backgroundSize: '8px 8px',
                      }}
                    />

                    {/* Subtle hover sheen sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full group-hover/roleCard:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                    {/* Top Bar: Live Radar Beacon + Track Icon + Track Pill */}
                    <div className="relative z-10 flex items-center justify-between gap-2 pb-1.5 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                            style={{ backgroundColor: track.activeColor }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-2 w-2"
                            style={{
                              backgroundColor: track.activeColor,
                              boxShadow: `0 0 0 2px ${track.activeColor}33`,
                            }}
                          />
                        </span>
                        <span
                          className="font-mono text-[9.5px] font-black uppercase tracking-wider flex items-center gap-1.5"
                          style={{ color: track.activeColor }}
                        >
                          {track.icon}
                          <span>{track.label}</span>
                        </span>
                      </div>
                      {Boolean(tagText) && (
                        <span
                          className="font-mono text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shadow-2xs"
                          style={track.tagStyle}
                        >
                          {tagText}
                        </span>
                      )}
                    </div>

                    {/* Role Title & Organization Badge */}
                    <div className="relative z-10 pt-2 flex flex-wrap items-center gap-2">
                      {Boolean(displayRole) && (
                        <span className="font-['Space_Grotesk'] text-xs sm:text-[13px] font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                          {displayRole}
                        </span>
                      )}

                      {Boolean(workplace) && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10.5px] sm:text-[11px] font-black tracking-wide border shadow-2xs"
                          style={track.workplaceBadgeStyle}
                        >
                          <span
                            className="font-sans font-bold text-xs"
                            style={track.workplaceAtStyle}
                          >
                            @
                          </span>
                          <span className="text-stone-900 dark:text-stone-100">{workplace}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Current Education & Degree: Unified Academic Module (Hide / Unhideable) */}
              {personal.showEducationBadge !== false && (Boolean(personal.aboutEducationDegree || personal.degree) || Boolean(personal.aboutEducationCollege || personal.college)) && (() => {
                const rawDegree = (personal.aboutEducationDegree || personal.degree || "").trim();
                const college = (personal.aboutEducationCollege || personal.college || "").trim();

                const displayDegree = college && rawDegree.toLowerCase().includes(`@ ${college.toLowerCase()}`)
                  ? rawDegree.replace(new RegExp(`\\s*@\\s*${college}`, 'i'), '').trim()
                  : rawDegree;

                return (
                  <div className="group/eduCard relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-sky-50/90 via-indigo-50/60 to-blue-50/90 dark:from-[#151a2d] dark:via-[#1c223c] dark:to-[#151a2d] p-2.5 border-2 border-black dark:border-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] dark:hover:shadow-[4px_4px_0_#fff]">
                    {/* Subtle hover sheen sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full group-hover/eduCard:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />

                    {/* Top Bar: Academic Radar Beacon + Status Pill */}
                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500 ring-2 ring-sky-500/20" />
                        </span>
                        <span className="font-mono text-[9.5px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                          <span>Education &middot; Current</span>
                        </span>
                      </div>
                      {Boolean(college) && (
                        <span className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                          Campus
                        </span>
                      )}
                    </div>

                    {/* Degree Title & College Badge */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                      {Boolean(displayDegree) && (
                        <span className="font-['Space_Grotesk'] text-xs sm:text-[13px] font-black uppercase tracking-tight text-black dark:text-white leading-tight">
                          {displayDegree}
                        </span>
                      )}

                      {Boolean(college) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-200/90 dark:bg-sky-900/60 border border-sky-950/25 dark:border-sky-400/30 font-mono text-[10.5px] sm:text-[11px] font-black tracking-wide text-sky-950 dark:text-sky-200 shadow-2xs">
                          <span className="text-sky-700 dark:text-sky-400 font-sans font-bold text-xs">@</span>
                          <span>{college}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

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
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-mono text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0_#f59e0b] -rotate-1 select-none">
                <span>🏷️</span>
                <span>KEY BENCHMARKS</span>
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-1.5">
              {quickStats?.map((st, i) => {
                const theme = getBenchmarkStickerTheme(st, i);
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
                        {theme.icon && <span>{theme.icon}</span>}
                        <span>{st.tag || theme.tag}</span>
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
          <div className="flex items-center gap-2.5">
            <span className="sketch-stamp bg-indigo-600 text-white font-black">
              CORE CAPABILITIES
            </span>
            <span className="font-mono text-xs font-black uppercase text-stone-400 dark:text-stone-500">
              // TECHNICAL ARSENAL
            </span>
          </div>
          <PaperPlaneFlightDoodle />
        </div>

        {(!skills || skills.length === 0) ? (
          <div className="p-8 text-center rounded-2xl bg-white/50 dark:bg-stone-900/40 border border-dashed border-stone-300 dark:border-stone-700 font-mono text-xs text-stone-500">
            No technical skills configured yet. Add them in the Admin Panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6 pt-2">
            {skills.map((group, idx) => {
            const t = getSkillGroupTheme(group, idx);
            const total = skills.length;
            // Balance layout: if 5 items, row 1 = 3 items (2 cols each), row 2 = 2 items (3 cols each)
            const colSpan =
              total === 5
                ? idx < 3
                  ? "lg:col-span-2"
                  : "lg:col-span-3"
                : total === 4 || total === 2
                ? "lg:col-span-3"
                : total === 1
                ? "lg:col-span-6"
                : "lg:col-span-2";

            return (
              <div
                key={group.category}
                className={`relative p-5 sm:p-6 rounded-3xl ${colSpan} ${t.bg} ${t.border} ${t.shadow} ${t.hoverShadow} transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between space-y-4`}
              >
                {/* Washi tape pin on top */}
                <div
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 w-14 sm:w-16 h-3 ${t.tape} border border-black/25 dark:border-white/20 shadow-xs rotate-[-1deg] rounded-xs pointer-events-none z-10`}
                  aria-hidden="true"
                />

                {/* Header row */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-dashed border-black/15 dark:border-white/15">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wider border ${t.badgeBg}`}
                    >
                      <span>0{idx + 1}</span>
                    </span>
                    <span className="font-mono text-xs font-black uppercase tracking-wide text-black dark:text-white flex items-center gap-1.5">
                      {renderSkillIcon(group.icon, `w-4 h-4 shrink-0 ${t.iconColor}`)}
                      <span>{group.category}</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 shrink-0">
                    {group.items?.length || 0} tools
                  </span>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2 font-mono text-xs flex-1 items-start">
                  {group.items?.map((item) => (
                    <span
                      key={item}
                      className={`px-3 py-1.5 rounded-xl border border-black/20 dark:border-white/20 bg-white/95 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 font-bold shadow-xs hover:scale-105 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#000] dark:hover:shadow-[2px_2px_0_#fff] transition-all duration-150 flex items-center gap-1.5 select-none ${t.chipHover}`}
                    >
                      <span className={`${t.starColor} text-[10px]`}>✦</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* ── PROFESSIONAL EXPERIENCE: Year-Wise Flight Track & Dossier ── */}
      {personal?.showExperienceSection !== false && (
        <div className="space-y-6 pt-4">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black/15 dark:border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="sketch-stamp bg-amber-400 text-black font-black">
                  {personal?.experienceTitle || "WORK & LEADERSHIP"}
                </span>
                <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
                  [CHRONOLOGICAL TIMELINE]
                </span>
              </div>
              <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
                {personal?.experienceSubtitle || "A chronological flight track of engineering leadership, academic mentorship, and industry contributions."}
              </p>
            </div>
            <ExperienceBriefcaseDoodle />
          </div>

          {/* ── INTERACTIVE VIEW SWITCHER (Current Stations vs Past Milestones) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-1">
            {/* Primary Track Filter: Current Roles first by default */}
            <div className="inline-flex p-1 rounded-2xl bg-stone-100 dark:bg-stone-900 border-2 border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setExpStationFilter("current");
                  setActiveExpYear("all");
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  expStationFilter === "current"
                    ? "bg-emerald-400 text-black shadow-xs font-black scale-102"
                    : "text-stone-600 dark:text-stone-400 hover:text-emerald-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                <span>CURRENT ROLES ({currentExperiences.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpStationFilter("past");
                  setActiveExpYear("all");
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  expStationFilter === "past"
                    ? "bg-amber-400 text-black shadow-xs font-black scale-102"
                    : "text-stone-600 dark:text-stone-400 hover:text-amber-500"
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>PAST MILESTONES ({pastExperiences.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExpStationFilter("all");
                  setActiveExpYear("all");
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  expStationFilter === "all"
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs scale-102"
                    : "text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white"
                }`}
              >
                <span>✦ ALL ({experiencesList.length})</span>
              </button>
            </div>

            {/* Year-Wise Segmented Filter Chips */}
            {expYearsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-mono text-[10px] font-black uppercase text-stone-400 mr-1">
                  YEAR:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveExpYear("all")}
                  className={`px-2.5 py-0.5 rounded-full border font-mono text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeExpYear === "all"
                      ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-xs"
                      : "bg-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-black"
                  }`}
                >
                  ALL
                </button>

                {expYearsList.map((yr) => {
                  const isSelected = activeExpYear === yr;
                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setActiveExpYear(yr)}
                      className={`px-2.5 py-0.5 rounded-full border font-mono text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-amber-400 text-black border-black shadow-xs font-black scale-105"
                          : "bg-white text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-amber-400"
                      }`}
                    >
                      {yr === "Current" ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ) : null}
                      <span>{yr === "Current" ? "NOW" : yr}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chronological Spine Rail */}
          <div className="relative pl-5 sm:pl-8 ml-2 sm:ml-4 border-l-2 sm:border-l-3 border-dashed border-stone-300 dark:border-stone-700/80 space-y-8">
            {filteredExperiences.length === 0 ? (
              expStationFilter === "current" ? (
                /* High-energy fallback when 0 current roles are configured yet */
                <div className="relative rounded-3xl bg-[#fffdfa] dark:bg-[#11131a] border-2 sm:border-3 border-black dark:border-stone-700 shadow-[6px_6px_0_#10b981] p-6 sm:p-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-black uppercase bg-emerald-400 text-black border-2 border-black shadow-[2px_2px_0_#000]">
                      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                      <span>LIVE RADAR &middot; OPEN FOR NEW HORIZONS</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
                      ✦ IIT MADRAS &bull; CHENNAI
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white">
                      Actively Seeking Next Engineering &amp; Research Station
                    </h3>
                    <p className="text-xs sm:text-sm font-sans text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl">
                      Harsh is currently immersed in foundational Machine Learning, exploratory modeling &amp; Python architectures at IIT Madras. Open for Summer 2026 internships, hackathon collaborations, and high-impact engineering roles.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setExpStationFilter("past");
                        setActiveExpYear("all");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 text-black border-2 border-black font-mono text-xs font-black shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Explore Past Milestones &amp; Flight Log ({pastExperiences.length}) &rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExpStationFilter("all");
                        setActiveExpYear("all");
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 text-black dark:text-white border-2 border-black dark:border-white font-mono text-xs font-bold shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                    >
                      <span>✦ View All Historical Roles ({experiencesList.length})</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-700 text-center font-mono text-xs text-stone-500 space-y-3">
                  <p>No roles found for this selected filter ({activeExpYear !== "all" ? `Year ${activeExpYear}` : expStationFilter}).</p>
                  <button
                    type="button"
                    onClick={() => {
                      setExpStationFilter("current");
                      setActiveExpYear("all");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold cursor-pointer"
                  >
                    Reset to Current Roles
                  </button>
                </div>
              )
            ) : (
              filteredExperiences.map((exp, idx) => {
                const yearMatch = exp.period?.match(/\b(20\d{2})\b/);
                const watermarkYear = yearMatch ? yearMatch[1] : (exp.isCurrent ? "NOW" : "EXP");
                const isCurrentRole = isCurrentRoleItem(exp);
                const isFirstPast = expStationFilter === "all" && !isCurrentRole && idx > 0 && isCurrentRoleItem(filteredExperiences[idx - 1]);

                return (
                  <React.Fragment key={exp.id || idx}>
                    {/* Visual Segment Separator when transitioning from Current Roles to Past Milestones */}
                    {isFirstPast && (
                      <div className="pt-4 pb-2 relative -ml-5 sm:-ml-8 flex items-center gap-3">
                        <div className="h-0.5 flex-1 bg-stone-300 dark:bg-stone-700/80 border-b border-dashed border-stone-400 dark:border-stone-600" />
                        <span className="font-mono text-[10.5px] font-black uppercase text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-900 px-3.5 py-1 rounded-full border-2 border-stone-300 dark:border-stone-700 flex items-center gap-1.5 shadow-2xs">
                          <Calendar className="w-3.5 h-3.5 text-stone-500" />
                          <span>Past Milestones &amp; Flight Log</span>
                        </span>
                        <div className="h-0.5 flex-1 bg-stone-300 dark:bg-stone-700/80 border-b border-dashed border-stone-400 dark:border-stone-600" />
                      </div>
                    )}

                    <div className="relative space-y-2">
                      {/* Timeline Radar Node */}
                      <div
                        className={`absolute -left-5 sm:-left-8 -translate-x-1/2 top-5 flex items-center justify-center rounded-full z-10 transition-all ${
                          isCurrentRole
                            ? "h-8 w-8 border-2 sm:border-3 bg-emerald-400 text-black border-black dark:border-white shadow-[0_0_14px_rgba(16,185,129,0.55)] scale-105"
                            : "h-7 w-7 border-2 border-black dark:border-white bg-white dark:bg-stone-800 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-stone-900 dark:text-stone-100 font-black text-xs"
                        }`}
                      >
                        {isCurrentRole ? (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-90" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-black" />
                          </span>
                        ) : (
                          <span>✓</span>
                        )}
                      </div>

                      {/* Executive Dossier Card (100% crisp contrast, no dull opacity wash) */}
                      <div
                        className={
                          isCurrentRole
                            ? "group/expCard relative overflow-hidden rounded-[26px] bg-[#fffdfa] dark:bg-[#0c0e14] border-2 sm:border-3 border-black dark:border-emerald-400 shadow-[6px_6px_0_#10b981] dark:shadow-[6px_6px_0_#059669] p-5 sm:p-7 space-y-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_#000] dark:hover:shadow-[9px_9px_0_#34d399]"
                            : "group/expCard relative overflow-hidden rounded-[26px] bg-[#fffefc] dark:bg-[#11131a] border-2 sm:border-3 border-black dark:border-stone-600 shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#fff] p-5 sm:p-7 space-y-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#000] dark:hover:shadow-[8px_8px_0_#f59e0b]"
                        }
                      >
                        {/* Background Typographic Year Watermark */}
                        <div
                          className={`absolute right-4 -bottom-4 text-7xl sm:text-8xl font-black font-mono tracking-tighter select-none pointer-events-none uppercase ${
                            isCurrentRole
                              ? "text-emerald-500/10 dark:text-emerald-400/15"
                              : "text-stone-900/5 dark:text-stone-100/5"
                          }`}
                          aria-hidden="true"
                        >
                          {watermarkYear}
                        </div>

                        {/* Realistic Washi Tape pinned to top right */}
                        <div
                          className={`absolute -top-1.5 right-8 sm:right-12 rounded-xs pointer-events-none z-10 ${
                            isCurrentRole
                              ? "w-20 sm:w-24 h-3.5 bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 border border-black/40 shadow-xs rotate-[2deg]"
                              : "w-16 sm:w-20 h-3 bg-amber-300/80 dark:bg-amber-400/60 border border-black/30 dark:border-white/20 shadow-xs rotate-[-1.5deg]"
                          }`}
                          aria-hidden="true"
                        />

                        {/* Top Bar: Station Banner, Role Type, Status Marker */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-stone-200 dark:border-stone-800 relative z-10">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Station Pill */}
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-black uppercase border-2 border-black transition-all ${
                                isCurrentRole
                                  ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-black shadow-[2px_2px_0_#000]"
                                  : "bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                              }`}
                            >
                              {isCurrentRole ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                                  <span>ACTIVE STATION &middot; {exp.period}</span>
                                </>
                              ) : (
                                <>
                                  <Calendar className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                                  <span>MILESTONE &middot; {exp.period}</span>
                                </>
                              )}
                            </span>

                            {/* Role Type Tag */}
                            {exp.type && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[11px] font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-2 border-black dark:border-stone-600">
                                ✦ {exp.type}
                              </span>
                            )}
                          </div>

                          {/* Status Marker Pill */}
                          <div className="self-start sm:self-auto shrink-0">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10.5px] font-black uppercase border-2 ${
                                isCurrentRole
                                  ? "bg-black text-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 border-black dark:border-emerald-500 shadow-xs"
                                  : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-400 dark:border-stone-700 shadow-2xs"
                              }`}
                            >
                              {isCurrentRole ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span>⚡ CURRENT MANDATE</span>
                                </>
                              ) : (
                                <span>✓ PAST JOURNEY</span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Title, Organization & Coordinates */}
                        <div className="space-y-1.5 relative z-10">
                          <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-black uppercase text-black dark:text-white tracking-tight leading-tight">
                            {exp.role}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
                            <div
                              className={`flex items-center gap-1.5 font-black ${
                                isCurrentRole
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              <Building2 className="w-4 h-4 shrink-0" />
                              {exp.companyUrl ? (
                                <Link
                                  href={exp.companyUrl.startsWith("http") ? exp.companyUrl : `https://${exp.companyUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline inline-flex items-center gap-1 font-bold"
                                >
                                  <span>{exp.company}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              ) : (
                                <span>{exp.company}</span>
                              )}
                            </div>

                            {exp.location && (
                              <div
                                className="flex items-center gap-1 font-bold text-stone-600 dark:text-stone-400"
                                style={personal?.locationBadgeColor ? { color: personal.locationBadgeColor } : undefined}
                              >
                                <span>•</span>
                                <MapPin
                                  className="w-3.5 h-3.5 text-rose-500 shrink-0"
                                  style={personal?.locationBadgeColor ? { color: personal.locationBadgeColor } : undefined}
                                />
                                <span>{exp.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Two-Column Bento Split: Left Narrative + Right Impact Box */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-1 relative z-10">
                          {/* Left: Role Scope & Description */}
                          <div
                            className={`${
                              exp.highlights && exp.highlights.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
                            } bg-stone-50/90 dark:bg-stone-900/60 rounded-2xl p-4 sm:p-5 border-2 border-stone-200 dark:border-stone-800 space-y-3 flex flex-col justify-between`}
                          >
                            <div className="space-y-2.5">
                              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                                <span className="font-mono text-[11px] font-black uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                                  📋 ROLE MANDATE &amp; SCOPE
                                </span>
                                <div className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
                              </div>
                              {(() => {
                                const desc = (exp.description || "").trim();
                                if (!desc) {
                                  return (
                                    <p className="text-xs sm:text-sm text-stone-500 italic">
                                      No description provided for this mandate.
                                    </p>
                                  );
                                }
                                // Smart bullet / paragraph parser (handles ✦, •, -, or newlines without ugly text jamming)
                                const hasBulletSeparators = desc.includes("✦") || desc.includes("•") || desc.includes("\n");
                                if (hasBulletSeparators) {
                                  const bulletItems = desc
                                    .split(/(?:[✦•\n]+)/)
                                    .map((s) => s.trim().replace(/^[-*•✦]\s*/, ""))
                                    .filter((s) => s.length > 0);
                                  if (bulletItems.length > 1) {
                                    return (
                                      <ul className="space-y-2 pt-0.5">
                                        {bulletItems.map((item, bIdx) => (
                                          <li
                                            key={bIdx}
                                            className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-800 dark:text-stone-200 leading-relaxed font-sans"
                                          >
                                            <span className="shrink-0 mt-1 text-amber-500 dark:text-amber-400 font-black text-xs">
                                              ✦
                                            </span>
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                }
                                return (
                                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                                    {desc}
                                  </p>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Right: Key Deliverables & Impact Box */}
                          {exp.highlights && exp.highlights.length > 0 && (
                            <div
                              className={`lg:col-span-5 rounded-2xl p-4 sm:p-5 border-2 space-y-3 flex flex-col justify-between ${
                                isCurrentRole
                                  ? "bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-emerald-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 border-emerald-300 dark:border-emerald-800 shadow-2xs"
                                  : "bg-gradient-to-br from-amber-50/70 via-stone-50/40 to-amber-50/60 dark:from-stone-900/90 dark:via-stone-900/60 dark:to-stone-900/90 border-amber-200 dark:border-stone-700 shadow-2xs"
                              }`}
                            >
                              <div className="space-y-2.5">
                                <div
                                  className={`flex items-center gap-2 pb-2 border-b ${
                                    isCurrentRole
                                      ? "border-emerald-200/80 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-300"
                                      : "border-amber-200 dark:border-stone-800 text-amber-900 dark:text-amber-300"
                                  }`}
                                >
                                  <span className="font-mono text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    KEY DELIVERABLES &amp; IMPACT
                                  </span>
                                </div>

                                <ul className="space-y-2">
                                  {exp.highlights.map((h, hIdx) => (
                                    <li
                                      key={hIdx}
                                      className="flex items-start gap-2.5 text-xs sm:text-[13px] text-stone-800 dark:text-stone-200 leading-relaxed font-sans"
                                    >
                                      <span
                                        className={`shrink-0 mt-0.5 text-xs font-black ${
                                          isCurrentRole ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"
                                        }`}
                                      >
                                        ✦
                                      </span>
                                      <span>{h}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Skills / Domain Tag Strip */}
                        {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-dashed border-stone-200 dark:border-stone-800 relative z-10">
                            <span className="font-mono text-[10.5px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 mr-1">
                              DOMAIN:
                            </span>
                            {exp.skillsUsed.map((skill) => (
                              <span
                                key={skill}
                                className={`font-mono text-[11px] px-2.5 py-1 rounded-lg border-2 transition-all cursor-default flex items-center gap-1 ${
                                  isCurrentRole
                                    ? "bg-white dark:bg-stone-900 border-black dark:border-emerald-500/50 text-black dark:text-emerald-200 font-bold shadow-[2px_2px_0_#10b981] hover:-translate-y-0.5"
                                    : "bg-white dark:bg-stone-800 border-black dark:border-stone-600 text-black dark:text-white font-bold shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:-translate-y-0.5"
                                }`}
                              >
                                <span className="text-amber-500 font-black">✦</span>
                                <span>{skill}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── TRAJECTORY MILESTONES (Connected Strategic Roadmap) ── */}
      {personal?.showDevelopmentTrajectory !== false && (
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black/15 dark:border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="sketch-stamp bg-emerald-600 text-white font-black">
                  DEVELOPMENT TRAJECTORY
                </span>
                <span className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
                  [MILESTONE ROADMAP]
                </span>
              </div>
              <p className="text-xs font-mono text-stone-600 dark:text-stone-400">
                Connected flight track from core fundamentals to applied systems &amp; modern AI architectures.
              </p>
            </div>
            <TrajectoryArrowDoodle />
          </div>

          {/* Connected Strategic Roadmap Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {timelineMilestones.map((m, idx) => {
              const theme = milestoneThemes[idx % milestoneThemes.length];
              const status = resolveMilestoneStatus(m, idx);

              return (
                <div
                  key={m.phaseNumber || idx}
                  className="relative p-6 rounded-[28px] bg-[#fffdfa] dark:bg-[#13141b] border-2 sm:border-3 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Washi tape sticker */}
                  <div
                    className="absolute -top-1.5 left-8 w-16 h-3 bg-amber-300/80 dark:bg-amber-400/40 border border-black/20 shadow-xs rotate-[-2deg] rounded-xs pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="space-y-3">
                    {/* Header Row: Phase Tag & Status Pill */}
                    <div className="flex items-center justify-between pt-1">
                      <span className={`px-2.5 py-0.5 rounded-lg font-mono text-[10px] font-black uppercase ${theme.badgeBg} border border-black/20`}>
                        PHASE {m.phaseNumber || `0${idx + 1}`}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-black uppercase border shadow-2xs ${status.bg}`}
                        style={status.style}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div>
                      <span className={`font-mono text-xs font-bold ${theme.accentText}`}>
                        {m.period}
                      </span>
                      <h3 className="font-['Space_Grotesk'] font-black text-lg uppercase tracking-tight text-black dark:text-white leading-snug">
                        {m.title}
                      </h3>
                      <p className="text-xs font-mono font-bold text-stone-600 dark:text-stone-400 pt-0.5">
                        {m.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans pt-1 border-t border-dashed border-stone-200 dark:border-stone-800">
                      {m.description}
                    </p>
                  </div>

                  {/* Step Connector Indicator */}
                  <div className="pt-2 flex items-center justify-between font-mono text-[10px] font-black text-stone-400 uppercase">
                    <span>
                      STEP 0{idx + 1} OF {String(timelineMilestones.length).padStart(2, "0")}
                    </span>
                    <span className="text-amber-500">✦ ✦ ✦</span>
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
