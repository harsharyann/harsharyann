"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
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
  Sparkles,
  Maximize2,
} from "lucide-react"
import {
  formatGoogleDriveImageUrl,
  formatGoogleDriveThumbnailUrl,
  isGoogleDriveUrl,
} from "@/lib/googleDrive"
import { usePortfolio } from "@/context/PortfolioContext"

export function clamp(v: number, a: number, b: number): number {
  return Math.min(b, Math.max(a, v))
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
      pegColor: "#c2884a",
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
        "border-indigo-300 dark:border-indigo-700 bg-white dark:bg-stone-800 text-indigo-950 dark:text-indigo-200 shadow-[1.5px_1.5px_0_#4338ca]",
      printShadow: "#1e1b4b",
    }
  }

  // 2. Data Science & Analytics: Academic Emerald / Forest
  if (cat.includes("data") || cat.includes("analytics")) {
    return {
      accent: "#047857",
      pegColor: "#c2884a",
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
        "border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-emerald-950 dark:text-emerald-200 shadow-[1.5px_1.5px_0_#047857]",
      printShadow: "#064e3b",
    }
  }

  // 3. Programming / Code / Web: Deep Slate / Oceanic Blue
  if (cat.includes("program") || cat.includes("code") || cat.includes("web") || cat.includes("software")) {
    return {
      accent: "#0369a1",
      pegColor: "#c2884a",
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
        "border-sky-300 dark:border-sky-700 bg-white dark:bg-stone-800 text-sky-950 dark:text-sky-200 shadow-[1.5px_1.5px_0_#0369a1]",
      printShadow: "#082f49",
    }
  }

  // 4. Extra Curricular / Hackathon / Clubs / Leadership: Prestigious Maroon & Warm Gold
  if (
    cat.includes("extra") ||
    cat.includes("caricul") ||
    cat.includes("activity") ||
    cat.includes("club") ||
    cat.includes("lead") ||
    cat.includes("hack")
  ) {
    return {
      accent: "#991b1b",
      pegColor: "#c2884a",
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
        "border-amber-300 dark:border-red-700 bg-white dark:bg-stone-800 text-red-950 dark:text-red-200 shadow-[1.5px_1.5px_0_#991b1b]",
      printShadow: "#7f1d1d",
    }
  }

  // 5. Default / University Laurels: Warm Gold & Oak Bronze
  return {
    accent: "#b45309",
    pegColor: "#c2884a",
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
      "border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-amber-950 dark:text-amber-200 shadow-[1.5px_1.5px_0_#b45309]",
    printShadow: "#78350f",
  }
}

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

function SecurityWatermarkOverlay() {
  const { data: portfolio } = usePortfolio();
  const ownerName = portfolio?.personal?.name ? portfolio.personal.name.toUpperCase() : "HARSH ARYAN";
  const watermarkText = `✦ ${ownerName} CREDENTIALS • ${ownerName} CREDENTIALS • ${ownerName} CREDENTIALS • ${ownerName} CREDENTIALS ✦`;

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
            {watermarkText}
          </div>
        ))}
      </div>
    </div>
  )
}

export interface PolaroidCertificateCarouselProps {
  certificates: Certificate[]
  className?: string
  height?: number | string
  cardWidth?: number
  sag?: number
  swing?: number
  autoplay?: number
}

