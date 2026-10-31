"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function MobileDoodleCover() {
  const router = useRouter();
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const navigateToAbout = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      router.push("/about");
    }, 280);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    // Swipe up detected (finger moved up by > 45px)
    if (diff > 45) {
      navigateToAbout();
    }
    setTouchStartY(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20) {
      navigateToAbout();
    }
  };

  return (
    <section
      className={`w-full min-h-[100dvh] bg-news-texture flex flex-col justify-between px-5 py-6 select-none transition-all duration-300 ${
        isLeaving ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      aria-label="Harsh Aryan Mobile Portfolio Cover"
    >
      {/* ── Top Bar: Edition & Dark Mode Toggle ── */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border-2 border-black dark:border-white bg-white dark:bg-stone-900 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]">
            CHENNAI • 2026
          </span>
        </div>

        <ThemeToggle />
      </div>

      {/* ── Central Hero Content ── */}
      <div className="w-full flex flex-col items-center text-center my-auto py-4">
        {/* Polaroid Photo Frame with Doodle Tape Accent */}
        <div className="relative mb-5 group">
          {/* Hand-drawn Washi Tape Accent */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-300 dark:bg-amber-400 border border-black/40 rotate-[-2deg] shadow-sm z-20 pointer-events-none rounded-sm"
            aria-hidden="true"
          />

          {/* Sparkle doodle on top-right */}
          <span
            className="absolute -top-4 -right-3 text-base text-amber-500 dark:text-amber-300 animate-pulse pointer-events-none z-20"
            aria-hidden="true"
          >
            ✦
          </span>

          {/* Polaroid Outer Box */}
          <div className="relative p-2.5 pb-4 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-300">
            <div className="relative w-44 h-52 sm:w-48 sm:h-56 overflow-hidden rounded border border-black/30 dark:border-white/30 bg-stone-100 dark:bg-stone-800">
              <Image
                src="/harsh-cover.jpg"
                alt="Harsh Aryan"
                fill
                priority
                sizes="200px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Doodle Typography Name */}
        <div className="relative mb-2">
          <h1 className="font-mono text-3xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white">
            HARSH ARYAN
          </h1>
          {/* Subtle highlighter stroke doodle */}
          <div
            className="absolute -bottom-1 left-2 right-2 h-2 bg-amber-300/60 dark:bg-amber-400/30 -rotate-1 -z-10 rounded-sm"
            aria-hidden="true"
          />
        </div>

        {/* Current Role & Specialization (Zero '@', Clean & Clear) */}
        <div className="flex flex-col items-center gap-1.5 mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border-2 border-black dark:border-white bg-white dark:bg-stone-900 text-black dark:text-white font-mono text-xs font-bold shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Teaching Assistant • IIT Madras</span>
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
            AI &amp; Data Science Specialist
          </span>
        </div>

        {/* ── Connected Doodle Icons (Pathways Ecosystem) ── */}
        <div className="relative w-full max-w-[300px] sm:max-w-[320px] mx-auto py-2">
          {/* SVG Dashed Connecting Arrows */}
          <svg
            viewBox="0 0 300 60"
            className="w-full h-12 text-black dark:text-white pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            aria-hidden="true"
          >
            {/* Connecting curve 1: Code -> AI */}
            <path d="M 50 30 C 80 15, 95 15, 125 30" strokeLinecap="round" />
            <polygon points="125,30 117,26 119,32" fill="currentColor" stroke="none" />

            {/* Connecting curve 2: AI -> Work */}
            <path d="M 175 30 C 205 45, 220 45, 250 30" strokeLinecap="round" />
            <polygon points="250,30 242,27 244,33" fill="currentColor" stroke="none" />
          </svg>

          {/* 3 Core Interactive Doodle Nodes */}
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {/* Node 1: Code */}
            <Link
              href="/projects"
              className="flex flex-col items-center gap-1 p-2 bg-white dark:bg-stone-900 rounded-xl border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] hover:-translate-y-1 active:translate-y-0.5 transition-all"
              title="Code & Architecture"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                Code
              </span>
            </Link>

            {/* Node 2: AI */}
            <Link
              href="/about"
              className="flex flex-col items-center gap-1 p-2 bg-white dark:bg-stone-900 rounded-xl border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] hover:-translate-y-1 active:translate-y-0.5 transition-all scale-105"
              title="AI & Machine Learning"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  <path d="M5.6 5.6l2.2 2.2M16.2 16.2l2.2 2.2M5.6 18.4l2.2-2.2M16.2 7.8l2.2-2.2" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                AI / ML
              </span>
            </Link>

            {/* Node 3: Projects */}
            <Link
              href="/projects"
              className="flex flex-col items-center gap-1 p-2 bg-white dark:bg-stone-900 rounded-xl border-2 border-black dark:border-white shadow-[2.5px_2.5px_0_#000] dark:shadow-[2.5px_2.5px_0_#fff] hover:-translate-y-1 active:translate-y-0.5 transition-all"
              title="Live Projects"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 4 14 11 14 9 22 20 10 13 10 13 2" />
                </svg>
              </div>
              <span className="font-mono text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                Projects
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Animated Doodle Scroll Cue ── */}
      <div className="w-full flex flex-col items-center justify-center pt-2 pb-2">
        <button
          type="button"
          onClick={navigateToAbout}
          className="group flex flex-col items-center gap-1 text-black dark:text-white cursor-pointer active:scale-95 transition-transform"
          aria-label="Scroll or tap to enter portfolio"
        >
          <span className="font-mono text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1">
            <span>SCROLL TO EXPLORE</span>
            <span className="text-amber-500 dark:text-amber-400">✎</span>
          </span>

          {/* Animated Bouncy Doodle Arrow */}
          <div className="w-6 h-6 flex items-center justify-center animate-bounce">
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-black dark:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 4v16" />
              <path d="M6 14l6 6 6-6" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}
