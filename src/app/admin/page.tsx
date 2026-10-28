"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import { PortfolioSettings } from "@/data/portfolioSettings";
import {
  Upload,
  Image as ImageIcon,
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
  Monitor,
  Smartphone,
  Download,
  FileJson,
  Layers,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DetectedMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  orientation: "portrait" | "landscape" | "square";
}

type AdminTab = "visuals" | "identity" | "sections" | "backup";
type ViewportMode = "desktop" | "mobile";

export default function AdminPage() {
  const { settings, updateSettings, resetSettings } = usePortfolioSettings();
  const [formData, setFormData] = useState<PortfolioSettings>(settings);
  const [prevSettings, setPrevSettings] = useState(settings);

  // Sync form data whenever settings change from disk/server without triggering effect cascading renders
  if (settings !== prevSettings) {
    setPrevSettings(settings);
    setFormData(settings);
  }

  const [activeTab, setActiveTab] = useState<AdminTab>("visuals");
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [savedToast, setSavedToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(settings, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Pure computed value: whether current form data differs from persisted settings
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(settings);

  const [detectedMetrics, setDetectedMetrics] = useState<DetectedMetrics>({
    width: 768,
    height: 1024,
    aspectRatio: 0.75,
    orientation: "portrait",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Real-time aspect ratio and orientation detection whenever cover image changes
  useEffect(() => {
    if (typeof window !== "undefined" && formData.coverImage) {
      const img = new Image();
      img.src = formData.coverImage;
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        let orientation: "portrait" | "landscape" | "square" = "portrait";
        if (ratio > 1.12) orientation = "landscape";
        else if (ratio < 0.9) orientation = "portrait";
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

  // Auto-compress and resize image on upload to prevent localStorage quota issues
  const processImageFile = useCallback((file: File) => {
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
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file);
    }
  };

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  }, [formData, updateSettings]);

  // Global Keyboard shortcut: Ctrl+S or Cmd+S to save instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const handleReset = () => {
    if (window.confirm("Reset all cover and profile settings back to factory default?")) {
      resetSettings();
      setFormData(settings);
    }
  };

  // Export current settings as downloadable JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `portfolio-settings-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import settings from JSON file
  const handleImportJSONFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setFormData(parsed);
          setJsonInput(JSON.stringify(parsed, null, 2));
          setJsonError(null);
        } catch {
          setJsonError("Invalid JSON file. Please check syntax.");
        }
      };
      reader.readAsText(file);
    }
  };

  // Apply raw JSON from textarea editor
  const handleApplyRawJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData(parsed);
      setJsonError(null);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch {
      setJsonError("Invalid JSON syntax. Ensure quotes and commas are correct.");
    }
  };

  const samplePresets = [
    {
      name: "Harsh (Portrait Original)",
      url: "/harsh-cover.jpg",
      type: "Portrait",
      ratio: "3:4",
    },
    {
      name: "Landscape Editorial (16:9)",
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      type: "Landscape",
      ratio: "16:9",
    },
    {
      name: "Square Studio (1:1)",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=800&q=80",
      type: "Square",
      ratio: "1:1",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07080b] text-[#f5f3ef] font-sans selection:bg-[#e5c07b] selection:text-stone-950 flex flex-col justify-between">
      {/* 1. TOP STUDIO COMMAND BAR */}
      <header className="border-b border-white/10 bg-[#0b0c10]/95 backdrop-blur-xl sticky top-0 z-50 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand + Status Pill */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#e5c07b] flex items-center justify-center text-stone-950 font-black font-mono text-xs shadow-md shadow-amber-500/20">
              HA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial uppercase tracking-wider text-sm font-bold text-white">
                  Studio Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
                {hasUnsavedChanges && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Unsaved
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-stone-400 hidden sm:block">
                Editorial Cover, Photography &amp; Profile Control
              </span>
            </div>
          </div>

          {/* Quick Actions & Save Button */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs font-mono">
            <ThemeToggle />

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 hover:border-[#e5c07b] bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white uppercase tracking-wider text-[11px] transition-all"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#e5c07b]" />
            </Link>

            <button
              onClick={handleReset}
              title="Reset all settings to defaults"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 hover:border-red-400/60 text-stone-400 hover:text-red-400 text-[11px] uppercase tracking-wider transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-r from-[#d4af37] via-[#f3d082] to-[#d4af37] hover:from-[#c5a028] hover:to-[#e5c07b] text-stone-950 text-xs uppercase tracking-widest font-black rounded-md shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSaving ? "Saving..." : "Save (Ctrl+S)"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN STUDIO WORKSPACE */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Workspace Segmented Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <nav className="flex items-center gap-1.5 sm:gap-2 font-mono text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("visuals")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === "visuals"
                  ? "bg-[#e5c07b] text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Cover &amp; Visuals</span>
            </button>

            <button
              onClick={() => setActiveTab("identity")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === "identity"
                  ? "bg-[#e5c07b] text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Identity &amp; Copy</span>
            </button>

            <button
              onClick={() => setActiveTab("sections")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === "sections"
                  ? "bg-[#e5c07b] text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Features &amp; Highlights</span>
            </button>

            <button
              onClick={() => setActiveTab("backup")}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md transition-all cursor-pointer ${
                activeTab === "backup"
                  ? "bg-[#e5c07b] text-stone-950 font-bold shadow-md shadow-amber-500/20"
                  : "text-stone-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Data &amp; Backup</span>
            </button>
          </nav>

          {/* Quick Info & Shortcut Tip */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-stone-500">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-stone-300">Ctrl+S</kbd> anytime to save</span>
          </div>
        </div>

        {/* 3. SPLIT-SCREEN LAYOUT: INSPECTOR (LEFT) & LIVE SIMULATOR (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: ACTIVE TAB INSPECTOR (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* TAB 1: COVER & VISUALS */}
            {activeTab === "visuals" && (
              <div className="space-y-6">
                {/* Upload & Dropzone Card */}
                <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                      <ImageIcon className="w-4 h-4" />
                      <span>Photography &amp; Aspect Ratio</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-[#e5c07b] border border-amber-500/30 font-bold">
                      {detectedMetrics.orientation} &bull; {detectedMetrics.width}&times;{detectedMetrics.height}px
                    </span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? "border-[#e5c07b] bg-[#e5c07b]/10 scale-[1.01]"
                        : "border-white/20 hover:border-[#e5c07b] bg-white/[0.015] hover:bg-white/[0.03]"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-[#e5c07b] text-stone-400 group-hover:text-[#e5c07b] transition-all">
                        <Upload className="w-5 h-5 text-[#e5c07b]" />
                      </div>
                      <span className="text-sm font-semibold text-stone-200">
                        Drop photograph here or click to browse
                      </span>
                      <span className="text-xs text-stone-500 max-w-sm">
                        Automatically compressed &amp; stored to disk. Portrait renders a Left 3D Book &amp; Right Monograph. Landscape renders Fullscreen Cinema.
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Curated Presets */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block font-semibold">
                      Curated Presets (Aspect Ratio Testing):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {samplePresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, coverImage: preset.url }))
                          }
                          className={`p-3 rounded-lg border text-left text-xs font-mono transition-all cursor-pointer ${
                            formData.coverImage === preset.url
                              ? "border-[#e5c07b] bg-[#e5c07b]/15 text-white font-bold shadow-md"
                              : "border-white/10 bg-white/5 text-stone-400 hover:text-white hover:border-white/30"
                          }`}
                        >
                          <span className="block text-[11px] font-medium text-stone-200 truncate">
                            {preset.name}
                          </span>
                          <span className="text-[9px] text-[#e5c07b] uppercase block mt-1">
                            {preset.type} ({preset.ratio})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Framing & Focal Point Card */}
                <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-5 shadow-xl">
                  <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                    <Sliders className="w-4 h-4" />
                    <span>Framing &amp; Focal Alignment</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Object Fit */}
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
                                ? "border-[#e5c07b] bg-[#e5c07b]/15 text-white font-bold"
                                : "border-white/10 bg-white/5 text-stone-400 hover:text-white"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Focal Alignment */}
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
                                ? "border-[#e5c07b] bg-[#e5c07b]/15 text-white font-bold"
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
              </div>
            )}

            {/* TAB 2: IDENTITY & COPY */}
            {activeTab === "identity" && (
              <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Type className="w-4 h-4" />
                  <span>Personal Identity, Headlines &amp; Toggles</span>
                </div>

                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    Display Name
                  </label>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Rendered in bold editorial serif and also powers the background hollow outline watermark.
                  </p>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-sm text-white"
                  />
                </div>

                {/* 2. Tagline */}
                <div className="space-y-1.5 pt-3 border-t border-white/10">
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                    Masthead Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                    }
                    placeholder="e.g. DESIGN · CODE · CREATE"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-mono text-sm text-white"
                  />
                </div>

                {/* 3. Role (With Toggle) */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-[#e5c07b]" />
                      <span>Current Role &amp; Focus</span>
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-sm text-white"
                  />
                </div>

                {/* 4. Location (With Toggle) */}
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

                {/* 5. Where I'm Doing & What (With Toggle) */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-[#e5c07b]" />
                      <span>Academic Background / What I&apos;m Doing</span>
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-sans text-xs text-white"
                  />
                </div>

                {/* 6. Minimalist Statement Quote (With Toggle) */}
                <div className="space-y-2 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-300 font-bold">
                      <Quote className="w-3.5 h-3.5 text-[#e5c07b]" />
                      <span>Minimalist Philosophy Statement</span>
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
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/15 focus:border-[#e5c07b] focus:outline-none font-editorial italic text-sm text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: FEATURES & SECTIONS */}
            {activeTab === "sections" && (
              <div className="space-y-6">
                {/* "What I Do" Card Items */}
                <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                      <Layers className="w-4 h-4" />
                      <span>&ldquo;What I Do&rdquo; Editorial Highlights</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const items = formData.whatIDo || [];
                        const nextNum = (items.length + 1).toString().padStart(2, "0");
                        setFormData((prev) => ({
                          ...prev,
                          whatIDo: [
                            ...(prev.whatIDo || []),
                            {
                              number: nextNum,
                              title: "New Discipline",
                              description: "Brief summary of your focus.",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e5c07b]/15 text-[#e5c07b] hover:bg-[#e5c07b] hover:text-stone-950 font-mono text-[10px] uppercase font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.whatIDo || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={item.number}
                            onChange={(e) => {
                              const updated = [...(formData.whatIDo || [])];
                              updated[idx] = { ...updated[idx], number: e.target.value };
                              setFormData((prev) => ({ ...prev, whatIDo: updated }));
                            }}
                            className="w-12 px-2 py-1 rounded bg-white/5 border border-white/15 font-mono text-xs text-[#e5c07b] text-center font-bold"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...(formData.whatIDo || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData((prev) => ({ ...prev, whatIDo: updated }));
                            }}
                            placeholder="Title (e.g. Design)"
                            className="flex-1 px-3 py-1 rounded bg-white/5 border border-white/15 font-editorial font-bold text-sm text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.whatIDo || []).filter((_, i) => i !== idx);
                              setFormData((prev) => ({ ...prev, whatIDo: updated }));
                            }}
                            className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...(formData.whatIDo || [])];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setFormData((prev) => ({ ...prev, whatIDo: updated }));
                          }}
                          placeholder="Short description of this focus area..."
                          className="w-full px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-sans text-stone-300 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* "Currently Exploring" Card Items */}
                <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>&ldquo;Currently Exploring&rdquo; Roadmap Items</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const items = formData.currentlyExploring || [];
                        const nextNum = (items.length + 1).toString().padStart(2, "0");
                        setFormData((prev) => ({
                          ...prev,
                          currentlyExploring: [
                            ...(prev.currentlyExploring || []),
                            {
                              number: nextNum,
                              title: "New Frontier",
                              description: "Topics currently reading or prototyping.",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e5c07b]/15 text-[#e5c07b] hover:bg-[#e5c07b] hover:text-stone-950 font-mono text-[10px] uppercase font-bold transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.currentlyExploring || []).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <input
                            type="text"
                            value={item.number}
                            onChange={(e) => {
                              const updated = [...(formData.currentlyExploring || [])];
                              updated[idx] = { ...updated[idx], number: e.target.value };
                              setFormData((prev) => ({ ...prev, currentlyExploring: updated }));
                            }}
                            className="w-12 px-2 py-1 rounded bg-white/5 border border-white/15 font-mono text-xs text-[#e5c07b] text-center font-bold"
                          />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const updated = [...(formData.currentlyExploring || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData((prev) => ({ ...prev, currentlyExploring: updated }));
                            }}
                            placeholder="Topic (e.g. Artificial Intelligence)"
                            className="flex-1 px-3 py-1 rounded bg-white/5 border border-white/15 font-editorial font-bold text-sm text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.currentlyExploring || []).filter((_, i) => i !== idx);
                              setFormData((prev) => ({ ...prev, currentlyExploring: updated }));
                            }}
                            className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...(formData.currentlyExploring || [])];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setFormData((prev) => ({ ...prev, currentlyExploring: updated }));
                          }}
                          placeholder="Description of this learning pathway..."
                          className="w-full px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-sans text-stone-300 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: DATA & BACKUP */}
            {activeTab === "backup" && (
              <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 sm:p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                    <FileJson className="w-4 h-4" />
                    <span>JSON State Configuration &amp; Backup</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Disk Path: persistedSettings.json
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Export JSON Backup</span>
                  </button>

                  <button
                    onClick={() => jsonFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 border border-white/15 text-stone-200 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#e5c07b]" />
                    <span>Import JSON File</span>
                  </button>
                  <input
                    ref={jsonFileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportJSONFile}
                    className="hidden"
                  />
                </div>

                {jsonError && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono">
                    {jsonError}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                    <span>Raw JSON Editor</span>
                    <button
                      onClick={handleApplyRawJson}
                      className="text-[#e5c07b] hover:underline font-bold uppercase"
                    >
                      Apply Raw JSON &rarr;
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full p-4 rounded-lg bg-black/60 border border-white/15 font-mono text-xs text-stone-300 focus:outline-none focus:border-[#e5c07b]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DYNAMIC LIVE SIMULATOR CANVAS (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0e1014] border border-white/10 rounded-xl p-5 shadow-2xl space-y-4 sticky top-20">
              {/* Simulator Header & Viewport Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#e5c07b] font-bold">
                  <Eye className="w-4 h-4" />
                  <span>Real-time Simulator</span>
                </div>

                {/* Viewport Selector (Desktop vs Mobile Frame) */}
                <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs font-mono">
                  <button
                    onClick={() => setViewportMode("desktop")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportMode === "desktop"
                        ? "bg-[#e5c07b] text-stone-950 font-bold"
                        : "text-stone-400 hover:text-white"
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportMode("mobile")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportMode === "mobile"
                        ? "bg-[#e5c07b] text-stone-950 font-bold"
                        : "text-stone-400 hover:text-white"
                    }`}
                    title="Smartphone Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Frame Display */}
              <div
                className={`w-full bg-[#07080a] border border-white/10 rounded-lg p-4 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300 ${
                  viewportMode === "mobile"
                    ? "max-w-[270px] mx-auto min-h-[460px] border-stone-700/80 rounded-[28px] shadow-2xl py-6"
                    : "min-h-[400px]"
                }`}
              >
                {/* Mobile Smartphone Notch Simulation */}
                {viewportMode === "mobile" && (
                  <div className="absolute top-2 w-20 h-4 bg-stone-900 rounded-full border border-white/10 z-20 pointer-events-none" />
                )}

                {/* Ambient Radial Spotlight Glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(229,192,123,0.12)_0%,transparent_75%)]" />

                {/* Simulated Hollow Watermark Name */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 select-none">
                  <span
                    className="text-3xl sm:text-4xl font-editorial font-black uppercase tracking-[0.2em] text-center"
                    style={{
                      WebkitTextStroke: "1px rgba(255, 255, 255, 0.35)",
                      color: "transparent",
                    }}
                  >
                    {formData.name}
                  </span>
                </div>

                {/* SIMULATION RENDERING ACCORDING TO ORIENTATION */}
                {detectedMetrics.orientation === "portrait" ? (
                  /* Portrait Simulation: Left 3D Book + Right Spread */
                  <div
                    className={`relative z-10 w-full items-center gap-3 ${
                      viewportMode === "mobile"
                        ? "flex flex-col text-center"
                        : "grid grid-cols-2 text-left"
                    }`}
                  >
                    {/* Simulated 3D Cover Book */}
                    <div
                      style={{
                        boxShadow:
                          "0 20px 45px rgba(0,0,0,0.9), 3px 0 0 #1c1d24, 4px 0 0 #0f1014",
                      }}
                      className={`aspect-[1/1.42] bg-[#0b0c10] border border-white/20 rounded-[2px] overflow-hidden ${
                        viewportMode === "mobile" ? "w-[150px] mx-auto mb-2" : "w-full"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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
                        className="w-full h-full object-cover filter contrast-[1.04]"
                      />
                    </div>

                    {/* Simulated Right Spread Info */}
                    <div className="space-y-2">
                      <div className="text-[9px] font-mono text-[#e5c07b] font-bold uppercase tracking-widest">
                        {formData.tagline || "DESIGN · CODE · CREATE"}
                      </div>
                      <h4 className="text-sm font-editorial font-black uppercase text-white tracking-wider leading-tight">
                        {formData.name}
                      </h4>
                      {formData.showRole !== false && (
                        <p className="text-[10px] text-stone-300 font-sans line-clamp-1">
                          {formData.role || formData.subrole}
                        </p>
                      )}
                      {formData.showLocation !== false && (
                        <div className="text-[9px] font-mono text-[#e5c07b] flex items-center gap-1 justify-start">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{formData.location}</span>
                        </div>
                      )}
                      {formData.showWhereAndWhat !== false && (
                        <p className="text-[9px] font-mono text-stone-400 line-clamp-2">
                          {formData.whereAndWhat}
                        </p>
                      )}
                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#e5c07b] text-stone-950 text-[9px] font-mono font-bold uppercase tracking-wider">
                          OPEN MAGAZINE &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Landscape Simulation: Widescreen Cinema Mode (No Bento Box) */
                  <div
                    style={{
                      boxShadow:
                        "0 25px 60px rgba(0,0,0,0.9), 3px 1px 0 #1c1d24, 5px 2px 0 #0f1014",
                    }}
                    className="relative z-10 w-full max-w-[320px] aspect-[16/10] bg-[#0b0c10] border border-white/20 rounded-[2px] overflow-hidden group shadow-2xl flex flex-col justify-between p-3"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      className="absolute inset-0 w-full h-full filter contrast-[1.03] saturate-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex justify-between items-center text-[8px] font-mono uppercase text-white/70">
                      <span>{formData.name}</span>
                      {formData.showLocation !== false && <span>{formData.location}</span>}
                    </div>

                    <div className="relative z-10 text-center space-y-0.5">
                      <h4 className="text-xs font-editorial font-black uppercase text-white tracking-wider leading-tight">
                        {formData.name}
                      </h4>
                      {formData.showRole !== false && (
                        <p className="text-[9px] text-stone-200 font-sans line-clamp-1">
                          {formData.role || formData.subrole}
                        </p>
                      )}
                      <div className="pt-1 flex items-center justify-center gap-1.5 text-[8px] font-mono text-stone-300">
                        <span className="border-b border-white/40 pb-0.5">OPEN</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Pills Summary */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-stone-400 pt-1">
                <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span>Role:</span>
                  <span className={formData.showRole !== false ? "text-emerald-400 font-bold" : "text-stone-500"}>
                    {formData.showRole !== false ? "VISIBLE" : "HIDDEN"}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span>Location:</span>
                  <span className={formData.showLocation !== false ? "text-emerald-400 font-bold" : "text-stone-500"}>
                    {formData.showLocation !== false ? "VISIBLE" : "HIDDEN"}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span>Academics:</span>
                  <span className={formData.showWhereAndWhat !== false ? "text-emerald-400 font-bold" : "text-stone-500"}>
                    {formData.showWhereAndWhat !== false ? "VISIBLE" : "HIDDEN"}
                  </span>
                </div>
                <div className="p-2 rounded bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <span>Quote:</span>
                  <span className={formData.showStatement !== false ? "text-emerald-400 font-bold" : "text-stone-500"}>
                    {formData.showStatement !== false ? "VISIBLE" : "HIDDEN"}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#f3d082] to-[#d4af37] hover:from-[#c5a028] hover:to-[#e5c07b] text-stone-950 font-mono text-xs uppercase tracking-widest font-black rounded-md shadow-xl active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Saving to Disk..." : "Save & Publish to Live Portfolio"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 4. SUCCESS TOAST ALERT */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-widest shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
          <span>Saved to Server Disk &amp; Live Site!</span>
        </div>
      )}
    </div>
  );
}