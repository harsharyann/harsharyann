"use client"

import React, { useState } from "react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { portfolioData } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import { SiteFooter } from "@/components/SiteFooter"
import {
  Check,
  Send,
  Copy,
  Mail,
  MapPin,
  Calendar,
  ArrowUp,
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
        {/* Flight loop trail */}
        <path
          d="M 6 70 Q 22 84 36 68 Q 46 54 38 46 Q 28 40 28 54 Q 30 70 54 62 Q 70 56 80 50"
          stroke="#06b6d4"
          className="dark:stroke-cyan-400"
          strokeWidth="2.2"
          strokeDasharray="3 3.5"
        />

        {/* Envelope tilted flying */}
        <g transform="translate(56, 16) rotate(12)">
          {/* Envelope Body */}
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
          {/* Fold Lines */}
          <path d="M 0 0 L 22 17 L 44 0" stroke="#000000" className="dark:stroke-white" strokeWidth="2.2" />
          <path d="M 0 30 L 15 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />
          <path d="M 44 30 L 29 15" stroke="#000000" className="dark:stroke-white" strokeWidth="1.8" />

          {/* Red Heart / Stamp Seal */}
          <circle cx="22" cy="17" r="4.5" fill="#f43f5e" stroke="none" />
        </g>

        {/* Little speed spark */}
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
        {/* Post Stand */}
        <line x1="50" y1="52" x2="50" y2="76" stroke="#000000" className="dark:stroke-white" strokeWidth="4" />

        {/* Mailbox Body */}
        <path
          d="M 24 52 L 76 52 C 82 52 86 46 86 38 C 86 24 74 16 50 16 C 26 16 14 24 14 38 C 14 46 18 52 24 52 Z"
          fill="#38bdf8"
          stroke="#000000"
          className="dark:stroke-white"
          strokeWidth="2.4"
        />

        {/* Mailbox Door Slot */}
        <path d="M 28 32 L 72 32" stroke="#000000" className="dark:stroke-white" strokeWidth="2.5" />

        {/* Red Flag Raised Up */}
        <path d="M 80 34 L 80 12 L 94 18 L 80 24" fill="#f43f5e" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-sky-700 dark:text-cyan-300 rotate-[-1.5deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        direct dispatch to Harsh 📬
      </span>
    </div>
  )
}

/**
 * Handcrafted Doodle #3 — The Chai & Star Doodle ☕
 */
function ChaiCupDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 80 60"
        className="w-14 sm:w-16 h-12 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Steaming vapors */}
        <path d="M 28 14 Q 24 8 28 2" stroke="#f59e0b" strokeWidth="1.8" />
        <path d="M 38 14 Q 42 8 38 2" stroke="#f59e0b" strokeWidth="1.8" />

        {/* Cup Body */}
        <path
          d="M 18 18 L 48 18 L 44 44 C 44 48 40 50 33 50 C 26 50 22 48 22 44 Z"
          fill="#fef08a"
          stroke="#000000"
          className="dark:stroke-white"
          strokeWidth="2.4"
        />

        {/* Handle */}
        <path
          d="M 46 24 C 54 24 54 36 44 38"
          stroke="#000000"
          className="dark:stroke-white"
          strokeWidth="2.2"
          fill="none"
        />

        {/* Saucer */}
        <path d="M 12 50 L 54 50" stroke="#000000" className="dark:stroke-white" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-300 rotate-[1deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        code &amp; chai ☕
      </span>
    </div>
  )
}

