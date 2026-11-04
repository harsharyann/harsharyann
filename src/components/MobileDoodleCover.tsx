"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { useTheme } from "./ThemeProvider";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import { resolveRoleTrack } from "@/lib/roleTrack";

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const ignoreNextClickRef = useRef(false);

  // Tap Ripple Animation State
  interface RippleEffect {
    id: number;
    x: number;
    y: number;
  }
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const triggerRipple = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-2), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 850);
  };

  const handleCoverClick = (e: React.MouseEvent<HTMLElement>) => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }
    triggerRipple(e.clientX, e.clientY, e.currentTarget);
    setTimeout(() => {
      closeCover();
    }, 220);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartX);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY);
    if (diffX > 10 || diffY > 10) {
      setHasMoved(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLElement>) => {
    if (touchStartY === null || touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = Math.abs(endX - touchStartX);
    const diffY = Math.abs(endY - touchStartY);

    if (!hasMoved && diffX < 10 && diffY < 10) {
      triggerRipple(endX, endY, e.currentTarget);
      setTimeout(() => {
        closeCover();
      }, 220);
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setHasMoved(false);
  };

  // Resolve photo source
  const photoSrc = formatGoogleDriveImageUrl(portfolio?.personal?.coverPhotoUrl);
  const [displayPhotoSrc, setDisplayPhotoSrc] = useState<string>(photoSrc);

  useEffect(() => {
    setDisplayPhotoSrc(photoSrc);
  }, [photoSrc]);

  const nameString = portfolio?.personal?.name || "HARSH ARYAN";

  // Role & Workplace logic
  const rawRole = (
    portfolio?.personal?.role ||
    portfolio?.personal?.aboutCurrentWork ||
    "Data Research"
  ).trim();
  const workplace = (portfolio?.personal?.aboutWorkPlace || "IIT Madras").trim();

  const displayRole =
    workplace && rawRole.toLowerCase().includes(`@ ${workplace.toLowerCase()}`)
      ? rawRole.replace(new RegExp(`\\s*@\\s*${workplace}`, "i"), "").trim()
      : rawRole || "Data Research";

  const customRoleColor = portfolio?.personal?.coverRoleTrackColor;
  const track = resolveRoleTrack(rawRole, workplace, portfolio?.personal?.aboutRoleType, customRoleColor);
  const trackLabel = (track.label || "RESEARCH").replace(/\s+LAB$/i, "");

  const tagline =
    portfolio?.personal?.mobileTagline ||
    "TEACHING MACHINES TO LEARN ✦ BUILDING SCIENTIFIC SOFTWARE";

  return (
    <section
      onClick={handleCoverClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="relative w-full h-[100dvh] touch-none select-none bg-[#faf8f3] dark:bg-[#07080d] text-black dark:text-white flex flex-col justify-between overflow-hidden transition-colors duration-300"
      aria-label="Harsh Aryan Comic Sketchbook Mobile Cover"
    >
      <style>{`
        .mobile-cover-grid {
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0.055) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.055) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dark .mobile-cover-grid {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.045) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
        }
        @keyframes mobile-marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes mobile-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: mobile-marquee-left 24s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: mobile-marquee-right 26s linear infinite;
        }
      `}</style>

      {/* ── GRAPH NOTEBOOK PAPER GRID BACKGROUND ── */}
      <div className="absolute inset-0 mobile-cover-grid pointer-events-none z-0" />

      {/* ── EXPANDING NEON TAP RIPPLE EFFECT ── */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute rounded-full border-2 border-indigo-500 z-50"
          style={{
            left: r.x - 35,
            top: r.y - 35,
            width: 70,
            height: 70,
            boxShadow: "0 0 35px rgba(99, 102, 241, 0.8), inset 0 0 20px rgba(99, 102, 241, 0.4)",
          }}
        />
      ))}

      {/* ── 1. PORTRAIT PHOTO SECTION WITH COMIC DOODLE OVERLAYS ── */}
      <div className="relative w-full h-[43vh] sm:h-[45vh] shrink-0 overflow-hidden z-10">
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ transform: "translateZ(0)" }}
        >
          <Image
            src={displayPhotoSrc}
            alt={portfolio?.personal?.name || "Harsh Aryan"}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
            style={{
              objectPosition: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
              transform: `scale(${portfolio?.personal?.coverPhotoZoom ?? 1})`,
              transformOrigin: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
            }}
          />
        </motion.div>

        {/* ── TOP RIGHT: THEME TOGGLE PILL (🔴 DARK / 🟡 LIGHT) ── */}
        <div className="absolute top-3.5 right-3.5 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-stone-900 text-black dark:text-white border-2 border-black dark:border-white/60 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] font-mono font-black text-[9.5px] uppercase tracking-wider cursor-pointer active:translate-y-0.5 transition-all"
            aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
            title="Toggle Light / Dark Mode"
          >
            <span className={`w-2 h-2 rounded-full ${isDark ? "bg-amber-400" : "bg-rose-500"} animate-pulse`} />
            <span>{isDark ? "LIGHT" : "DARK"}</span>
          </button>
        </div>

        {/* ── PLAYFUL COMIC DOODLE OVERLAYS (Matches Uploaded Spec 1:1) ── */}

        {/* Top-Left: Paper Airplane Doodle with Looping Dashed Flight Trail */}
        <div className="absolute top-3 left-2.5 w-28 h-20 pointer-events-none z-20">
          <svg viewBox="0 0 110 70" fill="none" className="w-full h-full">
            <path
              d="M 6 52 C 16 62, 38 60, 42 40 C 46 18, 20 18, 26 34 C 32 48, 62 44, 82 22"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              fill="none"
            />
            <g transform="translate(82, 16) rotate(16)">
              <polygon points="0,0 22,8 5,12" fill="#ffffff" stroke="#000000" strokeWidth="1.6" strokeLinejoin="round" />
              <polygon points="22,8 0,18 5,12" fill="#e0f2fe" stroke="#000000" strokeWidth="1.6" strokeLinejoin="round" />
              <polygon points="5,12 11,20 12,13" fill="#93c5fd" stroke="#000000" strokeWidth="1.6" strokeLinejoin="round" />
              <line x1="5" y1="12" x2="22" y2="8" stroke="#000000" strokeWidth="1.2" />
            </g>
          </svg>
        </div>

        {/* Mid-Left: Tilted Pink Doodle Heart */}
        <div className="absolute top-[32%] left-5 w-5 h-5 pointer-events-none z-20 rotate-[-12deg]">
          <svg viewBox="0 0 24 24" fill="#f472b6" stroke="#000000" strokeWidth="1.8" strokeLinejoin="round" className="w-full h-full drop-shadow-xs">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Left Edge: Halftone Dotted Cluster */}
        <div className="absolute top-[26%] left-2.5 pointer-events-none z-15 opacity-70 grid grid-cols-3 gap-1.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} className="w-1 h-1 rounded-full bg-cyan-600/70 dark:bg-cyan-400/70" />
          ))}
        </div>

        {/* Right Shoulder: Cyan Zigzag Wave Doodle */}
        <div className="absolute top-[28%] right-5 w-12 h-6 pointer-events-none z-20">
          <svg viewBox="0 0 46 18" fill="none" className="w-full h-full">
            <path
              d="M 3 9 L 9 3 L 16 11 L 23 3 L 30 11 L 37 3 L 43 9"
              stroke="#06b6d4"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Scattered Colorful Mini Sparkles / Stars */}
        <span className="absolute top-[37%] right-8 pointer-events-none z-20 text-[#f97316] font-bold text-sm">✦</span>
        <span className="absolute top-[41%] right-14 pointer-events-none z-20 text-[#10b981] font-black text-xs">+</span>
        <span className="absolute top-[35%] left-14 pointer-events-none z-20 text-[#a855f7] font-black text-xs">×</span>

        {/* ── SMOOTH FROSTED BLUR TRANSITION AT BOTTOM OF PHOTO (Blends into Theme Paper) ── */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10 backdrop-blur-md"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 20%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10 backdrop-blur-lg bg-gradient-to-t from-[#faf8f3] dark:from-[#07080d] via-[#faf8f3]/60 dark:via-[#07080d]/60 to-transparent"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 30%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* ── 2. ANGLED TICKER BANNERS (Crossed Pink & Cyan Ribbons) ── */}
      <div className="relative w-full -mt-7 z-20 overflow-hidden pointer-events-none flex flex-col items-center">
        {/* Top Pink / Rose Ribbon */}
        <div
          className="w-[110%] py-1 bg-[#f472b6] dark:bg-[#e11d48] border-y-2 border-black shadow-[2px_2px_0_#000] overflow-hidden"
          style={{ transform: "rotate(-2.2deg)" }}
        >
          <div className="marquee-track-left">
            <span className="font-mono text-[9.5px] font-black uppercase text-black dark:text-white tracking-widest px-3 whitespace-nowrap">
              {tagline} ✦ {tagline} ✦{" "}
            </span>
            <span className="font-mono text-[9.5px] font-black uppercase text-black dark:text-white tracking-widest px-3 whitespace-nowrap">
              {tagline} ✦ {tagline} ✦{" "}
            </span>
          </div>
        </div>

        {/* Bottom Cyan / Teal Ribbon (Angled underneath) */}
        <div
          className="w-[110%] py-0.5 -mt-1.5 bg-[#2dd4bf] dark:bg-[#0891b2] border-y-2 border-black shadow-[2px_2px_0_#000] overflow-hidden"
          style={{ transform: "rotate(1.8deg)" }}
        >
          <div className="marquee-track-right">
            <span className="font-mono text-[9px] font-black uppercase text-black dark:text-white tracking-widest px-3 whitespace-nowrap">
              FULL-STACK AI ✦ DEEP LEARNING ✦ DATA SYSTEMS ✦ CREATIVE COMPUTING ✦{" "}
            </span>
            <span className="font-mono text-[9px] font-black uppercase text-black dark:text-white tracking-widest px-3 whitespace-nowrap">
              FULL-STACK AI ✦ DEEP LEARNING ✦ DATA SYSTEMS ✦ CREATIVE COMPUTING ✦{" "}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. HERO NAME & BENTO DOSSIER CARD ── */}
      <footer className="relative z-30 w-full px-4 pb-4 pt-1 flex-1 flex flex-col items-center justify-between text-center overflow-visible">
        {/* Hero Name: "HARSH ARYAN" — Theme Adaptive, Razor-Sharp & Legible */}
        <div className="relative z-20 my-auto py-1 px-2 max-w-full">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-hero-heading text-[clamp(1.85rem,7.5vw,2.65rem)] font-black uppercase tracking-tight text-center select-none leading-none whitespace-nowrap text-black dark:text-white"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
              textShadow: isDark
                ? "2px 2px 0 #000000, -2px -2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000, 3.5px 3.5px 0 #6366f1, 0 0 24px rgba(99, 102, 241, 0.55)"
                : "2px 2px 0 #ffffff, -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 3px 3px 0 #4f46e5, 0 4px 14px rgba(79, 70, 229, 0.35)",
            }}
          >
            {nameString}
          </motion.h1>
        </div>

        {/* ── BENTO ROLE CARD PINNED WITH STRIPED PASTEL WASHI TAPE ── */}
        <div className="relative w-full max-w-[340px] my-auto">
          {/* Pastel Striped Washi Tape (Diagonal Stripes) */}
          <div
            className="w-24 h-4 border border-dashed border-black/30 shadow-xs mx-auto -mb-2 z-20 relative rounded-xs pointer-events-none"
            style={{
              transform: "rotate(-1.5deg)",
              background: isDark
                ? "repeating-linear-gradient(45deg, #4c1d95, #4c1d95 8px, #831843 8px, #831843 16px)"
                : "repeating-linear-gradient(45deg, #d8b4fe, #d8b4fe 8px, #fbcfe8 8px, #fbcfe8 16px)",
            }}
            aria-hidden="true"
          />

          {/* Bento Card Body */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              triggerRipple(e.clientX, e.clientY, e.currentTarget);
              setTimeout(() => {
                closeCover();
              }, 220);
            }}
            className="relative w-full rounded-[24px] p-3.5 sm:p-4 bg-white dark:bg-[#11131f] border-[2.5px] border-black dark:border-white/25 shadow-[4px_4px_0_#4f46e5] dark:shadow-[4px_4px_0_#000,0_8px_24px_rgba(0,0,0,0.6)] text-stone-900 dark:text-stone-100 flex flex-col gap-3 cursor-pointer select-none transition-transform hover:scale-[1.01]"
          >
            {/* Row 1: Header / Status row */}
            <div className="flex items-center justify-between w-full">
              {/* NOW Pill Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-[#86efac] dark:bg-emerald-950 text-[#064e3b] dark:text-emerald-300 border-1.5 border-black dark:border-emerald-500/50 font-mono text-[9px] font-black uppercase shadow-[1px_1px_0_#000]">
                NOW
              </span>

              {/* Center Track / Mandate */}
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] font-black uppercase tracking-wider text-stone-900 dark:text-white">
                <span className="text-sm">⚗️</span>
                <span>{trackLabel}</span>
              </div>

              {/* Active Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 dark:border-emerald-500/50 font-mono text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>ACTIVE</span>
              </span>
            </div>

            {/* Row 2: Role & Workplace Capsule Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap w-full">
              {/* Pill 1: Blue - Role */}
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#bae6fd] dark:bg-sky-950/80 text-[#0369a1] dark:text-sky-300 border-2 border-black dark:border-sky-400/60 font-mono text-[10.5px] font-black shadow-[2px_2px_0_#000]"
                style={customRoleColor ? { borderColor: customRoleColor, color: customRoleColor } : undefined}
              >
                <span className="text-[9px]">✦</span>
                <span>{displayRole}</span>
              </div>

              {/* Pill 2: Pink - Workplace */}
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#fbcfe8] dark:bg-rose-950/80 text-[#be185d] dark:text-rose-300 border-2 border-black dark:border-rose-400/60 font-mono text-[10.5px] font-black shadow-[2px_2px_0_#000]"
                style={customRoleColor ? { borderColor: customRoleColor } : undefined}
              >
                <span className="text-[9px]">✦</span>
                <span>@ {workplace}</span>
              </div>
            </div>

            {/* Row 3: Circular Social Connect Buttons + Doodle Curved Arrow */}
            <div className="flex items-center justify-between w-full pt-1.5 border-t border-dashed border-stone-300 dark:border-stone-700">
              <div className="flex items-center gap-2.5">
                {/* GitHub */}
                <a
                  href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className="w-9 h-9 rounded-full bg-[#e9d5ff] dark:bg-purple-950/70 border-2 border-black dark:border-purple-400/50 shadow-[2px_2px_0_#000] flex items-center justify-center text-black dark:text-purple-200 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>

                {/* LinkedIn */}
                <a
                  href={portfolio?.socialLinks?.linkedin || "https://linkedin.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#bae6fd] dark:bg-sky-950/70 border-2 border-black dark:border-sky-400/50 shadow-[2px_2px_0_#000] flex items-center justify-center text-[#0284c7] dark:text-sky-300 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${portfolio?.personal?.email || "harsharyan@outlook.com"}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Send Email"
                  title="Email"
                  className="w-9 h-9 rounded-full bg-[#fbcfe8] dark:bg-rose-950/70 border-2 border-black dark:border-rose-400/50 shadow-[2px_2px_0_#000] flex items-center justify-center text-[#e11d48] dark:text-rose-300 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Doodle Curved Arrow & LET'S CONNECT text */}
              <div className="flex items-center gap-1.5 pr-1">
                <svg width="34" height="20" viewBox="0 0 34 20" fill="none" className="rotate-[-6deg] text-black dark:text-white">
                  <path d="M30 4 C 18 2, 7 7, 5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 11 L 5 17 L 10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="font-mono font-black text-[8.5px] uppercase tracking-wider leading-tight text-stone-900 dark:text-stone-100 text-left">
                  <span>LET&apos;S</span>
                  <br />
                  <span>CONNECT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. CTA AREA: "CLICK HERE ↓" BADGE & MAIN BUTTON ── */}
        <div className="w-full max-w-[340px] flex flex-col items-center mt-1">
          {/* Angled Mint Badge */}
          <div className="w-full flex justify-end pr-3 -mb-2 z-20 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-[#86efac] text-black border-2 border-black font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0_#000] rotate-[-2.5deg] flex items-center gap-1">
              <span>CLICK HERE</span>
              <span>↓</span>
            </span>
          </div>

          {/* Main Capsule CTA Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerRipple(e.clientX, e.clientY, e.currentTarget);
              setTimeout(() => {
                closeCover();
              }, 220);
            }}
            className="group relative w-full px-4 py-2.5 rounded-full bg-gradient-to-r from-[#4338ca] via-[#4f46e5] to-[#6366f1] border-2 border-black dark:border-white/40 shadow-[4px_4px_0_#f43f5e] dark:shadow-[4px_4px_0_#f43f5e,0_0_20px_rgba(99,102,241,0.5)] active:translate-y-0.5 active:shadow-[1px_1px_0_#f43f5e] flex items-center justify-between cursor-pointer select-none transition-all"
          >
            {/* Inner dashed stitched line */}
            <div className="absolute inset-[3px] rounded-full border border-dashed border-white/45 pointer-events-none" />

            {/* Button Text */}
            <span className="font-mono text-xs font-black uppercase text-white tracking-widest flex items-center gap-1.5 pl-2 z-10">
              <span className="text-amber-300">✦</span>
              <span>EXPLORE PORTFOLIO</span>
            </span>

            {/* Right Arrow Circle */}
            <span className="w-7 h-7 rounded-full bg-white text-black border-1.5 border-black flex items-center justify-center font-black text-sm shadow-xs z-10 group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
