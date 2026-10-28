"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  MapPin,
  GraduationCap,
  Sliders,
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

  // Re-detect if media changes dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !isVideo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = mediaUrl;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let orientation: "portrait" | "landscape" | "square" = "portrait";
        if (ratio > 1.05) orientation = "landscape";
        else orientation = "portrait";

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

  // =========================================================================
  // CASE 1: FULLSCREEN CINEMA COVER FOR LANDSCAPE & VIDEO
  // =========================================================================
  if (!isPortrait) {
    return (
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full min-h-screen flex flex-col justify-between items-center bg-[#060709] text-[#f5f3ef] selection:bg-[#e5c07b] selection:text-stone-950 font-sans select-none overflow-hidden transition-all duration-700 ease-out ${
          isNavigating
            ? "opacity-0 -translate-y-6 scale-[0.98]"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {/* Fullscreen Master Cover Photo/Video Layer */}
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

          {/* Master Full-bleed Media (Photo or Looping Video) */}
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

          {/* Film Grain Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Dynamic Ambient Lighting Bloom */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1100px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-1000"
            style={{
              background: `radial-gradient(ellipse at center, ${palette.ambientGlow} 0%, transparent 70%)`,
            }}
          />

          {/* Top Subtle Vignette */}
          <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />

          {/* Bottom Rich Cinema Scrim */}
          <div className="absolute bottom-0 inset-x-0 h-[80%] sm:h-[70%] md:h-[65%] bg-gradient-to-t from-[#060709] via-[#060709]/85 via-45% to-transparent pointer-events-none" />

          {/* Subtle Edge Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(6,7,9,0.75)_100%)] pointer-events-none" />
        </div>

        {/* Top Header Bar Over Cover */}
        <header className="relative z-20 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              style={{ backgroundColor: palette.primaryAccent }}
              className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"
            />
            {settings.showName !== false && (
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/80 font-bold">
                {settings.name}
              </span>
            )}
          </div>

          {/* Admin Studio Link */}
          <Link
            href="/admin"
            title="Open Admin Studio"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/15 text-stone-300 hover:text-white font-mono text-[10px] uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Sliders className="w-3 h-3 text-[#e5c07b]" />
            <span>ADMIN</span>
          </Link>
        </header>

        {/* Clean Breathing Space */}
        <div className="my-auto pointer-events-none" />

        {/* Bottom Integrated Editorial Overlay */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 sm:px-10 pb-6 sm:pb-8 flex flex-col items-center text-center space-y-3.5 sm:space-y-4">
          {/* Big Headline Name */}
          {settings.showName !== false && (
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.14em] leading-[0.92] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
              {settings.name}
            </h1>
          )}

          {/* Role Subtitle */}
          {settings.showRole !== false && (
            <p className="text-sm sm:text-base md:text-lg font-sans text-stone-200/95 font-light tracking-wider drop-shadow-md">
              {settings.role || settings.subrole}
            </p>
          )}

          {/* Metadata Row (Location & What/Where) */}
          {(settings.showLocation !== false || settings.showWhereAndWhat !== false) && (
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-mono text-stone-300 tracking-wider drop-shadow-md">
              {settings.showLocation !== false && settings.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
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
                <div className="flex items-center gap-1.5 max-w-xl text-center">
                  <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b] shrink-0" />
                  <span className="text-[11px] leading-relaxed">
                    {settings.whereAndWhat}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Minimalist Statement Quote */}
          {settings.showStatement !== false && settings.statement && (
            <blockquote className="text-xs sm:text-sm md:text-base font-editorial italic text-stone-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              &ldquo;{settings.statement}&rdquo;
            </blockquote>
          )}

          {/* Social Links */}
          {settings.showSocialLinks !== false && (
            <div className="pt-2 sm:pt-3">
              {renderSocialLinks()}
            </div>
          )}

          {/* Scroll to Explore Hint + Admin Link */}
          <div className="flex items-center gap-3 pt-1 text-[10px] font-mono tracking-[0.25em] text-stone-400">
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
    );
  }

  // =========================================================================
  // CASE 2: EDITORIAL BOOK SPREAD FOR PORTRAIT IMAGES
  // =========================================================================
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
      {/* 1. Subtle Analog Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Dynamic Glassmorphic Ambient Mesh */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 46%, ${palette.ambientGlow} 0%, ${palette.ambientGlowSubtle} 32%, rgba(6, 7, 9, 0.94) 70%, #060709 100%)`,
        }}
      />

      {/* 3. Dual-Orb Breathing Ambient Aurora */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[420px] rounded-full blur-[130px] pointer-events-none transition-all duration-1000 opacity-70 z-0"
        style={{
          background: `radial-gradient(ellipse at center, ${palette.ambientGlow} 0%, transparent 72%)`,
        }}
      />

      {/* 4. MAIN PORTRAIT HERO SPREAD */}
      <div className="relative z-10 my-auto w-full max-w-7xl flex items-center justify-center py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* LEFT COLUMN: Physical Magazine / Book Cover (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              ref={coverContainerRef}
              onClick={handleOpenAbout}
              style={{
                transform: `translate3d(${magnetic.x}px, ${magnetic.y}px, 0)`,
                boxShadow: `0 35px 85px rgba(0,0,0,0.9), 0 0 50px ${palette.ambientGlowSubtle}, inset 0 1px 1px rgba(255,255,255,0.25), 3px 0 0 #1c1d24, 4px 0 0 #0f1014, 6px 1px 0 #282a33, 7px 1px 0 #121317, 9px 2px 0 #20222a, 10px 2px 0 #090a0d`,
                aspectRatio: metrics.aspectRatio || 0.72,
              }}
              className="relative w-full max-w-[290px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[400px] max-h-[66vh] sm:max-h-[70vh] bg-[#0b0c10]/80 backdrop-blur-xl border border-white/20 rounded-[2px] overflow-hidden cursor-pointer group transition-all duration-500 ease-out"
            >
              {/* Specular Glass Sheen Across Top Edge */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

              {/* Glossy Spotlight Light Reflection */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden z-20">
                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/12 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
              </div>

              {/* Media: Photo or Video */}
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
                  className="w-full h-full object-cover filter contrast-[1.03] saturate-[1.06] brightness-[0.99]"
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
                  className={`w-full h-full filter contrast-[1.03] saturate-[1.06] brightness-[0.99] transition-all duration-500 group-hover:scale-[1.015] ${
                    isLoaded ? "opacity-100" : "opacity-95"
                  }`}
                />
              )}

              {/* Magazine Spine Fold (Left Edge) */}
              <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 bottom-0 left-[2px] w-[1px] bg-white/25 pointer-events-none z-10" />

              {/* Right Edge Inner Shadow */}
              <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-black/40 to-transparent pointer-events-none z-10" />
            </div>
          </div>

          {/* RIGHT COLUMN: Minimalist Editorial Typography (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
            {/* Big Headline Name */}
            {settings.showName !== false && (
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-editorial font-black uppercase text-[#f5f3ef] tracking-[0.14em] leading-[0.94] drop-shadow-lg">
                {settings.name}
              </h1>
            )}

            {/* Current Role */}
            {settings.showRole !== false && (
              <p className="text-base sm:text-xl font-sans text-stone-300 font-light tracking-wide">
                {settings.role || settings.subrole}
              </p>
            )}

            {/* Thin Hairline Divider */}
            <div className="w-20 h-[1.5px] bg-[#e5c07b]/40 mx-auto lg:mx-0" />

            {/* Minimalist Statement */}
            {settings.showStatement !== false && settings.statement && (
              <blockquote className="text-base sm:text-lg md:text-xl font-editorial italic text-stone-200/90 leading-relaxed">
                &ldquo;{settings.statement}&rdquo;
              </blockquote>
            )}

            {/* Metadata (Location & Academic Focus) */}
            <div className="space-y-2 text-center lg:text-left pt-1">
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

            {/* Social Links */}
            {settings.showSocialLinks !== false && (
              <div className="pt-2 flex justify-center lg:justify-start">
                {renderSocialLinks()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Subtle Scroll Explore Hint + Admin Link */}
      <footer className="relative z-20 pb-2 pt-1 text-center flex items-center justify-center gap-3 text-[10px] font-mono tracking-[0.25em] text-stone-500">
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
          ADMIN ↗
        </Link>
      </footer>
    </div>
  );
}
