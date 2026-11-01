"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import {
  extractPhotoPalette,
  PhotoPalette,
  DEFAULT_PHOTO_PALETTE,
} from "@/lib/colorExtractor";

/* ── Rich 4K Handcrafted Colorful Vector Doodles (Posca Marker & Comic Style) ── */

function CuteBlinkingStarDoodle({ className = "", color = "#fde047" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 46 46"
      className={className}
      fill="none"
      stroke="#000000"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M23 3 L28 15 L41 17 L31 27 L34 40 L23 33 L12 40 L15 27 L5 17 L18 15 Z"
        fill={color}
      />
      <circle cx="19" cy="22" r="1.8" fill="#000000" stroke="none" />
      <circle cx="27" cy="22" r="1.8" fill="#000000" stroke="none" />
      <circle cx="18.5" cy="21.2" r="0.6" fill="#ffffff" stroke="none" />
      <circle cx="26.5" cy="21.2" r="0.6" fill="#ffffff" stroke="none" />
      <path d="M20 26 Q23 29 26 26" stroke="#000000" strokeWidth="1.8" fill="none" />
      <circle cx="15.5" cy="26" r="1.8" fill="#f43f5e" opacity="0.85" stroke="none" />
      <circle cx="30.5" cy="26" r="1.8" fill="#f43f5e" opacity="0.85" stroke="none" />
    </svg>
  );
}

