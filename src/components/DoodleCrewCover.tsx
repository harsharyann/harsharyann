"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { ThemeToggle } from "./ThemeToggle"
import { GithubIcon, LinkedinIcon } from "./SocialIcons"

/**
 * DoodleCrewCover — A high-energy sketchbook cover page for Harsh Aryan.
 * Pure Black & White hand-drawn aesthetic.
 *
 * Features:
 * - Giant dry-brush ink wordmark "HARSH ARYAN" with hand-drawn characters living on the letters
 * - Real-time eye tracking pointer with natural blinking
 * - Clickable characters that hop and speak speech bubbles
 * - Floating black & white ink doodles (stars, bolts, sparkles, flames, paper planes) that scatter from the pointer and pop on click
 * - Interactive hand-drawn line boiling (8 fps hand-drawn animation effect)
 * - Minimalist sketchbook navigation with direct links to portfolio sections (/about, /projects, /certificates, /contact)
 */

// #region pure math helpers
export const hash = (n: number): number => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

export const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v)

export const layoutWord = (
  advances: number[],
  tracking: number,
  fontSize: number
): { x: number[]; w: number[]; width: number } => {
  const x: number[] = []
  const w: number[] = []
  let at = 0
  const gap = (Number.isFinite(tracking) ? tracking : 0) * fontSize
  for (let i = 0; i < advances.length; i++) {
    const a = Number.isFinite(advances[i]) && advances[i] > 0 ? advances[i] : 0
    x.push(at)
    w.push(a)
    at += a + (i < advances.length - 1 ? gap : 0)
  }
  return { x, w, width: Math.max(0, at) }
}

export type Seat = "front" | "top" | "behind"

export const seatPoint = (
  seat: Seat,
  letterX: number,
  letterW: number,
  cap: number,
  offset: number,
  scale: number
): { x: number; y: number } => {
  const x = letterX + letterW * (0.5 + (Number.isFinite(offset) ? offset : 0))
  if (seat === "top") return { x, y: -cap }
  if (seat === "behind") return { x, y: -cap + 30 * scale }
  return { x, y: 0 }
}

export const lookAt = (
  ex: number,
  ey: number,
  tx: number,
  ty: number,
  max: number,
  reach: number
): { x: number; y: number } => {
  const dx = tx - ex
  const dy = ty - ey
  const d = Math.hypot(dx, dy)
  if (!Number.isFinite(d) || d < 1e-6 || max <= 0) return { x: 0, y: 0 }
  const k = (max * Math.min(1, d / Math.max(1e-6, reach))) / d
  return { x: dx * k, y: dy * k }
}

export type Floater = {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  vr: number
  fall: number
  phase: number
  pop: number
}

export const stepFloater = (
  f: Floater,
  dt: number,
  t: number,
  w: number,
  h: number,
  px: number,
  py: number,
  radius: number,
  rand: () => number
): Floater => {
  const step = clamp(Number.isFinite(dt) ? dt : 0, 0, 0.05)
  const m = 40
  if (f.pop > 0) {
    f.pop -= step
    if (f.pop <= 0) {
      f.pop = 0
      f.x = rand() * w
      f.y = -m
      f.vx = 0
      f.vy = f.fall
    }
    return f
  }
  const sway = Math.sin(t * 0.7 + f.phase) * 14
  if (Number.isFinite(px) && Number.isFinite(py) && radius > 0) {
    const dx = f.x - px
    const dy = f.y - py
    const d = Math.hypot(dx, dy)
    if (d < radius && d > 0.01) {
      const k = (1 - d / radius) * (1 - d / radius) * 2400
      f.vx += (dx / d) * k * step
      f.vy += (dy / d) * k * step
      f.vr += (dx > 0 ? 1 : -1) * k * 0.004 * step
    }
  }
  const ease = Math.min(1, step * 2.4)
  f.vx += (sway - f.vx) * ease
  f.vy += (f.fall - f.vy) * ease
  f.vr += (Math.sin(f.phase * 3) * 18 - f.vr) * Math.min(1, step * 0.8)
  f.x += f.vx * step
  f.y += f.vy * step
  f.rot = (f.rot + f.vr * step) % 360
  if (f.y > h + m) {
    f.y = -m
    f.x = rand() * w
  } else if (f.y < -m * 3) {
    f.y = h + m
  }
  if (f.x < -m) f.x = w + m
  else if (f.x > w + m) f.x = -m
  return f
}

export const timeline = (letters: number, crew: number, words: number) => {
  const L = Math.max(0, Math.floor(letters) || 0)
  const C = Math.max(0, Math.floor(crew) || 0)
  const letter = (i: number) => 120 + i * 70
  const crewStart = letter(Math.max(0, L - 1)) + 260
  const member = (j: number) => crewStart + j * 100
  const doodles = crewStart + Math.max(0, C - 1) * 100 * 0.5
  const copy = crewStart + 200
  const word = (k: number) => copy + k * 35
  const actionsStart = word(words) + 100
  const action = (k: number) => actionsStart + k * 90
  return { ground: 40, letter, crewStart, member, doodles, word, action }
}
// #endregion

export type CrewKind = "yeti" | "kid" | "bird" | "cat" | "ghost" | "mushroom"
export type DoodleKind = "flame" | "star" | "heart" | "bolt" | "sparkle" | "spiral" | "plane"

export interface CrewMember {
  kind: CrewKind
  letter: number
  seat?: Seat
  offset?: number
  scale?: number
  flip?: boolean
  name?: string
  says?: string
}

// Option A: Vibrant Neo-Pop Doodle Palette for "HARSH ARYAN"
const LETTER_COLORS = [
  "#FF2A55", // H — Hot Punch Coral Red
  "#FF9500", // A — Electric Sunshine Tangerine
  "#10B981", // R — Mint Emerald Green
  "#8B5CF6", // S — Electric Violet Purple
  "#06B6D4", // H — Neon Cyan Sky
  "transparent", // ' ' space
  "#FF5722", // A — Warm Sunset Tangerine
  "#FBBF24", // R — Warm Golden Amber
  "#3B82F6", // Y — Electric Cobalt Blue
  "#14B8A6", // A — Bright Mint Green
  "#EC4899", // N — Bubblegum Orchid Pink
]

const DARK_LETTER_COLORS = [
  "#FF4D6D", // H — Neon Rose
  "#FFA726", // A — Warm Amber
  "#34D399", // R — Neon Mint
  "#A78BFA", // S — Bright Violet
  "#38BDF8", // H — Electric Cyan
  "transparent", // ' ' space
  "#FB7185", // A — Coral Sunset
  "#FCD34D", // R — Sunshine Yellow
  "#60A5FA", // Y — Neon Blue
  "#2DD4BF", // A — Bright Teal
  "#F472B6", // N — Neon Pink
]

// Default crew arranged across "HARSH ARYAN"
// H (0), A (1), R (2), S (3), H (4), ' ' (5), A (6), R (7), Y (8), A (9), N (10)
const HARSH_CREW: CrewMember[] = [
  { kind: "yeti", letter: 0, seat: "front", offset: -0.28, name: "Bruno", says: "Hey! Harsh here builds cool AI models." },
  { kind: "bird", letter: 2, seat: "top", offset: 0.05, name: "Pip", says: "Check out the projects! Seriously." },
  { kind: "mushroom", letter: 4, seat: "front", offset: 0.15, scale: 0.95, name: "Morel", says: "Curious student, big builder." },
  { kind: "kid", letter: 6, seat: "top", offset: -0.05, name: "Juno", says: "Up here! Welcome to Harsh's world." },
  { kind: "ghost", letter: 8, seat: "behind", offset: 0, name: "Boo", says: "Boo! Machine learning in progress." },
  { kind: "cat", letter: 10, seat: "front", offset: 0.35, flip: true, name: "Patch", says: "Clean code & nice cursor." },
]

const DOODLE_SET: DoodleKind[] = [
  "star", "bolt", "sparkle", "flame", "heart", "plane", "spiral", "star", "bolt", "sparkle",
  "star", "heart", "bolt", "sparkle", "flame", "plane", "star", "spiral"
]

// ---- Black & White Crew Drawings ----
type Eye = { x: number; y: number; r: number; pupil: number; max: number }
type Art = {
  k: number
  box: { l: number; r: number; t: number; b: number }
  eyes: Eye[]
  seat: Seat
  body: (hatch: string) => React.ReactNode
  front?: () => React.ReactNode
  idle?: string
}

