"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Settings,
  MapPin,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { PortfolioSettings } from "@/data/portfolioSettings";
import { portfolioData } from "@/data/portfolioData";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { ThemeToggle } from "./ThemeToggle";

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
  ambientGlow: "rgba(229, 192, 123, 0.32)",
  ambientGlowSubtle: "rgba(229, 192, 123, 0.14)",
  borderGlow: "rgba(229, 192, 123, 0.40)",
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

      // Filter out pure black, pure white, and low-contrast grays
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

    // Boost luminance for text/border highlights
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

    const primaryAccent = `rgb(${bestR}, ${bestG}, ${bestB})`;
    const lightAccent = `rgb(${textR}, ${textG}, ${textB})`;
    const ambientGlow = `rgba(${bestR}, ${bestG}, ${bestB}, 0.32)`;
    const ambientGlowSubtle = `rgba(${bestR}, ${bestG}, ${bestB}, 0.14)`;
    const borderGlow = `rgba(${textR}, ${textG}, ${textB}, 0.40)`;

    return {
      primaryAccent,
      lightAccent,
      ambientGlow,
      ambientGlowSubtle,
      borderGlow,
    };
  } catch {
    return defaultPalette;
  }
}

export function PhotoAwareCover({ settings }: PhotoAwareCoverProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const coverContainerRef = useRef<HTMLDivElement>(null);

  // Default to portrait aspect ratio (prevents layout shift on initial mount)
  const [metrics, setMetrics] = useState<ImageMetrics>({
    width: 768,
    height: 1024,
    aspectRatio: 0.75,
    orientation: "portrait",
  });
  const [palette, setPalette] = useState<ExtractedPalette>(defaultPalette);
  const [isLoaded, setIsLoaded] = useState(false);
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Prefetch /about so transition is instantaneous and pre-warmed
  useEffect(() => {
    setIsNavigating(false);
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

    // Smooth 700ms editorial transition into the dedicated About page
    setTimeout(() => {
      router.push("/about");
    }, 700);
  }, [isNavigating, router]);

  // Natural scroll detection: scrolling down opens the dedicated About page
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (e.deltaY > 25 && !isNavigating) {
        handleOpenAbout();
      }
    },
    [handleOpenAbout, isNavigating]
  );

  // Mobile swipe-up detection: swiping up opens the dedicated About page
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

  // Subtle 2D magnetic levitation interaction (ZERO 3D, buttery smooth)
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

  // Automatically detect actual aspect ratio and orientation of loaded photo
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      let orientation: "portrait" | "landscape" | "square" = "portrait";

      if (ratio > 1.15) {
        orientation = "landscape";
      } else if (ratio < 0.88) {
        orientation = "portrait";
      } else {
        orientation = "square";
      }

      setMetrics({
        width: naturalWidth,
        height: naturalHeight,
        aspectRatio: ratio,
        orientation,
      });

      // Extract photo palette and adapt ambient aura
      const extracted = extractPaletteFromImage(img);
      setPalette(extracted);
      setIsLoaded(true);
    }
  };

  // Re-detect if coverImage prop changes dynamically from admin console
  useEffect(() => {
    if (typeof window !== "undefined") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = settings.coverImage;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let orientation: "portrait" | "landscape" | "square" = "portrait";
        if (ratio > 1.15) orientation = "landscape";
        else if (ratio < 0.88) orientation = "portrait";
        else orientation = "square";

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
    }
  }, [settings.coverImage]);

  const isPortrait = metrics.orientation === "portrait";

  // Reusable Sleek Dynamic Island Capsule Dock Component
  const renderCapsuleDock = () => (
    <div className="backdrop-blur-2xl bg-white/[0.05] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.2)] rounded-full px-4 sm:px-6 py-2 flex items-center gap-3 sm:gap-4 transition-all duration-300 hover:border-white/30 hover:shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
      {/* Social Icons (Email, GitHub, LinkedIn) */}
      <div className="flex items-center gap-1 sm:gap-1.5 text-stone-400">
        <a
          href={portfolioData.socialLinks.email}
          title="Email Harsh Aryan"
          className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="Email"
        >
          <Mail className="w-4 h-4" />
        </a>

        <a
          href={portfolioData.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub Profile"
          className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="GitHub"
        >
          <GithubIcon className="w-4 h-4" />
        </a>

        <a
          href={portfolioData.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn Profile"
          className="p-1.5 text-stone-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          aria-label="LinkedIn"
        >
          <LinkedinIcon className="w-4 h-4" />
        </a>
      </div>

      <span className="w-px h-4 bg-white/20" />

      {/* Hero OPEN Button with Accent Shimmer */}
      <button
        onClick={handleOpenAbout}
        style={{
          borderColor: palette.borderGlow,
        }}
        className="group inline-flex items-center gap-2 px-5 sm:px-6 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border text-[#f5f3ef] font-mono text-xs uppercase tracking-[0.22em] font-bold transition-all duration-300 cursor-pointer shadow-md active:scale-95"
      >
        <span>{isNavigating ? "OPENING..." : "OPEN"}</span>
        <span
          style={{ color: palette.lightAccent }}
          className="group-hover:translate-x-1 transition-transform duration-300"
        >
          &rarr;
        </span>
      </button>

      <span className="w-px h-4 bg-white/20" />

      {/* Theme Switcher & Admin Cog */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <Link
          href="/admin"
          title="Admin Control Panel"
          className="p-1.5 text-stone-400 hover:text-[#e5c07b] hover:bg-white/10 rounded-full transition-colors"
          aria-label="Admin Panel"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-screen flex flex-col justify-between items-center py-6 sm:py-8 px-4 sm:px-8 bg-[#060709] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans select-none overflow-hidden transition-all duration-700 ease-out ${
        isNavigating
          ? "opacity-0 -translate-y-6 scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* 1. Subtle Analog Film Grain Texture (Adds editorial print tactility) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Dynamic Glassmorphic Ambient Mesh (Adapts automatically to photo colors) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 46%, ${palette.ambientGlow} 0%, ${palette.ambientGlowSubtle} 32%, rgba(6, 7, 9, 0.94) 70%, #060709 100%)`,
        }}
      />

      {/* 3. Dual-Orb Breathing Ambient Aurora (Soft glowing atmosphere) */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 opacity-65 z-0"
        style={{
          background: `radial-gradient(ellipse at center, ${palette.ambientGlow} 0%, transparent 72%)`,
        }}
      />

      {/* 4. HOLLOW WATERMARK: HARSH ARYAN (Gigantic luxury stroked backdrop) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 transition-transform duration-500 ease-out flex items-center justify-center opacity-25 sm:opacity-35"
        style={{
          transform: `translate(calc(-50% + ${magnetic.x * 0.4}px), calc(-50% + ${magnetic.y * 0.4}px))`,
        }}
      >
        <span
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] xl:text-[13rem] font-editorial font-black uppercase tracking-[0.22em] whitespace-nowrap leading-none"
          style={{
            WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.16)",
            color: "transparent",
            textShadow: `0 0 40px ${palette.ambientGlowSubtle}`,
          }}
        >
          {settings.name}
        </span>
      </div>

      {/* 5. Minimal Top Status Bar (NO issue no. 01, NO folio) */}
      <div className="relative z-10 w-full max-w-7xl flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 pt-1">
        <span className="text-stone-400 font-semibold">{settings.name}</span>
        <span className="text-stone-500 text-[10px]">
          [{metrics.orientation.toUpperCase()}]
        </span>
      </div>

      {/* 6. MAIN ADAPTIVE HERO STAGE (100% PHOTO-AWARE & ORIENTATION RESPONSIVE) */}
      <div className="relative z-10 my-auto w-full max-w-7xl flex items-center justify-center py-4">
        {isPortrait ? (
          /* =========================================================================
             CASE A: PORTRAIT ORIENTATION (EDITORIAL SPREAD: LEFT COVER + RIGHT SPREAD)
             ========================================================================= */
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            {/* LEFT COLUMN: Physical Magazine / Book Cover (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                ref={coverContainerRef}
                onClick={handleOpenAbout}
                style={{
                  transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                  boxShadow: `0 35px 85px rgba(0,0,0,0.9), 0 0 50px ${palette.ambientGlowSubtle}, inset 0 1px 1px rgba(255,255,255,0.25), 3px 0 0 #1c1d24, 4px 0 0 #0f1014, 6px 1px 0 #282a33, 7px 1px 0 #121317, 9px 2px 0 #20222a, 10px 2px 0 #090a0d`,
                }}
                className="relative w-full max-w-[290px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[400px] aspect-[1/1.42] max-h-[66vh] sm:max-h-[70vh] bg-[#0b0c10]/80 backdrop-blur-xl border border-white/20 rounded-[2px] overflow-hidden cursor-pointer group transition-all duration-500 ease-out"
              >
                {/* Specular Glass Sheen Across Top Edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

                {/* Glossy Spotlight Light Reflection */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/12 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Photograph */}
                <img
                  ref={imgRef}
                  src={settings.coverImage}
                  alt={settings.name}
                  onLoad={handleImageLoad}
                  style={{
                    objectFit: settings.coverImageFit,
                    objectPosition:
                      settings.coverImagePosition === "top"
                        ? "center top"
                        : settings.coverImagePosition === "bottom"
                        ? "center bottom"
                        : "center center",
                  }}
                  className={`w-full h-full filter contrast-[1.03] saturate-[1.06] brightness-[0.99] transition-all duration-500 group-hover:scale-[1.015] ${
                    isLoaded ? "opacity-100" : "opacity-95"
                  }`}
                />

                {/* Magazine Spine Fold (Left Edge) */}
                <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-[2px] w-[1px] bg-white/25 pointer-events-none z-10" />

                {/* Right Edge Inner Shadow (Gives realistic layered depth) */}
                <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* RIGHT COLUMN: Minimalist Apple Style Typography & Integrated Dock (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              {/* Monogram / Top Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono uppercase tracking-[0.25em] text-[#e5c07b]">
                <Sparkles className="w-3 h-3" />
                <span>EDITORIAL IDENTITY</span>
              </div>

              {/* Big Headline Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.14em] leading-[0.94] drop-shadow-lg">
                {settings.name}
              </h1>

              {/* Current Role (Controlled via Admin) */}
              {settings.showRole !== false && (
                <p className="text-base sm:text-xl font-sans text-stone-300 font-light tracking-wide">
                  {settings.role || settings.subrole}
                </p>
              )}

              {/* Thin Hairline Divider */}
              <div className="w-20 h-[1.5px] bg-[#e5c07b]/40 mx-auto lg:mx-0" />

              {/* Minimalist Statement (Controlled via Admin) */}
              {settings.showStatement !== false && (
                <blockquote className="text-base sm:text-lg md:text-xl font-editorial italic text-stone-200/90 leading-relaxed">
                  &ldquo;{settings.statement}&rdquo;
                </blockquote>
              )}

              {/* Location & Where/What Info Cards (Controlled via Admin) */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 pt-1">
                {/* Current Location */}
                {settings.showLocation !== false && (
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1.5 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>{settings.location || "Chennai, India"}</span>
                  </div>
                )}

                {/* Where I'm Doing & What Status */}
                {settings.showWhereAndWhat !== false && (
                  <div className="flex items-start gap-2.5 text-xs font-mono text-stone-300/90 bg-white/[0.04] border border-white/10 rounded-xl p-3 max-w-md text-left shadow-sm">
                    <GraduationCap className="w-4 h-4 text-[#e5c07b] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {settings.whereAndWhat ||
                        "1st Year B.Tech CSE (AI & Data Science) · Building foundations in Code, Math & Models"}
                    </span>
                  </div>
                )}
              </div>

              {/* Integrated Capsule Dock in Portrait Right Column */}
              <div className="pt-3 flex justify-center lg:justify-start">
                {renderCapsuleDock()}
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             CASE B: LANDSCAPE / SQUARE (CINEMATIC FULLSCREEN STAGE + ADAPTIVE INFO)
             ========================================================================= */
          <div className="w-full flex flex-col items-center justify-center space-y-6">
            {/* Fullscreen Widescreen Cinema Container */}
            <div
              ref={coverContainerRef}
              onClick={handleOpenAbout}
              style={{
                transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                boxShadow: `0 35px 95px rgba(0,0,0,0.92), 0 0 60px ${palette.ambientGlowSubtle}, inset 0 1px 1px rgba(255,255,255,0.25), 3px 1px 0 #1c1d24, 5px 2px 0 #0f1014, 7px 3px 0 #282a33, 8px 3px 0 #0a0b0d`,
              }}
              className={`relative z-10 w-full ${
                metrics.orientation === "landscape"
                  ? "max-w-[94vw] md:max-w-[90vw] lg:max-w-[1360px] aspect-[16/9.5] sm:aspect-[16/9] md:aspect-[16/8.6] max-h-[64vh] sm:max-h-[68vh]"
                  : "max-w-[360px] sm:max-w-[440px] md:max-w-[480px] aspect-square max-h-[62vh]"
              } bg-[#0b0c10]/80 backdrop-blur-xl border border-white/20 rounded-[2px] overflow-hidden cursor-pointer group transition-all duration-500 ease-out`}
            >
              {/* Specular Glass Sheen Across Top Edge */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

              {/* Glossy Spotlight Light Reflection */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/12 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Fullscreen Landscape Photograph */}
              <img
                ref={imgRef}
                src={settings.coverImage}
                alt={settings.name}
                onLoad={handleImageLoad}
                style={{
                  objectFit: settings.coverImageFit,
                  objectPosition:
                    settings.coverImagePosition === "top"
                      ? "center top"
                      : settings.coverImagePosition === "bottom"
                      ? "center bottom"
                      : "center center",
                }}
                className={`w-full h-full filter contrast-[1.03] saturate-[1.06] brightness-[0.99] transition-all duration-500 group-hover:scale-[1.012] ${
                  isLoaded ? "opacity-100" : "opacity-95"
                }`}
              />

              {/* Book Spine (Left Edge) */}
              <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 bottom-0 left-[2px] w-[1px] bg-white/25 pointer-events-none z-10" />

              {/* Right Edge Depth */}
              <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
            </div>

            {/* Adaptive Landscape Identity Strip (Name, Role, Location, Where & What) */}
            <div className="w-full max-w-5xl flex flex-col items-center gap-3 px-4 text-center">
              {/* Name & Role Row */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-editorial font-black uppercase text-white tracking-[0.16em]">
                  {settings.name}
                </h2>
                {settings.showRole !== false && (
                  <>
                    <span className="text-stone-600 hidden sm:inline">&bull;</span>
                    <span className="text-xs sm:text-sm font-sans text-stone-300 font-light">
                      {settings.role || settings.subrole}
                    </span>
                  </>
                )}
              </div>

              {/* Location & Status Badges Row */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {settings.showLocation !== false && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-stone-300 bg-white/[0.04] border border-white/10 rounded-full px-3.5 py-1">
                    <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>{settings.location || "Chennai, India"}</span>
                  </div>
                )}

                {settings.showWhereAndWhat !== false && (
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-300 bg-white/[0.04] border border-white/10 rounded-full px-4 py-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span className="text-[11px]">
                      {settings.whereAndWhat ||
                        "1st Year B.Tech CSE (AI & Data Science)"}
                    </span>
                  </div>
                )}
              </div>

              {/* Statement Quote (if enabled) */}
              {settings.showStatement !== false && (
                <p className="text-xs sm:text-sm font-editorial italic text-stone-300/80 max-w-xl mx-auto">
                  &ldquo;{settings.statement}&rdquo;
                </p>
              )}

              {/* Integrated Capsule Dock in Landscape Mode */}
              <div className="pt-1">
                {renderCapsuleDock()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. Subtle Scroll Explore Hint (Always present at bottom) */}
      <footer className="relative z-20 pb-2 pt-1 text-center">
        <div
          onClick={handleOpenAbout}
          className="text-[10px] font-mono tracking-[0.25em] text-stone-500 hover:text-stone-300 uppercase cursor-pointer transition-colors flex items-center justify-center gap-1.5"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="animate-bounce">&darr;</span>
        </div>
      </footer>
    </div>
  );
}
