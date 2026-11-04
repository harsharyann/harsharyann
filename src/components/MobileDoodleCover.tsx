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
import { extractPhotoPalette, PhotoPalette, DEFAULT_PHOTO_PALETTE } from "@/lib/colorExtractor";

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();
  const { theme } = useTheme();
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

  // Resolve mobile photo source (Dedicated Phone Cover Photo with fallback)
  const mobilePhotoRaw = portfolio?.personal?.mobilePhotoUrl || portfolio?.personal?.coverPhotoUrl;
  const photoSrc = formatGoogleDriveImageUrl(mobilePhotoRaw);
  const [displayPhotoSrc, setDisplayPhotoSrc] = useState<string>(photoSrc);
  const [photoPalette, setPhotoPalette] = useState<PhotoPalette>(DEFAULT_PHOTO_PALETTE);

  useEffect(() => {
    setDisplayPhotoSrc(photoSrc);
    if (photoSrc) {
      extractPhotoPalette(photoSrc)
        .then((pal) => {
          if (pal) setPhotoPalette(pal);
        })
        .catch(() => {});
    }
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
  const track = resolveRoleTrack(
    rawRole,
    workplace,
    portfolio?.personal?.aboutRoleType,
    customRoleColor,
    portfolio?.personal?.aboutRoleStatusText,
    portfolio?.personal?.aboutRoleIcon,
    portfolio?.personal?.aboutRoleCardStyle
  );
  const trackLabel = portfolio?.personal?.mobileCenterTrackText || (track.label || "RESEARCH").replace(/\s+LAB$/i, "");

  // Auto-derived Photo Colors or Custom Admin Overrides
  const autoPhotoColors = portfolio?.personal?.mobileCoverAutoPhotoColors !== false;

  const scrollColor1 =
    portfolio?.personal?.mobileScrollColor1 ||
    (autoPhotoColors && photoPalette?.dominant) ||
    "#f59e0b";

  const scrollColor2 =
    portfolio?.personal?.mobileScrollColor2 ||
    (autoPhotoColors && (photoPalette?.secondary || "#000000")) ||
    "#000000";

  const scrollTextColor1 =
    portfolio?.personal?.mobileScrollTextColor1 || "#000000";

  const scrollTextColor2 =
    portfolio?.personal?.mobileScrollTextColor2 ||
    (autoPhotoColors && (photoPalette?.accent || "#fde047")) ||
    "#fde047";

  const ctaButtonBg =
    portfolio?.personal?.mobileCtaButtonBg || "#000000";

  const ctaButtonTextColor =
    portfolio?.personal?.mobileCtaButtonTextColor || "#ffffff";

  const ctaButtonShadowColor =
    portfolio?.personal?.mobileCtaButtonShadowColor ||
    (autoPhotoColors && photoPalette?.dominant) ||
    "#f59e0b";

  const clickHereBadgeBg =
    portfolio?.personal?.mobileClickHereBadgeBg ||
    (autoPhotoColors && (photoPalette?.accent || photoPalette?.dominant)) ||
    "#f59e0b";

  const clickHereBadgeTextColor =
    portfolio?.personal?.mobileClickHereBadgeTextColor || "#000000";

  // Editable scrolling ribbon banners (from Admin panel)
  const scrollText1 =
    portfolio?.personal?.mobileScrollText1 ||
    portfolio?.personal?.mobileTagline ||
    "TEACHING MACHINES TO LEARN ✦ BUILDING SCIENTIFIC SOFTWARE";

  const scrollText2 =
    portfolio?.personal?.mobileScrollText2 ||
    "FULL-STACK AI ✦ DEEP LEARNING ✦ DATA SYSTEMS ✦ CREATIVE COMPUTING";

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

      {/* ── EXPANDING GOLDEN SPARKLE TAP RIPPLE EFFECT ── */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute rounded-full border-2 border-amber-400 z-50"
          style={{
            left: r.x - 35,
            top: r.y - 35,
            width: 70,
            height: 70,
            boxShadow: "0 0 35px rgba(245, 158, 11, 0.8), inset 0 0 20px rgba(245, 158, 11, 0.4)",
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
              objectPosition: `${portfolio?.personal?.mobilePhotoPositionX ?? portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.mobilePhotoPositionY ?? portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
              transform: `scale(${portfolio?.personal?.mobilePhotoZoom ?? portfolio?.personal?.coverPhotoZoom ?? 1})`,
              transformOrigin: `${portfolio?.personal?.mobilePhotoPositionX ?? portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.mobilePhotoPositionY ?? portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
            }}
          />
        </motion.div>

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

      {/* ── 2. ANGLED TICKER BANNERS (Editable Scrolling Ribbons with Portfolio Palette) ── */}
      <div className="relative w-full -mt-7 z-20 overflow-hidden pointer-events-none flex flex-col items-center">
        {/* Top Ribbon */}
        <div
          className="w-[110%] py-1 border-y-2 border-black shadow-[2px_2px_0_#000] overflow-hidden"
          style={{
            transform: "rotate(-2.2deg)",
            backgroundColor: scrollColor1,
          }}
        >
          <div className="marquee-track-left">
            <span
              className="font-mono text-[9.5px] font-black uppercase tracking-widest px-3 whitespace-nowrap"
              style={{ color: scrollTextColor1 }}
            >
              {scrollText1} ✦ {scrollText1} ✦{" "}
            </span>
            <span
              className="font-mono text-[9.5px] font-black uppercase tracking-widest px-3 whitespace-nowrap"
              style={{ color: scrollTextColor1 }}
            >
              {scrollText1} ✦ {scrollText1} ✦{" "}
            </span>
          </div>
        </div>

        {/* Bottom Ribbon */}
        <div
          className="w-[110%] py-0.5 -mt-1.5 border-y-2 border-black shadow-[2px_2px_0_#000] overflow-hidden"
          style={{
            transform: "rotate(1.8deg)",
            backgroundColor: scrollColor2,
          }}
        >
          <div className="marquee-track-right">
            <span
              className="font-mono text-[9px] font-black uppercase tracking-widest px-3 whitespace-nowrap"
              style={{ color: scrollTextColor2 }}
            >
              {scrollText2} ✦ {scrollText2} ✦{" "}
            </span>
            <span
              className="font-mono text-[9px] font-black uppercase tracking-widest px-3 whitespace-nowrap"
              style={{ color: scrollTextColor2 }}
            >
              {scrollText2} ✦ {scrollText2} ✦{" "}
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. HERO NAME & BENTO DOSSIER CARD ── */}
      <footer className="relative z-30 w-full px-4 pb-4 pt-1 flex-1 flex flex-col items-center justify-between text-center overflow-visible">
        {/* Hero Name: "HARSH ARYAN" — Theme Adaptive, Razor-Sharp & Legible (Zero Purple) */}
        <div className="relative z-20 my-auto py-1 px-2 max-w-full">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="font-hero-heading text-[clamp(1.85rem,7.5vw,2.65rem)] font-black uppercase tracking-tight text-center select-none leading-none whitespace-nowrap text-black dark:text-white"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
              textShadow: isDark
                ? "2px 2px 0 #000000, -2px -2px 0 #000000, 2px -2px 0 #000000, -2px 2px 0 #000000, 3.5px 3.5px 0 #f59e0b, 0 0 20px rgba(245, 158, 11, 0.45)"
                : "2px 2px 0 #ffffff, -2px -2px 0 #ffffff, 2px -2px 0 #ffffff, -2px 2px 0 #ffffff, 3.5px 3.5px 0 #000000, 0 4px 14px rgba(0, 0, 0, 0.18)",
            }}
          >
            {nameString}
          </motion.h1>
        </div>

        {/* ── BENTO ROLE CARD PINNED WITH JAPANESE WASHI TAPE ── */}
        <div className="relative w-full max-w-[340px] my-auto">
          {/* Signature Washi Tape (Realistic Semi-Transparent Striped / Solid Texture) */}
          {portfolio?.personal?.mobileWashiTapeStyle !== "none" && (
            <div
              className="w-24 h-4.5 border border-dashed border-black/35 shadow-xs mx-auto -mb-2 z-20 relative rounded-[2px] pointer-events-none transition-all backdrop-blur-[1px]"
              style={{
                transform: "rotate(-1.5deg)",
                backgroundColor: portfolio?.personal?.mobileWashiTapeColor || "#facc15",
                backgroundImage:
                  (portfolio?.personal?.mobileWashiTapeStyle || "striped") === "striped"
                    ? "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.38) 0, rgba(255, 255, 255, 0.38) 6px, transparent 6px, transparent 12px)"
                    : (portfolio?.personal?.mobileWashiTapeStyle === "dots")
                    ? "radial-gradient(rgba(0, 0, 0, 0.22) 1.5px, transparent 1.5px)"
                    : undefined,
                backgroundSize:
                  portfolio?.personal?.mobileWashiTapeStyle === "dots" ? "6px 6px" : undefined,
              }}
              aria-hidden="true"
            />
          )}

          {/* Bento Card Body (Neo-Brutalist White & Solid 3D Drop Shadow) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              triggerRipple(e.clientX, e.clientY, e.currentTarget);
              setTimeout(() => {
                closeCover();
              }, 220);
            }}
            className="relative w-full rounded-[24px] p-3.5 sm:p-4 border-[2.5px] flex flex-col gap-3 cursor-pointer select-none transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{
              backgroundColor: portfolio?.personal?.mobileCardBg || (isDark ? "#11131a" : "#ffffff"),
              borderColor: portfolio?.personal?.mobileCardBorder || (isDark ? "#52525b" : "#000000"),
              boxShadow: `5px 5px 0 ${
                portfolio?.personal?.mobileCardShadowColor || (isDark ? "#ffffff" : "#000000")
              }`,
              color: isDark ? "#f4f4f5" : "#18181b",
            }}
          >
            {/* Row 1: Header / Mandate row */}
            <div className="flex items-center justify-between w-full">
              {/* NOW Pill Badge */}
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border-[1.5px] border-black font-mono text-[9px] font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_#000]"
                style={{
                  backgroundColor:
                    portfolio?.personal?.mobileNowBadgeBg || clickHereBadgeBg || "#f43f5e",
                  color: portfolio?.personal?.mobileNowBadgeTextColor || "#ffffff",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-90" />
                <span>{portfolio?.personal?.mobileNowBadgeText || "NOW"}</span>
              </span>

              {/* Center Track / Mandate */}
              <div
                className="flex items-center gap-1.5 font-mono text-[10.5px] font-black uppercase tracking-wider text-stone-900 dark:text-white"
                style={
                  portfolio?.personal?.mobileCenterTrackTextColor
                    ? { color: portfolio.personal.mobileCenterTrackTextColor }
                    : undefined
                }
              >
                <span className="text-sm drop-shadow-xs">
                  {portfolio?.personal?.mobileCenterTrackIcon || portfolio?.personal?.aboutRoleIcon || "🛸"}
                </span>
                <span>
                  {portfolio?.personal?.mobileCenterTrackText || trackLabel || "INTERNSHIP · ACTIVE"}
                </span>
              </div>
            </div>

            {/* Row 2: Role & Workplace Capsule Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap w-full">
              {/* Pill 1: Role Capsule */}
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[10.5px] font-black border-2 transition-transform hover:-translate-y-0.5 active:translate-y-0.5 select-none"
                style={{
                  backgroundColor: portfolio?.personal?.mobileRolePillBg || "#fef08a",
                  borderColor: portfolio?.personal?.mobileRolePillBorder || "#8b5cf6",
                  color: portfolio?.personal?.mobileRolePillTextColor || "#6d28d9",
                  boxShadow: `2px 2px 0 ${portfolio?.personal?.mobileRolePillBorder || "#8b5cf6"}`,
                }}
              >
                {(portfolio?.personal?.mobileRolePillIcon ?? "✦") && (
                  <span className="text-[9.5px]">
                    {portfolio?.personal?.mobileRolePillIcon ?? "✦"}
                  </span>
                )}
                <span>
                  {portfolio?.personal?.mobileRolePillText || displayRole || "Data Science Intern"}
                </span>
              </div>

              {/* Pill 2: Workplace Capsule */}
              <div
                className="flex items-center gap-1 px-3 py-1 rounded-full font-mono text-[10.5px] font-black border-2 transition-transform hover:-translate-y-0.5 active:translate-y-0.5 select-none"
                style={{
                  backgroundColor: portfolio?.personal?.mobileWorkplacePillBg || "#bae6fd",
                  borderColor: portfolio?.personal?.mobileWorkplacePillBorder || "#8b5cf6",
                  color: portfolio?.personal?.mobileWorkplacePillTextColor || "#0369a1",
                  boxShadow: `2px 2px 0 ${
                    portfolio?.personal?.mobileWorkplacePillBorder || "#8b5cf6"
                  }`,
                }}
              >
                {(portfolio?.personal?.mobileWorkplacePillIcon ?? "✦") && (
                  <span className="text-[9.5px]">
                    {portfolio?.personal?.mobileWorkplacePillIcon ?? "✦"}
                  </span>
                )}
                <span>
                  {portfolio?.personal?.mobileWorkplacePillText ||
                    (workplace ? `@ ${workplace}` : "@ IIT Madras")}
                </span>
              </div>
            </div>

            {/* Row 3: Circular Social Connect Buttons + Doodle Curved Arrow */}
            <div className="flex items-center justify-between w-full pt-1.5 border-t border-dashed border-stone-300 dark:border-stone-700">
              <div className="flex items-center gap-2">
                {/* GitHub */}
                <a
                  href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="GitHub Profile"
                  title="GitHub"
                  className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] ${
                    portfolio?.personal?.mobileSocialButtonStyle === "dark"
                      ? "bg-stone-900 border-white text-white"
                      : "bg-[#f8fafc] dark:bg-stone-800 text-black dark:text-white hover:bg-amber-300 hover:text-black"
                  }`}
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
                  className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] ${
                    portfolio?.personal?.mobileSocialButtonStyle === "dark"
                      ? "bg-stone-900 border-white text-sky-400"
                      : portfolio?.personal?.mobileSocialButtonStyle === "white"
                      ? "bg-white dark:bg-stone-800 text-[#0284c7] hover:bg-amber-300 hover:text-black"
                      : "bg-[#e0f2fe] dark:bg-sky-950/70 text-[#0284c7] dark:text-sky-300 hover:bg-sky-200"
                  }`}
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${portfolio?.personal?.email || "harsharyan@outlook.com"}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Send Email"
                  title="Email"
                  className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center transition-all cursor-pointer hover:-translate-y-0.5 hover:scale-105 active:scale-95 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] ${
                    portfolio?.personal?.mobileSocialButtonStyle === "dark"
                      ? "bg-stone-900 border-white text-rose-400"
                      : portfolio?.personal?.mobileSocialButtonStyle === "white"
                      ? "bg-white dark:bg-stone-800 text-rose-500 hover:bg-amber-300 hover:text-black"
                      : "bg-[#ffe4e6] dark:bg-rose-950/70 text-[#e11d48] dark:text-rose-300 hover:bg-rose-200"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Doodle Curved Arrow & LET'S CONNECT text */}
              <div className="flex items-center gap-1.5 pr-1">
                <svg
                  width="34"
                  height="20"
                  viewBox="0 0 34 20"
                  fill="none"
                  className="rotate-[-6deg] text-black dark:text-white shrink-0"
                >
                  <path
                    d="M30 4 C 18 2, 7 7, 5 16"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 11 L 5 17 L 10 14"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className="font-mono font-black text-[8.5px] uppercase tracking-wider leading-tight text-stone-900 dark:text-stone-100 text-left"
                  style={
                    portfolio?.personal?.mobileConnectNoteColor
                      ? { color: portfolio.personal.mobileConnectNoteColor }
                      : undefined
                  }
                >
                  <span>{portfolio?.personal?.mobileConnectNote || "LET'S CONNECT"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. CTA AREA: "CLICK HERE ↓" BADGE & EXPLORE PORTFOLIO BUTTON ── */}
        <div className="w-full max-w-[340px] flex flex-col items-center mt-1">
          {/* Angled Signature Badge */}
          <div className="w-full flex justify-end pr-3 -mb-2 z-20 pointer-events-none">
            <span
              className="px-2.5 py-0.5 rounded-full border-2 border-black font-mono text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0_#000] rotate-[-2.5deg] flex items-center gap-1"
              style={{
                backgroundColor: clickHereBadgeBg,
                color: clickHereBadgeTextColor,
              }}
            >
              <span>{portfolio?.personal?.mobileClickHereBadgeText || "CLICK HERE ↓"}</span>
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
            className="group relative w-full px-4 py-2.5 rounded-full border-2 sm:border-3 border-black dark:border-white active:translate-y-0.5 flex items-center justify-between cursor-pointer select-none transition-all"
            style={{
              backgroundColor: ctaButtonBg,
              color: ctaButtonTextColor,
              boxShadow: `4px 4px 0 ${ctaButtonShadowColor}`,
            }}
          >
            {/* Inner dashed stitched line */}
            <div className="absolute inset-[3px] rounded-full border border-dashed border-white/40 dark:border-black/40 pointer-events-none" />

            {/* Button Text */}
            <span
              className="font-mono text-xs font-black uppercase tracking-widest flex items-center gap-1.5 pl-2 z-10"
              style={{ color: ctaButtonTextColor }}
            >
              <span style={{ color: ctaButtonShadowColor }}>✦</span>
              <span>{portfolio?.personal?.mobileCtaButtonText || "EXPLORE PORTFOLIO"}</span>
            </span>

            {/* Right Arrow Circle */}
            <span
              className="w-7 h-7 rounded-full border-1.5 border-black flex items-center justify-center font-black text-sm shadow-xs z-10 group-hover:translate-x-0.5 transition-transform"
              style={{
                backgroundColor: ctaButtonShadowColor,
                color: "#000000",
              }}
            >
              →
            </span>
          </button>
        </div>
      </footer>
    </section>
  );
}