const ART: { [k: string]: Art } = {
  yeti: {
    k: 1,
    box: { l: -72, r: 60, t: -140, b: 6 },
    seat: "front",
    eyes: [
      { x: -15, y: -86, r: 8, pupil: 3.6, max: 3.6 },
      { x: 13, y: -88, r: 8, pupil: 3.6, max: 3.6 },
    ],
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="54" ry="5" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" />
        <path d="M-40 -92 C-62 -92 -70 -76 -68 -56 L-66 -30 C-64 -18 -54 -16 -44 -20 Z" fill={hatch} stroke="none" />
        <path className="n" d="M-67 -64 C-58 -59 -50 -59 -43 -64" />
        <path d="M-30 -104 C-40 -112 -44 -124 -40 -138 C-32 -129 -22 -122 -13 -114 Z" />
        <path d="M18 -114 C26 -124 36 -130 47 -133 C45 -120 41 -110 32 -101 Z" />
        <path className="n" d="M-38 -124 L-28 -119 M39 -125 L33 -116" />
        <path d="M-44 -2 C-54 -28 -54 -66 -42 -90 C-32 -110 -14 -118 2 -118 C22 -118 40 -108 48 -88 C58 -64 58 -28 48 -2 C30 4 -26 4 -44 -2 Z" />
        <path d="M40 -96 C54 -66 54 -30 46 -4 C40 -2 34 -1 30 0 C40 -30 42 -64 33 -101 Z" fill={hatch} stroke="none" />
        {/* Cute blush cheeks */}
        <circle className="dcf-blush" cx="-24" cy="-78" r="5.5" />
        <circle className="dcf-blush" cx="22" cy="-78" r="5.5" />
        <path className="n" d="M-7 -117 C-5 -126 1 -128 3 -120 C5 -127 11 -126 11 -116" />
        <path className="n thin" d="M-14 -24 l-3 4 M8 -40 l3 4 M14 -46 l3 3 M20 -30 l3 3" />
        <path className="n" d="M-48 -62 C-22 -50 10 -32 49 -26 M-50 -52 C-24 -40 8 -22 49 -16" />
        <rect x="-12" y="-46" width="15" height="13" rx="2.5" transform="rotate(26 -4.5 -39.5)" />
        <path d="M-46 -60 C-62 -50 -63 -29 -51 -19 C-45 -15 -38 -19 -40 -28 C-43 -36 -40 -46 -36 -52" />
        <path d="M46 -58 C61 -46 61 -26 51 -18 C45 -14 38 -18 40 -26 C43 -34 41 -44 37 -50" />
        <path d="M-37 -2 C-41 -14 -23 -19 -16 -7 C-14 0 -26 4 -37 -2 Z" />
        <path d="M37 -2 C41 -14 23 -19 16 -7 C14 0 26 4 37 -2 Z" />
        <path className="n thin" d="M-30 -4 l1 -4 M-24 -3 l1 -4 M30 -4 l-1 -4 M24 -3 l-1 -4" />
        <path className="n" d="M-23 -98 L-9 -96 M6 -98 L20 -100" />
        <path className="n" d="M-12 -70 C-6 -64 6 -64 12 -71" />
        <path d="M3 -66.5 L5.5 -60 L8 -67.5 Z" />
      </>
    ),
  },
  kid: {
    k: 1.28,
    box: { l: -30, r: 30, t: -88, b: 42 },
    seat: "top",
    eyes: [
      { x: -6, y: -58, r: 0, pupil: 2.5, max: 1.8 },
      { x: 6.5, y: -58, r: 0, pupil: 2.5, max: 1.8 },
    ],
    body: (hatch) => (
      <>
        <path d="M-15 -6 L-3 -6 C-3 8 -5 20 -6 30 L-15 30 C-15 18 -16 6 -15 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" />
        <path d="M3 -6 L15 -6 C17 6 19 16 22 27 L12 30 C10 18 6 6 3 -6 Z" fill={hatch} stroke="none" />
        <path className="k" d="M-17 30 C-20 34 -20 40 -14 41 L-2 41 C2 40 0 34 -5 30 Z" />
        <path className="k" d="M11 29 C8 34 10 40 16 40 L26 38 C29 36 27 30 22 27 Z" />
        <path d="M-20 -4 C-22 -20 -18 -38 -10 -44 L10 -44 C18 -38 22 -20 20 -4 Z" />
        <path className="n thick" d="M-19.5 -14 L19.5 -14 M-18.5 -26 L18.5 -26 M-14 -36 L14 -36" />
        <path className="n" d="M-18 -36 C-28 -28 -30 -14 -26 -5" />
        <circle cx="-26" cy="-3" r="4" />
        <path className="n" d="M18 -36 C27 -30 30 -18 28 -7" />
        <circle cx="28" cy="-4" r="4" />
        <circle cx="-17" cy="-58" r="4" />
        <circle cx="17" cy="-58" r="4" />
        <circle cx="0" cy="-60" r="17" />
        {/* Cute blush cheeks */}
        <circle className="dcf-blush" cx="-10" cy="-54" r="3.2" />
        <circle className="dcf-blush" cx="10" cy="-54" r="3.2" />
        <path className="n thin" d="M-11 -52 l2 -2 M-8 -52 l2 -2 M8 -52 l2 -2 M11 -52 l2 -2" />
        <path className="n" d="M-5 -50 C-2 -47 2 -47 5 -50" />
        <path d="M-15 -70 C-14 -87 14 -87 15 -70 Z" />
        <path d="M-27 -68 C-16 -75 16 -75 27 -68 C18 -63 -18 -63 -27 -68 Z" />
        <path className="n thick" d="M-14.5 -74 C-6 -77 6 -77 14.5 -74" />
        {/* Cute daisy badge on hat */}
        <circle cx="0" cy="-78" r="2.8" fill="#fbbf24" stroke="#000000" strokeWidth="1" />
      </>
    ),
  },
  bird: {
    k: 1.22,
    box: { l: -34, r: 30, t: -62, b: 2 },
    seat: "top",
    eyes: [
      { x: 3, y: -30, r: 4.6, pupil: 2.3, max: 2 },
      { x: 12, y: -31, r: 4.6, pupil: 2.3, max: 2 },
    ],
    idle: "dcf-peck",
    body: (hatch) => (
      <>
        <path className="n" d="M-5 0 L-5 -7 M-9 0 L-1 0 M5 0 L5 -7 M1 0 L9 0" />
        <path d="M-17 -16 C-26 -18 -31 -14 -33 -9 C-26 -10 -20 -8 -15 -10 Z" />
        <path d="M-18 -14 C-20 -30 -10 -40 2 -40 C16 -40 22 -28 20 -16 C18 -6 8 -4 0 -4 C-10 -4 -17 -8 -18 -14 Z" />
        <path d="M-11 -25 C-3 -26 1 -18 -3 -13 C-9 -12 -15 -17 -11 -25 Z" fill={hatch} />
        {/* Cute bird blush cheeks */}
        <circle className="dcf-blush" cx="-3" cy="-24" r="3.2" />
        <circle className="dcf-blush" cx="16" cy="-24" r="3.2" />
        <path className="k" d="M19 -30 L29 -27 L19 -23 Z" />
        <path className="k" d="M-3 -38 L4 -59 L12 -37 Z" />
        <path className="n thin" d="M-1 -44 L10 -46 M1 -51 L8 -52" />
        <circle cx="4" cy="-60" r="3.4" fill="#f43f5e" stroke="#000000" strokeWidth="1.2" />
      </>
    ),
  },
  cat: {
    k: 1.06,
    box: { l: -30, r: 52, t: -110, b: 4 },
    seat: "front",
    eyes: [{ x: 10, y: -76, r: 6, pupil: 2.8, max: 2.6 }],
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="4" cy="2" rx="32" ry="4" />
        <g className="dcf-tail">
          <path d="M18 -4 C42 -4 52 -24 46 -44 C44 -51 36 -53 34 -46 C40 -30 34 -16 16 -14 Z" />
          <path className="n thin" d="M40 -16 l5 4 M45 -30 l6 1 M43 -42 l6 -3" />
        </g>
        <path d="M-22 0 C-28 -18 -24 -42 -14 -52 L14 -52 C24 -42 28 -18 22 0 C10 3 -10 3 -22 0 Z" />
        <path d="M14 -46 C24 -36 26 -16 22 0 C18 1 14 2 12 2 C16 -14 16 -32 10 -46 Z" fill={hatch} stroke="none" />
        <path className="n" d="M-8 -30 L-9 -1 M8 -30 L9 -1" />
        <path d="M-16 1 C-16 -5 -3 -5 -3 1 Z M3 1 C3 -5 16 -5 16 1 Z" />
        <path className="k" d="M-18 -55 C-6 -49 6 -49 18 -55 L17 -46 C6 -40 -6 -40 -17 -46 Z" />
        <path className="k" d="M9 -45 L18 -32 L6 -37 Z" />
        <path d="M-22 -86 L-25 -107 L-7 -96 Z" />
        <path d="M8 -96 L23 -108 L22 -86 Z" />
        {/* Pink inner ears */}
        <path d="M-20 -88 L-22 -102 L-10 -94 Z" fill="#f472b6" opacity="0.6" stroke="none" />
        <path d="M10 -94 L20 -102 L18 -88 Z" fill="#f472b6" opacity="0.6" stroke="none" />
        <path className="n thin" d="M-20 -92 L-21 -101 M18 -101 L18 -92" />
        <path d="M-26 -70 C-28 -88 -16 -98 0 -98 C16 -98 28 -88 26 -70 C24 -56 12 -50 0 -50 C-12 -50 -24 -56 -26 -70 Z" />
        {/* Cute blush cheeks */}
        <circle className="dcf-blush" cx="-16" cy="-68" r="3.8" />
        <circle className="dcf-blush" cx="16" cy="-68" r="3.8" />
        <path className="n thin" d="M-4 -97 L-3 -90 M3 -97 L3 -91" />
        <path className="n" d="M-26 -80 C-14 -83 4 -87 25 -93" />
        <ellipse className="k" cx="-10" cy="-76" rx="7.5" ry="6.5" />
        {/* Tiny star on pirate eyepatch */}
        <circle cx="-10" cy="-76" r="2.2" fill="#fbbf24" stroke="none" />
        <path className="k" d="M-2.5 -68 L2.5 -68 L0 -64.5 Z" />
        <path className="n" d="M0 -64.5 C-1 -60.5 -5 -60.5 -6 -62.5 M0 -64.5 C1 -60.5 5 -60.5 6 -62.5" />
        <path className="n thin" d="M-15 -66 L-29 -68 M-15 -63 L-28 -59 M15 -66 L29 -68 M15 -63 L28 -59" />
      </>
    ),
  },
  ghost: {
    k: 1.3,
    box: { l: -26, r: 26, t: -70, b: 0 },
    seat: "behind",
    eyes: [
      { x: -8, y: -44, r: 6.5, pupil: 3.2, max: 3 },
      { x: 9, y: -44, r: 6.5, pupil: 3.2, max: 3 },
    ],
    idle: "dcf-bob",
    body: (hatch) => (
      <>
        <path d="M-23 -14 L-23 -40 C-23 -59 -12 -67 0 -67 C12 -67 23 -59 23 -40 L23 -14 C12 -10 -12 -10 -23 -14 Z" />
        <path d="M13 -61 C21 -54 23 -46 23 -36 L23 -15 L15 -13 L15 -36 C15 -46 15 -54 13 -61 Z" fill={hatch} stroke="none" />
        <path className="n thin" d="M-16 -56 C-12 -61 -6 -63 -2 -63" />
        {/* Cute ghost blush cheeks */}
        <circle className="dcf-blush" cx="-15" cy="-38" r="3.5" />
        <circle className="dcf-blush" cx="15" cy="-38" r="3.5" />
        <path className="k" d="M-5 -33 C-3 -27 4 -27 6 -33 Z" />
        <path className="n thin" d="M-17 -35 l3 -2 M-14 -34 l3 -2 M14 -35 l3 -2 M17 -34 l3 -2" />
      </>
    ),
    front: () => (
      <>
        <path d="M-25 -32 C-27 -38 -21 -42 -17 -38 C-15 -42 -10 -41 -10 -36 L-11 -30 C-15 -28 -22 -28 -25 -32 Z" />
        <path d="M25 -32 C27 -38 21 -42 17 -38 C15 -42 10 -41 10 -36 L11 -30 C15 -28 22 -28 25 -32 Z" />
      </>
    ),
  },
  mushroom: {
    k: 1.12,
    box: { l: -27, r: 27, t: -56, b: 4 },
    seat: "front",
    eyes: [
      { x: -4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
      { x: 4.5, y: -16, r: 0, pupil: 1.9, max: 1.3 },
    ],
    idle: "dcf-sway",
    body: (hatch) => (
      <>
        <ellipse className="dcf-shadow" cx="0" cy="2" rx="18" ry="3" />
        <path className="n" d="M-10 -15 L-17 -9 M10 -15 L17 -11" />
        <path d="M-10 0 C-12 -10 -10 -22 -8 -28 L8 -28 C10 -22 12 -10 10 0 C4 2 -4 2 -10 0 Z" />
        <path d="M5 -27 C9 -20 11 -10 10 0 C8 1 6 1.5 4 1.5 C6 -8 6 -18 2 -27 Z" fill={hatch} stroke="none" />
        <path className="k" d="M-25 -28 C-27 -45 -12 -55 0 -55 C12 -55 27 -45 25 -28 C14 -23 -14 -23 -25 -28 Z" />
        <circle cx="-12" cy="-40" r="4.2" fill="#ffffff" />
        <circle cx="6" cy="-46" r="3.4" fill="#ffffff" />
        <circle cx="15" cy="-34" r="3" fill="#ffffff" />
        <circle cx="-2" cy="-33" r="2.4" fill="#ffffff" />
        {/* Cute rosy mushroom blush cheeks */}
        <circle className="dcf-blush" cx="-8" cy="-12" r="2.8" />
        <circle className="dcf-blush" cx="8" cy="-12" r="2.8" />
        <path className="n" d="M-2 -10 C-1 -8 1 -8 2 -10" stroke="#000000" />
      </>
    ),
  },
}

