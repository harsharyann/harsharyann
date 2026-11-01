"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();
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

  const nameString = portfolio?.personal?.name || "HARSH ARYAN";

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
            boxShadow: "0 0 35px rgba(255, 255, 255, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.4)",
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
      </div>

      {/* ── 2. TYPOGRAPHY & SKETCH STICKER SECTION ── */}
      <footer className="relative z-30 w-full px-4 pb-5 pt-0 flex-1 flex flex-col items-center justify-between text-center overflow-visible">
        {/* Name: "HARSH ARYAN" — Single unified crisp white color */}
        <div className="relative inline-block -mt-5 mb-1.5 z-20">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="font-hero-heading text-[2.75rem] sm:text-6xl text-white tracking-wider px-2 leading-none select-none"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
              color: "#ffffff",
              textShadow: "2.5px 2.5px 0 #000, -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 4.5px 4.5px 0 #000, 6px 6px 12px rgba(0,0,0,0.85)",
            }}
          >
            {nameString}
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
          {/* Realistic Washi Tape at Top */}
          <div
            className="w-24 h-4 border-y border-black/30 shadow-xs rotate-[-2deg] mx-auto -mb-2 z-20 relative rounded-xs backdrop-blur-xs bg-amber-400 dark:bg-amber-400 opacity-90"
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
              className="relative px-2.5 py-1 text-black border-2 border-black rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow-[2.5px_2.5px_0_#000] flex items-center gap-1.5 select-none bg-amber-300 dark:bg-amber-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>CLICK HERE</span>
              <span className="text-xs">👇</span>
              <div
                className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 bg-amber-300 dark:bg-amber-300 border-r-2 border-b-2 border-black rotate-45"
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
