"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Clock } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl } from "@/lib/googleDrive";
import { resolveRoleTrack } from "@/lib/roleTrack";
import { useTheme } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";
import { DoodleIcon, DoodleKind } from "./DoodleCrewCover";

interface FloatingDoodleItem {
  id: number;
  kind: DoodleKind;
  x: number; // percentage (5 - 90)
  y: number; // percentage (10 - 85)
  size: number;
  rotate: number;
  floatDelay: number;
}

const INITIAL_MOBILE_DOODLES: FloatingDoodleItem[] = [
  { id: 1, kind: "sparkle", x: 8, y: 14, size: 22, rotate: 12, floatDelay: 0 },
  { id: 2, kind: "star", x: 86, y: 16, size: 20, rotate: -15, floatDelay: 0.6 },
  { id: 3, kind: "bolt", x: 10, y: 46, size: 20, rotate: 18, floatDelay: 1.2 },
  { id: 4, kind: "plane", x: 84, y: 48, size: 24, rotate: -25, floatDelay: 0.3 },
  { id: 5, kind: "flame", x: 6, y: 72, size: 20, rotate: -8, floatDelay: 1.5 },
  { id: 6, kind: "sparkle", x: 88, y: 74, size: 22, rotate: 20, floatDelay: 0.9 },
];

