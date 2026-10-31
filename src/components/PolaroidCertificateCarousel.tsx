"use client"

import * as React from "react"
import { Certificate } from "@/data/portfolioData"
import { Award, ShieldCheck, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

/**
 * PolaroidCertificateCarousel — Black & White Sketchbook Polaroid Line Carousel.
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
    const root = rootRef.current
    if (!root || n === 0) return
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let visible = true
    let raf = 0
    let prev = performance.now()
    const S = sim.current

    const frame = (now: number) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.033, (now - prev) / 1000)
      prev = now
      const { w, h, cw } = size
      const y0 = Math.max(35, h * 0.16)
      const d = drag.current
      let lineVel: number

      if (d && d.moved) {
        lineVel = d.v * 1000
      } else {
        const before = S.off
        ;[S.off, S.vel] = springStep(S.off, S.vel, S.target, dt)
        lineVel = -(S.off - before) / Math.max(dt, 1e-3)
      }

      const o = opts.current
      const g = reduce ? 0 : o.swing
      const near = nearestAt(S.off, spacing, n)

      for (let i = 0; i < n; i++) {
        const el = cards.current[i]
        if (!el) continue
        const x = w / 2 + i * spacing - S.off
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = "hidden"
          continue
        }
        el.style.visibility = "visible"
        let a = S.a[i] || 0
        let av = S.w[i] || 0
        ;[a, av] = swingStep(a, av, lineVel, dt, g)
        if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g
        S.a[i] = a
        S.w[i] = av
        const y = stringY(x, w, y0, o.sag) - 6
        el.style.transform = `translate(${(x - cw / 2).toFixed(1)}px, ${y.toFixed(1)}px) rotate(${a.toFixed(4)}rad)`
        el.style.zIndex = String(i === near ? n + 2 : n - Math.abs(i - near))
      }

      pathRef.current?.setAttribute(
        "d",
        `M0 ${y0} Q${w / 2} ${y0 + 2 * o.sag} ${w} ${y0}`
      )

      if (near !== activeRef.current) {
        activeRef.current = near
        setActive(near)
      }

      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) {
        prev = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(root)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [size, spacing, n])

  // Autoplay
  React.useEffect(() => {
    if (!autoplay || n < 2) return
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return
      goTo(activeRef.current >= n - 1 ? 0 : activeRef.current + 1)
    }, autoplay)
    return () => window.clearInterval(t)
  }, [autoplay, n, goTo])

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".pl-cert-controls")) return
    lastTouch.current = performance.now()
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      setDragging(true)
      rootRef.current?.setPointerCapture(e.pointerId)
    }
    if (!d.moved) return
    const dt = Math.max(1, e.timeStamp - d.lt)
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v
    d.lx = e.clientX
    d.lt = e.timeStamp
    const max = (n - 1) * spacing
    let off = d.off - dx
    if (off < 0) off *= 0.35
    if (off > max) off = max + (off - max) * 0.35
    sim.current.off = off
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
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>

        {/* Hanging Polaroid Certificate Prints */}
        {certificates.map((cert, i) => {
          const isCurrent = i === active
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
              <div className="pl-cert-print">
                {/* Certificate Emblem Parchment View */}
                <div className="pl-cert-shot">
                  <div className="pl-cert-parchment">
                    {/* Inner Certificate Border */}
                    <div className="pl-cert-border">
                      <div className="flex items-center justify-between w-full pb-1 border-b border-black text-[9px] font-mono font-bold uppercase tracking-wider">
                        <span>CERT #{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                        <span>{cert.issueDate}</span>
                      </div>

                      {/* Laurel Crest Emblem */}
                      <div className="my-auto text-center space-y-1 py-1">
                        <div className="inline-block p-2 rounded-full border-2 border-black bg-white shadow-[2px_2px_0_#000]">
                          <Award className="w-6 h-6 text-black" />
                        </div>
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-black block">
                          VERIFIED CREDENTIAL
                        </div>
                        <div className="font-editorial font-bold text-xs uppercase line-clamp-1 text-black px-1">
                          {cert.issuer}
                        </div>
                      </div>

                      {/* Category tag at bottom of photo area */}
                      <div className="w-full text-center pt-1 border-t border-black font-mono text-[8.5px] font-bold uppercase tracking-wide truncate">
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

              {/* Handcrafted Clothesline Wooden Peg */}
              <div className="pl-cert-peg" />
            </div>
          )
        })}
      </div>

      {/* Interactive Detail Drawer & Controls */}
      {activeCert && (
        <div className="sketch-box p-6 sm:p-8 space-y-6 pl-cert-controls bg-white dark:bg-stone-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="sketch-stamp bg-indigo-600 text-white dark:bg-white dark:text-black">
                  ACTIVE CERTIFICATE 0{active + 1} / 0{n}
                </span>
                <span className="font-mono text-xs font-bold uppercase text-indigo-600 dark:text-stone-300">
                  {activeCert.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-black dark:text-white tracking-tight mt-2">
                {activeCert.title}
              </h2>
              <p className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 mt-1">
                Issued by {activeCert.issuer} • {activeCert.issueDate}
              </p>
            </div>

            {/* Stepper Buttons & Counter */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-black dark:text-white px-3 py-1 border-2 border-black dark:border-white rounded-full bg-stone-50 dark:bg-stone-800">
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
              <span className="text-[10px] font-mono font-bold uppercase text-stone-500 dark:text-stone-400 block">
                SPECIALIZED KNOWLEDGE &amp; SKILLS:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {activeCert.skillsLearned.map((skill) => (
                  <span
                    key={skill}
                    className="border border-indigo-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-stone-200"
                  >
                    ✦ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Verification Footer */}
          <div className="pt-4 border-t-2 border-dashed border-black dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div className="font-mono text-xs text-stone-600 dark:text-stone-400">
              Credential ID: <span className="font-bold text-black dark:text-white">{activeCert.credentialId || "VERIFIED-ON-FILE"}</span>
            </div>

            {activeCert.credentialUrl ? (
              <a
                href={activeCert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="sketch-button-solid text-xs py-2 px-5 inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Credential on Issuer Site</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <span className="font-mono text-xs font-bold text-stone-600 dark:text-stone-400">
                Verified On-Record
              </span>
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

/* Polaroid Print Styling with Black & White Sketchbook look */
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
  box-shadow: 6px 10px 0 #000000;
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

/* Wooden Clothesline Peg in B&W Hand-Drawn style */
.pl-cert-peg {
  position: absolute;
  left: 50%;
  top: 0;
  width: 12px;
  height: 30px;
  margin-left: -6px;
  border-radius: 2px;
  background: #ffffff;
  border: 2px solid #000000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.7);
  z-index: 10;
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
  box-shadow: 4px 6px 0 #ffffff;
}

html.dark .pl-cert-card[data-on='0'] .pl-cert-print {
  box-shadow: 2px 4px 0 rgba(255, 255, 255, 0.35);
}

html.dark .pl-cert-card[data-on='1'] .pl-cert-print {
  box-shadow: 6px 10px 0 #ffffff;
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

html.dark .pl-cert-border * {
  color: #ffffff !important;
  border-color: #ffffff !important;
}

html.dark .pl-cert-note {
  color: #ffffff;
}

html.dark .pl-cert-peg {
  background: #171717;
  border-color: #ffffff;
  box-shadow: 2px 2px 0 rgba(255, 255, 255, 0.7);
}

html.dark .pl-cert-peg::after {
  background: #ffffff;
}
`
