"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  MapPin,
  GraduationCap,
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
    const ambientGlow = `rgba(${bestR}, ${bestG}, ${bestB}, 0.35)`;
    const ambientGlowSubtle = `rgba(${bestR}, ${bestG}, ${bestB}, 0.15)`;
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
      let orientation: "portrait" | "landscape" | "square" = "portrait";

      if (ratio > 1.05) {
        orientation = "landscape";
      } else {
        orientation = "portrait";
      }

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
        className="p-1.5 text-stone-300/80 hover:text-[#e5c07b] hover:scale-110 transition-all"
        aria-label="Email"
      >
        <Mail className="w-4 h-4" />
      </a>

      <a
        href={portfolioData.socialLinks.github}
        target="_blank"
        rel="noopener noreferrer"
        title="GitHub Profile"
        className="p-1.5 text-stone-300/80 hover:text-[#e5c07b] hover:scale-110 transition-all"
        aria-label="GitHub"
      >
        <GithubIcon className="w-4 h-4" />
      </a>

      <a
        href={portfolioData.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn Profile"
        className="p-1.5 text-stone-300/80 hover:text-[#e5c07b] hover:scale-110 transition-all"
        aria-label="LinkedIn"
      >
        <LinkedinIcon className="w-4 h-4" />
      </a>
    </div>
  );

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full min-h-[100dvh] h-[100dvh] flex flex-col justify-between items-center bg-[#060709] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans select-none overflow-hidden transition-all duration-700 ease-out ${
        isNavigating
          ? "opacity-0 -translate-y-6 scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* 1. Master Background Atmosphere (Adaptive Ambient Mesh) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${palette.ambientGlow} 0%, ${palette.ambientGlowSubtle} 32%, rgba(6, 7, 9, 0.95) 75%, #060709 100%)`,
        }}
      />

      {/* 2. Analog Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3. Top Master Header Bar (Responsive for all screens) */}
      <header className="relative z-30 w-full px-4 sm:px-8 md:px-12 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: palette.primaryAccent }}
            className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
          />
          {settings.showName !== false && (
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/80 font-bold truncate max-w-[180px] sm:max-w-none">
              {settings.name}
            </span>
          )}
        </div>

        {/* Admin Studio Pill Link */}
        <Link
          href="/admin"
          title="Open Admin Studio"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/15 text-stone-300 hover:text-white font-mono text-[9px] sm:text-[10px] uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Sliders className="w-3 h-3 text-[#e5c07b]" />
          <span>ADMIN</span>
        </Link>
      </header>

      {/* 4. MAIN HERO CONTENT AREA */}
      {!isPortrait ? (
        /* =========================================================================
           MODE A: FULLSCREEN CINEMA COVER (FOR LANDSCAPE PHOTOS & VIDEOS)
           Flawless on MacBook, Laptop, iPad, and zero cut-off on Phones!
           ========================================================================= */
        <>
          {/* Full-bleed media layer */}
          <div
            ref={coverContainerRef}
            onClick={handleOpenAbout}
            className="absolute inset-0 z-0 cursor-pointer overflow-hidden"
          >
            {/* Ambient blurred backdrop if contain mode */}
            {settings.coverImageFit === "contain" && (
              isVideo ? (
                <video
                  key={`ambient-${mediaUrl}`}
                  src={mediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-35 brightness-75 pointer-events-none"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-3xl scale-110 opacity-35 brightness-75 pointer-events-none"
                />
              )
            )}

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

            {/* Bottom Rich Cinema Scrim (Prevents any text clipping or contrast loss) */}
            <div className="absolute bottom-0 inset-x-0 h-[85%] sm:h-[75%] md:h-[65%] bg-gradient-to-t from-[#060709] via-[#060709]/85 via-45% to-transparent pointer-events-none" />

            {/* Edge Radial Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,7,9,0.75)_100%)] pointer-events-none" />
          </div>

          {/* Clean Breathing Space */}
          <div className="my-auto pointer-events-none" />

          {/* Bottom Integrated Editorial Overlay (MOBILE-OPTIMIZED WITH ZERO CLIPPING) */}
          <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-10 pb-4 sm:pb-6 flex flex-col items-center text-center space-y-2 sm:space-y-3.5">
            {/* Display Name */}
            {settings.showName !== false && (
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.1em] sm:tracking-[0.14em] leading-[0.95] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] max-w-full break-words">
                {settings.name}
              </h1>
            )}

            {/* Current Role */}
            {settings.showRole !== false && (
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-sans text-stone-200/90 font-light tracking-wide max-w-xl truncate sm:whitespace-normal drop-shadow-md">
                {settings.role || settings.subrole}
              </p>
            )}

            {/* Location & Academic Focus Metadata */}
            {(settings.showLocation !== false || settings.showWhereAndWhat !== false) && (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-xs font-mono text-stone-300/90 tracking-wider drop-shadow-md">
                {settings.showLocation !== false && settings.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#e5c07b]" />
                    <span>{settings.location}</span>
                  </div>
                )}

                {settings.showLocation !== false &&
                  settings.showWhereAndWhat !== false &&
                  settings.location &&
                  settings.whereAndWhat && (
                    <span className="text-white/30 hidden sm:inline">&bull;</span>
                  )}

                {settings.showWhereAndWhat !== false && settings.whereAndWhat && (
                  <div className="flex items-center gap-1.5 max-w-md sm:max-w-xl text-center">
                    <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b] shrink-0" />
                    <span className="text-[10px] sm:text-[11px] leading-relaxed truncate sm:whitespace-normal">
                      {settings.whereAndWhat}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Statement Quote */}
            {settings.showStatement !== false && settings.statement && (
              <blockquote className="text-[11px] sm:text-xs md:text-sm font-editorial italic text-stone-200/85 max-w-xl mx-auto leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-none">
                &ldquo;{settings.statement}&rdquo;
              </blockquote>
            )}

            {/* Social Links */}
            {settings.showSocialLinks !== false && (
              <div className="pt-1">
                {renderSocialLinks()}
              </div>
            )}

            {/* Scroll Explore Hint + Admin Link */}
            <div className="flex items-center gap-3 pt-0.5 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-stone-400">
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
        </>
      ) : (
        /* =========================================================================
           MODE B: LUXURY COLLECTOR'S MONOGRAPH SPREAD (FOR PORTRAIT PHOTOS)
           High-fashion physical book on Desktop/iPad + Full-screen Vertical on Phone!
           ========================================================================= */
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 my-auto flex items-center justify-center py-2 sm:py-4">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 items-center">
            {/* LEFT COLUMN: Luxury Collector's Monograph Book Cover (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                ref={coverContainerRef}
                onClick={handleOpenAbout}
                style={{
                  transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                  boxShadow: `0 35px 90px rgba(0,0,0,0.95), 0 0 60px ${palette.ambientGlowSubtle}, inset 0 1px 1px rgba(255,255,255,0.25), 3px 0 0 #1c1d24, 5px 1px 0 #0f1014, 7px 1px 0 #282a33, 9px 2px 0 #121317, 11px 2px 0 #20222a, 13px 3px 0 #090a0d`,
                  aspectRatio: metrics.aspectRatio || 0.72,
                }}
                className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] max-h-[48vh] sm:max-h-[58vh] lg:max-h-[68vh] bg-[#0b0c10]/85 backdrop-blur-xl border border-white/20 rounded-[3px] overflow-hidden cursor-pointer group transition-all duration-500 ease-out hover:scale-[1.01]"
              >
                {/* Specular Edge Highlights */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

                {/* Glossy Diagonal Light Sweep Reflection */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                  <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/14 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Gold Edition Badge in Top Left */}
                <div className="absolute top-2.5 left-3.5 z-20 pointer-events-none">
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#e5c07b] font-black drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                    FOLIO &bull; 01
                  </span>
                </div>

                {/* Cover Photograph */}
                <img
                  ref={imgRef}
                  src={mediaUrl}
                  alt={settings.name}
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
                  className={`w-full h-full filter contrast-[1.04] saturate-[1.06] brightness-[0.99] transition-all duration-500 group-hover:scale-[1.015] ${
                    isLoaded ? "opacity-100" : "opacity-95"
                  }`}
                />

                {/* Realistic Book Spine (Left Edge with Leatherette Crease) */}
                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/80 via-black/35 to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 bottom-0 left-[2.5px] w-[1px] bg-amber-400/35 pointer-events-none z-10" />

                {/* Right Edge Multi-Page Stack Depth */}
                <div className="absolute top-0 bottom-0 right-0 w-2.5 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* RIGHT COLUMN: Museum-Grade Monograph Typography (7 Cols) */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 md:space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              {/* Monograph Series Tag */}
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#e5c07b] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EDITORIAL MONOGRAPH // ISSUE 01</span>
              </div>

              {/* Big Headline Name */}
              {settings.showName !== false && (
                <h1 className="text-3xl sm:text-5xl md:text-6xl xl:text-7xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.12em] sm:tracking-[0.14em] leading-[0.92] drop-shadow-xl">
                  {settings.name}
                </h1>
              )}

              {/* Current Role */}
              {settings.showRole !== false && (
                <p className="text-sm sm:text-lg md:text-xl font-sans text-stone-200/90 font-light tracking-wide">
                  {settings.role || settings.subrole}
                </p>
              )}

              {/* Gilded Hairline Accent */}
              <div className="w-20 h-[2px] bg-gradient-to-r from-[#e5c07b] to-transparent mx-auto lg:mx-0" />

              {/* Minimalist Statement Quote */}
              {settings.showStatement !== false && settings.statement && (
                <blockquote className="text-xs sm:text-base md:text-lg font-editorial italic text-stone-200/85 leading-relaxed">
                  &ldquo;{settings.statement}&rdquo;
                </blockquote>
              )}

              {/* Location & Academic Focus Metadata */}
              <div className="space-y-1.5 text-center lg:text-left pt-1">
                {settings.showLocation !== false && settings.location && (
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>{settings.location}</span>
                  </div>
                )}

                {settings.showWhereAndWhat !== false && settings.whereAndWhat && (
                  <div className="flex items-start justify-center lg:justify-start gap-2.5 text-xs font-mono text-stone-400 max-w-md">
                    <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">
                      {settings.whereAndWhat}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Social Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {/* Hero Explore Action Button */}
                <button
                  onClick={handleOpenAbout}
                  className="group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs uppercase tracking-[0.2em] font-black transition-all duration-300 cursor-pointer shadow-lg active:scale-95"
                >
                  <span>{isNavigating ? "OPENING..." : "EXPLORE ISSUE"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Social Glyphs */}
                {settings.showSocialLinks !== false && (
                  <div className="flex items-center gap-2">
                    {renderSocialLinks()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Subdued Bottom Footer Explore & Admin Link (Always within viewport) */}
      <footer className="relative z-30 pb-3 pt-1 text-center flex items-center justify-center gap-3 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-stone-500">
        <div
          onClick={handleOpenAbout}
          className="hover:text-stone-300 uppercase cursor-pointer transition-colors flex items-center gap-1.5"
        >
          <span>SCROLL TO EXPLORE</span>
          <span className="animate-bounce">&darr;</span>
        </div>
        <span>&bull;</span>
        <Link
          href="/admin"
          className="hover:text-[#e5c07b] uppercase transition-colors"
        >
          ADMIN STUDIO ↗
        </Link>
      </footer>
    </div>
  );
}
