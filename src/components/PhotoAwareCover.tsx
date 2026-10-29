"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Sliders,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { PortfolioSettings } from "@/data/portfolioSettings";
import { portfolioData } from "@/data/portfolioData";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";

interface PhotoAwareCoverProps {
  settings: PortfolioSettings;
}

interface ImageMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape" | "square";
}

interface ExtractedPalette {
  primaryAccent: string;
  lightAccent: string;
  ambientGlow: string;
  ambientGlowSubtle: string;
  borderGlow: string;
}

const defaultPalette: ExtractedPalette = {
  primaryAccent: "rgb(229, 192, 123)",
  lightAccent: "rgb(248, 226, 182)",
  ambientGlow: "rgba(229, 192, 123, 0.35)",
  ambientGlowSubtle: "rgba(229, 192, 123, 0.15)",
  borderGlow: "rgba(229, 192, 123, 0.45)",
};

/**
 * Intelligent client-side color extraction:
 * Reads photo pixel data via an offscreen canvas to dynamically detect
 * dominant vibrant tones, harmonizing ambient glass aura & accent highlights.
 */
function extractPaletteFromImage(img: HTMLImageElement): ExtractedPalette {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return defaultPalette;

    const size = 48;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size).data;
    let maxSat = -1;
    let bestR = 229,
      bestG = 192,
      bestB = 123;

    for (let i = 0; i < imgData.length; i += 16) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;
      const lightness = (max + min) / 2;

      if (lightness > 25 && lightness < 235 && delta > 20) {
        const sat = delta / (1 - Math.abs(2 * (lightness / 255) - 1));
        if (sat > maxSat) {
          maxSat = sat;
          bestR = r;
          bestG = g;
          bestB = b;
        }
      }
    }

    const lum = bestR * 0.299 + bestG * 0.587 + bestB * 0.114;
    let textR = bestR,
      textG = bestG,
      textB = bestB;
    if (lum < 165) {
      const boost = 195 / Math.max(lum, 35);
      textR = Math.min(255, Math.round(bestR * boost));
      textG = Math.min(255, Math.round(bestG * boost));
      textB = Math.min(255, Math.round(bestB * boost));
    }

    return {
      primaryAccent: `rgb(${bestR}, ${bestG}, ${bestB})`,
      lightAccent: `rgb(${textR}, ${textG}, ${textB})`,
      ambientGlow: `rgba(${bestR}, ${bestG}, ${bestB}, 0.38)`,
      ambientGlowSubtle: `rgba(${bestR}, ${bestG}, ${bestB}, 0.16)`,
      borderGlow: `rgba(${textR}, ${textG}, ${textB}, 0.45)`,
    };
  } catch {
    return defaultPalette;
  }
}

/**
 * Editorial Barcode Component (Authentic Magazine Publishing Folio)
 */
function MagazineBarcode() {
  return (
    <div className="flex flex-col items-start gap-1 font-mono text-[9px] text-stone-400 select-none">
      <div className="flex items-end gap-[2px] h-8 px-2 py-1 bg-white/[0.03] rounded border border-white/10 shadow-sm">
        {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4, 1, 3, 2].map(
          (h, i) => (
            <span
              key={i}
              className={`w-[2px] bg-stone-300/85 ${
                h === 4 ? "h-6" : h === 3 ? "h-5" : h === 2 ? "h-4" : "h-3"
              }`}
            />
          )
        )}
      </div>
      <div className="flex items-center justify-between w-full text-[8px] tracking-[0.22em] text-stone-500 uppercase">
        <span>ISSN 2026-AI</span>
        <span>ED. 01</span>
      </div>
    </div>
  );
}

