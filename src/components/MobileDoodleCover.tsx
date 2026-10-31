"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden select-none bg-black text-white z-40 flex flex-col justify-end"
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

      {/* ── Bottom Section: Redesigned Cool Editorial Hero Typography & Social Dock ── */}
      <footer className="relative z-20 w-full flex flex-col items-center text-center px-6 pb-8 pt-4">
        {/* Cool Display Name — Space Grotesk Bold Editorial Styling */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: "easeOut" }}
          className="font-['Space_Grotesk'] text-[2.75rem] sm:text-5xl font-black tracking-[-0.03em] uppercase text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)]"
        >
          {portfolio.personal.name || "HARSH ARYAN"}
        </motion.h1>

        {/* Teaching Assistant Badge — Sleek Glass Capsule directly below the name */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-2xl border border-amber-400/50 text-amber-300 font-['Space_Grotesk'] text-[11px] sm:text-xs font-bold tracking-wider uppercase mt-2 mb-2 shadow-[0_0_24px_rgba(245,158,11,0.25)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>{portfolio.personal.role || "Teaching Assistant • IIT Madras"}</span>
        </motion.div>

        {/* Headline & Discipline — Stylish Minimalist Tag */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.28, ease: "easeOut" }}
          className="relative inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-xl mb-2.5 max-w-[340px]"
        >
          <span className="font-['Space_Grotesk'] text-[11.5px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-stone-200 drop-shadow line-clamp-1">
            {portfolio.personal.headline || "AI & Data Science Specialist"}
          </span>
        </motion.div>

        {/* Editorial Subtitle Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.34, ease: "easeOut" }}
          className="text-stone-300/85 text-[12px] sm:text-[13px] max-w-[310px] leading-relaxed drop-shadow font-sans mb-4 font-normal"
        >
          Designing intelligent models, exploratory analytics &amp; modern software systems.
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
