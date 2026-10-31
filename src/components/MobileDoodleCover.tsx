"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export function MobileDoodleCover() {
  const router = useRouter();
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
            alt="Harsh Aryan"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_16%]"
          />
        </motion.div>

        {/* Ambient Floating Atmospheric Glow Orbs */}
        <motion.div
          className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-amber-500/20 blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 -left-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.35, 0.2],
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
        <div className="absolute bottom-0 left-0 right-0 h-[68%] bg-gradient-to-t from-black via-black/85 via-50% to-transparent pointer-events-none" />

        {/* Subtle Edge Vignette */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>

      {/* ── Top Bar: Identity Badge & Theme Switcher (Zero Icons) ── */}
      <header className="relative z-20 w-full flex items-center justify-between px-5 pt-6 sm:pt-7">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white/90">
            CHENNAI &bull; 2026
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <ThemeToggle />
        </motion.div>
      </header>

      {/* ── Bottom Section: Bold Editorial Typography & Navigation (Zero Icons) ── */}
      <footer className="relative z-20 w-full flex flex-col items-center text-center px-5 pb-7 pt-4">
        {/* Role Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-2.5 backdrop-blur-md shadow-sm"
        >
          <span>Teaching Assistant &bull; IIT Madras</span>
        </motion.div>

        {/* Editorial Bold Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
          className="font-mono text-4xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
        >
          HARSH ARYAN
        </motion.h1>

        {/* Specialization Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: "easeOut" }}
          className="relative inline-block mt-1 mb-2"
        >
          <span className="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest text-stone-200">
            AI &amp; Data Science Specialist
          </span>
          <span
            className="block h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-1 opacity-70"
            aria-hidden="true"
          />
        </motion.div>

        {/* Brief Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.38, ease: "easeOut" }}
          className="text-stone-300 text-[12px] sm:text-[13px] max-w-[310px] leading-relaxed drop-shadow font-sans mb-4"
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
          transition={{ duration: 0.5, delay: 0.45 }}
          className="w-full max-w-[290px] py-3.5 px-6 rounded-full bg-white text-black font-mono text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:bg-amber-300 active:scale-95 transition-all cursor-pointer"
        >
          ENTER PORTFOLIO
        </motion.button>

        {/* Quick Chapter Navigation Chips (Text Only — Clean, Direct, Zero Icons) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-3.5 max-w-[320px]"
        >
          <button
            type="button"
            onClick={() => navigateTo("/about")}
            className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 font-mono text-[11px] font-bold tracking-wider hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/projects")}
            className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 font-mono text-[11px] font-bold tracking-wider hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/certificates")}
            className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 font-mono text-[11px] font-bold tracking-wider hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          >
            Certificates
          </button>
          <button
            type="button"
            onClick={() => navigateTo("/contact")}
            className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 font-mono text-[11px] font-bold tracking-wider hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer"
          >
            Contact
          </button>
        </motion.div>

        {/* Animated Swipe Up Indicator */}
        <motion.div
          onClick={() => navigateTo("/about")}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center cursor-pointer mt-4 pt-1 group"
          role="button"
          tabIndex={0}
          aria-label="Swipe up or tap to enter portfolio"
        >
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors">
            SWIPE UP TO EXPLORE
          </span>
          <div className="w-1.5 h-4 rounded-full bg-gradient-to-b from-white/80 via-white/40 to-transparent mt-1.5 animate-pulse" />
        </motion.div>
      </footer>
    </section>
  );
}
