"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Shield } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";

/* ── Hand-Drawn Mural-Adaptive SVG Doodles (Sampled from the background graffiti wall) ── */

function MuralCrownDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      className={className}
      fill="#fbbf24"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M 4 20 L 36 20 L 34 8 L 26 14 L 20 4 L 14 14 L 6 8 Z" />
      <circle cx="20" cy="4" r="1.6" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
      <circle cx="6" cy="8" r="1.4" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
      <circle cx="34" cy="8" r="1.4" fill="#ffffff" stroke="#000" strokeWidth="1.2" />
    </svg>
  );
}

function MuralStarDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={className}
      fill="#fde047"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2 L22 12 L33 13 L25 21 L28 32 L18 26 L8 32 L11 21 L3 13 L14 12 Z" />
      {/* Cute cartoon eyes */}
      <circle cx="15" cy="18" r="1.4" fill="#000000" />
      <circle cx="21" cy="18" r="1.4" fill="#000000" />
      {/* Little blushing cheeks */}
      <circle cx="12" cy="21" r="1.2" fill="#f43f5e" opacity="0.8" />
      <circle cx="24" cy="21" r="1.2" fill="#f43f5e" opacity="0.8" />
    </svg>
  );
}

function MuralSparkleDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="#facc15"
      stroke="#000000"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 0 Q12 12 0 12 Q12 12 12 24 Q12 12 24 12 Q12 12 12 0 Z" />
    </svg>
  );
}

function MuralIdeaDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 38"
      className={className}
      fill="#a7f3d0"
      stroke="#000000"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Glow rays */}
      <path d="M16 2 L16 5" stroke="#f59e0b" strokeWidth="2.5" />
      <path d="M6 7 L9 10" stroke="#f59e0b" strokeWidth="2.5" />
      <path d="M26 7 L23 10" stroke="#f59e0b" strokeWidth="2.5" />
      {/* Bulb body */}
      <path d="M10 24 C6 20 4 15 6 10 C8 5 12 3 16 3 C20 3 24 5 26 10 C28 15 26 20 22 24 L22 29 L10 29 Z" />
      <path d="M12 33 L20 33" strokeWidth="2.5" />
      {/* Cute face inside bulb */}
      <circle cx="13" cy="14" r="1.2" fill="#000000" />
      <circle cx="19" cy="14" r="1.2" fill="#000000" />
      <path d="M14 18 Q16 20 18 18" stroke="#000000" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function MobileDoodleCover() {
  const router = useRouter();
  const { data: portfolio } = usePortfolio();
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  const navigateTo = (path: string = "/about") => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      router.push(path);
    }, 380);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
    setTouchDeltaY(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY - currentY;
    if (diff > 0) {
      setTouchDeltaY(Math.min(diff, 100));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    // Swipe up detected (finger moved up by > 45px)
    if (diff > 45) {
      navigateTo("/about");
    } else {
      setTouchDeltaY(0);
    }
    setTouchStartY(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20) {
      navigateTo("/about");
    }
  };

  return (
    <section
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden select-none bg-black text-white z-40 flex flex-col justify-between"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      aria-label="Harsh Aryan Mobile Portfolio Cover"
      style={{
        transform: isLeaving
          ? "translateY(-100%)"
          : `translateY(-${touchDeltaY * 0.35}px)`,
        opacity: isLeaving ? 0 : 1,
        transition: isLeaving
          ? "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease"
          : touchStartY === null
          ? "transform 0.25s ease-out"
          : "none",
      }}
    >
      {/* ── Fullscreen Animated Photo (Ken Burns Ambient Drift) ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.08, 1.03, 1],
            y: [0, -12, -4, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <Image
            src="/harsh-cover.jpg"
            alt={portfolio.personal.name || "Harsh Aryan"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_16%]"
          />
        </motion.div>

        {/* Ambient Floating 3D Atmosphere Orbs (Mural gold & sage green) */}
        <motion.div
          className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-amber-500/25 blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -left-20 w-72 h-72 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.38, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cinematic Multi-Stop Overlays */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[76%] bg-gradient-to-t from-black via-black/90 via-55% to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>

      {/* ── TOP BAR: Small Discreet Admin Link (Requested by user) ── */}
      <div className="relative z-30 w-full flex items-center justify-end px-5 pt-5">
        <Link
          href="/admin"
          className="group inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 hover:border-amber-400/50 transition-all shadow-sm active:scale-95"
          title="Admin CMS Console"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>admin</span>
        </Link>
      </div>

      {/* ── Bottom Section: Redesigned Cool Editorial Hero Typography & Mural Doodles ── */}
      <footer className="relative z-20 w-full flex flex-col items-center text-center px-6 pb-7 pt-2">
        {/* Title Container with Adaptive Mural Doodles */}
        <div className="relative inline-block mb-1">
          {/* Doodle Crown resting on the name with playful tilt */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: [-10, -6, -10] }}
            transition={{
              scale: { duration: 0.5, delay: 0.2 },
              rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-6 -left-3 pointer-events-none z-10"
          >
            <MuralCrownDoodle className="w-8 h-6 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
          </motion.div>

          {/* Bobbing Cute Star Doodle on the top right */}
          <motion.div
            initial={{ scale: 0, rotate: 12 }}
            animate={{
              scale: 1,
              rotate: [12, 18, 12],
              y: [0, -3, 0],
            }}
            transition={{
              scale: { duration: 0.5, delay: 0.28 },
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute -top-5 -right-5 pointer-events-none z-10"
          >
            <MuralStarDoodle className="w-7 h-7 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
          </motion.div>

          {/* Sparkle Glint Doodle */}
          <motion.div
            animate={{
              scale: [0.85, 1.15, 0.85],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 -left-6 pointer-events-none"
          >
            <MuralSparkleDoodle className="w-4 h-4 filter drop-shadow" />
          </motion.div>

          {/* Idea Spark Doodle on Right Side */}
          <motion.div
            animate={{
              y: [0, -4, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-3 -right-7 pointer-events-none"
          >
            <MuralIdeaDoodle className="w-6 h-7 filter drop-shadow" />
          </motion.div>

          {/* Bold Display Name — Space Grotesk Black */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
            className="font-['Space_Grotesk'] text-[2.75rem] sm:text-5xl font-black tracking-[-0.035em] uppercase text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)] px-2"
          >
            {portfolio.personal.name || "HARSH ARYAN"}
          </motion.h1>
        </div>

        {/* Teaching Assistant Badge — Sleek Glass Capsule directly below the name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-amber-400/60 text-amber-300 font-['Space_Grotesk'] text-[11px] sm:text-xs font-bold tracking-wider uppercase mt-1.5 mb-2 shadow-[0_0_24px_rgba(245,158,11,0.3)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Teaching Assistant • IIT Madras</span>
        </motion.div>

        {/* Specialty Subtitle — Clean, Unclipped Space Grotesk Tag */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: "easeOut" }}
          className="relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-xl mb-2.5 max-w-[340px]"
        >
          <span className="font-['Space_Grotesk'] text-[11.5px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-stone-200 drop-shadow">
            AI &amp; Data Science Specialist
          </span>
        </motion.div>

        {/* Editorial Subtitle Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.34, ease: "easeOut" }}
          className="text-stone-300/85 text-[12px] sm:text-[13px] max-w-[310px] leading-relaxed drop-shadow font-sans mb-4 font-normal"
        >
          Teaching machines to learn. Building intelligent neural models &amp; software.
        </motion.p>

        {/* Social Icons Dock — Email, LinkedIn, GitHub (Clean Minimal Glass Circles) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-3.5 mb-4"
        >
          {/* GitHub Icon Button */}
          <a
            href={portfolio.socialLinks.github || "https://github.com/harsharyann"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <GithubIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>

          {/* LinkedIn Icon Button */}
          <a
            href={portfolio.socialLinks.linkedin || "https://linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#0077b5] text-white border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_20px_rgba(0,119,181,0.5)]"
          >
            <LinkedinIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>

          {/* Email Icon Button */}
          <a
            href={`mailto:${portfolio.personal.email || "harsharyan@outlook.com"}`}
            aria-label="Send Email"
            title="Email Harsh"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-amber-400 text-white hover:text-black border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]"
          >
            <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
        </motion.div>

        {/* Sleek Animated Swipe Up Indicator Capsule */}
        <motion.div
          onClick={() => navigateTo("/about")}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer pt-1 group"
          role="button"
          tabIndex={0}
          aria-label="Swipe up to explore portfolio"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            <span className="font-['Space_Grotesk'] text-[10.5px] font-bold uppercase tracking-[0.22em] text-white/90">
              Swipe up to explore
            </span>
            <span className="text-amber-400 text-xs group-hover:-translate-y-0.5 transition-transform">
              ↑
            </span>
          </div>
        </motion.div>
      </footer>
    </section>
  );
}
