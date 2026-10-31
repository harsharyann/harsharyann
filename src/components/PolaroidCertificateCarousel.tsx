"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Certificate } from "@/data/portfolioData"
import {
  Award,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Lock,
  ExternalLink,
} from "lucide-react"
import {
  formatGoogleDriveImageUrl,
  formatGoogleDriveThumbnailUrl,
  isGoogleDriveUrl,
} from "@/lib/googleDrive"

/**
 * PolaroidCertificateCarousel — Handcrafted Sketchbook Polaroid Line Carousel.
 * Instant certificate prints pegged to a sagging hand-drawn ink string.
 * Visitors can zoom and inspect credentials in-place without accessing Google Drive.
 * Includes anti-screenshot, anti-copy, and print-blocking protections.
 */

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
}

export function stringY(x: number, w: number, y0: number, sag: number): number {
  const t = clamp(x / w, 0, 1)
  return y0 + 4 * sag * t * (1 - t)
}

export function springStep(x: number, v: number, target: number, dt: number, k = 75): [number, number] {
  const c = 2 * Math.sqrt(k)
  const nv = v + (k * (target - x) - c * v) * dt
  return [x + nv * dt, nv]
}

export function swingStep(a: number, w: number, lineVel: number, dt: number, gain: number): [number, number] {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt
  return [clamp(a + nw * dt, -0.6, 0.6), nw]
}

export function nearestAt(off: number, spacing: number, n: number): number {
  return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1))
}

export function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n)
}

export function getCertTheme(category: string) {
  const cat = (category || "").toLowerCase()

  // 1. Machine Learning / AI / Deep Learning: Royal Sapphire & Indigo
  if (cat.includes("machine learning") || cat.includes("deep learning") || cat.includes("ai")) {
    return {
      accent: "#4338ca",
      pegColor: "#c2884a", // Natural oak wood
      pegShadow: "#78350f",
      stamp: "bg-indigo-800 text-white dark:bg-indigo-700 dark:text-white",
      categoryBadge:
        "bg-indigo-50 text-indigo-950 border-indigo-400 dark:bg-indigo-950/70 dark:text-indigo-200 dark:border-indigo-600",
      crestBorder: "border-indigo-600 shadow-[2px_2px_0_#4338ca]",
      crestBg: "bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-indigo-300",
      shadow: "shadow-[6px_6px_0_#1e1b4b] dark:shadow-[6px_6px_0_#6366f1]",
      border: "border-black dark:border-indigo-400/80",
      cardBg:
        "bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 dark:from-stone-900 dark:via-indigo-950/20 dark:to-stone-900",
      accentText: "text-indigo-900 dark:text-indigo-300",
      skillsPill:
        "border-indigo-300 dark:border-indigo-700 bg-white dark:bg-stone-800 text-indigo-950 dark:text-indigo-200 shadow-[1px_1px_0_#4338ca]",
      printShadow: "#1e1b4b",
    }
  }

  // 2. Data Science & Analytics: Academic Emerald / Forest
  if (cat.includes("data") || cat.includes("analytics")) {
    return {
      accent: "#047857",
      pegColor: "#c2884a", // Natural oak wood
      pegShadow: "#78350f",
      stamp: "bg-emerald-800 text-white dark:bg-emerald-700 dark:text-white",
      categoryBadge:
        "bg-emerald-50 text-emerald-950 border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-600",
      crestBorder: "border-emerald-600 shadow-[2px_2px_0_#047857]",
      crestBg: "bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-emerald-300",
      shadow: "shadow-[6px_6px_0_#064e3b] dark:shadow-[6px_6px_0_#34d399]",
      border: "border-black dark:border-emerald-400/80",
      cardBg:
        "bg-gradient-to-br from-emerald-50/40 via-white to-slate-50 dark:from-stone-900 dark:via-emerald-950/20 dark:to-stone-900",
      accentText: "text-emerald-900 dark:text-emerald-300",
      skillsPill:
        "border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-emerald-950 dark:text-emerald-200 shadow-[1px_1px_0_#047857]",
      printShadow: "#064e3b",
    }
  }

  // 3. Programming / Code / Web: Deep Slate / Oceanic Blue
  if (cat.includes("program") || cat.includes("code") || cat.includes("web") || cat.includes("software")) {
    return {
      accent: "#0369a1",
      pegColor: "#c2884a", // Natural oak wood
      pegShadow: "#78350f",
      stamp: "bg-sky-800 text-white dark:bg-sky-700 dark:text-white",
      categoryBadge:
        "bg-sky-50 text-sky-950 border-sky-400 dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-600",
      crestBorder: "border-sky-600 shadow-[2px_2px_0_#0369a1]",
      crestBg: "bg-sky-50 dark:bg-stone-800 text-sky-700 dark:text-sky-300",
      shadow: "shadow-[6px_6px_0_#082f49] dark:shadow-[6px_6px_0_#38bdf8]",
      border: "border-black dark:border-sky-400/80",
      cardBg:
        "bg-gradient-to-br from-sky-50/40 via-white to-slate-50 dark:from-stone-900 dark:via-sky-950/20 dark:to-stone-900",
      accentText: "text-sky-900 dark:text-sky-300",
      skillsPill:
        "border-sky-300 dark:border-sky-700 bg-white dark:bg-stone-800 text-sky-950 dark:text-sky-200 shadow-[1px_1px_0_#0369a1]",
      printShadow: "#082f49",
    }
  }

  // 4. Extra Curricular / Hackathon / Clubs / Leadership: Prestigious Maroon & Warm Gold (Matching IIT Madras Certificate)
  if (
    cat.includes("extra") ||
    cat.includes("caricul") ||
    cat.includes("activity") ||
    cat.includes("club") ||
    cat.includes("lead") ||
    cat.includes("hack")
  ) {
    return {
      accent: "#991b1b", // Academic crimson / maroon
      pegColor: "#c2884a", // Natural warm beech wood
      pegShadow: "#78350f",
      stamp: "bg-red-900 text-white dark:bg-red-800 dark:text-white",
      categoryBadge:
        "bg-amber-50 text-red-950 border-amber-400 dark:bg-red-950/70 dark:text-amber-200 dark:border-amber-600",
      crestBorder: "border-red-800 shadow-[2px_2px_0_#991b1b]",
      crestBg: "bg-amber-50 dark:bg-stone-800 text-red-800 dark:text-red-300",
      shadow: "shadow-[6px_6px_0_#7f1d1d] dark:shadow-[6px_6px_0_#f87171]",
      border: "border-black dark:border-red-400/80",
      cardBg:
        "bg-gradient-to-br from-amber-50/50 via-white to-stone-50 dark:from-stone-900 dark:via-red-950/20 dark:to-stone-900",
      accentText: "text-red-900 dark:text-red-300",
      skillsPill:
        "border-amber-300 dark:border-red-700 bg-white dark:bg-stone-800 text-red-950 dark:text-red-200 shadow-[1px_1px_0_#991b1b]",
      printShadow: "#7f1d1d", // Deep prestige maroon shadow
    }
  }

  // 5. Default / University Laurels: Warm Gold & Oak Bronze
  return {
    accent: "#b45309",
    pegColor: "#c2884a", // Natural warm beech wood
    pegShadow: "#78350f",
    stamp: "bg-amber-600 text-white dark:bg-amber-500 dark:text-black",
    categoryBadge:
      "bg-amber-50 text-amber-950 border-amber-400 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-600",
    crestBorder: "border-amber-600 shadow-[2px_2px_0_#b45309]",
    crestBg: "bg-amber-50 dark:bg-stone-800 text-amber-700 dark:text-amber-300",
    shadow: "shadow-[6px_6px_0_#78350f] dark:shadow-[6px_6px_0_#fbbf24]",
    border: "border-black dark:border-amber-400/80",
    cardBg:
      "bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900",
    accentText: "text-amber-800 dark:text-amber-300",
    skillsPill:
      "border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-amber-950 dark:text-amber-200 shadow-[1px_1px_0_#b45309]",
    printShadow: "#78350f",
  }
}