/** Dynamic Doodles: Colourful in Light Mode, Crisp B&W in Dark Mode */
const DoodleGraphic = ({ kind, isDark = false }: { kind: DoodleKind; isDark?: boolean }) => {
  if (isDark) {
    switch (kind) {
      case "flame":
        return (
          <>
            <path fill="#ffffff" d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z" />
            <path fill="#0c0c0c" d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z" />
          </>
        )
      case "star":
        return (
          <path
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
            d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z"
          />
        )
      case "heart":
        return (
          <path
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
            d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z"
          />
        )
      case "bolt":
        return (
          <path
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
            d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z"
          />
        )
      case "sparkle":
        return (
          <path
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="1.2"
            d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z"
          />
        )
      case "spiral":
        return <path fill="none" stroke="#ffffff" strokeWidth="2.2" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6" />
      case "plane":
        return (
          <>
            <path fill="#171717" stroke="#ffffff" strokeWidth="2" d="M-13 -1 L13 -10 L4 12 L0 3 Z" />
            <path fill="none" stroke="#ffffff" strokeWidth="1.8" d="M0 3 L13 -10 M0 3 L-2 9 L2 5" />
          </>
        )
    }
  }

  // Light Mode Vibrant Colourful Theme
  switch (kind) {
    case "flame":
      return (
        <>
          <path fill="#f97316" stroke="#000000" strokeWidth="1.2" d="M0 14 C-9 14 -12 6 -10 0 C-8 -5 -4 -6 -4 -12 C1 -9 3 -5 2 -1 C4 -3 5 -6 5 -8 C10 -3 11 4 8 9 C6 12 3 14 0 14 Z" />
          <path fill="#fde047" d="M0 11.5 C-4 11.5 -6 8 -5 5 C-4 2 -1 1 -1 -3 C2 -1 4 3 3 6 C4 5 5 4 5 3 C7 6 5 11.5 0 11.5 Z" />
        </>
      )
    case "star":
      return (
        <path
          fill="#facc15"
          stroke="#000000"
          strokeWidth="1.4"
          d="M0 -13 L3.6 -4.4 L13 -4 L5.8 2.2 L8.2 12 L0 6.6 L-8.2 12 L-5.8 2.2 L-13 -4 L-3.6 -4.4 Z"
        />
      )
    case "heart":
      return (
        <path
          fill="#f43f5e"
          stroke="#000000"
          strokeWidth="1.4"
          d="M0 11 C-6 6 -13 1 -13 -5 C-13 -10 -8 -13 -4 -11 C-2 -10 -1 -8 0 -6 C1 -8 2 -10 4 -11 C8 -13 13 -10 13 -5 C13 1 6 6 0 11 Z"
        />
      )
    case "bolt":
      return (
        <path
          fill="#fbbf24"
          stroke="#000000"
          strokeWidth="1.4"
          d="M3 -14 L-8 2 L-1 2 L-4 14 L8 -3 L1 -3 Z"
        />
      )
    case "sparkle":
      return (
        <path
          fill="#c084fc"
          stroke="#000000"
          strokeWidth="1.4"
          d="M0 -13 C1 -4 4 -1 13 0 C4 1 1 4 0 13 C-1 4 -4 1 -13 0 C-4 -1 -1 -4 0 -13 Z"
        />
      )
    case "spiral":
      return <path fill="none" stroke="#10b981" strokeWidth="2.4" d="M0 0 C2 -2 4 0 3 3 C1 6 -4 5 -5 1 C-6 -4 -1 -8 4 -7 C9 -5 10 2 7 6" />
    case "plane":
      return (
        <>
          <path fill="#38bdf8" stroke="#000000" strokeWidth="2" d="M-13 -1 L13 -10 L4 12 L0 3 Z" />
          <path fill="none" stroke="#0284c7" strokeWidth="1.8" d="M0 3 L13 -10 M0 3 L-2 9 L2 5" />
        </>
      )
  }
}

const DoodleIcon = ({ kind, size = 18, isDark = false }: { kind: DoodleKind; size?: number; isDark?: boolean }) => (
  <svg viewBox="-16 -16 32 32" width={size} height={size} aria-hidden="true" className="shrink-0">
    <DoodleGraphic kind={kind} isDark={isDark} />
  </svg>
)

type Metrics = { advances: number[]; cap: number }
const FONT_SIZE = 190
const DEFAULT_FONT = '"Arial Black", "Inter Display", Inter, -apple-system, sans-serif'

const estimate = (word: string): Metrics => ({
  advances: Array.from(word).map((c) =>
    (c === " " ? 0.42 : /[IJ1]/.test(c) ? 0.42 : /[MW]/.test(c) ? 0.98 : 0.76) * FONT_SIZE
  ),
  cap: 0.73 * FONT_SIZE,
})

const measure = (word: string, family: string): Metrics | null => {
  if (typeof document === "undefined") return null
  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return null
  ctx.font = "900 " + FONT_SIZE + "px " + family
  const chars = Array.from(word)
  const advances: number[] = []
  let prev = 0
  for (let i = 0; i < chars.length; i++) {
    const wNow = ctx.measureText(chars.slice(0, i + 1).join("")).width
    advances.push(wNow - prev)
    prev = wNow
  }
  const m = ctx.measureText(word.replace(/\s/g, "") || "H")
  const cap = m.actualBoundingBoxAscent > 0 ? m.actualBoundingBoxAscent : 0.73 * FONT_SIZE
  return { advances, cap }
}

const useIso = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect

export interface DoodleCrewCoverProps {
  /** The giant stamped wordmark */
  wordmark?: string
  /** Subtitle line right under the giant wordmark */
  tagline?: string
  /** Short intro bio line */
  statement?: string
  crew?: CrewMember[]
  doodles?: DoodleKind[]
  doodleCount?: number
  interactive?: boolean
  className?: string
}

