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
    const ambientGlow = `rgba(${bestR}, ${bestG}, ${bestB}, 0.38)`;
    const ambientGlowSubtle = `rgba(${bestR}, ${bestG}, ${bestB}, 0.16)`;
    const borderGlow = `rgba(${textR}, ${textG}, ${textB}, 0.45)`;

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

  // Prefetch /about so transition is instantaneous and pre-warmed
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

    const dx = (e.clientX - centerX) / 40;
    const dy = (e.clientY - centerY) / 40;

    setMagnetic({
      x: Math.max(-10, Math.min(10, dx)),
      y: Math.max(-10, Math.min(10, dy)),
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

  const isPortrait = metrics.orientation === "portrait" && !isVideo;

  // Reusable Sleek Social Links
  const renderSocialLinks = () => (
    <div className="flex items-center justify-center gap-3 sm:gap-4 text-stone-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
      <a
        href={portfolioData.socialLinks.email}
        title="Email Harsh Aryan"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="Email"
      >
        <Mail className="w-4 h-4" />
      </a>

      <a
        href={portfolioData.socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub Profile"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="GitHub"
      >
        <GithubIcon className="w-4 h-4" />
      </a>

      <a
        href={portfolioData.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn Profile"
        className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-stone-300 hover:text-[#e5c07b] hover:scale-110 transition-all border border-white/5"
        aria-label="LinkedIn"
      >
        <LinkedinIcon className="w-4 h-4" />
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
      className={`relative w-full h-[100dvh] max-h-[100dvh] min-h-[100dvh] flex flex-col justify-between items-center bg-[#07080b] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans select-none overflow-hidden transition-all duration-700 ease-out ${
        isNavigating
          ? "opacity-0 -translate-y-4 scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* 1. Master Background Atmosphere (Adaptive Ambient Glow from Photo) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(ellipse at 35% 45%, ${palette.ambientGlow} 0%, ${palette.ambientGlowSubtle} 40%, transparent 75%), radial-gradient(circle at 75% 75%, rgba(229, 192, 123, 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* 2. Tactile Magazine Paper Fiber & Micro-Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Top Master Header Bar */}
      <header className="relative z-30 w-full px-4 sm:px-8 md:px-12 pt-3.5 sm:pt-6 flex items-center justify-end shrink-0">
        {/* Admin Studio Link */}
        <Link
          href="/admin"
          title="Open Cover Studio"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/15 text-stone-300 hover:text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Sliders className="w-3 h-3 text-[#e5c07b]" />
          <span>ADMIN</span>
        </Link>
      </header>

      {/* 4. MAIN CONTENT AREA */}
      {/*
        --------------------------------------------------------------------------
        VIEW A: FULLSCREEN CINEMA / MOBILE IMMERSIVE COVER
        Active when:
        1. Media is Landscape or Video (on all screens: Phone, iPad, MacBook, 4K)
        2. Media is Portrait on Mobile screens (< lg)
        --------------------------------------------------------------------------
      */}
      <div
        className={`w-full h-full flex flex-col justify-between items-center ${
          isPortrait ? "lg:hidden" : ""
        }`}
      >
        {/* Full-bleed media layer */}
        <div
          ref={coverContainerRef}
          onClick={handleOpenAbout}
          className="absolute inset-0 z-0 cursor-pointer overflow-hidden"
        >
          {/* Master Media Layer */}
          {isVideo ? (
            <video
              key={`master-${mediaUrl}`}
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
              className={`w-full h-full filter contrast-[1.03] saturate-[1.06] brightness-[0.98] transition-all duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-95 scale-[1.01]"
              }`}
            />
          )}

          {/* Top Subtle Vignette */}
          <div className="absolute top-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Bottom Rich Cinema Scrim (Guarantees crisp text legibility) */}
          <div className="absolute bottom-0 inset-x-0 h-[80%] sm:h-[72%] md:h-[65%] bg-gradient-to-t from-[#07080b] via-[#07080b]/85 via-50% to-transparent pointer-events-none" />
        </div>

        {/* Bottom Integrated Editorial Overlay (MOBILE-OPTIMIZED WITH SAFE-AREA PADDING) */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-10 pb-[calc(1.25rem+env(safe-area-inset-bottom,16px))] sm:pb-8 mt-auto flex flex-col items-center text-center space-y-2 sm:space-y-3">
          {/* Eyebrow Role Pill */}
          {settings.showRole !== false && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 border border-[#e5c07b]/35 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.6)] text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#e5c07b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e5c07b] shadow-[0_0_8px_#e5c07b] animate-pulse shrink-0" />
              <span>{(settings.role || "Teaching Assistant @ IIT Madras").toUpperCase()}</span>
            </div>
          )}

          {/* Display Name - Modern Bold Syne Typography */}
          {settings.showName !== false && (
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase text-[#f5f3ef] tracking-[-0.02em] leading-[0.88] drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] max-w-full break-words select-none">
              {settings.name}
            </h1>
          )}

          {/* Subtitle / Focus */}
          <p className="text-xs sm:text-sm font-sans text-stone-300 font-light tracking-wide max-w-xl">
            1st Year B.Tech CSE (AI &amp; Data Science) · Code, Math &amp; Models
          </p>

          {/* Location & Academic Focus Metadata */}
          {settings.showLocation !== false && settings.location && (
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-stone-300">
              <MapPin className="w-3 h-3 text-[#e5c07b]" />
              <span>{settings.location}</span>
            </div>
          )}

          {/* Social Links */}
          {settings.showSocialLinks !== false && (
            <div className="pt-1">
              {renderSocialLinks()}
            </div>
          )}

          {/* Scroll Explore Hint */}
          <div className="flex items-center gap-2.5 pt-1 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-stone-400">
            <div
              onClick={handleOpenAbout}
              className="hover:text-white uppercase cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <span>SCROLL TO EXPLORE</span>
              <span className="animate-bounce">&darr;</span>
            </div>
            <span className="text-stone-600">&bull;</span>
            <Link
              href="/admin"
              className="hover:text-[#e5c07b] uppercase transition-colors"
            >
              ADMIN ↗
            </Link>
          </div>
        </div>
      </div>

      {/*
        --------------------------------------------------------------------------
        VIEW B: HIGH-IMPACT CREATIVE DEVELOPER LANDING SPREAD
        Active on Desktop, Laptop, MacBook, and Widescreen Displays (>= lg)
        Features clean floating gallery canvas on left & bold typographic hero on right!
        --------------------------------------------------------------------------
      */}
      {isPortrait && (
        <div className="hidden lg:flex relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 my-auto items-center justify-center py-6">
          <div className="w-full grid grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* LEFT COLUMN: Modern Floating Gallery Canvas (5 Cols) */}
            <div className="col-span-5 flex justify-end">
              <div
                ref={coverContainerRef}
                onClick={handleOpenAbout}
                style={{
                  transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                  boxShadow: `0 30px 90px rgba(0,0,0,0.95), 0 0 70px ${palette.ambientGlow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
                  aspectRatio: metrics.aspectRatio || 0.72,
                }}
                className="relative w-full max-w-[340px] xl:max-w-[390px] max-h-[70vh] rounded-2xl bg-[#0b0c10]/85 backdrop-blur-xl border border-white/20 overflow-hidden cursor-pointer group transition-all duration-500 ease-out hover:scale-[1.02]"
              >
                {/* Specular Edge Highlights */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

                {/* Glossy Diagonal Light Sweep Reflection */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/14 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Cover Photograph */}
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

                {/* Subtle Modern Frame Bezel Shadow */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none z-10" />
              </div>
            </div>

            {/* RIGHT COLUMN: Bold Creative Developer Landing Typography (7 Cols) */}
            <div className="col-span-7 space-y-4 xl:space-y-5 text-left max-w-2xl">
              {/* Eyebrow Working Position Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#e5c07b]/30 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#e5c07b]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{(settings.role || "Teaching Assistant @ IIT Madras").toUpperCase()}</span>
              </div>

              {/* Big Headline Name - Ultra-Cool Modern Syne Font */}
              {settings.showName !== false && (
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold uppercase text-[#f5f3ef] tracking-[-0.025em] leading-[0.88] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] select-none">
                  {settings.name}
                </h1>
              )}

              {/* Bio Hook */}
              <p className="text-base sm:text-lg font-sans text-stone-300 font-light tracking-wide leading-relaxed max-w-xl">
                1st Year B.Tech CSE (AI &amp; Data Science) · Crafting intelligent interfaces, machine learning models, and high-performance web systems.
              </p>

              {/* Clean Typographic Ledger (Zero Generic AI Gray Boxes) */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-stone-400 uppercase tracking-widest pt-1">
                <div className="flex items-center gap-1.5 text-stone-200">
                  <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                  <span>CHENNAI, INDIA</span>
                </div>
                <span className="text-white/20">&bull;</span>
                <div className="text-stone-300">
                  <span className="text-[#e5c07b]">FOCUS:</span> FULL-STACK + APPLIED AI
                </div>
                <span className="text-white/20">&bull;</span>
                <div className="text-emerald-400 font-medium">
                  OPEN FOR PROJECTS
                </div>
              </div>

              {/* Statement Quote */}
              {settings.showStatement !== false && settings.statement && (
                <blockquote className="text-xs sm:text-sm font-editorial-italic font-light text-stone-300/85 leading-relaxed border-l-2 border-[#e5c07b]/60 pl-3.5 max-w-xl">
                  &ldquo;{settings.statement}&rdquo;
                </blockquote>
              )}

              {/* Landing Page Action CTAs */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                {/* Primary CTA */}
                <button
                  onClick={handleOpenAbout}
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(229,192,123,0.3)] active:scale-95"
                >
                  <span>EXPLORE ARCHIVE</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Direct Chapter Links */}
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
                  <Link
                    href="/projects"
                    className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
                  >
                    PROJECTS ↗
                  </Link>
                  <Link
                    href="/certificates"
                    className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
                  >
                    CREDS ↗
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-stone-300 hover:text-white transition-all cursor-pointer"
                  >
                    CONTACT ↗
                  </Link>
                </div>
              </div>

              {/* Social Glyphs & Scroll Explore Row */}
              <div className="pt-2 flex items-center gap-6">
                {settings.showSocialLinks !== false && (
                  <div className="flex items-center gap-2">
                    {renderSocialLinks()}
                  </div>
                )}

                <div
                  onClick={handleOpenAbout}
                  className="hover:text-white uppercase cursor-pointer transition-colors flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-stone-400"
                >
                  <span>SCROLL TO EXPLORE</span>
                  <span className="animate-bounce">&darr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
