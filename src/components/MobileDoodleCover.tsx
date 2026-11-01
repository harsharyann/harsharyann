"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ChevronDown, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { formatGoogleDriveImageUrl, isGoogleDriveUrl } from "@/lib/googleDrive";
import { extractVibrantColor } from "@/lib/colorExtractor";

/* ── Rich 4K Handcrafted Colorful Vector Doodles (Posca Marker & Comic Style) ── */

function ColorfulCrownDoodle({
  className = "",
  fill = "#facc15",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 54 34"
      className={className}
      fill="none"
      stroke="#000000"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Crown Base & Peaks with dynamic adaptive fill */}
      <path
        d="M 6 28 L 48 28 L 46 11 L 35 19 L 27 6 L 19 19 L 8 11 Z"
        fill={fill}
      />
      {/* Gem Jewels */}
      <circle cx="27" cy="6" r="2.8" fill="#ec4899" stroke="#000000" strokeWidth="1.6" />
      <circle cx="8" cy="11" r="2.4" fill="#06b6d4" stroke="#000000" strokeWidth="1.6" />
      <circle cx="46" cy="11" r="2.4" fill="#3b82f6" stroke="#000000" strokeWidth="1.6" />
      {/* Bottom Trim Line with Pattern */}
      <line x1="10" y1="24" x2="44" y2="24" stroke="#000000" strokeWidth="1.8" strokeDasharray="3 2" />
      <circle cx="20" cy="24" r="1.5" fill="#ffffff" stroke="none" />
      <circle cx="27" cy="24" r="1.5" fill="#ffffff" stroke="none" />
      <circle cx="34" cy="24" r="1.5" fill="#ffffff" stroke="none" />
    </svg>
  );
}

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
  const router = useRouter();
  const { data: portfolio } = usePortfolio();
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [accentColor, setAccentColor] = useState<string>("#facc15");

  const scrollDown = () => {
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    // Swipe up detected (finger moved up by > 40px)
    if (diff > 40) {
      scrollDown();
    }
    setTouchStartY(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20) {
      scrollDown();
    }
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
      className="relative w-full min-h-[100dvh] select-none bg-[#090a0f] text-white flex flex-col justify-between"
      aria-label="Harsh Aryan 4K Colorful Doodle Cover"
    >
      {/* ── 1. PURE ORIGINAL FULLSCREEN HERO PORTRAIT (Hardware Accelerated) ── */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ contain: "strict" }}>
        <motion.div
          className="relative w-full h-full"
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
          {/* Pure High-Definition Photo As Uploaded (Zero Filters, Zero Artificial Overlays) */}
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

        {/* ── Clean Soft Bottom Fade (Ensures text legibility while keeping photo 100% clear) ── */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[62%] bg-gradient-to-t from-black via-black/85 via-48% to-transparent pointer-events-none" />
      </div>

      {/* ── 2. TOP BAR: Admin Lock (Dynamically adapts border & dot to photo accent color) ── */}
      <header className="relative z-30 w-full px-5 pt-4 flex items-center justify-end">
        {/* Admin Link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-widest uppercase text-white bg-black/75 hover:bg-black backdrop-blur-md px-3 py-1 rounded-full border-2 transition-all active:scale-95 shadow-[2px_2px_0_#000]"
          style={{
            borderColor: accentColor,
            transition: "border-color 0.4s ease, box-shadow 0.4s ease",
          }}
          title="Admin CMS Console"
        >
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-400"
            style={{ backgroundColor: accentColor }}
          />
          <span>ADMIN</span>
        </Link>
      </header>

      {/* ── 3. FLOATING 4K COLORFUL VECTOR DOODLES OVER PORTRAIT ── */}
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

      {/* ── 4. COLORFUL SKETCH HERO & TYPOGRAPHY (Neo-Brutalist Posca Art) ── */}
      <footer className="relative z-30 w-full px-5 pb-5 pt-1 flex flex-col items-center text-center">
        {/* Name Container with 4K Colorful Crown */}
        <div className="relative inline-block mb-2">
          {/* Posca Gold Crown with Ruby & Sapphire Gems (Dynamically adapts to photo accent color) */}
          <motion.div
            initial={{ scale: 0, rotate: -16 }}
            animate={{ scale: 1, rotate: [-14, -8, -14], y: [0, -2, 0] }}
            transition={{
              scale: { duration: 0.5, delay: 0.15 },
              rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-8 -left-4 pointer-events-none z-10"
          >
            <ColorfulCrownDoodle
              fill={accentColor}
              className="w-13 h-8 sm:w-14 sm:h-9 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transition-colors duration-500"
            />
          </motion.div>

          {/* Monumental Name in Cool Doodle Permanent Marker with 3D Pop-Art Shadow matching Photo */}
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

        {/* ── 2 COLORFUL HIGHLIGHTER SKETCH PILLS (Posca Marker Style) ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-2.5 max-w-[340px]"
        >
          {/* Yellow Highlighter Pill */}
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#fef08a] text-black font-hero-heading text-[12px] font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#000]">
            <span>{portfolio?.personal?.mobileBadge1 || "TA IIT Madras"}</span>
          </span>

          {/* Electric Cyan Highlighter Pill */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#a5f3fc] text-black font-hero-heading text-[12px] font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#000]">
            <span>✦</span>
            <span>{portfolio?.personal?.mobileBadge2 || "AI & Data Science"}</span>
          </span>
        </motion.div>

        {/* Punchy Narrative Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26 }}
          className="text-stone-300 text-xs sm:text-sm font-drawing-kids text-sm font-medium tracking-[0.12em] drop-shadow mb-4 max-w-[320px]"
        >
          {portfolio?.personal?.mobileTagline || "Teaching Machines To Learn • Building Scientific Software"}
        </motion.p>

        {/* ── COLORFUL NEO-BRUTALIST SOCIAL DOCK ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex items-center justify-center gap-3.5 mb-4"
        >
          {/* GitHub (Electric White with Cyan Shadow) */}
          <a
            href={portfolio?.socialLinks?.github || "https://github.com/harsharyann"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-black text-black hover:text-white border-2 border-black shadow-[2.5px_2.5px_0_#38bdf8] transition-all duration-200 active:scale-90"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* LinkedIn (Blue with Yellow Shadow) */}
          <a
            href={portfolio?.socialLinks?.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0077b5] text-white border-2 border-black shadow-[2.5px_2.5px_0_#fde047] transition-all duration-200 active:scale-90"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* Email (Amber with Purple Shadow) */}
          <a
            href={`mailto:${portfolio?.personal?.email || "harsharyan@outlook.com"}`}
            aria-label="Send Email"
            title="Email Harsh"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#fbbf24] text-black border-2 border-black shadow-[2.5px_2.5px_0_#c084fc] transition-all duration-200 active:scale-90"
          >
            <Mail className="w-4 h-4" />
          </a>
        </motion.div>

        {/* ── LIQUID GLASS BUBBLE EXPLORE BUTTON ── */}
        <motion.button
          type="button"
          onClick={scrollDown}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="group relative flex items-center gap-2.5 px-6 py-2.5 rounded-full text-white backdrop-blur-2xl bg-white/20 hover:bg-white/30 border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.7)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          aria-label="Scroll down to explore portfolio"
        >
          {/* Subtle liquid sheen reflection inside bubble */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Glowing pulse dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300" />
          </span>

          <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Explore Portfolio
          </span>

          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/25 border border-white/40 text-white shadow-xs group-hover:translate-y-0.5 transition-transform">
            <ChevronDown className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
        </motion.button>
      </footer>
    </section>
  );
}
