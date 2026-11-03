"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import { resolveRoleTrack } from "@/lib/roleTrack";

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
      className="relative w-full h-[100dvh] touch-none select-none bg-[#07080d] text-white flex flex-col justify-between overflow-hidden"
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
            className="object-cover filter brightness-[1.02] contrast-[1.04]"
            style={{
              objectPosition: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
              transform: `scale(${portfolio?.personal?.coverPhotoZoom ?? 1})`,
              transformOrigin: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
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
            e.stopPropagation();
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
            {/* 1. CURRENT ROLE: Role & Workplace dynamically rendered */}
            {portfolio?.personal?.showMobileCurrentRole !== false && (Boolean(portfolio?.personal?.role || portfolio?.personal?.aboutCurrentWork) || Boolean(portfolio?.personal?.aboutWorkPlace)) && (() => {
              const rawRole = (portfolio?.personal?.role || portfolio?.personal?.aboutCurrentWork || "").trim();
              const workplace = (portfolio?.personal?.aboutWorkPlace || "").trim();

              const displayRole = workplace && rawRole.toLowerCase().includes(`@ ${workplace.toLowerCase()}`)
                ? rawRole.replace(new RegExp(`\\s*@\\s*${workplace}`, 'i'), '').trim()
                : rawRole;

              const track = resolveRoleTrack(rawRole, workplace, portfolio?.personal?.aboutRoleType);

              return (
                <div className={`w-full flex flex-col items-center justify-center text-center py-2 px-3 rounded-xl bg-gradient-to-r ${track.cardBg} border border-black/15 dark:border-white/15 shadow-2xs`}>
                  {/* Top status indicator with Track Icon & Pulsing Dot */}
                  <div className={`flex items-center gap-1.5 pb-1 ${track.labelColor}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${track.beaconRing} opacity-75`} />
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${track.beaconCore}`} />
                    </span>
                    <span className="font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      {track.icon}
                      <span>{track.label}</span>
                    </span>
                  </div>

                  {/* Role & Organization display */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {Boolean(displayRole) && (
                      <span className="font-['Space_Grotesk'] text-xs sm:text-sm font-black uppercase tracking-tight text-stone-900 dark:text-stone-100">
                        {displayRole}
                      </span>
                    )}
                    {Boolean(workplace) && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${track.workplaceBadgeBg} font-mono text-[10px] font-black uppercase tracking-wide`}>
                        <span className={`${track.workplaceAtColor} font-sans font-bold`}>@</span>
                        <span>{workplace}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

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

        {/* Action Button: Click Here to Explore Portfolio */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerRipple(e.clientX, e.clientY, e.currentTarget);
            setTimeout(() => {
              closeCover();
            }, 200);
          }}
          className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/25 backdrop-blur-md text-[10.5px] font-mono font-bold tracking-wider uppercase text-white/90 shadow-md transition-all cursor-pointer select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>✦ CLICK HERE TO EXPLORE PORTFOLIO ✦</span>
        </button>
      </footer>
    </section>
  );
}
