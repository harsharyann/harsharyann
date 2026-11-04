"use client"

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react"
import { usePortfolio } from "@/context/PortfolioContext"
import { resolveDailyThoughtColor } from "@/data/portfolioData"

export interface SparkQuote {
  dayIndex: number // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayName: string
  persona: string
  quote: string
  accentColor: string
  bgLight: string
  borderLight: string
  shadowLight: string
  bgDark: string
  borderDark: string
  shadowDark: string
  doodleKind: "sparkle" | "bolt" | "star" | "lightbulb"
}

export const WEEKLY_SPARKS: SparkQuote[] = [
  {
    dayIndex: 0,
    dayName: "Sunday",
    persona: "The Philosopher",
    quote: "Teach machines to learn. Never stop learning yourself.",
    accentColor: "#8b5cf6", // Purple / Indigo
    bgLight: "#f5f3ff",
    borderLight: "#7c3aed",
    shadowLight: "#6d28d9",
    bgDark: "#2e1065",
    borderDark: "#c4b5fd",
    shadowDark: "#8b5cf6",
    doodleKind: "star",
  },
  {
    dayIndex: 1,
    dayName: "Monday",
    persona: "The Dreamer",
    quote: "Every great invention begins with an unreasonable idea.",
    accentColor: "#a855f7", // Purple / Violet
    bgLight: "#faf5ff",
    borderLight: "#9333ea",
    shadowLight: "#7e22ce",
    bgDark: "#3b0764",
    borderDark: "#d8b4fe",
    shadowDark: "#a855f7",
    doodleKind: "sparkle",
  },
  {
    dayIndex: 2,
    dayName: "Tuesday",
    persona: "The Builder",
    quote: "Dreams don't compile themselves. Start building.",
    accentColor: "#f97316", // Orange
    bgLight: "#fff7ed",
    borderLight: "#ea580c",
    shadowLight: "#c2410c",
    bgDark: "#431407",
    borderDark: "#fdba74",
    shadowDark: "#f97316",
    doodleKind: "bolt",
  },
  {
    dayIndex: 3,
    dayName: "Wednesday",
    persona: "The Thinker",
    quote: "Somewhere between logic and imagination, I build.",
    accentColor: "#06b6d4", // Cyan
    bgLight: "#ecfeff",
    borderLight: "#0891b2",
    shadowLight: "#0e7490",
    bgDark: "#083344",
    borderDark: "#67e8f9",
    shadowDark: "#06b6d4",
    doodleKind: "lightbulb",
  },
  {
    dayIndex: 4,
    dayName: "Thursday",
    persona: "The Explorer",
    quote: "Stay curious. The universe has more bugs than features.",
    accentColor: "#10b981", // Emerald / Green
    bgLight: "#ecfdf5",
    borderLight: "#059669",
    shadowLight: "#047857",
    bgDark: "#064e3b",
    borderDark: "#6ee7b7",
    shadowDark: "#10b981",
    doodleKind: "star",
  },
  {
    dayIndex: 5,
    dayName: "Friday",
    persona: "The Creator",
    quote: "Code is how I turn 'what if' into 'what's next'.",
    accentColor: "#ec4899", // Pink
    bgLight: "#fdf2f8",
    borderLight: "#db2777",
    shadowLight: "#be185d",
    bgDark: "#500724",
    borderDark: "#f472b6",
    shadowDark: "#ec4899",
    doodleKind: "sparkle",
  },
  {
    dayIndex: 6,
    dayName: "Saturday",
    persona: "The Rebel",
    quote: "Why follow the blueprint when you can invent one?",
    accentColor: "#eab308", // Yellow / Gold
    bgLight: "#fefce8",
    borderLight: "#ca8a04",
    shadowLight: "#a16207",
    bgDark: "#422006",
    borderDark: "#fde047",
    shadowDark: "#eab308",
    doodleKind: "bolt",
  },
]

/**
 * Hand-drawn Kitty Mascot Doodle (Peeking over the Thought Card)
 */