/**
 * formatVerificationText — Formats the dynamic verification badge text:
 * E.g. "Verified by Coursera", "Verified by IBM", "Verified by College", "Verified by Hackathon",
 * or directly using cert.issuer / fallback.
 */
export function formatVerificationText(cert: Certificate): string {
  if (cert.verificationSource && cert.verificationSource.trim()) {
    const s = cert.verificationSource.trim()
    return s.toLowerCase().startsWith("verified by") ? s : `Verified by ${s}`
  }
  if (cert.issuer && cert.issuer.trim()) {
    const iss = cert.issuer.trim()
    return iss.toLowerCase().startsWith("verified by") ? iss : `Verified by ${iss}`
  }
  return "Verified by Institution"
}

/**
 * SecurityWatermarkOverlay — Subtle, indelible diagonal security watermark pattern.
 * Visible enough to deter screenshot theft & forgeries, subtle enough to inspect clearly.
 */
function SecurityWatermarkOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-25 opacity-15 dark:opacity-25"
      aria-hidden="true"
    >
      <div className="w-full h-full flex flex-col justify-around py-3">
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="whitespace-nowrap font-mono text-[11px] sm:text-xs font-black uppercase tracking-widest text-black dark:text-white select-none -rotate-12 translate-x-[-6%]"
          >
            ✦ HARSH ARYAN CREDENTIALS • HARSH ARYAN CREDENTIALS • HARSH ARYAN CREDENTIALS • HARSH ARYAN CREDENTIALS ✦
          </div>
        ))}
      </div>
    </div>
  )
}

export interface PolaroidCertificateCarouselProps {
  certificates: Certificate[]
  height?: number | string
  cardWidth?: number
  sag?: number
  swing?: number
  autoplay?: number
  className?: string
}

