"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import { MagazineBgType } from "@/data/portfolioSettings";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Film,
  Image as ImageIcon,
  MapPin,
  GraduationCap,
  Quote,
  Sparkles,
  Type,
  Share2,
  Sliders,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

export default function AdminPage() {
  const { settings, updateSettings, resetSettings } = usePortfolioSettings();
  const [formData, setFormData] = useState(settings);
  const [prevSettings, setPrevSettings] = useState(settings);

  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setFormData(settings);
  }

  const [isSaving, setIsSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Handle URL change with auto-detection for video
  const handleMediaUrlChange = (url: string) => {
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
    setFormData((prev) => ({
      ...prev,
      coverMediaUrl: url,
      coverImage: url,
      coverMediaType: isVideo ? "video" : prev.coverMediaType || "image",
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Reset cover settings back to default configuration?")) {
      resetSettings();
      setFormData(settings);
    }
  };


  const isVideo =
    formData.coverMediaType === "video" ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(formData.coverMediaUrl || "");

  return (
    <div className="min-h-screen bg-[#07080a] text-[#f5f3ef] font-sans selection:bg-[#e5c07b] selection:text-stone-950 flex flex-col justify-between">
      {/* 1. Header Bar */}
      <header className="border-b border-white/10 bg-[#0c0d11]/85 backdrop-blur-xl sticky top-0 z-50 px-6 sm:px-10 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cover</span>
            </Link>
            <span className="text-white/20">|</span>
            <span className="px-2.5 py-0.5 bg-[#e5c07b] text-stone-950 font-mono text-[10px] font-black rounded uppercase tracking-widest">
              COVER STUDIO
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              title="Reset to default settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-stone-400 hover:text-red-400 rounded border border-white/10 hover:border-red-500/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Save &amp; Publish</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Workspace */}
      <main className="max-w-7xl mx-auto w-full px-6 sm:px-10 py-8 grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* PANEL 1: MEDIA SOURCE (PHOTO OR VIDEO LINK) */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Film className="w-4 h-4" />
                  <span>Cover Media Source (Photo / Video Link)</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverMediaType: "image",
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.coverMediaType !== "video"
                        ? "bg-[#e5c07b] text-stone-950 font-bold shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        coverMediaType: "video",
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.coverMediaType === "video"
                        ? "bg-[#e5c07b] text-stone-950 font-bold shadow-sm"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    <span>Video</span>
                  </button>
                </div>
              </div>

              {/* Paste URL Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-stone-300 uppercase tracking-wider block">
                  Paste Direct Photo or Video URL:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.coverMediaUrl || formData.coverImage || ""}
                    onChange={(e) => handleMediaUrlChange(e.target.value)}
                    placeholder="https://example.com/cover.mp4 or /custom-cover.jpg"
                    className="w-full px-4 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-xs text-white"
                  />
                  {formData.coverMediaUrl && (
                    <a
                      href={formData.coverMediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                      title="Open link in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] font-mono text-stone-400">
                  Tip: Supports `.jpg`, `.png`, `.webp`, `.mp4`, `.webm`, `.mov` direct links or local paths.
                </p>
              </div>
            </div>

            {/* PANEL 2: COVER PAGE DISPLAY ELEMENTS ("cover page pe ky ky show kre") */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Sliders className="w-4 h-4" />
                  <span>Cover Elements &amp; Content Visibility</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  Live Hide/Unhide
                </span>
              </div>

              {/* 1. Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    <Type className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Display Name</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showName: prev.showName === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showName !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showName !== false ? (
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
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-editorial uppercase text-sm text-white"
                />
              </div>

              {/* 2. Role */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Current Role / Subtitle</span>
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
                  placeholder="e.g. Teaching Assistant At IIT Madras"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-sm text-white"
                />
              </div>

              {/* 3. Location */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
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
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-sm text-white"
                />
              </div>

              {/* 4. Where I'm Doing & What (Academic Focus) */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Academic Focus / What I&apos;m Doing</span>
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
                    setFormData((prev) => ({ ...prev, whereAndWhat: e.target.value }))
                  }
                  placeholder="e.g. 1st Year B.Tech CSE (AI & Data Science) · Building foundations in Code, Math & Models"
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-xs text-white"
                />
              </div>

              {/* 5. Minimalist Statement Quote */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    <Quote className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Minimalist Statement Quote</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showStatement:
                          prev.showStatement === false ? true : false,
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
                  className="w-full px-3.5 py-2 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-editorial italic text-xs text-white"
                />
              </div>

              {/* 6. Social Links */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    <Share2 className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Social Contact Icons</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showSocialLinks:
                          prev.showSocialLinks === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showSocialLinks !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showSocialLinks !== false ? (
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
                <p className="text-[11px] font-mono text-stone-400">
                  Toggles visibility of Email, GitHub &amp; LinkedIn glyphs on the cover.
                </p>
              </div>
            </div>

            {/* PANEL 3: MAGAZINE BACKGROUND DESIGN & EDITORIAL STORY STUDIO */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Magazine Background &amp; Editorial Layout</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      showBgDesign: prev.showBgDesign === false ? true : false,
                    }))
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    formData.showBgDesign !== false
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {formData.showBgDesign !== false ? (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Bg Design Active</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Bg Design Hidden</span>
                    </>
                  )}
                </button>
              </div>

              {/* Background Design Style */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block font-bold">
                  Background Magazine Design Style:
                </label>
                <select
                  value={formData.bgDesignType || "kinetic-masthead"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bgDesignType: e.target.value as MagazineBgType,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-xs text-white"
                >
                  <option value="kinetic-masthead">
                    Kinetic Masthead (Large Architectural Editorial Headline)
                  </option>
                  <option value="ticker-stream">
                    Ticker Stream (Dual Gliding Marquee Headlines)
                  </option>
                  <option value="minimal-grid">
                    Technical Layout Grid (Swiss Blueprint Quadrants)
                  </option>
                  <option value="none">
                    None (Pure Velvet Minimalist Canvas)
                  </option>
                </select>
              </div>

              {/* Background Headline Text */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                  Background Watermark Text:
                </label>
                <input
                  type="text"
                  value={formData.bgDesignText || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bgDesignText: e.target.value,
                    }))
                  }
                  placeholder="e.g. HARSH ARYAN · VOL. 2026 · EDITORIAL ARCHIVE"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-editorial uppercase text-xs text-white"
                />
              </div>

              {/* Greeting Message */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    Cool Editorial Greeting
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showGreeting: prev.showGreeting === false ? true : false,
                      }))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showGreeting !== false
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showGreeting !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.greetingText || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      greetingText: e.target.value,
                    }))
                  }
                  placeholder="e.g. HEY THERE, I'M HARSH — WELCOME TO MY ARCHIVE"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-xs text-white"
                />
              </div>

              {/* Current Working Position Label */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-stone-300 block font-bold">
                  Current Role Tag / Badge:
                </label>
                <input
                  type="text"
                  value={formData.currentPositionTag || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currentPositionTag: e.target.value,
                    }))
                  }
                  placeholder="e.g. CURRENT WORKING POSITION or INTERNSHIP & RESEARCH"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-xs text-white"
                />
              </div>

              {/* Toggles for Matrix & Chapter Shortcuts */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase text-stone-300">
                    3-Part Quick Dossier Matrix
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showQuickMatrix:
                          prev.showQuickMatrix === false ? true : false,
                      }))
                    }
                    className={`w-full py-1 text-center rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showQuickMatrix !== false
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showQuickMatrix !== false ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/10 flex flex-col justify-between gap-2">
                  <span className="text-[11px] font-mono uppercase text-stone-300">
                    Chapter Shortcuts (01..04)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        showChapterLinks:
                          prev.showChapterLinks === false ? true : false,
                      }))
                    }
                    className={`w-full py-1 text-center rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      formData.showChapterLinks !== false
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formData.showChapterLinks !== false ? "Visible" : "Hidden"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Simulation Preview Column (5 Cols) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Eye className="w-4 h-4" />
                  <span>Live Simulation</span>
                </div>
                <span className="text-[10px] font-mono text-stone-400 uppercase">
                  {isVideo ? "Video Background" : "Photo Background"}
                </span>
              </div>

              {/* Live Preview Card */}
              <div className="relative w-full aspect-[16/10] bg-[#07080a] border border-white/20 rounded-lg overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
                {/* Media Layer */}
                {isVideo ? (
                  <video
                    key={formData.coverMediaUrl}
                    src={formData.coverMediaUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover filter contrast-[1.03] brightness-[0.98]"
                  />
                ) : (
                  <img
                    src={formData.coverMediaUrl || formData.coverImage}
                    alt={formData.name}
                    className="absolute inset-0 w-full h-full object-cover filter contrast-[1.03] brightness-[0.98]"
                  />
                )}

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                {/* Top header simulation */}
                <div className="relative z-10 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-white/80 font-bold">
                  <span>{formData.showName !== false ? formData.name : ""}</span>
                  <span className="text-[#e5c07b] text-[8px] border border-[#e5c07b]/40 px-1.5 py-0.5 rounded">
                    {isVideo ? "VIDEO" : "PHOTO"}
                  </span>
                </div>

                {/* Bottom content simulation */}
                <div className="relative z-10 text-center space-y-1">
                  {formData.showName !== false && (
                    <h3 className="text-sm font-editorial font-black uppercase text-white tracking-wider leading-tight drop-shadow-md">
                      {formData.name}
                    </h3>
                  )}

                  {formData.showRole !== false && (
                    <p className="text-[10px] text-stone-200 font-sans line-clamp-1 drop-shadow-sm">
                      {formData.role || formData.subrole}
                    </p>
                  )}

                  {formData.showLocation !== false && formData.location && (
                    <div className="text-[9px] font-mono text-[#e5c07b] flex items-center justify-center gap-1 drop-shadow-sm">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{formData.location}</span>
                    </div>
                  )}

                  {formData.showWhereAndWhat !== false && formData.whereAndWhat && (
                    <p className="text-[8px] font-mono text-stone-300 line-clamp-1 drop-shadow-sm">
                      {formData.whereAndWhat}
                    </p>
                  )}

                  {formData.showStatement !== false && formData.statement && (
                    <p className="text-[8px] font-editorial italic text-stone-300 line-clamp-1 drop-shadow-sm">
                      &ldquo;{formData.statement}&rdquo;
                    </p>
                  )}

                  {formData.showSocialLinks !== false && (
                    <div className="pt-0.5 flex items-center justify-center gap-2 text-[9px] text-stone-300">
                      <span>✉</span>
                      <span>🐙</span>
                      <span>💼</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs uppercase tracking-widest font-black rounded-lg shadow-lg active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save & Update Live Portfolio"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-widest shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Cover settings saved &amp; live!</span>
        </div>
      )}
    </div>
  );
}
