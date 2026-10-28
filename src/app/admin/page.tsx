"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import {
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  ExternalLink,
  Sliders,
  Type,
  Eye,
  EyeOff,
  MapPin,
  GraduationCap,
  Sparkles,
  Quote,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DetectedMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape" | "square";
}

export default function AdminPage() {
  const { settings, updateSettings, resetSettings, isLoaded } = usePortfolioSettings();
  const [formData, setFormData] = useState(settings);
  const [savedToast, setSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [detectedMetrics, setDetectedMetrics] = useState<DetectedMetrics>({
    width: 768,
    height: 1024,
    aspectRatio: 0.75,
    orientation: "portrait",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data when settings are loaded from storage
  useEffect(() => {
    if (isLoaded) {
      setFormData(settings);
    }
  }, [isLoaded, settings]);

  // Real-time aspect ratio detection whenever coverImage changes
  useEffect(() => {
    if (typeof window !== "undefined" && formData.coverImage) {
      const img = new Image();
      img.src = formData.coverImage;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let orientation: "portrait" | "landscape" | "square" = "portrait";
        if (ratio > 1.15) orientation = "landscape";
        else if (ratio < 0.88) orientation = "portrait";
        else orientation = "square";

        setDetectedMetrics({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: ratio,
          orientation,
        });
      };
    }
  }, [formData.coverImage]);

  // Auto-compress on upload (Canvas downscaling prevents browser quota errors)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDimension = 1920;
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
          setFormData((prev) => ({ ...prev, coverImage: compressedDataUrl }));
        }
      };
      img.src = objectUrl;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset cover settings back to default portrait?")) {
      resetSettings();
      setFormData(settings);
    }
  };

  const samplePresets = [
    {
      name: "Harsh (Portrait Original)",
      url: "/harsh-cover.jpg",
      type: "Portrait",
    },
    {
      name: "Landscape Editorial (16:9)",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      type: "Landscape",
    },
    {
      name: "Square Studio (1:1)",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=800&q=80",
      type: "Square",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f5f3ef] font-sans selection:bg-[#e5c07b] selection:text-stone-950 flex flex-col justify-between">
      {/* 1. Standalone Admin Top Bar (NO site nav/footer) */}
      <header className="border-b border-white/10 bg-[#0c0d11]/80 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-[#e5c07b] text-stone-950 font-mono text-[10px] font-black rounded-sm uppercase tracking-widest">
              COVER STUDIO
            </span>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline uppercase tracking-wider">
              PORTFOLIO CONTROL CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/20 hover:border-[#e5c07b] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-[#e5c07b] uppercase tracking-wider transition-all"
            >
              <span>Live Cover</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Workspace */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-8 space-y-8 flex-1">
        {/* Lead Headline & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black font-editorial uppercase tracking-tight text-white">
              Cover Page Studio
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 font-sans">
              Manage cover photography, portrait split-spread content, location, role, and toggle visibility.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/15 hover:border-red-400/70 text-stone-400 hover:text-red-400 text-xs font-mono uppercase tracking-wider rounded-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#d4af37] via-[#f3d082] to-[#d4af37] hover:from-[#c5a028] hover:to-[#e5c07b] text-stone-950 text-xs font-mono uppercase tracking-widest font-black rounded-md shadow-xl shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? "Saving to Disk..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: Controls (Left) + Live Simulation (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* A. Photograph Uploader Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <ImageIcon className="w-4 h-4" />
                  <span>Cover Photograph</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {detectedMetrics.orientation} &bull; {detectedMetrics.width}&times;{detectedMetrics.height}px
                </span>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group border-2 border-dashed border-white/20 hover:border-[#e5c07b] rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 bg-white/[0.015] hover:bg-white/[0.04]"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2.5">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#e5c07b] group-hover:bg-[#e5c07b]/10 text-stone-400 group-hover:text-[#e5c07b] transition-all">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-stone-200">
                    Click to upload custom photograph
                  </span>
                  <span className="text-xs text-stone-500 max-w-sm">
                    Portrait switches to Left Cover + Right Monograph Spread. Landscape switches to Fullscreen Cinema.
                  </span>
                </div>
              </div>

              {/* 1-Click Presets */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block font-semibold">
                  Test Presets (Aspect Ratio Testing):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {samplePresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, coverImage: preset.url }))
                      }
                      className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer ${
                        formData.coverImage === preset.url
                          ? "border-[#e5c07b] bg-[#e5c07b]/10 text-white font-bold"
                          : "border-white/10 bg-white/5 text-stone-400 hover:text-white hover:border-white/30"
                      }`}
                    >
                      <span className="block text-[11px] font-medium text-stone-200 truncate">
                        {preset.name}
                      </span>
                      <span className="text-[9px] text-[#e5c07b] uppercase block mt-0.5">
                        {preset.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* B. Framing & Focal Position */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                <Sliders className="w-4 h-4" />
                <span>Image Framing &amp; Focal Point</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Image Fit Mode */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-stone-300 block uppercase tracking-wider">
                    Object Fit
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["cover", "contain"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, coverImageFit: mode }))
                        }
                        className={`py-2 px-3 rounded-md border text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center ${
                          formData.coverImageFit === mode
                            ? "border-[#e5c07b] bg-[#e5c07b]/10 text-white font-bold"
                            : "border-white/10 bg-white/5 text-stone-400 hover:text-white"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focal Position */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-stone-300 block uppercase tracking-wider">
                    Focal Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["top", "center", "bottom"] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, coverImagePosition: pos }))
                        }
                        className={`py-2 px-2 rounded-md border text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer text-center ${
                          formData.coverImagePosition === pos
                            ? "border-[#e5c07b] bg-[#e5c07b]/10 text-white font-bold"
                            : "border-white/10 bg-white/5 text-stone-400 hover:text-white"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* C. Identity & Add-on Details (With Hide/Unhide Toggles) */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                <Type className="w-4 h-4" />
                <span>Identity, Add-ons &amp; Hide/Unhide Toggles</span>
              </div>

              {/* 1. Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5">
                  Display Name (Also powers background hollow watermark)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-sm text-white"
                />
              </div>

              {/* 2. Role (With Toggle) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Current Role</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showRole: prev.showRole === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showRole !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showRole !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.role || formData.subrole || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  placeholder="e.g. Designer · Developer · AI & Data Science"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-sm text-white"
                />
              </div>

              {/* 3. Location (With Toggle) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300">
                    <MapPin className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Current Location</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showLocation: prev.showLocation === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showLocation !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showLocation !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="e.g. Chennai, India"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-sm text-white"
                />
              </div>

              {/* 4. Where I'm Doing & What (With Toggle) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300">
                    <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Where I'm Doing &amp; What (Academic / Focus)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showWhereAndWhat:
                          prev.showWhereAndWhat === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showWhereAndWhat !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showWhereAndWhat !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.whereAndWhat || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      whereAndWhat: e.target.value,
                    }))
                  }
                  placeholder="e.g. 1st Year B.Tech CSE (AI & Data Science) · Building foundations in Code, Math & Models"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-xs text-white"
                />
              </div>

              {/* 5. Minimalist Statement / Quote (With Toggle) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300">
                    <Quote className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Minimalist Statement Quote</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showStatement: prev.showStatement === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showStatement !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showStatement !== false ? (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.statement || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, statement: e.target.value }))
                  }
                  placeholder="e.g. Crafting interfaces at the intersection of modern design and artificial intelligence."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-editorial italic text-sm text-white"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 shadow-2xl space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Eye className="w-4 h-4" />
                  <span>Live Cover Simulation</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  {detectedMetrics.orientation === "portrait"
                    ? "Left Photo + Right Spread"
                    : "Fullscreen Cinema"}
                </span>
              </div>

              {/* Studio Frame Simulation */}
              <div className="w-full min-h-[380px] sm:min-h-[440px] bg-[#07080a] border border-white/10 rounded-lg p-5 flex flex-col justify-center items-center relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(229,192,123,0.12)_0%,transparent_70%)]" />

                {/* Simulated Hollow Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
                  <span
                    className="text-4xl sm:text-5xl font-editorial font-black uppercase tracking-[0.2em]"
                    style={{
                      WebkitTextStroke: "1px rgba(255, 255, 255, 0.3)",
                      color: "transparent",
                    }}
                  >
                    {formData.name}
                  </span>
                </div>

                {/* Simulation depending on Orientation */}
                {detectedMetrics.orientation === "portrait" ? (
                  /* Portrait Simulation: Left photo + Right info */
                  <div className="relative z-10 w-full grid grid-cols-2 gap-3 items-center">
                    <div
                      style={{
                        boxShadow:
                          "0 20px 45px rgba(0,0,0,0.85), 3px 0 0 #1c1d24, 4px 0 0 #0f1014",
                      }}
                      className="w-full aspect-[1/1.42] bg-[#0b0c10] border border-white/20 rounded-[2px] overflow-hidden"
                    >
                      <img
                        src={formData.coverImage}
                        alt={formData.name}
                        style={{
                          objectFit: formData.coverImageFit,
                          objectPosition:
                            formData.coverImagePosition === "top"
                              ? "center top"
                              : formData.coverImagePosition === "bottom"
                              ? "center bottom"
                              : "center center",
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2 text-left">
                      <h4 className="text-sm font-editorial font-black uppercase text-white tracking-wider leading-tight">
                        {formData.name}
                      </h4>
                      {formData.showRole !== false && (
                        <p className="text-[10px] text-stone-300 font-sans line-clamp-1">
                          {formData.role || formData.subrole}
                        </p>
                      )}
                      {formData.showLocation !== false && (
                        <div className="text-[9px] font-mono text-[#e5c07b] flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{formData.location}</span>
                        </div>
                      )}
                      {formData.showWhereAndWhat !== false && (
                        <p className="text-[9px] font-mono text-stone-400 line-clamp-2">
                          {formData.whereAndWhat}
                        </p>
                      )}
                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[9px] font-mono text-white">
                          OPEN &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Landscape Simulation: Widescreen Cinema */
                  <div
                    style={{
                      boxShadow:
                        "0 25px 60px rgba(0,0,0,0.85), 3px 1px 0 #1c1d24, 5px 2px 0 #0f1014",
                    }}
                    className="relative z-10 w-full max-w-[340px] aspect-[16/10] bg-[#0b0c10] border border-white/20 rounded-[2px] overflow-hidden group shadow-2xl transition-all duration-300"
                  >
                    <img
                      src={formData.coverImage}
                      alt={formData.name}
                      style={{
                        objectFit: formData.coverImageFit,
                        objectPosition:
                          formData.coverImagePosition === "top"
                            ? "center top"
                            : formData.coverImagePosition === "bottom"
                            ? "center bottom"
                            : "center center",
                      }}
                      className="w-full h-full filter contrast-[1.03] saturate-[1.06]"
                    />
                  </div>
                )}
              </div>

              {/* Save Quick Action Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs uppercase tracking-widest font-black rounded-md shadow-lg active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving to Disk..." : "Save & Update Live Portfolio"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-widest shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Cover Saved to Disk &amp; Live Site!</span>
        </div>
      )}
    </div>
  );
}
