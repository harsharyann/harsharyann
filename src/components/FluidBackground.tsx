"use client";

import React from "react";

export function FluidBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── Light Mode Fluid Mesh Gradient Layer ── */}
      <div className="dark:hidden absolute inset-0 w-full h-full bg-[#fafafd] transition-opacity duration-500">
        {/* Fluid Orb 1: Warm Radiant Amber / Peach / Sunset Coral */}
        <div
          className="absolute -top-[12%] -left-[10%] w-[58vw] min-w-[340px] max-w-[700px] h-[58vw] min-h-[340px] max-h-[700px] rounded-full opacity-65 blur-[100px] sm:blur-[130px] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at center, rgba(251, 191, 36, 0.45) 0%, rgba(251, 146, 60, 0.35) 45%, rgba(244, 63, 94, 0.22) 75%, transparent 100%)",
            animation: "fluidDrift1 22s ease-in-out infinite alternate",
          }}
        />

        {/* Fluid Orb 2: Electric Violet / Indigo Breeze */}
        <div
          className="absolute top-[2%] -right-[12%] w-[54vw] min-w-[320px] max-w-[660px] h-[54vw] min-h-[320px] max-h-[660px] rounded-full opacity-60 blur-[110px] sm:blur-[140px] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at center, rgba(129, 140, 248, 0.45) 0%, rgba(99, 102, 241, 0.35) 50%, rgba(192, 132, 252, 0.2) 80%, transparent 100%)",
            animation: "fluidDrift2 26s ease-in-out infinite alternate",
          }}
        />

        {/* Fluid Orb 3: Fresh Emerald / Mint / Sky Blue */}
        <div
          className="absolute bottom-[10%] -left-[8%] w-[52vw] min-w-[300px] max-w-[620px] h-[52vw] min-h-[300px] max-h-[620px] rounded-full opacity-55 blur-[100px] sm:blur-[130px] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at center, rgba(52, 211, 153, 0.4) 0%, rgba(56, 189, 248, 0.32) 55%, rgba(147, 197, 253, 0.18) 85%, transparent 100%)",
            animation: "fluidDrift3 24s ease-in-out infinite alternate",
          }}
        />

        {/* Fluid Orb 4: Rose Quartz / Sunset Magenta Accent */}
        <div
          className="absolute -bottom-[10%] -right-[8%] w-[56vw] min-w-[320px] max-w-[680px] h-[56vw] min-h-[320px] max-h-[680px] rounded-full opacity-55 blur-[110px] sm:blur-[140px] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(circle at center, rgba(244, 114, 182, 0.38) 0%, rgba(251, 146, 60, 0.28) 50%, rgba(253, 224, 71, 0.2) 80%, transparent 100%)",
            animation: "fluidDrift1 28s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Fluid Orb 5: Center Ambient Atmosphere */}
        <div
          className="absolute top-[35%] left-[18%] w-[64vw] max-w-[750px] h-[38vw] max-h-[480px] rounded-full opacity-40 blur-[130px] sm:blur-[160px] mix-blend-multiply"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(167, 139, 250, 0.28) 0%, rgba(254, 215, 170, 0.22) 50%, transparent 80%)",
            animation: "fluidDrift2 20s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Tactile Paper Texture & Fine Dot Grid Overlay */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-color-burn"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0, 0, 0, 0.08) 1.1px, transparent 1.1px), linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
            backgroundSize: "28px 28px, 28px 28px, 28px 28px",
          }}
        />
      </div>

      {/* ── Dark Mode Cosmic Obsidian Nebula Layer ── */}
      <div className="hidden dark:block absolute inset-0 w-full h-full bg-[#09090b] transition-opacity duration-500">
        {/* Dark Nebula Orb 1: Deep Indigo Aura */}
        <div
          className="absolute -top-[10%] -left-[10%] w-[58vw] min-w-[340px] max-w-[700px] h-[58vw] min-h-[340px] max-h-[700px] rounded-full opacity-45 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 50%, transparent 80%)",
            animation: "fluidDrift1 26s ease-in-out infinite alternate",
          }}
        />

        {/* Dark Nebula Orb 2: Deep Violet / Purple Shimmer */}
        <div
          className="absolute top-[5%] -right-[12%] w-[52vw] min-w-[320px] max-w-[660px] h-[52vw] min-h-[320px] max-h-[660px] rounded-full opacity-40 blur-[150px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(168, 85, 247, 0.18) 0%, rgba(139, 92, 246, 0.08) 55%, transparent 80%)",
            animation: "fluidDrift2 30s ease-in-out infinite alternate",
          }}
        />

        {/* Dark Nebula Orb 3: Deep Emerald Cyan Flare */}
        <div
          className="absolute -bottom-[8%] -left-[6%] w-[54vw] min-w-[300px] max-w-[620px] h-[54vw] min-h-[300px] max-h-[620px] rounded-full opacity-35 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 80%)",
            animation: "fluidDrift3 28s ease-in-out infinite alternate",
          }}
        />

        {/* Dark Nebula Orb 4: Subtle Amber Ember */}
        <div
          className="absolute bottom-[2%] -right-[6%] w-[50vw] min-w-[300px] max-w-[620px] h-[50vw] min-h-[300px] max-h-[620px] rounded-full opacity-30 blur-[150px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(245, 158, 11, 0.14) 0%, rgba(239, 68, 68, 0.06) 50%, transparent 80%)",
            animation: "fluidDrift1 32s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Architectural Fine Grid for Deep Contrast */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255, 255, 255, 0.08) 1.1px, transparent 1.1px), linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
            backgroundSize: "28px 28px, 28px 28px, 28px 28px",
          }}
        />
      </div>

      {/* Embedded Fluid Keyframe Animations */}
      <style jsx>{`
        @keyframes fluidDrift1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate3d(5vw, 4vh, 0) scale(1.08) rotate(3deg);
          }
          100% {
            transform: translate3d(-4vw, 6vh, 0) scale(0.95) rotate(-2deg);
          }
        }
        @keyframes fluidDrift2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
          50% {
            transform: translate3d(-6vw, -5vh, 0) scale(1.1) rotate(-4deg);
          }
          100% {
            transform: translate3d(4vw, -3vh, 0) scale(0.96) rotate(2deg);
          }
        }
        @keyframes fluidDrift3 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(4vw, -4vh, 0) scale(1.06);
          }
          100% {
            transform: translate3d(-3vw, 5vh, 0) scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