export function PhotoAwareCover({ settings }: PhotoAwareCoverProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const coverContainerRef = useRef<HTMLDivElement>(null);

  // Active media URL (photo or video)
  const mediaUrl =
    settings.coverMediaUrl || settings.coverImage || "/custom-cover.jpg";
  const isVideo =
    settings.coverMediaType === "video" ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(mediaUrl);

  const [metrics, setMetrics] = useState<ImageMetrics>({
    width: 1920,
    height: 1080,
    aspectRatio: 1.77,
    orientation: "landscape",
  });
  const [palette, setPalette] = useState<ExtractedPalette>(defaultPalette);
  const [isLoaded, setIsLoaded] = useState(false);
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Prefetch /about so transition is instantaneous
  useEffect(() => {
    router.prefetch("/about");

    const resetState = () => {
      setIsNavigating(false);
    };

    window.addEventListener("popstate", resetState);
    window.addEventListener("pageshow", resetState);

    return () => {
      window.removeEventListener("popstate", resetState);
      window.removeEventListener("pageshow", resetState);
    };
  }, [router]);

  // Seamless navigation handler to dedicated /about page
  const handleOpenAbout = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);

    setTimeout(() => {
      router.push("/about");
    }, 700);
  }, [isNavigating, router]);

  // Natural scroll detection
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.deltaY > 25 && !isNavigating) {
        handleOpenAbout();
      }
    },
    [handleOpenAbout, isNavigating]
  );

  // Mobile swipe-up detection
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || isNavigating) return;
    const diff = touchStartY.current - e.touches[0].clientY;
    if (diff > 45) {
      handleOpenAbout();
    }
  };

  // Subtle 2D magnetic levitation interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!coverContainerRef.current) return;
    const rect = coverContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) / 45;
    const dy = (e.clientY - centerY) / 45;

    setMagnetic({
      x: Math.max(-8, Math.min(8, dx)),
      y: Math.max(-8, Math.min(8, dy)),
    });
  };

  const handleMouseLeave = () => {
    setMagnetic({ x: 0, y: 0 });
  };

  // Detect image aspect ratio when photo loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      const orientation = ratio > 1.05 ? "landscape" : "portrait";

      setMetrics({
        width: naturalWidth,
        height: naturalHeight,
        aspectRatio: ratio,
        orientation,
      });

      const extracted = extractPaletteFromImage(img);
      setPalette(extracted);
      setIsLoaded(true);
    }
  };

  // Re-detect if media changes dynamically (for images)
  useEffect(() => {
    if (typeof window === "undefined" || isVideo) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = mediaUrl;
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const orientation: "portrait" | "landscape" | "square" =
        ratio > 1.05 ? "landscape" : "portrait";

      setMetrics({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: ratio,
        orientation,
      });

      const extracted = extractPaletteFromImage(img);
      setPalette(extracted);
      setIsLoaded(true);
    };
  }, [mediaUrl, isVideo]);

  // Reusable Sleek Social Links
  const renderSocialLinks = () => (
    <div className="flex items-center gap-2.5 text-stone-400">
      <a
        href={portfolioData.socialLinks.email}
        title="Email Harsh Aryan"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="Email"
      >
        <Mail className="w-3.5 h-3.5" />
      </a>

      <a
        href={portfolioData.socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub Profile"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="GitHub"
      >
        <GithubIcon className="w-3.5 h-3.5" />
      </a>

      <a
        href={portfolioData.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn Profile"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="LinkedIn"
      >
        <LinkedinIcon className="w-3.5 h-3.5" />
      </a>
    </div>
  );

  return (
    <div
      suppressHydrationWarning
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-[100dvh] flex flex-col justify-between items-center bg-[#07080b] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans select-none overflow-x-hidden transition-all duration-700 ease-out px-4 sm:px-8 md:px-12 py-3 sm:py-5 ${
        isNavigating
          ? "opacity-0 -translate-y-4 scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* 1. Master Background Atmosphere (Adaptive Ambient Glow from Photo) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${palette.ambientGlow} 0%, ${palette.ambientGlowSubtle} 40%, transparent 75%), radial-gradient(circle at 85% 15%, rgba(229, 192, 123, 0.08) 0%, transparent 50%)`,
        }}
      />

      {/* 2. Tactile Magazine Paper Fiber & Micro-Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Print Registration Crosshairs on Four Corners */}
      <span className="absolute top-3 left-4 text-stone-600 font-mono text-[9px] pointer-events-none z-10 hidden sm:block">
        +
      </span>
      <span className="absolute top-3 right-4 text-stone-600 font-mono text-[9px] pointer-events-none z-10 hidden sm:block">
        +
      </span>
      <span className="absolute bottom-3 left-4 text-stone-600 font-mono text-[9px] pointer-events-none z-10 hidden sm:block">
        +
      </span>
      <span className="absolute bottom-3 right-4 text-stone-600 font-mono text-[9px] pointer-events-none z-10 hidden sm:block">
        +
      </span>

      {/* =========================================================================
          TOP FOLIO / EDITORIAL ISSUE BAR
          ========================================================================= */}
      <header className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-stone-400 border-b border-white/10 pb-3 pt-1">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <span className="font-bold text-[#e5c07b]">VOL. 2026</span>
          <span className="text-white/20">/</span>
          <span>ISSUE NO. 01</span>
          <span className="hidden md:inline text-white/20">/</span>
          <span className="hidden md:inline text-stone-400">CHENNAI EDITION</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-stone-500 tracking-[0.28em] text-[10px]">
          <span>✦</span>
          <span>THE EDITORIAL MONOGRAPH</span>
          <span>✦</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden sm:inline text-stone-500 text-[10px]">
            PRICE: TIME & ATTENTION
          </span>
          <Link
            href="/admin"
            title="Open Admin Studio"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e5c07b]/35 bg-[#e5c07b]/10 hover:bg-[#e5c07b]/20 text-[#e5c07b] text-[9px] font-mono font-bold uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Sliders className="w-3 h-3 text-[#e5c07b]" />
            <span>STUDIO ↗</span>
          </Link>
        </div>
      </header>

      {/* =========================================================================
          GRAND HIGH-FASHION EDITORIAL MASTHEAD
          ========================================================================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto text-center pt-2 sm:pt-4 pb-2">
        {settings.showName !== false && (
          <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.14em] sm:tracking-[0.18em] lg:tracking-[0.22em] leading-[0.88] drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)] select-none">
            {settings.name || "HARSH ARYAN"}
          </h1>
        )}

        <div className="flex items-center justify-center gap-3 sm:gap-6 mt-2 text-[8px] sm:text-[10px] md:text-[11px] font-mono tracking-[0.22em] text-stone-400 uppercase">
          <span className="hidden sm:inline-block w-8 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#e5c07b]/60" />
          <span>COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE · DESIGN</span>
          <span className="hidden sm:inline-block w-8 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#e5c07b]/60" />
        </div>
      </div>

      {/* =========================================================================
          MAGAZINE MAIN COVER SPREAD (DESKTOP 3-ZONE / MOBILE STACKED)
          ========================================================================= */}
      <main className="relative z-20 w-full max-w-7xl mx-auto my-auto py-3 sm:py-4">
        {/* DESKTOP 3-ZONE EDITORIAL SPREAD (lg+) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-10 items-center">
          {/* -------------------------------------------------------------------
              LEFT FLANK: Cover Stories & Dispatches (Cols 1-3)
              ------------------------------------------------------------------- */}
          <div className="col-span-3 space-y-6 text-left">
            {/* Story 01: Academic Role */}
            {settings.showRole !== false && (
              <div className="space-y-1.5 group">
                <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.25em] text-[#e5c07b] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5c07b] shadow-[0_0_8px_#e5c07b] animate-pulse" />
                  <span>01 / APPOINTMENT</span>
                </div>
                <h2 className="text-lg font-editorial font-bold uppercase tracking-wider text-white leading-tight">
                  {settings.role || "Teaching Assistant @ IIT Madras"}
                </h2>
                <p className="text-xs font-sans text-stone-300 font-light leading-relaxed">
                  {settings.whereAndWhat ||
                    "Data Science & Applications. Mentoring algorithmic intuition & computational foundations."}
                </p>
                <div className="w-12 h-[1px] bg-white/15 pt-0.5" />
              </div>
            )}

            {/* Story 02: Technical Discipline */}
            <div className="space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-stone-400 font-bold">
                02 / THE ARCHITECTURE
              </div>
              <h3 className="text-sm font-editorial font-bold uppercase tracking-wider text-stone-200">
                Applied AI &amp; Web Systems
              </h3>
              <p className="text-xs font-sans text-stone-400 font-light leading-relaxed">
                Next.js 16 · PyTorch · Linear Algebra · GPU Accelerated Shaders
              </p>
              <div className="w-12 h-[1px] bg-white/15 pt-0.5" />
            </div>

            {/* Dispatch Location */}
            {settings.showLocation !== false && settings.location && (
              <div className="space-y-1 text-xs font-mono text-stone-400">
                <div className="flex items-center gap-1.5 text-stone-300 uppercase tracking-widest text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                  <span>{settings.location}</span>
                </div>
                <p className="text-[10px] text-emerald-400/90 font-mono tracking-wider">
                  ● ACTIVE FOR COLLABORATION
                </p>
              </div>
            )}
          </div>

          {/* -------------------------------------------------------------------
              CENTER STAGE: The Tactile Magazine Cover Photo (Cols 4-9)
              ------------------------------------------------------------------- */}
          <div className="col-span-6 flex justify-center">
            <div
              ref={coverContainerRef}
              onClick={handleOpenAbout}
              style={{
                transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                boxShadow: `0 35px 100px rgba(0,0,0,0.95), 0 0 80px ${palette.ambientGlow}, inset 0 1px 2px rgba(255,255,255,0.35)`,
                aspectRatio: metrics.aspectRatio || 0.72,
              }}
              className="relative w-full max-w-[360px] xl:max-w-[410px] max-h-[64vh] rounded-2xl bg-[#090a0f] border border-[#e5c07b]/35 ring-1 ring-white/15 overflow-hidden cursor-pointer group transition-all duration-500 ease-out hover:scale-[1.025]"
            >
              {/* Authentic Magazine Spine Crease (Left Edge) */}
              <div className="absolute left-0 inset-y-0 w-4 bg-gradient-to-r from-black/85 via-black/35 to-transparent pointer-events-none z-20" />

              {/* Specular Edge Highlights */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#e5c07b]/60 to-transparent pointer-events-none z-20" />

              {/* Glossy Diagonal Light Sweep Reflection */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/18 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Magazine Corner Issue Stamp */}
              <div className="absolute top-3.5 right-3.5 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#e5c07b]/40 text-[9px] font-mono tracking-widest text-[#e5c07b] uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#e5c07b]" />
                <span>ISSUE 01</span>
              </div>

              {/* Master Media Layer (Photo or Video) */}
              {isVideo ? (
                <video
                  src={mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    objectFit: settings.coverImageFit || "cover",
                    objectPosition:
                      settings.coverImagePosition === "top"
                        ? "center top"
                        : settings.coverImagePosition === "bottom"
                        ? "center bottom"
                        : "center center",
                  }}
                  className="w-full h-full filter contrast-[1.03] saturate-[1.06] brightness-[0.98]"
                />
              ) : (
                <img
                  ref={imgRef}
                  src={mediaUrl}
                  alt={settings.name}
                  suppressHydrationWarning
                  onLoad={handleImageLoad}
                  style={{
                    objectFit: settings.coverImageFit || "cover",
                    objectPosition:
                      settings.coverImagePosition === "top"
                        ? "center top"
                        : settings.coverImagePosition === "bottom"
                        ? "center bottom"
                        : "center center",
                  }}
                  className={`w-full h-full filter contrast-[1.04] saturate-[1.06] brightness-[0.99] transition-all duration-500 group-hover:scale-[1.02] ${
                    isLoaded ? "opacity-100" : "opacity-95"
                  }`}
                />
              )}

              {/* Bottom Frosted Magazine Caption Strip */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex items-center justify-between text-[10px] font-mono text-stone-300">
                <span className="tracking-[0.2em] uppercase font-bold text-white drop-shadow">
                  {settings.name || "HARSH ARYAN"}
                </span>
                <span className="text-[#e5c07b] text-[9px] tracking-widest uppercase">
                  CLICK TO READ ↗
                </span>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------
              RIGHT FLANK: Curator's Note, CTAs & Barcode (Cols 10-12)
              ------------------------------------------------------------------- */}
          <div className="col-span-3 space-y-6 text-left">
            {/* Story 03: Curator Statement Quote */}
            {settings.showStatement !== false && settings.statement && (
              <div className="space-y-1.5">
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#e5c07b] font-bold">
                  03 / CURATOR&apos;S NOTE
                </div>
                <blockquote className="text-xs font-editorial-italic text-stone-200/90 leading-relaxed border-l-2 border-[#e5c07b]/60 pl-3">
                  &ldquo;{settings.statement}&rdquo;
                </blockquote>
                <div className="w-12 h-[1px] bg-white/15 pt-0.5" />
              </div>
            )}

            {/* Main Action CTAs */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleOpenAbout}
                className="group w-full inline-flex items-center justify-between px-5 py-3 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(229,192,123,0.3)] active:scale-95"
              >
                <span>{isNavigating ? "OPENING ISSUE..." : "EXPLORE ISSUE 01"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Direct Chapter Links */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono uppercase tracking-wider text-center">
                <Link
                  href="/projects"
                  className="py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all"
                >
                  PROJECTS
                </Link>
                <Link
                  href="/certificates"
                  className="py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all"
                >
                  CREDS
                </Link>
                <Link
                  href="/contact"
                  className="py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all"
                >
                  CONTACT
                </Link>
              </div>
            </div>

            {/* Authentic Magazine Barcode */}
            <div className="pt-2">
              <MagazineBarcode />
            </div>
          </div>
        </div>

        {/* =====================================================================
            MOBILE / TABLET EDITORIAL COVER (< lg)
            Zero clipping, flawless magazine aesthetic on iPhone, iPad, Android
            ===================================================================== */}
        <div className="flex lg:hidden flex-col items-center text-center space-y-4">
          {/* Eyebrow Role Pill */}
          {settings.showRole !== false && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-[#e5c07b]/35 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-[#e5c07b] shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5c07b] shadow-[0_0_8px_#e5c07b] animate-pulse shrink-0" />
              <span>{(settings.role || "Teaching Assistant @ IIT Madras").toUpperCase()}</span>
            </div>
          )}

          {/* Centered Magazine Cover Card */}
          <div
            onClick={handleOpenAbout}
            className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl bg-[#090a0f] border border-[#e5c07b]/40 ring-1 ring-white/15 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] cursor-pointer group"
          >
            {/* Spine Crease */}
            <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-r from-black/85 to-transparent z-20 pointer-events-none" />

            {/* Corner Badge */}
            <div className="absolute top-2.5 right-2.5 z-20 px-2 py-0.5 rounded-full bg-black/60 border border-[#e5c07b]/40 text-[8px] font-mono tracking-widest text-[#e5c07b] uppercase">
              ISSUE 01
            </div>

            {isVideo ? (
              <video
                src={mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={settings.name}
                suppressHydrationWarning
                onLoad={handleImageLoad}
                className="w-full h-full object-cover"
              />
            )}

            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent z-20 flex items-center justify-between text-[9px] font-mono text-stone-300">
              <span className="font-bold text-white uppercase">{settings.name}</span>
              <span className="text-[#e5c07b]">TAP TO EXPLORE ↗</span>
            </div>
          </div>

          {/* Statement Quote */}
          {settings.showStatement !== false && settings.statement && (
            <blockquote className="text-xs sm:text-sm font-editorial-italic text-stone-200/90 leading-relaxed max-w-md px-2">
              &ldquo;{settings.statement}&rdquo;
            </blockquote>
          )}

          {/* Action CTA */}
          <div className="w-full max-w-xs space-y-2.5 pt-1">
            <button
              onClick={handleOpenAbout}
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>{isNavigating ? "OPENING..." : "EXPLORE ISSUE 01"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile Barcode */}
            <div className="flex justify-center pt-1">
              <MagazineBarcode />
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================================
          BOTTOM EDITORIAL COLOPHON FOOTER
          ========================================================================= */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-stone-400 border-t border-white/10 pt-3 pb-1">
        <div className="flex items-center gap-3">
          {renderSocialLinks()}
        </div>

        <div
          onClick={handleOpenAbout}
          className="hover:text-white uppercase cursor-pointer transition-colors flex items-center gap-1.5 text-stone-400"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#e5c07b]" />
          <span>SCROLL OR CLICK TO FLIP PAGE</span>
          <span className="animate-bounce">&darr;</span>
        </div>

        <div className="text-[9px] sm:text-[10px] text-stone-500 uppercase tracking-widest hidden sm:block">
          &copy; 2026 HARSH ARYAN ARCHIVE
        </div>
      </footer>
    </div>
  );
}
