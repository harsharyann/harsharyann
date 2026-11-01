"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Compass } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

interface ChapterSpineItem {
  id: string;
  num: string;
  name: string;
  label: string;
  color: string;
  shadow: string;
}

const CHAPTERS: ChapterSpineItem[] = [
  { id: "cover", num: "00", name: "Cover Portal", label: "Cover", color: "#facc15", shadow: "#ca8a04" },
  { id: "about", num: "01", name: "The Architect & Mind", label: "Bio", color: "#f59e0b", shadow: "#d97706" },
  { id: "projects", num: "02", name: "Project Lab & Code", label: "Lab", color: "#6366f1", shadow: "#4f46e5" },
  { id: "certificates", num: "03", name: "Certifications & Laurels", label: "Laurels", color: "#10b981", shadow: "#059669" },
  { id: "contact", num: "04", name: "Direct Communications", label: "Communications", color: "#f43f5e", shadow: "#e11d48" },
];

export function MagazineChapterSpine() {
  const { openCover } = usePortfolio();
  const [activeId, setActiveId] = useState<string>("cover");
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min(100, Math.max(0, Math.round((scrollY / docHeight) * 100))) : 0;
        setScrollPercent((prev) => (prev !== pct ? pct : prev));

        if (scrollY < 140) {
          setActiveId((prev) => (prev !== "cover" ? "cover" : prev));
          ticking = false;
          return;
        }

        const sectionIds = ["contact", "certificates", "projects", "about"];
        const midTop = window.innerHeight * 0.45;
        const midBottom = window.innerHeight * 0.15;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= midTop && rect.bottom >= midBottom) {
              setActiveId((prev) => (prev !== id ? id : prev));
              ticking = false;
              return;
            }
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "cover") {
      openCover();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="3D Magazine Chapter Spine Navigator"
      className="fixed right-4 xl:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end select-none"
      style={{ perspective: "1000px" }}
    >
      {/* ── 3D PHYSICAL SKETCHBOOK BOOKMARK SPINE ── */}
      <div className="relative p-2 rounded-2xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-2xl border-2 border-black dark:border-white shadow-[4px_4px_0_#000,inset_0_1px_1.5px_0_rgba(255,255,255,0.75)] dark:shadow-[4px_4px_0_#fff,inset_0_1px_1.5px_0_rgba(255,255,255,0.2)] flex flex-col items-center gap-2">
        {/* Washi tape pin detail at top */}
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-amber-300/90 border border-black/30 rotate-[-3deg] shadow-xs rounded-xs pointer-events-none"
          aria-hidden="true"
        />

        {/* Circular Progress Gauge */}
        <div
          className="relative w-8 h-8 rounded-full flex items-center justify-center font-mono text-[9px] font-black text-black dark:text-white my-0.5 cursor-pointer"
          onClick={() => scrollTo("cover")}
          title={`Scrolled: ${scrollPercent}% through portfolio`}
        >
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              className="text-stone-200 dark:text-stone-800"
            />
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.2"
              strokeDasharray="88"
              strokeDashoffset={88 - (88 * scrollPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-[8.5px] font-black">
            {scrollPercent}%
          </span>
        </div>

        <div className="w-6 h-px bg-black/15 dark:bg-white/15 my-0.5" />

        {/* 3D Vertical Chapter Bookmark Tabs */}
        <div className="flex flex-col gap-1.5">
          {CHAPTERS.map((ch) => {
            const isActive = activeId === ch.id;
            const isHovered = hoveredId === ch.id;

            return (
              <div
                key={ch.id}
                className="relative flex items-center justify-end"
                onMouseEnter={() => setHoveredId(ch.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Expanded Flyout Title on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: -8, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-full mr-1 whitespace-nowrap px-3 py-1.5 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-stone-900 shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] z-50 pointer-events-none flex items-center gap-2"
                    >
                      <span
                        className="px-1.5 py-0.5 rounded text-[9.5px] font-mono font-black text-black"
                        style={{ backgroundColor: ch.color }}
                      >
                        {ch.num}
                      </span>
                      <span className="font-hero-heading text-xs tracking-wider text-black dark:text-white uppercase">
                        {ch.name}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bookmark Tab Pill */}
                <button
                  type="button"
                  onClick={() => scrollTo(ch.id)}
                  aria-label={`Jump to Chapter ${ch.num}: ${ch.name}`}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-black border-2 transition-all cursor-pointer ${
                    isActive
                      ? "border-black dark:border-white text-black scale-105"
                      : "border-black/20 dark:border-white/20 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
                  }`}
                  style={{
                    backgroundColor: isActive ? ch.color : undefined,
                    boxShadow: isActive ? `2px 2px 0 ${ch.shadow}` : undefined,
                    transform: isActive ? "rotate(-2deg)" : undefined,
                  }}
                >
                  <span>{ch.num}</span>

                  {/* Active 3D Indicator Dot */}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-black dark:bg-white border border-white dark:border-black shadow-xs" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
