"use client";

import React, { useSyncExternalStore } from "react";
import { GradientWave } from "@/components/ui/gradient-wave";
import { useTheme } from "./ThemeProvider";

const emptySubscribe = () => () => {};

export function FluidBackground() {
  const { theme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  // Light Mode: Vibrant WebGL Gradient Wave with sky blue & white silk
  // Dark Mode: Deep Cosmic Obsidian & Indigo/Cyan Wave
  const waveColors = isDark
    ? ["#09090b", "#1e1b4b", "#0284c7", "#09090b", "#3730a3", "#09090b"]
    : ["#38bdf8", "#ffffff", "#38bdf8", "#ffffff", "#38bdf8", "#ffffff"];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── WebGL 3D Gradient Wave Texture ── */}
      <GradientWave
        key={isDark ? "dark-wave" : "light-wave"}
        colors={waveColors}
        isPlaying={true}
        className="w-full h-full opacity-100"
        shadowPower={isDark ? 5 : 7}
        darkenTop={false}
        noiseSpeed={0.000015}
        noiseFrequency={[0.0001, 0.0008]}
        deform={{
          incline: 0.5,
          noiseAmp: 260,
          noiseFlow: 5,
          noiseSpeed: 10,
        }}
      />

      {/* Tactile Fine Paper Grid Overlay */}
      <div
        className="absolute inset-0 opacity-25 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px), linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px, 28px 28px",
        }}
      />
    </div>
  );
}
