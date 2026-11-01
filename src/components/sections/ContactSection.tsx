"use client"

import React, { useState } from "react"
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
function AirmailLetterDoodle({ className = "" }: { className?: string }) {
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

  const emailToUse = portfolio?.personal?.email || portfolioData.personal.email
  const locationToUse = portfolio?.personal?.location || portfolioData.personal.location

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
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-10 sm:space-y-12 scroll-mt-14">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-rose-500 text-white font-black shadow-[2px_2px_0_#000]">
              CHAPTER 05 • DISPATCH &amp; INQUIRY
            </span>
            <span className="hidden sm:inline-block font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [DIRECT LINE]
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for Research &amp; Teams
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-400 text-amber-800 dark:text-amber-300 font-bold">
              <Clock className="w-3 h-3 text-amber-500" />
              Response &lt; 24h
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
              Send a Dispatch
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

          <div className="self-start lg:self-end">
            <AirmailLetterDoodle />
          </div>
        </div>
      </div>

      {/* ── GRID: DISPATCH FORM & COORDINATES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="p-5 sm:p-7 rounded-3xl border-2 sm:border-3 border-black dark:border-white/20 bg-white dark:bg-stone-900 shadow-[6px_8px_0_#000] dark:shadow-[6px_8px_0_#fff] space-y-5">
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
          {/* Direct Email Card */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-white/20 bg-amber-50/60 dark:bg-stone-900 shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24] space-y-3">
            <span className="font-mono text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>DIRECT INBOX</span>
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800">
              <span className="font-mono text-xs font-bold text-black dark:text-white truncate">
                {emailToUse}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Location & Timezone Card */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-white/20 bg-cyan-50/60 dark:bg-stone-900 shadow-[4px_4px_0_#06b6d4] dark:shadow-[4px_4px_0_#38bdf8] space-y-3">
            <span className="font-mono text-xs font-black uppercase text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-600" />
              <span>COORDINATES</span>
            </span>
            <p className="font-mono text-xs text-stone-800 dark:text-stone-200">
              {locationToUse}
            </p>
            <p className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
              Standard Timezone: UTC+5:30 (IST)
            </p>
          </div>

          {/* Social Profiles */}
          <div className="p-5 rounded-2xl border-2 border-black dark:border-white/20 bg-purple-50/60 dark:bg-stone-900 shadow-[4px_4px_0_#8b5cf6] dark:shadow-[4px_4px_0_#a855f7] space-y-3">
            <span className="font-mono text-xs font-black uppercase text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>DIGITAL PROFILES</span>
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {portfolio?.socialLinks?.github && (
                <a
                  href={portfolio.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-black dark:border-white bg-white dark:bg-stone-800 font-mono text-xs font-bold text-black dark:text-white flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform shadow-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {portfolio?.socialLinks?.linkedin && (
                <a
                  href={portfolio.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-black dark:border-white bg-white dark:bg-stone-800 font-mono text-xs font-bold text-black dark:text-white flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform shadow-xs"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              {portfolio?.socialLinks?.leetcode && (
                <a
                  href={portfolio.socialLinks.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-black dark:border-white bg-white dark:bg-stone-800 font-mono text-xs font-bold text-black dark:text-white flex items-center gap-1.5 hover:-translate-y-0.5 transition-transform shadow-xs"
                >
                  <LeetCodeIcon className="w-3.5 h-3.5" />
                  <span>LeetCode</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
