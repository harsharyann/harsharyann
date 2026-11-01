"use client"

import React, { useState } from "react"
import { portfolioData, Certificate } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import { Sparkles, Award, ShieldCheck } from "lucide-react"
import { PolaroidCertificateCarousel } from "@/components/PolaroidCertificateCarousel"

/**
 * Handcrafted Doodle #1 — The Laurel Medal 🏅
 */
function MedalRibbonDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 110"
        className="w-16 h-20 sm:w-20 sm:h-24 drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)] filter overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 38 12 L 20 60 L 34 54 L 46 64 L 42 20 Z" fill="#f43f5e" stroke="#000000" className="dark:stroke-white" strokeWidth="2.2" />
        <path d="M 62 12 L 80 60 L 66 54 L 54 64 L 58 20 Z" fill="#3b82f6" stroke="#000000" className="dark:stroke-white" strokeWidth="2.2" />
        <circle cx="50" cy="58" r="24" fill="#fbbf24" stroke="#000000" className="dark:stroke-white" strokeWidth="2.6" />
        <circle cx="50" cy="58" r="18" fill="#fef08a" stroke="#d97706" strokeWidth="1.6" strokeDasharray="3 2" />
        <path
          d="M 50 46 L 53 54 L 61 54 L 55 59 L 57 67 L 50 62 L 43 67 L 45 59 L 39 54 L 47 54 Z"
          fill="#d97706"
          stroke="none"
        />
        <path d="M 78 40 L 82 44 M 82 40 L 78 44" stroke="#f59e0b" strokeWidth="2" />
        <path d="M 18 36 L 22 40 M 22 36 L 18 40" stroke="#10b981" strokeWidth="2" />
      </svg>

      <div
        className="hidden sm:block ml-2 px-3 py-1.5 bg-amber-100 dark:bg-stone-800 border-2 border-black dark:border-white rounded-xl shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] text-xs font-bold rotate-[2deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        <span className="text-amber-950 dark:text-amber-200 text-sm">
          proof of craft 🏅
        </span>
      </div>
    </div>
  )
}

/**
 * Handcrafted Doodle #2 — The Clothesline Clothespin 🧷
 */
function ClothespinGuideDoodle({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 110 50"
        className="w-24 sm:w-28 h-12 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 4 20 Q 55 35 106 20" stroke="#8b5cf6" className="dark:stroke-purple-400" strokeWidth="2.4" strokeDasharray="4 3" />
        <g transform="translate(50, 10)">
          <rect x="-4" y="0" width="8" height="24" rx="2" fill="#facc15" stroke="#000000" className="dark:stroke-white" strokeWidth="2" />
          <circle cx="0" cy="8" r="1.5" fill="#000000" className="dark:fill-white" stroke="none" />
        </g>
        <path d="M 72 32 Q 85 28 95 36" stroke="#06b6d4" strokeWidth="1.8" />
      </svg>
      <span
        className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-300 rotate-[-2deg]"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        polaroid credential bento ✦
      </span>
    </div>
  )
}

export function CertificatesSection({ id = "certificates" }: { id?: string }) {
  const { data: portfolio } = usePortfolio()
  const certsList: Certificate[] = portfolio?.certificates || portfolioData.certificates
  const [activeCategory, setActiveCategory] = useState("All")

  const dynamicCategoryNames = React.useMemo(() => {
    const fromConfig = (portfolio?.certificateCategories && portfolio.certificateCategories.length > 0)
      ? portfolio.certificateCategories
      : []
    const fromCerts = (portfolio?.certificates || []).map((c) => c.category)
    const merged = Array.from(new Set([...fromConfig, ...fromCerts])).filter(Boolean)
    if (merged.length > 0) return merged

    return [
      "Machine Learning",
      "Data Science",
      "Programming",
      "Mathematics & Hackathons",
    ]
  }, [portfolio?.certificateCategories, portfolio?.certificates])

  const COLOR_PALETTE = ["indigo", "emerald", "cyan", "amber", "red", "purple", "teal", "orange"]

  const categories = React.useMemo(() => {
    return [
      { label: "All", name: "ALL CERTIFICATES", color: "all" },
      ...dynamicCategoryNames.map((name, idx) => ({
        label: name,
        name: name.toUpperCase(),
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
      })),
    ]
  }, [dynamicCategoryNames])

  const filtered =
    activeCategory === "All"
      ? certsList
      : certsList.filter((c) => c.category === activeCategory)

  return (
    <section id={id} className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-10 sm:space-y-12 scroll-mt-14">
      {/* ── HEADER ── */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2">
            <span className="sketch-stamp bg-amber-400 text-black font-black shadow-[2px_2px_0_#000] font-hero-heading">
              ZONE 04 • LAURELS &amp; CERTIFICATES
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading">
              Certifications &amp; Laurels
            </h2>

            <svg
              className="w-48 sm:w-64 h-3 text-amber-500 overflow-visible"
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
              Verified academic achievements, hackathon laurels, and institutional recognitions presented in compact widescreen landscape prints. Tap any certificate to zoom and securely inspect high-resolution details.
            </p>
          </div>

          <div className="self-start lg:self-end">
            <MedalRibbonDoodle />
          </div>
        </div>

        {/* ── FILTER PILLS ── */}
        <div className="pt-2 flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          {categories.map((cat) => {
            const count =
              cat.label === "All"
                ? certsList.length
                : certsList.filter((c) => c.category === cat.label).length

            const isActive = activeCategory === cat.label

            let activeStyle = "bg-black text-white shadow-[2.5px_2.5px_0_#f59e0b]"
            if (cat.color === "purple") {
              activeStyle = "bg-purple-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "emerald") {
              activeStyle = "bg-emerald-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "cyan") {
              activeStyle = "bg-sky-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "amber") {
              activeStyle = "bg-amber-400 text-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "red") {
              activeStyle = "bg-red-800 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "indigo") {
              activeStyle = "bg-indigo-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "teal") {
              activeStyle = "bg-teal-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            } else if (cat.color === "orange") {
              activeStyle = "bg-orange-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
            }

            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.label)}
                className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? activeStyle
                    : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                }`}
              >
                {isActive && <Sparkles className="w-3 h-3 text-amber-300" />}
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-bold">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── UNIFIED POLAROID BENTO VAULT (Compact & Proportional) ── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold text-stone-600 dark:text-stone-400">
          <ClothespinGuideDoodle />
          <span className="text-amber-700 dark:text-amber-300 font-black">
            {filtered.length} {filtered.length === 1 ? "CREDENTIAL" : "CREDENTIALS"} IN UNIFIED VAULT
          </span>
        </div>

        <PolaroidCertificateCarousel certificates={filtered} />
      </div>
    </section>
  )
}
