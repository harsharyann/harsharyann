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
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#faf8f3] dark:bg-[#0e0f14]"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#faf8f3] dark:bg-[#0e0f14] transition-colors duration-500"
      style={{ contain: "strict" }}
      aria-hidden="true"
    >
      {/* ── 1. Minor Graph Paper Grid (24px x 24px Fine Pencil / Blueprint Lines) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(to right, rgba(255, 255, 255, 0.038) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.038) 1px, transparent 1px)"
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
            ? "linear-gradient(to right, rgba(99, 102, 241, 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.09) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(24, 24, 27, 0.085) 1px, transparent 1px), linear-gradient(to bottom, rgba(24, 24, 27, 0.085) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      {/* ── 3. Subtle Notebook Margin Guide (Left architectural registration line) ── */}
      <div
        className="hidden md:block absolute top-0 bottom-0 left-[72px] lg:left-[96px] w-[1px] pointer-events-none transition-colors duration-500"
        style={{
          backgroundColor: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.18)",
        }}
        aria-hidden="true"
      />

      {/* ── 4. Micro Paper Fiber / Grain Texture (Crisp, zero-filter, GPU composite) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 0)",
          backgroundSize: "16px 16px",
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
