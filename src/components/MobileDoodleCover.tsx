"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import { extractVibrantColor } from "@/lib/colorExtractor";

/* ── Rich 4K Handcrafted Colorful Vector Doodles (Posca Marker & Comic Style) ── */

function CuteBlinkingStarDoodle({ className = "" }: { className?: string }) {
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
      {/* Star Shape */}
      <path
        d="M23 3 L28 15 L41 17 L31 27 L34 40 L23 33 L12 40 L15 27 L5 17 L18 15 Z"
        fill="#fde047"
      />
      {/* Happy Cartoon Eyes */}
      <circle cx="19" cy="22" r="1.8" fill="#000000" stroke="none" />
      <circle cx="27" cy="22" r="1.8" fill="#000000" stroke="none" />
      <circle cx="18.5" cy="21.2" r="0.6" fill="#ffffff" stroke="none" />
      <circle cx="26.5" cy="21.2" r="0.6" fill="#ffffff" stroke="none" />
      {/* Cheerful Smile */}
      <path d="M20 26 Q23 29 26 26" stroke="#000000" strokeWidth="1.8" fill="none" />
      {/* Cute Rosy Blushing Cheeks */}
      <circle cx="15.5" cy="26" r="1.8" fill="#f43f5e" opacity="0.85" stroke="none" />
      <circle cx="30.5" cy="26" r="1.8" fill="#f43f5e" opacity="0.85" stroke="none" />
    </svg>
  );
}

