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

  // Light Mode Colors: Harmonized with Harsh's sketchbook palette (Warm Amber, Lilac Indigo, Coral & Mint Cream)
  const lightColors = [
    "#fafaf9", // Soft Warm Cream Paper
    "#fbbf24", // Warm Radiant Amber (Brand Gold)
    "#818cf8", // Electric Indigo / Lilac
    "#fda4af", // Soft Coral / Peach
    "#6ee7b7", // Fresh Mint Emerald
    "#fef3c7", // Sunlight Vanilla Cream
  ];

  // Dark Mode Colors: Deep Obsidian with Glowing Amber, Violet & Indigo Nebulas
  const darkColors = [
    "#09090b", // Deep Obsidian Canvas
    "#312e81", // Deep Indigo Aurora
    "#78350f", // Warm Amber Ember (Brand Gold glow)
    "#581c87", // Cosmic Violet Shimmer
    "#0e7490", // Bioluminescent Cyan Accent
    "#09090b", // Deep Midnight
  ];

  const waveColors = isDark ? darkColors : lightColors;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-stone-50 dark:bg-[#09090b] transition-colors duration-500"
      aria-hidden="true"
    >
      {/* ── WebGL Gradient Wave with Dreamy Atmospheric Blur Effects ── */}
      <div
        className={`w-full h-full transition-all duration-700 ease-in-out ${
          isDark
            ? "blur-[54px] sm:blur-[72px] scale-110 opacity-80"
            : "blur-[30px] sm:blur-[42px] scale-105 opacity-85"
        }`}
      >
        <GradientWave
          key={isDark ? "dark-theme-wave" : "light-theme-wave"}
          colors={waveColors}
          isPlaying={true}
          className="w-full h-full"
          shadowPower={isDark ? 4 : 6}
          darkenTop={false}
          noiseSpeed={isDark ? 0.000008 : 0.000012}
          noiseFrequency={[0.0001, 0.0007]}
          deform={{
            incline: isDark ? 0.42 : 0.46,
            noiseAmp: isDark ? 290 : 230,
            noiseFlow: isDark ? 4.2 : 4.8,
            noiseSpeed: isDark ? 8 : 10,
          }}
        />
      </div>

      {/* Tactile Sketchbook Architectural Grid Overlay */}
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
