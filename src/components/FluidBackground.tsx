"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

export function FluidBackground() {
  const { theme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Mouse-tracking for liquid bento card cursor glow (skips touch devices)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const card = (e.target as HTMLElement)?.closest?.(".liquid-bento-card") as HTMLElement | null;
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#edf6fa] dark:bg-[#050814]"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#edf6fa] dark:bg-[#050814] transition-colors duration-700"
      aria-hidden="true"
    >
      {/* ── 1. Apple Liquid Glass Water Orbs (Pure CSS Drift & Morph) ── */}
      <div className="absolute inset-0 overflow-hidden filter blur-[70px] sm:blur-[100px] md:blur-[130px] opacity-90 dark:opacity-85 scale-105 will-change-transform">
        {/* Orb 1: Deep Ocean Aqua / Teal */}
        <div
          className={`absolute rounded-full pointer-events-none liquid-orb liquid-orb-1 ${
            isDark
              ? "bg-[radial-gradient(circle,rgba(13,148,136,0.65)_0%,rgba(15,118,110,0.35)_45%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(45,212,191,0.55)_0%,rgba(94,234,212,0.3)_45%,transparent_70%)]"
          }`}
          style={{
            width: "65vw",
            height: "65vw",
            minWidth: "400px",
            minHeight: "400px",
            top: "-10%",
            left: "-10%",
          }}
        />

        {/* Orb 2: Ice Blue Water Body */}
        <div
          className={`absolute rounded-full pointer-events-none liquid-orb liquid-orb-2 ${
            isDark
              ? "bg-[radial-gradient(circle,rgba(2,132,199,0.7)_0%,rgba(3,105,161,0.4)_50%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(125,211,252,0.6)_0%,rgba(186,230,253,0.35)_50%,transparent_70%)]"
          }`}
          style={{
            width: "75vw",
            height: "75vw",
            minWidth: "450px",
            minHeight: "450px",
            top: "20%",
            right: "-15%",
          }}
        />

        {/* Orb 3: Deep Abyssal Oceanic Indigo */}
        <div
          className={`absolute rounded-full pointer-events-none liquid-orb liquid-orb-3 ${
            isDark
              ? "bg-[radial-gradient(circle,rgba(30,27,75,0.85)_0%,rgba(49,46,129,0.55)_50%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(165,180,252,0.45)_0%,rgba(199,210,254,0.25)_50%,transparent_70%)]"
          }`}
          style={{
            width: "70vw",
            height: "70vw",
            minWidth: "420px",
            minHeight: "420px",
            bottom: "-15%",
            left: "10%",
          }}
        />

        {/* Orb 4: Soft Lavender Shimmer */}
        <div
          className={`absolute rounded-full pointer-events-none liquid-orb liquid-orb-4 ${
            isDark
              ? "bg-[radial-gradient(circle,rgba(76,29,149,0.5)_0%,rgba(109,40,217,0.25)_50%,transparent_70%)]"
              : "bg-[radial-gradient(circle,rgba(216,180,254,0.4)_0%,rgba(233,213,255,0.2)_50%,transparent_70%)]"
          }`}
          style={{
            width: "55vw",
            height: "55vw",
            minWidth: "350px",
            minHeight: "350px",
            top: "40%",
            left: "25%",
          }}
        />

        {/* Orb 5: Pure White Water Light Reflection / Caustic Sunlight Gleam */}
        <div
          className={`absolute rounded-full pointer-events-none liquid-orb liquid-orb-5 ${
            isDark
              ? "bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,rgba(255,255,255,0.12)_35%,transparent_65%)]"
              : "bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(224,242,254,0.45)_40%,transparent_70%)]"
          }`}
          style={{
            width: "50vw",
            height: "50vw",
            minWidth: "320px",
            minHeight: "320px",
            top: "5%",
            left: "35%",
          }}
        />
      </div>

      {/* ── 2. Subtle Water Caustics / Sunlight Rippling On Water ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-15 mix-blend-overlay liquid-caustics"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.6) 0%, transparent 40%),
                            radial-gradient(ellipse at 70% 60%, rgba(56,189,248,0.4) 0%, transparent 45%),
                            radial-gradient(ellipse at 50% 90%, rgba(45,212,191,0.3) 0%, transparent 50%)`,
          backgroundSize: "140% 140%",
        }}
        aria-hidden="true"
      />

      {/* ── 3. Subtle Film Grain / Noise Layer For Depth (Zero Banding) ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] dark:opacity-[0.045] mix-blend-overlay"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <filter id="liquid-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#liquid-grain)" />
      </svg>

      {/* ── 4. Apple Liquid Glass Optical Sheen Surface Refraction ── */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.08] via-transparent to-black/[0.04] dark:from-white/[0.03] dark:via-transparent dark:to-black/[0.08] backdrop-blur-[1.5px]"
        aria-hidden="true"
      />
    </div>
  );
}
