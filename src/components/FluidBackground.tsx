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

  // Mouse-tracking for liquid bento card cursor glow (throttled via RAF to eliminate layout thrashing)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let rafId: number | null = null;
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const target = e.target as HTMLElement | null;
      const card = target?.closest?.(".liquid-bento-card") as HTMLElement | null;
      if (!card) return;
      if (rafId !== null) return;
      const clientX = e.clientX;
      const clientY = e.clientY;
      rafId = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
        card.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
        rafId = null;
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#faf8f3] dark:bg-[#07080d]"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#faf8f3] dark:bg-[#07080d] transition-colors duration-500"
      style={{ contain: "strict" }}
      aria-hidden="true"
    >
      {/* ── 0. Dark Mode Cyber Ambient Aurora Nebulae ── */}
      {isDark && (
        <>
          {/* Top-Right Indigo/Violet Nebula */}
          <div
            className="absolute -top-32 -right-32 w-[720px] h-[640px] rounded-full pointer-events-none opacity-90 blur-[90px]"
            style={{
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.11) 45%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Mid-Left Cyber Emerald / Teal Aura */}
          <div
            className="absolute top-[38%] -left-40 w-[680px] h-[600px] rounded-full pointer-events-none opacity-85 blur-[95px]"
            style={{
              background: "radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Bottom-Right Solar Gold Star Glow */}
          <div
            className="absolute -bottom-36 right-[5%] w-[650px] h-[550px] rounded-full pointer-events-none opacity-80 blur-[90px]"
            style={{
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.13) 0%, rgba(239, 68, 68, 0.06) 50%, transparent 70%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* ── 1. Minor Graph Paper Grid (24px x 24px Blueprint Pencil Lines) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(to right, rgba(147, 197, 253, 0.042) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 197, 253, 0.042) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(24, 24, 27, 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 24, 27, 0.045) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* ── 2. Major Drafting Grid (120px x 120px Architectural Sections) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(24, 24, 27, 0.085) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 24, 27, 0.085) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      {/* ── 2b. Dark Mode Crosshair Intersection Grid Nodes (120px Architectural Markers) ── */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 0px 0px, rgba(56, 189, 248, 0.35) 1.5px, transparent 2.5px)",
            backgroundSize: "120px 120px",
          }}
          aria-hidden="true"
        />
      )}

      {/* ── 3. Subtle Notebook Margin Guide (Left architectural registration line) ── */}
      <div
        className="hidden md:block absolute top-0 bottom-0 left-[72px] lg:left-[96px] w-[1px] pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: isDark ? "rgba(244, 63, 94, 0.22)" : "rgba(239, 68, 68, 0.18)",
          boxShadow: isDark ? "0 0 8px rgba(244, 63, 94, 0.35)" : "none",
        }}
        aria-hidden="true"
      />

      {/* ── 4. Micro Paper Fiber / Stardust Texture (Crisp, zero-filter, GPU composite) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0)"
            : "radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 0)",
          backgroundSize: isDark ? "20px 20px" : "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* ── 5. Ambient Vignette & Studio Lighting ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(ellipse at 50% 10%, rgba(30, 41, 59, 0.35) 0%, rgba(14, 15, 20, 0.6) 65%, rgba(10, 11, 15, 0.95) 100%)"
            : "radial-gradient(ellipse at 50% 10%, rgba(255, 255, 255, 0.75) 0%, rgba(250, 248, 243, 0.3) 60%, rgba(235, 230, 220, 0.45) 100%)",
        }}
        aria-hidden="true"
      />

      {/* ── 6. Subtle Edge Drafting Border Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none border-[12px] md:border-[18px] border-black/[0.015] dark:border-white/[0.015]"
        aria-hidden="true"
      />
    </div>
  );
}