export function PolaroidCertificateCarousel({
  certificates = [],
  className = "",
}: PolaroidCertificateCarouselProps) {
  const n = certificates.length
  const [active, setActive] = React.useState(0)

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

  // Reset active index when certificate list changes (e.g. filter clicked)
  React.useEffect(() => {
    setActive(0)
  }, [certificates])

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

  const [slideDir, setSlideDir] = React.useState<number>(1)
  const isDraggingRef = React.useRef(false)
  const touchStartX = React.useRef<number | null>(null)
  const touchStartY = React.useRef<number | null>(null)

  const step = React.useCallback(
    (dir: number) => {
      if (n <= 1) return
      setSlideDir(dir)
      setActive((prev) => (prev + dir + n) % n)
    },
    [n]
  )

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const diffX = touchStartX.current - e.changedTouches[0].clientX
    const diffY = touchStartY.current - e.changedTouches[0].clientY

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        step(1)
      } else {
        step(-1)
      }
    }
    touchStartX.current = null
    touchStartY.current = null
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
    const nextIdx = (zoomCertIndex + dir + n) % n
    setZoomCertIndex(nextIdx)
    setActive(nextIdx)
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // Keyboard navigation & security protection
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Intercept PrintScreen
      if (e.key === "PrintScreen") {
        setIsBlurredOnInactive(true)
        setTimeout(() => setIsBlurredOnInactive(false), 1400)
        triggerSecurityAlert("⚠️ Screenshot restricted: Credential contents are protected.")
      }

      // 2. Intercept Ctrl+P / Cmd+P
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "P")) {
        e.preventDefault()
        e.stopPropagation()
        triggerSecurityAlert("⚠️ Printing or exporting credentials is restricted.")
      }

      // 3. Intercept Ctrl+S / Cmd+S
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault()
        e.stopPropagation()
        triggerSecurityAlert("⚠️ Direct saving of credential assets is restricted.")
      }

      // Navigation
      if (zoomModalOpen) {
        if (e.key === "Escape") closeZoomModal()
        else if (e.key === "ArrowRight") stepZoomCert(1)
        else if (e.key === "ArrowLeft") stepZoomCert(-1)
        else if (e.key === "+" || e.key === "=") handleZoomIn()
        else if (e.key === "-" || e.key === "_") handleZoomOut()
        else if (e.key === "0") handleResetZoom()
      } else {
        if (e.key === "ArrowRight") step(1)
        else if (e.key === "ArrowLeft") step(-1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [zoomModalOpen, zoomCertIndex, n, triggerSecurityAlert, closeZoomModal])

  // Window Blur Detection
  React.useEffect(() => {
    if (!zoomModalOpen) {
      setIsBlurredOnInactive(false)
      return
    }
    const onBlur = () => setIsBlurredOnInactive(true)
    const onFocus = () => setIsBlurredOnInactive(false)
    window.addEventListener("blur", onBlur)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("blur", onBlur)
      window.removeEventListener("focus", onFocus)
    }
  }, [zoomModalOpen])

  if (!certificates.length) {
    return (
      <div className="sketch-box p-12 text-center font-mono text-sm">
        No certificates found in this category.
      </div>
    )
  }

  const safeActive = clamp(active, 0, n - 1)
  const activeCert = certificates[safeActive] || certificates[0]
  const activeTheme = getCertTheme(activeCert?.category || "")
  const zoomCert = certificates[zoomCertIndex] || activeCert

  return (
    <div
      className={`relative select-none ${className}`}
      onContextMenu={(e) => handleSecurityBlock(e, "Right-click is disabled to protect credentials.")}
    >
      <style>{POLAROID_BENTO_CSS}</style>

      {/* Floating Security Alert Toast */}
      {securityToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100000] px-4 py-2.5 rounded-full bg-black/95 text-white dark:bg-white dark:text-black font-mono text-xs font-bold border-2 border-amber-400 shadow-[0_6px_25px_rgba(0,0,0,0.4)] flex items-center gap-2 animate-pulse">
          <Lock className="w-4 h-4 text-amber-500" />
          <span>{securityToast}</span>
        </div>
      )}

      {/* =========================================================================
          UNIFIED POLAROID BENTO CONTAINER — Sleek, Compact & Proportional
          House both the authentic Polaroid Frame & the Intelligence Dossier together
      ========================================================================= */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 md:p-6 transition-all duration-300 liquid-bento-card max-w-6xl mx-auto overflow-hidden touch-pan-y"
      >

        {/* ── BENTO TOP BAR: Counter Stamp + Category Badge + Stepper Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-black/15 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`sketch-stamp font-mono text-[11px] ${activeTheme.stamp} shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fff]`}>
              ACTIVE CREDENTIAL {pad2(safeActive + 1)} / {pad2(n)}
            </span>
            <span
              className={`font-mono text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border shadow-xs ${activeTheme.categoryBadge}`}
            >
              ✦ {activeCert.category} ✦
            </span>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="font-mono text-xs font-black text-black dark:text-white px-2.5 py-1 border-2 border-black dark:border-white rounded-full bg-white dark:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fff]">
              <b>{pad2(safeActive + 1)}</b> / {pad2(n)}
            </span>

            <button
              type="button"
              onClick={() => step(-1)}
              disabled={n <= 1}
              className="w-8 h-8 border-2 border-black dark:border-white rounded-full flex items-center justify-center bg-white dark:bg-stone-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fff] active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
              aria-label="Previous certificate"
              title="Previous (Arrow Left)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => step(1)}
              disabled={n <= 1}
              className="w-8 h-8 border-2 border-black dark:border-white rounded-full flex items-center justify-center bg-white dark:bg-stone-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#fff] active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
              aria-label="Next certificate"
              title="Next (Arrow Right)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── BENTO MAIN BODY: Split 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4">
          {/* =======================================================================
              COLUMN 1 (LEFT): THE AUTHENTIC POLAROID FRAME (Widescreen Landscape)
          ======================================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full">
            {/* Hanging Clothesline Wire with Brass Wall Studs at top of the photo card */}
            <div className="relative w-full max-w-[390px] h-8 pointer-events-none select-none overflow-visible">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 390 30">
                <path
                  d="M 10 10 Q 195 26 380 10"
                  fill="none"
                  stroke="#18181b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="dark:stroke-stone-300"
                />
                {/* Brass Wall Mount Studs */}
                <circle cx="10" cy="10" r="4" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="380" cy="10" r="4" fill="#18181b" stroke="#f59e0b" strokeWidth="2" />
              </svg>
            </div>

            {/* Polaroid Photo Frame with Wooden Pegs & Drag/Swipe Gestures */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id || safeActive}
                initial={{ opacity: 0, scale: 0.96, x: slideDir > 0 ? 30 : -30, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, x: 0, rotate: -1 }}
                exit={{ opacity: 0, scale: 0.96, x: slideDir > 0 ? -30 : 30, rotate: 1 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => {
                  isDraggingRef.current = true
                }}
                onDragEnd={(_e, { offset, velocity }) => {
                  const swipe = offset.x + velocity.x * 0.2
                  if (swipe < -35) {
                    step(1)
                  } else if (swipe > 35) {
                    step(-1)
                  }
                  setTimeout(() => {
                    isDraggingRef.current = false
                  }, 120)
                }}
                onClick={() => {
                  if (!isDraggingRef.current) {
                    openZoomModal(safeActive)
                  }
                }}
                className="relative w-full max-w-[390px] cursor-grab active:cursor-grabbing group select-none touch-pan-y"
                title="Click to Zoom or Swipe Left/Right to Slide"
              >
                {/* Handcrafted Dual Wooden Clothesline Pegs */}
                <div
                  className="pl-cert-peg pl-cert-peg-left"
                  style={{
                    backgroundColor: activeTheme.pegColor || "#c2884a",
                    borderColor: "#18181b",
                    boxShadow: `1.5px 1.5px 0 ${activeTheme.pegShadow || "#78350f"}`,
                  }}
                />
                <div
                  className="pl-cert-peg pl-cert-peg-right"
                  style={{
                    backgroundColor: activeTheme.pegColor || "#c2884a",
                    borderColor: "#18181b",
                    boxShadow: `1.5px 1.5px 0 ${activeTheme.pegShadow || "#78350f"}`,
                  }}
                />

                {/* Direct Prev / Next Quick Stepper Arrow Buttons on Frame */}
                {n > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        step(-1)
                      }}
                      className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-stone-900 border-2 border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] flex items-center justify-center text-black dark:text-white hover:scale-110 active:scale-95 transition-all z-30 cursor-pointer"
                      title="Previous Certificate"
                      aria-label="Previous Certificate"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        step(1)
                      }}
                      className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-stone-900 border-2 border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] flex items-center justify-center text-black dark:text-white hover:scale-110 active:scale-95 transition-all z-30 cursor-pointer"
                      title="Next Certificate"
                      aria-label="Next Certificate"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Polaroid Print Body */}
                <div
                  className="pl-cert-print group-hover:rotate-0 group-hover:scale-[1.015] transition-transform duration-300"
                  style={{
                    boxShadow: `0 14px 30px -8px rgba(0, 0, 0, 0.3), 5px 7px 0 ${activeTheme.printShadow || "#18181b"}`,
                  }}
                >
                  {/* Inner Photo Window (Aspect Ratio 1.48 / 16:11) */}
                  <div className="pl-cert-shot relative overflow-hidden">
                    {activeCert.imageUrl ? (
                      <div className="relative w-full h-full bg-[#0a0d14] dark:bg-[#05070c] rounded-lg overflow-hidden flex flex-col justify-between">
                        {/* Subtle glass reflection sheen */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.04] pointer-events-none" />

                        {/* Certificate Image */}
                        <img
                          src={formatGoogleDriveImageUrl(activeCert.imageUrl)}
                          alt={activeCert.title}
                          draggable={false}
                          onDragStart={(e) => e.preventDefault()}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain p-1.5 select-none pointer-events-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (!target.dataset.triedFallback && isGoogleDriveUrl(activeCert.imageUrl)) {
                              target.dataset.triedFallback = "true"
                              target.src = formatGoogleDriveThumbnailUrl(activeCert.imageUrl)
                            } else {
                              ;(target as HTMLElement).style.display = "none"
                            }
                          }}
                        />

                        {/* Top-Left Stamp: #01 */}
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-amber-400 font-mono text-[8.5px] font-black uppercase tracking-wider border border-white/20 shadow-sm select-none z-20">
                          #{pad2(safeActive + 1)}
                        </div>

                        {/* Top-Right: Subtle minimal expand view icon */}
                        <div
                          className="absolute top-2 right-2 p-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 border border-white/20 shadow-xs z-20 pointer-events-none"
                          aria-hidden="true"
                        >
                          <Maximize2 className="w-2.5 h-2.5 text-amber-300" />
                        </div>

                        {/* Bottom Foil Ribbon: Category */}
                        <div className="absolute bottom-1.5 left-3 right-3 text-center py-0.5 rounded-full font-mono text-[8.5px] font-black uppercase tracking-widest truncate border shadow-md bg-black/85 text-amber-300 backdrop-blur-md border-amber-400/40 z-20">
                          ✦ {activeCert.category} ✦
                        </div>

                        {/* Anti-Drag / Anti-Right Click Shield */}
                        <div
                          className="absolute inset-0 z-10 select-none pointer-events-auto"
                          onContextMenu={(e) => handleSecurityBlock(e)}
                          onDragStart={(e) => e.preventDefault()}
                        />
                      </div>
                    ) : (
                      <div className="pl-cert-parchment">
                        <div className="pl-cert-border">
                          <div className="flex items-center justify-between w-full pb-1 border-b border-white/20 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400">
                            <span>CERT #{pad2(safeActive + 1)}</span>
                            <span className="font-black text-white">{activeCert.issueDate}</span>
                          </div>

                          <div className="my-auto text-center space-y-1 py-1">
                            <div
                              className={`inline-block p-1.5 rounded-full border-2 border-white/40 ${activeTheme.crestBorder} ${activeTheme.crestBg}`}
                            >
                              <Award className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="font-mono text-[8.5px] font-black uppercase tracking-widest text-amber-300 block truncate max-w-[180px]">
                              {formatVerificationText(activeCert)}
                            </div>
                            <div className="font-bold text-xs uppercase line-clamp-1 text-white px-1">
                              {activeCert.issuer}
                            </div>
                          </div>

                          <div className="w-full text-center py-0.5 rounded-full font-mono text-[8px] font-black uppercase tracking-wider truncate border border-amber-400/40 bg-black/60 text-amber-300">
                            {activeCert.category}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Iconic Polaroid Bottom Chin */}
                  <div className="pl-cert-note">
                    <span className="truncate block font-black text-xs sm:text-[13px] text-stone-900 dark:text-stone-100 uppercase tracking-tight font-mono">
                      {activeCert.title}
                    </span>
                    <span className="text-[9.5px] text-amber-800 dark:text-amber-400 block truncate font-mono font-bold flex items-center justify-center gap-1 mt-0.5">
                      <span>✦</span>
                      <span>{activeCert.issuer}</span>
                      <span>•</span>
                      <span>{activeCert.issueDate}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* =======================================================================
              COLUMN 2 (RIGHT): THE INTELLIGENCE & VERIFICATION DOSSIER
          ======================================================================= */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-3.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCert.id || safeActive}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="space-y-3"
              >
                {/* Title & Issuer Heading */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white tracking-tight leading-snug">
                    {activeCert.title}
                  </h2>
                  <p className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 mt-1 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Issued by <strong>{activeCert.issuer}</strong> • {activeCert.issueDate}
                    </span>
                  </p>
                </div>

                {/* Description Paragraph */}
                <p className="text-stone-800 dark:text-stone-200 text-xs sm:text-[13px] leading-relaxed line-clamp-3">
                  {activeCert.description}
                </p>

                {/* Specialized Knowledge & Skills Pills */}
                {activeCert.skillsLearned && activeCert.skillsLearned.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono font-black uppercase text-stone-500 dark:text-stone-400 block tracking-wider">
                      SPECIALIZED KNOWLEDGE &amp; SKILLS:
                    </span>
                    <div className="flex flex-wrap gap-1 font-mono text-[11px]">
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
                )}


                {/* Action Verification Footer */}
                <div className="pt-3 border-t-2 border-dashed border-black/20 dark:border-stone-700 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="font-mono text-[11px] text-stone-600 dark:text-stone-400">
                    ID:{" "}
                    <span className="font-black text-black dark:text-white">
                      {activeCert.credentialId || "VERIFIED-ON-FILE"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Button */}
                    {activeCert.credentialUrl && !isGoogleDriveUrl(activeCert.credentialUrl) ? (
                      <a
                        href={activeCert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-black uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2px_2px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-1"
                      >
                        <span>Verify on Site</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openZoomModal(safeActive)}
                        className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-black uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2px_2px_0_#f59e0b] hover:-translate-y-0.5 transition-transform flex items-center gap-1 cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3 text-amber-400" />
                        <span>Inspect</span>
                      </button>
                    )}

                    {/* Verified Status Badge */}
                    <div className="inline-flex items-center gap-1 font-mono text-[10.5px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 shadow-xs">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{formatVerificationText(activeCert)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* =======================================================================
            BOTTOM TIER INSIDE BENTO: MINI POLAROID FILMSTRIP SELECTOR
        ======================================================================= */}
        {n > 1 && (
          <div className="mt-5 pt-4 border-t-2 border-black/15 dark:border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 uppercase tracking-wider text-[10.5px]">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>POLAROID FILMSTRIP RACK ({pad2(safeActive + 1)} OF {pad2(n)})</span>
              </span>
              <span className="text-[9.5px] text-stone-500 dark:text-stone-400 hidden sm:inline">
                Click any mini print to select
              </span>
            </div>

            {/* Horizontally scrollable filmstrip row */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 select-none scrollbar-thin">
              {certificates.map((cert, idx) => {
                const isCurrent = idx === safeActive
                return (
                  <button
                    key={cert.id || idx}
                    type="button"
                    onClick={() => setActive(idx)}
                    className={`shrink-0 text-left transition-all duration-200 cursor-pointer group relative p-1 rounded-lg border-2 ${
                      isCurrent
                        ? "bg-white dark:bg-stone-800 border-black dark:border-amber-400 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#f59e0b] -translate-y-0.5 scale-105"
                        : "bg-stone-100/90 dark:bg-stone-900 border-stone-300 dark:border-stone-700 opacity-75 hover:opacity-100 hover:-translate-y-0.5 shadow-xs"
                    }`}
                    style={{ width: "110px" }}
                  >
                    {/* Mini Polaroid Photo Area */}
                    <div className="relative aspect-[16/11] rounded overflow-hidden bg-black border border-stone-300 dark:border-stone-700">
                      {cert.imageUrl ? (
                        <img
                          src={formatGoogleDriveImageUrl(cert.imageUrl)}
                          alt={cert.title}
                          draggable={false}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (!target.dataset.triedFallback && isGoogleDriveUrl(cert.imageUrl)) {
                              target.dataset.triedFallback = "true"
                              target.src = formatGoogleDriveThumbnailUrl(cert.imageUrl)
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-800 text-amber-400">
                          <Award className="w-4 h-4" />
                        </div>
                      )}
                      <div className="absolute top-0.5 left-0.5 px-1 py-0.1 rounded bg-black/80 text-white font-mono text-[7.5px] font-black">
                        #{pad2(idx + 1)}
                      </div>
                    </div>
                    {/* Mini Title */}
                    <div className="mt-1 px-0.5">
                      <span className="block text-[9.5px] font-mono font-black truncate text-black dark:text-white">
                        {cert.title}
                      </span>
                      <span className="block text-[8px] font-mono text-stone-500 dark:text-stone-400 truncate">
                        {cert.issuer}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

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

                {/* Invisible Protective Shield */}
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

const POLAROID_BENTO_CSS = `
/* Luxury Gallery Polaroid Mount with Satin Finish & Layered Depth */
.pl-cert-print {
  background: linear-gradient(180deg, #ffffff 0%, #fcfaf6 100%);
  padding: 10px 10px 8px;
  border: 2px solid #18181b;
  border-radius: 16px;
  transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.3s ease;
}

/* Widescreen Landscape Photo Frame (Aspect 1.48) with Deep Museum Matboard */
.pl-cert-shot {
  position: relative;
  aspect-ratio: 1.48;
  overflow: hidden;
  background: #0a0d14;
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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

/* Note typography at bottom chin of polaroid */
.pl-cert-note {
  height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 6px 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Handcrafted Realistic Wooden Clothesline Pegs */
.pl-cert-peg {
  position: absolute;
  top: -11px;
  width: 11px;
  height: 25px;
  margin-left: -5.5px;
  border-radius: 2.5px;
  border: 1.8px solid #18181b;
  z-index: 25;
  transition: transform 0.2s ease;
  background: linear-gradient(180deg, #d97706 0%, #b45309 60%, #92400e 100%);
  box-shadow: 1.5px 1.5px 0 #78350f, 0 2px 4px rgba(0, 0, 0, 0.15);
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
  left: -1.5px;
  top: 8px;
  right: -1.5px;
  height: 3.5px;
  background: linear-gradient(90deg, #a1a1aa, #f4f4f5, #71717a);
  border-top: 1px solid #18181b;
  border-bottom: 1px solid #18181b;
  border-radius: 1px;
}

/* Clothespin wood pinch slit */
.pl-cert-peg::after {
  content: '';
  position: absolute;
  left: 3px;
  bottom: 0;
  width: 1.8px;
  height: 7px;
  background: #451a03;
  border-radius: 1px 1px 0 0;
}

/* Dark Mode Support */
html.dark .pl-cert-print {
  background: linear-gradient(180deg, #18181b 0%, #121214 100%);
  border-color: #3f3f46;
  color: #ffffff;
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
  html, body, .pl-cert-print, .cert-zoom-modal {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
  }
}
`