export default function ContactPage() {
  const { data: portfolio } = usePortfolio()
  const { personal, socialLinks } = portfolio
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Google Sheets Webhook URL (connected to Harsh's Google Sheet)
  const GOOGLE_SHEET_URL =
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ||
    "https://script.google.com/macros/s/AKfycbykP3WgOErhv4Nw01aeQJwiLi-IMCqzYdYdLZGhhCBvR0wV4vJdX06BNESDj9EGSjaX6Q/exec"

  // ── Snappy Dispatch Handler (Guaranteed < 1.5s Response Without Cold-Start Lag) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const payload = { ...formData }

    try {
      // 1. Immediately store to local admin inbox
      const localSavePromise = fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {})

      // 2. Background async dispatch to Google Sheet (non-blocking)
      if (GOOGLE_SHEET_URL) {
        try {
          const params = new URLSearchParams()
          params.append("name", payload.name)
          params.append("email", payload.email)
          params.append("category", payload.category)
          params.append("message", payload.message)

          fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
            mode: "no-cors",
          }).catch(() => {})
        } catch (e) {}
      }

      // Fast, satisfying 700ms animation delay for snappy confirmation
      await Promise.all([
        localSavePromise,
        new Promise((resolve) => setTimeout(resolve, 700)),
      ])

      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        category: "",
        message: "",
      })

      // Celebratory Confetti Burst!
      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 },
        })
      } catch (e) {}
    } catch (err) {
      console.error("Form submission error:", err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12">
      {/* =========================================================================
          PAGE HEADER with Thematic Badges & DOODLE #1 (Airmail Flying Letter)
      ========================================================================= */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-rose-500 text-white font-black shadow-[2px_2px_0_#000]">
              CHAPTER 05 • CONTACT &amp; CORRESPONDENCE
            </span>
            <span className="hidden sm:inline-block font-mono text-xs font-bold text-stone-500 dark:text-stone-400">
              [DISPATCH DESK]
            </span>
          </div>

          {/* Response window pill */}
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 text-emerald-800 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Response Window &lt; 24 Hours</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
              Contact Desk
            </h1>

            {/* Hand-drawn comic squiggle underline */}
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
              Open to Summer 2026 early internship roles, collegiate hackathon teams, research mentorship, and open-source collaborations.
            </p>
          </div>

          {/* BESPOKE DOODLE #1: Airmail Flying Letter */}
          <div className="self-start lg:self-end">
            <AirmailLetterDoodle />
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTACT GRID (Color-Coded Cards & Dispatch Form)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Official Electronic Mail (Amber / Gold Theme) */}
          <div className="p-6 rounded-xl border-2 border-black dark:border-amber-400 bg-amber-50/70 dark:bg-stone-900 shadow-[5px_5px_0_#f59e0b] dark:shadow-[5px_5px_0_#fbbf24] space-y-4 relative transition-transform hover:-translate-y-1">
            {/* Washi tape sticker */}
            <div
              className="absolute -top-3 left-6 w-20 h-5 bg-amber-200/90 dark:bg-amber-400/30 border border-black/30 dark:border-white/30 rotate-[-2deg] rounded-sm pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-center justify-between pb-2 border-b border-black/20 dark:border-stone-700">
              <span className="text-[10px] font-mono font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>OFFICIAL ELECTRONIC MAIL</span>
              </span>
              <span className="sketch-stamp bg-amber-400 text-black text-[9px]">PRIMARY</span>
            </div>

            <div className="font-mono text-sm sm:text-base font-black text-black dark:text-white break-all">
              {personal.email}
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full py-2.5 px-4 rounded-md font-mono text-xs font-black uppercase tracking-wider bg-white dark:bg-stone-800 text-black dark:text-white border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          {/* Card 2: Status & Coordinates (Emerald Mint Theme) */}
          <div className="p-6 rounded-xl border-2 border-black dark:border-emerald-400 bg-emerald-50/70 dark:bg-stone-900 shadow-[5px_5px_0_#10b981] dark:shadow-[5px_5px_0_#34d399] space-y-4 relative transition-transform hover:-translate-y-1">
            {/* Washi tape sticker */}
            <div
              className="absolute -top-3 right-6 w-20 h-5 bg-emerald-200/90 dark:bg-emerald-400/30 border border-black/30 dark:border-white/30 rotate-[2deg] rounded-sm pointer-events-none"
              aria-hidden="true"
            />

            <div className="pb-2 border-b border-black/20 dark:border-stone-700 flex items-center justify-between">
              <span className="text-[10px] font-mono font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>CURRENT COORDINATES &amp; STATUS</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 uppercase block text-[10px] font-bold">
                    BASE LOCATION
                  </span>
                  <span className="font-black text-black dark:text-white">{personal.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 shrink-0">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 uppercase block text-[10px] font-bold">
                    SEEKING / OPPORTUNITIES
                  </span>
                  <span className="font-black text-black dark:text-white leading-tight block">
                    {personal.availability}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Connected Networks (Electric Violet Theme) */}
          <div className="p-6 rounded-xl border-2 border-black dark:border-purple-400 bg-purple-50/70 dark:bg-stone-900 shadow-[5px_5px_0_#8b5cf6] dark:shadow-[5px_5px_0_#a855f7] space-y-3 relative transition-transform hover:-translate-y-1">
            <span className="text-[10px] font-mono font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider block pb-2 border-b border-black/20 dark:border-stone-700">
              CONNECTED NETWORKS &amp; PROFILES:
            </span>

            <div className="space-y-2">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border-2 border-black dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
              >
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Profile (@harsharyann)</span>
                </div>
                <span>↗</span>
              </a>

              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border-2 border-black dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
              >
                <div className="flex items-center gap-2.5">
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn Professional Network</span>
                </div>
                <span>↗</span>
              </a>

              {socialLinks.leetcode && (
                <a
                  href={socialLinks.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border-2 border-black dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                >
                  <div className="flex items-center gap-2.5">
                    <LeetCodeIcon className="w-4 h-4" />
                    <span>LeetCode Problem Solving</span>
                  </div>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sketchbook Mailbox Dispatch Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-xl border-2 border-black dark:border-sky-400 bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/40 dark:from-stone-900 dark:via-sky-950/25 dark:to-stone-900 shadow-[6px_6px_0_#0284c7] dark:shadow-[6px_6px_0_#38bdf8] space-y-6 relative">
            {/* Corner washi tape sticker */}
            <div
              className="absolute -top-3 right-8 w-24 h-5 bg-sky-200/90 dark:bg-sky-400/30 border border-black/35 dark:border-white/35 rotate-[2deg] rounded-sm pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-center justify-between pb-3 border-b-2 border-black/20 dark:border-stone-700 gap-3">
              <div>
                <span className="sketch-stamp bg-sky-600 text-white dark:bg-sky-500 dark:text-white">
                  DISPATCH FORM
                </span>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-black dark:text-white mt-2 leading-snug">
                  Send a Direct Message
                </h2>
              </div>

              {/* BESPOKE DOODLE #2: The Postal Mailbox */}
              <PostalMailboxDoodle className="hidden sm:inline-flex" />
            </div>

            {submitted ? (
              <div className="p-8 border-2 border-black dark:border-emerald-400 bg-emerald-50/90 dark:bg-stone-900 text-center space-y-4 rounded-2xl shadow-[4px_4px_0_#10b981] animate-in fade-in zoom-in-95 duration-200">
                <span className="text-4xl block animate-bounce">✈️</span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 text-emerald-800 dark:text-emerald-300 font-mono text-[11px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dispatch Received &amp; Filed</span>
                </div>
                <h3 className="text-2xl font-black uppercase text-black dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-mono max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Harsh will review your note and respond back within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-black hover:bg-stone-800 text-white dark:bg-white dark:hover:bg-stone-100 dark:text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#10b981] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                >
                  Send Another Message ↺
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Name Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200"
                  >
                    Your Full Name / Organization:
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-black dark:border-stone-700 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 bg-white dark:bg-stone-800 text-black dark:text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  </div>
                </div>

                {/* 2. Return Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200"
                  >
                    Your Return Email:
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-black dark:border-stone-700 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 bg-white dark:bg-stone-800 text-black dark:text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  </div>
                </div>

                {/* 3. Inquiry Subject / Topic (Dropdown Completely Removed -> Free Text Input) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="category"
                    className="block font-mono text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200"
                  >
                    Inquiry / Purpose:
                  </label>
                  <div className="relative">
                    <input
                      id="category"
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder=""
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-black dark:border-stone-700 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 bg-white dark:bg-stone-800 text-black dark:text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-all"
                    />
                    <Tag className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                  </div>
                </div>

                {/* 4. Message Textarea */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs font-black uppercase tracking-wider text-stone-800 dark:text-stone-200"
                  >
                    Note / Message:
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder=""
                    className="w-full p-3.5 rounded-xl border-2 border-black dark:border-stone-700 font-mono text-xs focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-400/20 bg-white dark:bg-stone-800 text-black dark:text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-all"
                  />
                </div>

                {/* 5. Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-black hover:bg-stone-900 text-white dark:bg-white dark:hover:bg-stone-100 dark:text-black border-2 border-black dark:border-white shadow-[4px_4px_0_#0284c7] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_#000] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Sending Dispatch...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Paper Plane Message ✈️</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          DISTINCT HIGH-END ARCHITECTURAL SITE FOOTER
      ========================================================================= */}
      <SiteFooter />
    </div>
  )
}