export function PolaroidCertificateCarousel({
  certificates = [],
  height = 550,
  cardWidth = 460,
  sag = 38,
  swing = 1.1,
  autoplay = 6000,
  className = "",
}: PolaroidCertificateCarouselProps) {
  const n = certificates.length
  const [active, setActive] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [size, setSize] = React.useState({ w: 1000, h: 550, cw: cardWidth })

  // --- Zoom Lightbox & Security State ---
  const [zoomModalOpen, setZoomModalOpen] = React.useState(false)
  const [zoomCertIndex, setZoomCertIndex] = React.useState(0)
  const [zoomLevel, setZoomLevel] = React.useState(1)
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = React.useState(false)
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 })
  const [isBlurredOnInactive, setIsBlurredOnInactive] = React.useState(false)
  const [securityToast, setSecurityToast] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const toastTimer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll while zoom modal is open
  React.useEffect(() => {
    if (zoomModalOpen) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [zoomModalOpen])

  const triggerSecurityAlert = React.useCallback((message: string) => {
    setSecurityToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setSecurityToast(null)
    }, 2600)
  }, [])

  const handleSecurityBlock = React.useCallback(
    (e: React.SyntheticEvent, msg = "Direct saving & right-click are restricted to protect credential authenticity.") => {
      e.preventDefault()
      e.stopPropagation()
      triggerSecurityAlert(msg)
    },
    [triggerSecurityAlert]
  )

  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const pathRef = React.useRef<SVGPathElement | null>(null)
  const cards = React.useRef<(HTMLDivElement | null)[]>([])
  const sim = React.useRef({ off: 0, vel: 0, target: 0, a: [] as number[], w: [] as number[] })
  const drag = React.useRef<null | { x: number; off: number; lx: number; lt: number; v: number; moved: boolean }>(null)
  const lastTouch = React.useRef(0)
  const activeRef = React.useRef(0)
  const opts = React.useRef({ sag, swing })
  React.useEffect(() => {
    opts.current = { sag, swing }
  }, [sag, swing])

  const [prevCerts, setPrevCerts] = React.useState(certificates)
  if (prevCerts !== certificates) {
    setPrevCerts(certificates)
    setActive(0)
  }

  // Tighter spacing so adjacent certificates peek into view on the string
  const spacing = Math.round(size.cw * 0.92)

  const goTo = React.useCallback(
    (i: number) => {
      const targetIndex = clamp(i, 0, Math.max(0, n - 1))
      sim.current.target = targetIndex * spacing
    },
    [n, spacing]
  )

  // Reset active when certificate list changes
  React.useEffect(() => {
    activeRef.current = 0
    sim.current.off = 0
    sim.current.target = 0
    sim.current.vel = 0
  }, [certificates])

  // Responsive sizing for wide landscape rectangular prints
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect()
      const maxCw = Math.min(cardWidth, r.width * 0.86)
      const cw = Math.round(Math.max(280, maxCw))
      setSize({ w: r.width, h: r.height, cw })
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [cardWidth])

  React.useEffect(() => {
    sim.current.target = activeRef.current * spacing
    sim.current.off = activeRef.current * spacing
  }, [spacing])

  // Physics animation loop
  React.useEffect(() => {
    let raf = 0
    let last = performance.now()
    const s = sim.current

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.04, (now - last) / 1000)
      last = now

      // Autoplay smooth advancement when not interacting
      if (autoplay > 0 && !drag.current && !zoomModalOpen && now - lastTouch.current > autoplay && n > 1) {
        lastTouch.current = now
        goTo((activeRef.current + 1) % n)
      }

      if (!drag.current) {
        const [no, nv] = springStep(s.off, s.vel, s.target, dt, 68)
        s.off = no
        s.vel = nv
      }

      const cx = size.w / 2
      const y0 = Math.round(size.h * 0.16)
      const sagPx = opts.current.sag

      // Render clothesline string curve
      const p = pathRef.current
      if (p) {
        const d = `M 0 ${y0} Q ${cx} ${y0 + sagPx * 2} ${size.w} ${y0}`
        if (p.getAttribute("d") !== d) p.setAttribute("d", d)
      }

      // Physics positioning for each polaroid print
      for (let i = 0; i < n; i++) {
        const el = cards.current[i]
        if (!el) continue

        const x = cx + (i * spacing - s.off)
        const visible = x > -size.cw && x < size.w + size.cw
        if (!visible) {
          el.style.display = "none"
          continue
        }
        el.style.display = ""

        const y = stringY(x, size.w, y0, sagPx)
        const aTarget = clamp((i * spacing - s.off) * 0.0006, -0.22, 0.22)
        const curA = s.a[i] ?? aTarget
        const curW = s.w[i] ?? 0
        const [na, nw] = swingStep(curA - aTarget, curW, s.vel, dt, opts.current.swing)
        s.a[i] = na + aTarget
        s.w[i] = nw

        const deg = (s.a[i] * 180) / Math.PI
        el.style.transform = `translate3d(${(x - size.cw / 2).toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${deg.toFixed(2)}deg)`
        el.style.zIndex = String(Math.round(100 - Math.abs(x - cx)))
      }

      const nearest = nearestAt(s.off, spacing, n)
      if (nearest !== activeRef.current) {
        activeRef.current = nearest
        setActive(nearest)
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [n, spacing, size, autoplay, goTo, zoomModalOpen])

  // Drag interaction on sagging string
  const onDown = (e: React.PointerEvent) => {
    lastTouch.current = performance.now()
    drag.current = {
      x: e.clientX,
      off: sim.current.off,
      lx: e.clientX,
      lt: performance.now(),
      v: 0,
      moved: false,
    }
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 3) {
      d.moved = true
      setDragging(true)
    }
    const now = performance.now()
    const dt = Math.max(1, now - d.lt)
    d.v = (e.clientX - d.lx) / dt
    d.lx = e.clientX
    d.lt = now
    sim.current.off = d.off - dx
    sim.current.target = sim.current.off
  }

  const openZoomModal = React.useCallback((certIndex: number) => {
    setZoomCertIndex(certIndex)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    setIsPanning(false)
    setIsBlurredOnInactive(false)
    setZoomModalOpen(true)
  }, [])

  const closeZoomModal = React.useCallback(() => {
    setZoomModalOpen(false)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    setIsPanning(false)
  }, [])

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current
    drag.current = null
    lastTouch.current = performance.now()
    if (!d) return
    if (d.moved) {
      setDragging(false)
      sim.current.vel = -d.v * 1000
      goTo(nearestAt(sim.current.off - d.v * 180, spacing, n))
      return
    }
    const card = (e.target as HTMLElement).closest("[data-i]")
    if (card) {
      const idx = Number(card.getAttribute("data-i"))
      if (idx === activeRef.current) {
        // Clicking active card directly opens the interactive zoom inspector!
        openZoomModal(idx)
      } else {
        goTo(idx)
      }
    }
  }

  const step = (dir: number) => {
    lastTouch.current = performance.now()
    goTo(clamp(activeRef.current + dir, 0, n - 1))
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") step(1)
    else if (e.key === "ArrowLeft") step(-1)
    else return
    e.preventDefault()
  }

  // --- Zoom Controls ---
  const handleZoomIn = () => {
    setZoomLevel((prev) => clamp(+(prev + 0.35).toFixed(2), 1, 3.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = clamp(+(prev - 0.35).toFixed(2), 1, 3.5)
      if (next <= 1) setPanOffset({ x: 0, y: 0 })
      return next
    })
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoomLevel((prev) => {
      const next = clamp(+(prev + delta).toFixed(2), 1, 3.5)
      if (next <= 1) setPanOffset({ x: 0, y: 0 })
      return next
    })
  }

  const handlePanDown = (e: React.PointerEvent) => {
    if (zoomLevel <= 1) return
    setIsPanning(true)
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const handlePanMove = (e: React.PointerEvent) => {
    if (!isPanning || zoomLevel <= 1) return
    const maxBound = (zoomLevel - 1) * 380
    const nx = clamp(e.clientX - panStart.x, -maxBound, maxBound)
    const ny = clamp(e.clientY - panStart.y, -maxBound, maxBound)
    setPanOffset({ x: nx, y: ny })
  }

  const handlePanUp = () => {
    setIsPanning(false)
  }

  const stepZoomCert = (dir: number) => {
    const nextIdx = clamp(zoomCertIndex + dir, 0, n - 1)
    setZoomCertIndex(nextIdx)
    goTo(nextIdx)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // --- Keyboard Shortcuts & Anti-Screen-Capture Listeners ---
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Intercept PrintScreen
      if (e.key === "PrintScreen") {
        setIsBlurredOnInactive(true)
        setTimeout(() => setIsBlurredOnInactive(false), 1400)
        triggerSecurityAlert("⚠️ Screenshot restricted: Credential contents are protected.")
        if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Protected Academic Credential — Harsh Aryan Credentials").catch(() => {})
        }
      }

      // 2. Intercept Ctrl+P / Cmd+P (Print to PDF blocker)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault()
        e.stopPropagation()
        triggerSecurityAlert("⚠️ Printing or exporting credentials to PDF is restricted.")
      }

      // 3. Intercept Ctrl+S / Cmd+S (Save webpage/image)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault()
        e.stopPropagation()
        triggerSecurityAlert("⚠️ Direct saving of credential assets is restricted.")
      }

      // 4. Intercept Ctrl+U (View source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault()
        e.stopPropagation()
      }

      // 5. Modal key navigation
      if (zoomModalOpen) {
        if (e.key === "Escape") {
          closeZoomModal()
        } else if (e.key === "ArrowRight") {
          stepZoomCert(1)
        } else if (e.key === "ArrowLeft") {
          stepZoomCert(-1)
        } else if (e.key === "+" || e.key === "=") {
          handleZoomIn()
        } else if (e.key === "-" || e.key === "_") {
          handleZoomOut()
        } else if (e.key === "0") {
          handleResetZoom()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [zoomModalOpen, zoomCertIndex, n, triggerSecurityAlert, closeZoomModal])

  // --- Window Blur Detection (Snipping Tool / Inactive Window Blur) ---
  React.useEffect(() => {
    if (!zoomModalOpen) {
      setIsBlurredOnInactive(false)
      return
    }

    const onBlur = () => {
      setIsBlurredOnInactive(true)
    }

    const onFocus = () => {
      setIsBlurredOnInactive(false)
    }

    window.addEventListener("blur", onBlur)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("focus", onFocus)
    }
  }, [zoomModalOpen])

  const activeCert = certificates[active] || certificates[0]
  const activeTheme = activeCert ? getCertTheme(activeCert.category) : getCertTheme("Machine Learning")
  const zoomCert = certificates[zoomCertIndex] || activeCert

  if (!certificates.length) {
    return (
      <div className="sketch-box p-12 text-center font-mono text-sm">
        No certificates found in this category.
      </div>
    )
  }

  return (
    <div
      className={`space-y-6 ${className}`}
      onContextMenu={(e) => handleSecurityBlock(e, "Right-click is disabled to protect credentials.")}
    >
      {/* Floating Security Alert Toast */}
      {securityToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100000] px-4 py-2.5 rounded-full bg-black/95 text-white dark:bg-white dark:text-black font-mono text-xs font-bold border-2 border-amber-400 shadow-[0_6px_25px_rgba(0,0,0,0.4)] flex items-center gap-2 animate-pulse">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* Sagging String Stage */}
      <div
        ref={rootRef}
        className={`pl-cert-root select-none transition-opacity duration-200 ${
          zoomModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
          ["--pl-cw" as string]: `${size.cw}px`,
        }}
        data-drag={dragging ? "1" : "0"}
        role="region"
        aria-roledescription="carousel"
        aria-label="Certificates pegged on a line"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onContextMenu={(e) => handleSecurityBlock(e)}
      >
        <style>{POLAROID_CSS}</style>

        {/* The Sagging String with Brass Wall Mount Studs */}
        <svg className="pl-cert-string" aria-hidden="true">
          <path
            ref={pathRef}
            fill="none"
            stroke="#18181b"
            className="dark:stroke-zinc-300"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Wall Mount Studs on the left and right */}
          <circle cx="10" cy={size.h * 0.16} r="5" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
          <circle cx={size.w - 10} cy={size.h * 0.16} r="5" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
        </svg>

        {/* Floating Navigation Controls on the Clothesline */}
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goTo((active - 1 + n) % n)
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white dark:bg-stone-900 border-2 border-black dark:border-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] hover:-translate-y-0.5 hover:bg-amber-100 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center group"
              title="Previous Certificate"
              aria-label="Previous Certificate"
            >
              <ChevronLeft className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goTo((active + 1) % n)
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-white dark:bg-stone-900 border-2 border-black dark:border-white shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] hover:-translate-y-0.5 hover:bg-amber-100 dark:hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center group"
              title="Next Certificate"
              aria-label="Next Certificate"
            >
              <ChevronRight className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Hanging Polaroid Certificate Prints */}
        {certificates.map((cert, i) => {
          const isCurrent = i === active
          const theme = getCertTheme(cert.category)

          return (
            <div
              key={cert.id}
              className="pl-cert-card"
              data-i={i}
              data-on={isCurrent ? "1" : "0"}
              ref={(el) => void (cards.current[i] = el)}
              aria-hidden={isCurrent ? undefined : true}
            >
              {/* Polaroid Landscape Rectangular Paper Frame */}
              <div
                className="pl-cert-print select-none"
                style={{
                  boxShadow: isCurrent
                    ? `0 20px 38px -10px rgba(0, 0, 0, 0.35), 6px 10px 0 ${theme.printShadow || "#18181b"}`
                    : undefined,
                }}
              >
                {/* Certificate Emblem Parchment View OR Certificate Photo Image */}
                <div className="pl-cert-shot relative overflow-hidden">
                  {cert.imageUrl ? (
                    <div className="relative w-full h-full bg-[#0a0d14] dark:bg-[#05070c] rounded-lg overflow-hidden flex flex-col justify-between">
                      {/* Subtle dark museum matboard texture */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: "radial-gradient(#ffffff 0.6px, transparent 0.6px)",
                          backgroundSize: "10px 10px",
                        }}
                      />
                      <img
                        src={formatGoogleDriveImageUrl(cert.imageUrl)}
                        alt={cert.title}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-2 select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
                        onError={(e) => {
                          const target = e.currentTarget
                          if (!target.dataset.triedFallback && isGoogleDriveUrl(cert.imageUrl)) {
                            target.dataset.triedFallback = "true"
                            target.src = formatGoogleDriveThumbnailUrl(cert.imageUrl)
                          } else {
                            ;(target as HTMLElement).style.display = "none"
                          }
                        }}
                      />

                      {/* Number tag — Sleek Frosted Badge */}
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-amber-400 font-mono text-[9px] font-black uppercase tracking-wider border border-white/20 shadow-sm select-none">
                        #{i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </div>

                      {/* Zoom Indicator Button on Active Card — Golden Metallic Pill */}
                      {isCurrent && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openZoomModal(i)
                          }}
                          className="absolute top-2 right-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[2px_2px_0_#000] transition-all hover:scale-105 active:scale-95 cursor-pointer z-20"
                          title="Click to Zoom & Inspect"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Zoom</span>
                        </button>
                      )}

                      {/* Category tag — Elegant Dark Foil Ribbon */}
                      <div
                        className="absolute bottom-2 left-4 right-4 text-center py-0.5 rounded-full font-mono text-[9px] font-black uppercase tracking-widest truncate border shadow-md bg-black/85 text-amber-300 backdrop-blur-md border-amber-400/40"
                      >
                        ✦ {cert.category} ✦
                      </div>

                      {/* Transparent Anti-Drag Shield */}
                      <div
                        className="absolute inset-0 z-10 select-none pointer-events-auto"
                        onContextMenu={(e) => handleSecurityBlock(e)}
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                  ) : (
                    <div className="pl-cert-parchment">
                      {/* Inner Certificate Border */}
                      <div className="pl-cert-border">
                        <div className="flex items-center justify-between w-full pb-1 border-b border-white/20 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                          <span>CERT #{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                          <span className="font-black text-white">{cert.issueDate}</span>
                        </div>

                        {/* Laurel Crest Emblem with Category Color */}
                        <div className="my-auto text-center space-y-1 py-1">
                          <div
                            className={`inline-block p-2 rounded-full border-2 border-white/40 ${theme.crestBorder} ${theme.crestBg}`}
                          >
                            <Award className="w-6 h-6 text-amber-400" />
                          </div>
                          <div className="font-mono text-[9px] font-black uppercase tracking-widest text-amber-300 block truncate max-w-[200px]">
                            {formatVerificationText(cert)}
                          </div>
                          <div className="font-bold text-xs uppercase line-clamp-1 text-white px-1">
                            {cert.issuer}
                          </div>
                        </div>

                        {/* Category tag at bottom of photo area */}
                        <div
                          className="w-full text-center py-0.5 rounded-full font-mono text-[8.5px] font-black uppercase tracking-wider truncate border border-amber-400/40 bg-black/60 text-amber-300"
                        >
                          {cert.category}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hand-written Polaroid Caption Area */}
                <div className="pl-cert-note">
                  <span className="truncate block font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 uppercase tracking-tight font-mono">
                    {cert.title}
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 block truncate font-mono font-bold flex items-center justify-center gap-1 mt-0.5">
                    <span>✦</span>
                    <span>{cert.issuer}</span>
                    <span>•</span>
                    <span>{cert.issueDate}</span>
                  </span>
                </div>
              </div>

              {/* Handcrafted Clothesline Dual Wooden Pegs with Category Accent */}
              <div
                className="pl-cert-peg pl-cert-peg-left"
                style={{
                  backgroundColor: theme.pegColor || "#c2884a",
                  borderColor: "#18181b",
                  boxShadow: `2px 2px 0 ${theme.pegShadow || "#78350f"}`,
                }}
              />
              <div
                className="pl-cert-peg pl-cert-peg-right"
                style={{
                  backgroundColor: theme.pegColor || "#c2884a",
                  borderColor: "#18181b",
                  boxShadow: `2px 2px 0 ${theme.pegShadow || "#78350f"}`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Interactive Detail Drawer with Dynamic Color-Coding */}
      {activeCert && (
        <div
          className={`p-6 sm:p-8 rounded-xl border-2 ${activeTheme.border} ${activeTheme.cardBg} ${activeTheme.shadow} space-y-6 transition-all duration-300 select-none`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black/20 dark:border-stone-700">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`sketch-stamp ${activeTheme.stamp}`}>
                  ACTIVE CREDENTIAL 0{active + 1} / 0{n}
                </span>
                <span className={`font-mono text-xs font-black uppercase px-2 py-0.5 rounded-full border ${activeTheme.categoryBadge}`}>
                  {activeCert.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white tracking-tight mt-2 leading-snug">
                {activeCert.title}
              </h2>
              <p className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 mt-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Issued by <strong>{activeCert.issuer}</strong> • {activeCert.issueDate}
                </span>
              </p>
            </div>

            {/* Stepper Buttons & Counter */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-black text-black dark:text-white px-3 py-1.5 border-2 border-black dark:border-white rounded-full bg-white dark:bg-stone-800 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]">
                <b>{pad2(active + 1)}</b> / {pad2(n)}
              </span>

              <button
                type="button"
                onClick={() => step(-1)}
                className="w-10 h-10 border-2 border-black dark:border-white rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] active:translate-y-[1px] cursor-pointer"
                aria-label="Previous certificate"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => step(1)}
                className="w-10 h-10 border-2 border-black dark:border-white rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] active:translate-y-[1px] cursor-pointer"
                aria-label="Next certificate"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description & Competencies */}
          <div className="space-y-4">
            <p className="text-stone-800 dark:text-stone-200 text-sm leading-relaxed">
              {activeCert.description}
            </p>

            {/* Skills Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block">
                SPECIALIZED KNOWLEDGE &amp; SKILLS:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {activeCert.skillsLearned.map((skill) => (
                  <span
                    key={skill}
                    className={`border px-2.5 py-0.5 rounded-full font-bold ${activeTheme.skillsPill}`}
                  >
                    ✦ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* In-Browser Secure Zoom & Inspect Button */}
            {activeCert.imageUrl && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openZoomModal(active)}
                  className="inline-flex items-center gap-3 p-3 rounded-xl border-2 border-black dark:border-stone-600 bg-white dark:bg-stone-800 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#fff] hover:-translate-y-0.5 hover:bg-amber-50 dark:hover:bg-stone-700 transition-all group cursor-pointer text-left"
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 relative">
                    <img
                      src={formatGoogleDriveImageUrl(activeCert.imageUrl)}
                      alt={activeCert.title}
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform pointer-events-none select-none"
                      onError={(e) => {
                        const target = e.currentTarget
                        if (!target.dataset.triedFallback && isGoogleDriveUrl(activeCert.imageUrl)) {
                          target.dataset.triedFallback = "true"
                          target.src = formatGoogleDriveThumbnailUrl(activeCert.imageUrl)
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="font-mono text-xs">
                    <span className="font-black text-black dark:text-white flex items-center gap-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      <ZoomIn className="w-4 h-4 text-amber-500" />
                      <span>Zoom &amp; Inspect Certificate</span>
                    </span>
                    <span className="text-stone-500 text-[10px] block font-mono">
                      High-Resolution Protected In-Place Inspector
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Action Verification Footer — Protected from external Drive leaks */}
          <div className="pt-4 border-t-2 border-dashed border-black/20 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-xs text-stone-600 dark:text-stone-400">
              Credential ID:{" "}
              <span className="font-black text-black dark:text-white">
                {activeCert.credentialId || "VERIFIED-ON-FILE"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* If credentialUrl is an external verification site (like Coursera or University portal), show link.
                  If it's a Google Drive link, provide the secure in-place zoom inspect button instead */}
              {activeCert.credentialUrl && !isGoogleDriveUrl(activeCert.credentialUrl) ? (
                <a
                  href={activeCert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2 rounded-md font-mono text-xs font-black uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
                >
                  <span>Verify on Issuer Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => openZoomModal(active)}
                  className="px-5 py-2 rounded-md font-mono text-xs font-black uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#f59e0b] hover:-translate-y-0.5 transition-transform flex items-center gap-2 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Zoom &amp; Inspect</span>
                </button>
              )}

              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{formatVerificationText(activeCert)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROTECTED FULLSCREEN ZOOM & PAN INSPECTOR MODAL
      ========================================================================= */}
      {mounted && zoomModalOpen && zoomCert && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between text-white select-none cert-zoom-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Certificate High Resolution Inspector"
          onContextMenu={(e) => handleSecurityBlock(e, "Saving & screenshots are restricted.")}
        >
          {/* Top Header Bar */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-black/80 border-b border-stone-800 flex items-center justify-between gap-4 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-amber-400 text-black font-black hidden sm:flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{formatVerificationText(zoomCert)}</span>
                  </span>
                  <span className="font-mono text-[10px] text-stone-400 hidden md:inline">
                    [IN-BROWSER HIGH-RES VIEW]
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase truncate mt-0.5 text-stone-100">
                  {zoomCert.title}
                </h3>
                <p className="text-xs text-stone-400 font-mono truncate hidden sm:block">
                  {zoomCert.issuer} • {zoomCert.issueDate} • {zoomCert.category}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeZoomModal}
              className="p-2.5 sm:p-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-colors cursor-pointer shrink-0"
              aria-label="Close Inspector"
              title="Close Inspector (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Interactive Pan/Zoom Viewport */}
          <div
            className={`relative flex-1 w-full h-full overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none ${
              zoomLevel > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
            }`}
            onPointerDown={handlePanDown}
            onPointerMove={handlePanMove}
            onPointerUp={handlePanUp}
            onPointerCancel={handlePanUp}
            onWheel={handleWheelZoom}
          >
            {/* Blurring Screen Cover if screen-capture / inactive window is detected */}
            {isBlurredOnInactive && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-2xl flex flex-col items-center justify-center gap-3 text-center p-6">
                <Lock className="w-12 h-12 text-amber-400 animate-pulse" />
                <h4 className="font-mono text-sm sm:text-base font-black text-white uppercase tracking-wider">
                  Credential Hidden While Inactive
                </h4>
                <p className="font-mono text-xs text-stone-400 max-w-md">
                  Click back into this window to resume high-resolution credential inspection.
                </p>
              </div>
            )}

            {/* Scaled & Panned Certificate Canvas */}
            <div
              className="relative transition-transform duration-75 ease-out max-w-full max-h-full flex items-center justify-center select-none"
              style={{
                transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            >
              {/* Certificate Image Frame */}
              <div className="relative rounded-lg shadow-2xl overflow-hidden border-2 border-stone-700 bg-stone-900 max-w-[92vw] max-h-[75vh]">
                <img
                  src={formatGoogleDriveImageUrl(zoomCert.imageUrl)}
                  alt={zoomCert.title}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  referrerPolicy="no-referrer"
                  className="w-auto h-auto max-w-[92vw] max-h-[75vh] object-contain select-none pointer-events-none"
                  onError={(e) => {
                    const target = e.currentTarget
                    if (!target.dataset.triedFallback && isGoogleDriveUrl(zoomCert.imageUrl)) {
                      target.dataset.triedFallback = "true"
                      target.src = formatGoogleDriveThumbnailUrl(zoomCert.imageUrl)
                    }
                  }}
                />

                {/* Indelible Security Watermark Overlay */}
                <SecurityWatermarkOverlay />

                {/* Invisible Anti-Right-Click / Anti-Drag Protective Shield */}
                <div
                  className="absolute inset-0 z-30 select-none pointer-events-auto"
                  onContextMenu={(e) => handleSecurityBlock(e, "Saving certificate images is restricted.")}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </div>

          {/* Bottom Toolbar with Zoom, Pan, Navigation & Security Hint */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 bg-black/80 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 z-30 font-mono text-xs">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 sm:gap-2 bg-stone-900/90 p-1 rounded-xl border border-stone-700 shadow-md">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent text-stone-200 transition-colors cursor-pointer"
                title="Zoom Out (-)"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="px-2 font-black text-amber-400 min-w-[50px] text-center select-none text-xs sm:text-sm">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                className="p-2 rounded-lg hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-transparent text-stone-200 transition-colors cursor-pointer"
                title="Zoom In (+)"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-stone-700 mx-1" />

              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2.5 py-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-bold"
                title="Reset Zoom to 100%"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Pan & Protection Hint */}
            <div className="hidden lg:flex items-center gap-2 text-stone-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Protected High-Res View • Drag to Pan • Scroll to Zoom • Screen capture restricted</span>
            </div>

            {/* Prev / Next Stepper in Modal */}
            {n > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepZoomCert(-1)}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <span className="text-stone-400 text-xs font-bold px-1">
                  {zoomCertIndex + 1} / {n}
                </span>
                <button
                  type="button"
                  onClick={() => stepZoomCert(1)}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

const POLAROID_CSS = `
/* Gallery Studio Clothesline Stage — Clean Solid Border, No Dotted Lines */
.pl-cert-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
  cursor: grab;
  border: 2px solid #18181b;
  border-radius: 24px;
  background-color: #f6f3ec;
  background-image: radial-gradient(#18181b 0.75px, transparent 0.75px);
  background-size: 22px 22px;
  box-shadow: 6px 8px 0px #18181b;
}

.pl-cert-root[data-drag='1'] {
  cursor: grabbing;
}

.pl-cert-string {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.pl-cert-card {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--pl-cw);
  transform-origin: 50% 0;
  will-change: transform;
  cursor: inherit;
}

/* Luxury Gallery Polaroid Mount with Satin Finish & Layered Depth */
.pl-cert-print {
  margin-top: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fcfaf6 100%);
  padding: 10px 10px 8px;
  border: 2px solid #18181b;
  border-radius: 16px;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.25), 6px 8px 0px #18181b;
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.4s ease;
}

