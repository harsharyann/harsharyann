"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * FluidBackground — A high-performance 3D fluid-like texture background.
 *
 * Features:
 * - Dynamic 3D surface height-field with real-time normal calculation & Phong specular lighting
 * - Dual chromatic palettes (Pearlescent Prism in Light Mode, Obsidian Mercury Nebula in Dark Mode)
 * - Interactive pointer & touch ripples propagating in 3D perspective
 * - Micro-tactile caustic grain & architectural depth lines
 * - Automatically pauses when tab is hidden to preserve battery
 */
export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const themeRef = useRef<string>(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let simWidth = 0;
    let simHeight = 0;

    // Pointer ripple state
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      speed: 0,
      isDown: false,
    };

    // Interactive wave ripples
    type Ripple = { x: number; y: number; radius: number; maxRadius: number; strength: number; age: number };
    const ripples: Ripple[] = [];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const prevX = pointer.targetX;
      const prevY = pointer.targetY;
      pointer.targetX = clientX - rect.left;
      pointer.targetY = clientY - rect.top;

      const dist = Math.hypot(pointer.targetX - prevX, pointer.targetY - prevY);
      pointer.speed = dist;

      if (dist > 18 && ripples.length < 14) {
        ripples.push({
          x: pointer.targetX,
          y: pointer.targetY,
          radius: 8,
          maxRadius: Math.min(180, 50 + dist * 3.5),
          strength: Math.min(1.2, 0.4 + dist * 0.02),
          age: 0,
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Clamped scale factor for ultra-smooth 60fps 3D fluid calculation
      const scale = width < 768 ? 0.35 : 0.45;
      simWidth = Math.max(80, Math.floor(width * scale));
      simHeight = Math.max(60, Math.floor(height * scale));

      canvas.width = simWidth;
      canvas.height = simHeight;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Main 3D Fluid Rendering Loop
    let time = 0;
    let imgData: ImageData | null = null;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += 0.016;

      // Smooth pointer lerp
      pointer.x += (pointer.targetX - pointer.x) * 0.15;
      pointer.y += (pointer.targetY - pointer.y) * 0.15;

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 2.8;
        rip.age += 0.025;
        if (rip.radius > rip.maxRadius || rip.age > 1) {
          ripples.splice(i, 1);
        }
      }

      if (!imgData || imgData.width !== simWidth || imgData.height !== simHeight) {
        imgData = ctx.createImageData(simWidth, simHeight);
      }

      const data = imgData.data;
      const isDark = themeRef.current === "dark";

      const scaleX = width / simWidth;
      const scaleY = height / simHeight;
      const pSimX = pointer.x / scaleX;
      const pSimY = pointer.y / scaleY;

      // 3D Directional Light Vector (Normalized)
      const lx = Math.cos(time * 0.4) * 0.6;
      const ly = Math.sin(time * 0.35) * 0.5 - 0.4;
      const lz = 0.75;
      const lLen = Math.hypot(lx, ly, lz) || 1;
      const nlx = lx / lLen;
      const nly = ly / lLen;
      const nlz = lz / lLen;

      // Compute Height Field & 3D Lighting Per Pixel
      for (let y = 0; y < simHeight; y++) {
        const nyCoord = y / simHeight;
        const wy = y * 0.045;

        for (let x = 0; x < simWidth; x++) {
          const nxCoord = x / simWidth;
          const wx = x * 0.045;

          // Multi-harmonic 3D wave interference
          const wave1 = Math.sin(wx * 0.8 + time * 0.9 + Math.cos(wy * 0.7 - time * 0.6));
          const wave2 = Math.cos(wy * 0.9 - time * 0.75 + Math.sin(wx * 0.6 + time * 0.5));
          const wave3 = Math.sin((wx + wy) * 0.55 + time * 1.1) * 0.5;

          // Pointer fluid swell
          const pdx = x - pSimX;
          const pdy = y - pSimY;
          const pDist = Math.hypot(pdx, pdy);
          let pSwell = 0;
          if (pDist < 45) {
            pSwell = Math.cos((pDist / 45) * Math.PI * 0.5) * 1.2;
          }

          // Ripples influence
          let ripSwell = 0;
          for (let r = 0; r < ripples.length; r++) {
            const rp = ripples[r];
            const rx = rp.x / scaleX;
            const ry = rp.y / scaleY;
            const rDist = Math.hypot(x - rx, y - ry);
            const deltaR = Math.abs(rDist - rp.radius / scaleX);
            if (deltaR < 12) {
              const falloff = 1 - rp.age;
              ripSwell += Math.cos((deltaR / 12) * Math.PI) * rp.strength * falloff * 0.8;
            }
          }

          // Combined Height Value
          const h = (wave1 + wave2 + wave3) * 0.5 + pSwell + ripSwell;

          // Surface Normal approximation
          // df/dx and df/dy
          const dhdx = Math.cos(wx * 0.8 + time * 0.9) * 0.8 + Math.cos((wx + wy) * 0.55 + time * 1.1) * 0.28;
          const dhdy = -Math.sin(wy * 0.9 - time * 0.75) * 0.9 + Math.cos((wx + wy) * 0.55 + time * 1.1) * 0.28;

          // Normal vector
          const normX = -dhdx * 0.55;
          const normY = -dhdy * 0.55;
          const normZ = 1.0;
          const normLen = Math.hypot(normX, normY, normZ) || 1;
          const nx = normX / normLen;
          const ny = normY / normLen;
          const nz = normZ / normLen;

          // Diffuse Dot product
          const diff = Math.max(0, nx * nlx + ny * nly + nz * nlz);

          // Specular highlight (Half-angle vector)
          const hx = nlx;
          const hy = nly;
          const hz = nlz + 1.0;
          const hLen = Math.hypot(hx, hy, hz) || 1;
          const ndoth = Math.max(0, nx * (hx / hLen) + ny * (hy / hLen) + nz * (hz / hLen));
          const spec = Math.pow(ndoth, 20);

          const idx = (y * simWidth + x) * 4;

          if (isDark) {
            // ── Dark Mode: Cosmic Obsidian & Liquid Nebula ──
            // Deep base: #09090b with electric violet, indigo & cyan ribbons
            const tMorph = (h + 1.5) * 0.35;
            const r = Math.floor(10 + diff * 18 + spec * 160 + Math.sin(tMorph * 3.1) * 35);
            const g = Math.floor(12 + diff * 28 + spec * 210 + Math.cos(tMorph * 2.4) * 45);
            const b = Math.floor(22 + diff * 65 + spec * 255 + Math.sin(tMorph * 4.2 + 1) * 75);
            const a = Math.floor(140 + diff * 45 + spec * 80);

            data[idx] = Math.min(255, Math.max(0, r));
            data[idx + 1] = Math.min(255, Math.max(0, g));
            data[idx + 2] = Math.min(255, Math.max(0, b));
            data[idx + 3] = Math.min(240, Math.max(70, a));
          } else {
            // ── Light Mode: Pearlescent Liquid Silk & Prismatic Fluid ──
            // Creamy crystalline base with warm amber, soft rose, and fresh emerald refraction
            const tMorph = (h + 1.5) * 0.38;
            const prismR = Math.sin(tMorph * 3.2 + nxCoord * 2) * 40 + 215;
            const prismG = Math.sin(tMorph * 2.8 + nyCoord * 2 + 1.5) * 35 + 210;
            const prismB = Math.cos(tMorph * 3.5 + 2.8) * 45 + 225;

            const r = Math.floor(prismR + spec * 65 - diff * 15);
            const g = Math.floor(prismG + spec * 65 - diff * 12);
            const b = Math.floor(prismB + spec * 65 - diff * 10);
            const a = Math.floor(120 + diff * 35 + spec * 90);

            data[idx] = Math.min(255, Math.max(0, r));
            data[idx + 1] = Math.min(255, Math.max(0, g));
            data[idx + 2] = Math.min(255, Math.max(0, b));
            data[idx + 3] = Math.min(210, Math.max(60, a));
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic 3D Fluid Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{
          filter: "blur(24px)",
          transform: "scale(1.08)",
        }}
      />

      {/* Tactile Liquid Caustics & Fine Paper Grid Texture */}
      <div
        className="absolute inset-0 opacity-45 mix-blend-overlay dark:opacity-35 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px), linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px, 24px 24px, 24px 24px",
        }}
      />

      {/* Subtle Depth Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-30 dark:opacity-50 pointer-events-none" />
    </div>
  );
}