function KittyPeeker() {
  return (
    <div className="daily-spark-kitty" aria-hidden="true" title="Meow! Time is ticking in Chennai 🐾">
      <svg viewBox="0 0 64 48" width="52" height="39" className="daily-spark-kitty-svg">
        {/* Wagging Kitty Tail */}
        <path
          d="M51 25 C57 19 62 13 58 9 C54 6 48 13 46 21"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
          className="daily-spark-kitty-tail"
        />
        {/* Left Ear */}
        <polygon points="14,18 20,4 28,14" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="16,16 20,7 26,13" fill="#fca5a5" stroke="none" />
        {/* Right Ear */}
        <polygon points="36,14 44,4 50,18" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <polygon points="38,13 44,7 48,16" fill="#fca5a5" stroke="none" />
        {/* Head */}
        <ellipse cx="32" cy="22" rx="19" ry="14" fill="#ffffff" stroke="currentColor" strokeWidth="2.2" />
        {/* Happy curved eyes */}
        <path d="M22 20 Q26 16 30 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M34 20 Q38 16 42 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Blush cheeks */}
        <ellipse cx="20" cy="24" rx="3.5" ry="2.2" fill="#f43f5e" opacity="0.5" />
        <ellipse cx="44" cy="24" rx="3.5" ry="2.2" fill="#f43f5e" opacity="0.5" />
        {/* Tiny nose & mouth */}
        <polygon points="31,23 33,23 32,24.5" fill="#f43f5e" />
        <path d="M32 24.5 Q29.5 27 27 25 M32 24.5 Q34.5 27 37 25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Whiskers */}
        <path d="M12 21 L3 19 M12 24 L2 24 M12 27 L4 29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M52 21 L61 19 M52 24 L62 24 M52 27 L60 29" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        {/* Paws resting on the top edge */}
        <ellipse cx="24" cy="34" rx="5" ry="3.2" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <ellipse cx="40" cy="34" rx="5" ry="3.2" fill="#ffffff" stroke="currentColor" strokeWidth="2" />
        <path d="M22 36 L22 33 M25 36 L25 33 M38 36 L38 33 M41 36 L41 33" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/**
 * Hand-drawn 4-Point Diamond Sparkle SVG
 */
function SparkleIcon({ className = "w-4 h-4", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} fill={color} stroke="none" aria-hidden="true">
      <path d="M0 -12 C1 -4 4 -1 12 0 C4 1 1 4 0 12 C-1 4 -4 1 -12 0 C-4 -1 -1 -4 0 -12 Z" />
    </svg>
  )
}

/**
 * Hand-drawn Comic Star SVG
 */
function StarIcon({ className = "w-4 h-4", color = "#facc15" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-14 -14 28 28" className={className} fill={color} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 -12 L3.2 -3.8 L12 -3.5 L5.2 2 L7.2 11 L0 6 L-7.2 11 L-5.2 2 L-12 -3.5 L-3.2 -3.8 Z" />
    </svg>
  )
}

/**
 * Hand-drawn Comic Lightning Bolt SVG
 */
function BoltIcon({ className = "w-4 h-4", color = "#f59e0b" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-12 -14 24 28" className={className} fill={color} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 -12 L-8 2 L-1 2 L-4 12 L8 -2 L1 -2 Z" />
    </svg>
  )
}

const emptySubscribe = () => () => {}

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener?.("change", callback)
  return () => mq.removeEventListener?.("change", callback)
}