function NeonNeuralNetworkDoodle({ className = "", accent = "#38bdf8" }: { className?: string; accent?: string }) {
  return (
    <svg
      viewBox="0 0 70 55"
      className={className}
      fill="none"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="12" x2="36" y2="28" stroke={accent} strokeWidth="2.5" />
      <line x1="12" y1="42" x2="36" y2="28" stroke="#a855f7" strokeWidth="2.5" />
      <line x1="36" y1="28" x2="60" y2="18" stroke="#34d399" strokeWidth="2.5" />
      <line x1="36" y1="28" x2="58" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="6" fill={accent} stroke="#000000" strokeWidth="2" />
      <circle cx="12" cy="42" r="6" fill="#c084fc" stroke="#000000" strokeWidth="2" />
      <circle cx="36" cy="28" r="8" fill="#facc15" stroke="#000000" strokeWidth="2.2" />
      <circle cx="60" cy="18" r="5.5" fill="#34d399" stroke="#000000" strokeWidth="2" />
      <circle cx="58" cy="40" r="5.5" fill="#fb7185" stroke="#000000" strokeWidth="2" />
      <circle cx="36" cy="28" r="2.5" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function ColorfulRocketDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 46 54"
      className={className}
      fill="none"
      stroke="#000000"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 38 Q23 52 23 52 Q23 52 28 38 Z" fill="#f97316" stroke="#ea580c" />
      <path d="M20 38 Q23 46 23 46 Q23 46 26 38 Z" fill="#fde047" stroke="none" />
      <circle cx="12" cy="45" r="4.5" fill="#e0e7ff" stroke="#000" strokeWidth="1.8" />
      <circle cx="34" cy="45" r="4.5" fill="#e0e7ff" stroke="#000" strokeWidth="1.8" />
      <path d="M14 26 L5 34 L14 36 Z" fill="#8b5cf6" />
      <path d="M32 26 L41 34 L32 36 Z" fill="#8b5cf6" />
      <path d="M23 4 C14 14 14 30 15 36 L31 36 C32 30 32 14 23 4 Z" fill="#ffffff" />
      <circle cx="23" cy="19" r="4.5" fill="#38bdf8" stroke="#000000" strokeWidth="2" />
      <circle cx="24.5" cy="17.5" r="1.4" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function NeonLightningDoodle({ className = "", color = "#fde047" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 28 42"
      className={className}
      fill={color}
      stroke="#000000"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 2 L4 21 L14 21 L10 40 L24 17 L14 17 Z" />
    </svg>
  );
}

function SparkleStarDoodle({ className = "", color = "#38bdf8" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 26 26"
      className={className}
      fill={color}
      stroke="#000000"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13 0 Q13 13 0 13 Q13 13 13 26 Q13 13 26 13 Q13 13 13 0 Z" />
    </svg>
  );
}

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [palette, setPalette] = useState<PhotoPalette>(DEFAULT_PHOTO_PALETTE);
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
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setHasMoved(false);
  };

  // Resolve photo source
  const photoSrc =
    formatGoogleDriveImageUrl(portfolio?.personal?.coverPhotoUrl) ||
    "/harsh-cover.jpg";

  const [displayPhotoSrc, setDisplayPhotoSrc] = useState<string>(photoSrc);

  useEffect(() => {
    setDisplayPhotoSrc(photoSrc);
  }, [photoSrc]);

  // Extract dynamic color palette directly from the photo
  useEffect(() => {
    let isMounted = true;
    extractPhotoPalette(displayPhotoSrc, DEFAULT_PHOTO_PALETTE).then((extracted) => {
      if (isMounted) {
        setPalette(extracted);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [displayPhotoSrc]);

  const nameString = portfolio?.personal?.name || "HARSH ARYAN";
  const nameChars = Array.from(nameString);

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
      className="relative w-full h-[100dvh] touch-none select-none bg-[#090a0f] text-white flex flex-col justify-between overflow-hidden"
      aria-label="Harsh Aryan Mobile Sketchbook Cover"
    >
      {/* ── EXPANDING NEON TAP RIPPLE EFFECT ── */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0.1, opacity: 0.9 }}
          animate={{ scale: 4.5, opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute rounded-full border-2 border-white/80 z-40"
          style={{
            left: r.x - 35,
            top: r.y - 35,
            width: 70,
            height: 70,
            boxShadow: `0 0 35px ${palette.dominant}, inset 0 0 20px ${palette.accent}`,
          }}
        />
      ))}

      {/* ── 1. HERO PORTRAIT SECTION (Clear, Unobstructed, Crisp Framing) ── */}
      <div className="relative w-full h-[52vh] sm:h-[55vh] shrink-0 overflow-hidden bg-black/40">
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
            className="object-cover object-[center_top] filter brightness-[1.02] contrast-[1.04]"
            onError={() => {
              setDisplayPhotoSrc("/harsh-cover.jpg");
            }}
          />
        </motion.div>

        {/* Soft, lightweight vignettes for contrast without blacking out the face */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/70 to-transparent pointer-events-none" />

        {/* ── Floating 4K Vector Doodles over the photo ── */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            rotate: [-4, 2, -4],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 left-3 pointer-events-none z-10"
        >
          <NeonNeuralNetworkDoodle accent={palette.secondary} className="w-14 h-11 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [10, 18, 10],
            y: [0, -4, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-3 pointer-events-none z-10"
        >
          <CuteBlinkingStarDoodle color={palette.accent} className="w-10 h-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
        </motion.div>

        <motion.div
          animate={{
            scale: [0.9, 1.1, 0.9],
            rotate: [-12, -4, -12],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-3 pointer-events-none z-10"
        >
          <NeonLightningDoodle color={palette.dominant} className="w-6 h-9 filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -6, 0],
            x: [0, 2, 0],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 right-3 pointer-events-none z-10"
        >
          <ColorfulRocketDoodle className="w-9 h-11 filter drop-shadow-[0_5px_12px_rgba(0,0,0,0.85)]" />
        </motion.div>

        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 90, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-12 pointer-events-none z-10"
        >
          <SparkleStarDoodle className="w-4 h-4 filter drop-shadow" color={palette.secondary} />
        </motion.div>
      </div>

      {/* ── 2. TYPOGRAPHY & SKETCH STICKER SECTION ── */}
      <footer className="relative z-30 w-full px-4 pb-5 pt-0 flex-1 flex flex-col items-center justify-between text-center overflow-visible">
        {/* Name: "HARSH ARYAN" with cool display font & photo-derived color harmony */}
        <div className="relative inline-block -mt-5 mb-1.5 z-20">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="font-hero-heading text-[2.75rem] sm:text-6xl text-white tracking-wider px-2 leading-none select-none flex items-center justify-center flex-wrap gap-x-1.5"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
            }}
          >
            {nameChars.map((ch, idx) => {
              if (ch === " ") {
                return <span key={idx} className="w-2.5 inline-block" />;
              }
              const letterColor = palette.letters[idx % palette.letters.length];
              return (
                <span
                  key={idx}
                  className="inline-block transition-colors duration-500"
                  style={{
                    color: letterColor,
                    textShadow: `2.5px 2.5px 0 #000, -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 4px 4px 0 #000, 5.5px 5.5px 0 ${palette.dominant}`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </motion.h1>
        </div>

        {/* ── SKETCHBOOK STICKER NOTE ── */}
        <div
          onClick={(e) => {
            triggerRipple(e.clientX, e.clientY, e.currentTarget);
            setTimeout(() => {
              closeCover();
            }, 220);
          }}
          className="relative w-full max-w-[345px] my-auto select-none cursor-pointer"
        >
          {/* Realistic Washi Tape at Top with Photo Accent Tint */}
          <div
            className="w-24 h-4 border-y border-black/30 shadow-xs rotate-[-2deg] mx-auto -mb-2 z-20 relative rounded-xs backdrop-blur-xs transition-colors duration-500"
            style={{
              backgroundColor: palette.dominant,
              opacity: 0.92,
            }}
            aria-hidden="true"
          />

          {/* Comic Doodle Speech Bubble: "CLICK HERE 👇" */}
          <div className="absolute -top-4 right-1 z-30 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -3.5, 0],
                rotate: [6, 2, 6],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative px-2.5 py-1 text-black border-2 border-black rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow-[2.5px_2.5px_0_#000] flex items-center gap-1.5 select-none transition-colors duration-500"
              style={{ backgroundColor: palette.accent }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>CLICK HERE</span>
              <span className="text-xs">👇</span>
              <div
                className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 border-r-2 border-b-2 border-black rotate-45 transition-colors duration-500"
                style={{ backgroundColor: palette.accent }}
              />
            </motion.div>
          </div>

          {/* Sticky Note Body */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl p-3.5 sm:p-4 bg-[#fffef5]/98 dark:bg-[#181922]/98 backdrop-blur-xl border-2 border-black dark:border-white shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#fff] text-stone-900 dark:text-stone-100 flex flex-col items-center gap-2 rotate-[0.5deg]"
          >
            {/* 1. CURRENT ROLE: Teaching Assistant & IIT Madras stacked underneath! */}
            {portfolio?.personal?.showMobileCurrentRole !== false && (
              <div className="w-full flex flex-col items-center justify-center text-center py-1.5 px-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 dark:border-emerald-500/40 shadow-2xs">
                {/* Teaching Assistant */}
                <div className="flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs sm:text-sm font-black uppercase tracking-tight text-emerald-700 dark:text-emerald-300">
                    Teaching Assistant
                  </span>
                </div>
                {/* IIT Madras directly underneath Teaching Assistant (No building emoji) */}
                <div className="mt-0.5 font-mono text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  IIT Madras
                </div>
              </div>
            )}

            {/* 2. PUNCHY QUOTE / NARRATIVE TAGLINE */}
            {portfolio?.personal?.mobileTagline !== "" && (
              <p
                className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-bold italic leading-snug text-center px-1"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                &ldquo;{portfolio?.personal?.mobileTagline ?? "Teaching Machines To Learn • Building Scientific Software"}&rdquo;
              </p>
            )}

            {/* 3. INTEGRATED SOCIAL CONNECT ICONS */}
            <div className="flex items-center justify-center gap-3 pt-1.5 w-full border-t border-dashed border-stone-300 dark:border-stone-700">
              <a
                href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="GitHub Profile"
                title="GitHub"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-900 text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={portfolio?.socialLinks?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="LinkedIn Profile"
                title="LinkedIn"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0077b5] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${portfolio?.personal?.email || "harsharyan@outlook.com"}`}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="Send Email"
                title="Email Harsh"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f59e0b] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Subtle tap cue */}
        <div className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-45 pb-0.5">
          ✦ TAP ANYWHERE TO ENTER ✦
        </div>
      </footer>
    </section>
  );
}