.pl-cert-card[data-on='0'] .pl-cert-print {
  transform: scale(0.9);
  opacity: 0.82;
  box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.18), 3px 4px 0px #18181b;
}

.pl-cert-card[data-on='1'] .pl-cert-print {
  transform: scale(1.03);
}

/* Widescreen Landscape Photo Frame (Aspect 1.48) with Deep Museum Matboard */
.pl-cert-shot {
  position: relative;
  aspect-ratio: 1.48;
  overflow: hidden;
  background: #0a0d14; /* Deep museum obsidian matboard */
  border: 1.5px solid #18181b;
  border-radius: 10px;
  display: flex;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
}

.pl-cert-parchment {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  background-color: #0a0d14;
  background-image: radial-gradient(rgba(255, 255, 255, 0.12) 0.75px, transparent 0.75px);
  background-size: 14px 14px;
}

.pl-cert-border {
  width: 100%;
  height: 100%;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #141923;
  color: #ffffff;
}

/* Note typography at bottom of polaroid */
.pl-cert-note {
  height: 46px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 8px 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Handcrafted Realistic Wooden Clothesline Pegs */
.pl-cert-peg {
  position: absolute;
  top: 0;
  width: 13px;
  height: 32px;
  margin-left: -6.5px;
  border-radius: 3px;
  border: 2px solid #18181b;
  z-index: 10;
  transition: transform 0.2s ease;
  background: linear-gradient(180deg, #d97706 0%, #b45309 60%, #92400e 100%);
  box-shadow: 2px 2px 0 #78350f, 0 3px 6px rgba(0, 0, 0, 0.15);
}

.pl-cert-peg-left {
  left: 22%;
}

.pl-cert-peg-right {
  left: 78%;
}

/* Metallic spring coil clip on peg */
.pl-cert-peg::before {
  content: '';
  position: absolute;
  left: -2px;
  top: 11px;
  right: -2px;
  height: 4px;
  background: linear-gradient(90deg, #a1a1aa, #f4f4f5, #71717a);
  border-top: 1px solid #18181b;
  border-bottom: 1px solid #18181b;
  border-radius: 1px;
}

/* Clothespin wood pinch slit */
.pl-cert-peg::after {
  content: '';
  position: absolute;
  left: 3.5px;
  bottom: 0;
  width: 2px;
  height: 9px;
  background: #451a03;
  border-radius: 1px 1px 0 0;
}

/* Dark Mode Support */
html.dark .pl-cert-root {
  border-color: #3f3f46;
  background-color: #0b0c10;
  background-image: radial-gradient(rgba(255, 255, 255, 0.08) 0.75px, transparent 0.75px);
  box-shadow: 6px 8px 0px #27272a;
}

html.dark .pl-cert-string path {
  stroke: #e4e4e7;
}

html.dark .pl-cert-print {
  background: linear-gradient(180deg, #18181b 0%, #121214 100%);
  border-color: #3f3f46;
  color: #ffffff;
  box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.6), 6px 8px 0px #27272a;
}

html.dark .pl-cert-shot {
  background: #05070c;
  border-color: #3f3f46;
}

html.dark .pl-cert-border {
  background: #0d1117;
  border-color: rgba(255, 255, 255, 0.2);
}

html.dark .pl-cert-note {
  color: #ffffff;
}

/* Print Blocker Protection — Prevents PDF print-export theft */
@media print {
  html, body, .pl-cert-root, .cert-zoom-modal {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
}
`
