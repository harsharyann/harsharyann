"use client"

import React, { useState } from "react"
import { portfolioData, Certificate, LaurelItem } from "@/data/portfolioData"
import { usePortfolio } from "@/context/PortfolioContext"
import { Sparkles, Award, ShieldCheck, Trophy, BookOpen, FileText, ExternalLink, Eye, EyeOff, Bookmark, ArrowUpRight } from "lucide-react"
import { PolaroidCertificateCarousel } from "@/components/PolaroidCertificateCarousel"

/**
 * Handcrafted Doodle #1 — The Laurel Medal 🏅
 */
function MedalRibbonDoodle({ className = "", isPhone = false }: { className?: string; isPhone?: boolean }) {
  if (isPhone) {
    return (
      <div className={`relative inline-flex items-center ${className}`} aria-hidden="true">
        <svg
          viewBox="0 0 100 110"
          className="w-8 h-10 drop-shadow-[1.5px_1.5px_0_rgba(0,0,0,0.15)] filter overflow-visible"
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
      </div>
    );
  }

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
  const [activeLaurelType, setActiveLaurelType] = useState<"all" | "award" | "paper" | "book">("all")
  const [isLaurelsCollapsed, setIsLaurelsCollapsed] = useState(false)

  const showLaurelsSection = portfolio?.personal?.showLaurelsSection !== false
  const rawLaurelItems: LaurelItem[] = portfolio?.laurelItems || portfolioData.laurelItems || []
  // Surface only items that are not explicitly hidden
  const visibleLaurels = rawLaurelItems.filter((item) => item.isVisible !== false)

  const awardsList = visibleLaurels.filter((item) => item.type === "award")
  const papersList = visibleLaurels.filter((item) => item.type === "paper")
  const booksList = visibleLaurels.filter((item) => item.type === "book")

  const filteredLaurels =
    activeLaurelType === "all"
      ? visibleLaurels
      : visibleLaurels.filter((item) => item.type === activeLaurelType)

  const dynamicCategoryNames = React.useMemo(() => {
    // Surface only categories that actually contain at least one certificate to avoid empty (0) pills
    const fromCerts = Array.from(
      new Set((certsList || []).map((c) => c.category?.trim()))
    ).filter(Boolean) as string[]

    return fromCerts
  }, [certsList])

  // Reset active filter if current active category no longer exists
  React.useEffect(() => {
    if (activeCategory !== "All" && !dynamicCategoryNames.includes(activeCategory)) {
      setActiveCategory("All")
    }
  }, [activeCategory, dynamicCategoryNames])

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
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading inline-flex items-center gap-2 sm:gap-3 flex-wrap">
              <span>Certifications and Laurels</span>
              {/* On phone: Cute laurel medal doodle placed directly next to 'LAURELS' */}
              <span className="inline-flex lg:hidden shrink-0 -mt-1 sm:-mt-2">
                <MedalRibbonDoodle isPhone />
              </span>
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
              Verified academic achievements, hackathon laurels, and institutional recognitions presented in compact widescreen landscape prints.
            </p>
          </div>

          {/* On laptop & desktop: keep the right-hand Medal Doodle with speech bubble */}
          <div className="hidden lg:block self-start lg:self-end">
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

      {/* ── LAURELS, RESEARCH PAPERS & PUBLISHED BOOKS SUBSECTION ── */}
      {showLaurelsSection && (
        <div className="pt-8 sm:pt-14 border-t-2 border-dashed border-black/30 dark:border-stone-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-black/15 dark:border-stone-800">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-mono text-[10px] font-black uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Scholarship, Honors &amp; Publications</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white font-hero-heading flex items-center gap-2">
                <span>{portfolio?.personal?.laurelsTitle || "Laurels, Research & Published Works"}</span>
              </h3>
              <p className="text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400">
                {portfolio?.personal?.laurelsSubtitle || "Academic accolades, peer-reviewed research papers, and published technical literature."}
              </p>
            </div>

            {/* Hide / Unhide Collapse Toggle Button on Main Site */}
            <button
              type="button"
              onClick={() => setIsLaurelsCollapsed((prev) => !prev)}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-black dark:text-white font-mono text-xs font-bold shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-all cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
            >
              {isLaurelsCollapsed ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>Show Section ({visibleLaurels.length})</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                  <span>Hide Section</span>
                </>
              )}
            </button>
          </div>

          {!isLaurelsCollapsed && (
            <div className="space-y-6">
              {/* Type Filter Pills */}
              {visibleLaurels.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
                  <button
                    type="button"
                    onClick={() => setActiveLaurelType("all")}
                    className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeLaurelType === "all"
                        ? "bg-black text-white shadow-[2px_2px_0_#f59e0b]"
                        : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                    }`}
                  >
                    <span>ALL ({visibleLaurels.length})</span>
                  </button>

                  {awardsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveLaurelType("award")}
                      className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLaurelType === "award"
                          ? "bg-amber-500 text-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                          : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                      }`}
                    >
                      <Trophy className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                      <span>AWARDS ({awardsList.length})</span>
                    </button>
                  )}

                  {papersList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveLaurelType("paper")}
                      className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLaurelType === "paper"
                          ? "bg-indigo-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                          : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                      }`}
                    >
                      <FileText className="w-3 h-3 text-indigo-300" />
                      <span>RESEARCH PAPERS ({papersList.length})</span>
                    </button>
                  )}

                  {booksList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveLaurelType("book")}
                      className={`px-3 py-1 rounded-full border-2 border-black dark:border-white font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeLaurelType === "book"
                          ? "bg-rose-600 text-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                          : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[1.5px_1.5px_0_#000] dark:shadow-[1.5px_1.5px_0_#666]"
                      }`}
                    >
                      <BookOpen className="w-3 h-3 text-rose-300" />
                      <span>BOOKS &amp; CHAPTERS ({booksList.length})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Items Bento Grid */}
              {filteredLaurels.length === 0 ? (
                <div className="p-8 sm:p-12 text-center rounded-2xl bg-white/60 dark:bg-stone-900/40 border-2 border-dashed border-stone-300 dark:border-stone-700 font-mono space-y-1.5">
                  <p className="text-stone-800 dark:text-stone-200 font-bold text-sm">No items published in this category yet</p>
                  <p className="text-stone-500 text-xs">Switch filters or add new awards, research papers, and books via the Socius Admin Console.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                  {filteredLaurels.map((item) => {
                    const isAward = item.type === "award"
                    const isPaper = item.type === "paper"
                    const isBook = item.type === "book"

                    const theme = isAward
                      ? {
                          border: "border-black dark:border-amber-400/80",
                          shadow: "shadow-[4px_4px_0_#f59e0b] dark:shadow-[4px_4px_0_#fbbf24]",
                          badge: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700",
                          washi: "bg-amber-200/90 dark:bg-amber-400/30",
                          icon: <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />,
                          label: "Award & Laurel",
                          btn: "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black",
                        }
                      : isPaper
                      ? {
                          border: "border-black dark:border-indigo-400/80",
                          shadow: "shadow-[4px_4px_0_#6366f1] dark:shadow-[4px_4px_0_#818cf8]",
                          badge: "bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-700",
                          washi: "bg-indigo-200/90 dark:bg-indigo-400/30",
                          icon: <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />,
                          label: "Research Paper",
                          btn: "bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-black",
                        }
                      : {
                          border: "border-black dark:border-rose-400/80",
                          shadow: "shadow-[4px_4px_0_#f43f5e] dark:shadow-[4px_4px_0_#fb7185]",
                          badge: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-700",
                          washi: "bg-rose-200/90 dark:bg-rose-400/30",
                          icon: <BookOpen className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />,
                          label: "Published Book",
                          btn: "bg-rose-600 hover:bg-rose-500 text-white border-2 border-black",
                        }

                    return (
                      <article
                        key={item.id}
                        className={`relative p-5 rounded-[24px] bg-white dark:bg-stone-900 border-2 ${theme.border} ${theme.shadow} flex flex-col justify-between space-y-4 transition-all duration-200 hover:-translate-y-0.5`}
                      >
                        {/* Washi tape sticker */}
                        <div
                          className={`absolute -top-2.5 right-6 w-14 h-3.5 ${theme.washi} border border-black/30 dark:border-white/30 rotate-2 rounded-xs pointer-events-none shadow-xs`}
                          aria-hidden="true"
                        />

                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase border ${theme.badge}`}>
                              {theme.icon}
                              <span>{theme.label}</span>
                            </span>

                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-500 dark:text-stone-400 font-bold">
                              <span>{item.date}</span>
                              {item.badge && (
                                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="font-['Space_Grotesk'] font-black text-base text-stone-900 dark:text-stone-100 leading-snug">
                            {item.title}
                          </h4>

                          {/* Issuer / Publisher */}
                          <div className="space-y-1">
                            <p className="font-mono text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                              <Bookmark className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                              <span className="line-clamp-1">{item.issuerOrPublisher}</span>
                            </p>
                            {item.roleOrAward && (
                              <p className="font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 line-clamp-1 pl-5">
                                ✦ {item.roleOrAward}
                              </p>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className="font-mono text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 pt-1">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Footer Link */}
                        {item.link ? (
                          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noreferrer"
                              className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[2px_2px_0_#000] transition-all cursor-pointer ${theme.btn}`}
                            >
                              <span>{isAward ? "View Award Credential" : isPaper ? "Read Research Paper" : "View Publication"}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
