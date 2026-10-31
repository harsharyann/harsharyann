"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";

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

        {/* Ambient Floating 3D Fluid Atmosphere Orbs (Sampled from mural yellow & t-shirt sage green) */}
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
        {/* Top Vignette for Status & Controls */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

        {/* Bottom Rich Gradient for Editorial Readability */}
        <div className="absolute bottom-0 left-0 right-0 h-[72%] bg-gradient-to-t from-black via-black/85 via-50% to-transparent pointer-events-none" />

        {/* Subtle Edge Vignette */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>

      {/* ── Top Bar: Active Status Badge, Admin Lock & Cool Theme Switcher (Chennai 2026 removed) ── */}
      <header className="relative z-20 w-full flex items-center justify-between px-5 pt-6 sm:pt-7">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/90">
            {portfolio.personal.availability ? "ONLINE" : "ONLINE"}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          <Link
            href="/admin"
            aria-label="Admin Portal"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white/70 hover:text-amber-400 active:scale-95 transition-all"
            title="Admin Console (Locked)"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
          <ThemeToggle />
        </motion.div>
      </header>

      {/* ── Bottom Section: Typography, Sampled Color Role Badge & Social Dock ── */}
      <footer className="relative z-20 w-full flex flex-col items-center text-center px-5 pb-7 pt-4">
        {/* Editorial Bold Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.18, ease: "easeOut" }}
          className="font-mono text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
        >
          {portfolio.personal.name || "HARSH ARYAN"}
        </motion.h1>

        {/* Teaching Assistant Badge — Placed directly below the name & Color-sampled from the mural */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/25 via-emerald-600/20 to-teal-500/25 border border-amber-400/50 text-amber-300 font-mono text-[11px] sm:text-xs font-black tracking-wider uppercase mt-2 mb-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.25)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{portfolio.personal.role || "Teaching Assistant • IIT Madras"}</span>
        </motion.div>

        {/* Specialization Subtitle with mural-sampled gradient divider */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32, ease: "easeOut" }}
          className="relative inline-block mt-0.5 mb-2.5 max-w-[320px]"
        >
          <span className="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest text-stone-200 drop-shadow line-clamp-1">
            {portfolio.personal.headline || "AI & Data Science Specialist"}
          </span>
          <span
            className="block h-[2px] w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 mt-1 opacity-80"
            aria-hidden="true"
          />
        </motion.div>

        {/* Brief Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease: "easeOut" }}
          className="text-stone-300 text-[12px] sm:text-[13px] max-w-[310px] leading-relaxed drop-shadow font-sans mb-3.5"
        >
          Designing intelligent models, exploratory analytics &amp; modern software systems.
        </motion.p>

        {/* Primary Animated Action Button */}
        <motion.button
          type="button"
          onClick={() => navigateTo("/about")}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          className="w-full max-w-[280px] py-3 px-6 rounded-full bg-white text-black font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
        >
          ENTER PORTFOLIO
        </motion.button>

        {/* Social Icons Dock — Email, LinkedIn, GitHub (Replacing the old About/Projects/Certificates/Contact pills) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-3 mt-3.5"
        >
          {/* GitHub Icon Button */}
          <a
            href={portfolio.socialLinks.github || "https://github.com/harsharyann"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            title="GitHub"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
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
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-[#0077b5] text-white border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_15px_rgba(0,119,181,0.5)]"
          >
            <LinkedinIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>

          {/* Email Icon Button */}
          <a
            href={`mailto:${portfolio.personal.email || "harsharyan@outlook.com"}`}
            aria-label="Send Email"
            title="Email Harsh"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-black/60 hover:bg-amber-400 text-white hover:text-black border border-white/25 backdrop-blur-xl transition-all duration-200 active:scale-90 shadow-md hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]"
          >
            <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
          </a>
        </motion.div>

        {/* Animated Swipe Up Indicator */}
        <motion.div
          onClick={() => navigateTo("/about")}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer mt-3.5 pt-1 group"
          role="button"
          tabIndex={0}
          aria-label="Swipe up or tap to enter portfolio"
        >
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors">
            SWIPE UP TO EXPLORE
          </span>
          <div className="w-1.5 h-3.5 rounded-full bg-gradient-to-b from-white/80 via-white/40 to-transparent mt-1 animate-pulse" />
        </motion.div>
      </footer>
    </section>
  );
}
