"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Clock, Award } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import { resolveRoleTrack } from "@/lib/roleTrack";
import { ThemeToggle } from "./ThemeToggle";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const CINEMATIC_PARTICLES: Particle[] = [
  { id: 1, x: 15, y: 22, size: 3, duration: 8, delay: 0, opacity: 0.6 },
  { id: 2, x: 78, y: 18, size: 2.5, duration: 10, delay: 1.5, opacity: 0.5 },
  { id: 3, x: 28, y: 44, size: 3.5, duration: 9, delay: 0.8, opacity: 0.7 },
  { id: 4, x: 85, y: 40, size: 2, duration: 11, delay: 2, opacity: 0.4 },
  { id: 5, x: 12, y: 68, size: 3, duration: 7, delay: 1, opacity: 0.5 },
  { id: 6, x: 65, y: 72, size: 2.5, duration: 12, delay: 3, opacity: 0.6 },
  { id: 7, x: 42, y: 82, size: 3, duration: 8.5, delay: 1.2, opacity: 0.5 },
];

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const ignoreNextClickRef = useRef(false);

  // Live IST Time Clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const ist = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(now);
        setCurrentTimeStr(ist);
      } catch {
        setCurrentTimeStr("12:00 PM");
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

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
  const customRoleColor = portfolio?.personal?.coverRoleTrackColor;
  const customLocationColor = portfolio?.personal?.locationBadgeColor;

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
      className="relative w-full h-[100dvh] touch-none select-none bg-[#07080c] text-white flex flex-col justify-between overflow-hidden"
      aria-label="Harsh Aryan Cinematic Mobile Cover"
    >
      {/* ── CINEMATIC AMBIENT LIGHT FLARES & DEPTH GLOWS ── */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none z-10" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none z-10" />

      {/* ── FLOATING CINEMATIC BOKEH / FILM DUST PARTICLES ── */}
      {CINEMATIC_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none z-20 bg-amber-300"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 3}px rgba(251, 191, 36, 0.8)`,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 8, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* ── EXPANDING NEON TAP RIPPLE EFFECT ── */}
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
            boxShadow: "0 0 35px rgba(251, 191, 36, 0.8), inset 0 0 20px rgba(251, 191, 36, 0.4)",
          }}
        />
      ))}

      {/* ── 1. CINEMATIC HERO PORTRAIT SECTION (Dramatic Lighting & Cinematic Framing) ── */}
      <div className="relative w-full h-[54vh] sm:h-[56vh] shrink-0 overflow-hidden bg-black/60">
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.035, 1],
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
            className="object-cover filter brightness-[1.03] contrast-[1.06]"
            style={{
              objectPosition: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
              transform: `scale(${portfolio?.personal?.coverPhotoZoom ?? 1})`,
              transformOrigin: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
            }}
          />
        </motion.div>

        {/* Cinematic Vignettes: Subtle Top + Deep Velvet Fade at Bottom */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#07080c] via-[#07080c]/85 to-transparent pointer-events-none z-10" />

        {/* ── CAMERA HUD OVERLAYS (Cinematic 35mm Vibe) ── */}
        <div className="absolute top-3.5 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Film Stamp Pill */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>RAW · 24FPS</span>
            <span className="text-stone-400">|</span>
            <span className="text-amber-400">35MM</span>
          </div>

          {/* Live India Clock & Theme Toggle */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {currentTimeStr && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[9px] font-black border border-white/20 bg-black/60 backdrop-blur-md text-stone-200 shadow-lg"
                style={customLocationColor ? { borderColor: customLocationColor, color: customLocationColor } : undefined}
              >
                <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span>IST 🇮🇳 {currentTimeStr}</span>
              </div>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="scale-90"
            >
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Bottom Corner Film Camera Chip */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[8.5px] font-mono font-bold tracking-wider uppercase text-amber-400/90 shadow-md">
            <span className="text-rose-400">✦</span>
            <span>{portfolio?.personal?.desktopPhotoTag || "SONY α7 // AI & DS"}</span>
          </span>
        </div>
      </div>

      {/* ── 2. CINEMATIC TYPOGRAPHY & DOSSIER STICKER SECTION ── */}
      <footer className="relative z-30 w-full px-4 pb-4 pt-0 flex-1 flex flex-col items-center justify-between text-center overflow-visible">
        {/* Name: "HARSH ARYAN" — Bold Cinematic Signature Typography */}
        <div className="relative inline-block -mt-8 mb-1.5 z-20">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="font-hero-heading text-[2.85rem] sm:text-6xl text-white tracking-wider px-2 leading-none select-none"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 8px 30px rgba(0,0,0,0.95), 2.5px 2.5px 0 #000, -1.5px -1.5px 0 #000, 3px 3px 0 #f59e0b",
            }}
          >
            {nameString}
          </motion.h1>
        </div>

        {/* ── CINEMATIC GLASSMORPHIC DOSSIER CARD ── */}
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
          {/* Realistic Golden Washi Tape Pinning Top of Card */}
          <div
            className="w-28 h-4 border-y border-black/30 shadow-md rotate-[-1.5deg] mx-auto -mb-2 z-20 relative rounded-xs backdrop-blur-xs bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 opacity-95"
            aria-hidden="true"
          />

          {/* Comic / Film Speech Bubble: "CLICK HERE 👇" */}
          <div className="absolute -top-4 right-1 z-30 pointer-events-none">
            <motion.div
              animate={{
                y: [0, -3.5, 0],
                rotate: [5, 2, 5],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative px-2.5 py-1 text-black border-2 border-black rounded-full font-mono text-[10px] font-black uppercase tracking-wider shadow-[2.5px_2.5px_0_#000] flex items-center gap-1.5 select-none bg-gradient-to-r from-amber-300 to-yellow-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>CLICK HERE</span>
              <span className="text-xs">👇</span>
              <div
                className="absolute -bottom-1.5 right-6 w-2.5 h-2.5 bg-yellow-300 border-r-2 border-b-2 border-black rotate-45"
              />
            </motion.div>
          </div>

          {/* Dossier Body with Smoked Cinematic Frosted Glass */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative rounded-2xl p-3.5 sm:p-4 bg-[#11131c]/95 backdrop-blur-2xl border-2 border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.85),_4px_4px_0_#000] text-stone-100 flex flex-col items-center gap-2.5 rotate-[0.3deg]"
          >
            {/* 1. CURRENT ROLE: Role & Workplace (Supports Hide/Unhide & Custom Colors from Admin!) */}
            {portfolio?.personal?.showMobileCurrentRole !== false &&
              (Boolean(portfolio?.personal?.role || portfolio?.personal?.aboutCurrentWork) ||
                Boolean(portfolio?.personal?.aboutWorkPlace)) &&
              (() => {
                const rawRole = (
                  portfolio?.personal?.role ||
                  portfolio?.personal?.aboutCurrentWork ||
                  ""
                ).trim();
                const workplace = (portfolio?.personal?.aboutWorkPlace || "").trim();

                const displayRole =
                  workplace && rawRole.toLowerCase().includes(`@ ${workplace.toLowerCase()}`)
                    ? rawRole.replace(new RegExp(`\\s*@\\s*${workplace}`, "i"), "").trim()
                    : rawRole;

                const track = resolveRoleTrack(rawRole, workplace, portfolio?.personal?.aboutRoleType);

                return (
                  <div
                    className="w-full flex flex-col items-center justify-center text-center py-2 px-3 rounded-xl bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.07] border border-white/20 shadow-md"
                    style={customRoleColor ? { borderColor: `${customRoleColor}80` } : undefined}
                  >
                    {/* Top status indicator with Track Icon & Pulsing Dot */}
                    <div
                      className={`flex items-center gap-1.5 pb-1 ${track.labelColor}`}
                      style={customRoleColor ? { color: customRoleColor } : undefined}
                    >
                      <span className="relative flex h-2 w-2">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                            customRoleColor ? "" : track.beaconRing
                          } opacity-75`}
                          style={customRoleColor ? { backgroundColor: customRoleColor } : undefined}
                        />
                        <span
                          className={`relative inline-flex rounded-full h-2 w-2 ${
                            customRoleColor ? "" : track.beaconCore
                          }`}
                          style={customRoleColor ? { backgroundColor: customRoleColor } : undefined}
                        />
                      </span>
                      <span className="font-mono text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        {track.icon || <Award className="w-3 h-3 text-purple-400 shrink-0" />}
                        <span>{track.label}</span>
                      </span>
                    </div>

                    {/* Role & Organization display */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {Boolean(displayRole) && (
                        <span className="font-['Space_Grotesk'] text-xs sm:text-sm font-black uppercase tracking-tight text-white drop-shadow-xs">
                          {displayRole}
                        </span>
                      )}
                      {Boolean(workplace) && (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wide border shadow-xs ${
                            customRoleColor ? "text-white" : track.workplaceBadgeBg
                          }`}
                          style={
                            customRoleColor
                              ? {
                                  backgroundColor: `${customRoleColor}25`,
                                  borderColor: `${customRoleColor}70`,
                                  color: "#ffffff",
                                }
                              : undefined
                          }
                        >
                          <span
                            className={`${
                              customRoleColor ? "" : track.workplaceAtColor
                            } font-sans font-bold`}
                            style={customRoleColor ? { color: customRoleColor } : undefined}
                          >
                            @
                          </span>
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
                className="text-amber-200/90 text-xs sm:text-sm font-bold italic leading-snug text-center px-1 drop-shadow-xs"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                &ldquo;
                {portfolio?.personal?.mobileTagline ??
                  "Teaching Machines To Learn • Building Scientific Software"}
                &rdquo;
              </p>
            )}

            {/* 3. INTEGRATED SOCIAL CONNECT ICONS (Frosted Glass Buttons) */}
            <div className="flex items-center justify-center gap-3 pt-1.5 w-full border-t border-dashed border-white/15">
              <a
                href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                aria-label="GitHub Profile"
                title="GitHub"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0077b5] text-white border border-white/30 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f59e0b] text-white border border-white/30 shadow-md backdrop-blur-md transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border-2 border-white/30 backdrop-blur-xl text-[10.5px] font-mono font-black tracking-wider uppercase text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all cursor-pointer select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>✦ CLICK HERE TO EXPLORE PORTFOLIO ✦</span>
        </button>
      </footer>
    </section>
  );
}