export function MobileDoodleCover() {
  const { data: portfolio, closeCover } = usePortfolio();
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

  // Floating Doodles Interactive State
  const [doodles, setDoodles] = useState<FloatingDoodleItem[]>(INITIAL_MOBILE_DOODLES);
  const [poppedId, setPoppedId] = useState<number | null>(null);

  const handleDoodlePop = (id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPoppedId(id);
    setTimeout(() => {
      setDoodles((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                x: 10 + Math.random() * 75,
                y: 12 + Math.random() * 70,
                rotate: (Math.random() - 0.5) * 60,
              }
            : d
        )
      );
      setPoppedId(null);
    }, 450);
  };

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
      className={`relative w-full h-[100dvh] touch-none select-none flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#0c0d14] text-white"
          : "bg-[#faf8f3] text-stone-900"
      }`}
      aria-label="Harsh Aryan Mobile Sketchbook Cover"
    >
      {/* ── THEMATIC SKETCHBOOK GRAPH-PAPER GRID BACKGROUND ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`
            : `radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.035) 1px, transparent 1px)`,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
        }}
      />

      {/* ── SPIRAL NOTEBOOK TOP BORDER STITCHING ── */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 z-30" />

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

      {/* ── FLOATING INTERACTIVE SKETCHBOOK DOODLES ── */}
      {doodles.map((d) => {
        const isPopped = poppedId === d.id;
        return (
          <motion.div
            key={d.id}
            onClick={(e) => handleDoodlePop(d.id, e)}
            onTouchEnd={(e) => handleDoodlePop(d.id, e)}
            animate={
              isPopped
                ? { scale: [1, 1.8, 0], opacity: [1, 1, 0] }
                : {
                    y: [0, -10, 0],
                    rotate: [d.rotate, d.rotate + 12, d.rotate],
                  }
            }
            transition={
              isPopped
                ? { duration: 0.35 }
                : {
                    duration: 3 + (d.id % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: d.floatDelay,
                  }
            }
            style={{
              position: "absolute",
              left: `${d.x}%`,
              top: `${d.y}%`,
              zIndex: 25,
            }}
            className="cursor-pointer active:scale-125 transition-transform"
            title="Tap to pop doodle!"
          >
            <div className="filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              <DoodleIcon kind={d.kind} size={d.size} isDark={isDark} />
            </div>
          </motion.div>
        );
      })}

      {/* ── 1. TOP SKETCHBOOK HEADER BAR ── */}
      <header className="relative z-30 w-full px-4 pt-3 pb-1 flex items-center justify-between">
        {/* Sketchbook Stamp */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono text-[9.5px] font-black uppercase tracking-wider border border-black dark:border-white shadow-[2px_2px_0_#f59e0b]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>PORTFOLIO // VOL. 2026</span>
        </div>

        {/* Live IST Time & Theme Toggle */}
        <div className="flex items-center gap-2">
          {currentTimeStr && (
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[9px] font-bold border border-black/20 dark:border-white/20 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm shadow-xs"
              style={customLocationColor ? { borderColor: customLocationColor, color: customLocationColor } : undefined}
            >
              <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span>IST 🇮🇳 {currentTimeStr}</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            className="scale-90"
          >
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── 2. HERO STUDIO PORTRAIT FRAME (Thematic Framed Sketchbook Style) ── */}
      <div className="relative z-20 w-full px-5 py-1 flex items-center justify-center shrink-0">
        <div className="relative w-full max-w-[290px] sm:max-w-[320px] aspect-[4/4.3] rounded-3xl overflow-hidden border-3 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] bg-stone-200 dark:bg-stone-800 transition-transform hover:scale-[1.01]">
          {/* Authentic Washi Tape Pinning Top of Frame */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-28 h-5 border-y border-black/30 shadow-xs rotate-[-1.5deg] z-30 rounded-xs bg-amber-400 opacity-95 pointer-events-none"
            aria-hidden="true"
          />

          {/* Peeking Kitty Doodle Mascot on Top Right of Photo Frame */}
          <div className="absolute -top-3.5 right-3 z-30 pointer-events-none filter drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
            <svg viewBox="0 0 48 36" width="38" height="28">
              <ellipse cx="24" cy="20" rx="15" ry="11" fill="#fff" stroke="#000" strokeWidth="2" />
              <polygon points="12,14 16,4 21,12" fill="#fff" stroke="#000" strokeWidth="2" />
              <polygon points="27,12 32,4 36,14" fill="#fff" stroke="#000" strokeWidth="2" />
              <polygon points="14,12 17,6 20,11" fill="#fca5a5" />
              <polygon points="28,11 31,6 34,12" fill="#fca5a5" />
              <circle cx="19" cy="18" r="1.8" fill="#000" />
              <circle cx="29" cy="18" r="1.8" fill="#000" />
              <path d="M22 22 Q24 24 26 22" stroke="#000" strokeWidth="1.6" fill="none" />
              <ellipse cx="15" cy="21" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
              <ellipse cx="33" cy="21" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
            </svg>
          </div>

          {/* Portrait Image */}
          <motion.div
            className="relative w-full h-full"
            initial={{ scale: 1 }}
            animate={{
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <Image
              src={displayPhotoSrc}
              alt={portfolio?.personal?.name || "Harsh Aryan"}
              fill
              priority
              unoptimized
              sizes="320px"
              className="object-cover filter brightness-[1.02] contrast-[1.03]"
              style={{
                objectPosition: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
                transform: `scale(${portfolio?.personal?.coverPhotoZoom ?? 1})`,
                transformOrigin: `${portfolio?.personal?.coverPhotoPositionX ?? 50}% ${portfolio?.personal?.coverPhotoPositionY ?? 20}%`,
              }}
            />
          </motion.div>

          {/* Frame Plaque Tag in Bottom Right Corner */}
          <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/85 text-amber-400 font-mono text-[9px] font-black uppercase tracking-wider border border-amber-400/50 backdrop-blur-xs shadow-md">
              <span className="text-rose-400">✦</span>
              <span>{portfolio?.personal?.desktopPhotoTag || "AI & DS"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. TYPOGRAPHY & SKETCH STICKER SECTION ── */}
      <footer className="relative z-30 w-full px-4 pb-4 pt-0 flex flex-col items-center justify-between text-center overflow-visible gap-2">
        {/* Name: "HARSH ARYAN" with vibrant doodle style */}
        <div className="relative inline-block z-20">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="font-hero-heading text-[2.4rem] sm:text-5xl tracking-wider px-2 leading-none select-none"
            style={{
              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
              color: isDark ? "#ffffff" : "#0c0d14",
              textShadow: isDark
                ? "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 5px 5px 0 #000, 6px 6px 14px rgba(0,0,0,0.9)"
                : "3px 3px 0 #f59e0b, 4.5px 4.5px 0 #000",
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
          className="relative w-full max-w-[340px] select-none cursor-pointer"
        >
          {/* Realistic Washi Tape at Top of Note */}
          <div
            className="w-24 h-3.5 border-y border-black/30 shadow-xs rotate-[-2deg] mx-auto -mb-2 z-20 relative rounded-xs bg-amber-400 opacity-90"
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
              className="relative px-2.5 py-0.5 text-black border-2 border-black rounded-full font-mono text-[9.5px] font-black uppercase tracking-wider shadow-[2px_2px_0_#000] flex items-center gap-1 select-none bg-amber-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              <span>CLICK HERE</span>
              <span className="text-xs">👇</span>
              <div className="absolute -bottom-1.5 right-5 w-2.5 h-2.5 bg-amber-300 border-r-2 border-b-2 border-black rotate-45" />
            </motion.div>
          </div>

          {/* Sticky Note Body */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className={`relative rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl border-2 border-black dark:border-white shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#fff] flex flex-col items-center gap-2 rotate-[0.4deg] ${
              isDark ? "bg-[#161722]/98 text-stone-100" : "bg-[#fffdf5]/98 text-stone-900"
            }`}
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
                    className={`w-full flex flex-col items-center justify-center text-center py-1.5 px-3 rounded-xl bg-gradient-to-r ${track.cardBg} border border-black/15 dark:border-white/15 shadow-2xs`}
                    style={customRoleColor ? { borderColor: `${customRoleColor}60` } : undefined}
                  >
                    {/* Top status indicator with Track Icon & Pulsing Dot */}
                    <div
                      className={`flex items-center gap-1.5 pb-0.5 ${track.labelColor}`}
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
                        {track.icon}
                        <span>{track.label}</span>
                      </span>
                    </div>

                    {/* Role & Organization display */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                      {Boolean(displayRole) && (
                        <span className="font-['Space_Grotesk'] text-xs font-black uppercase tracking-tight text-stone-900 dark:text-stone-100">
                          {displayRole}
                        </span>
                      )}
                      {Boolean(workplace) && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${
                            customRoleColor ? "text-stone-900 dark:text-stone-100" : track.workplaceBadgeBg
                          } font-mono text-[9.5px] font-black uppercase tracking-wide`}
                          style={
                            customRoleColor
                              ? {
                                  backgroundColor: `${customRoleColor}20`,
                                  border: `1px solid ${customRoleColor}60`,
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
                className="text-stone-700 dark:text-stone-300 text-xs font-bold italic leading-snug text-center px-1"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                &ldquo;
                {portfolio?.personal?.mobileTagline ??
                  "Teaching Machines To Learn • Building Scientific Software"}
                &rdquo;
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
                className="flex items-center justify-center w-7 h-7 rounded-full bg-stone-900 text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0077b5] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
                className="flex items-center justify-center w-7 h-7 rounded-full bg-[#f59e0b] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-105 cursor-pointer"
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
          className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black active:scale-95 border-2 border-black dark:border-white font-mono text-[10.5px] font-black tracking-wider uppercase shadow-[3px_3px_0_#f59e0b] transition-all cursor-pointer select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>✦ CLICK HERE TO EXPLORE PORTFOLIO ✦</span>
        </button>
      </footer>
    </section>
  );
}