export function DoodleCrewCover({
  wordmark = "HARSH ARYAN",
  tagline = "DESIGN · CODE · MACHINE LEARNING",
  crew = HARSH_CREW,
  doodles = DOODLE_SET,
  doodleCount = 18,
  interactive = true,
  className,
}: DoodleCrewCoverProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const word = wordmark.toUpperCase()
  const chars = React.useMemo(() => Array.from(word), [word])

  // Live ticking clock (Chennai / User Local Time)
  const [currentTime, setCurrentTime] = React.useState<string>("")
  React.useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const svgRef = React.useRef<SVGSVGElement | null>(null)
  const worldRef = React.useRef<HTMLDivElement | null>(null)
  const crewLayerRefs = React.useRef<(SVGGElement | null)[]>([])
  const eyeRefs = React.useRef<{ blink: SVGGElement | null; pupil: SVGGElement | null }[][]>([])
  const doodleRefs = React.useRef<(HTMLDivElement | null)[]>([])

  const [metrics, setMetrics] = React.useState(() => estimate(word))
  const [play] = React.useState(true)
  const [reduced, setReduced] = React.useState(false)
  const [talking, setTalking] = React.useState(-1)
  const [hopping, setHopping] = React.useState(-1)
  const talkTimer = React.useRef(0)

  // Smooth gesture / scroll navigation to Chapter 02 (/about)
  const router = useRouter()
  const isLeavingRef = React.useRef(false)
  const [isLeaving, setIsLeaving] = React.useState(false)

  // Prefetch /about so there is ZERO network latency
  React.useEffect(() => {
    router.prefetch("/about")
  }, [router])

  const triggerLeave = React.useCallback(() => {
    if (isLeavingRef.current) return
    isLeavingRef.current = true
    setIsLeaving(true)
    window.setTimeout(() => {
      router.push("/about")
    }, 280)
  }, [router])

  // Scroll, wheel, swipe gesture listeners for zero-lag page transition
  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (isLeavingRef.current) return
      if (e.deltaY > 20) {
        triggerLeave()
      }
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches[0]) {
        touchStartY = e.touches[0].clientY
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (isLeavingRef.current) return
      if (e.changedTouches[0]) {
        const diffY = touchStartY - e.changedTouches[0].clientY
        if (diffY > 40) {
          triggerLeave()
        }
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (isLeavingRef.current) return
      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.target)) {
        triggerLeave()
      }
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [triggerLeave])

  // Measure font on client
  useIso(() => {
    const run = () => {
      const m = measure(word, DEFAULT_FONT)
      if (m) setMetrics(m)
    }
    run()
    const fonts = typeof document !== "undefined" ? document.fonts : undefined
    if (!fonts) return
    let alive = true
    fonts.ready.then(() => alive && run())
    fonts.addEventListener?.("loadingdone", run)
    return () => {
      alive = false
      fonts.removeEventListener?.("loadingdone", run)
    }
  }, [word])

  const layout = React.useMemo(() => layoutWord(metrics.advances, -0.015, FONT_SIZE), [metrics])
  const cap = metrics.cap

  const placed = React.useMemo(
    () =>
      crew
        .map((m, i) => {
          const art = ART[m.kind]
          if (!art || !chars.length) return null
          const li = clamp(Math.floor(m.letter) || 0, 0, chars.length - 1)
          const scale = (cap / 144) * art.k * (m.scale ?? 1)
          const seat = m.seat || art.seat
          const p = seatPoint(seat, layout.x[li], layout.w[li], cap, m.offset ?? 0, scale)
          return { i, m, art, seat, scale, ...p, flip: m.flip ? -1 : 1 }
        })
        .filter(Boolean) as { i: number; m: CrewMember; art: Art; seat: Seat; scale: number; x: number; y: number; flip: number }[],
    [crew, chars.length, layout, cap]
  )

  const view = React.useMemo(() => {
    let l = 0
    let r = layout.width
    let t = -cap
    let b = 30
    for (const p of placed) {
      const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l]
      l = Math.min(l, p.x + bx[0] * p.scale)
      r = Math.max(r, p.x + bx[1] * p.scale)
      t = Math.min(t, p.y + p.art.box.t * p.scale)
      b = Math.max(b, p.y + p.art.box.b * p.scale)
    }
    const pad = 24
    return { x: l - pad, y: t - pad, w: r - l + pad * 2, h: b - t + pad * 2 }
  }, [layout, placed, cap])

  const words = tagline.split(/\s+/).filter(Boolean)
  const tl = timeline(chars.length, placed.length, words.length)

  const ground = React.useMemo(() => {
    const x0 = view.x + 6
    const x1 = view.x + view.w - 6
    let d = "M" + x0.toFixed(1) + " 6"
    const n = 16
    for (let k = 1; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n
      d +=
        " Q" +
        (x - (x1 - x0) / n / 2).toFixed(1) +
        " " +
        (6 + (hash(k * 3.1) - 0.5) * 5).toFixed(1) +
        " " +
        x.toFixed(1) +
        " " +
        (6 + (hash(k * 7.7) - 0.5) * 2).toFixed(1)
    }
    let tufts = ""
    for (let k = 0; k < 22; k++) {
      const x = x0 + 20 + hash(k * 11.3) * (x1 - x0 - 40)
      const s = 0.7 + hash(k * 5.9) * 0.6
      tufts +=
        "M" +
        x.toFixed(1) +
        " 6 l" +
        (2 * s).toFixed(1) +
        " " +
        (-9 * s).toFixed(1) +
        " M" +
        (x + 3 * s).toFixed(1) +
        " 6 l" +
        (1 * s).toFixed(1) +
        " " +
        (-12 * s).toFixed(1) +
        " M" +
        (x + 6 * s).toFixed(1) +
        " 6 l" +
        (-1 * s).toFixed(1) +
        " " +
        (-7 * s).toFixed(1) +
        " "
    }
    const pebbles = Array.from({ length: 9 }, (_, k) => ({
      x: x0 + 40 + hash(k * 17.1) * (x1 - x0 - 80),
      y: 14 + hash(k * 2.3) * 8,
      r: 2 + hash(k * 9.4) * 2.6,
    }))
    return { d, tufts, pebbles }
  }, [view])

  // Doodles state
  const doodleList = React.useMemo(() => {
    const kinds = doodles.length ? doodles : []
    const n = kinds.length ? clamp(Math.floor(doodleCount) || 0, 0, 30) : 0
    return Array.from({ length: n }, (_, k) => ({
      kind: kinds[k % kinds.length],
      size: 22 + hash(k * 4.7) * 14,
      seed: k,
    }))
  }, [doodles, doodleCount])

  const sim = React.useRef({
    floaters: [] as Floater[],
    w: 0,
    h: 0,
    px: NaN,
    py: NaN,
    inside: false,
    visible: true,
    gaze: [] as { x: number; y: number; tx: number; ty: number; next: number; blinkAt: number; blink: number }[],
    seed: 1,
    start: 0,
  })

  const paintDoodles = () => {
    const s = sim.current
    const k = clamp(s.w / 1100, 0.5, 1)
    for (let i = 0; i < s.floaters.length; i++) {
      const el = doodleRefs.current[i]
      const f = s.floaters[i]
      if (!el || !f) continue
      let sc = k
      let op = 1
      if (f.pop > 0) {
        const age = 1.4 - f.pop
        sc = k * (1 + Math.min(1, age / 0.3) * 0.7)
        op = Math.max(0, 1 - age / 0.3)
      }
      el.style.transform =
        "translate3d(" + f.x.toFixed(1) + "px," + f.y.toFixed(1) + "px,0) rotate(" + f.rot.toFixed(1) + "deg) scale(" + sc.toFixed(3) + ")"
      el.style.opacity = String(op)
    }
  }

  useIso(() => {
    const el = worldRef.current
    if (!el) return
    const s = sim.current
    const size = () => {
      const r = el.getBoundingClientRect()
      const ow = s.w
      const oh = s.h
      s.w = r.width
      s.h = r.height
      const isMobile = r.width < 640
      if (s.floaters.length !== doodleList.length || !ow) {
        s.floaters = doodleList.map((d, k) => ({
          x: (0.04 + 0.92 * ((k + hash(k * 9.1) * 0.8) / Math.max(1, doodleList.length))) * r.width,
          y: (isMobile ? 0.08 + hash(k * 3.3) * 0.82 : 0.02 + hash(k * 3.3) * 0.56) * r.height,
          vx: 0,
          vy: 0,
          rot: (hash(k * 1.7) - 0.5) * 50,
          vr: (hash(k * 6.1) - 0.5) * 30,
          fall: 9 + hash(k * 2.9) * 16,
          phase: hash(k * 8.3) * Math.PI * 2,
          pop: 0,
        }))
      } else if (ow && oh) {
        for (const f of s.floaters) {
          f.x *= r.width / ow
          f.y *= r.height / oh
        }
      }
      paintDoodles()
    }
    size()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(size)
    ro.observe(el)
    return () => ro.disconnect()
  }, [doodleList])

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener?.("change", on)
    return () => mq.removeEventListener?.("change", on)
  }, [])

  // Auto trigger entrance animation
  React.useEffect(() => {
    sim.current.start = performance.now()
  }, [])

  // Living loop: gaze, blinking, doodles, 8fps line boil
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const s = sim.current
    let raf = 0
    let last = performance.now()
    let boilAt = 0
    let boil = 0
    const rand = () => {
      s.seed = (s.seed * 16807) % 2147483647
      return s.seed / 2147483647
    }
    const svgPoint = (svg: SVGSVGElement, cx: number, cy: number) => {
      const m = svg.getScreenCTM()
      if (!m) return null
      const inv = m.inverse()
      return { x: inv.a * cx + inv.c * cy + inv.e, y: inv.b * cx + inv.d * cy + inv.f }
    }
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (!s.visible || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000
      const svg = svgRef.current
      const world = worldRef.current

      // eyes
      let target = null as null | { x: number; y: number }
      if (svg && s.inside && interactive) target = svgPoint(svg, s.px, s.py)
      for (let c = 0; c < placed.length; c++) {
        const p = placed[c]
        const g = (s.gaze[c] ||= { x: 0, y: 0, tx: 0, ty: 0, next: 0, blinkAt: t + 1 + hash(c * 3.7) * 3, blink: 0 })
        if (!target && t > g.next) {
          const other = placed[(c + 1 + Math.floor(rand() * Math.max(1, placed.length - 1))) % placed.length]
          if (other && rand() < 0.45) {
            g.tx = other.x
            g.ty = other.y - 60 * other.scale
          } else {
            g.tx = p.x + (rand() - 0.5) * 900
            g.ty = p.y - 80 * p.scale + (rand() - 0.5) * 500
          }
          g.next = t + 1.4 + rand() * 2.6
        }
        if (t > g.blinkAt) {
          g.blink = 0.16
          g.blinkAt = t + 2.2 + rand() * 4
        }
        g.blink = Math.max(0, g.blink - dt)
        const lid = g.blink > 0 ? 0.12 + (Math.abs(g.blink - 0.08) / 0.08) * 0.88 : 1
        const eyes = eyeRefs.current[c] || []
        for (let e = 0; e < p.art.eyes.length; e++) {
          const eye = p.art.eyes[e]
          const ex = p.x + eye.x * p.scale * p.flip
          const ey = p.y + eye.y * p.scale
          const tx = target ? target.x : g.tx
          const ty = target ? target.y : g.ty
          const o = lookAt(ex, ey, tx, ty, eye.max, 220)
          const ref = eyes[e]
          if (!ref) continue
          const key = "_o" + e
          const prev = (g as unknown as { [k: string]: { x: number; y: number } })[key] || { x: 0, y: 0 }
          const ease = Math.min(1, dt * (target ? 14 : 6))
          const nx = prev.x + (o.x * p.flip - prev.x) * ease
          const ny = prev.y + (o.y - prev.y) * ease
          ;(g as unknown as { [k: string]: { x: number; y: number } })[key] = { x: nx, y: ny }
          if (ref.pupil) ref.pupil.setAttribute("transform", "translate(" + nx.toFixed(2) + " " + ny.toFixed(2) + ")")
          if (ref.blink)
            ref.blink.setAttribute("transform", "translate(0 " + (eye.y * (1 - lid)).toFixed(2) + ") scale(1 " + lid.toFixed(3) + ")")
        }
      }

      // doodles
      if (world && s.floaters.length) {
        const started = play && s.start ? now - s.start > tl.doodles || reduced : false
        if (started) {
          const r = world.getBoundingClientRect()
          const px = s.inside && interactive ? s.px - r.left : NaN
          const py = s.inside && interactive ? s.py - r.top : NaN
          if (!reduced) for (const f of s.floaters) stepFloater(f, dt, t, s.w, s.h, px, py, 110, rand)
          paintDoodles()
        }
      }

      // 8fps line boil
      if (!reduced && now - boilAt > 125) {
        boilAt = now
        boil = (boil + 1) % 3
        const f = "url(#" + uid + "-boil" + boil + ")"
        for (const el of crewLayerRefs.current) if (el) el.setAttribute("filter", f)
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [placed, play, reduced, interactive, uid, tl.doodles])

  React.useEffect(() => () => window.clearTimeout(talkTimer.current), [])

  const onPointerMove = (e: React.PointerEvent) => {
    const s = sim.current
    s.px = e.clientX
    s.py = e.clientY
    s.inside = true
  }
  const onPointerLeave = () => {
    sim.current.inside = false
  }

  const poke = (c: number) => {
    if (!interactive) return
    setTalking(c)
    setHopping(-1)
    requestAnimationFrame(() => setHopping(c))
    window.clearTimeout(talkTimer.current)
    talkTimer.current = window.setTimeout(() => {
      setTalking(-1)
      setHopping(-1)
    }, 2800)
  }

  const popDoodle = (k: number) => {
    if (!interactive) return
    const f = sim.current.floaters[k]
    if (f && f.pop <= 0) {
      f.pop = 1.4
      paintDoodles()
    }
  }

  const hatch = "url(#" + uid + "-hatch)"
  const pct = (v: number, base: number, span: number) => (((v - base) / span) * 100).toFixed(3) + "%"

  const renderCrew = (p: (typeof placed)[number], part: "body" | "front") => (
    <g
      key={p.i + part}
      transform={
        "translate(" + p.x.toFixed(2) + " " + p.y.toFixed(2) + ") scale(" + (p.scale * p.flip).toFixed(4) + " " + p.scale.toFixed(4) + ")"
      }
    >
      <g className={"dcf-arrive dcf-arrive-" + p.seat} style={{ "--d": tl.member(p.i) + "ms" } as React.CSSProperties}>
        <g className={"dcf-hopper" + (hopping === p.i ? " is-hop" : "")}>
          <g className={"dcf-art" + (p.art.idle ? " " + p.art.idle : "")} style={{ "--i": p.i } as React.CSSProperties}>
            {part === "body" ? (
              <>
                {p.art.body(hatch)}
                {p.art.eyes.map((eye, e) => (
                  <g
                    key={e}
                    ref={(el) => {
                      ;(eyeRefs.current[p.i] ||= [])[e] = { ...(eyeRefs.current[p.i]?.[e] || { pupil: null }), blink: el }
                    }}
                  >
                    {eye.r > 0 && <circle cx={eye.x} cy={eye.y} r={eye.r} />}
                    <g
                      ref={(el) => {
                        ;(eyeRefs.current[p.i] ||= [])[e] = { ...(eyeRefs.current[p.i]?.[e] || { blink: null }), pupil: el }
                      }}
                    >
                      <circle className="k" cx={eye.x} cy={eye.y} r={eye.pupil} />
                      <circle className="dcf-glint" cx={eye.x + eye.pupil * 0.35} cy={eye.y - eye.pupil * 0.4} r={eye.pupil * 0.32} />
                    </g>
                  </g>
                ))}
              </>
            ) : (
              p.art.front?.()
            )}
          </g>
        </g>
      </g>
    </g>
  )

  return (
    <div
      ref={rootRef}
      className={`dcf-root ${isLeaving ? "is-leaving" : ""} ${className || ""}`}
      data-play={play || reduced ? "1" : "0"}
      data-interactive={interactive ? "1" : "0"}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <style>{COVER_CSS}</style>

      {/* Top Header Bar with Harsh Aryan stamp, Live Clock, Social Links and Theme Toggle */}
      <header className="dcf-top-bar">
        <div className="dcf-top-inner">
          <div className="dcf-top-left">
            <div className="dcf-brand-stamp">HARSH ARYAN</div>
            <span className="dcf-edition-tag">VOL. 2026 / ED. 01</span>
          </div>

          {/* Center: Live Real-Time Clock */}
          <div className="dcf-time-badge" title="Live Local / Chennai Time">
            <span className="dcf-live-dot" />
            <span className="dcf-time-city">CHENNAI</span>
            <span className="dcf-time-sep">•</span>
            <span className="dcf-time-digits">{currentTime || "07:00:00 AM"}</span>
          </div>

          {/* Right: Social Media Links + Theme Toggle */}
          <div className="dcf-top-actions">
            <div className="dcf-social-group">
              <a
                href="https://github.com/harsharyann"
                target="_blank"
                rel="noopener noreferrer"
                className="dcf-social-link"
                title="GitHub"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="dcf-social-link"
                title="LinkedIn"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="mailto:harsharyan.dev@gmail.com"
                className="dcf-social-link"
                title="Email"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <ThemeToggle showLabel />
          </div>
        </div>
      </header>

      {/* Main Cover Canvas */}
      <main className="dcf-main-canvas" ref={worldRef}>
        {/* Floating Dossier Stickers (Desktop Bottom Flanks) — Repositioned to bottom corners, ZERO overlap with letters */}
        <aside className="dcf-side-flank is-left" aria-label="Current Role Information">
          <div className="dcf-flank-tape" />
          <div className="dcf-flank-header">
            <svg className="dcf-flank-pin-svg" viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M13 2L18 7L15 10L14 9L11 12V15L9 17L8 15H5L3 13L6 10L5 9L8 6L10 7L12 4L11 3L13 2Z" fill="#ff2a55" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M9 17L5 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="dcf-flank-tag">ACTIVE ROLE</span>
          </div>
          <div className="dcf-flank-title">Teaching Assistant</div>
          <div className="dcf-flank-sub">
            @ IIT Madras <span className="dcf-flank-sub-pill">BS Degree</span>
          </div>
          <div className="dcf-flank-status">
            <span className="dcf-flank-dot" />
            <span>Available for Collab</span>
          </div>
        </aside>

        <aside className="dcf-side-flank is-right" aria-label="Portfolio Quick Dossier">
          <div className="dcf-flank-tape is-right-tape" />
          <div className="dcf-flank-header">
            <svg className="dcf-flank-tag-svg" viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M3 10L10 3H17V10L10 17L3 10Z" fill="#fbbf24" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <circle cx="14" cy="6" r="1.5" fill="currentColor" />
            </svg>
            <span className="dcf-flank-tag">DOSSIER METRICS</span>
          </div>
          <div className="dcf-flank-stat-row">
            <span className="dcf-flank-stat-val">6+</span>
            <span className="dcf-flank-stat-lbl">AI &amp; Web Projects</span>
          </div>
          <div className="dcf-flank-stat-row">
            <span className="dcf-flank-stat-val">150+</span>
            <span className="dcf-flank-stat-lbl">DSA &amp; Logic Solved</span>
          </div>
          <div className="dcf-flank-barcode">
            <span className="dcf-flank-bars">||| |||| | | |||| ||</span>
            <span className="dcf-flank-issn">ISSN 2026-AI</span>
          </div>
        </aside>

        {/* Wordmark & Live Doodle Characters Stage */}
        <div className="dcf-stage">
          <h1 className="dcf-sr">HARSH ARYAN</h1>
          <svg
            ref={svgRef}
            className="dcf-svg"
            viewBox={`${view.x.toFixed(1)} ${view.y.toFixed(1)} ${view.w.toFixed(1)} ${view.h.toFixed(1)}`}
            aria-hidden="false"
            role="group"
            aria-label="Harsh Aryan — Doodle Crew Wordmark"
          >
            <defs>
              {/* Pure B&W Cross-hatch pattern */}
              <pattern id={`${uid}-hatch`} width="4.6" height="4.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
                <line x1="0" y1="0" x2="0" y2="4.6" stroke="#000000" strokeWidth="1.25" />
              </pattern>

              {/* Line boil filters */}
              {[0, 1, 2].map((k) => (
                <filter key={k} id={`${uid}-boil${k}`} x="-10%" y="-10%" width="120%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={k * 7 + 3} result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              ))}

              {/* Dry-brush ink stamp filter */}
              <filter id={`${uid}-ink`} x="-4%" y="-6%" width="108%" height="112%">
                <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="3" seed="11" result="edge" />
                <feDisplacementMap in="SourceGraphic" in2="edge" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
                <feTurbulence type="fractalNoise" baseFrequency="0.018 0.32" numOctaves="2" seed="4" result="streak" />
                <feColorMatrix in="streak" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -16 5.6" result="streakA" />
                <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="9" result="speck" />
                <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -24 7.0" result="speckA" />
                <feComposite in="streakA" in2="speckA" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="holes" />
                <feComposite in="rough" in2="holes" operator="out" />
              </filter>
            </defs>

            {/* Behind characters & ground */}
            <g ref={(el) => void (crewLayerRefs.current[0] = el)}>
              <g className="dcf-ground">
                <path className="dcf-draw" pathLength={1} d={ground.d} style={{ "--d": tl.ground + "ms" } as React.CSSProperties} />
                <path className="dcf-tufts dcf-fade" d={ground.tufts} style={{ "--d": tl.ground + 450 + "ms" } as React.CSSProperties} />
                {ground.pebbles.map((pb, k) => (
                  <ellipse key={k} className="dcf-pebble dcf-fade" cx={pb.x} cy={pb.y} rx={pb.r * 1.5} ry={pb.r} style={{ "--d": tl.ground + 550 + "ms" } as React.CSSProperties} />
                ))}
              </g>
              {placed.filter((p) => p.seat === "behind").map((p) => renderCrew(p, "body"))}
            </g>

            {/* Giant Letters stamping down — Option A Neo-Pop Colourful Letters */}
            {chars.map((c, i) =>
              c === " " ? null : (
                <g key={i} className="dcf-letter" style={{ "--d": tl.letter(i) + "ms", "--r": ((hash(i * 2.3) - 0.5) * 8).toFixed(2) + "deg" } as React.CSSProperties}>
                  <g className="dcf-glyph">
                    {/* 3D Comic drop shadow */}
                    <text
                      x={layout.x[i] + 4.5}
                      y={4.5}
                      fontSize={FONT_SIZE}
                      fontWeight={900}
                      style={{ fontFamily: DEFAULT_FONT }}
                      className="dcf-letter-shadow"
                    >
                      {c}
                    </text>
                    {/* Main Vibrant Letter */}
                    <text
                      x={layout.x[i]}
                      y={0}
                      fontSize={FONT_SIZE}
                      fontWeight={900}
                      style={{
                        fontFamily: DEFAULT_FONT,
                        fill: isDark ? DARK_LETTER_COLORS[i % DARK_LETTER_COLORS.length] : LETTER_COLORS[i % LETTER_COLORS.length],
                      }}
                      className="dcf-letter-main"
                      filter={`url(#${uid}-ink)`}
                    >
                      {c}
                    </text>
                  </g>
                  <path
                    className="dcf-dust"
                    d={
                      "M" +
                      (layout.x[i] - 6) +
                      " -6 l-16 -6 M" +
                      (layout.x[i] - 4) +
                      " -16 l-12 -12 M" +
                      (layout.x[i] + layout.w[i] + 6) +
                      " -6 l16 -6 M" +
                      (layout.x[i] + layout.w[i] + 4) +
                      " -16 l12 -12"
                    }
                  />
                </g>
              )
            )}

            {/* Front & top characters */}
            <g ref={(el) => void (crewLayerRefs.current[1] = el)}>
              {placed.filter((p) => p.seat === "behind").map((p) => renderCrew(p, "front"))}
              {placed.filter((p) => p.seat !== "behind").map((p) => renderCrew(p, "body"))}
            </g>

            {/* Click Hitboxes for characters */}
            {interactive &&
              placed.map((p) => {
                const bx = p.flip > 0 ? [p.art.box.l, p.art.box.r] : [-p.art.box.r, -p.art.box.l]
                const top = p.art.box.t
                const bottom = p.seat === "behind" ? -30 : p.art.box.b
                return (
                  <rect
                    key={"hit" + p.i}
                    className="dcf-hit"
                    x={p.x + bx[0] * p.scale}
                    y={p.y + top * p.scale}
                    width={(bx[1] - bx[0]) * p.scale}
                    height={(bottom - top) * p.scale}
                    rx={12}
                    role="button"
                    tabIndex={0}
                    aria-label={(p.m.name || p.m.kind) + (p.m.says ? ": " + p.m.says : "")}
                    onClick={() => poke(p.i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        poke(p.i)
                      }
                    }}
                  />
                )
              })}
          </svg>

          {/* Speech Bubbles on Click */}
          <div className="dcf-bubbles" aria-live="polite">
            {placed.map((p) =>
              talking === p.i && p.m.says ? (
                <div
                  key={p.i}
                  className={"dcf-bubble" + (p.x > view.x + view.w * 0.72 ? " is-left" : "")}
                  style={{
                    left: pct(p.x, view.x, view.w),
                    top: pct(p.y + p.art.box.t * p.scale - 8, view.y, view.h),
                  }}
                >
                  <span className="dcf-bubble-speaker">{p.m.name}:</span> {p.m.says}
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Floating Doodles */}
        {doodleList.length > 0 && (
          <div className="dcf-doodles" aria-hidden="true">
            {doodleList.map((d, k) => (
              <div
                key={k}
                className="dcf-doodle"
                ref={(el) => void (doodleRefs.current[k] = el)}
                style={{ width: d.size, height: d.size, marginLeft: -d.size / 2, marginTop: -d.size / 2 }}
                onPointerDown={() => popDoodle(k)}
              >
                <span className="dcf-doodle-in" style={{ "--d": tl.doodles + k * 65 + "ms" } as React.CSSProperties}>
                  <svg viewBox="-16 -16 32 32" width={d.size} height={d.size}>
                    <DoodleGraphic kind={d.kind} isDark={isDark} />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Hero Headline & Call to Action */}
        <div className="dcf-hero-copy">
          {/* Main Tagline with Sketchbook Squiggle Underline */}
          <div className="dcf-tagline-wrapper">
            <h2 className="dcf-tagline">
              <span className="dcf-tag-word">DESIGN</span>
              <span className="dcf-tag-dot">✦</span>
              <span className="dcf-tag-word">CODE</span>
              <span className="dcf-tag-dot">✦</span>
              <span className="dcf-tag-word">MACHINE LEARNING</span>
            </h2>
            <svg
              className="dcf-squiggle-line"
              viewBox="0 0 320 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M3 8C45 3 95 11 145 6C195 2 245 10 317 6"
                stroke="#000000"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* High-Craft Action Buttons */}
          <div className="dcf-actions dcf-rise" style={{ "--d": "520ms" } as React.CSSProperties}>
            <Link href="/projects" className="dcf-btn is-solid">
              <DoodleIcon kind="bolt" size={16} isDark={isDark} />
              <span>Explore Projects</span>
              <span className="dcf-btn-arrow">↗</span>
            </Link>

            <Link href="/about" className="dcf-btn is-outline">
              <DoodleIcon kind="star" size={16} isDark={isDark} />
              <span>About &amp; Story</span>
            </Link>

            <Link href="/contact" className="dcf-btn is-outline">
              <DoodleIcon kind="plane" size={16} isDark={isDark} />
              <span>Contact Desk</span>
            </Link>
          </div>

          {/* Sleek Bouncing Scroll Indicator */}
          <div className="dcf-scroll-cue dcf-rise" style={{ "--d": "680ms" } as React.CSSProperties}>
            <button
              type="button"
              onClick={triggerLeave}
              className="dcf-scroll-link"
              aria-label="Scroll or tap to open sketchbook"
            >
              <span className="dcf-scroll-label">SCROLL DOWN TO EXPLORE</span>
              <div className="dcf-scroll-arrow-box">
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 2 L8 13 M3 8 L8 13 L13 8" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const COVER_CSS = `
.dcf-root {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  width: 100%;
  min-height: 100svh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  background-image: radial-gradient(rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 24px 24px;
  color: #000000;
  font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Inter, Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  will-change: transform, opacity;
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.38s ease;
}

.dcf-root.is-leaving {
  transform: translate3d(0, -40px, 0);
  opacity: 0;
  pointer-events: none;
}

:where(.dcf-root) *, :where(.dcf-root) *::before, :where(.dcf-root) *::after {
  box-sizing: border-box;
}

:where(.dcf-root) a {
  color: inherit;
  text-decoration: none;
}

:where(.dcf-root) button {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

:where(.dcf-root) h1, :where(.dcf-root) p {
  margin: 0;
  padding: 0;
}

.dcf-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Top bar */
.dcf-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  padding: 18px clamp(16px, 4vw, 40px);
}

.dcf-top-inner {
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.dcf-top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dcf-brand-stamp {
  font-family: ui-monospace, monospace;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: #000000;
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 6px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
  transform: rotate(-1.5deg);
  display: inline-block;
  user-select: none;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.dcf-brand-stamp:hover {
  transform: rotate(0deg) scale(1.04);
}

.dcf-edition-tag {
  font-family: ui-monospace, monospace;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.12em;
  color: #666666;
  text-transform: uppercase;
}

/* Center: Live Real-Time Clock Badge — Styled in the exact same theme as Brand Stamp */
.dcf-time-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 14px;
  background: #000000;
  color: #ffffff;
  border: 2px solid #000000;
  border-radius: 6px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35);
  transform: rotate(1.2deg);
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 850;
  letter-spacing: 0.08em;
  user-select: none;
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.dcf-time-badge:hover {
  transform: rotate(0deg) scale(1.04);
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
}

.dcf-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: dcf-live-pulse 1.8s ease-in-out infinite;
}

@keyframes dcf-live-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.dcf-time-city {
  font-weight: 900;
}

.dcf-time-sep {
  opacity: 0.45;
}

.dcf-time-digits {
  font-variant-numeric: tabular-nums;
  font-weight: 850;
}

/* Right: Actions & Socials */
.dcf-top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dcf-social-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dcf-social-link {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1.5px solid #000000;
  border-radius: 8px;
  background: #ffffff;
  color: #000000;
  box-shadow: 2px 2px 0 #000000;
  transition: transform 0.16s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.16s ease, background-color 0.16s ease;
}

.dcf-social-link:hover {
  transform: translate(-1.5px, -1.5px) rotate(-2deg);
  box-shadow: 3.5px 3.5px 0 #000000;
  background: #facc15;
}

.dcf-social-link:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #000000;
}

/* Side Flanks (Desktop Bottom Flanks) — Repositioned away from letters to avoid collision */
.dcf-side-flank {
  position: absolute;
  bottom: clamp(24px, 4vh, 48px);
  top: auto;
  width: 185px;
  padding: 16px 16px 14px;
  background: #fffdf5;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000000;
  z-index: 20;
  pointer-events: auto;
  user-select: none;
  transition: transform 0.22s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.22s ease;
}

.dcf-side-flank.is-left {
  left: clamp(20px, 3.5vw, 54px);
  transform: rotate(-2deg);
}

.dcf-side-flank.is-left:hover {
  transform: rotate(0deg) translateY(-4px) scale(1.04);
  box-shadow: 6px 6px 0 #000000;
}

.dcf-side-flank.is-right {
  right: clamp(20px, 3.5vw, 54px);
  transform: rotate(2deg);
}

.dcf-side-flank.is-right:hover {
  transform: rotate(0deg) translateY(-4px) scale(1.04);
  box-shadow: 6px 6px 0 #000000;
}

/* Washi tape sticker detail */
.dcf-flank-tape {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(-1deg);
  width: 50px;
  height: 14px;
  background: rgba(254, 240, 138, 0.9);
  border: 1px dashed rgba(0, 0, 0, 0.35);
  border-radius: 2px;
}

.dcf-flank-tape.is-right-tape {
  background: rgba(167, 243, 208, 0.9);
  transform: translateX(-50%) rotate(1.5deg);
}

.dcf-flank-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.dcf-flank-pin-svg,
.dcf-flank-tag-svg {
  flex-shrink: 0;
}

.dcf-flank-tag {
  font-family: ui-monospace, monospace;
  font-size: 9.5px;
  font-weight: 850;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d97706;
}

.dcf-flank-title {
  font-size: 13.5px;
  font-weight: 850;
  line-height: 1.25;
  margin-bottom: 3px;
}

.dcf-flank-sub {
  font-size: 11px;
  color: #555555;
  margin-bottom: 10px;
  line-height: 1.3;
}

.dcf-flank-sub-pill {
  display: inline-block;
  font-size: 9.5px;
  font-weight: 700;
  padding: 1px 6px;
  background: #f1f5f9;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 999px;
  margin-left: 3px;
}

.dcf-flank-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background: #ecfdf5;
  border: 1px solid #059669;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 750;
  color: #065f46;
}

.dcf-flank-dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #10b981;
  animation: dcf-live-pulse 1.8s ease-in-out infinite;
}

.dcf-flank-stat-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
}

.dcf-flank-stat-val {
  font-size: 18px;
  font-weight: 900;
  color: #4f46e5;
}

.dcf-flank-stat-lbl {
  font-size: 11px;
  font-weight: 700;
  color: #444444;
}

.dcf-flank-barcode {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ui-monospace, monospace;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: #666666;
}

.dcf-flank-bars {
  font-weight: 900;
  letter-spacing: 0.05em;
}

/* Light Mode: Colourful Character Fills */
html:not(.dark) .dcf-art[style*="--i: 0"] { fill: #a7f3d0; }
html:not(.dark) .dcf-art[style*="--i: 1"] { fill: #fde047; }
html:not(.dark) .dcf-art[style*="--i: 2"] { fill: #fca5a5; }
html:not(.dark) .dcf-art[style*="--i: 3"] { fill: #bae6fd; }
html:not(.dark) .dcf-art[style*="--i: 4"] { fill: #e9d5ff; }
html:not(.dark) .dcf-art[style*="--i: 5"] { fill: #fed7aa; }

/* Light Mode: Tagline & Squiggle & Button Colors */
html:not(.dark) .dcf-tag-word:nth-of-type(1) { color: #4f46e5; }
html:not(.dark) .dcf-tag-word:nth-of-type(2) { color: #059669; }
html:not(.dark) .dcf-tag-word:nth-of-type(3) { color: #e11d48; }
html:not(.dark) .dcf-tag-dot { color: #f59e0b; }
html:not(.dark) .dcf-squiggle-line path { stroke: #f97316; }

html:not(.dark) .dcf-btn.is-solid {
  background: #4f46e5;
  border-color: #3730a3;
  color: #ffffff;
  box-shadow: 3px 3px 0 #1e1b4b;
}
html:not(.dark) .dcf-btn.is-solid:hover {
  background: #4338ca;
  box-shadow: 5px 5px 0 #1e1b4b;
}

/* Cute blushing cheeks */
.dcf-blush {
  fill: #f43f5e;
  opacity: 0.45;
}

/* Option A 3D Comic drop shadow */
.dcf-letter-shadow {
  fill: #000000;
  opacity: 0.88;
}

/* Dark Mode: Crisp B&W Aesthetic with Radiant Neon Wordmark */
html.dark .dcf-root {
  background-color: #0c0c0e;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px);
  background-size: 24px 24px;
  color: #ffffff;
}

html.dark .dcf-brand-stamp {
  background: #ffffff;
  color: #000000;
  box-shadow: 2px 2px 0 #ffffff;
}

html.dark .dcf-edition-tag {
  color: #aaaaaa;
}

html.dark .dcf-time-badge {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
  box-shadow: 2px 2px 0 #ffffff;
}

html.dark .dcf-time-badge:hover {
  box-shadow: 3px 3px 0 #ffffff;
}

html.dark .dcf-social-link {
  background: #141416;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 2px 2px 0 #ffffff;
}

html.dark .dcf-social-link:hover {
  background: #ffffff;
  color: #000000;
  box-shadow: 3.5px 3.5px 0 #ffffff;
}

html.dark .dcf-side-flank {
  background: #18181b;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 4px 4px 0 #ffffff;
}

html.dark .dcf-side-flank:hover {
  box-shadow: 6px 6px 0 #ffffff;
}

html.dark .dcf-flank-tape {
  background: rgba(250, 204, 21, 0.55);
  border-color: rgba(255, 255, 255, 0.4);
}

html.dark .dcf-flank-tape.is-right-tape {
  background: rgba(52, 211, 153, 0.55);
}

html.dark .dcf-flank-tag {
  color: #fbbf24;
}

html.dark .dcf-flank-sub {
  color: #aaaaaa;
}

html.dark .dcf-flank-sub-pill {
  background: #27272a;
  border-color: rgba(255, 255, 255, 0.2);
  color: #e4e4e7;
}

html.dark .dcf-flank-status {
  background: #064e3b;
  border-color: #10b981;
  color: #a7f3d0;
}

html.dark .dcf-flank-stat-val {
  color: #818cf8;
}

html.dark .dcf-flank-stat-lbl {
  color: #cccccc;
}

html.dark .dcf-flank-barcode {
  border-top-color: rgba(255, 255, 255, 0.2);
  color: #aaaaaa;
}

html.dark .dcf-blush {
  fill: #f472b6;
  opacity: 0.6;
}

html.dark .dcf-letter-shadow {
  fill: #000000;
  opacity: 0.95;
}

html.dark .dcf-svg text:not(.dcf-letter-main):not(.dcf-letter-shadow) {
  fill: #ffffff;
}

html.dark .dcf-art {
  fill: #171717;
  stroke: #ffffff;
}

html.dark .dcf-art .k {
  fill: #ffffff;
}

html.dark .dcf-art .dcf-glint {
  fill: #0c0c0c;
}

html.dark .dcf-art circle[fill="#ffffff"] {
  fill: #171717;
}

html.dark .dcf-ground path {
  stroke: #ffffff;
}

html.dark .dcf-pebble {
  fill: #171717;
  stroke: #ffffff;
}

html.dark .dcf-dust {
  stroke: #ffffff;
}

html.dark .dcf-tagline {
  color: #ffffff;
}

html.dark .dcf-tag-word {
  color: #ffffff !important;
}

html.dark .dcf-tag-dot {
  color: #ffffff !important;
}

html.dark .dcf-squiggle-line path {
  stroke: #ffffff !important;
}

html.dark .dcf-btn.is-solid {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
  box-shadow: 3px 3px 0 #888888;
}

html.dark .dcf-btn.is-solid:hover {
  box-shadow: 5px 5px 0 #ffffff;
}

html.dark .dcf-btn.is-outline {
  background: #141414;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 3px 3px 0 #ffffff;
}

html.dark .dcf-btn.is-outline:hover {
  background: #ffffff;
  color: #000000;
}

html.dark .dcf-bubble {
  background: #141414;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 3px 3px 0 #ffffff;
}

html.dark .dcf-bubble::after {
  background: #141414;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

html.dark .dcf-scroll-label {
  color: #ffffff;
}

html.dark .dcf-scroll-arrow-box {
  background: #141414;
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 2px 2px 0 #ffffff;
}

html.dark .dcf-scroll-link:hover .dcf-scroll-arrow-box {
  background: #ffffff;
  color: #000000;
  box-shadow: 3px 3px 0 #888888;
}

/* Main Canvas */
.dcf-main-canvas {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(16px, 3vw, 40px) clamp(16px, 4vw, 48px) 32px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

/* Eyebrow badge */
.dcf-eyebrow-container {
  margin-bottom: 16px;
  text-align: center;
}

.dcf-eyebrow-pill {
  display: inline-block;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 14px;
  border: 1.5px solid #000000;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 2px 2px 0 #000000;
}

/* SVG stage */
.dcf-stage {
  position: relative;
  z-index: 5;
  width: 100%;
  max-width: 1300px;
}

.dcf-svg {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-select: none;
  overflow: visible;
}

.dcf-svg text:not(.dcf-letter-main):not(.dcf-letter-shadow) {
  fill: #000000;
}

.dcf-art {
  fill: #ffffff;
  stroke: #000000;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dcf-art .n { fill: none; }
.dcf-art .k { fill: #000000; }
.dcf-art .thin { stroke-width: 1.5; }
.dcf-art .thick { stroke-width: 3.4; }
.dcf-art .dcf-glint { fill: #ffffff; stroke: none; }
.dcf-art .dcf-shadow { fill: #000000; stroke: none; opacity: 0.15; }

.dcf-ground path {
  fill: none;
  stroke: #000000;
  stroke-width: 2.4;
  stroke-linecap: round;
}
.dcf-ground .dcf-tufts { stroke-width: 1.8; }
.dcf-pebble { fill: #ffffff; stroke: #000000; stroke-width: 1.6; }
.dcf-dust { fill: none; stroke: #000000; stroke-width: 3; stroke-linecap: round; opacity: 0; }

.dcf-hit {
  fill: transparent;
  stroke: none;
  cursor: pointer;
  outline: none;
}
.dcf-hit:focus-visible {
  stroke: #000000;
  stroke-width: 2.5;
  stroke-dasharray: 6 6;
}

.dcf-glyph {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
.dcf-root[data-interactive='1'] .dcf-glyph:hover {
  animation: dcf-jiggle .6s cubic-bezier(.3,1.5,.5,1);
}

.dcf-art.dcf-bob { animation: dcf-bob 3.2s ease-in-out infinite; }
.dcf-art.dcf-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: dcf-swing 4s ease-in-out infinite; }
.dcf-art.dcf-peck { transform-box: fill-box; transform-origin: 50% 100%; animation: dcf-peck 5.5s ease-in-out infinite; }
.dcf-tail { transform-box: fill-box; transform-origin: 0% 100%; animation: dcf-tail 2.8s ease-in-out infinite; }
.dcf-hopper { transform-box: fill-box; transform-origin: 50% 100%; }
.dcf-hopper.is-hop { animation: dcf-hop .62s cubic-bezier(.3,.7,.4,1); }
.dcf-arrive { transform-box: fill-box; transform-origin: 50% 100%; }

/* Speech bubbles */
.dcf-bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.dcf-bubble {
  position: absolute;
  transform: translate(-50%, -100%) rotate(-2deg);
  transform-origin: 50% 100%;
  background: #ffffff;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 14px;
  padding: 8px 14px;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
  box-shadow: 3px 3px 0 #000000;
  animation: dcf-bubble .32s cubic-bezier(.3,1.6,.5,1) both;
  margin-top: -6px;
}

.dcf-bubble-speaker {
  font-weight: 900;
  text-decoration: underline;
}

.dcf-bubble::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -9px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  transform: translateX(-50%) rotate(45deg) skew(8deg, 8deg);
}

.dcf-bubble.is-left {
  transform: translate(-88%, -100%) rotate(2deg);
  transform-origin: 88% 100%;
}
.dcf-bubble.is-left::after { left: 88%; }

/* Doodles */
.dcf-doodles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;
  overflow: hidden;
}

.dcf-doodle {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: auto;
  cursor: pointer;
  will-change: transform;
  touch-action: manipulation;
}

.dcf-doodle-in {
  display: block;
  width: 100%;
  height: 100%;
}

.dcf-doodle svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.25));
}

/* Hero copy & CTA */
.dcf-hero-copy {
  position: relative;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: clamp(20px, 3.5vw, 36px);
  max-width: 880px;
  width: 100%;
  gap: 16px;
}

/* Tagline */
.dcf-tagline-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.dcf-tagline {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif;
  font-size: clamp(20px, 2.8vw, 32px);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  line-height: 1.2;
}

.dcf-tag-word {
  display: inline-block;
  letter-spacing: 0.06em;
}

.dcf-tag-dot {
  font-size: 14px;
  opacity: 0.6;
}

.dcf-squiggle-line {
  width: clamp(180px, 30vw, 290px);
  height: 10px;
  overflow: visible;
  margin-top: 2px;
}

/* Statement & Academic Pill */
.dcf-statement-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 640px;
}

.dcf-academic-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 14px;
  background: #f5f5f5;
  border: 1.5px solid #000000;
  border-radius: 999px;
  box-shadow: 2px 2px 0 #000000;
}

.dcf-pill-dot {
  width: 6px;
  height: 6px;
  background: #000000;
  border-radius: 999px;
  animation: dcf-pulse 2s infinite ease-in-out;
}

@keyframes dcf-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.dcf-statement-text {
  font-size: clamp(14px, 1.4vw, 15.5px);
  color: #333333;
  line-height: 1.5;
  font-weight: 500;
  text-wrap: balance;
}

/* Action Buttons */
.dcf-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.dcf-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  border: 2px solid #000000;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.18s cubic-bezier(0.3, 1.4, 0.5, 1), box-shadow 0.18s cubic-bezier(0.3, 1.4, 0.5, 1), background-color 0.18s ease;
}

.dcf-btn-arrow {
  font-size: 13px;
  transition: transform 0.2s ease;
}

.dcf-btn:hover .dcf-btn-arrow {
  transform: translate(2px, -2px);
}

.dcf-btn.is-solid {
  background: #000000;
  color: #ffffff;
  box-shadow: 3px 3px 0 #555555;
}

.dcf-btn.is-solid svg path {
  fill: #ffffff;
  stroke: #ffffff;
}

.dcf-btn.is-outline {
  background: #ffffff;
  color: #000000;
  box-shadow: 3px 3px 0 #000000;
}

.dcf-btn:hover {
  transform: translate(-2px, -2px) rotate(-0.8deg);
  box-shadow: 5px 5px 0 #000000;
}

.dcf-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #000000;
  transition-duration: 0.05s;
}

/* Interactive Hint Badge */
.dcf-hint-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #fafafa;
  border: 1.5px dashed #000000;
  border-radius: 999px;
  font-family: ui-monospace, monospace;
  font-size: 11px;
  color: #444444;
  margin-top: 4px;
  max-width: 90%;
  text-wrap: balance;
}

.dcf-hint-bullet {
  font-size: 13px;
}

.dcf-hint-text strong {
  color: #000000;
}

/* Scroll Cue */
.dcf-scroll-cue {
  margin-top: clamp(12px, 2.5vw, 24px);
  display: flex;
  justify-content: center;
}

.dcf-scroll-link {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}

.dcf-scroll-label {
  font-family: ui-monospace, monospace;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #000000;
  transition: opacity 0.2s;
}

.dcf-scroll-arrow-box {
  width: 32px;
  height: 32px;
  border: 1.5px solid #000000;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #ffffff;
  color: #000000;
  box-shadow: 2px 2px 0 #000000;
  transition: transform 0.2s cubic-bezier(0.3, 1.4, 0.5, 1), background-color 0.2s ease, color 0.2s ease;
  animation: dcf-arrow-bob 1.8s ease-in-out infinite;
}

.dcf-scroll-link:hover .dcf-scroll-arrow-box {
  background: #000000;
  color: #ffffff;
  transform: translateY(3px);
  box-shadow: 3px 3px 0 #333333;
}

/* Animations */
.dcf-root[data-play='0'] .dcf-letter,
.dcf-root[data-play='0'] .dcf-arrive,
.dcf-root[data-play='0'] .dcf-word,
.dcf-root[data-play='0'] .dcf-rise,
.dcf-root[data-play='0'] .dcf-fade,
.dcf-root[data-play='0'] .dcf-doodle-in {
  opacity: 0;
}

.dcf-root[data-play='0'] .dcf-draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

.dcf-letter {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}

.dcf-root[data-play='1'] .dcf-letter {
  animation: dcf-stamp .62s cubic-bezier(.2,.8,.25,1.15) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-dust {
  animation: dcf-dust .5s ease-out calc(var(--d) + .22s) both;
}

.dcf-root[data-play='1'] .dcf-draw {
  stroke-dasharray: 1;
  animation: dcf-draw 1.1s cubic-bezier(.6,0,.3,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-fade {
  animation: dcf-fade .6s ease-out var(--d) both;
}

.dcf-root[data-play='1'] .dcf-arrive-front {
  animation: dcf-rise-up .75s cubic-bezier(.3,1.5,.5,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-arrive-top {
  animation: dcf-plop .8s cubic-bezier(.3,.9,.4,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-arrive-behind {
  animation: dcf-peek .9s cubic-bezier(.3,1.4,.5,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-word {
  animation: dcf-word .6s cubic-bezier(.2,.8,.3,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-rise {
  animation: dcf-fadeup .7s cubic-bezier(.2,.8,.3,1) var(--d) both;
}

.dcf-root[data-play='1'] .dcf-doodle-in {
  animation: dcf-fade .6s ease-out var(--d) both;
}

@keyframes dcf-stamp {
  0% { opacity: 0; transform: translateY(-34%) scale(1.28) rotate(var(--r)); }
  55% { opacity: 1; transform: translateY(2%) scale(.95, 1.05) rotate(0deg); }
  75% { transform: translateY(0) scale(1.04, .95); }
  100% { opacity: 1; transform: none; }
}

@keyframes dcf-dust {
  0% { opacity: 0; stroke-dasharray: 0 40; }
  30% { opacity: 0.9; }
  100% { opacity: 0; stroke-dasharray: 14 40; stroke-dashoffset: -16; }
}

@keyframes dcf-draw { to { stroke-dashoffset: 0; } }
@keyframes dcf-fade { from { opacity: 0; } to { opacity: 1; } }

@keyframes dcf-rise-up {
  0% { opacity: 0; transform: translateY(30%) scale(.7, .3); }
  45% { opacity: 1; transform: translateY(-8%) scale(.92, 1.12); }
  70% { transform: translateY(0) scale(1.08, .92); }
  100% { opacity: 1; transform: none; }
}

@keyframes dcf-plop {
  0% { opacity: 0; transform: translateY(-90%); }
  50% { opacity: 1; transform: translateY(0) scale(1.1, .86); }
  68% { transform: translateY(-10%) scale(.96, 1.04); }
  84% { transform: translateY(0) scale(1.03, .97); }
  100% { opacity: 1; transform: none; }
}

@keyframes dcf-peek {
  0% { opacity: 0; transform: translateY(55%); }
  60% { opacity: 1; transform: translateY(-6%); }
  100% { opacity: 1; transform: none; }
}

@keyframes dcf-word {
  from { opacity: 0; transform: translateY(.6em) rotate(3deg); }
  to { opacity: 1; transform: none; }
}

@keyframes dcf-fadeup {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

@keyframes dcf-jiggle {
  0% { transform: none; }
  25% { transform: rotate(-4deg) scale(1.03, .97); }
  50% { transform: rotate(3deg) translateY(-3%); }
  75% { transform: rotate(-1.5deg); }
  100% { transform: none; }
}

@keyframes dcf-hop {
  0% { transform: none; }
  18% { transform: scale(1.12, .84); }
  45% { transform: translateY(-28%) scale(.94, 1.08); }
  72% { transform: translateY(0) scale(1.1, .88); }
  86% { transform: scale(.97, 1.03); }
  100% { transform: none; }
}

@keyframes dcf-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes dcf-swing { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.5deg); } }
@keyframes dcf-peck {
  0%, 62%, 100% { transform: none; }
  66% { transform: rotate(14deg) translateY(2px); }
  70% { transform: none; }
  74% { transform: rotate(12deg) translateY(2px); }
  78% { transform: none; }
}
@keyframes dcf-tail { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-12deg); } }
@keyframes dcf-bubble { from { opacity: 0; scale: .6; } to { opacity: 1; scale: 1; } }

@keyframes dcf-arrow-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

@media (max-width: 1200px), (max-height: 720px) {
  .dcf-side-flank {
    display: none;
  }
}

@media (max-width: 768px) {
  .dcf-time-badge {
    display: none;
  }
  .dcf-edition-tag {
    display: none;
  }
}

@media (max-width: 640px) {
  .dcf-top-bar {
    padding: 12px 14px;
  }

  .dcf-brand-stamp {
    font-size: 12px;
    padding: 4px 10px;
  }

  .dcf-main-canvas {
    padding: 60px 14px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    min-height: 100svh;
    height: 100svh;
    box-sizing: border-box;
  }

  .dcf-stage {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dcf-svg {
    transform: scale(1.22);
    transform-origin: center center;
    overflow: visible;
    width: 96%;
    max-width: 420px;
  }

  .dcf-hit {
    transform: scale(1.2);
    transform-origin: center center;
  }

  .dcf-hero-copy {
    margin-top: 4px;
    gap: 12px;
    max-width: 360px;
    width: 100%;
  }

  /* Centered mobile speech bubble so it never clips off-screen on phones */
  .dcf-bubble {
    position: fixed !important;
    left: 50% !important;
    top: auto !important;
    bottom: 120px !important;
    transform: translateX(-50%) !important;
    width: max-content;
    max-width: calc(100vw - 32px);
    font-size: 13px;
    white-space: normal;
    text-align: center;
    z-index: 50;
  }

  .dcf-bubble::after {
    display: none;
  }

  .dcf-tagline {
    font-size: clamp(17px, 4.8vw, 24px);
    gap: 6px 8px;
  }

  .dcf-tag-dot {
    font-size: 11px;
  }

  .dcf-squiggle-line {
    width: clamp(140px, 45vw, 220px);
  }

  /* Thumb-friendly mobile action buttons */
  .dcf-actions {
    width: 100%;
    max-width: 360px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .dcf-btn.is-solid {
    grid-column: 1 / -1;
  }

  .dcf-btn {
    height: 44px;
    padding: 0 14px;
    font-size: 13px;
    justify-content: center;
  }

  .dcf-scroll-cue {
    margin-top: 6px;
  }

  .dcf-scroll-label {
    font-size: 9.5px;
    letter-spacing: 0.1em;
  }

  .dcf-scroll-arrow-box {
    width: 28px;
    height: 28px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dcf-root *, .dcf-root *::before, .dcf-root *::after {
    animation: none !important;
    transition: none !important;
  }
  .dcf-root .dcf-letter,
  .dcf-root .dcf-arrive,
  .dcf-root .dcf-word,
  .dcf-root .dcf-rise,
  .dcf-root .dcf-fade,
  .dcf-root .dcf-doodle-in {
    opacity: 1 !important;
  }
  .dcf-root .dcf-draw { stroke-dashoffset: 0 !important; }
  .dcf-root .dcf-dust { opacity: 0 !important; }
}
`
