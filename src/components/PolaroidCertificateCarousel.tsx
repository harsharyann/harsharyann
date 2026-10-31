"use client"

import * as React from "react"
import { Certificate } from "@/data/portfolioData"
import { Award, ShieldCheck, ArrowUpRight, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

/**
 * PolaroidCertificateCarousel — Colorful Hand-Drawn Sketchbook Polaroid Line Carousel.
 * Instant certificate prints pegged to a sagging hand-drawn ink string.
 * Dragging the line or clicking cards makes them swing on their pegs with physics,
 * settling smoothly with natural overshoot.
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
  if (category === "Machine Learning") {
    return {
      accent: "#8b5cf6",
      pegColor: "#a855f7",
      pegShadow: "#6d28d9",
      stamp: "bg-purple-600 text-white dark:bg-purple-500 dark:text-white",
      categoryBadge:
        "bg-purple-100 text-purple-900 border-purple-400 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-600",
      crestBorder: "border-purple-500 shadow-[2px_2px_0_#8b5cf6]",
      crestBg: "bg-purple-50 dark:bg-stone-800 text-purple-600 dark:text-purple-300",
      shadow: "shadow-[6px_6px_0_#8b5cf6] dark:shadow-[6px_6px_0_#a855f7]",
      border: "border-black dark:border-purple-400/80",
      cardBg:
        "bg-gradient-to-br from-violet-50/70 via-white to-purple-50/30 dark:from-stone-900 dark:via-purple-950/20 dark:to-stone-900",
      accentText: "text-purple-700 dark:text-purple-300",
      skillsPill:
        "border-purple-300 dark:border-purple-700 bg-white dark:bg-stone-800 text-purple-800 dark:text-purple-200 shadow-[1px_1px_0_#8b5cf6]",
      printShadow: "#8b5cf6",
    }
  }
  if (category === "Data Science") {
    return {
      accent: "#10b981",
      pegColor: "#10b981",
      pegShadow: "#047857",
      stamp: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white",
      categoryBadge:
        "bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-600",
      crestBorder: "border-emerald-500 shadow-[2px_2px_0_#10b981]",
      crestBg: "bg-emerald-50 dark:bg-stone-800 text-emerald-600 dark:text-emerald-300",
      shadow: "shadow-[6px_6px_0_#10b981] dark:shadow-[6px_6px_0_#34d399]",
      border: "border-black dark:border-emerald-400/80",
      cardBg:
        "bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 dark:from-stone-900 dark:via-emerald-950/20 dark:to-stone-900",
      accentText: "text-emerald-700 dark:text-emerald-300",
      skillsPill:
        "border-emerald-300 dark:border-emerald-700 bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-200 shadow-[1px_1px_0_#10b981]",
      printShadow: "#10b981",
    }
  }
  if (category === "Programming") {
    return {
      accent: "#06b6d4",
      pegColor: "#06b6d4",
      pegShadow: "#0e7490",
      stamp: "bg-sky-600 text-white dark:bg-sky-500 dark:text-white",
      categoryBadge:
        "bg-sky-100 text-sky-900 border-sky-400 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-600",
      crestBorder: "border-sky-500 shadow-[2px_2px_0_#0284c7]",
      crestBg: "bg-sky-50 dark:bg-stone-800 text-sky-600 dark:text-sky-300",
      shadow: "shadow-[6px_6px_0_#0284c7] dark:shadow-[6px_6px_0_#38bdf8]",
      border: "border-black dark:border-sky-400/80",
      cardBg:
        "bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/30 dark:from-stone-900 dark:via-sky-950/20 dark:to-stone-900",
      accentText: "text-sky-700 dark:text-sky-300",
      skillsPill:
        "border-sky-300 dark:border-sky-700 bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-200 shadow-[1px_1px_0_#0284c7]",
      printShadow: "#0284c7",
    }
  }
  // Mathematics & Hackathons (or default)
  return {
    accent: "#f59e0b",
    pegColor: "#f59e0b",
    pegShadow: "#b45309",
    stamp: "bg-amber-400 text-black dark:bg-amber-400 dark:text-black",
    categoryBadge:
      "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-600",
    crestBorder: "border-amber-500 shadow-[2px_2px_0_#f59e0b]",
    crestBg: "bg-amber-50 dark:bg-stone-800 text-amber-600 dark:text-amber-300",
    shadow: "shadow-[6px_6px_0_#f59e0b] dark:shadow-[6px_6px_0_#fbbf24]",
    border: "border-black dark:border-amber-400/80",
    cardBg:
      "bg-gradient-to-br from-amber-50/70 via-white to-orange-50/30 dark:from-stone-900 dark:via-amber-950/20 dark:to-stone-900",
    accentText: "text-amber-700 dark:text-amber-300",
    skillsPill:
      "border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-amber-800 dark:text-amber-200 shadow-[1px_1px_0_#f59e0b]",
    printShadow: "#f59e0b",
  }
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
  height = 560,
  cardWidth = 280,
  sag = 42,
  swing = 1.1,
  autoplay = 5000,
  className = "",
}: PolaroidCertificateCarouselProps) {
  const n = certificates.length
  const [active, setActive] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [size, setSize] = React.useState({ w: 1000, h: 560, cw: cardWidth })

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

  const spacing = size.cw * 1.08

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

  // Responsive sizing
  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect()
      const cw = Math.round(Math.max(160, Math.min(cardWidth, r.width * 0.52, r.height * 0.48)))
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
      if (autoplay > 0 && !drag.current && now - lastTouch.current > autoplay && n > 1) {
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
  }, [n, spacing, size, autoplay, goTo])

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
      goTo(Number(card.getAttribute("data-i")))
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

  const activeCert = certificates[active] || certificates[0]
  const activeTheme = activeCert ? getCertTheme(activeCert.category) : getCertTheme("Machine Learning")

  if (!certificates.length) {
    return (
      <div className="sketch-box p-12 text-center font-mono text-sm">
        No certificates found in this category.
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Sagging String Stage */}
      <div
        ref={rootRef}
        className="pl-cert-root"
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
      >
        <style>{POLAROID_CSS}</style>

        {/* The Sagging String */}
        <svg className="pl-cert-string" aria-hidden="true">
          <path
            ref={pathRef}
            fill="none"
            stroke="#000000"
            className="dark:stroke-white"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>

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
              {/* Polaroid Paper Frame */}
              <div
                className="pl-cert-print"
                style={{
                  boxShadow: isCurrent ? `6px 10px 0 ${theme.printShadow}` : undefined,
                }}
              >
                {/* Certificate Emblem Parchment View */}
                <div className="pl-cert-shot">
                  <div className="pl-cert-parchment">
                    {/* Inner Certificate Border */}
                    <div className="pl-cert-border">
                      <div className="flex items-center justify-between w-full pb-1 border-b border-black dark:border-stone-700 text-[9px] font-mono font-bold uppercase tracking-wider">
                        <span>CERT #{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                        <span className="font-black text-black dark:text-white">{cert.issueDate}</span>
                      </div>

                      {/* Laurel Crest Emblem with Category Color */}
                      <div className="my-auto text-center space-y-1 py-1">
                        <div
                          className={`inline-block p-2 rounded-full border-2 border-black dark:border-white ${theme.crestBorder} ${theme.crestBg}`}
                        >
                          <Award className="w-6 h-6" />
                        </div>
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-black dark:text-white block">
                          VERIFIED CREDENTIAL
                        </div>
                        <div className="font-bold text-xs uppercase line-clamp-1 text-black dark:text-white px-1">
                          {cert.issuer}
                        </div>
                      </div>

                      {/* Category tag at bottom of photo area */}
                      <div
                        className={`w-full text-center py-0.5 rounded font-mono text-[8.5px] font-black uppercase tracking-wide truncate border ${theme.categoryBadge}`}
                      >
                        {cert.category}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hand-written Polaroid Caption Area */}
                <div className="pl-cert-note">
                  <span className="truncate">{cert.title}</span>
                </div>
              </div>

              {/* Handcrafted Clothesline Wooden Peg with Category Accent */}
              <div
                className="pl-cert-peg"
                style={{
                  backgroundColor: isCurrent ? theme.pegColor : "#ffffff",
                  borderColor: "#000000",
                  boxShadow: isCurrent ? `2px 2px 0 ${theme.pegShadow}` : "2px 2px 0 rgba(0,0,0,0.7)",
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Interactive Detail Drawer with Dynamic Color-Coding */}
      {activeCert && (
        <div
          className={`p-6 sm:p-8 rounded-xl border-2 ${activeTheme.border} ${activeTheme.cardBg} ${activeTheme.shadow} space-y-6 transition-all duration-300`}
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
          </div>

          {/* Action Verification Footer */}
          <div className="pt-4 border-t-2 border-dashed border-black/20 dark:border-stone-700 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-xs text-stone-600 dark:text-stone-400">
              Credential ID: <span className="font-black text-black dark:text-white">{activeCert.credentialId || "VERIFIED-ON-FILE"}</span>
            </div>

            {activeCert.credentialUrl ? (
              <a
                href={activeCert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-md font-mono text-xs font-black uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#8b5cf6] hover:-translate-y-0.5 transition-transform flex items-center gap-2"
              >
                <span>Verify Credential</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified by Institution</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const POLAROID_CSS = `
.pl-cert-root {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  color: #000000;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
  outline: none;
  cursor: grab;
  border: 2px dashed #000000;
  border-radius: 8px;
  background-image: 
    linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
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

/* Polaroid Print Styling with Sketchbook look */
.pl-cert-print {
  margin-top: 14px;
  background: #ffffff;
  padding: 10px 10px 6px;
  border: 2px solid #000000;
  border-radius: 4px;
  box-shadow: 4px 6px 0 #000000;
  transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.4s ease;
}

.pl-cert-card[data-on='0'] .pl-cert-print {
  transform: scale(0.9);
  opacity: 0.85;
  box-shadow: 2px 4px 0 rgba(0, 0, 0, 0.6);
}

.pl-cert-card[data-on='1'] .pl-cert-print {
  transform: scale(1.03);
}

/* Inner photo frame */
.pl-cert-shot {
  position: relative;
  aspect-ratio: 1.08;
  overflow: hidden;
  background: #fafafa;
  border: 1.5px solid #000000;
  display: flex;
}

.pl-cert-parchment {
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  background-color: #ffffff;
  background-image: radial-gradient(#000000 0.75px, transparent 0.75px);
  background-size: 12px 12px;
}

.pl-cert-border {
  width: 100%;
  height: 100%;
  border: 1px dashed #000000;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
}

/* Note handwriting at bottom of polaroid */
.pl-cert-note {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 6px 0;
  font-family: ui-monospace, monospace;
  font-size: 12px;
  font-weight: 800;
  color: #000000;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
}

/* Wooden Clothesline Peg */
.pl-cert-peg {
  position: absolute;
  left: 50%;
  top: 0;
  width: 12px;
  height: 30px;
  margin-left: -6px;
  border-radius: 2px;
  border: 2px solid #000000;
  z-index: 10;
  transition: background-color 0.3s ease;
}

.pl-cert-peg::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 10px;
  width: 4px;
  height: 8px;
  background: #000000;
  border-radius: 1px;
}

/* Dark Mode Support */
html.dark .pl-cert-root {
  border-color: #ffffff;
  background-color: #0c0c0c;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
}

html.dark .pl-cert-string path {
  stroke: #ffffff;
}

html.dark .pl-cert-print {
  background: #171717;
  border-color: #ffffff;
  color: #ffffff;
}

html.dark .pl-cert-shot {
  background: #111111;
  border-color: #ffffff;
}

html.dark .pl-cert-parchment {
  background-color: #1a1a1a;
  background-image: radial-gradient(#ffffff 0.75px, transparent 0.75px);
}

html.dark .pl-cert-border {
  border-color: #ffffff;
  background: #171717;
  color: #ffffff;
}

html.dark .pl-cert-note {
  color: #ffffff;
}

html.dark .pl-cert-peg::after {
  background: #ffffff;
}
`