function NeonNeuralNetworkDoodle({ className = "" }: { className?: string }) {
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
      {/* Synapse Connecting Lines */}
      <line x1="12" y1="12" x2="36" y2="28" stroke="#38bdf8" strokeWidth="2.5" />
      <line x1="12" y1="42" x2="36" y2="28" stroke="#a855f7" strokeWidth="2.5" />
      <line x1="36" y1="28" x2="60" y2="18" stroke="#34d399" strokeWidth="2.5" />
      <line x1="36" y1="28" x2="58" y2="40" stroke="#f59e0b" strokeWidth="2.5" />
      {/* Synapse Nodes */}
      <circle cx="12" cy="12" r="6" fill="#38bdf8" stroke="#000000" strokeWidth="2" />
      <circle cx="12" cy="42" r="6" fill="#c084fc" stroke="#000000" strokeWidth="2" />
      <circle cx="36" cy="28" r="8" fill="#facc15" stroke="#000000" strokeWidth="2.2" />
      <circle cx="60" cy="18" r="5.5" fill="#34d399" stroke="#000000" strokeWidth="2" />
      <circle cx="58" cy="40" r="5.5" fill="#fb7185" stroke="#000000" strokeWidth="2" />
      {/* Tiny Spark Dots */}
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
      {/* Launch Fire & Smoke */}
      <path d="M18 38 Q23 52 23 52 Q23 52 28 38 Z" fill="#f97316" stroke="#ea580c" />
      <path d="M20 38 Q23 46 23 46 Q23 46 26 38 Z" fill="#fde047" stroke="none" />
      {/* Smoke Clouds */}
      <circle cx="12" cy="45" r="4.5" fill="#e0e7ff" stroke="#000" strokeWidth="1.8" />
      <circle cx="34" cy="45" r="4.5" fill="#e0e7ff" stroke="#000" strokeWidth="1.8" />
      {/* Rocket Fins */}
      <path d="M14 26 L5 34 L14 36 Z" fill="#8b5cf6" />
      <path d="M32 26 L41 34 L32 36 Z" fill="#8b5cf6" />
      {/* Rocket Body */}
      <path
        d="M23 4 C14 14 14 30 15 36 L31 36 C32 30 32 14 23 4 Z"
        fill="#ffffff"
      />
      {/* Cyan Porthole Window */}
      <circle cx="23" cy="19" r="4.5" fill="#38bdf8" stroke="#000000" strokeWidth="2" />
      <circle cx="24.5" cy="17.5" r="1.4" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function NeonLightningDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 42"
      className={className}
      fill="#fde047"
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
  const [accentColor, setAccentColor] = useState<string>("#facc15");
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
    }, 240);
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

    // ONLY stationary tap (finger moved < 10px)! Sliding/scrolling will NOT open About page!
    if (!hasMoved && diffX < 10 && diffY < 10) {
      ignoreNextClickRef.current = true;
      setTimeout(() => {
        ignoreNextClickRef.current = false;
      }, 500);
      triggerRipple(endX, endY, e.currentTarget);
      setTimeout(() => {
        closeCover();
      }, 240);
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setHasMoved(false);
  };

  const photoSrc =
    formatGoogleDriveImageUrl(portfolio?.personal?.coverPhotoUrl) ||
    "/harsh-cover.jpg";

  const [displayPhotoSrc, setDisplayPhotoSrc] = useState<string>(photoSrc);

  useEffect(() => {
    setDisplayPhotoSrc(photoSrc);
  }, [photoSrc]);

  // Automatically extract dominant vibrant accent color from the photo
  useEffect(() => {
    let isMounted = true;
    extractVibrantColor(displayPhotoSrc, "#facc15").then((color) => {
      if (isMounted) {
        setAccentColor(color);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [displayPhotoSrc]);

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
      className="relative w-full h-full min-h-[100dvh] touch-none select-none bg-[#090a0f] text-white flex flex-col justify-between cursor-pointer overflow-hidden"
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
            boxShadow: `0 0 35px ${accentColor}, inset 0 0 20px ${accentColor}`,
          }}
        />
      ))}

      {/* ── 1. PURE ORIGINAL FULLSCREEN HERO PORTRAIT (Hardware Accelerated) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ contain: "strict" }}>
        <motion.div
          className="relative w-full h-full opacity-60"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.04, 1.01, 1],
            y: [0, -6, -2, 0],
          }}
          transition={{
            duration: 22,
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
            className="object-cover object-[center_16%]"
            onError={() => {
              setDisplayPhotoSrc("/harsh-cover.jpg");
            }}
          />
        </motion.div>

        {/* ── Clean Soft Atmospheric Vignette (Softens person visibility & ensures crisp text contrast) ── */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[68%] bg-gradient-to-t from-black via-black/90 via-48% to-transparent pointer-events-none" />
      </div>

      {/* ── 2. FLOATING 4K COLORFUL VECTOR DOODLES OVER PORTRAIT ── */}
      <div className="relative z-20 flex-1 w-full pointer-events-none overflow-visible">
        {/* Colorful Neural Network Graph (Left Side floating) */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [-4, 2, -4],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 -left-2 sm:left-4"
        >
          <NeonNeuralNetworkDoodle className="w-18 h-14 sm:w-22 sm:h-16 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* Cute Blinking Star Doodle with Pink Cheeks (Right Side) */}
        <motion.div
          animate={{
            rotate: [10, 18, 10],
            y: [0, -5, 0],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-3 sm:right-6"
        >
          <CuteBlinkingStarDoodle className="w-11 h-11 sm:w-13 sm:h-13 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* Electric Lightning Bolt Doodle (Floating near arm) */}
        <motion.div
          animate={{
            scale: [0.9, 1.15, 0.9],
            rotate: [-12, -4, -12],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-44 -left-1"
        >
          <NeonLightningDoodle className="w-7 h-10 filter drop-shadow-[0_3px_8px_rgba(0,0,0,0.8)]" />
        </motion.div>

        {/* Colorful Mini Rocket Blasting Off (Floating near right side) */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            x: [0, 3, 0],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-48 right-2 sm:right-5"
        >
          <ColorfulRocketDoodle className="w-11 h-13 filter drop-shadow-[0_5px_14px_rgba(0,0,0,0.85)]" />
        </motion.div>

        {/* Cyan & Magenta Sparkle Stars */}
        <motion.div
          animate={{ scale: [0.8, 1.25, 0.8], rotate: [0, 90, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-28 right-16"
        >
          <SparkleStarDoodle className="w-5 h-5 filter drop-shadow" color="#38bdf8" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 0.75, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-36 left-12"
        >
          <SparkleStarDoodle className="w-4 h-4 filter drop-shadow" color="#f472b6" />
        </motion.div>
      </div>

      {/* ── 3. COLORFUL SKETCH HERO & TYPOGRAPHY WITH STICKER NOTE ── */}
      <footer className="relative z-30 w-full px-5 pb-6 pt-1 flex flex-col items-center text-center">
        {/* Name Container (Clean - Crown Removed as requested) */}
        <div className="relative inline-block mb-1">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            className="font-['Permanent_Marker',cursive] text-[2.85rem] sm:text-6xl text-white tracking-wide px-2 leading-none select-none"
            style={{
              textShadow: `3px 3px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 5px 6px 0 #000, 7px 8px 0 ${accentColor}`,
              transition: "text-shadow 0.4s ease",
            }}
          >
            {portfolio?.personal?.name || "HARSH ARYAN"}
          </motion.h1>
        </div>

        {/* ── SKETCHBOOK STICKER NOTE (Role, Quote & Social Icons All-In-One) ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="relative w-full max-w-[340px] mt-2 mb-2 select-none cursor-default"
        >
          {/* Realistic Washi Tape at Top */}
          <div
            className="w-24 h-4 bg-amber-300/90 dark:bg-amber-400/85 border-y border-black/30 shadow-xs rotate-[-2deg] mx-auto -mb-2 z-20 relative rounded-xs backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Sticky Note Body (Liquid sketchbook post-it note) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl p-4 bg-[#fffef5]/95 dark:bg-[#181922]/95 backdrop-blur-xl border-2 border-black dark:border-white shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#fff] text-stone-900 dark:text-stone-100 flex flex-col items-center gap-2.5 rotate-[0.5deg]"
          >
            {/* 1. CURRENT ROLE BADGE (Toggleable via admin) */}
            {portfolio?.personal?.showMobileCurrentRole !== false && (
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-stone-900 dark:text-stone-100 font-mono text-xs font-bold max-w-full">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 shrink-0">
                  CURRENT ROLE:
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-bold truncate">
                  {portfolio?.personal?.mobileBadge1 || "Teaching Assistant • IIT Madras"}
                </span>
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
            <div className="flex items-center justify-center gap-3 pt-2 w-full border-t border-dashed border-stone-300 dark:border-stone-700">
              <a
                href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
                target="_blank"
                rel="noopener noreferrer"
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
                aria-label="LinkedIn Profile"
                title="LinkedIn"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0077b5] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${portfolio?.personal?.email || "harsharyan@outlook.com"}`}
                aria-label="Send Email"
                title="Email Harsh"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f59e0b] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </footer>
    </section>
  );
}