const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function DailySpark({ isDark = false }: { isDark?: boolean }) {
  const { data: portfolio } = usePortfolio()
  const personal = portfolio?.personal

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false)
  const [typedText, setTypedText] = useState<string>("")
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Use stable default (1) during SSR & initial hydration to ensure zero mismatch,
  // then seamlessly sync to the client's actual day of week in useEffect.
  const [currentWeekday, setCurrentWeekday] = useState<number>(1)

  useEffect(() => {
    setCurrentWeekday(new Date().getDay())
  }, [])

  const todaySpark = WEEKLY_SPARKS[currentWeekday] || WEEKLY_SPARKS[1]

  // Check if thoughts list is present in portfolio
  const thoughtsList = portfolio?.dailyThoughts || []
  const todayCustom = thoughtsList.find((t) => t.dayIndex === currentWeekday)

  const activeQuote = todayCustom?.quote || personal?.coverDailyThoughtQuote?.trim() || todaySpark.quote
  const activePersona = todayCustom?.persona || personal?.coverDailyThoughtAuthor?.trim() || todaySpark.persona
  const activeHeader = personal?.coverDailyThoughtHeader?.trim() || "A LITTLE THOUGHT FOR TODAY"
  const activeSignature = personal?.coverDailyThoughtSignature?.trim() || "— Harsh’s Daily Thoughts"

  // Unified active color: Follows the exact color of the active persona (The Thinker / The Creator / etc.)
  const activeColor = resolveDailyThoughtColor(
    currentWeekday,
    todayCustom?.personaColor || personal?.coverPersonaColor
  )

  const displayText = !mounted
    ? activeQuote
    : reducedMotion
    ? activeQuote
    : (typedText || activeQuote)

  // Smooth typewriter animation effect for today's thought
  useEffect(() => {
    if (!mounted || reducedMotion) return

    const fullText = activeQuote
    let idx = 0
    let timer: NodeJS.Timeout

    const startTimer = setTimeout(() => {
      setTypedText("")
      setIsTyping(true)
      timer = setInterval(() => {
        idx++
        setTypedText(fullText.slice(0, idx))
        if (idx >= fullText.length) {
          clearInterval(timer)
          setIsTyping(false)
        }
      }, 22)
    }, 0)

    return () => {
      clearTimeout(startTimer)
      clearInterval(timer)
    }
  }, [mounted, currentWeekday, activeQuote, reducedMotion])

  // Copy quote to clipboard + confetti celebration
  const handleCopyQuote = useCallback(async () => {
    const textToCopy = `"${activeQuote}" ${activeSignature} (${todaySpark.dayName} • ${activePersona})`
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)

      if (!reducedMotion) {
        try {
          const confetti = (await import("canvas-confetti")).default
          confetti({
            particleCount: 22,
            spread: 46,
            origin: { y: 0.82 },
            colors: [activeColor, "#facc15", "#38bdf8", "#f472b6", "#a855f7"],
            disableForReducedMotion: true,
          })
        } catch {
          // graceful fallback
        }
      }
    } catch {
      // clipboard access error fallback
    }
  }, [activeQuote, activeSignature, activePersona, todaySpark.dayName, activeColor, reducedMotion])

  return (
    <section
      className="daily-spark-wrapper"
      aria-label="The Daily Spark — Today's Developer Thought & Live Chennai Coordinates"
    >
      <style>{SPARK_CSS}</style>

      <div
        className="daily-spark-card liquid-bento-card"
        suppressHydrationWarning
        style={
          {
            "--spark-accent": activeColor,
            "--spark-border": isDark ? `${activeColor}80` : activeColor,
            "--spark-shadow": isDark ? `${activeColor}50` : `${activeColor}80`,
          } as React.CSSProperties
        }
      >
        {/* Washi tape sticker detail pinning this note to the sketchbook cover */}
        <div className="daily-spark-tape" aria-hidden="true" />

        {/* Top bar with quick copy button */}
        <div className="daily-spark-top-bar flex justify-end" suppressHydrationWarning>
          {/* Quick copy pill button */}
          <button
            type="button"
            onClick={handleCopyQuote}
            className={`daily-spark-copy-btn ${copied ? "is-copied" : ""}`}
            title="Copy this quote to clipboard"
            aria-label="Copy quote to clipboard"
          >
            {copied ? (
              <>
                <span className="daily-spark-copy-check">✓</span>
                <span>Copied! ✦</span>
              </>
            ) : (
              <>
                <SparkleIcon className="w-3 h-3" color={isDark ? "#ffffff" : "#000000"} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Heading & Persona Header Row */}
        <div className="daily-spark-heading-row">
          <div className="daily-spark-heading-group">
            <span className="daily-spark-twinkle-icon" style={{ color: activeColor }} aria-hidden="true">
              ✦
            </span>
            <h3 className="daily-spark-heading">
              {activeHeader}
            </h3>
            <span className="daily-spark-sparkle-mini" aria-hidden="true">
              <SparkleIcon className="w-3.5 h-3.5" color={activeColor} />
            </span>
          </div>

          {/* Persona Tag (Follows exact active persona color) */}
          {(() => {
            const personaBg = isDark ? `${activeColor}28` : `${activeColor}15`
            const personaTextColor = isDark ? (activeColor === "#000000" ? "#ffffff" : activeColor) : activeColor
            const personaBorderColor = activeColor

            return (
              <div
                className="daily-spark-persona-pill"
                style={{
                  backgroundColor: personaBg,
                  color: personaTextColor,
                  borderColor: personaBorderColor,
                  boxShadow: isDark ? `2px 2px 0 ${activeColor}60` : `2px 2px 0 #000`,
                }}
              >
                <span className="daily-spark-persona-spark" style={{ color: activeColor }} aria-hidden="true">✦</span>
                <span className="daily-spark-persona-text">{activePersona}</span>
              </div>
            );
          })()}
        </div>

        {/* Main Quote Typography */}
        <div className="daily-spark-quote-box" aria-live="polite">
          <span className="daily-spark-quote-mark" style={{ color: activeColor }} aria-hidden="true">
            “
          </span>
          <p className="daily-spark-quote-text">
            {displayText}
            {isTyping && (
              <span className="daily-spark-cursor" style={{ color: activeColor }} aria-hidden="true">
                |
              </span>
            )}
            {!isTyping && (
              <span className="daily-spark-quote-endmark" style={{ color: activeColor }} aria-hidden="true">
                ”
              </span>
            )}
          </p>
        </div>

        {/* Handwritten Subtle Signature */}
        <div className="daily-spark-footer-row">
          <div className="daily-spark-accent-doodle" aria-hidden="true">
            {todaySpark.doodleKind === "bolt" && <BoltIcon className="w-4 h-4" color={activeColor} />}
            {todaySpark.doodleKind === "star" && <StarIcon className="w-4 h-4" color={activeColor} />}
            {todaySpark.doodleKind === "sparkle" && <SparkleIcon className="w-4 h-4" color={activeColor} />}
          </div>

          <div className="daily-spark-signature">
            <span>{activeSignature}</span>
            <span className="daily-spark-sig-star" style={{ color: activeColor }} aria-hidden="true">✦</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const SPARK_CSS = `
.daily-spark-wrapper {
  position: relative;
  z-index: 18;
  width: 100%;
  max-width: 580px;
  margin: clamp(4px, 0.8vh, 8px) auto 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 4px;
}

/* Sketchbook Note Card (Playful, Comic-Inspired, Hand-Drawn) */
.daily-spark-card {
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.50) 100%);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  box-shadow: 3px 3px 0 #000000, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85);
  background-image: none;
  color: #0a0a0a;
  border: 2px solid #000000;
  border-radius: 16px;
  padding: clamp(8px, 1vh, 12px) clamp(12px, 1.4vw, 18px);
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.6vh, 8px);
  transform: rotate(-0.3deg);
  transition: transform 0.22s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.22s ease, border-color 0.2s ease;
  user-select: text;
}

.daily-spark-card:hover {
  transform: rotate(0deg) translateY(-2px);
  box-shadow: 6px 6px 0 #000000;
}

/* Washi Tape Strip on Top Edge */
.daily-spark-tape {
  position: absolute;
  top: -9px;
  left: 50%;
  transform: translateX(-50%) rotate(-0.8deg);
  width: 76px;
  height: 16px;
  background: rgba(254, 240, 138, 0.94);
  border: 1px dashed rgba(0, 0, 0, 0.35);
  border-radius: 2px;
  z-index: 5;
  pointer-events: none;
}

/* Cute Kitty Peeker */
.daily-spark-kitty {
  position: absolute;
  top: -28px;
  right: 18px;
  z-index: 6;
  pointer-events: none;
  color: #000000;
  transition: transform 0.25s cubic-bezier(0.3, 1.4, 0.5, 1);
}

.daily-spark-card:hover .daily-spark-kitty {
  transform: translateY(-4px) rotate(-3deg);
}

.daily-spark-kitty-tail {
  transform-origin: 51px 25px;
  animation: dcf-kitty-wag 2.4s ease-in-out infinite alternate;
}

@keyframes dcf-kitty-wag {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(14deg); }
  100% { transform: rotate(-6deg); }
}

/* Top Bar: Live Coordinates (Green Dot + Location + Day/Date + Live Time) + Copy */
.daily-spark-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-right: 48px; /* Breathing room for peeking kitty */
}

.daily-spark-live-coords {
  display: inline-flex;
  align-items: center;
  gap: 6.5px;
  padding: 4px 12px;
  background: #fffbeb;
  color: #000000;
  border: 1.5px solid #000000;
  border-radius: 999px;
  box-shadow: 2px 2px 0 #f59e0b;
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 850;
  letter-spacing: 0.05em;
  user-select: none;
}

.daily-spark-live-dot {
  width: 6.5px;
  height: 6.5px;
  border-radius: 999px;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: spark-dot-pulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes spark-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.daily-spark-city {
  font-weight: 900;
  color: #ea580c;
  letter-spacing: 0.08em;
}

.daily-spark-sep {
  opacity: 0.4;
  font-weight: 900;
}

.daily-spark-date-text {
  font-weight: 850;
  color: #1f2937;
}

.daily-spark-time-digits {
  font-variant-numeric: tabular-nums;
  font-weight: 900;
  color: #000000;
}

/* Copy button */
.daily-spark-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 9px;
  font-family: ui-monospace, monospace;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: #ffffff;
  color: #000000;
  border: 1.5px solid #000000;
  border-radius: 999px;
  box-shadow: 1.5px 1.5px 0 #000000;
  cursor: pointer;
  user-select: none;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;
}

.daily-spark-copy-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2.5px 2.5px 0 #000000;
  background: #fef08a;
}

.daily-spark-copy-btn.is-copied {
  background: #10b981;
  color: #ffffff;
  border-color: #059669;
  box-shadow: 1.5px 1.5px 0 #047857;
}

.daily-spark-copy-check {
  font-weight: 900;
}

/* Heading & Persona Row */
.daily-spark-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.daily-spark-heading-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  user-select: none;
}

.daily-spark-twinkle-icon {
  color: var(--spark-accent, #8b5cf6);
  font-size: 13px;
  line-height: 1;
  display: inline-block;
  animation: spark-twinkle 2.4s ease-in-out infinite;
}

@keyframes spark-twinkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
  50% { transform: scale(1.35) rotate(18deg); opacity: 1; }
}

.daily-spark-heading {
  margin: 0;
  font-family: 'Patrick Hand', 'Caveat', cursive, sans-serif;
  font-size: 14.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4b5563;
  line-height: 1;
}

.daily-spark-sparkle-mini {
  display: inline-flex;
  align-items: center;
  animation: spark-float 3s ease-in-out infinite alternate;
}

@keyframes spark-float {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-2px) rotate(15deg); }
}

.daily-spark-persona-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border: 1.5px solid #000000;
  border-radius: 999px;
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 850;
  letter-spacing: 0.04em;
  box-shadow: 2px 2px 0 #000000;
  user-select: none;
}

.daily-spark-persona-spark {
  color: var(--spark-accent, #8b5cf6);
  font-size: 12px;
  line-height: 1;
}

/* Quote Box & Typography */
.daily-spark-quote-box {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-height: 28px;
  text-align: left;
}

.daily-spark-quote-mark {
  font-family: "Bodoni Moda", "Iowan Old Style", Georgia, serif;
  font-size: 24px;
  line-height: 0.9;
  font-weight: 900;
  color: var(--spark-accent, #8b5cf6);
  user-select: none;
  flex-shrink: 0;
  margin-top: 1px;
}

.daily-spark-quote-endmark {
  font-family: "Bodoni Moda", "Iowan Old Style", Georgia, serif;
  font-size: 16px;
  line-height: 1;
  font-weight: 900;
  color: var(--spark-accent, #8b5cf6);
  margin-left: 2px;
}

.daily-spark-quote-text {
  margin: 0;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: clamp(12.5px, 1.2vw, 14.5px);
  font-weight: 800;
  line-height: 1.35;
  color: #111827;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

/* Blinking cursor */
.daily-spark-cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 900;
  color: var(--spark-accent, #8b5cf6);
  animation: spark-cursor 0.7s infinite alternate;
}

@keyframes spark-cursor {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

/* Footer row: Signature & Mini doodle */
.daily-spark-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 2px;
}

.daily-spark-accent-doodle {
  display: inline-flex;
  align-items: center;
  opacity: 0.85;
}

.daily-spark-signature {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Caveat', 'Patrick Hand', cursive, sans-serif;
  font-size: 16.5px;
  font-weight: 700;
  color: #4b5563;
  letter-spacing: 0.02em;
  user-select: none;
}

.daily-spark-sig-star {
  color: #f59e0b;
  font-size: 11px;
}

/* Dark Mode Polish */
html.dark .daily-spark-card {
  background: linear-gradient(135deg, rgba(26, 27, 34, 0.70) 0%, rgba(16, 17, 22, 0.55) 100%);
  backdrop-filter: blur(32px) saturate(210%);
  -webkit-backdrop-filter: blur(32px) saturate(210%);
  box-shadow: 4px 4px 0 #ffffff, inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.25);
  background-image: none;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 4px 4px 0 #ffffff;
}

html.dark .daily-spark-card:hover {
  box-shadow: 6px 6px 0 #ffffff;
}

html.dark .daily-spark-tape {
  background: rgba(167, 139, 250, 0.4);
  border-color: rgba(255, 255, 255, 0.35);
}

html.dark .daily-spark-kitty {
  color: #ffffff;
}

html.dark .daily-spark-kitty-svg polygon[fill="#ffffff"],
html.dark .daily-spark-kitty-svg ellipse[fill="#ffffff"] {
  fill: #18181b;
  stroke: #ffffff;
}

html.dark .daily-spark-kitty-tail {
  stroke: #ffffff;
}

html.dark .daily-spark-kitty-svg path {
  stroke: #ffffff;
}

html.dark .daily-spark-live-coords {
  background: #18181b;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 2px 2px 0 #818cf8;
}

html.dark .daily-spark-date-text {
  color: #e5e7eb;
}

html.dark .daily-spark-time-digits {
  color: #ffffff;
}

html.dark .daily-spark-heading {
  color: #9ca3af;
}

html.dark .daily-spark-copy-btn {
  background: #1f2937;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 1.5px 1.5px 0 #ffffff;
}

html.dark .daily-spark-copy-btn:hover {
  background: #374151;
  box-shadow: 2.5px 2.5px 0 #ffffff;
}

html.dark .daily-spark-persona-pill {
  border-color: #ffffff;
  box-shadow: 2px 2px 0 #ffffff;
}

html.dark .daily-spark-quote-text {
  color: #ffffff;
}

html.dark .daily-spark-signature {
  color: #9ca3af;
}

/* Reduced Motion Compliance */
@media (prefers-reduced-motion: reduce) {
  .daily-spark-card,
  .daily-spark-twinkle-icon,
  .daily-spark-sparkle-mini,
  .daily-spark-live-dot,
  .daily-spark-cursor,
  .daily-spark-kitty-tail,
  .daily-spark-copy-btn {
    animation: none !important;
    transition: none !important;
  }
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .daily-spark-wrapper {
    margin: 8px auto 2px;
    padding: 0 2px;
  }

  .daily-spark-card {
    padding: 13px 13px 10px;
    gap: 8px;
    border-radius: 16px 12px 16px 12px;
  }

  .daily-spark-kitty {
    top: -24px;
    right: 12px;
  }

  .daily-spark-kitty-svg {
    width: 42px;
    height: 31px;
  }

  .daily-spark-top-bar {
    padding-right: 36px;
    gap: 6px;
  }

  .daily-spark-live-coords {
    padding: 3px 9px;
    font-size: 10px;
    gap: 5px;
  }

  .daily-spark-heading {
    font-size: 11.5px;
  }

  .daily-spark-persona-pill {
    padding: 2.5px 8px;
    font-size: 10.5px;
  }

  .daily-spark-quote-box {
    min-height: 38px;
  }

  .daily-spark-quote-mark {
    font-size: 24px;
  }

  .daily-spark-quote-text {
    font-size: 13px;
    line-height: 1.4;
  }

  .daily-spark-signature {
    font-size: 14px;
  }
}
`