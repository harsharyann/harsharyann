"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { portfolioData } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import {
  Check,
  Send,
  Copy,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  MessageSquare,
  Clock,
  User,
  Tag,
  CheckCircle2,
} from "lucide-react"
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/SocialIcons"

/**
 * Handcrafted Doodle #1 — The Airmail Flying Letter 💌
 */
function AirmailLetterDoodle({ className = "", isPhone = false }: { className?: string; isPhone?: boolean }) {
  if (isPhone) {
    return (
      <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 70 55"
          className="w-8 h-8 drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)] filter overflow-visible"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g transform="translate(10, 8) rotate(8)">
            <rect
              x="0"
              y="0"
              width="44"
              height="30"
              rx="3"
              fill="#ffffff"
              stroke="#000000"
              className="dark:fill-stone-800 dark:stroke-white"
              strokeWidth="2.4"
            />
            <path d="M 0 0 L 22 17 L 44 0" stroke="#000000" className="dark:stroke-white" strokeWidth="2.2" />
            <path d="M 0 30 L 15 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
            <path d="M 44 30 L 29 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
            <circle cx="22" cy="17" r="4.5" fill="#f43f5e" stroke="none" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 110 90"
        className="w-18 h-16 sm:w-22 sm:h-20 drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] filter overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M 6 70 Q 22 84 36 68 Q 46 54 38 46 Q 28 40 28 54 Q 30 70 54 62 Q 70 56 80 50"
          stroke="#06b6d4"
          className="dark:stroke-cyan-400"
          strokeWidth="2.2"
          strokeDasharray="3 3.5"
        />
        <g transform="translate(56, 16) rotate(12)">
          <rect
            x="0"
            y="0"
            width="44"
            height="30"
            rx="3"
            fill="#ffffff"
            stroke="#000000"
            className="dark:fill-stone-800 dark:stroke-white"
            strokeWidth="2.4"
          />
          <path d="M 0 0 L 22 17 L 44 0" stroke="#000000" className="dark:stroke-white" strokeWidth="2.2" />
          <path d="M 0 30 L 15 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
          <path d="M 44 30 L 29 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
          <circle cx="22" cy="17" r="4.5" fill="#f43f5e" stroke="none" />
        </g>
        <path d="M 94 14 L 98 18 M 98 14 L 94 18" stroke="#f59e0b" strokeWidth="2" />
      </svg>

      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-rose-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-xs font-bold rotate-[1.5deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-rose-950 dark:text-rose-200 text-sm">
          drop a note anytime 💌
        </span>
      </div>
    </div>
  )
}

/**
 * Handcrafted Doodle #2 — The Postal Mailbox 📬
 */
function PostalMailboxDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 80"
        className="w-16 sm:w-20 h-14 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M 22 62 L 22 34 C 22 20 32 14 50 14 C 68 14 78 20 78 34 L 78 62 Z"
          fill="#3b82f6"
          stroke="#000000"
          className="dark:stroke-white"
          strokeWidth="2.4"
        />
        <rect x="30" y="32" width="40" height="20" rx="3" fill="#ffffff" stroke="#000000" className="dark:stroke-white dark:fill-stone-900" strokeWidth="2" />
        <line x1="36" y1="42" x2="64" y2="42" stroke="#f59e0b" strokeWidth="2" />
        <path d="M 78 26 L 90 20 L 90 32" stroke="#f43f5e" strokeWidth="2.4" strokeLinejoin="round" fill="none" />
        <rect x="46" y="62" width="8" height="16" fill="#18181b" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-sky-700 dark:text-sky-300 rotate-[-1deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        direct dispatch 📬
      </span>
    </div>
  )
}

/**
 * Handcrafted Doodle #3 — The Flying Origami Paper Plane (Takeoff Animation) ✈️
 */
function FlyingPaperPlaneAnimation({ isFlying }: { isFlying: boolean }) {
  return (
    <AnimatePresence>
      {isFlying && (
        <div className="pointer-events-none fixed inset-0 z-[100001] overflow-hidden select-none">
          <motion.div
            initial={{ x: "-15vw", y: "85vh", rotate: -35, scale: 0.6, opacity: 0 }}
            animate={{
              x: ["-5vw", "25vw", "60vw", "115vw"],
              y: ["85vh", "45vh", "22vh", "-18vh"],
              rotate: [-35, -15, -28, -8],
              scale: [0.6, 1.15, 1.25, 0.85],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.9,
              ease: [0.25, 1, 0.5, 1],
              times: [0, 0.28, 0.7, 1],
            }}
            className="relative flex items-center gap-3"
          >
            {/* Trailing Wind Vapor Trail */}
            <svg
              viewBox="0 0 160 50"
              className="w-28 sm:w-36 h-10 overflow-visible opacity-75"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            >
              <path d="M 0 25 Q 40 10 80 25 T 160 25" strokeLinecap="round" />
            </svg>

            {/* Handcrafted Origami Paper Plane */}
            <div className="relative drop-shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
              <svg
                viewBox="0 0 90 70"
                className="w-16 sm:w-22 h-14 sm:h-18 overflow-visible"
                fill="none"
                stroke="#000000"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="10,35 85,10 45,45 10,35" fill="#ffffff" className="dark:fill-stone-100" />
                <polygon points="45,45 85,10 50,60 45,45" fill="#e0f2fe" className="dark:fill-sky-200" />
                <polygon points="45,45 85,10 80,35 45,45" fill="#bae6fd" className="dark:fill-sky-300" />
                <circle cx="58" cy="28" r="4.5" fill="#f43f5e" stroke="none" />
              </svg>
              <span
                className="absolute -top-3.5 left-8 text-xs font-black uppercase text-rose-600 dark:text-rose-400 whitespace-nowrap bg-white/95 dark:bg-stone-900/95 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-[2px_2px_0_#f43f5e]"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                Dispatch in flight ✈️✨
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ContactSection({ id = "contact" }: { id?: string }) {
  const { data: portfolio } = usePortfolio()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)
  const [showFlight, setShowFlight] = useState(false)

  // Real-time auto-updating live clock (Day, Date, Month, Time in user's timezone)
  const [liveTime, setLiveTime] = useState<{
    time: string;
    day: string;
    date: string;
  }>({
    time: "",
    day: "",
    date: "",
  });

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime({
        time: now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        day: now.toLocaleDateString("en-US", {
          timeZone: "Asia/Kolkata",
          weekday: "long",
        }),
        date: now.toLocaleDateString("en-US", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const personal = portfolio?.personal;
  const emailToUse = personal?.email || portfolioData.personal.email
  const locationToUse = personal?.location || portfolioData.personal.location

  const handleCopy = () => {
    navigator.clipboard.writeText(emailToUse)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus("success")
        setShowFlight(true)
        setTimeout(() => setShowFlight(false), 3400)
        setFormData({ name: "", email: "", subject: "", message: "" })
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#3b82f6"],
        })
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-10 sm:space-y-12 scroll-mt-14 relative">
      {/* ── HIGH-FLYING PAPER AIRPLANE DISPATCH ANIMATION ── */}
      <FlyingPaperPlaneAnimation isFlying={showFlight} />

      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>Send a Dispatch</span>
              {/* On phone: Cute airmail letter doodle placed directly next to 'DISPATCH' */}
              <span className="inline-flex lg:hidden shrink-0 -mt-1 sm:-mt-2">
                <AirmailLetterDoodle isPhone />
              </span>
            </h2>

            <svg
              className="w-48 sm:w-64 h-3 text-rose-500 overflow-visible"
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

            <p className="text-xs sm:text-sm font-mono text-stone-700 dark:text-stone-300 leading-relaxed">
              Have an interesting machine learning challenge, internship opportunity, or algorithmic project in mind? Drop your inquiry directly into my terminal.
            </p>
          </div>

          {/* On laptop & desktop: keep the right-hand Airmail Doodle with speech bubble */}
          <div className="hidden lg:block self-start lg:self-end">
            <AirmailLetterDoodle />
          </div>
        </div>
      </div>

      {/* ── GRID: DISPATCH FORM & COORDINATES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-7 rounded-[32px] liquid-bento-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10 dark:border-white/10">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>DIRECT INQUIRY DISPATCH</span>
              </span>
              <PostalMailboxDoodle />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Your Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-black dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Your Email *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-black dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
                    />
                    <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Subject / Topic *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-black dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
                  />
                  <Tag className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Message *
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-black dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500 transition-colors shadow-xs resize-none"
                  />
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[3px_3px_0_#f43f5e] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === "sending" ? (
                  <span>DISPATCHING...</span>
                ) : status === "success" ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 dark:text-emerald-600 font-black">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>DISPATCH DELIVERED!</span>
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-rose-400" />
                    <span>SEND DISPATCH</span>
                  </>
                )}
              </button>

              {status === "success" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-emerald-800 dark:text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Thank you! Your message has been received directly. I will follow up shortly.</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-400 text-rose-800 dark:text-rose-300 font-mono text-xs flex items-center gap-2">
                  <span>Failed to send. Please reach out directly to {emailToUse}.</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Coordinates Column */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct Electronic Mail Card */}
          <div className="p-5 rounded-[28px] liquid-bento-card space-y-3">
            <span className="font-mono text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>ELECTRONIC MAIL</span>
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white/80 dark:bg-stone-800/80">
              <span className="font-mono text-xs font-bold text-black dark:text-white truncate">
                {emailToUse}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Copy electronic mail"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Classic Live Coordinates & Current Dispatch Card */}
          <div className="p-5 sm:p-6 rounded-[28px] liquid-bento-card space-y-4 border-2 border-black dark:border-white shadow-[4px_4px_0_#06b6d4] dark:shadow-[4px_4px_0_#38bdf8] bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl relative overflow-hidden">
            {/* Header with live station indicator */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-stone-200 dark:border-stone-800">
              <span className="font-mono text-xs font-black uppercase text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span>CURRENT COORDINATES</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-black uppercase border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>LIVE STATION</span>
              </span>
            </div>

            {/* Field Grid: Classic Telegram / Dispatch Details */}
            <div className="space-y-3 font-mono text-xs">
              {/* Location & Country */}
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 w-24">
                  LOCATION:
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {personal?.currentCountry ? `${personal.currentCountry} • ` : ""}
                  {personal?.currentCity || locationToUse}
                </span>
              </div>

              {/* Current Role / Workplace ("kha job kr rha hu") */}
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 w-24">
                  STATION / JOB:
                </span>
                <span className="font-black text-amber-700 dark:text-amber-400">
                  {personal?.currentWork || "Teaching Assistant @ IIT Madras"}
                </span>
              </div>

              {/* Real-time Ticking Clock (Day, Date, Month, Time, Timezone) */}
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 w-24">
                  LOCAL TIME:
                </span>
                <div className="space-y-0.5">
                  <div className="font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: "12s" }} />
                    <span className="text-cyan-700 dark:text-cyan-300 font-bold tracking-wider">
                      {liveTime.time || "22:15:00"}
                    </span>
                    <span className="text-[10px] text-stone-500 font-normal">
                      {personal?.currentTimezone || "UTC+5:30 (IST)"}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{liveTime.day ? `${liveTime.day}, ` : ""}{liveTime.date || "01 Nov 2026"}</span>
                  </div>
                </div>
              </div>

              {/* Status Note / Availability */}
              <div className="flex items-start gap-2 pt-1 border-t border-dashed border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 w-24">
                  STATUS NOTE:
                </span>
                <span className="text-stone-600 dark:text-stone-400 italic">
                  &ldquo;{personal?.currentStatusNote || "Open for Opportunities & Collaborations"}&rdquo;
                </span>
              </div>
            </div>

            {/* Classic Dispatch Stamp at Bottom */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[10px] font-mono text-stone-400">
              <span className="tracking-widest uppercase">DISPATCH VERIFIED</span>
              <span className="font-bold text-stone-500">IND // 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
