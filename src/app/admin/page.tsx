"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Unlock,
  Save,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sliders,
  FolderCode,
  Folder,
  Terminal,
  Award,
  GraduationCap,
  Send,
  User,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Layers,
  Code2,
  Brain,
  Laptop,
  FolderGit2,
  Database,
  Cpu,
  Globe,
  MapPin,
  ShieldCheck,
  KeyRound,
  Clock,
  Menu,
  X,
  Palette,
  Type,
  Eraser,
  Check,
  RotateCcw,
  Briefcase,
  Building2,
  Calendar,
  Mail,
  Trophy,
  BookOpen,
  FileText,
  Lightbulb,
  Mic,
  Rocket,
  Newspaper,
  Bookmark,
  Download,
  Upload,
  ZoomIn,
  Move,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project, Certificate, LaurelItem, PortfolioData, TimelineMilestone, Experience, DailyThought, DEFAULT_DAILY_THOUGHTS, resolveDailyThoughtColor, DEFAULT_DAY_PERSONA_COLORS } from "@/data/portfolioData";
import {
  FormattedHighlightedText,
  getBenchmarkStickerTheme,
  BENCHMARK_STICKER_COLOR_MAP,
  SKILL_CARD_COLOR_MAP,
  renderSkillIcon,
} from "@/components/sections/AboutSection";
import {
  extractGoogleDriveId,
  isGoogleDriveUrl,
  formatGoogleDriveImageUrl,
  formatGoogleDriveThumbnailUrl,
  formatGoogleDriveViewUrl,
} from "@/lib/googleDrive";
import { resolveRoleTrack, ROLE_TRACK_THEMES } from "@/lib/roleTrack";
import { MILESTONE_STATUS_PRESETS, resolveMilestoneStatus } from "@/lib/milestoneStatus";
import { extractVibrantColor, extractPhotoPalette, PhotoPalette, DEFAULT_PHOTO_PALETTE } from "@/lib/colorExtractor";
import { compressImageFile } from "@/lib/imageCompressor";
import { supabase } from "@/lib/supabase";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const DEFAULT_PROJECT_CATS: string[] = [];

const DEFAULT_CERT_CATS: string[] = [];

const ADMIN_PALETTE_COLORS = [
  { id: "amber", name: "Amber", hex: "#f59e0b", bg: "bg-amber-400" },
  { id: "emerald", name: "Emerald", hex: "#10b981", bg: "bg-emerald-400" },
  { id: "indigo", name: "Indigo", hex: "#6366f1", bg: "bg-indigo-400" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4", bg: "bg-cyan-400" },
  { id: "rose", name: "Rose", hex: "#f43f5e", bg: "bg-rose-400" },
  { id: "purple", name: "Purple", hex: "#8b5cf6", bg: "bg-purple-400" },
  { id: "orange", name: "Orange", hex: "#f97316", bg: "bg-orange-400" },
  { id: "teal", name: "Teal", hex: "#14b8a6", bg: "bg-teal-400" },
];

const SKILL_ICON_PRESETS = [
  { id: "code", label: "Code", emoji: "💻" },
  { id: "brain", label: "AI / Brain", emoji: "🧠" },
  { id: "laptop", label: "Laptop", emoji: "💻" },
  { id: "terminal", label: "Terminal", emoji: "⌨️" },
  { id: "git", label: "Git", emoji: "🔀" },
  { id: "database", label: "Database", emoji: "🗄️" },
  { id: "cpu", label: "CPU / Chip", emoji: "⚡" },
  { id: "sparkles", label: "Sparkles", emoji: "✨" },
  { id: "book", label: "Theory / Book", emoji: "📚" },
  { id: "globe", label: "Web / Globe", emoji: "🌐" },
];

interface PhotoFramingControlsProps {
  label?: string;
  zoom?: number;
  positionX?: number;
  positionY?: number;
  onChange: (updates: { zoom?: number; positionX?: number; positionY?: number }) => void;
  onReset: () => void;
}

function PhotoFramingControls({
  label = "Photo Framing & Focal Adjustments",
  zoom = 1,
  positionX = 50,
  positionY = 20,
  onChange,
  onReset,
}: PhotoFramingControlsProps) {
  const currentZoom = typeof zoom === "number" && !isNaN(zoom) ? zoom : 1;
  const currentPosX = typeof positionX === "number" && !isNaN(positionX) ? positionX : 50;
  const currentPosY = typeof positionY === "number" && !isNaN(positionY) ? positionY : 20;

  return (
    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-xs space-y-3.5 my-3">
      <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <span className="font-mono text-xs font-black uppercase text-stone-900 tracking-wide">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300 font-bold">
          <span>Zoom: {Math.round(currentZoom * 100)}%</span>
          <span>•</span>
          <span>X: {currentPosX}%</span>
          <span>•</span>
          <span>Y: {currentPosY}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {/* Zoom / Scale Control */}
        <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-stone-500" />
              Scale / Zoom
            </span>
            <span className="font-mono text-[10.5px] font-black text-amber-700">
              {currentZoom.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="2.2"
            step="0.05"
            value={currentZoom}
            onChange={(e) => onChange({ zoom: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {[0.9, 1.0, 1.2, 1.4].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => onChange({ zoom: z })}
                className={`flex-1 py-1 px-1 rounded text-[9.5px] font-mono font-bold transition-all ${
                  Math.abs(currentZoom - z) < 0.03
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Position (Y-Axis) */}
        <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-stone-500" />
              Vertical Pan (Y)
            </span>
            <span className="font-mono text-[10.5px] font-black text-amber-700">
              {currentPosY}% {currentPosY <= 20 ? "(Top)" : currentPosY >= 70 ? "(Bottom)" : "(Mid)"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={currentPosY}
            onChange={(e) => onChange({ positionY: parseInt(e.target.value, 10) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {[
              { label: "Top (10%)", val: 10 },
              { label: "Upper (25%)", val: 25 },
              { label: "Mid (50%)", val: 50 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => onChange({ positionY: p.val })}
                className={`flex-1 py-1 px-1 rounded text-[9px] font-mono font-bold transition-all ${
                  Math.abs(currentPosY - p.val) <= 5
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Position (X-Axis) */}
        <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-stone-700 flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-stone-500" />
              Horizontal Pan (X)
            </span>
            <span className="font-mono text-[10.5px] font-black text-amber-700">
              {currentPosX}% {currentPosX <= 30 ? "(Left)" : currentPosX >= 70 ? "(Right)" : "(Center)"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={currentPosX}
            onChange={(e) => onChange({ positionX: parseInt(e.target.value, 10) })}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex items-center justify-between gap-1 pt-0.5">
            {[
              { label: "Left (30%)", val: 30 },
              { label: "Center (50%)", val: 50 },
              { label: "Right (70%)", val: 70 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => onChange({ positionX: p.val })}
                className={`flex-1 py-1 px-1 rounded text-[9px] font-mono font-bold transition-all ${
                  Math.abs(currentPosX - p.val) <= 5
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Framing Presets & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/50">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-mono text-[10px] font-bold text-stone-500 uppercase">Presets:</span>
          <button
            type="button"
            onClick={() => onChange({ zoom: 1.05, positionX: 50, positionY: 10 })}
            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-black font-mono text-[10px] font-bold text-stone-800 transition-all cursor-pointer shadow-xs"
          >
            👤 Headshot Top
          </button>
          <button
            type="button"
            onClick={() => onChange({ zoom: 1.0, positionX: 50, positionY: 25 })}
            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-black font-mono text-[10px] font-bold text-stone-800 transition-all cursor-pointer shadow-xs"
          >
            👔 Upper Torso
          </button>
          <button
            type="button"
            onClick={() => onChange({ zoom: 1.0, positionX: 50, positionY: 50 })}
            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-black font-mono text-[10px] font-bold text-stone-800 transition-all cursor-pointer shadow-xs"
          >
            🎯 Centered
          </button>
          <button
            type="button"
            onClick={() => onChange({ zoom: 1.25, positionX: 50, positionY: 15 })}
            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-black font-mono text-[10px] font-bold text-stone-800 transition-all cursor-pointer shadow-xs"
          >
            🔍 Portrait Zoom (1.25x)
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 font-mono text-[10px] font-bold text-stone-700 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-stone-500" />
          <span>Reset Framing</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data: initialData, updateData, refreshData } = usePortfolio();

  // Enforce Light Theme strictly on Admin Console & set tab title
  useEffect(() => {
    document.title = "Harsh Aryan | ADMIN";
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    refreshData();
  }, []);

  // Auth State (Exclusively Google OAuth 2.0)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [inactivityNotice, setInactivityNotice] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS Form State & Smart Initialization
  const [portfolio, setPortfolioState] = useState<PortfolioData>(initialData);
  const isFormInitializedRef = React.useRef(false);
  const isDirtyRef = React.useRef(false);
  const portfolioRef = React.useRef<PortfolioData>(portfolio);
  portfolioRef.current = portfolio;

  const setPortfolio: React.Dispatch<React.SetStateAction<PortfolioData>> = React.useCallback((action) => {
    isDirtyRef.current = true;
    setPortfolioState(action);
  }, []);

  // Seamlessly populate form with real stored data on mount or when remote data syncs
  useEffect(() => {
    if (initialData && initialData.personal) {
      if (!isFormInitializedRef.current) {
        setPortfolioState(initialData);
        portfolioRef.current = initialData;
        isFormInitializedRef.current = true;
      } else if (!isDirtyRef.current) {
        const currentSavedTime = (portfolioRef.current as any)?._lastSavedAt || 0;
        const incomingSavedTime = (initialData as any)?._lastSavedAt || 0;
        if (incomingSavedTime > currentSavedTime) {
          setPortfolioState(initialData);
          portfolioRef.current = initialData;
        }
      }
    }
  }, [initialData]);
  type AdminTab = "inquiries" | "sublines" | "cover" | "badges" | "about" | "experience" | "milestones" | "highlights" | "projects" | "certificates" | "skills" | "contact";
  const [activeTab, setActiveTab] = useState<AdminTab>("sublines");
  const [sublinesSectionFilter, setSublinesSectionFilter] = useState<"all" | "about" | "projects" | "certificates" | "experience">("all");
  const [expSkillsInputMap, setExpSkillsInputMap] = useState<Record<string, string>>({});
  const [coverSubView, setCoverSubView] = useState<"desktop" | "mobile">("desktop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [coverAccentColor, setCoverAccentColor] = useState<string>("#facc15");

  useEffect(() => {
    const photo = formatGoogleDriveImageUrl(portfolio.personal?.coverPhotoUrl);
    extractVibrantColor(photo, "#facc15").then(setCoverAccentColor);
  }, [portfolio.personal?.coverPhotoUrl]);

// Highlights & Milestones have their own dedicated top-level tabs now.

  // Category Management Inputs
  const [newProjectCatInput, setNewProjectCatInput] = useState("");
  const [newCertCatInput, setNewCertCatInput] = useState("");

  // About Skills & Highlighter Refs
  const bioTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const headlineInputRef = React.useRef<HTMLInputElement>(null);
  const [newSkillCatName, setNewSkillCatName] = useState("");
  const [skillTagInputs, setSkillTagInputs] = useState<Record<number, string>>({});

  // ── Arbitrary Color Highlighter & Selection Management ──
  const [highlighterColor, setHighlighterColor] = useState<string>("#f59e0b");
  const [selectedTarget, setSelectedTarget] = useState<{
    field: "headline" | "bio";
    text: string;
    start: number;
    end: number;
  } | null>(null);
  const [aboutSubView, setAboutSubView] = useState<"all" | "identity" | "bio">("all");
  const [expStationFilter, setExpStationFilter] = useState<"all" | "current" | "past">("all");
  const [contactSubTab, setContactSubTab] = useState<"all" | "coordinates" | "copy" | "form" | "footer">("all");
  const [inquiriesSearchQuery, setInquiriesSearchQuery] = useState("");
  const [inquiriesCategoryFilter, setInquiriesCategoryFilter] = useState("all");
  const [selectedThoughtDay, setSelectedThoughtDay] = useState<number>(0);
  const [todayWeekday, setTodayWeekday] = useState<number>(0);
  const [thoughtViewMode, setThoughtViewMode] = useState<"tabs" | "grid">("tabs");
  const [newKeywordInput, setNewKeywordInput] = useState<string>("");

  // ── "Click to Edit" State Modes (Only edit after clicking "Edit") ──
  const [editingSublines, setEditingSublines] = useState<Record<string, boolean>>({});
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);
  const [editingMilestoneIdx, setEditingMilestoneIdx] = useState<number | null>(null);
  const [editingStatIdx, setEditingStatIdx] = useState<number | null>(null);
  const [editingSkillCatIdx, setEditingSkillCatIdx] = useState<number | null>(null);
  const [isEditingCoverTexts, setIsEditingCoverTexts] = useState<boolean>(false);
  const [isEditingPhotoCard, setIsEditingPhotoCard] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [isEditingContactTexts, setIsEditingContactTexts] = useState<boolean>(false);

  useEffect(() => {
    const day = new Date().getDay();
    setTodayWeekday(day);
    setSelectedThoughtDay(day);
  }, []);

  // ── Curated Portfolio Color Palette & Selection Tracking ──
  const PORTFOLIO_HIGHLIGHT_PALETTE = [
    { name: "Coral", hex: "#f43f5e", label: "Spark Red" },
    { name: "Amber", hex: "#f59e0b", label: "Brand Gold" },
    { name: "Cyan", hex: "#06b6d4", label: "Sci-Comp Blue" },
    { name: "Emerald", hex: "#10b981", label: "Terminal Green" },
    { name: "Indigo", hex: "#6366f1", label: "AI Violet" },
    { name: "Orange", hex: "#f97316", label: "Sun Orange" },
  ];
  const HIGHLIGHT_PALETTE = PORTFOLIO_HIGHLIGHT_PALETTE;

  const lastSelectionRef = React.useRef<{
    field: "headline" | "bio";
    start: number;
    end: number;
    text: string;
  } | null>(null);

  const handleSelectionCapture = (
    field: "headline" | "bio",
    el: HTMLInputElement | HTMLTextAreaElement | null
  ) => {
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (start < end) {
      const text = el.value.substring(start, end);
      lastSelectionRef.current = { field, start, end, text };
      setSelectedTarget({ field, start, end, text });
    }
  };

  const applyColorHighlight = (
    field: "headline" | "bio",
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
    color: string
  ) => {
    const el = ref.current;
    const currentVal = portfolio.personal[field] || "";
    let start = el && el.selectionStart !== null ? el.selectionStart : 0;
    let end = el && el.selectionEnd !== null ? el.selectionEnd : 0;

    // Retrieve from persistent selection ref if input lost focus
    if (start === end && lastSelectionRef.current && lastSelectionRef.current.field === field) {
      start = lastSelectionRef.current.start;
      end = lastSelectionRef.current.end;
    } else if (start === end && selectedTarget && selectedTarget.field === field && selectedTarget.start < selectedTarget.end) {
      start = selectedTarget.start;
      end = selectedTarget.end;
    }

    if (start === end) {
      setToastMessage("👉 Pehle koi text select karein, fir color click karein!");
      setTimeout(() => setToastMessage(null), 3000);
      if (el) el.focus();
      return;
    }

    const rawSelected = currentVal.substring(start, end);
    // Strip existing highlight tags if re-highlighting
    const clean = rawSelected
      .replace(/^\{\{#[0-9a-fA-F]{3,8}\|(.+?)\}\}$/, "$1")
      .replace(/^==(.+?)==$/, "$1")
      .replace(/^\^\^(.+?)\^\^$/, "$1")
      .replace(/^\*\*(.+?)\*\*$/, "$1");

    const replacement = `{{${color}|${clean}}}`;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    const updatedPersonal = { ...portfolio.personal, [field]: nextVal };
    const updated = { ...portfolio, personal: updatedPersonal };
    setPortfolio(updated);
    portfolioRef.current = updated;

    const newEnd = start + replacement.length;
    lastSelectionRef.current = { field, text: clean, start, end: newEnd };
    setSelectedTarget({
      field,
      text: clean,
      start,
      end: newEnd,
    });

    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(start, newEnd);
      }
    }, 10);
  };

  const applyFormatToSelection = (
    field: "headline" | "bio",
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
    mode: "bold" | "clear"
  ) => {
    const el = ref.current;
    const currentVal = portfolio.personal[field] || "";
    let start = el && el.selectionStart !== null ? el.selectionStart : 0;
    let end = el && el.selectionEnd !== null ? el.selectionEnd : 0;

    if (start === end && lastSelectionRef.current && lastSelectionRef.current.field === field) {
      start = lastSelectionRef.current.start;
      end = lastSelectionRef.current.end;
    } else if (start === end && selectedTarget && selectedTarget.field === field && selectedTarget.start < selectedTarget.end) {
      start = selectedTarget.start;
      end = selectedTarget.end;
    }

    if (start === end) {
      setToastMessage(mode === "bold" ? "👉 Pehle text select karein jise bold karna hai!" : "👉 Pehle text select karein jise clear karna hai!");
      setTimeout(() => setToastMessage(null), 3000);
      if (el) el.focus();
      return;
    }

    const rawSelected = currentVal.substring(start, end);
    const clean = rawSelected
      .replace(/\{\{#[0-9a-fA-F]{3,8}\|(.+?)\}\}/g, "$1")
      .replace(/==(.+?)==/g, "$1")
      .replace(/\^\^(.+?)\^\^/g, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1");

    const replacement = mode === "bold" ? `**${clean}**` : clean;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    const updatedPersonal = { ...portfolio.personal, [field]: nextVal };
    const updated = { ...portfolio, personal: updatedPersonal };
    setPortfolio(updated);
    portfolioRef.current = updated;

    const newEnd = start + replacement.length;
    lastSelectionRef.current = { field, text: clean, start, end: newEnd };
    if (mode === "clear") {
      setSelectedTarget(null);
    } else {
      setSelectedTarget({
        field,
        text: clean,
        start,
        end: newEnd,
      });
    }

    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(start, newEnd);
      }
    }, 10);
  };

  const wrapTextSelection = (
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
    prefix: string,
    suffix: string,
    defaultText: string,
    currentValue: string,
    setter: (val: string) => void
  ) => {
    const el = ref.current;
    if (!el) {
      setter(currentValue ? (currentValue + " " + prefix + defaultText + suffix) : (prefix + defaultText + suffix));
      return;
    }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = currentValue.substring(start, end);
    const replacement = selected ? (prefix + selected + suffix) : (prefix + defaultText + suffix);
    const nextVal = currentValue.substring(0, start) + replacement + currentValue.substring(end);
    setter(nextVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : defaultText.length));
    }, 0);
  };

  // Quick Stats Capsule Handlers
  const handleAddQuickStat = () => {
    const base = portfolioRef.current || portfolio;
    const currentList = base.quickStats || [];
    const nextIndex = currentList.length;
    const paletteKeys = ["amber", "emerald", "cyan", "rose", "purple", "indigo", "orange", "teal"];
    const nextColor = paletteKeys[nextIndex % paletteKeys.length];
    const defaultIcons = ["✨", "⚡", "🏆", "🔥", "🚀", "💡", "🎯", "🔬"];
    const nextIcon = defaultIcons[nextIndex % defaultIcons.length];
    const defaultTags = ["SPECIALTY", "PROJECTS", "HONORS", "SOLVED", "METRICS", "INSIGHTS", "GOALS", "RESEARCH"];
    const nextTag = defaultTags[nextIndex % defaultTags.length];

    const nextPort = {
      ...base,
      quickStats: [
        ...currentList,
        {
          value: "10+",
          label: "New Benchmark",
          sublabel: "Metric details & highlights",
          tag: nextTag,
          icon: nextIcon,
          color: nextColor,
        },
      ],
    };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    setEditingStatIdx(currentList.length);
    saveInstantly(nextPort, "Added new benchmark capsule!");
  };

  const handleRemoveQuickStat = (index: number) => {
    if (editingStatIdx === index) setEditingStatIdx(null);
    const base = portfolioRef.current || portfolio;
    const nextPort = {
      ...base,
      quickStats: (base.quickStats || []).filter((_, i) => i !== index),
    };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Benchmark capsule removed.");
  };

  const handleUpdateQuickStat = (
    index: number,
    field: "value" | "label" | "sublabel" | "tag" | "icon" | "color",
    val: string
  ) => {
    setPortfolio((prev) => {
      const updated = [...(prev.quickStats || [])];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, quickStats: updated };
    });
  };

  // ── Experience Handlers ──
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: "exp-" + Date.now(),
      role: "New Role Title",
      company: "Company or Institution",
      companyUrl: "",
      location: "City, Country",
      period: "2025 – Present",
      type: "Academic & Mentorship",
      isCurrent: true,
      description: "Brief overview of responsibilities and scope in this role.",
      highlights: ["Key achievement or project contribution."],
      skillsUsed: ["Python", "Problem Solving"],
    };
    const base = portfolioRef.current || portfolio;
    const nextPort = {
      ...base,
      experiences: [...(base.experiences || []), newExp],
    };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    setEditingExpIndex((base.experiences || []).length);
    saveInstantly(nextPort, "Added new experience entry!");
  };

  const handleRemoveExperience = (idx: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    if (editingExpIndex === idx) setEditingExpIndex(null);
    const base = portfolioRef.current || portfolio;
    const nextPort = {
      ...base,
      experiences: (base.experiences || []).filter((_, i) => i !== idx),
    };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Experience entry deleted.");
  };

  const handleMoveExperience = (idx: number, direction: "up" | "down") => {
    const base = portfolioRef.current || portfolio;
    const list = [...(base.experiences || [])];
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[idx];
    list[idx] = list[target];
    list[target] = temp;
    const nextPort = { ...base, experiences: list };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Experiences reordered!");
  };

  const handleUpdateExperience = (idx: number, field: keyof Experience, val: any) => {
    setPortfolio((prev) => {
      const list = [...(prev.experiences || [])];
      list[idx] = { ...list[idx], [field]: val };
      return { ...prev, experiences: list };
    });
  };

  const handleAddExperienceHighlight = (expIdx: number) => {
    setPortfolio((prev) => {
      const list = [...(prev.experiences || [])];
      const currentH = list[expIdx].highlights || [];
      list[expIdx] = {
        ...list[expIdx],
        highlights: [...currentH, "Key achievement or project impact."],
      };
      return { ...prev, experiences: list };
    });
  };

  const handleRemoveExperienceHighlight = (expIdx: number, hIdx: number) => {
    setPortfolio((prev) => {
      const list = [...(prev.experiences || [])];
      const currentH = (list[expIdx].highlights || []).filter((_, i) => i !== hIdx);
      list[expIdx] = { ...list[expIdx], highlights: currentH };
      return { ...prev, experiences: list };
    });
  };

  const handleUpdateExperienceHighlight = (expIdx: number, hIdx: number, val: string) => {
    setPortfolio((prev) => {
      const list = [...(prev.experiences || [])];
      const currentH = [...(list[expIdx].highlights || [])];
      currentH[hIdx] = val;
      list[expIdx] = { ...list[expIdx], highlights: currentH };
      return { ...prev, experiences: list };
    });
  };

  const handleMoveQuickStat = (index: number, direction: "up" | "down") => {
    const base = portfolioRef.current || portfolio;
    const updated = [...(base.quickStats || [])];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    const nextPort = { ...base, quickStats: updated };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Benchmarks reordered!");
  };

  // Skills Handlers
  const handleAddSkillItem = (catIdx: number, item: string) => {
    if (!item.trim()) return;
    const base = portfolioRef.current || portfolio;
    const currentSkills = [...(base.skills || [])];
    if (!currentSkills[catIdx]) return;
    currentSkills[catIdx] = {
      ...currentSkills[catIdx],
      items: [...(currentSkills[catIdx].items || []), item.trim()],
    };
    const newPort = { ...base, skills: currentSkills };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    setSkillTagInputs((prev) => ({ ...prev, [catIdx]: "" }));
    saveInstantly(newPort, `Added "${item.trim()}"`);
  };

  const handleRemoveSkillItem = (catIdx: number, itemIdx: number) => {
    const base = portfolioRef.current || portfolio;
    const currentSkills = [...(base.skills || [])];
    if (!currentSkills[catIdx]) return;
    currentSkills[catIdx] = {
      ...currentSkills[catIdx],
      items: (currentSkills[catIdx].items || []).filter((_, i) => i !== itemIdx),
    };
    const newPort = { ...base, skills: currentSkills };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    saveInstantly(newPort, "Skill removed");
  };

  const handleAddSkillCategory = () => {
    if (!newSkillCatName.trim()) return;
    const base = portfolioRef.current || portfolio;
    const colors = ["amber", "emerald", "indigo", "cyan", "rose", "purple", "orange", "teal"];
    const icons = ["code", "brain", "laptop", "terminal", "git", "database", "cpu", "sparkles"];
    const idx = (base.skills || []).length;
    const newPort = {
      ...base,
      skills: [
        ...(base.skills || []),
        {
          category: newSkillCatName.trim(),
          items: [],
          color: colors[idx % colors.length],
          icon: icons[idx % icons.length],
        },
      ],
    };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    setNewSkillCatName("");
    saveInstantly(newPort, `Added category "${newSkillCatName.trim()}"`);
  };

  const handleMoveSkillCategory = (catIdx: number, direction: "up" | "down") => {
    const base = portfolioRef.current || portfolio;
    const list = [...(base.skills || [])];
    const targetIdx = direction === "up" ? catIdx - 1 : catIdx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[catIdx];
    list[catIdx] = list[targetIdx];
    list[targetIdx] = temp;
    const newPort = {
      ...base,
      skills: list,
    };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    saveInstantly(newPort, `Reordered skills`);
  };

  const handleRemoveSkillCategory = (catIdx: number) => {
    if (!confirm("Are you sure you want to delete this skills category?")) return;
    const base = portfolioRef.current || portfolio;
    const catName = base.skills?.[catIdx]?.category || "";
    const newPort = {
      ...base,
      skills: (base.skills || []).filter((_, i) => i !== catIdx),
    };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    saveInstantly(newPort, `Deleted category "${catName}"`);
  };

  // Milestones Handlers
  const handleAddMilestone = () => {
    const base = portfolioRef.current || portfolio;
    const current = base.milestones && base.milestones.length > 0 ? [...base.milestones] : [
      { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
      { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
      { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
    ];
    const nextNum = current.length + 1;
    const newMilestone: TimelineMilestone = {
      phaseNumber: String(nextNum).padStart(2, "0"),
      period: `Phase ${nextNum}`,
      title: "New Trajectory Phase",
      subtitle: "Key Focus & Technologies",
      description: "Describe the key focus, achievements, algorithms, or systems built in this phase.",
      status: "next",
      statusLabel: "NEXT HORIZON 🚀",
    };
    const nextPort = { ...base, milestones: [...current, newMilestone] };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    setEditingMilestoneIdx(current.length);
    saveInstantly(nextPort, `Added Phase ${newMilestone.phaseNumber} to Trajectory!`);
  };

  const handleRemoveMilestone = (index: number) => {
    if (!confirm("Are you sure you want to remove this trajectory phase?")) return;
    if (editingMilestoneIdx === index) setEditingMilestoneIdx(null);
    const base = portfolioRef.current || portfolio;
    const current = base.milestones && base.milestones.length > 0 ? [...base.milestones] : [
      { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
      { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
      { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
    ];
    const filtered = current.filter((_, i) => i !== index);
    const reindexed = filtered.map((m, idx) => ({
      ...m,
      phaseNumber: String(idx + 1).padStart(2, "0"),
    }));
    const nextPort = { ...base, milestones: reindexed };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Trajectory phase removed.");
  };

  const handleMoveMilestone = (index: number, direction: "up" | "down") => {
    const base = portfolioRef.current || portfolio;
    const current = base.milestones && base.milestones.length > 0 ? [...base.milestones] : [
      { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
      { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
      { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
    ];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const updated = [...current];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const reindexed = updated.map((m, idx) => ({
      ...m,
      phaseNumber: String(idx + 1).padStart(2, "0"),
    }));
    const nextPort = { ...base, milestones: reindexed };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    saveInstantly(nextPort, "Trajectory phases reordered!");
  };

  const handleUpdateMilestone = (index: number, field: string, val: string) => {
    setPortfolio((prev) => {
      const current = prev.milestones && prev.milestones.length > 0 ? [...prev.milestones] : [
        { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
        { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
        { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
      ];
      current[index] = { ...current[index], [field]: val };
      return { ...prev, milestones: current };
    });
  };

  // Messages Inbox State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Project Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<Project>({
    id: "",
    title: "",
    tagline: "",
    description: "",
    category: "Machine Learning",
    technologies: [],
    metrics: [],
    features: [],
    githubUrl: "",
    liveUrl: "",
    imageGradient: "from-amber-400 to-orange-500",
    color: "amber",
  });
  const [customProjectCat, setCustomProjectCat] = useState("");
  const [techInput, setTechInput] = useState("");
  const [metricInput, setMetricInput] = useState("");

  // Certificate Modal State
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certForm, setCertForm] = useState<Certificate>({
    id: "",
    title: "",
    issuer: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
    imageUrl: "",
    category: "Machine Learning",
    skillsLearned: [],
    description: "",
    verificationSource: "",
    color: "amber",
  });
  const [customCertCat, setCustomCertCat] = useState("");
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [driveInput, setDriveInput] = useState("");
  const [driveFeedback, setDriveFeedback] = useState<string | null>(null);

  // Laurel / Research Paper / Book Modal State
  const [editingLaurel, setEditingLaurel] = useState<LaurelItem | null>(null);
  const [isLaurelModalOpen, setIsLaurelModalOpen] = useState(false);
  const [laurelAdminFilter, setLaurelAdminFilter] = useState<"all" | "award" | "paper" | "book">("all");
  const [laurelForm, setLaurelForm] = useState<LaurelItem>({
    id: "",
    type: "award",
    title: "",
    issuerOrPublisher: "",
    date: "2026",
    roleOrAward: "",
    link: "",
    description: "",
    badge: "",
    imageUrl: "",
    isVisible: true,
    color: "amber",
  });

  // Sync state when initialData arrives from server/context
  useEffect(() => {
    if (initialData && initialData.personal) {
      setPortfolio({
        ...initialData,
        projectCategories: initialData.projectCategories !== undefined
          ? initialData.projectCategories
          : DEFAULT_PROJECT_CATS,
        certificateCategories: initialData.certificateCategories !== undefined
          ? initialData.certificateCategories
          : DEFAULT_CERT_CATS,
        laurelItems: initialData.laurelItems || [],
      });
    }
  }, [initialData]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const json = await res.json();
        setIsAuthenticated(Boolean(json.authenticated));
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch contact messages when tab is selected or authenticated
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("timestamp", { ascending: false });
        if (!error && Array.isArray(data)) {
          setMessages(data);
          setIsLoadingMessages(false);
          return;
        }
      }
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.messages) {
        setMessages(json.messages);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry? This cannot be undone.")) return;
    try {
      // 1. Direct Supabase Cloud Delete
      if (supabase) {
        await supabase.from("contact_messages").delete().eq("id", id);
      }
      // 2. Server API sync
      await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setToastMessage("✓ Inquiry deleted from Supabase cloud!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting inquiry.");
    }
  };

  const handleClearAllMessages = async () => {
    if (!confirm("Are you sure you want to clear ALL inquiries? This action cannot be undone.")) return;
    try {
      // 1. Direct Supabase Cloud Delete
      if (supabase) {
        await supabase.from("contact_messages").delete().neq("id", "");
      }
      // 2. Server API sync
      await fetch(`/api/contact?id=all`, {
        method: "DELETE",
      });
      setMessages([]);
      setToastMessage("✓ All inquiries cleared from Supabase cloud!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Clear error", err);
      alert("Error clearing inquiries.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab]);

  // Handle Logout (Memoized and declared before effects)
  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  // ── INACTIVITY AUTO-LOGOUT (15 Minutes of Inactivity) ──
  useEffect(() => {
    if (!isAuthenticated) return;

    let lastInteraction = Date.now();
    const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

    const recordActivity = () => {
      lastInteraction = Date.now();
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel", "click"];
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }));

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastInteraction;
      if (elapsed >= INACTIVITY_LIMIT_MS) {
        handleLogout();
        setInactivityNotice("Session expired: Admin Console automatically logged out due to 15 minutes of inactivity.");
      }
    }, 5000); // Check every 5s

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity));
      clearInterval(interval);
    };
  }, [isAuthenticated, handleLogout]);

  // ── Google OAuth Sign-In (Exclusively Restricted to Harsh Aryan's Google Account) ──
  const googleBtnRef = React.useRef<HTMLDivElement>(null);

  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setIsLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        await refreshData();
      } else {
        setAuthError(data.error || "Google authentication failed.");
      }
    } catch {
      setAuthError("Failed to authenticate with Google. Please check network connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) return;
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "991231055777-u46rvuq7lu46d2jqa8i2o94uv6vo5g04.apps.googleusercontent.com";

    let retryTimer: NodeJS.Timeout | null = null;

    const renderGoogleBtn = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !googleBtnRef.current) return false;

      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        googleBtnRef.current.innerHTML = "";
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: "continue_with",
          shape: "pill",
        });
        return true;
      } catch (err) {
        console.warn("GSI render error:", err);
        return false;
      }
    };

    // Load GIS script if not present
    let script = document.querySelector('script[src*="accounts.google.com/gsi/client"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    // Polling retry to ensure button renders immediately once googleBtnRef is mounted in DOM
    let attempts = 0;
    retryTimer = setInterval(() => {
      attempts++;
      if (renderGoogleBtn() || attempts > 50) {
        if (retryTimer) clearInterval(retryTimer);
      }
    }, 100);

    return () => {
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [isAuthenticated]);

  // ── Export Store Backup JSON ──
  const handleExportStore = () => {
    try {
      const current = portfolioRef.current || portfolio;
      const jsonStr = JSON.stringify(current, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portfolio-store.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setToastMessage("✓ Portfolio store JSON exported!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      alert("Failed to export JSON store");
    }
  };

  // ── Import Store Backup JSON ──
  const handleImportStore = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (!parsed || !parsed.personal) {
          alert("Invalid portfolio store JSON: missing personal data.");
          return;
        }
        setPortfolio(parsed);
        portfolioRef.current = parsed;
        await saveInstantly(parsed, "✓ Backup store imported & saved!");
      } catch {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // ── Central Instant Save Handler (Reflects Fatak Se Without Bugs) ──
  const saveInstantly = async (dataToSave?: PortfolioData, successMsg: string = "Saved to Socius!") => {
    const payload = dataToSave || portfolioRef.current || portfolio;
    setIsSaving(true);
    setSaveError("");
    try {
      const result = await updateData(payload);
      if (result.success) {
        isDirtyRef.current = false;
        if (result.data) {
          setPortfolioState(result.data);
          portfolioRef.current = result.data;
        }
        const displayMsg =
          successMsg.includes("Supabase") || successMsg.includes("cloud") || successMsg.includes("☁️")
            ? successMsg
            : `☁️ ${successMsg} (Synced to Supabase!)`;
        setToastMessage(displayMsg);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        const errorMsg = result.error || "Failed to save. Make sure server is reachable.";
        setSaveError(errorMsg);
        setTimeout(() => setSaveError(""), 5000);
      }
    } catch (err: any) {
      setSaveError(err?.message || "Error saving data to Socius.");
      setTimeout(() => setSaveError(""), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save All button
  const handleSaveAll = async () => {
    await saveInstantly(portfolioRef.current || portfolio, "All changes saved successfully!");
  };

  // ── Project Category Actions ──
  const handleAddProjectCategory = () => {
    const trimmed = newProjectCatInput.trim();
    if (!trimmed) return;
    const base = portfolioRef.current || portfolio;
    const current = base.projectCategories || DEFAULT_PROJECT_CATS;
    if (current.includes(trimmed)) {
      alert("This category already exists!");
      return;
    }
    const updatedCats = [...current, trimmed];
    const newPort = { ...base, projectCategories: updatedCats };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    setNewProjectCatInput("");
    saveInstantly(newPort, `Added category: "${trimmed}"`);
  };

  const handleRemoveProjectCategory = (cat: string) => {
    if (!confirm(`Remove category "${cat}"? Projects with this category will keep it until edited.`)) return;
    const base = portfolioRef.current || portfolio;
    const current = base.projectCategories || DEFAULT_PROJECT_CATS;
    const updatedCats = current.filter((c) => c !== cat);
    const newPort = { ...base, projectCategories: updatedCats };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    saveInstantly(newPort, `Removed category: "${cat}"`);
  };

  // ── Certificate Category Actions ──
  const handleAddCertCategory = () => {
    const trimmed = newCertCatInput.trim();
    if (!trimmed) return;
    const base = portfolioRef.current || portfolio;
    const current = base.certificateCategories || DEFAULT_CERT_CATS;
    if (current.includes(trimmed)) {
      alert("This category already exists!");
      return;
    }
    const updatedCats = [...current, trimmed];
    const newPort = { ...base, certificateCategories: updatedCats };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    setNewCertCatInput("");
    saveInstantly(newPort, `Added certificate category: "${trimmed}"`);
  };

  const handleRemoveCertCategory = (cat: string) => {
    if (!confirm(`Remove category "${cat}"? Certificates with this category will keep it until edited.`)) return;
    const base = portfolioRef.current || portfolio;
    const current = base.certificateCategories || DEFAULT_CERT_CATS;
    const updatedCats = current.filter((c) => c !== cat);
    const newPort = { ...base, certificateCategories: updatedCats };
    setPortfolio(newPort);
    portfolioRef.current = newPort;
    saveInstantly(newPort, `Removed certificate category: "${cat}"`);
  };

  // ── Project Actions ──
  const openNewProjectModal = () => {
    const cats = (portfolio.projectCategories && portfolio.projectCategories.length > 0)
      ? portfolio.projectCategories
      : [];
    setEditingProject(null);
    setProjectForm({
      id: "proj-" + Date.now(),
      title: "",
      tagline: "",
      description: "",
      category: cats[0] || "",
      technologies: ["Python"],
      metrics: ["High Accuracy"],
      features: [],
      githubUrl: "https://github.com/harsharyann",
      liveUrl: "",
      imageGradient: "from-amber-400 to-orange-500",
      color: "amber",
    });
    setCustomProjectCat(cats.length === 0 ? "General" : "");
    setTechInput("");
    setMetricInput("");
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ ...p, color: p.color || "amber" });
    setCustomProjectCat("");
    setTechInput(p.technologies?.join(", ") || "");
    setMetricInput(p.metrics?.join(", ") || "");
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async () => {
    if (!projectForm.title.trim()) {
      alert("Please provide a project title");
      return;
    }

    const effectiveCategory = customProjectCat.trim() || projectForm.category || "General";
    const finalProject: Project = {
      ...projectForm,
      category: effectiveCategory,
    };

    const basePortfolio = portfolioRef.current || portfolio;
    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = (basePortfolio.projects || []).map((p) => (p.id === editingProject.id ? finalProject : p));
    } else {
      updatedProjects = [finalProject, ...(basePortfolio.projects || [])];
    }

    // Auto-register category if new
    const currentCats = basePortfolio.projectCategories || [];
    const updatedCats = currentCats.includes(effectiveCategory) ? currentCats : [...currentCats, effectiveCategory];

    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      projectCategories: updatedCats,
      projects: updatedProjects,
    };

    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    setIsProjectModalOpen(false);
    await saveInstantly(newPortfolio, editingProject ? "Project updated successfully!" : "New project published!");
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const basePortfolio = portfolioRef.current || portfolio;
    const updatedProjects = (basePortfolio.projects || []).filter((p) => p.id !== id);
    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      projects: updatedProjects,
    };
    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    await saveInstantly(newPortfolio, "Project deleted.");
  };

  const handleToggleProjectVisibility = async (id: string) => {
    const base = portfolioRef.current || portfolio;
    const updated = (base.projects || []).map((p) => {
      if (p.id === id) {
        const nextState = p.isVisible === false ? true : false;
        return { ...p, isVisible: nextState };
      }
      return p;
    });
    const nextPort = { ...base, projects: updated };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    await saveInstantly(nextPort, "Project visibility updated!");
  };

  // ── Certificate Actions ──
  const openNewCertModal = () => {
    const cats = (portfolio.certificateCategories && portfolio.certificateCategories.length > 0)
      ? portfolio.certificateCategories
      : ["General"];
    const initialCategory = cats[0] || "General";

    setEditingCert(null);
    setCertForm({
      id: "cert-" + Date.now(),
      title: "",
      issuer: "",
      issueDate: new Date().getFullYear().toString(),
      credentialId: "",
      credentialUrl: "",
      imageUrl: "",
      category: initialCategory,
      skillsLearned: ["Python"],
      description: "",
      verificationSource: "",
      color: "amber",
    });
    setIsCustomCat(false);
    setCustomCertCat("");
    setSkillInput("");
    setDriveInput("");
    setDriveFeedback(null);
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (c: Certificate) => {
    setEditingCert(c);
    setCertForm({
      ...c,
      verificationSource: c.verificationSource || "",
      color: c.color || "amber",
    });
    setIsCustomCat(false);
    setCustomCertCat("");
    setSkillInput(c.skillsLearned?.join(", ") || "");
    setDriveInput("");
    setDriveFeedback(null);
    setIsCertModalOpen(true);
  };

  const handleDrivePaste = (val: string) => {
    setDriveInput(val);
    const fileId = extractGoogleDriveId(val);
    if (fileId) {
      setDriveFeedback(`✓ Google Drive ID detected: ${fileId}`);
    } else if (val.trim()) {
      setDriveFeedback("Could not find a valid Google Drive file ID. Please paste a standard Google Drive share link.");
    } else {
      setDriveFeedback(null);
    }
  };

  const applyDriveAsImage = () => {
    const fileId = extractGoogleDriveId(driveInput);
    if (!fileId) {
      alert("Please enter a valid Google Drive link first.");
      return;
    }
    const directUrl = formatGoogleDriveImageUrl(driveInput);
    setCertForm((prev) => ({ ...prev, imageUrl: directUrl }));
    setDriveFeedback("✅ Applied as Certificate Photo URL!");
  };

  const applyDriveAsCredential = () => {
    const fileId = extractGoogleDriveId(driveInput);
    if (!fileId) {
      alert("Please enter a valid Google Drive link first.");
      return;
    }
    const viewUrl = formatGoogleDriveViewUrl(driveInput);
    setCertForm((prev) => ({ ...prev, credentialUrl: viewUrl }));
    setDriveFeedback("✅ Applied as Credential Verification URL!");
  };

  const applyDriveBoth = () => {
    const fileId = extractGoogleDriveId(driveInput);
    if (!fileId) {
      alert("Please enter a valid Google Drive link first.");
      return;
    }
    const directUrl = formatGoogleDriveImageUrl(driveInput);
    const viewUrl = formatGoogleDriveViewUrl(driveInput);
    setCertForm((prev) => ({ ...prev, imageUrl: directUrl, credentialUrl: viewUrl }));
    setDriveFeedback("✅ Applied to both Photo Image & Credential Link!");
  };

  const handleSaveCert = async () => {
    if (!certForm.title.trim()) {
      alert("Please provide a certificate title");
      return;
    }

    const cats = (portfolio.certificateCategories && portfolio.certificateCategories.length > 0)
      ? portfolio.certificateCategories
      : ["General"];

    // Determine the effective category
    let effectiveCategory = "";
    if (isCustomCat && customCertCat.trim()) {
      effectiveCategory = customCertCat.trim();
    } else if (certForm.category && certForm.category.trim()) {
      effectiveCategory = certForm.category.trim();
    } else {
      effectiveCategory = cats[0] || "General";
    }

    // Normalize any raw Google Drive links before saving
    const finalImageUrl = certForm.imageUrl ? formatGoogleDriveImageUrl(certForm.imageUrl) : "";
    const finalCredentialUrl = certForm.credentialUrl
      ? (isGoogleDriveUrl(certForm.credentialUrl) ? formatGoogleDriveViewUrl(certForm.credentialUrl) : certForm.credentialUrl)
      : "";

    const finalCert: Certificate = {
      ...certForm,
      imageUrl: finalImageUrl,
      credentialUrl: finalCredentialUrl,
      category: effectiveCategory,
    };

    const basePortfolio = portfolioRef.current || portfolio;
    const currentCerts = basePortfolio.certificates || [];
    let updatedCerts: Certificate[];
    if (editingCert) {
      updatedCerts = currentCerts.map((c) => (c.id === editingCert.id ? finalCert : c));
    } else {
      updatedCerts = [finalCert, ...currentCerts];
    }

    // Auto-register category ONLY if user typed a new custom category
    let updatedCats = basePortfolio.certificateCategories || [];
    if (isCustomCat && customCertCat.trim() && !updatedCats.includes(customCertCat.trim())) {
      updatedCats = [...updatedCats, customCertCat.trim()];
    }

    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      certificateCategories: updatedCats,
      certificates: updatedCerts,
    };

    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    setIsCertModalOpen(false);
    await saveInstantly(newPortfolio, editingCert ? "Certificate updated!" : "Certificate added!");
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    const basePortfolio = portfolioRef.current || portfolio;
    const currentCerts = basePortfolio.certificates || [];
    const updatedCerts = currentCerts.filter((c) => c.id !== id);
    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      certificates: updatedCerts,
    };
    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    await saveInstantly(newPortfolio, "Certificate deleted.");
  };

  const handleToggleCertVisibility = async (id: string) => {
    const base = portfolioRef.current || portfolio;
    const updated = (base.certificates || []).map((c) => {
      if (c.id === id) {
        const nextState = c.isVisible === false ? true : false;
        return { ...c, isVisible: nextState };
      }
      return c;
    });
    const nextPort = { ...base, certificates: updated };
    setPortfolio(nextPort);
    portfolioRef.current = nextPort;
    await saveInstantly(nextPort, "Certificate visibility updated!");
  };

  // ── Laurel, Paper & Book Actions ──
  const openNewLaurelModal = (defaultType: "award" | "paper" | "book" = "award") => {
    setEditingLaurel(null);
    setLaurelForm({
      id: "laurel-" + Date.now(),
      type: defaultType,
      title: "",
      issuerOrPublisher: "",
      date: new Date().getFullYear().toString(),
      roleOrAward: "",
      link: "",
      description: "",
      badge: defaultType === "award" ? "Hackathon Laurel" : defaultType === "paper" ? "Peer-Reviewed" : "Published Edition",
      imageUrl: "",
      isVisible: true,
      color: "amber",
    });
    setIsLaurelModalOpen(true);
  };

  const openEditLaurelModal = (item: LaurelItem) => {
    setEditingLaurel(item);
    setLaurelForm({ ...item, color: item.color || "amber" });
    setIsLaurelModalOpen(true);
  };

  const handleSaveLaurel = async () => {
    if (!laurelForm.title.trim()) {
      alert("Please provide a title");
      return;
    }

    const basePortfolio = portfolioRef.current || portfolio;
    const currentList = basePortfolio.laurelItems || [];
    let updatedList: LaurelItem[];
    if (editingLaurel) {
      updatedList = currentList.map((item) => (item.id === editingLaurel.id ? laurelForm : item));
    } else {
      updatedList = [laurelForm, ...currentList];
    }

    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      laurelItems: updatedList,
    };

    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    setIsLaurelModalOpen(false);
    await saveInstantly(newPortfolio, editingLaurel ? "Item updated successfully!" : "Item added to Laurels!");
  };

  const handleDeleteLaurel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const basePortfolio = portfolioRef.current || portfolio;
    const currentList = basePortfolio.laurelItems || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      laurelItems: updatedList,
    };
    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    await saveInstantly(newPortfolio, "Item removed.");
  };

  const handleToggleLaurelVisibility = async (id: string) => {
    const basePortfolio = portfolioRef.current || portfolio;
    const currentList = basePortfolio.laurelItems || [];
    const updatedList = currentList.map((item) => {
      if (item.id === id) {
        const nextState = item.isVisible === false ? true : false;
        return { ...item, isVisible: nextState };
      }
      return item;
    });

    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      laurelItems: updatedList,
    };
    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    await saveInstantly(newPortfolio, "Item visibility updated!");
  };

  const handleToggleLaurelsSection = async () => {
    const basePortfolio = portfolioRef.current || portfolio;
    const currentState = basePortfolio.personal.showLaurelsSection !== false;
    const newPersonal = {
      ...basePortfolio.personal,
      showLaurelsSection: !currentState,
    };
    const newPortfolio: PortfolioData = {
      ...basePortfolio,
      personal: newPersonal,
    };
    setPortfolio(newPortfolio);
    portfolioRef.current = newPortfolio;
    await saveInstantly(newPortfolio, !currentState ? "Laurels & Research section visible on main site" : "Laurels & Research section hidden from main site");
  };

  // ─── LOADING STATE ───
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f7f3ea] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0_#000] flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-stone-600 font-bold">
            Checking Socius Session...
          </p>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN (SOCIUS LOCKED VIEW - 100% LIGHT THEME) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f3ea] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-900 font-sans selection:bg-amber-400 selection:text-black relative overflow-hidden">
        {/* Subtle Sketchbook Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Ambient Blurred Glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── CLEAN DOSSIER CARD CONTAINER ── */}
        <div className="relative w-full max-w-md">
          {/* Main Dossier Card */}
          <div className="w-full p-6 sm:p-8 rounded-[28px] bg-[#fffef9] dark:bg-[#151620] border-[2.5px] border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] space-y-6 relative z-20">
            {/* Security Feedback alerts */}
            {inactivityNotice && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-amber-900 dark:text-amber-200 font-mono text-xs flex items-center gap-2 shadow-[2px_2px_0_#d97706]">
                <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{inactivityNotice}</span>
              </div>
            )}

            {authError && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 font-mono text-xs flex items-center gap-2 shadow-[2px_2px_0_#dc2626]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-1.5 pt-2 pb-1">
              <h2 className="font-mono text-base font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Admin Console
              </h2>
              <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
                Sign in with your Google account to continue
              </p>
            </div>

            {/* Google Sign-In Container */}
            <div className="space-y-3 py-2 flex flex-col items-center">
              {isLoggingIn ? (
                <div className="w-full py-3.5 px-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400 text-amber-900 dark:text-amber-200 font-mono text-xs flex items-center justify-center gap-2 shadow-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span className="font-bold">Signing in...</span>
                </div>
              ) : (
                <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]" />
              )}
            </div>

            {/* Return link */}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 text-center">
              <Link
                href="/"
                className="font-mono text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1.5 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span>Return to Live Portfolio</span>
              </Link>
            </div>

            {/* Social Media Handles */}
            <div className="pt-2 flex items-center justify-center gap-2.5">
              <a
                href={portfolio.socialLinks?.github || "https://github.com/harsharyann"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                title="GitHub"
                aria-label="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={portfolio.socialLinks?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0077b5] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:${portfolio.personal?.email || "harsharyan@outlook.com"}`}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f59e0b] text-white border border-black dark:border-white shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                title="Email Harsh"
                aria-label="Email"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active categories helper
  const projectCats = portfolio.projectCategories || DEFAULT_PROJECT_CATS;
  const certCats = (portfolio.certificateCategories && portfolio.certificateCategories.length > 0)
    ? portfolio.certificateCategories
    : DEFAULT_CERT_CATS;

  // Active 7-day daily thoughts helper
  const activeThoughtsList: DailyThought[] =
    portfolio.dailyThoughts && portfolio.dailyThoughts.length === 7
      ? portfolio.dailyThoughts
      : DEFAULT_DAILY_THOUGHTS;

  const updateDailyThought = (dayIndex: number, field: "quote" | "persona" | "dayName" | "personaColor", value: string) => {
    const updated = activeThoughtsList.map((item) => {
      if (item.dayIndex === dayIndex) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setPortfolio((prev) => {
      const nextPort = {
        ...prev,
        dailyThoughts: updated,
        personal: {
          ...prev.personal,
          ...(field === "personaColor" ? { coverPersonaColor: value } : {}),
        },
      };
      portfolioRef.current = nextPort;
      return nextPort;
    });
  };

  const resetDailyThought = (dayIndex: number) => {
    const defaultItem = DEFAULT_DAILY_THOUGHTS.find((d) => d.dayIndex === dayIndex);
    if (!defaultItem) return;
    const updated = activeThoughtsList.map((item) => {
      if (item.dayIndex === dayIndex) {
        return { ...defaultItem };
      }
      return item;
    });
    setPortfolio((prev) => {
      const nextPort = {
        ...prev,
        dailyThoughts: updated,
        personal: {
          ...prev.personal,
          ...(defaultItem.personaColor ? { coverPersonaColor: defaultItem.personaColor } : {}),
        },
      };
      portfolioRef.current = nextPort;
      return nextPort;
    });
  };

  const sidebarNavGroups = [
    {
      group: "COMMUNICATIONS",
      tabs: [
        { id: "inquiries", label: "Inquiries & Dispatches", title: "Incoming Inquiries & Dispatches", desc: "Live portfolio contact inbox", icon: Send, count: messages.length, alert: messages.some((m) => !m.read) },
      ],
    },
    {
      group: "HERO & BRANDING",
      tabs: [
        { id: "sublines", label: "Headlines & Sublines", title: "Master Section Sublines & Headings", desc: "Hero tagline, section subtitles & headings", icon: Type },
        { id: "cover", label: "Cover Hero Page", title: "Cover Page Manager", desc: "Hero portrait, framing, wordmark & cover buttons", icon: Sliders },
        { id: "badges", label: "Badges & Persona", title: "Role Badges & Persona Colors", desc: "Cover role pill visibility & custom colors", icon: Sparkles },
      ],
    },
    {
      group: "IDENTITY & CAREER",
      tabs: [
        { id: "about", label: "Profile & Bio Plaque", title: "Profile & Bio Identity", desc: "Photo mount, statement, bio highlighter & resume", icon: User },
        { id: "experience", label: "Work & Leadership", title: "Work & Leadership Station", desc: "Current roles, past milestones & impact", icon: Briefcase, count: portfolio.experiences?.length || 0 },
        { id: "milestones", label: "Development Trajectory", title: "Development Trajectory & Milestones", desc: "Phase 01, Phase 02 & Phase 03 roadmap", icon: Rocket, count: portfolio.milestones?.length || 0 },
        { id: "highlights", label: "Benchmarks & Metrics", title: "Key Benchmarks & Impact Stats", desc: "Key numerical achievements & impact capsules", icon: Trophy, count: portfolio.quickStats?.length || 0 },
      ],
    },
    {
      group: "PORTFOLIO ASSETS",
      tabs: [
        { id: "projects", label: "Projects Lab", title: "Technical Projects Manager", desc: "Filter tags, live links, github repositories & tech stacks", icon: FolderCode, count: portfolio.projects?.length || 0 },
        { id: "certificates", label: "Certificates & Laurels", title: "Credentials & Laurels", desc: "Verified credentials, verification links & categories", icon: Award, count: portfolio.certificates?.length || 0 },
        { id: "skills", label: "Skills Arsenal", title: "Technical Skills Arsenal", desc: "Category groupings, badges, proficiency & skill tags", icon: Code2, count: portfolio.skills?.length || 0 },
        { id: "contact", label: "Contact & Station Setup", title: "Contact Page & Station Coordinates", desc: "Location coordinates, live clock & inquiry form settings", icon: MapPin },
      ],
    },
  ];

  const navTabs = sidebarNavGroups.flatMap((g) => g.tabs);

  const currentTabObj = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  // ─── AUTHENTICATED DASHBOARD (100% LIGHT THEME STUDIO) ───
  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-900 selection:bg-amber-400 selection:text-black font-sans flex flex-col md:flex-row relative">
      {/* ── Instant Save Toast Notification (Fatak Se Feedback) ── */}
      {isSaving && !toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(0,0,0,0.3)] border-2 border-black animate-in fade-in slide-in-from-bottom-3 duration-200">
          <RefreshCw className="w-4 h-4 animate-spin text-black shrink-0" />
          <span>Saving changes...</span>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-black text-white font-mono text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {saveError && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-rose-600 text-white font-mono text-xs font-bold shadow-lg border-2 border-black">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Mobile Top Header (Visible only on < md) ── */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-black font-black text-xs border border-black shadow-xs">
              S
            </div>
            <span className="font-['Space_Grotesk'] text-base font-black uppercase tracking-tight text-stone-900">
              Socius
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider border border-black shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </button>
      </div>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── LEFT SIDEBAR (100% Studio Light Theme Layout) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#FAF8F5] text-stone-900 border-r-2 border-black flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header: Brand & Live Indicator */}
        <div className="p-4 sm:p-5 border-b-2 border-stone-200 bg-white/90">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer"
              title="Return to Live Portfolio"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0_#000] group-hover:scale-105 transition-transform overflow-hidden p-1 shrink-0">
                <img src="/icon.svg" alt="Socius Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-base font-black tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors leading-none">
                  SOCIUS STUDIO
                </span>
                <span className="font-mono text-[9px] text-emerald-700 flex items-center gap-1.5 mt-1 font-bold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                  <span>SUPABASE SYNCED</span>
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-500 hover:text-black hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items (Grouped Vertical Menu) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-300">
          {sidebarNavGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 pb-1 text-[9px] font-mono font-black uppercase tracking-widest text-stone-400">
                {group.group}
              </div>
              {group.tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <React.Fragment key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id as AdminTab);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer text-left group ${
                        isActive
                          ? "bg-amber-400 text-black font-black border-2 border-black shadow-[2px_2px_0_#000]"
                          : "text-stone-700 hover:text-black hover:bg-white hover:border-stone-300 border border-transparent font-bold"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? "text-black" : "text-stone-500 group-hover:text-black"
                          }`}
                        />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.id === "cover" ? (
                        <span
                          className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? "bg-black text-amber-300 font-black"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {coverSubView === "desktop" ? "PC" : "Phone"}
                        </span>
                      ) : tab.count !== undefined ? (
                        <span
                          className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? "bg-black text-white font-black"
                              : "bg-stone-200 text-stone-700 group-hover:bg-stone-300"
                          }`}
                        >
                          {tab.count}
                        </span>
                      ) : null}
                    </button>

                    {/* Cover Sub-Views Dropdown (Desktop vs Mobile) */}
                    {tab.id === "cover" && isActive && (
                      <div className="ml-5 pl-2.5 border-l-2 border-stone-300 space-y-1 pt-1 pb-1">
                        <button
                          type="button"
                          onClick={() => setCoverSubView("desktop")}
                          className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-lg font-mono text-[10.5px] transition-all cursor-pointer text-left ${
                            coverSubView === "desktop"
                              ? "bg-black text-amber-300 font-black border border-black shadow-xs"
                              : "text-stone-600 hover:text-black hover:bg-white font-semibold"
                          }`}
                        >
                          <span>💻</span>
                          <span>Desktop View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCoverSubView("mobile")}
                          className={`w-full flex items-center gap-2 px-2.5 py-1 rounded-lg font-mono text-[10.5px] transition-all cursor-pointer text-left ${
                            coverSubView === "mobile"
                              ? "bg-black text-amber-300 font-black border border-black shadow-xs"
                              : "text-stone-600 hover:text-black hover:bg-white font-semibold"
                          }`}
                        >
                          <span>📱</span>
                          <span>Mobile View</span>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: Live Site Link, Backup Tools, & User Profile */}
        <div className="p-3.5 border-t-2 border-stone-200 bg-white/90 space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border-2 border-black font-mono text-xs font-bold text-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-600" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] text-stone-500 font-mono">↗</span>
          </Link>

          {/* Backup & Restore Tools in Footer */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200">
            <button
              type="button"
              onClick={handleExportStore}
              title="Download portfolio-store.json backup"
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:border-black bg-white hover:bg-stone-100 font-mono text-[11px] font-bold text-stone-700 hover:text-black transition-all cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>

            <label
              title="Import portfolio-store.json backup"
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:border-black bg-white hover:bg-stone-100 font-mono text-[11px] font-bold text-stone-700 hover:text-black transition-all cursor-pointer"
            >
              <Upload className="w-3 h-3" />
              <span>Import</span>
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImportStore(f);
                }}
              />
            </label>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-black border border-black flex items-center justify-center font-mono text-xs font-black shadow-xs">
                HA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-mono text-stone-900 leading-tight">Harsh Aryan</span>
                <span className="text-[9.5px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Super Admin
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE (Right Side on md: screens) ── */}
      <div className="flex-1 md:ml-72 min-h-screen flex flex-col relative bg-[#faf7f2]/95">
        {/* Subtle Sketchbook Grid Background */}
        <div
          className="fixed inset-0 md:left-72 pointer-events-none opacity-[0.06] z-0"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Sticky Top Bar for Section Header & Save All (Clean: Only Save Button on Right) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b-2 border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Breadcrumb Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                <span>Studio</span>
                <span>/</span>
                <span className="text-stone-900 font-black">{currentTabObj.title}</span>
              </div>
              <span className="text-xs font-mono text-stone-500 hidden sm:inline">
                {currentTabObj.desc}
              </span>
            </div>
          </div>

          {/* Actions Right: ONLY Save Button (+ subtle sync indicator) */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Supabase Cloud Active</span>
            </span>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? "Saving to Cloud..." : "Save All Changes"}</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-7 max-w-6xl w-full mx-auto space-y-8">

        {/* ── TAB: INCOMING INQUIRIES & DISPATCHES (DEDICATED TOP-LEVEL INBOX) ── */}
        {activeTab === "inquiries" && (() => {
          const filteredMessages = messages.filter((msg) => {
            const q = inquiriesSearchQuery.toLowerCase().trim();
            const matchSearch =
              !q ||
              (msg.name || "").toLowerCase().includes(q) ||
              (msg.email || "").toLowerCase().includes(q) ||
              (msg.message || "").toLowerCase().includes(q);
            const matchCat =
              inquiriesCategoryFilter === "all" ||
              (msg.category || "").toLowerCase() === inquiriesCategoryFilter.toLowerCase();
            return matchSearch && matchCat;
          });

          return (
            <div className="space-y-6">
              {/* Quick Actions Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000]">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                    📬
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-base font-black uppercase text-stone-900 flex items-center gap-2">
                      <span>Inbox Messages</span>
                      <span className="px-2 py-0.5 rounded-full bg-black text-amber-300 font-mono text-xs font-black">
                        {messages.length}
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllMessages}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Clear all inquiries"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Clear All</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={fetchMessages}
                    disabled={isLoadingMessages}
                    className="px-3.5 py-1.5 rounded-xl border-2 border-black bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? "animate-spin" : ""}`} />
                    <span>{isLoadingMessages ? "Syncing..." : "Refresh"}</span>
                  </button>
                </div>
              </div>

              {/* Inquiries Quick Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-lg">
                    📬
                  </div>
                  <div>
                    <div className="font-mono text-[10px] font-black uppercase text-stone-500">Total Dispatches</div>
                    <div className="font-['Space_Grotesk'] text-2xl font-black text-stone-900">{messages.length}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-lg">
                    ⚡
                  </div>
                  <div>
                    <div className="font-mono text-[10px] font-black uppercase text-stone-500">Inbox Status</div>
                    <div className="font-['Space_Grotesk'] text-lg font-black text-emerald-700">
                      {messages.length === 0 ? "All Caught Up" : `${messages.length} Active Messages`}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300 text-lg">
                    🌐
                  </div>
                  <div>
                    <div className="font-mono text-[10px] font-black uppercase text-stone-500">Target Station</div>
                    <div className="font-['Space_Grotesk'] text-sm font-black text-stone-800 truncate">
                      {portfolio.personal.email || "harsharyan@outlook.com"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inquiriesSearchQuery}
                    onChange={(e) => setInquiriesSearchQuery(e.target.value)}
                    placeholder="Search by sender name, email, or message keyword..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-hidden"
                  />
                  <span className="absolute left-3 top-2.5 text-stone-400">🔍</span>
                  {inquiriesSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setInquiriesSearchQuery("")}
                      className="absolute right-3 top-2 text-xs font-mono text-stone-400 hover:text-black cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-stone-500 mr-1">Filter:</span>
                  {[
                    { id: "all", label: "All" },
                    { id: "collaboration", label: "Collaboration" },
                    { id: "mentorship", label: "Mentorship" },
                    { id: "general", label: "General" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setInquiriesCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                        inquiriesCategoryFilter === cat.id
                          ? "bg-black text-white shadow-xs font-black"
                          : "bg-white text-stone-600 hover:text-black border border-stone-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* List of Inquiries */}
              {isLoadingMessages ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0_#000] text-stone-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
                  <span>Loading inquiries from Supabase cloud...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0_#000] space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0_#000]">
                    📬
                  </div>
                  <h4 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                    {inquiriesSearchQuery || inquiriesCategoryFilter !== "all"
                      ? "No matching inquiries found"
                      : "No Incoming Inquiries Yet"}
                  </h4>
                  <p className="font-mono text-xs text-stone-500 max-w-md mx-auto">
                    {inquiriesSearchQuery || inquiriesCategoryFilter !== "all"
                      ? "Try clearing your search query or switching filters to see all messages."
                      : "Jab koi visitor ya recruiter portfolio ke contact form se message bhejega, wo instant notifications ke sath yahan display hoga."}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/contact"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-mono text-xs font-bold border border-black shadow-xs"
                    >
                      <span>Test Contact Form on Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-6 rounded-3xl border-2 border-black bg-white shadow-[4px_4px_0_#000] space-y-4 transition-all hover:shadow-[6px_6px_0_#000]"
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-black text-black font-['Space_Grotesk'] font-black flex items-center justify-center text-sm shadow-[2px_2px_0_#000]">
                            {(msg.name || "U").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-['Space_Grotesk'] text-base font-black text-stone-900">
                                {msg.name}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-black uppercase">
                                {msg.category || "General Inquiry"}
                              </span>
                            </div>
                            <div className="text-xs font-mono font-bold text-indigo-700 flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-stone-400" />
                              <a href={`mailto:${msg.email}`} className="hover:underline">
                                {msg.email}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                          <span className="font-mono text-[10px] text-stone-400 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-lg">
                            📅 {new Date(msg.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <a
                            href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry - ${encodeURIComponent(msg.category || "General")}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out via my portfolio!%0D%0A%0D%0A`}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Send Direct Email Reply"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply via Email</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs sm:text-sm text-stone-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── TAB: ROLE BADGES & PERSONA COLORS ── */}
        {activeTab === "badges" && (
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-purple-50/60 border-3 border-black shadow-[6px_6px_0_#000] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-black/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0_#000] text-lg">
                  ⚡
                </span>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg sm:text-xl font-black uppercase text-stone-900 flex items-center gap-2">
                    <span>Role Badge &amp; Persona Color Controls</span>
                    <span className="text-[10px] font-mono font-bold bg-amber-400 text-black border border-black px-2 py-0.5 rounded-full uppercase shadow-2xs">
                      Live Controls
                    </span>
                  </h3>
                  <p className="font-mono text-xs text-stone-600">
                    Cover role pill (Image 2) hide/unhide karein, Persona tag color aur India/location accent customize karein.
                  </p>
                </div>
              </div>

              {activeTab !== "badges" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("badges")}
                  className="px-3 py-1 rounded-xl bg-stone-900 text-white font-mono text-[11px] font-bold self-start sm:self-auto cursor-pointer hover:bg-stone-800"
                >
                  ⚡ Focus Badges Tab ↗
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. ROLE / FELLOWSHIP BADGE (IMAGE 2 PILL) */}
              <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>1. Cover Role Pill (Image 2 Badge)</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-100 font-bold px-2 py-0.5 rounded-md border border-purple-300">
                    Image 2 Badge
                  </span>
                </div>

                {/* Live Badge Preview */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center">
                  <span className="text-[9.5px] font-mono text-stone-500 font-bold mb-1.5 uppercase">
                    Live Role Pill Preview:
                  </span>
                  {(() => {
                    const pTrack = resolveRoleTrack(
                      portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Role",
                      portfolio.personal.aboutWorkPlace || "",
                      portfolio.personal.aboutRoleType,
                      portfolio.personal.coverRoleTrackColor
                    );
                    return (
                      <div
                        className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white border-2 border-black shadow-[2px_2px_0_#000] transition-transform hover:scale-105"
                        style={portfolio.personal.coverRoleTrackColor ? { borderColor: portfolio.personal.coverRoleTrackColor } : undefined}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${pTrack.beaconCore} animate-pulse`}
                          style={portfolio.personal.coverRoleTrackColor ? { backgroundColor: portfolio.personal.coverRoleTrackColor } : undefined}
                        />
                        <span
                          className={`font-mono text-[10.5px] font-black uppercase ${pTrack.labelColor} flex items-center gap-1`}
                          style={portfolio.personal.coverRoleTrackColor ? { color: portfolio.personal.coverRoleTrackColor } : undefined}
                        >
                          {pTrack.icon}
                          <span>{pTrack.label}</span>
                        </span>
                        <span className="text-stone-300">|</span>
                        <span className="font-['Space_Grotesk'] text-xs font-black uppercase text-black">
                          {portfolio.personal.aboutCurrentWork || portfolio.personal.role || "NPTEL SCHOLAR"}
                        </span>
                        {portfolio.personal.aboutWorkPlace && (
                          <span
                            className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase"
                            style={
                              portfolio.personal.coverRoleTrackColor
                                ? { backgroundColor: `${portfolio.personal.coverRoleTrackColor}20`, color: portfolio.personal.coverRoleTrackColor }
                                : undefined
                            }
                          >
                            @{portfolio.personal.aboutWorkPlace}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Hide / Unhide Controls */}
                <div className="space-y-2 pt-1">
                  <span className="block font-mono text-[11px] font-bold text-stone-700">
                    Hide / Unhide Role Pill:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Desktop Toggle */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-stone-900 block">Desktop Cover:</span>
                        <span className="font-mono text-[9px] text-stone-500">PC / Laptop</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextVal = base.personal.showDesktopCurrentRole === false ? true : false;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, showDesktopCurrentRole: nextVal },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, nextVal ? "✅ Desktop role pill is now SHOWN!" : "⚠️ Desktop role pill is now HIDDEN!");
                        }}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer border ${
                          portfolio.personal.showDesktopCurrentRole !== false
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                            : "bg-stone-200 text-stone-600 border-stone-300"
                        }`}
                      >
                        {portfolio.personal.showDesktopCurrentRole !== false ? "● SHOWN" : "○ HIDDEN"}
                      </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] font-bold text-stone-900 block">Phone Cover:</span>
                        <span className="font-mono text-[9px] text-stone-500">Mobile Phone</span>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextVal = base.personal.showMobileCurrentRole === false ? true : false;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, showMobileCurrentRole: nextVal },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, nextVal ? "✅ Phone role pill is now SHOWN!" : "⚠️ Phone role pill is now HIDDEN!");
                        }}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer border ${
                          portfolio.personal.showMobileCurrentRole !== false
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                            : "bg-stone-200 text-stone-600 border-stone-300"
                        }`}
                      >
                        {portfolio.personal.showMobileCurrentRole !== false ? "● SHOWN" : "○ HIDDEN"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Pill Color Picker */}
                <div className="pt-2 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-stone-700">Role Pill Color Accent:</span>
                    {portfolio.personal.coverRoleTrackColor && (
                      <button
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, coverRoleTrackColor: "" },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, "Reset role pill color to auto");
                        }}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer font-mono font-bold"
                      >
                        Reset Color
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: "Purple (Fellowship)", color: "#8b5cf6" },
                      { label: "Emerald (Academic)", color: "#10b981" },
                      { label: "Cyan (Research)", color: "#06b6d4" },
                      { label: "Amber (Internship)", color: "#f59e0b" },
                      { label: "Rose", color: "#f43f5e" },
                      { label: "Indigo", color: "#6366f1" },
                    ].map((preset) => (
                      <button
                        key={preset.color}
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, coverRoleTrackColor: preset.color },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, `Role badge color set to ${preset.label}`);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          portfolio.personal.coverRoleTrackColor === preset.color
                            ? "scale-110 border-black ring-2 ring-black/40"
                            : "border-white shadow-xs hover:scale-105"
                        }`}
                        style={{ backgroundColor: preset.color }}
                        title={preset.label}
                      />
                    ))}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="font-mono text-[10px] text-stone-400">Custom:</span>
                      <input
                        type="color"
                        value={portfolio.personal.coverRoleTrackColor || "#8b5cf6"}
                        onChange={async (e) => {
                          const val = e.target.value;
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, coverRoleTrackColor: val },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, "Custom role badge color saved");
                        }}
                        className="w-8 h-8 rounded-lg border border-stone-300 p-0.5 cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. LOCATION & INDIA BADGE COLOR */}
              <div className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>2. Location &amp; India Badge Color</span>
                  </span>
                  <span className="text-[10px] font-mono text-rose-800 bg-rose-100 font-bold px-2 py-0.5 rounded-md border border-rose-300">
                    Location Badge
                  </span>
                </div>

                {/* Live Location Badge Preview */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center">
                  <span className="text-[9.5px] font-mono text-stone-500 font-bold mb-1.5 uppercase">
                    Live Location Badge Preview:
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-black border-2 shadow-[2px_2px_0_#000] transition-transform hover:scale-105"
                    style={{
                      backgroundColor: portfolio.personal.locationBadgeColor ? `${portfolio.personal.locationBadgeColor}15` : "#fee2e2",
                      color: portfolio.personal.locationBadgeColor || "#e11d48",
                      borderColor: portfolio.personal.locationBadgeColor || "#f43f5e",
                    }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{portfolio.personal.currentCity || "Chennai, India"}</span>
                  </span>
                </div>

                {/* Location Color Swatches */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] font-bold text-stone-700">Location Badge Color Accent:</span>
                    {portfolio.personal.locationBadgeColor && (
                      <button
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, locationBadgeColor: "" },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, "Reset location badge color to default");
                        }}
                        className="text-[10px] text-rose-600 hover:underline cursor-pointer font-mono font-bold"
                      >
                        Reset Color
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { label: "Rose", color: "#f43f5e" },
                      { label: "Amber", color: "#f59e0b" },
                      { label: "Emerald", color: "#10b981" },
                      { label: "Sky Blue", color: "#0284c7" },
                      { label: "Purple", color: "#8b5cf6" },
                      { label: "Indigo", color: "#6366f1" },
                    ].map((lColor) => (
                      <button
                        key={lColor.color}
                        type="button"
                        onClick={async () => {
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, locationBadgeColor: lColor.color },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, `Location badge color set to ${lColor.label}`);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          portfolio.personal.locationBadgeColor === lColor.color
                            ? "scale-110 border-black ring-2 ring-black/40"
                            : "border-white shadow-xs hover:scale-105"
                        }`}
                        style={{ backgroundColor: lColor.color }}
                        title={lColor.label}
                      />
                    ))}
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="font-mono text-[10px] text-stone-400">Custom:</span>
                      <input
                        type="color"
                        value={portfolio.personal.locationBadgeColor || "#f43f5e"}
                        onChange={async (e) => {
                          const val = e.target.value;
                          const base = portfolioRef.current || portfolio;
                          const nextPort = {
                            ...base,
                            personal: { ...base.personal, locationBadgeColor: val },
                          };
                          setPortfolio(nextPort);
                          portfolioRef.current = nextPort;
                          await saveInstantly(nextPort, "Custom location color saved");
                        }}
                        className="w-8 h-8 rounded-lg border border-stone-300 p-0.5 cursor-pointer bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Helpful bridge pointing to merged Daily Thought & Persona Studio */}
                <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-mono text-[11px] text-purple-900 leading-snug">
                      <strong>Daily Thought &amp; Persona Tag:</strong> Persona pill ka color aur content ab Desktop Cover Studio mein completely merge kar diya gaya hai.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("cover")}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold shrink-0 self-start sm:self-auto cursor-pointer shadow-xs active:translate-y-0.5 flex items-center gap-1"
                  >
                    <span>Open Thought Studio</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MASTER SECTION SUBLINES & HEADINGS MANAGER ── */}
        {activeTab === "sublines" && (
          <div className="space-y-6">
            {/* Header Control Bar */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Type className="w-6 h-6 text-amber-500" />
                  <span>Master Section Sublines &amp; Taglines</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-0.5">
                  Har section ki primary heading, description subline aur narrative taglines yahan se live edit karein.
                </p>
              </div>
            </div>

            {/* Sub-nav quick filter bar */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-stone-100 rounded-2xl border border-stone-200">
              {[
                { id: "all", label: "All Sections", icon: Sparkles },
                { id: "about", label: "About Subline", icon: User },
                { id: "projects", label: "Projects Lab", icon: FolderCode },
                { id: "certificates", label: "Certificates & Laurels", icon: Award },
                { id: "experience", label: "Work & Leadership", icon: Briefcase },
              ].map((f) => {
                const isSelected = sublinesSectionFilter === f.id;
                const IconComp = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSublinesSectionFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-black text-white shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. ABOUT SECTION ("BEHIND THE TERMINAL") */}
            {(sublinesSectionFilter === "all" || sublinesSectionFilter === "about") && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border border-black" />
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      1. Behind the Terminal (About Section) Heading &amp; Subline
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSublines((prev) => ({ ...prev, about: !prev.about }))}
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        editingSublines["about"]
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {editingSublines["about"] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      About Section
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: View Mode vs Edit Mode (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {!editingSublines["about"] ? (
                      /* ── View Mode: Clean Typography Plaque ── */
                      <div className="space-y-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Current Heading:</span>
                          <h4 className="font-['Space_Grotesk'] text-lg font-black text-stone-900">
                            {portfolio.personal.aboutHeading || "Behind the Terminal"}
                          </h4>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Current Subline:</span>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                            {portfolio.personal.aboutSubtitle || "Curious mind blending machine learning fundamentals with expressive software architecture..."}
                          </p>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span>Locked. Click &ldquo;Edit&rdquo; above to modify.</span>
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, about: true }))}
                            className="text-amber-700 hover:text-amber-900 font-bold"
                          >
                            ✏️ Edit Heading &amp; Subline ↗
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Edit Mode: Form Inputs ── */
                      <div className="space-y-4">
                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Section Main Heading:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.aboutHeading ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutHeading: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "About heading updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="Behind the Terminal"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                            <span>Section Description Subline (Sub-heading):</span>
                            <span className="text-amber-700 font-normal text-[10px]">Displayed right under heading</span>
                          </label>
                          <textarea
                            rows={3}
                            value={portfolio.personal.aboutSubtitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutSubtitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "About subtitle updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="Curious mind blending machine learning fundamentals with expressive software architecture..."
                          />
                          <p className="font-mono text-[9.5px] text-stone-500 mt-1">
                            Ye exact subline website par Behind the Terminal ke neeche render hoti hai.
                          </p>
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, about: false }))}
                            className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save &amp; Lock View</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview Card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      <span>Live Website Header Preview</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-black shadow-[3px_3px_0_#000] space-y-2">
                      <h3 className="text-xl font-black uppercase text-black font-['Space_Grotesk'] leading-tight">
                        {portfolio.personal.aboutHeading || "Behind the Terminal"}
                      </h3>
                      <svg className="w-36 h-2 text-amber-500" viewBox="0 0 240 10" fill="none">
                        <path d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                      </svg>
                      <p className="text-xs font-mono text-stone-700 leading-relaxed">
                        {portfolio.personal.aboutSubtitle || "Curious mind blending machine learning fundamentals with expressive software architecture..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PROJECTS & BUILDS SECTION */}
            {(sublinesSectionFilter === "all" || sublinesSectionFilter === "projects") && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 border border-black" />
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      2. Projects Lab Heading &amp; Subline
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSublines((prev) => ({ ...prev, projects: !prev.projects }))}
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        editingSublines["projects"]
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {editingSublines["projects"] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                      Projects Section
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: View Mode vs Edit Mode (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {!editingSublines["projects"] ? (
                      /* ── View Mode: Clean Typography Plaque ── */
                      <div className="space-y-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Current Heading:</span>
                          <h4 className="font-['Space_Grotesk'] text-lg font-black text-stone-900">
                            {portfolio.personal.projectsHeading || "Projects and Builds"}
                          </h4>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Current Subline:</span>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                            {portfolio.personal.projectsSubtitle || "End-to-end exploratory data analysis, foundational machine learning algorithms..."}
                          </p>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span>Locked. Click &ldquo;Edit&rdquo; above to modify.</span>
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, projects: true }))}
                            className="text-amber-700 hover:text-amber-900 font-bold"
                          >
                            ✏️ Edit Heading &amp; Subline ↗
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Edit Mode: Form Inputs ── */
                      <div className="space-y-4">
                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Projects Section Heading:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.projectsHeading ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, projectsHeading: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Projects heading updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="Projects and Builds"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Projects Section Subline (Description Subtitle):
                          </label>
                          <textarea
                            rows={3}
                            value={portfolio.personal.projectsSubtitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, projectsSubtitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Projects subtitle updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="End-to-end exploratory data analysis, foundational machine learning algorithms..."
                          />
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, projects: false }))}
                            className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save &amp; Lock View</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview Card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-purple-500" />
                      <span>Live Projects Header Preview</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-black shadow-[3px_3px_0_#000] space-y-2">
                      <h3 className="text-xl font-black uppercase text-black font-['Space_Grotesk'] leading-tight">
                        {portfolio.personal.projectsHeading || "Projects and Builds"}
                      </h3>
                      <svg className="w-36 h-2 text-purple-500" viewBox="0 0 240 10" fill="none">
                        <path d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                      </svg>
                      <p className="text-xs font-mono text-stone-700 leading-relaxed">
                        {portfolio.personal.projectsSubtitle || "End-to-end exploratory data analysis, foundational machine learning algorithms..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. CERTIFICATIONS & LAURELS SECTION */}
            {(sublinesSectionFilter === "all" || sublinesSectionFilter === "certificates") && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 border border-black" />
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      3. Certifications &amp; Laurels Headings &amp; Sublines
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSublines((prev) => ({ ...prev, certificates: !prev.certificates }))}
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        editingSublines["certificates"]
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {editingSublines["certificates"] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Certificates Section
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: View Mode vs Edit Mode (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {!editingSublines["certificates"] ? (
                      /* ── View Mode: Clean Typography Plaque ── */
                      <div className="space-y-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Certifications Heading:</span>
                            <h4 className="font-['Space_Grotesk'] text-base font-black text-stone-900">
                              {portfolio.personal.certificatesHeading || "Certifications and Laurels"}
                            </h4>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Laurels Stamp Title:</span>
                            <span className="sketch-stamp font-black text-xs inline-block">
                              {portfolio.personal.laurelsTitle || "LAURELS"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Certificates Subline:</span>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                            {portfolio.personal.certificatesSubtitle || "Verified academic achievements, hackathon laurels, and institutional recognitions..."}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Laurels Subline:</span>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                            {portfolio.personal.laurelsSubtitle || "Academic accolades, hackathon triumphs, research publications..."}
                          </p>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span>Locked. Click &ldquo;Edit&rdquo; above to modify.</span>
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, certificates: true }))}
                            className="text-amber-700 hover:text-amber-900 font-bold"
                          >
                            ✏️ Edit Headings ↗
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Edit Mode: Form Inputs ── */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                              Certifications Main Heading:
                            </label>
                            <input
                              type="text"
                              value={portfolio.personal.certificatesHeading ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, certificatesHeading: val },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Certificates heading updated!")}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                              placeholder="Certifications and Laurels"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                              Laurels Stamp Title:
                            </label>
                            <input
                              type="text"
                              value={portfolio.personal.laurelsTitle ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, laurelsTitle: val },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Laurels title updated!")}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                              placeholder="LAURELS"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Certificates Section Subline:
                          </label>
                          <textarea
                            rows={2}
                            value={portfolio.personal.certificatesSubtitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, certificatesSubtitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Certificates subtitle updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="Verified academic achievements, hackathon laurels, and institutional recognitions..."
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Laurels Section Subline:
                          </label>
                          <textarea
                            rows={2}
                            value={portfolio.personal.laurelsSubtitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, laurelsSubtitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Laurels subtitle updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="Academic accolades, hackathon triumphs, research publications..."
                          />
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, certificates: false }))}
                            className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save &amp; Lock View</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview Card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-amber-500" />
                      <span>Live Credentials Header Preview</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-black shadow-[3px_3px_0_#000] space-y-3">
                      <div>
                        <h3 className="text-xl font-black uppercase text-black font-['Space_Grotesk'] leading-tight">
                          {portfolio.personal.certificatesHeading || "Certifications and Laurels"}
                        </h3>
                        <svg className="w-36 h-2 text-amber-500 my-1" viewBox="0 0 240 10" fill="none">
                          <path d="M 2 6 Q 40 1 80 6 Q 120 11 160 5 Q 200 1 238 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                        </svg>
                        <p className="text-xs font-mono text-stone-700 leading-relaxed">
                          {portfolio.personal.certificatesSubtitle || "Verified academic achievements, hackathon laurels, and institutional recognitions..."}
                        </p>
                      </div>

                      {/* Laurels Subsection Preview */}
                      <div className="pt-2.5 border-t border-dashed border-stone-300 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="sketch-stamp font-black text-[10px]">
                            {portfolio.personal.laurelsTitle || "LAURELS"}
                          </span>
                          <span className="font-mono text-[9px] font-bold text-stone-500">
                            [HONORS &amp; ACCOLADES]
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-stone-600">
                          {portfolio.personal.laurelsSubtitle || "Academic accolades, hackathon triumphs, research publications..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WORK & LEADERSHIP (EXPERIENCE) SECTION */}
            {(sublinesSectionFilter === "all" || sublinesSectionFilter === "experience") && (
              <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-500 border border-black" />
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      4. Work &amp; Leadership (Experience) Heading &amp; Subline
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSublines((prev) => ({ ...prev, experience: !prev.experience }))}
                      className={`px-3 py-1 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        editingSublines["experience"]
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {editingSublines["experience"] ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                      Experience Section
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: View Mode vs Edit Mode (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {!editingSublines["experience"] ? (
                      /* ── View Mode: Clean Typography Plaque ── */
                      <div className="space-y-3.5 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Stamp Title:</span>
                          <span className="sketch-stamp bg-amber-400 text-black font-black text-xs inline-block">
                            {portfolio.personal.experienceTitle || "WORK & LEADERSHIP"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Timeline Subline:</span>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                            {portfolio.personal.experienceSubtitle || "A chronological flight track of engineering leadership, academic mentorship, and industry contributions."}
                          </p>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span>Locked. Click &ldquo;Edit&rdquo; above to modify.</span>
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, experience: true }))}
                            className="text-amber-700 hover:text-amber-900 font-bold"
                          >
                            ✏️ Edit Heading &amp; Subline ↗
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Edit Mode: Form Inputs ── */
                      <div className="space-y-4">
                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Experience Stamp Title:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.experienceTitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, experienceTitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Experience title updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="WORK & LEADERSHIP"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Experience Subline (Timeline Subtitle):
                          </label>
                          <textarea
                            rows={3}
                            value={portfolio.personal.experienceSubtitle ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, experienceSubtitle: val },
                              }));
                            }}
                            onBlur={() => saveInstantly(portfolioRef.current, "Experience subtitle updated!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                            placeholder="A chronological flight track of engineering leadership, academic mentorship, and industry contributions."
                          />
                        </div>

                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingSublines((prev) => ({ ...prev, experience: false }))}
                            className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save &amp; Lock View</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Live Preview Card (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-cyan-500" />
                      <span>Live Experience Header Preview</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#fffdfa] border-2 border-black shadow-[3px_3px_0_#000] space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="sketch-stamp bg-amber-400 text-black font-black text-xs">
                          {portfolio.personal.experienceTitle || "WORK & LEADERSHIP"}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-stone-500">
                          [CHRONOLOGICAL TIMELINE]
                        </span>
                      </div>
                      <p className="text-xs font-mono text-stone-700 leading-relaxed">
                        {portfolio.personal.experienceSubtitle || "A chronological flight track of engineering leadership, academic mentorship, and industry contributions."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: COVER HERO MANAGER (DYNAMIC DESKTOP & MOBILE VIEWS WITH REAL-TIME PREVIEW) ── */}
        {activeTab === "cover" && (
          <div className="space-y-6">
            {/* Top Control Bar with Sub-Section Selector & Actions */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-amber-500" />
                  <span>Cover Page Manager</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-0.5">
                  Customize Laptop / Desktop layout &amp; Mobile Phone cover independently with instant live preview.
                </p>
              </div>

              {/* View Switcher: Segmented Toggle & Quick Save */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Segmented Toggle Pills */}
                <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setCoverSubView("desktop")}
                    className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      coverSubView === "desktop"
                        ? "bg-black text-white shadow-xs font-black"
                        : "text-stone-600 hover:text-black"
                    }`}
                  >
                    <span>💻 Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverSubView("mobile")}
                    className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      coverSubView === "mobile"
                        ? "bg-black text-white shadow-xs font-black"
                        : "text-stone-600 hover:text-black"
                    }`}
                  >
                    <span>📱 Mobile</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingCoverTexts(!isEditingCoverTexts)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                    isEditingCoverTexts
                      ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                      : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                  }`}
                >
                  {isEditingCoverTexts ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </>
                  ) : (
                    <>
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Cover Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ── SIDE-BY-SIDE: FORM CONTROLS (LEFT) + REAL-TIME PREVIEW (RIGHT) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* ── LEFT: FORM INPUTS FOR SELECTED VIEW ── */}
              <div className="xl:col-span-7 space-y-6">

                {!isEditingCoverTexts ? (
                  /* ── View Mode: Clean Cover Plaque Overview ── */
                  <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-400 border border-black" />
                        <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                          Cover Hero Overview ({coverSubView === "desktop" ? "Desktop Stage" : "Mobile Phone"})
                        </h3>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                        Locked View
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Hero Display Name</span>
                        <span className="font-black text-stone-900 text-base">{portfolio.personal.name || "HARSH ARYAN"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Current Role Pill</span>
                        <span className="font-bold text-stone-900">{portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"} @ {portfolio.personal.aboutWorkPlace || "IIT Madras"}</span>
                      </div>
                      <div className="sm:col-span-2 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">
                          {coverSubView === "desktop" ? "Desktop Subtitle / Headline" : "Mobile Handwritten Quote"}
                        </span>
                        <span className="text-stone-700 leading-relaxed block font-medium">
                          {coverSubView === "desktop"
                            ? (portfolio.personal.desktopHeadline || portfolio.personal.headline || "Exploring Data Science, Machine Learning Foundations & Scientific Computing")
                            : (portfolio.personal.mobileTagline || "Teaching Machines To Learn • Building Scientific Software")}
                        </span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Photo Tag Plaque</span>
                        <span className="font-bold text-amber-800">{portfolio.personal.desktopPhotoTag || "AI & DS"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Daily Spark Persona</span>
                        <span className="font-bold text-purple-700">{portfolio.personal.coverDailyThoughtHeader || "A LITTLE THOUGHT FOR TODAY"}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-dashed border-stone-200">
                      <span>Cover details locked. Click &ldquo;Edit Cover Details&rdquo; to modify.</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingCoverTexts(true)}
                        className="text-amber-700 hover:text-amber-900 font-black cursor-pointer"
                      >
                        ✏️ Edit Cover Details ↗
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Edit Mode: Form Inputs ── */
                  <div className="space-y-6">

                {/* ========================================================
                    SUB-VIEW A: DESKTOP / LAPTOP COVER CONFIGURATION
                ======================================================== */}
                {coverSubView === "desktop" && (
                  <div className="space-y-6">
                    {/* 1. Desktop Photo Frame Settings (Dedicated for PC / Desktop Cover) */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-500" />
                          <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                            1. Desktop Studio Photo Frame (PC Screen)
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-[10px] font-bold">
                          🖥️ PC / Laptop Only
                        </span>
                      </div>

                      {/* Photo URL */}
                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Desktop Cover Photo Link (Google Drive / Direct URL):
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/file/d/.../view"
                            value={portfolio.personal.desktopPhotoUrl || portfolio.personal.coverPhotoUrl || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  desktopPhotoUrl: e.target.value,
                                  coverPhotoUrl: e.target.value,
                                },
                              }))
                            }
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                          {(portfolio.personal.desktopPhotoUrl || portfolio.personal.coverPhotoUrl) && (
                            <button
                              type="button"
                              onClick={() =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    desktopPhotoUrl: "",
                                    coverPhotoUrl: "",
                                  },
                                }))
                              }
                              className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600 hover:text-red-600 font-mono text-xs cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Google Drive Status */}
                      {isGoogleDriveUrl(portfolio.personal.desktopPhotoUrl || portfolio.personal.coverPhotoUrl) && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="text-[11px]">
                            Google Drive link verified: <span className="font-bold">{extractGoogleDriveId(portfolio.personal.desktopPhotoUrl || portfolio.personal.coverPhotoUrl)}</span>
                          </div>
                        </div>
                      )}

                      {/* Photo Upload & Reset Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                          <span>Upload Image from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setIsSaving(true);
                                  setToastMessage("Optimizing image for PC cover frame...");
                                  const compressed = await compressImageFile(file);
                                  const updated = {
                                    ...portfolio,
                                    personal: {
                                      ...portfolio.personal,
                                      desktopPhotoUrl: compressed,
                                      coverPhotoUrl: compressed,
                                    },
                                  };
                                  setPortfolio(updated);
                                  await saveInstantly(updated, "✅ Desktop cover photo uploaded successfully!");
                                } catch (err) {
                                  alert("Failed to process image.");
                                } finally {
                                  setIsSaving(false);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>

                      <PhotoFramingControls
                        label="Desktop Cover Photo Framing (Zoom & Pan)"
                        zoom={portfolio.personal.desktopPhotoZoom ?? portfolio.personal.coverPhotoZoom ?? 1}
                        positionX={portfolio.personal.desktopPhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}
                        positionY={portfolio.personal.desktopPhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}
                        onChange={(updates) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: {
                              ...prev.personal,
                              ...(updates.zoom !== undefined && {
                                desktopPhotoZoom: updates.zoom,
                                coverPhotoZoom: updates.zoom,
                              }),
                              ...(updates.positionX !== undefined && {
                                desktopPhotoPositionX: updates.positionX,
                                coverPhotoPositionX: updates.positionX,
                              }),
                              ...(updates.positionY !== undefined && {
                                desktopPhotoPositionY: updates.positionY,
                                coverPhotoPositionY: updates.positionY,
                              }),
                            },
                          }))
                        }
                        onReset={() =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: {
                              ...prev.personal,
                              desktopPhotoZoom: 1,
                              desktopPhotoPositionX: 50,
                              desktopPhotoPositionY: 20,
                              coverPhotoZoom: 1,
                              coverPhotoPositionX: 50,
                              coverPhotoPositionY: 20,
                            },
                          }))
                        }
                      />

                      {/* Frame Overlay: Plaque Tag (Bottom-Right of Frame) */}
                      <div className="pt-2">
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Photo Plaque Tag (Bottom-Right of Frame):
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. AI & DS"
                          value={portfolio.personal.desktopPhotoTag ?? ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, desktopPhotoTag: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                        <span className="block font-mono text-[10px] text-stone-400 mt-1">
                          Studio photo frame ke niche right corner plaque me show hota hai (e.g. AI &amp; DS).
                        </span>
                      </div>
                    </div>

                    {/* 2. Desktop Name & Roles */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                        <User className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          2. Name Typography &amp; Roles (Right Column)
                        </h3>
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Hero Name Heading:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HARSH ARYAN"
                          value={portfolio.personal.name || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: {
                                ...prev.personal,
                                name: e.target.value,
                                desktopWordmark: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-sm font-bold focus:border-black focus:bg-white focus:outline-none"
                        />
                        <span className="block font-mono text-[10px] text-stone-400 mt-1">
                          Right column me bold display font me aur top brand header me render hota hai.
                        </span>
                      </div>

                      {/* Role & Workplace */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Current Role Title:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Data Science Intern or Research Fellow"
                            value={portfolio.personal.aboutCurrentWork ?? portfolio.personal.role ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  aboutCurrentWork: val,
                                  role: val,
                                  currentWork: val && prev.personal.aboutWorkPlace ? `${val} @ ${prev.personal.aboutWorkPlace}` : val,
                                },
                              }));
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Workplace / Institute:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Microsoft or IIT Bombay or IIT Madras"
                            value={portfolio.personal.aboutWorkPlace ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  aboutWorkPlace: val,
                                  college: val,
                                  currentWork: (prev.personal.aboutCurrentWork || prev.personal.role) && val ? `${prev.personal.aboutCurrentWork || prev.personal.role} @ ${val}` : prev.personal.currentWork,
                                },
                              }));
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Desktop Current Role Badge Toggle & Custom Color */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-mono text-xs font-black uppercase text-stone-900 block">
                              Desktop Role &amp; Workplace Badge:
                            </span>
                            <span className="font-mono text-[10px] text-stone-500">
                              Desktop cover par current role &amp; fellowship pill ko show ya hide karein
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              const base = portfolioRef.current || portfolio;
                              const nextVal = base.personal.showDesktopCurrentRole === false ? true : false;
                              const nextPort = {
                                ...base,
                                personal: {
                                  ...base.personal,
                                  showDesktopCurrentRole: nextVal,
                                },
                              };
                              setPortfolio(nextPort);
                              portfolioRef.current = nextPort;
                              await saveInstantly(
                                nextPort,
                                nextVal
                                  ? "✅ Desktop role pill is now VISIBLE on cover!"
                                  : "⚠️ Desktop role pill is now HIDDEN from cover!"
                              );
                            }}
                            className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer border ${
                              portfolio.personal.showDesktopCurrentRole !== false
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                                : "bg-stone-200 text-stone-600 border-stone-300"
                            }`}
                          >
                            <span>{portfolio.personal.showDesktopCurrentRole !== false ? "● SHOWN ON DESKTOP" : "○ HIDDEN"}</span>
                          </button>
                        </div>

                        {/* Role Track / Badge Color Link */}
                        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                          <span className="font-mono text-[11px] text-stone-600">
                            Pill Color Accent:{" "}
                            <span
                              className="font-black px-1.5 py-0.5 rounded border border-black/10"
                              style={{ color: portfolio.personal.coverRoleTrackColor || "#8b5cf6" }}
                            >
                              {portfolio.personal.coverRoleTrackColor || "Purple (Default)"}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab("badges")}
                            className="font-mono text-[10.5px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 cursor-pointer"
                          >
                            🎨 Change in Badges &amp; Persona ↗
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 3. Desktop Subtitle / Headline */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          3. Subtitle / Bio Headline
                        </h3>
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Desktop Subtitle Text:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Exploring Data Science, Machine Learning Foundations & Scientific Computing."
                          value={portfolio.personal.desktopHeadline || portfolio.personal.headline || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, desktopHeadline: e.target.value },
                            }))
                          }
                          className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 4. Desktop 7-Day Thought of the Day / Daily Spark & Persona Studio (MERGED) */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2.5 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-base">
                            ✨
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-black uppercase text-stone-900">
                                4. Weekly Sparks: 7 Days Daily Thoughts &amp; Persona Studio
                              </h3>
                              <span className="text-[9.5px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                                Unified Studio
                              </span>
                            </div>
                            <p className="font-mono text-xs text-stone-500">
                              Desktop cover ke daily thoughts, persona tag aur signature colors ko yahan ek hi jagah se live customize karein.
                            </p>
                          </div>
                        </div>

                        {/* View Switcher: Single Day Studio vs All 7 Days Grid */}
                        <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 self-start sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => setThoughtViewMode("tabs")}
                            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                              thoughtViewMode === "tabs"
                                ? "bg-black text-white shadow-xs font-black"
                                : "text-stone-600 hover:text-black"
                            }`}
                          >
                            Single Day Studio
                          </button>
                          <button
                            type="button"
                            onClick={() => setThoughtViewMode("grid")}
                            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                              thoughtViewMode === "grid"
                                ? "bg-black text-white shadow-xs font-black"
                                : "text-stone-600 hover:text-black"
                            }`}
                          >
                            All 7 Days Grid
                          </button>
                        </div>
                      </div>

                      {/* Header & Signature Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                            <span>Card Top Heading:</span>
                            <span className="text-stone-400 font-normal text-[10px]">Shown above quote</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. A LITTLE THOUGHT FOR TODAY"
                            value={portfolio.personal.coverDailyThoughtHeader || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, coverDailyThoughtHeader: e.target.value },
                              }))
                            }
                            onBlur={() => saveInstantly(portfolioRef.current, "Daily thought header saved!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                            <span>Bottom Signature:</span>
                            <span className="text-stone-400 font-normal text-[10px]">Shown below quote</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. — Harsh’s Daily Thoughts"
                            value={portfolio.personal.coverDailyThoughtSignature || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, coverDailyThoughtSignature: e.target.value },
                              }))
                            }
                            onBlur={() => saveInstantly(portfolioRef.current, "Daily thought signature saved!")}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* 7-Day Day Selector Bar */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono font-bold text-stone-600">
                          <span className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-stone-900 font-extrabold uppercase tracking-wide">
                              7 Days Daily Thoughts &amp; Persona Studio:
                            </span>
                            <span className="text-stone-400 font-normal">
                              (Har din ka unique thought &amp; signature persona color)
                            </span>
                          </span>
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Today is {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][todayWeekday]}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                          {activeThoughtsList.map((dayItem) => {
                            const isToday = dayItem.dayIndex === todayWeekday;
                            const isSelected = dayItem.dayIndex === selectedThoughtDay;
                            const DAY_EMOJIS = ["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"];
                            const dayColor = resolveDailyThoughtColor(
                              dayItem.dayIndex,
                              dayItem.personaColor || (isSelected ? portfolio.personal.coverPersonaColor : undefined)
                            );
                            const personaKeyword = (dayItem.persona || "").replace(/^The\s+/i, "");

                            return (
                              <button
                                key={dayItem.dayIndex}
                                type="button"
                                onClick={() => setSelectedThoughtDay(dayItem.dayIndex)}
                                className={`group relative p-2.5 sm:p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 overflow-hidden ${
                                  isSelected
                                    ? "bg-stone-950 text-white scale-[1.03] z-10"
                                    : "bg-white hover:bg-stone-50 border-stone-200 text-stone-800 hover:border-stone-400 hover:shadow-xs"
                                }`}
                                style={{
                                  borderColor: isSelected ? dayColor : undefined,
                                  boxShadow: isSelected ? `3px 3px 0 ${dayColor}` : undefined,
                                }}
                              >
                                {/* Top vibrant color accent bar */}
                                <div
                                  className="absolute top-0 left-0 right-0 h-1.5 transition-all"
                                  style={{ backgroundColor: dayColor }}
                                />

                                {/* Top Header: Day Name + Emoji + Live Indicator */}
                                <div className="flex items-center justify-between gap-1 w-full pt-1">
                                  <span className="font-mono text-xs font-black uppercase flex items-center gap-1.5">
                                    <span className="text-base shrink-0">{DAY_EMOJIS[dayItem.dayIndex] || "✦"}</span>
                                    <span className={isSelected ? "text-white" : "text-stone-900"}>
                                      {dayItem.dayName.slice(0, 3)}
                                    </span>
                                  </span>
                                  {isToday ? (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase flex items-center gap-1 bg-emerald-500 text-white shadow-2xs animate-pulse">
                                      ● Today
                                    </span>
                                  ) : (
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                      style={{ backgroundColor: dayColor }}
                                      title={`Signature color: ${dayColor}`}
                                    />
                                  )}
                                </div>

                                {/* Bottom Persona Badge (Full Persona Keyword in Day's Exact Color) */}
                                <div
                                  className="w-full px-1.5 py-1 rounded-lg border font-mono text-center transition-all flex items-center justify-center gap-1 overflow-hidden"
                                  style={{
                                    backgroundColor: `${dayColor}18`,
                                    borderColor: `${dayColor}55`,
                                    color: dayColor,
                                  }}
                                  title={dayItem.persona || "Persona"}
                                >
                                  <span className="text-[8.5px] shrink-0">✦</span>
                                  <span className="text-[10px] font-black uppercase tracking-tight truncate">
                                    {personaKeyword || "SPARK"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* MODE A: Single Day Focused Studio (MERGED Persona & Color & Quote) */}
                      {thoughtViewMode === "tabs" && (() => {
                        const currentDayItem = activeThoughtsList[selectedThoughtDay];
                        const defaultDayColor = DEFAULT_DAY_PERSONA_COLORS[selectedThoughtDay] || "#8b5cf6";
                        const activePersonaColor = resolveDailyThoughtColor(
                          selectedThoughtDay,
                          currentDayItem?.personaColor || portfolio.personal.coverPersonaColor
                        );

                        return (
                          <div className="space-y-5">
                            <div className="p-5 sm:p-6 rounded-3xl bg-amber-50/50 border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                              {/* Focused Day Top Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="text-2xl p-2 rounded-2xl bg-white border-2 shadow-2xs"
                                    style={{ borderColor: activePersonaColor }}
                                  >
                                    {["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"][selectedThoughtDay] || "📅"}
                                  </span>
                                  <div>
                                    <h4 className="font-['Space_Grotesk'] text-base sm:text-lg font-black uppercase text-stone-900 flex items-center gap-2">
                                      <span>{currentDayItem?.dayName}&apos;s Daily Thought &amp; Persona</span>
                                      <span
                                        className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                                        style={{ backgroundColor: activePersonaColor }}
                                        title={`Active Color: ${activePersonaColor}`}
                                      />
                                    </h4>
                                    <span className="font-mono text-xs text-stone-600 font-bold flex items-center gap-1.5">
                                      <span>Day #{selectedThoughtDay}</span>
                                      <span>•</span>
                                      <span className={selectedThoughtDay === todayWeekday ? "text-emerald-700 font-black" : "text-stone-500"}>
                                        {selectedThoughtDay === todayWeekday ? "● Active Live on Cover Today!" : `Scheduled for ${currentDayItem?.dayName}`}
                                      </span>
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => resetDailyThought(selectedThoughtDay)}
                                  className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-mono text-xs font-bold cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shadow-2xs active:translate-y-0.5"
                                  title="Reset this day to default quote & color"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Reset to Default</span>
                                </button>
                              </div>

                              {/* Two-Column Studio: Left Persona & Color vs Right Quote */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Left Column: Day Label + Persona Tag + Color Swatches (MERGED) */}
                                <div className="lg:col-span-5 space-y-4">
                                  <div>
                                    <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                                      Day Label:
                                    </label>
                                    <input
                                      type="text"
                                      value={currentDayItem?.dayName || ""}
                                      onChange={(e) => updateDailyThought(selectedThoughtDay, "dayName", e.target.value)}
                                      onBlur={() => saveInstantly(portfolioRef.current, "Day name updated!")}
                                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="block font-mono text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                                      <span>Persona / Author Tag:</span>
                                      <span className="text-purple-700 font-normal text-[10.5px]">Appears in pill</span>
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. The Creator, The Builder, The Philosopher..."
                                      value={currentDayItem?.persona || ""}
                                      onChange={(e) => updateDailyThought(selectedThoughtDay, "persona", e.target.value)}
                                      onBlur={() => saveInstantly(portfolioRef.current, "Persona tag updated!")}
                                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                                    />
                                  </div>

                                  {/* Merged Persona Pill Color Palette & Live Preview */}
                                  <div className="p-3.5 rounded-2xl bg-white border-2 border-black/15 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-xs font-bold text-stone-800">
                                        Persona Tag Color Accent:
                                      </span>
                                      {/* Live Persona Pill Preview */}
                                      <div
                                        className="px-3 py-1 rounded-full border-2 font-mono text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0_#000] transition-transform hover:scale-105"
                                        style={{
                                          backgroundColor: `${activePersonaColor}18`,
                                          color: activePersonaColor,
                                          borderColor: activePersonaColor,
                                        }}
                                      >
                                        <span>✦</span>
                                        <span>{currentDayItem?.persona || "The Persona"}</span>
                                      </div>
                                    </div>

                                    {/* Color Swatches (All 7 Days' Colors Included) */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {[
                                        { label: "Sunday (Purple)", color: "#8b5cf6" },
                                        { label: "Monday (Violet)", color: "#a855f7" },
                                        { label: "Tuesday (Orange)", color: "#f97316" },
                                        { label: "Wednesday (Cyan)", color: "#06b6d4" },
                                        { label: "Thursday (Emerald)", color: "#10b981" },
                                        { label: "Friday (Pink)", color: "#ec4899" },
                                        { label: "Saturday (Gold)", color: "#eab308" },
                                        { label: "Rose", color: "#f43f5e" },
                                        { label: "Indigo", color: "#6366f1" },
                                        { label: "Sky", color: "#0284c7" },
                                      ].map((pColor) => {
                                        const isCurColor = activePersonaColor.toLowerCase() === pColor.color.toLowerCase();
                                        return (
                                          <button
                                            key={pColor.color}
                                            type="button"
                                            onClick={() => {
                                              const updated = activeThoughtsList.map((item) =>
                                                item.dayIndex === selectedThoughtDay ? { ...item, personaColor: pColor.color } : item
                                              );
                                              const base = portfolioRef.current || portfolio;
                                              const nextPort = {
                                                ...base,
                                                dailyThoughts: updated,
                                                personal: { ...base.personal, coverPersonaColor: pColor.color },
                                              };
                                              setPortfolio(nextPort);
                                              portfolioRef.current = nextPort;
                                              saveInstantly(nextPort, `Persona color set to ${pColor.label}!`);
                                            }}
                                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer relative ${
                                              isCurColor
                                                ? "scale-115 border-black ring-2 ring-black/40 shadow-xs"
                                                : "border-white shadow-xs hover:scale-110"
                                            }`}
                                            style={{ backgroundColor: pColor.color }}
                                            title={pColor.label}
                                          >
                                            {isCurColor && (
                                              <span className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-black">
                                                ✓
                                              </span>
                                            )}
                                          </button>
                                        );
                                      })}

                                      {/* Reset to Day's Natural Color button */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = activeThoughtsList.map((item) =>
                                            item.dayIndex === selectedThoughtDay ? { ...item, personaColor: defaultDayColor } : item
                                          );
                                          const base = portfolioRef.current || portfolio;
                                          const nextPort = {
                                            ...base,
                                            dailyThoughts: updated,
                                            personal: { ...base.personal, coverPersonaColor: defaultDayColor },
                                          };
                                          setPortfolio(nextPort);
                                          portfolioRef.current = nextPort;
                                          saveInstantly(nextPort, `Synced persona color to ${currentDayItem?.dayName}'s default!`);
                                        }}
                                        className="text-[9.5px] font-mono font-bold text-stone-500 hover:text-black underline cursor-pointer ml-1"
                                        title={`Reset color to ${defaultDayColor}`}
                                      >
                                        Default Color
                                      </button>

                                      {/* Custom Color Input */}
                                      <div className="flex items-center gap-1 ml-auto">
                                        <span className="font-mono text-[9.5px] text-stone-500 font-bold">Custom:</span>
                                        <input
                                          type="color"
                                          value={activePersonaColor || defaultDayColor}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const updated = activeThoughtsList.map((item) =>
                                              item.dayIndex === selectedThoughtDay ? { ...item, personaColor: val } : item
                                            );
                                            const base = portfolioRef.current || portfolio;
                                            const nextPort = {
                                              ...base,
                                              dailyThoughts: updated,
                                              personal: { ...base.personal, coverPersonaColor: val },
                                            };
                                            setPortfolio(nextPort);
                                            portfolioRef.current = nextPort;
                                          }}
                                          onBlur={() => saveInstantly(portfolioRef.current, "Custom persona color saved!")}
                                          className="w-7 h-7 rounded-md border border-stone-300 p-0.5 cursor-pointer bg-white"
                                          title="Pick any custom hex color"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Column: Quote / Thought for Selected Day */}
                                <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <label className="block font-mono text-xs font-bold text-stone-700">
                                        Quote / Thought for {currentDayItem?.dayName}:
                                      </label>
                                      <span className="font-mono text-[10.5px] text-stone-500 font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                                        {(currentDayItem?.quote || "").length} characters
                                      </span>
                                    </div>
                                    <textarea
                                      rows={5}
                                      placeholder="Enter inspiring thought for this day..."
                                      value={currentDayItem?.quote || ""}
                                      onChange={(e) => updateDailyThought(selectedThoughtDay, "quote", e.target.value)}
                                      onBlur={() => saveInstantly(portfolioRef.current, `Thought for ${currentDayItem?.dayName} saved!`)}
                                      className="w-full p-4 rounded-2xl bg-white border-2 border-stone-300 font-mono text-xs leading-relaxed focus:border-black focus:outline-none"
                                    />
                                    <p className="font-mono text-[10.5px] text-stone-500 mt-1">
                                      💡 Tip: Live desktop cover par daily thought typewriter animation ke saath render hota hai.
                                    </p>
                                  </div>

                                  <div className="flex justify-end pt-2">
                                    <button
                                      type="button"
                                      onClick={() => saveInstantly(portfolioRef.current, `Thought for ${currentDayItem?.dayName} saved!`)}
                                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-0.5"
                                    >
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Save Day Changes</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Authentic Live Desktop Thought Card Mockup (Matches Live Site 1:1) */}
                            <div className="p-5 sm:p-6 rounded-3xl bg-stone-100 border border-stone-300 space-y-3">
                              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                                <span className="font-mono text-xs font-black uppercase text-stone-800 flex items-center gap-1.5">
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Live Desktop Cover Thought Card Mockup:</span>
                                </span>
                                <span className="text-[10px] font-mono text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 font-bold">
                                  Real-Time Preview
                                </span>
                              </div>

                              <div className="relative max-w-xl mx-auto p-5 sm:p-6 rounded-2xl bg-[#fffdf6] border-2 border-black shadow-[4px_4px_0_#000] space-y-3">
                                {/* Washi tape detail */}
                                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-amber-300/80 border border-black/20 shadow-xs rotate-[-1deg] rounded-xs pointer-events-none" />

                                {/* Top Bar: Copy Pill Button */}
                                <div className="flex justify-start">
                                  <div className="px-2.5 py-0.5 rounded-full border border-black/30 font-mono text-[9.5px] font-bold text-stone-700 bg-white shadow-2xs flex items-center gap-1">
                                    <span>✦</span>
                                    <span>Copy</span>
                                  </div>
                                </div>

                                {/* Heading Row with Live Persona Pill */}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1.5">
                                    <span style={{ color: activePersonaColor }} className="text-xs">✦</span>
                                    <span className="font-mono text-[10.5px] font-black uppercase text-stone-700 tracking-wider">
                                      {portfolio.personal.coverDailyThoughtHeader || "A LITTLE THOUGHT FOR TODAY"}
                                    </span>
                                    <span style={{ color: activePersonaColor }} className="text-xs">✦</span>
                                  </div>

                                  <span
                                    className="px-3 py-1 rounded-full border-2 text-[10.5px] font-mono font-black uppercase flex items-center gap-1 shadow-[2px_2px_0_#000] transition-all"
                                    style={{
                                      backgroundColor: `${activePersonaColor}18`,
                                      color: activePersonaColor,
                                      borderColor: activePersonaColor,
                                    }}
                                  >
                                    <span>✦</span>
                                    <span>{currentDayItem?.persona || "The Persona"}</span>
                                  </span>
                                </div>

                                {/* Quote with active quote marks */}
                                <p className="font-['Space_Grotesk'] text-sm sm:text-base font-bold text-stone-900 leading-relaxed italic border-l-2 pl-3" style={{ borderColor: activePersonaColor }}>
                                  <span style={{ color: activePersonaColor }} className="font-serif text-lg mr-1">&ldquo;</span>
                                  {currentDayItem?.quote || "Every great invention begins with an unreasonable idea."}
                                  <span style={{ color: activePersonaColor }} className="font-serif text-lg ml-1">&rdquo;</span>
                                </p>

                                {/* Bottom Signature & Click Here Badge */}
                                <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-200">
                                  <div className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black border-2 border-black font-mono text-[9px] font-black uppercase shadow-[2px_2px_0_#000] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                    <span>CLICK HERE 👆</span>
                                  </div>

                                  <div className="text-right">
                                    <span className="font-signature text-base sm:text-lg italic font-bold text-stone-700 block leading-none">
                                      {portfolio.personal.coverDailyThoughtSignature || "Harsh's Daily Thoughts ✦"}
                                    </span>
                                    <span className="font-mono text-[8.5px] text-stone-400">
                                      {selectedThoughtDay === todayWeekday ? "Active Live Today" : `Scheduled for ${currentDayItem?.dayName}`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* MODE B: All 7 Days Grid Editor */}
                      {thoughtViewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {activeThoughtsList.map((dayItem) => {
                            const isToday = dayItem.dayIndex === todayWeekday;
                            const DAY_EMOJIS = ["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"];
                            const dayColor = resolveDailyThoughtColor(dayItem.dayIndex, dayItem.personaColor);
                            const personaKeyword = (dayItem.persona || "").replace(/^The\s+/i, "");

                            return (
                              <div
                                key={dayItem.dayIndex}
                                className={`relative p-4 rounded-2xl border-2 transition-all space-y-3 overflow-hidden ${
                                  isToday
                                    ? "bg-amber-50/70 border-black shadow-[3px_3px_0_#f59e0b]"
                                    : "bg-white border-stone-200 shadow-xs"
                                }`}
                              >
                                {/* Top color strip */}
                                <div
                                  className="absolute top-0 left-0 right-0 h-1.5"
                                  style={{ backgroundColor: dayColor }}
                                />

                                <div className="flex items-center justify-between pb-2 border-b border-stone-100 pt-0.5">
                                  <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-stone-900">
                                    <span className="text-base">{DAY_EMOJIS[dayItem.dayIndex]}</span>
                                    <span>{dayItem.dayName}</span>
                                    {isToday && (
                                      <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-black">
                                        TODAY
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={dayColor}
                                      onChange={(e) => updateDailyThought(dayItem.dayIndex, "personaColor", e.target.value)}
                                      onBlur={() => saveInstantly(portfolioRef.current, `Saved ${dayItem.dayName} color!`)}
                                      className="w-5 h-5 rounded border border-stone-300 p-0 cursor-pointer bg-white shrink-0"
                                      title="Change this day's signature color"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => resetDailyThought(dayItem.dayIndex)}
                                      className="text-[10px] font-mono text-stone-400 hover:text-stone-800 cursor-pointer"
                                      title="Reset to default"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex-1">
                                      <label className="block font-mono text-[10px] font-bold text-stone-500 mb-0.5">
                                        Persona:
                                      </label>
                                      <input
                                        type="text"
                                        value={dayItem.persona}
                                        onChange={(e) => updateDailyThought(dayItem.dayIndex, "persona", e.target.value)}
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-stone-50 border border-stone-200 font-mono text-xs font-bold focus:border-black focus:bg-white focus:outline-none"
                                      />
                                    </div>
                                    <div className="shrink-0 pt-4">
                                      <span
                                        className="px-2.5 py-1 rounded-full border text-[9.5px] font-mono font-black flex items-center gap-1"
                                        style={{
                                          backgroundColor: `${dayColor}18`,
                                          color: dayColor,
                                          borderColor: dayColor,
                                        }}
                                      >
                                        <span>✦</span>
                                        <span className="max-w-[85px] truncate">{personaKeyword}</span>
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block font-mono text-[10px] font-bold text-stone-500 mb-0.5">
                                      Quote:
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={dayItem.quote}
                                      onChange={(e) => updateDailyThought(dayItem.dayIndex, "quote", e.target.value)}
                                      className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========================================================
                    SUB-VIEW B: MOBILE / PHONE COVER CONFIGURATION
                ======================================================== */}
                {coverSubView === "mobile" && (
                  <div className="space-y-6">
                    {/* 1. Mobile Photo Manager (Dedicated for Smartphone Cover) */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-500" />
                          <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                            1. Mobile Portrait Photo (Phone Cover)
                          </h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold">
                          📱 Smartphone Only
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-mono text-xs font-bold text-stone-700">
                            Mobile Photo Link (Google Drive ya Direct Link):
                          </label>
                          <span className="text-[10px] font-mono text-stone-400">
                            (PC aur About page se bilkul alag photo laga sakte hain)
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/file/d/.../view"
                            value={portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, mobilePhotoUrl: e.target.value },
                              }))
                            }
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                          {(portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl) && (
                            <button
                              type="button"
                              onClick={() =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, mobilePhotoUrl: "" },
                                }))
                              }
                              className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600 hover:text-red-600 font-mono text-xs cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Drive verified */}
                      {isGoogleDriveUrl(portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl) && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="text-[11px]">
                            Google Drive link verified: <span className="font-bold">{extractGoogleDriveId(portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl)}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                          <span>Select Mobile Image from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  setIsSaving(true);
                                  setToastMessage("Optimizing image for mobile...");
                                  const compressed = await compressImageFile(file);
                                  const updated = {
                                    ...portfolio,
                                    personal: { ...portfolio.personal, mobilePhotoUrl: compressed },
                                  };
                                  setPortfolio(updated);
                                  await saveInstantly(updated, "✅ Mobile cover photo updated successfully!");
                                } catch (err) {
                                  alert("Failed to process image.");
                                } finally {
                                  setIsSaving(false);
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      <PhotoFramingControls
                        label="Mobile Cover Photo Framing (Zoom & Pan)"
                        zoom={portfolio.personal.mobilePhotoZoom ?? portfolio.personal.coverPhotoZoom ?? 1}
                        positionX={portfolio.personal.mobilePhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}
                        positionY={portfolio.personal.mobilePhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}
                        onChange={(updates) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: {
                              ...prev.personal,
                              ...(updates.zoom !== undefined && { mobilePhotoZoom: updates.zoom }),
                              ...(updates.positionX !== undefined && { mobilePhotoPositionX: updates.positionX }),
                              ...(updates.positionY !== undefined && { mobilePhotoPositionY: updates.positionY }),
                            },
                          }))
                        }
                        onReset={() =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: {
                              ...prev.personal,
                              mobilePhotoZoom: 1,
                              mobilePhotoPositionX: 50,
                              mobilePhotoPositionY: 20,
                            },
                          }))
                        }
                      />
                    </div>

                    {/* 2. Mobile Name & Current Role */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                        <User className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          2. Phone Hero Name &amp; Role Badge
                        </h3>
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Phone Hero Name:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. HARSH ARYAN"
                          value={portfolio.personal.name || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, name: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-sm font-bold focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>

                      {/* Current Role Toggle Box */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black uppercase text-stone-900">
                            Mobile Current Role Badge:
                          </span>
                          <button
                            type="button"
                            onClick={async () => {
                              const base = portfolioRef.current || portfolio;
                              const nextVal = base.personal.showMobileCurrentRole === false ? true : false;
                              const nextPort = {
                                ...base,
                                personal: {
                                  ...base.personal,
                                  showMobileCurrentRole: nextVal,
                                },
                              };
                              setPortfolio(nextPort);
                              portfolioRef.current = nextPort;
                              await saveInstantly(
                                nextPort,
                                nextVal
                                  ? "✅ Mobile role pill is now VISIBLE on cover!"
                                  : "⚠️ Mobile role pill is now HIDDEN from cover!"
                              );
                            }}
                            className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer border ${
                              portfolio.personal.showMobileCurrentRole !== false
                                ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                                : "bg-stone-200 text-stone-600 border-stone-300"
                            }`}
                          >
                            <span>{portfolio.personal.showMobileCurrentRole !== false ? "● SHOWN ON COVER" : "○ HIDDEN"}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Role Title:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Teaching Assistant"
                              value={portfolio.personal.role ?? portfolio.personal.aboutCurrentWork ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    role: val,
                                    aboutCurrentWork: val,
                                    currentWork: val && prev.personal.aboutWorkPlace ? `${val} @ ${prev.personal.aboutWorkPlace}` : val,
                                  },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Workplace / College:
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. IIT Madras"
                              value={portfolio.personal.aboutWorkPlace ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutWorkPlace: val,
                                    college: val,
                                    currentWork: (prev.personal.aboutCurrentWork || prev.personal.role) && val ? `${prev.personal.aboutCurrentWork || prev.personal.role} @ ${val}` : prev.personal.currentWork,
                                  },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Mobile Role Track / Badge Color Link */}
                        <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                          <span className="font-mono text-[11px] text-stone-600">
                            Phone Role Color Accent:{" "}
                            <span
                              className="font-black px-1.5 py-0.5 rounded border border-black/10"
                              style={{ color: portfolio.personal.coverRoleTrackColor || "#8b5cf6" }}
                            >
                              {portfolio.personal.coverRoleTrackColor || "Purple (Default)"}
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveTab("badges")}
                            className="font-mono text-[10.5px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 cursor-pointer"
                          >
                            🎨 Change in Badges &amp; Persona ↗
                          </button>
                        </div>
                      </div>

                      {/* 2. Mobile Scrolling Ribbons Manager (Crossed Tickers) */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 space-y-4">
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <h4 className="font-mono text-xs font-black uppercase text-stone-900">
                              Mobile Scrolling Ribbons &amp; Tickers
                            </h4>
                          </div>

                          {/* Auto-Match Colors from Photo Action Button */}
                          <button
                            type="button"
                            onClick={async () => {
                              const pUrl = formatGoogleDriveImageUrl(portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl);
                              try {
                                const pal = await extractPhotoPalette(pUrl);
                                const nextPort = {
                                  ...portfolio,
                                  personal: {
                                    ...portfolio.personal,
                                    mobileScrollColor1: pal.dominant,
                                    mobileScrollTextColor1: "#000000",
                                    mobileScrollColor2: pal.secondary || "#000000",
                                    mobileScrollTextColor2: pal.accent || "#fde047",
                                    mobileCtaButtonBg: "#000000",
                                    mobileCtaButtonTextColor: "#ffffff",
                                    mobileCtaButtonShadowColor: pal.dominant,
                                    mobileClickHereBadgeBg: pal.accent || pal.dominant,
                                    mobileClickHereBadgeTextColor: "#000000",
                                    mobileCoverAutoPhotoColors: true,
                                    showMobileActivePill: false,
                                  },
                                };
                                setPortfolio(nextPort);
                                portfolioRef.current = nextPort;
                                saveInstantly(nextPort, "Auto-matched all cover colors from photo!");
                              } catch (e) {
                                alert("Photo colors sampled with default portfolio palette.");
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg bg-black text-white hover:bg-stone-800 font-mono text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer shadow-xs transition-transform hover:scale-[1.02]"
                            title="Automatically sample colors from your mobile cover photo"
                          >
                            <span>⚡ Auto-Match Photo Colors</span>
                          </button>
                        </div>

                        {/* Ribbon 1 (Top Ticker) */}
                        <div className="space-y-2">
                          <label className="block font-mono text-xs font-bold text-stone-800">
                            Ribbon #1 Text (Top Ticker Scrolling Left):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. TEACHING MACHINES TO LEARN ✦ BUILDING SCIENTIFIC SOFTWARE"
                            value={portfolio.personal.mobileScrollText1 ?? portfolio.personal.mobileTagline ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  mobileScrollText1: e.target.value,
                                  mobileTagline: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          />

                          {/* Ribbon 1 Colors */}
                          <div className="flex items-center gap-3 flex-wrap pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10.5px] font-bold text-stone-600">Ribbon #1 BG:</span>
                              {[
                                { label: "Amber Gold", hex: "#f59e0b" },
                                { label: "Jet Black", hex: "#000000" },
                                { label: "Emerald", hex: "#10b981" },
                                { label: "Rose", hex: "#f43f5e" },
                                { label: "Sky Blue", hex: "#0ea5e9" },
                                { label: "White", hex: "#ffffff" },
                              ].map((c) => {
                                const curr = portfolio.personal.mobileScrollColor1 || "#f59e0b";
                                const isSelected = curr.toLowerCase() === c.hex.toLowerCase();
                                return (
                                  <button
                                    key={c.hex}
                                    type="button"
                                    onClick={() =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileScrollColor1: c.hex },
                                      }))
                                    }
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-all ${
                                      isSelected
                                        ? "border-black bg-stone-900 text-white shadow-xs scale-105"
                                        : "border-stone-300 bg-white text-stone-700 hover:border-black"
                                    }`}
                                  >
                                    <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: c.hex }} />
                                    <span>{c.label}</span>
                                  </button>
                                );
                              })}
                              <input
                                type="color"
                                value={portfolio.personal.mobileScrollColor1 || "#f59e0b"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileScrollColor1: e.target.value },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer border border-black p-0"
                                title="Custom Color"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="font-mono text-[10.5px] font-bold text-stone-600">Text:</span>
                              <input
                                type="color"
                                value={portfolio.personal.mobileScrollTextColor1 || "#000000"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileScrollTextColor1: e.target.value },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer border border-black p-0"
                                title="Text Color"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Ribbon 2 (Bottom Ticker) */}
                        <div className="space-y-2 pt-2 border-t border-amber-200/70">
                          <label className="block font-mono text-xs font-bold text-stone-800">
                            Ribbon #2 Text (Bottom Ticker Scrolling Right):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. FULL-STACK AI ✦ DEEP LEARNING ✦ DATA SYSTEMS ✦ CREATIVE COMPUTING"
                            value={portfolio.personal.mobileScrollText2 ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, mobileScrollText2: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border-2 border-black font-mono text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          />

                          {/* Ribbon 2 Colors */}
                          <div className="flex items-center gap-3 flex-wrap pt-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10.5px] font-bold text-stone-600">Ribbon #2 BG:</span>
                              {[
                                { label: "Jet Black", hex: "#000000" },
                                { label: "Amber Gold", hex: "#f59e0b" },
                                { label: "Emerald", hex: "#10b981" },
                                { label: "Slate", hex: "#1e293b" },
                                { label: "Rose", hex: "#e11d48" },
                                { label: "White", hex: "#ffffff" },
                              ].map((c) => {
                                const curr = portfolio.personal.mobileScrollColor2 || "#000000";
                                const isSelected = curr.toLowerCase() === c.hex.toLowerCase();
                                return (
                                  <button
                                    key={c.hex}
                                    type="button"
                                    onClick={() =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileScrollColor2: c.hex },
                                      }))
                                    }
                                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-all ${
                                      isSelected
                                        ? "border-black bg-stone-900 text-white shadow-xs scale-105"
                                        : "border-stone-300 bg-white text-stone-700 hover:border-black"
                                    }`}
                                  >
                                    <span className="w-2.5 h-2.5 rounded-full border border-black/30" style={{ backgroundColor: c.hex }} />
                                    <span>{c.label}</span>
                                  </button>
                                );
                              })}
                              <input
                                type="color"
                                value={portfolio.personal.mobileScrollColor2 || "#000000"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileScrollColor2: e.target.value },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer border border-black p-0"
                                title="Custom Color"
                              />
                            </div>

                            <div className="flex items-center gap-1.5 ml-auto">
                              <span className="font-mono text-[10.5px] font-bold text-stone-600">Text:</span>
                              <input
                                type="color"
                                value={portfolio.personal.mobileScrollTextColor2 || "#fde047"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileScrollTextColor2: e.target.value },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer border border-black p-0"
                                title="Text Color"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. CTA Action Buttons & Angled Badge Styling */}
                      <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 space-y-4">
                        <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <h4 className="font-mono text-xs font-black uppercase text-stone-900">
                            CTA Button &amp; Action Badges Styling
                          </h4>
                        </div>

                        {/* CTA Button Text & Background & Shadow */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Main Button Text:
                            </label>
                            <input
                              type="text"
                              placeholder="EXPLORE PORTFOLIO"
                              value={portfolio.personal.mobileCtaButtonText ?? ""}
                              onChange={(e) =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, mobileCtaButtonText: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Button Background:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={portfolio.personal.mobileCtaButtonBg || "#000000"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileCtaButtonBg: e.target.value },
                                  }))
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                              />
                              <span className="font-mono text-[10px] text-stone-600 font-bold">
                                {portfolio.personal.mobileCtaButtonBg || "#000000"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Button 3D Shadow:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={portfolio.personal.mobileCtaButtonShadowColor || "#f59e0b"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileCtaButtonShadowColor: e.target.value },
                                  }))
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                              />
                              <span className="font-mono text-[10px] text-stone-600 font-bold">
                                {portfolio.personal.mobileCtaButtonShadowColor || "#f59e0b"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Angled Badge Text & Colors */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/70">
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Angled Badge Text:
                            </label>
                            <input
                              type="text"
                              placeholder="CLICK HERE ↓"
                              value={portfolio.personal.mobileClickHereBadgeText ?? ""}
                              onChange={(e) =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, mobileClickHereBadgeText: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Badge Color:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={portfolio.personal.mobileClickHereBadgeBg || "#f59e0b"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileClickHereBadgeBg: e.target.value },
                                  }))
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                              />
                              <span className="font-mono text-[10px] text-stone-600 font-bold">
                                {portfolio.personal.mobileClickHereBadgeBg || "#f59e0b"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Badge Text Color:
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={portfolio.personal.mobileClickHereBadgeTextColor || "#000000"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileClickHereBadgeTextColor: e.target.value },
                                  }))
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                              />
                              <span className="font-mono text-[10px] text-stone-600 font-bold">
                                {portfolio.personal.mobileClickHereBadgeTextColor || "#000000"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Bento Dossier Card Studio */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-300/80 space-y-5">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <h4 className="font-mono text-xs font-black uppercase text-stone-900">
                              🎴 Mobile Bento Dossier Card Studio
                            </h4>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            100% Themeable &amp; Interactive
                          </span>
                        </div>

                        {/* 1-Click Aesthetic Presets */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-[11px] font-bold text-stone-700">
                              ⚡ 1-Click Aesthetic Presets:
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              Click to instantly apply coordinated colorway
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                            {/* Preset 1: Vibrant Comic (Attached Screenshot Match) */}
                            <button
                              type="button"
                              onClick={() => {
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    mobileWashiTapeColor: "#facc15",
                                    mobileWashiTapeStyle: "striped",
                                    mobileNowBadgeText: "NOW",
                                    mobileNowBadgeBg: "#f43f5e",
                                    mobileNowBadgeTextColor: "#ffffff",
                                    mobileCenterTrackIcon: "🛸",
                                    mobileCenterTrackText: "INTERNSHIP · ACTIVE",
                                    mobileCenterTrackTextColor: "#000000",
                                    mobileRolePillText: "Data Science Intern",
                                    mobileRolePillIcon: "✦",
                                    mobileRolePillBg: "#fef08a",
                                    mobileRolePillBorder: "#8b5cf6",
                                    mobileRolePillTextColor: "#6d28d9",
                                    mobileWorkplacePillText: "IIT Madras",
                                    mobileWorkplacePillIcon: "✦",
                                    mobileWorkplacePillBg: "#bae6fd",
                                    mobileWorkplacePillBorder: "#8b5cf6",
                                    mobileWorkplacePillTextColor: "#0369a1",
                                    mobileSocialButtonStyle: "stickers",
                                    mobileConnectNote: "LET'S CONNECT",
                                    mobileConnectNoteColor: "#000000",
                                    mobileCardShadowColor: "#000000",
                                  },
                                }));
                              }}
                              className="px-2.5 py-2 rounded-xl border border-black/30 bg-white hover:bg-yellow-100 hover:border-black font-mono text-[10px] font-black flex flex-col items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] border border-black/30" />
                              </div>
                              <span>🎨 Comic Pastel</span>
                            </button>

                            {/* Preset 2: Portfolio Amber Neo */}
                            <button
                              type="button"
                              onClick={() => {
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    mobileWashiTapeColor: "#f59e0b",
                                    mobileWashiTapeStyle: "striped",
                                    mobileNowBadgeText: "NOW",
                                    mobileNowBadgeBg: "#18181b",
                                    mobileNowBadgeTextColor: "#f59e0b",
                                    mobileCenterTrackIcon: "⚗️",
                                    mobileCenterTrackText: "RESEARCH · ACTIVE",
                                    mobileCenterTrackTextColor: "#18181b",
                                    mobileRolePillText: "Teaching Assistant",
                                    mobileRolePillIcon: "✦",
                                    mobileRolePillBg: "#fef3c7",
                                    mobileRolePillBorder: "#d97706",
                                    mobileRolePillTextColor: "#78350f",
                                    mobileWorkplacePillText: "IIT Madras",
                                    mobileWorkplacePillIcon: "✦",
                                    mobileWorkplacePillBg: "#f1f5f9",
                                    mobileWorkplacePillBorder: "#0f172a",
                                    mobileWorkplacePillTextColor: "#0f172a",
                                    mobileSocialButtonStyle: "white",
                                    mobileConnectNote: "LET'S CONNECT",
                                    mobileConnectNoteColor: "#18181b",
                                    mobileCardShadowColor: "#f59e0b",
                                  },
                                }));
                              }}
                              className="px-2.5 py-2 rounded-xl border border-black/30 bg-white hover:bg-amber-100 hover:border-black font-mono text-[10px] font-black flex flex-col items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#18181b] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#fef3c7] border border-black/30" />
                              </div>
                              <span>🟡 Amber Neo</span>
                            </button>

                            {/* Preset 3: Cyber Matrix Mint */}
                            <button
                              type="button"
                              onClick={() => {
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    mobileWashiTapeColor: "#4ade80",
                                    mobileWashiTapeStyle: "striped",
                                    mobileNowBadgeText: "LIVE",
                                    mobileNowBadgeBg: "#059669",
                                    mobileNowBadgeTextColor: "#ffffff",
                                    mobileCenterTrackIcon: "⚡",
                                    mobileCenterTrackText: "AI & SYSTEMS · ACTIVE",
                                    mobileCenterTrackTextColor: "#065f46",
                                    mobileRolePillText: "ML Engineer",
                                    mobileRolePillIcon: "✦",
                                    mobileRolePillBg: "#d1fae5",
                                    mobileRolePillBorder: "#059669",
                                    mobileRolePillTextColor: "#065f46",
                                    mobileWorkplacePillText: "IIT Madras",
                                    mobileWorkplacePillIcon: "✦",
                                    mobileWorkplacePillBg: "#ccfbf1",
                                    mobileWorkplacePillBorder: "#0f766e",
                                    mobileWorkplacePillTextColor: "#115e59",
                                    mobileSocialButtonStyle: "stickers",
                                    mobileConnectNote: "DISPATCH NOW",
                                    mobileConnectNoteColor: "#065f46",
                                    mobileCardShadowColor: "#059669",
                                  },
                                }));
                              }}
                              className="px-2.5 py-2 rounded-xl border border-black/30 bg-white hover:bg-emerald-100 hover:border-black font-mono text-[10px] font-black flex flex-col items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#059669] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ccfbf1] border border-black/30" />
                              </div>
                              <span>🟢 Cyber Mint</span>
                            </button>

                            {/* Preset 4: Vaporwave Sunset */}
                            <button
                              type="button"
                              onClick={() => {
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    mobileWashiTapeColor: "#c084fc",
                                    mobileWashiTapeStyle: "striped",
                                    mobileNowBadgeText: "NOW",
                                    mobileNowBadgeBg: "#d946ef",
                                    mobileNowBadgeTextColor: "#ffffff",
                                    mobileCenterTrackIcon: "🚀",
                                    mobileCenterTrackText: "CREATIVE AI · ACTIVE",
                                    mobileCenterTrackTextColor: "#831843",
                                    mobileRolePillText: "Research Fellow",
                                    mobileRolePillIcon: "✦",
                                    mobileRolePillBg: "#fce7f3",
                                    mobileRolePillBorder: "#ec4899",
                                    mobileRolePillTextColor: "#9d174d",
                                    mobileWorkplacePillText: "IIT Madras",
                                    mobileWorkplacePillIcon: "✦",
                                    mobileWorkplacePillBg: "#ede9fe",
                                    mobileWorkplacePillBorder: "#8b5cf6",
                                    mobileWorkplacePillTextColor: "#5b21b6",
                                    mobileSocialButtonStyle: "stickers",
                                    mobileConnectNote: "LET'S BUILD",
                                    mobileConnectNoteColor: "#831843",
                                    mobileCardShadowColor: "#8b5cf6",
                                  },
                                }));
                              }}
                              className="px-2.5 py-2 rounded-xl border border-black/30 bg-white hover:bg-fuchsia-100 hover:border-black font-mono text-[10px] font-black flex flex-col items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#d946ef] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#fce7f3] border border-black/30" />
                              </div>
                              <span>🟣 Vaporwave</span>
                            </button>

                            {/* Preset 5: Dark Neo-Brutalist */}
                            <button
                              type="button"
                              onClick={() => {
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    mobileWashiTapeColor: "#e4e4e7",
                                    mobileWashiTapeStyle: "striped",
                                    mobileNowBadgeText: "NOW",
                                    mobileNowBadgeBg: "#27272a",
                                    mobileNowBadgeTextColor: "#ffffff",
                                    mobileCenterTrackIcon: "✦",
                                    mobileCenterTrackText: "ENGINEERING · ACTIVE",
                                    mobileCenterTrackTextColor: "#000000",
                                    mobileRolePillText: "Teaching Assistant",
                                    mobileRolePillIcon: "✦",
                                    mobileRolePillBg: "#f4f4f5",
                                    mobileRolePillBorder: "#000000",
                                    mobileRolePillTextColor: "#000000",
                                    mobileWorkplacePillText: "IIT Madras",
                                    mobileWorkplacePillIcon: "✦",
                                    mobileWorkplacePillBg: "#e2e8f0",
                                    mobileWorkplacePillBorder: "#000000",
                                    mobileWorkplacePillTextColor: "#000000",
                                    mobileSocialButtonStyle: "white",
                                    mobileConnectNote: "LET'S CONNECT",
                                    mobileConnectNoteColor: "#000000",
                                    mobileCardShadowColor: "#000000",
                                  },
                                }));
                              }}
                              className="px-2.5 py-2 rounded-xl border border-black/30 bg-white hover:bg-stone-200 hover:border-black font-mono text-[10px] font-black flex flex-col items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#e4e4e7] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#27272a] border border-black/30" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#000000] border border-black/30" />
                              </div>
                              <span>🖤 Dark Brutalist</span>
                            </button>
                          </div>
                        </div>

                        {/* Tape & Frame Section */}
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-3">
                          <h5 className="font-mono text-[11px] font-black uppercase text-stone-900 flex items-center gap-1.5">
                            <span>📌</span> Washi Tape &amp; Bento 3D Shadow
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Washi Tape Color:
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={portfolio.personal.mobileWashiTapeColor || "#facc15"}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileWashiTapeColor: e.target.value },
                                    }))
                                  }
                                  className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                                />
                                <span className="font-mono text-[10px] text-stone-600 font-bold">
                                  {portfolio.personal.mobileWashiTapeColor || "#facc15"}
                                </span>
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Tape Pattern Style:
                              </label>
                              <select
                                value={portfolio.personal.mobileWashiTapeStyle || "striped"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileWashiTapeStyle: e.target.value },
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                              >
                                <option value="striped">Striped Japanese Texture</option>
                                <option value="solid">Solid Sticker</option>
                                <option value="dots">Polka Dots Craft Tape</option>
                                <option value="none">Hidden / None</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Card 3D Hard Shadow Color:
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={portfolio.personal.mobileCardShadowColor || "#000000"}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileCardShadowColor: e.target.value },
                                    }))
                                  }
                                  className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                                />
                                <span className="font-mono text-[10px] text-stone-600 font-bold">
                                  {portfolio.personal.mobileCardShadowColor || "#000000"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Top Row: NOW Pill & Center Track */}
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-3">
                          <h5 className="font-mono text-[11px] font-black uppercase text-stone-900 flex items-center gap-1.5">
                            <span>🛸</span> Top Row: NOW Indicator &amp; Mandate Track
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                NOW Badge Text:
                              </label>
                              <input
                                type="text"
                                placeholder="NOW"
                                value={portfolio.personal.mobileNowBadgeText ?? ""}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileNowBadgeText: e.target.value },
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                NOW Badge Colors:
                              </label>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileNowBadgeBg || "#f43f5e"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileNowBadgeBg: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                    title="Background"
                                  />
                                  <span className="font-mono text-[8px] text-stone-500">bg</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileNowBadgeTextColor || "#ffffff"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileNowBadgeTextColor: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                    title="Text Color"
                                  />
                                  <span className="font-mono text-[8px] text-stone-500">text</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Center Icon / Emoji:
                              </label>
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  placeholder="🛸"
                                  value={portfolio.personal.mobileCenterTrackIcon ?? ""}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileCenterTrackIcon: e.target.value },
                                    }))
                                  }
                                  className="w-12 px-2 py-1.5 text-center rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                                />
                                <div className="flex gap-1 flex-wrap">
                                  {["🛸", "⚗️", "⚡", "✦", "🚀", "💻"].map((ico) => (
                                    <button
                                      key={ico}
                                      type="button"
                                      onClick={() =>
                                        setPortfolio((prev) => ({
                                          ...prev,
                                          personal: { ...prev.personal, mobileCenterTrackIcon: ico },
                                        }))
                                      }
                                      className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-xs flex items-center justify-center cursor-pointer"
                                    >
                                      {ico}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Center Mandate Text:
                              </label>
                              <input
                                type="text"
                                placeholder="INTERNSHIP · ACTIVE"
                                value={portfolio.personal.mobileCenterTrackText ?? ""}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileCenterTrackText: e.target.value },
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Middle Row: Two Capsule Pills (Role & Workplace) */}
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-3">
                          <h5 className="font-mono text-[11px] font-black uppercase text-stone-900 flex items-center gap-1.5">
                            <span>✦</span> Middle Row: Role &amp; Workplace Capsules
                          </h5>

                          {/* Pill 1: Role Capsule */}
                          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-2">
                            <span className="font-mono text-[10px] font-black uppercase text-amber-900">
                              Capsule 1 (Role):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Role Text:</label>
                                <input
                                  type="text"
                                  placeholder="Data Science Intern"
                                  value={portfolio.personal.mobileRolePillText ?? ""}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileRolePillText: e.target.value },
                                    }))
                                  }
                                  className="w-full px-2 py-1 rounded-lg bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Pill Background:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileRolePillBg || "#fef08a"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileRolePillBg: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileRolePillBg || "#fef08a"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Border Color:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileRolePillBorder || "#8b5cf6"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileRolePillBorder: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileRolePillBorder || "#8b5cf6"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Text Color:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileRolePillTextColor || "#6d28d9"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileRolePillTextColor: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileRolePillTextColor || "#6d28d9"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pill 2: Workplace Capsule */}
                          <div className="p-3 rounded-lg bg-sky-50/50 border border-sky-200/80 space-y-2">
                            <span className="font-mono text-[10px] font-black uppercase text-sky-900">
                              Capsule 2 (Workplace):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Workplace Text:</label>
                                <input
                                  type="text"
                                  placeholder="IIT Madras"
                                  value={portfolio.personal.mobileWorkplacePillText ?? ""}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileWorkplacePillText: e.target.value },
                                    }))
                                  }
                                  className="w-full px-2 py-1 rounded-lg bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Pill Background:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileWorkplacePillBg || "#bae6fd"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileWorkplacePillBg: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileWorkplacePillBg || "#bae6fd"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Border Color:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileWorkplacePillBorder || "#8b5cf6"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileWorkplacePillBorder: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileWorkplacePillBorder || "#8b5cf6"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] text-stone-600 mb-0.5">Text Color:</label>
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="color"
                                    value={portfolio.personal.mobileWorkplacePillTextColor || "#0369a1"}
                                    onChange={(e) =>
                                      setPortfolio((prev) => ({
                                        ...prev,
                                        personal: { ...prev.personal, mobileWorkplacePillTextColor: e.target.value },
                                      }))
                                    }
                                    className="w-7 h-7 rounded cursor-pointer border border-black p-0.5"
                                  />
                                  <span className="font-mono text-[9.5px] text-stone-600 font-bold">
                                    {portfolio.personal.mobileWorkplacePillTextColor || "#0369a1"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Social Connect & Doodle Arrow */}
                        <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-3">
                          <h5 className="font-mono text-[11px] font-black uppercase text-stone-900 flex items-center gap-1.5">
                            <span>⤷</span> Bottom Row: Social Connect Buttons &amp; Arrow Note
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Social Buttons Style:
                              </label>
                              <select
                                value={portfolio.personal.mobileSocialButtonStyle || "stickers"}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileSocialButtonStyle: e.target.value },
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                              >
                                <option value="stickers">Pastel Stickers (GitHub, Sky LinkedIn, Rose Mail)</option>
                                <option value="white">Classic 3D White Stickers</option>
                                <option value="dark">Dark Brutalist Monochrome</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Arrow Note Text:
                              </label>
                              <input
                                type="text"
                                placeholder="LET'S CONNECT"
                                value={portfolio.personal.mobileConnectNote ?? ""}
                                onChange={(e) =>
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: { ...prev.personal, mobileConnectNote: e.target.value },
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[10.5px] font-bold text-stone-700 mb-1">
                                Arrow Note Color:
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={portfolio.personal.mobileConnectNoteColor || "#000000"}
                                  onChange={(e) =>
                                    setPortfolio((prev) => ({
                                      ...prev,
                                      personal: { ...prev.personal, mobileConnectNoteColor: e.target.value },
                                    }))
                                  }
                                  className="w-8 h-8 rounded cursor-pointer border border-black p-0.5"
                                />
                                <span className="font-mono text-[10px] text-stone-600 font-bold">
                                  {portfolio.personal.mobileConnectNoteColor || "#000000"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Mobile Social Links */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                        <Send className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          3. Social Connect Links (Cover &amp; Mobile Sticker)
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">GitHub URL:</label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={portfolio.socialLinks.github || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, github: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">LinkedIn URL:</label>
                          <input
                            type="text"
                            placeholder="https://linkedin.com/in/..."
                            value={portfolio.socialLinks.linkedin || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">Email Address:</label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={portfolio.personal.email || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, email: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingCoverTexts(false)}
                        className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Save &amp; Lock Cover View</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: REAL-TIME LIVE VISUAL PREVIEW (STICKY) ── */}
              <div className="xl:col-span-5 sticky top-20 space-y-3">
                {/* Preview Header Card */}
                <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-black uppercase">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Live Real-Time Preview</span>
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {coverSubView === "desktop" ? "💻 Desktop" : "📱 Mobile"}
                  </span>
                </div>

                {/* ── DESKTOP COVER MINIATURE PREVIEW ── */}
                {coverSubView === "desktop" && (
                  <div className="p-4 rounded-3xl bg-[#edf6fa] dark:bg-[#0c0d12] border-2 border-black dark:border-stone-700 shadow-lg space-y-3 overflow-hidden select-none">
                    <div className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-black/10">
                      <span>Desktop 2-Column Hero Stage</span>
                      <span className="text-emerald-600 font-bold">● Active View</span>
                    </div>

                    {/* Miniature 2-Column Grid */}
                    <div className="grid grid-cols-12 gap-3 items-center pt-1">
                      {/* Left: Studio Photo Frame */}
                      <div className="col-span-5">
                        <div className="relative rounded-2xl bg-white dark:bg-stone-900 border-2 border-black p-2 shadow-[3px_3px_0_#000] space-y-1.5">
                          <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-stone-200 border border-black/30">
                            <img
                              src={formatGoogleDriveImageUrl(portfolio.personal.desktopPhotoUrl || portfolio.personal.coverPhotoUrl)}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                              style={{
                                objectPosition: `${portfolio.personal.desktopPhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}% ${portfolio.personal.desktopPhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}%`,
                                transform: `scale(${portfolio.personal.desktopPhotoZoom ?? portfolio.personal.coverPhotoZoom ?? 1})`,
                                transformOrigin: `${portfolio.personal.desktopPhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}% ${portfolio.personal.desktopPhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}%`,
                              }}
                            />
                          </div>
                          {/* Lower Plaque */}
                          <div className="flex items-center justify-between text-[8px] font-mono font-bold pt-0.5 border-t border-dashed border-stone-300">
                            <span className="truncate font-signature text-sm font-bold italic text-black leading-tight rotate-[-1deg]">{portfolio.personal.name || "Harsh Aryan"}</span>
                            <span className="text-amber-600 font-extrabold text-[7.5px]">{portfolio.personal.desktopPhotoTag || "AI & DS"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Name & Details */}
                      <div className="col-span-7 space-y-1.5 text-left">
                        {/* Name */}
                        <div className="font-hero-heading text-lg font-black uppercase tracking-tight text-black dark:text-white leading-none truncate">
                          {portfolio.personal.name || "HARSH ARYAN"}
                        </div>

                        {/* Role Pill (Respects Desktop Show/Hide & Custom Color) */}
                        {portfolio.personal.showDesktopCurrentRole !== false && (
                          <div
                            className="inline-flex items-center gap-1 py-0.5 px-2 rounded-lg bg-amber-100 border border-black text-[8px] font-mono font-bold shadow-[1px_1px_0_#000]"
                            style={portfolio.personal.coverRoleTrackColor ? { borderColor: portfolio.personal.coverRoleTrackColor } : undefined}
                          >
                            <span
                              className="w-1 h-1 rounded-full bg-emerald-500"
                              style={portfolio.personal.coverRoleTrackColor ? { backgroundColor: portfolio.personal.coverRoleTrackColor } : undefined}
                            />
                            <span className="font-black text-black truncate max-w-[90px]">
                              {portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"}
                            </span>
                            <span className="text-stone-400">•</span>
                            <span
                              className="text-amber-700 font-black truncate max-w-[70px]"
                              style={portfolio.personal.coverRoleTrackColor ? { color: portfolio.personal.coverRoleTrackColor } : undefined}
                            >
                              {portfolio.personal.aboutWorkPlace || "IIT Madras"}
                            </span>
                          </div>
                        )}

                        {/* Subtitle */}
                        <p className="text-[7.5px] font-mono text-stone-600 line-clamp-2 leading-tight">
                          {portfolio.personal.desktopHeadline || portfolio.personal.headline || "Exploring Data Science, Machine Learning Foundations & Scientific Computing"}
                        </p>

                        {/* Action Buttons Mock */}
                        <div className="flex items-center gap-1 pt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-indigo-600 text-white font-mono text-[6.5px] font-black uppercase shadow-xs">
                            Projects ↗
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-white text-black border border-black font-mono text-[6.5px] font-bold shadow-xs">
                            About
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-white text-black border border-black font-mono text-[6.5px] font-bold shadow-xs">
                            Contact
                          </span>
                        </div>

                        {/* Miniature Daily Spark Note Box */}
                        {(() => {
                          const miniDayColor = resolveDailyThoughtColor(
                            selectedThoughtDay,
                            activeThoughtsList[selectedThoughtDay]?.personaColor || portfolio.personal.coverPersonaColor
                          );

                          return (
                            <div className="mt-2 p-1.5 rounded-lg bg-white/90 dark:bg-stone-900/90 border border-black/20 shadow-[1.5px_1.5px_0_#000] text-[7.5px] font-mono space-y-0.5">
                              <div className="flex items-center justify-between text-[6.5px] font-black" style={{ color: miniDayColor }}>
                                <span>✦ {portfolio.personal.coverDailyThoughtHeader || "A LITTLE THOUGHT FOR TODAY"}</span>
                                <span
                                  className="px-1 py-0.2 rounded text-[6px] border font-bold"
                                  style={{
                                    backgroundColor: `${miniDayColor}20`,
                                    color: miniDayColor,
                                    borderColor: miniDayColor,
                                  }}
                                >
                                  {activeThoughtsList[selectedThoughtDay]?.persona || "Daily Spark"}
                                </span>
                              </div>
                              <p className="italic text-stone-800 dark:text-stone-200 line-clamp-1">
                                &quot;{activeThoughtsList[selectedThoughtDay]?.quote || "Teach machines to learn. Never stop learning yourself."}&quot;
                              </p>
                              <div className="flex items-center justify-between text-[6px] text-stone-500 pt-0.5">
                                <span className="font-bold" style={{ color: miniDayColor }}>
                                  Preview: {activeThoughtsList[selectedThoughtDay]?.dayName || "Today"}
                                </span>
                                <span>{portfolio.personal.coverDailyThoughtSignature || "— Harsh’s Daily Thoughts"}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-center text-stone-500 pt-1 border-t border-black/10">
                      💡 Desktop cover changes are saved directly into the CMS.
                    </div>
                  </div>
                )}

                {/* ── MOBILE COVER REALISTIC PHONE MOCKUP PREVIEW (MATCHES UPLOADED DESIGN 1:1) ── */}
                {coverSubView === "mobile" && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-[510px] rounded-[40px] p-2.5 bg-stone-900 border-4 border-stone-800 shadow-2xl overflow-hidden flex flex-col select-none">
                      {/* Phone Screen Container with Graph Paper Background */}
                      <div
                        className="relative w-full h-full rounded-[28px] overflow-hidden bg-[#fffdfa] flex flex-col justify-between"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, rgba(0, 0, 0, 0.055) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.055) 1px, transparent 1px)
                          `,
                          backgroundSize: "16px 16px",
                        }}
                      >
                        {/* 1. Background Portrait Photo with Comic Doodles */}
                        <div className="relative w-full h-[215px] shrink-0 overflow-hidden bg-stone-100">
                          <img
                            src={formatGoogleDriveImageUrl(portfolio.personal.mobilePhotoUrl || portfolio.personal.coverPhotoUrl)}
                            alt="Cover Mobile Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{
                              objectPosition: `${portfolio.personal.mobilePhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}% ${portfolio.personal.mobilePhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}%`,
                              transform: `scale(${portfolio.personal.mobilePhotoZoom ?? portfolio.personal.coverPhotoZoom ?? 1})`,
                              transformOrigin: `${portfolio.personal.mobilePhotoPositionX ?? portfolio.personal.coverPhotoPositionX ?? 50}% ${portfolio.personal.mobilePhotoPositionY ?? portfolio.personal.coverPhotoPositionY ?? 20}%`,
                            }}
                          />

                          {/* Top Right Theme Pill: 🔴 DARK */}
                          <div className="absolute top-2.5 right-2.5 z-20">
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-black border border-black font-mono font-black text-[7.5px] uppercase shadow-[1px_1px_0_#000]">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span>DARK</span>
                            </span>
                          </div>

                          {/* Paper Plane Doodle with Loop Trail (Top-Left) */}
                          <div className="absolute top-2 left-2 w-20 h-14 pointer-events-none z-15">
                            <svg viewBox="0 0 110 70" fill="none" className="w-full h-full">
                              <path
                                d="M 6 52 C 16 62, 38 60, 42 40 C 46 18, 20 18, 26 34 C 32 48, 62 44, 82 22"
                                stroke="#38bdf8"
                                strokeWidth="2.4"
                                strokeDasharray="4 4"
                                fill="none"
                              />
                              <g transform="translate(82, 16) rotate(16)">
                                <polygon points="0,0 22,8 5,12" fill="#ffffff" stroke="#000000" strokeWidth="1.8" />
                                <polygon points="22,8 0,18 5,12" fill="#e0f2fe" stroke="#000000" strokeWidth="1.8" />
                                <polygon points="5,12 11,20 12,13" fill="#93c5fd" stroke="#000000" strokeWidth="1.8" />
                              </g>
                            </svg>
                          </div>

                          {/* Pink Heart Doodle (Mid-Left) */}
                          <div className="absolute top-[32%] left-3.5 w-4 h-4 pointer-events-none z-15 rotate-[-12deg]">
                            <svg viewBox="0 0 24 24" fill="#f472b6" stroke="#000000" strokeWidth="2" className="w-full h-full">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </div>

                          {/* Halftone Dotted Cluster */}
                          <div className="absolute top-[26%] left-2 pointer-events-none z-10 opacity-60 grid grid-cols-3 gap-1">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <span key={i} className="w-0.5 h-0.5 rounded-full bg-cyan-700" />
                            ))}
                          </div>

                          {/* Cyan Zigzag Doodle (Right) */}
                          <div className="absolute top-[28%] right-4 w-9 h-4 pointer-events-none z-15">
                            <svg viewBox="0 0 46 18" fill="none" className="w-full h-full">
                              <path
                                d="M 3 9 L 9 3 L 16 11 L 23 3 L 30 11 L 37 3 L 43 9"
                                stroke="#06b6d4"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          {/* Mini Sparkles */}
                          <span className="absolute top-[37%] right-6 pointer-events-none z-15 text-[#f97316] font-bold text-xs">✦</span>
                          <span className="absolute top-[42%] right-10 pointer-events-none z-15 text-[#10b981] font-black text-[10px]">+</span>

                          {/* Smooth Bottom Frosted Fade */}
                          <div
                            className="absolute bottom-0 inset-x-0 h-20 pointer-events-none backdrop-blur-md"
                            style={{
                              WebkitMaskImage: "linear-gradient(to top, black 25%, transparent 100%)",
                              maskImage: "linear-gradient(to top, black 25%, transparent 100%)",
                            }}
                          />
                          <div
                            className="absolute bottom-0 inset-x-0 h-12 pointer-events-none bg-gradient-to-t from-[#fffdfa] via-[#fffdfa]/50 to-transparent"
                            style={{
                              WebkitMaskImage: "linear-gradient(to top, black 35%, transparent 100%)",
                              maskImage: "linear-gradient(to top, black 35%, transparent 100%)",
                            }}
                          />
                        </div>

                        {/* 2. Crossed Angled Ribbons (Uses dynamic colors & text from state) */}
                        <div className="relative w-full -mt-4 z-20 overflow-hidden pointer-events-none flex flex-col items-center">
                          {/* Ribbon 1 */}
                          <div
                            className="w-[115%] py-0.5 border-y border-black shadow-[1.5px_1.5px_0_#000] overflow-hidden"
                            style={{
                              transform: "rotate(-2.2deg)",
                              backgroundColor: portfolio.personal.mobileScrollColor1 || "#f59e0b",
                            }}
                          >
                            <div
                              className="whitespace-nowrap font-mono text-[6.5px] font-black uppercase tracking-widest px-1"
                              style={{ color: portfolio.personal.mobileScrollTextColor1 || "#000000" }}
                            >
                              {portfolio.personal.mobileScrollText1 || portfolio.personal.mobileTagline || "TEACHING MACHINES TO LEARN ✦ BUILDING SCIENTIFIC SOFTWARE ✦"}
                            </div>
                          </div>
                          {/* Ribbon 2 */}
                          <div
                            className="w-[115%] py-0.5 -mt-1 border-y border-black shadow-[1.5px_1.5px_0_#000] overflow-hidden"
                            style={{
                              transform: "rotate(1.8deg)",
                              backgroundColor: portfolio.personal.mobileScrollColor2 || "#000000",
                            }}
                          >
                            <div
                              className="whitespace-nowrap font-mono text-[6px] font-black uppercase tracking-widest px-1"
                              style={{ color: portfolio.personal.mobileScrollTextColor2 || "#fde047" }}
                            >
                              {portfolio.personal.mobileScrollText2 || "FULL-STACK AI ✦ DEEP LEARNING ✦ DATA SYSTEMS ✦ CREATIVE CODE ✦"}
                            </div>
                          </div>
                        </div>

                        {/* 3. Hero Name: HARSH ARYAN — Crisp, Legible & Portfolio Aligned */}
                        <div className="relative z-20 text-center my-0.5 px-2">
                          <div
                            className="font-hero-heading text-lg font-black uppercase tracking-tight leading-none select-none whitespace-nowrap text-stone-900"
                            style={{
                              fontFamily: "'Amanojaku', 'Dela Gothic One', 'Syne', system-ui, sans-serif",
                              textShadow: "1.5px 1.5px 0 #ffffff, -1.5px -1.5px 0 #ffffff, 1.5px -1.5px 0 #ffffff, -1.5px 1.5px 0 #ffffff, 2px 2px 0 #000000",
                            }}
                          >
                            {portfolio.personal.name || "HARSH ARYAN"}
                          </div>
                        </div>

                        {/* 4. Bento Dossier Card Pinned with Signature Washi Tape */}
                        <div className="relative z-20 px-3 w-full my-auto">
                          {/* Washi Tape */}
                          {portfolio.personal.mobileWashiTapeStyle !== "none" && (
                            <div
                              className="w-16 h-2.5 border border-dashed border-black/40 shadow-xs mx-auto -mb-1 z-20 relative rounded-xs pointer-events-none"
                              style={{
                                transform: "rotate(-1.5deg)",
                                backgroundColor: portfolio.personal.mobileWashiTapeColor || "#facc15",
                                backgroundImage:
                                  (portfolio.personal.mobileWashiTapeStyle || "striped") === "striped"
                                    ? "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0, rgba(255, 255, 255, 0.4) 4px, transparent 4px, transparent 8px)"
                                    : undefined,
                              }}
                            />
                          )}

                          {/* Card Body */}
                          <div
                            className="w-full rounded-2xl p-2.5 border-2 flex flex-col gap-1.5"
                            style={{
                              backgroundColor: portfolio.personal.mobileCardBg || "#ffffff",
                              borderColor: portfolio.personal.mobileCardBorder || "#000000",
                              boxShadow: `3.5px 3.5px 0 ${
                                portfolio.personal.mobileCardShadowColor || "#000000"
                              }`,
                            }}
                          >
                            {/* Row 1: Header */}
                            <div className="flex items-center justify-between w-full">
                              <span
                                className="px-1.5 py-0.2 rounded-full border border-black font-mono text-[6.5px] font-black uppercase inline-flex items-center gap-0.5"
                                style={{
                                  backgroundColor:
                                    portfolio.personal.mobileNowBadgeBg ||
                                    portfolio.personal.mobileClickHereBadgeBg ||
                                    "#f43f5e",
                                  color: portfolio.personal.mobileNowBadgeTextColor || "#ffffff",
                                }}
                              >
                                <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                                <span>{portfolio.personal.mobileNowBadgeText || "NOW"}</span>
                              </span>
                              <div
                                className="flex items-center gap-1 font-mono text-[7px] font-black uppercase tracking-wider text-stone-900"
                                style={
                                  portfolio.personal.mobileCenterTrackTextColor
                                    ? { color: portfolio.personal.mobileCenterTrackTextColor }
                                    : undefined
                                }
                              >
                                <span>
                                  {portfolio.personal.mobileCenterTrackIcon ||
                                    portfolio.personal.aboutRoleIcon ||
                                    "🛸"}
                                </span>
                                <span>
                                  {portfolio.personal.mobileCenterTrackText || "INTERNSHIP · ACTIVE"}
                                </span>
                              </div>
                            </div>

                            {/* Row 2: Pills */}
                            <div className="flex items-center justify-center gap-1 flex-wrap w-full">
                              <div
                                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full border font-mono text-[7px] font-black"
                                style={{
                                  backgroundColor: portfolio.personal.mobileRolePillBg || "#fef08a",
                                  borderColor: portfolio.personal.mobileRolePillBorder || "#8b5cf6",
                                  color: portfolio.personal.mobileRolePillTextColor || "#6d28d9",
                                  boxShadow: `1px 1px 0 ${
                                    portfolio.personal.mobileRolePillBorder || "#8b5cf6"
                                  }`,
                                }}
                              >
                                <span className="text-[6px]">
                                  {portfolio.personal.mobileRolePillIcon ?? "✦"}
                                </span>
                                <span>
                                  {portfolio.personal.mobileRolePillText ||
                                    portfolio.personal.aboutCurrentWork ||
                                    portfolio.personal.role ||
                                    "Data Science Intern"}
                                </span>
                              </div>
                              <div
                                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full border font-mono text-[7px] font-black"
                                style={{
                                  backgroundColor: portfolio.personal.mobileWorkplacePillBg || "#bae6fd",
                                  borderColor:
                                    portfolio.personal.mobileWorkplacePillBorder || "#8b5cf6",
                                  color:
                                    portfolio.personal.mobileWorkplacePillTextColor || "#0369a1",
                                  boxShadow: `1px 1px 0 ${
                                    portfolio.personal.mobileWorkplacePillBorder || "#8b5cf6"
                                  }`,
                                }}
                              >
                                <span className="text-[6px]">
                                  {portfolio.personal.mobileWorkplacePillIcon ?? "✦"}
                                </span>
                                <span>
                                  {portfolio.personal.mobileWorkplacePillText ||
                                    (portfolio.personal.aboutWorkPlace
                                      ? `@ ${portfolio.personal.aboutWorkPlace}`
                                      : "@ IIT Madras")}
                                </span>
                              </div>
                            </div>

                            {/* Row 3: Circular Social Icons + Curved Arrow */}
                            <div className="flex items-center justify-between w-full pt-1 border-t border-dashed border-stone-300">
                              <div className="flex items-center gap-1">
                                <span
                                  className={`w-5 h-5 rounded-full border border-black shadow-[1px_1px_0_#000] text-[6.5px] font-black flex items-center justify-center ${
                                    portfolio.personal.mobileSocialButtonStyle === "dark"
                                      ? "bg-stone-900 text-white border-white"
                                      : "bg-[#f8fafc] text-black"
                                  }`}
                                >
                                  GH
                                </span>
                                <span
                                  className={`w-5 h-5 rounded-full border border-black shadow-[1px_1px_0_#000] text-[6.5px] font-black flex items-center justify-center ${
                                    portfolio.personal.mobileSocialButtonStyle === "dark"
                                      ? "bg-stone-900 text-sky-400 border-white"
                                      : portfolio.personal.mobileSocialButtonStyle === "white"
                                      ? "bg-white text-[#0284c7]"
                                      : "bg-[#e0f2fe] text-[#0284c7]"
                                  }`}
                                >
                                  in
                                </span>
                                <span
                                  className={`w-5 h-5 rounded-full border border-black shadow-[1px_1px_0_#000] text-[6.5px] font-black flex items-center justify-center ${
                                    portfolio.personal.mobileSocialButtonStyle === "dark"
                                      ? "bg-stone-900 text-rose-400 border-white"
                                      : portfolio.personal.mobileSocialButtonStyle === "white"
                                      ? "bg-white text-rose-500"
                                      : "bg-[#ffe4e6] text-[#e11d48]"
                                  }`}
                                >
                                  ✉
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg
                                  width="20"
                                  height="11"
                                  viewBox="0 0 34 20"
                                  fill="none"
                                  className="rotate-[-6deg] text-black"
                                >
                                  <path
                                    d="M30 4 C 18 2, 7 7, 5 16"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M2 11 L 5 17 L 10 14"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div
                                  className="font-mono font-black text-[6px] uppercase tracking-wider leading-tight text-stone-900 text-left"
                                  style={
                                    portfolio.personal.mobileConnectNoteColor
                                      ? { color: portfolio.personal.mobileConnectNoteColor }
                                      : undefined
                                  }
                                >
                                  <span>
                                    {portfolio.personal.mobileConnectNote || "LET'S CONNECT"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 5. CTA Area: CLICK HERE badge + Explore Portfolio Button */}
                        <div className="relative z-20 px-3 pb-2.5 w-full flex flex-col items-center">
                          <div className="w-full flex justify-end pr-2 -mb-1.5 z-20 pointer-events-none">
                            <span
                              className="px-1.5 py-0.2 rounded-full border border-black font-mono text-[6.5px] font-black uppercase shadow-[1px_1px_0_#000] rotate-[-2.5deg] flex items-center gap-0.5"
                              style={{
                                backgroundColor: portfolio.personal.mobileClickHereBadgeBg || "#f59e0b",
                                color: portfolio.personal.mobileClickHereBadgeTextColor || "#000000",
                              }}
                            >
                              <span>{portfolio.personal.mobileClickHereBadgeText || "CLICK HERE ↓"}</span>
                            </span>
                          </div>
                          <div
                            className="w-full py-1.5 px-2.5 rounded-full border border-black flex items-center justify-between"
                            style={{
                              backgroundColor: portfolio.personal.mobileCtaButtonBg || "#000000",
                              color: portfolio.personal.mobileCtaButtonTextColor || "#ffffff",
                              boxShadow: `2.5px 2.5px 0 ${portfolio.personal.mobileCtaButtonShadowColor || "#f59e0b"}`,
                            }}
                          >
                            <span
                              className="font-mono text-[7.5px] font-black uppercase tracking-wider flex items-center gap-1 pl-1"
                              style={{ color: portfolio.personal.mobileCtaButtonTextColor || "#ffffff" }}
                            >
                              <span style={{ color: portfolio.personal.mobileCtaButtonShadowColor || "#f59e0b" }}>✦</span>
                              <span>{portfolio.personal.mobileCtaButtonText || "EXPLORE PORTFOLIO"}</span>
                            </span>
                            <span
                              className="w-4 h-4 rounded-full border border-black flex items-center justify-center font-black text-[8px]"
                              style={{
                                backgroundColor: portfolio.personal.mobileCtaButtonShadowColor || "#f59e0b",
                                color: "#000000",
                              }}
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="mt-2 text-[10px] font-mono text-stone-500">
                      📱 Real-time smartphone preview (1:1 with live cover)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: ABOUT & DOSSIER MANAGER ── */}
        {activeTab === "about" && (
          <div className="space-y-6">

            {/* Quick Sub-Section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              {[
                { id: "all", label: "✦ All Profile & Bio", count: "2" },
                { id: "identity", label: "🪪 Photo & Plaque", count: "Mount" },
                { id: "bio", label: "✍️ Statement, Bio & Highlighter", count: "Colors" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setAboutSubView(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    aboutSubView === sub.id
                      ? "bg-white text-stone-950 font-black shadow-xs border border-stone-300"
                      : "text-stone-600 hover:text-black font-bold hover:bg-white/60"
                  }`}
                >
                  <span>{sub.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      aboutSubView === sub.id
                        ? "bg-amber-300 text-stone-900"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            {/* ── 1. FRAMED PHOTO & IDENTITY PLAQUE ── */}
            {(aboutSubView === "all" || aboutSubView === "identity") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-stone-900 text-amber-300 border border-black text-sm">
                      🖼️
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        1. Studio Photo Frame &amp; Identity Plaque
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        Bespoke architectural photo frame (Washi tape mount) aur frame ke integrated lower chin details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setIsEditingPhotoCard(!isEditingPhotoCard)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        isEditingPhotoCard
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {isEditingPhotoCard ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Plaque Details</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                      Left Mount
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: View Mode vs Edit Mode (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Section Header & Subtitle Central Link */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">🏷️</span>
                        <span className="font-mono text-xs font-bold text-stone-700">
                          About Heading:
                        </span>
                        <span className="font-mono text-xs font-black text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-300">
                          &ldquo;{portfolio.personal.aboutHeading || "Behind the Terminal"}&rdquo;
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("sublines")}
                        className="font-mono text-[10.5px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 cursor-pointer self-start sm:self-auto hover:bg-amber-100 transition-colors"
                      >
                        ✏️ Edit in Headlines Tab ↗
                      </button>
                    </div>

                    {!isEditingPhotoCard ? (
                      /* ── View Mode: Clean Overview Plaque ── */
                      <div className="space-y-3.5 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <span className="font-mono text-xs font-black uppercase text-stone-700">Plaque Overview</span>
                          <span className="text-[10px] font-mono text-stone-400">Locked</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 rounded-xl bg-white border border-stone-200">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Signature Name</span>
                            <span className="font-black text-stone-900 text-sm font-signature">{portfolio.personal.name || "Harsh Aryan"}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-stone-200">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Active Role &amp; Org</span>
                            <span className="font-bold text-stone-900">{portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"} @ {portfolio.personal.aboutWorkPlace || "IIT Madras"}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-stone-200">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Role Tag</span>
                            <span className="font-bold text-indigo-700">{portfolio.personal.aboutRoleTag || "CS5002P"}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-stone-200">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Location</span>
                            <span className="font-bold text-stone-900">{portfolio.personal.location || "Chennai, India"}</span>
                          </div>
                          <div className="sm:col-span-2 p-3 rounded-xl bg-white border border-stone-200">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Education</span>
                            <span className="font-bold text-stone-900">{portfolio.personal.aboutEducationDegree || "BS in Data Science & Applications"} • {portfolio.personal.aboutEducationCollege || "IIT Madras"}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400">
                          <span>Click &ldquo;Edit Plaque Details&rdquo; above to modify these inputs.</span>
                          <button
                            type="button"
                            onClick={() => setIsEditingPhotoCard(true)}
                            className="text-amber-700 hover:text-amber-900 font-bold"
                          >
                            ✏️ Edit Inputs ↗
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Edit Mode: Form Inputs ── */
                      <div className="space-y-4">

                    {/* Photo Source Input */}
                    <div>
                      <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                        Framed Photo URL (Google Drive ya Direct Link):
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                          value={portfolio.personal.aboutPhotoUrl || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, aboutPhotoUrl: e.target.value },
                            }))
                          }
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                        {portfolio.personal.aboutPhotoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutPhotoUrl: "" },
                              }))
                            }
                            className="px-3 py-1.5 rounded-xl border border-stone-300 text-stone-600 hover:text-red-600 font-mono text-xs cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Drive verified indicator */}
                    {isGoogleDriveUrl(portfolio.personal.aboutPhotoUrl) && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="text-[11px]">
                          Google Drive Link Verified: File ID <span className="font-bold">{extractGoogleDriveId(portfolio.personal.aboutPhotoUrl)}</span> (Auto-converts to high-res thumbnail)
                        </div>
                      </div>
                    )}

                    {/* Device Upload & Reset Default */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <label className="px-3.5 py-2 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                        <span>📁 Upload Photo From Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setIsSaving(true);
                                setToastMessage("Compressing & saving image...");
                                const compressed = await compressImageFile(file);
                                const updated = {
                                  ...portfolio,
                                  personal: { ...portfolio.personal, aboutPhotoUrl: compressed },
                                };
                                setPortfolio(updated);
                                await saveInstantly(updated, "✅ About photo uploaded & saved!");
                              } catch {
                                alert("Failed to process image.");
                              } finally {
                                setIsSaving(false);
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    <PhotoFramingControls
                      label="About Photo Framing (Zoom & Pan)"
                      zoom={portfolio.personal.aboutPhotoZoom ?? 1}
                      positionX={portfolio.personal.aboutPhotoPositionX ?? 50}
                      positionY={portfolio.personal.aboutPhotoPositionY ?? 20}
                      onChange={(updates) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            ...(updates.zoom !== undefined && { aboutPhotoZoom: updates.zoom }),
                            ...(updates.positionX !== undefined && { aboutPhotoPositionX: updates.positionX }),
                            ...(updates.positionY !== undefined && { aboutPhotoPositionY: updates.positionY }),
                          },
                        }))
                      }
                      onReset={() =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            aboutPhotoZoom: 1,
                            aboutPhotoPositionX: 50,
                            aboutPhotoPositionY: 20,
                          },
                        }))
                      }
                    />

                    {/* ── LOWER CHIN DETAILS (Integrated Identity Plaque) ── */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-300 space-y-3.5">
                      <div className="font-mono text-xs font-black uppercase text-stone-900 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <span>🪪</span>
                          <span>Frame Lower Chin Identity Details:</span>
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold">
                          Live On About Frame
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Signature Plaque Name:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.name || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, name: e.target.value },
                              }))
                            }
                            onBlur={() => saveInstantly(portfolioRef.current, "Signature plaque name saved!")}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            placeholder="HARSH ARYAN"
                          />
                          <p className="font-mono text-[9.5px] text-stone-500 mt-0.5">
                            Photo mount ke neeche signature style me render hota hai.
                          </p>
                        </div>

                        {/* ── Active Role / Job Module ── */}
                        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-200/80">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="font-mono text-xs font-bold text-stone-800">
                                Active Engagement (Job / Internship / Research)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const nextVal = portfolio.personal.showAboutRole === false;
                                const nextPort = {
                                  ...portfolio,
                                  personal: { ...portfolio.personal, showAboutRole: nextVal },
                                };
                                setPortfolio(nextPort);
                                portfolioRef.current = nextPort;
                                saveInstantly(nextPort, nextVal ? "Active role unhidden on photo card!" : "Active role hidden from photo card!");
                              }}
                              className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border cursor-pointer transition-all ${
                                portfolio.personal.showAboutRole !== false
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-400 hover:bg-emerald-200"
                                  : "bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300"
                              }`}
                            >
                              <span>{portfolio.personal.showAboutRole !== false ? "● UNHIDDEN (SHOWN)" : "○ HIDDEN"}</span>
                            </button>
                          </div>

                          {/* Track / Nature Selector Pills */}
                          <div className="space-y-2">
                            <label className="block font-mono text-[11px] font-bold text-stone-700 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span>Role Nature / Track:</span>
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  Auto Syncs Icons &amp; Color
                                </span>
                              </span>
                              <span className="text-stone-500 font-normal text-[10px]">Changes style &amp; icons</span>
                            </label>

                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                              {[
                                { id: "auto", label: "Auto", icon: "🤖", color: "#10b981", badge: "Smart Auto" },
                                { id: "research", label: "Research", icon: "🔬", color: "#06b6d4", badge: "Cyan Lab" },
                                { id: "internship", label: "Intern", icon: "💼", color: "#f59e0b", badge: "Amber Tech" },
                                { id: "job", label: "Tech Job", icon: "⚡", color: "#10b981", badge: "Emerald Pro" },
                                { id: "academic", label: "TA / Acad", icon: "🎓", color: "#10b981", badge: "Emerald Edu" },
                                { id: "fellowship", label: "Fellow", icon: "🏆", color: "#8b5cf6", badge: "Purple Scholar" },
                              ].map((track) => {
                                const isSelected = (portfolio.personal.aboutRoleType || "auto") === track.id;
                                return (
                                  <button
                                    key={track.id}
                                    type="button"
                                    onClick={() => {
                                      const chosenColor = track.id === "auto" ? "" : track.color;
                                      const nextPort = {
                                        ...portfolio,
                                        personal: {
                                          ...portfolio.personal,
                                          aboutRoleType: track.id,
                                          coverRoleTrackColor: chosenColor,
                                        },
                                      };
                                      setPortfolio(nextPort);
                                      portfolioRef.current = nextPort;
                                      saveInstantly(nextPort, `Role track set to ${track.label} & synced color (${track.color})!`);
                                    }}
                                    className={`px-2 py-2 rounded-xl border-2 font-mono text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                                      isSelected
                                        ? "bg-black text-white shadow-[2px_2px_0_rgba(0,0,0,0.25)] scale-[1.03]"
                                        : "bg-white text-stone-700 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                                    }`}
                                    style={isSelected ? { borderColor: track.color } : undefined}
                                  >
                                    <span className="text-sm" style={{ filter: isSelected ? "drop-shadow(0 0 4px rgba(255,255,255,0.4))" : undefined }}>
                                      {track.icon}
                                    </span>
                                    <span className="leading-tight text-center">{track.label}</span>
                                    <span
                                      className="w-2 h-2 rounded-full border border-black/20"
                                      style={{ backgroundColor: track.color }}
                                      title={`Track signature color: ${track.color}`}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active Color Palette & Custom Swatches for Role & Icons */}
                            {(() => {
                              const activeTrackObj = resolveRoleTrack(
                                portfolio.personal.aboutCurrentWork || portfolio.personal.role || "",
                                portfolio.personal.aboutWorkPlace || "",
                                portfolio.personal.aboutRoleType,
                                portfolio.personal.coverRoleTrackColor,
                                portfolio.personal.aboutRoleStatusText,
                                portfolio.personal.aboutRoleIcon,
                                portfolio.personal.aboutRoleCardStyle
                              );

                              return (
                                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 mt-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="w-3 h-3 rounded-full border border-black/30 animate-pulse"
                                        style={{ backgroundColor: activeTrackObj.activeColor }}
                                      />
                                      <span className="font-mono text-[10.5px] font-bold text-stone-800">
                                        Card Thematic Accent Color:
                                      </span>
                                      <span
                                        className="font-mono text-[10px] font-black px-1.5 py-0.5 rounded border border-black/15 uppercase"
                                        style={{
                                          color: activeTrackObj.activeColor,
                                          backgroundColor: `${activeTrackObj.activeColor}18`,
                                        }}
                                      >
                                        {portfolio.personal.coverRoleTrackColor
                                          ? `${portfolio.personal.coverRoleTrackColor.toUpperCase()} (Custom)`
                                          : `${activeTrackObj.activeColor.toUpperCase()} (Portfolio Thematic)`}
                                      </span>
                                    </div>

                                    {portfolio.personal.coverRoleTrackColor && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextPort = {
                                            ...portfolio,
                                            personal: {
                                              ...portfolio.personal,
                                              coverRoleTrackColor: "",
                                            },
                                          };
                                          setPortfolio(nextPort);
                                          portfolioRef.current = nextPort;
                                          saveInstantly(nextPort, "Reset icon & badge color to track default!");
                                        }}
                                        className="text-[9.5px] font-mono font-bold text-stone-500 hover:text-rose-600 underline cursor-pointer"
                                      >
                                        Reset to Auto
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono text-[9.5px] text-stone-400 mr-1">Quick Presets:</span>
                                    {[
                                      { label: "Amber Gold (Portfolio Theme)", color: "#f59e0b" },
                                      { label: "Emerald (TA / Academic)", color: "#10b981" },
                                      { label: "Sky (Systems & Tech)", color: "#0284c7" },
                                      { label: "Cyan (Research)", color: "#06b6d4" },
                                      { label: "Purple (Fellowship)", color: "#8b5cf6" },
                                      { label: "Rose (Lead / Core)", color: "#f43f5e" },
                                      { label: "Jet Black (Mono Brutalist)", color: "#000000" },
                                    ].map((preset) => {
                                      const activeHex = (portfolio.personal.coverRoleTrackColor || activeTrackObj.activeColor || "").toLowerCase();
                                      const isCurrent = activeHex === preset.color.toLowerCase();
                                      return (
                                        <button
                                          key={preset.color}
                                          type="button"
                                          onClick={() => {
                                            const nextPort = {
                                              ...portfolio,
                                              personal: {
                                                ...portfolio.personal,
                                                coverRoleTrackColor: preset.color,
                                              },
                                            };
                                            setPortfolio(nextPort);
                                            portfolioRef.current = nextPort;
                                            saveInstantly(nextPort, `Icon & Role color set to ${preset.label}!`);
                                          }}
                                          className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer relative ${
                                            isCurrent ? "scale-115 border-black ring-2 ring-black/40 shadow-xs" : "border-white shadow-xs hover:scale-110"
                                          }`}
                                          style={{ backgroundColor: preset.color }}
                                          title={preset.label}
                                        >
                                          {isCurrent && (
                                            <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black">
                                              ✓
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}

                                    {/* Custom Color Input */}
                                    <div className="flex items-center gap-1 ml-auto">
                                      <span className="font-mono text-[9.5px] text-stone-500 font-bold">Custom:</span>
                                      <input
                                        type="color"
                                        value={portfolio.personal.coverRoleTrackColor || activeTrackObj.activeColor || "#f59e0b"}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          const nextPort = {
                                            ...portfolio,
                                            personal: {
                                              ...portfolio.personal,
                                              coverRoleTrackColor: val,
                                            },
                                          };
                                          setPortfolio(nextPort);
                                          portfolioRef.current = nextPort;
                                        }}
                                        onBlur={() => saveInstantly(portfolioRef.current, "Custom role icon color saved!")}
                                        className="w-7 h-7 rounded-md border border-stone-300 p-0.5 cursor-pointer bg-white"
                                        title="Choose any custom hex color for role & icons"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Live Status Badge Text */}
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Live Status Badge Text:</span>
                              <span className="text-amber-700 font-normal">Upper left status pill</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. RESEARCH · ACTIVE or TA · ACTIVE or BUILDER · ACTIVE"
                              value={portfolio.personal.aboutRoleStatusText ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutRoleStatusText: val,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Status badge text updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            />
                            {/* Suggestions */}
                            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                              <span className="font-mono text-[9px] text-stone-400">Suggestions:</span>
                              {[
                                "RESEARCH · ACTIVE",
                                "TA · ACTIVE",
                                "BUILDER · ACTIVE",
                                "WORK · ACTIVE",
                                "FELLOW · ACTIVE",
                                "OPEN TO COLLAB",
                              ].map((suggestion) => (
                                <button
                                  key={suggestion}
                                  type="button"
                                  onClick={() => {
                                    const nextPort = {
                                      ...portfolio,
                                      personal: { ...portfolio.personal, aboutRoleStatusText: suggestion },
                                    };
                                    setPortfolio(nextPort);
                                    portfolioRef.current = nextPort;
                                    saveInstantly(nextPort, `Status badge set to ${suggestion}!`);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-white hover:bg-stone-100 border border-stone-200 font-mono text-[9px] font-bold text-stone-700 cursor-pointer"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Track Focus Icon / Emoji */}
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Track Focus Icon / Emoji:</span>
                              <span className="text-stone-500 font-normal">Displays next to live status</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="e.g. ⚗️"
                                value={portfolio.personal.aboutRoleIcon ?? "⚗️"}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPortfolio((prev) => ({
                                    ...prev,
                                    personal: {
                                      ...prev.personal,
                                      aboutRoleIcon: val,
                                    },
                                  }));
                                }}
                                onBlur={() => saveInstantly(portfolioRef.current, "Role icon updated!")}
                                className="w-16 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-sm text-center font-bold text-stone-900 focus:border-black focus:outline-none"
                              />
                              <div className="flex items-center gap-1 flex-wrap">
                                {["⚗️", "🔬", "⚡", "💼", "🎓", "🏆", "🚀", "✦", "💻", "🧠"].map((emoji) => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => {
                                      const nextPort = {
                                        ...portfolio,
                                        personal: { ...portfolio.personal, aboutRoleIcon: emoji },
                                      };
                                      setPortfolio(nextPort);
                                      portfolioRef.current = nextPort;
                                      saveInstantly(nextPort, `Role icon set to ${emoji}!`);
                                    }}
                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center text-sm cursor-pointer transition-all ${
                                      (portfolio.personal.aboutRoleIcon || "⚗️") === emoji
                                        ? "bg-stone-900 text-white border-black scale-110 shadow-xs"
                                        : "bg-white text-stone-700 border-stone-200 hover:border-black"
                                    }`}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Card Style Mode */}
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Card Border &amp; Texture Theme:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {[
                                { id: "paper", label: "Neo-Brutalist Paper", desc: "Black 2px border + 3D shadow (Portfolio Classic)" },
                                { id: "bordered", label: "Theme Accent Border", desc: "Border colored in theme accent" },
                                { id: "tinted", label: "Thematic Tint Wash", desc: "Subtle background gradient tint" },
                              ].map((styleOpt) => {
                                const isSel = (portfolio.personal.aboutRoleCardStyle || "paper") === styleOpt.id;
                                return (
                                  <button
                                    key={styleOpt.id}
                                    type="button"
                                    onClick={() => {
                                      const nextPort = {
                                        ...portfolio,
                                        personal: { ...portfolio.personal, aboutRoleCardStyle: styleOpt.id },
                                      };
                                      setPortfolio(nextPort);
                                      portfolioRef.current = nextPort;
                                      saveInstantly(nextPort, `Card style set to ${styleOpt.label}!`);
                                    }}
                                    className={`p-2 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                                      isSel
                                        ? "bg-black text-white border-black shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
                                        : "bg-white text-stone-700 border-stone-200 hover:border-black"
                                    }`}
                                  >
                                    <div className="text-[10px] font-bold leading-tight">{styleOpt.label}</div>
                                    <div className="text-[8px] opacity-75 mt-0.5 leading-snug">{styleOpt.desc}</div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Role / Title:</span>
                              <span className="text-stone-500 font-normal">e.g. Data Science Intern</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Data Science Intern or Research Fellow"
                              value={portfolio.personal.aboutCurrentWork ?? portfolio.personal.role ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutCurrentWork: val,
                                    role: val,
                                    currentWork: val && prev.personal.aboutWorkPlace ? `${val} @ ${prev.personal.aboutWorkPlace}` : val,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Role badge updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            />
                            <p className="font-mono text-[9.5px] text-stone-500 mt-0.5">
                              Photo chin ka role title (e.g. Research Fellow, Data Science Intern).
                            </p>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Institution / Company Badge:</span>
                              <span className="text-amber-700 font-normal">Amber chip</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Microsoft or IIT Bombay or IIT Madras"
                              value={portfolio.personal.aboutWorkPlace ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutWorkPlace: val,
                                    currentWork: (prev.personal.aboutCurrentWork || prev.personal.role) && val ? `${prev.personal.aboutCurrentWork || prev.personal.role} @ ${val}` : prev.personal.currentWork,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Workplace badge updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            />
                            <p className="font-mono text-[9.5px] text-stone-500 mt-0.5">
                              Role ke theek saath organization badge (e.g. IIT Bombay, Microsoft).
                            </p>
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Right-hand Tag / Focus Area (Optional):</span>
                              <span className="text-stone-400 font-normal text-[10px]">Leave blank for auto tag</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. AI Research Lab or Industry Tech or Summer 2026"
                              value={portfolio.personal.aboutRoleTag ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutRoleTag: val,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Role tag updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* ── Education Module (Hide / Unhideable) ── */}
                        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-200/80">
                            <div className="flex items-center gap-1.5">
                              <GraduationCap className="w-4 h-4 text-sky-700" />
                              <span className="font-mono text-xs font-bold text-stone-800">
                                Current Education & Degree Pill
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const nextVal = portfolio.personal.showEducationBadge === false;
                                const nextPort = {
                                  ...portfolio,
                                  personal: { ...portfolio.personal, showEducationBadge: nextVal },
                                };
                                setPortfolio(nextPort);
                                portfolioRef.current = nextPort;
                                saveInstantly(nextPort, nextVal ? "Education badge unhidden on photo card!" : "Education badge hidden from photo card!");
                              }}
                              className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border cursor-pointer transition-all ${
                                portfolio.personal.showEducationBadge !== false
                                  ? "bg-sky-100 text-sky-800 border-sky-400 hover:bg-sky-200"
                                  : "bg-stone-200 text-stone-600 border-stone-300 hover:bg-stone-300"
                              }`}
                            >
                              <span>{portfolio.personal.showEducationBadge !== false ? "● UNHIDDEN (SHOWN)" : "○ HIDDEN"}</span>
                            </button>
                          </div>

                          <p className="font-mono text-[9.5px] text-stone-600">
                            Agar aap abhi student hain ya degree display karni hai to ise UNHIDE rakhein. Jab education hide karni ho to switch press karein.
                          </p>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>Degree / Academic Program:</span>
                              <span className="text-sky-700 font-normal">Sky card</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Data Science and Applications or B.S. in Data Science"
                              value={portfolio.personal.aboutEducationDegree ?? portfolio.personal.degree ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutEducationDegree: val,
                                    degree: val,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Education degree updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                              <span>College / University Campus:</span>
                              <span className="text-indigo-700 font-normal">Campus chip</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. IIT Madras or IIT Bombay"
                              value={portfolio.personal.aboutEducationCollege ?? portfolio.personal.college ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: {
                                    ...prev.personal,
                                    aboutEducationCollege: val,
                                    college: val,
                                  },
                                }));
                              }}
                              onBlur={() => saveInstantly(portfolioRef.current, "Education college updated!")}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Live Coordinates / Location:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.location || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, location: e.target.value },
                              }))
                            }
                            onBlur={() => saveInstantly(portfolioRef.current, "Location updated!")}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                            placeholder="e.g. Chennai, India"
                          />
                          <p className="font-mono text-[9.5px] text-stone-500 mt-0.5">
                            Photo chin ke bottom me pin ke saath show hota hai.
                          </p>
                        </div>
                      </div>
                    </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsEditingPhotoCard(false)}
                          className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Save &amp; Lock Plaque View</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                  {/* Right Column: Live Studio Frame Preview (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-stone-500 mb-2.5">
                      <Eye className="w-3.5 h-3.5 text-amber-500" />
                      <span>Live Studio Frame Preview:</span>
                    </div>

                    {/* Frame Preview Card */}
                    <div className="w-full max-w-[280px]">
                      {/* Realistic Washi Tape Mount */}
                      <div className="w-28 h-5 bg-[#fde047]/85 border-t border-b border-black/25 shadow-xs rotate-[-1.5deg] mx-auto -mb-2.5 z-20 relative rounded-[2px]" />

                      {/* Unified Frame Body */}
                      <div className="rounded-2xl border-2 border-black bg-[#fffdfa] shadow-[6px_6px_0_#000] p-3.5 space-y-3">
                        {/* Photo Inset Recess */}
                        <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden border border-black/20 bg-stone-100 shadow-inner group">
                          <img
                            src={formatGoogleDriveImageUrl(portfolio.personal.aboutPhotoUrl || portfolio.personal.coverPhotoUrl)}
                            alt="About Frame Live Preview"
                            className="w-full h-full object-cover"
                            style={{
                              objectPosition: `${portfolio.personal.aboutPhotoPositionX ?? 50}% ${portfolio.personal.aboutPhotoPositionY ?? 20}%`,
                              transform: `scale(${portfolio.personal.aboutPhotoZoom ?? 1})`,
                              transformOrigin: `${portfolio.personal.aboutPhotoPositionX ?? 50}% ${portfolio.personal.aboutPhotoPositionY ?? 20}%`,
                            }}
                          />
                          {/* Corner Tabs */}
                          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-black/60 pointer-events-none" />
                          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-black/60 pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-black/60 pointer-events-none" />
                          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-black/60 pointer-events-none" />
                        </div>

                        {/* Integrated Lower Chin */}
                        <div className="pt-2.5 border-t-2 border-dashed border-stone-300 space-y-2">
                          <div className="font-signature text-2xl font-bold italic tracking-wide text-black leading-tight truncate rotate-[-1deg]">
                            {portfolio.personal.name || "Harsh Aryan"}
                          </div>

                          {/* Live Status Module Preview */}
                          {portfolio.personal.showAboutRole !== false && (Boolean(portfolio.personal.aboutCurrentWork || portfolio.personal.role) || Boolean(portfolio.personal.aboutWorkPlace)) && (() => {
                            const rawRole = (portfolio.personal.aboutCurrentWork || portfolio.personal.role || "").trim();
                            const workplace = (portfolio.personal.aboutWorkPlace || "").trim();
                            const displayRole = workplace && rawRole.toLowerCase().includes(`@ ${workplace.toLowerCase()}`)
                              ? rawRole.replace(new RegExp(`\\s*@\\s*${workplace}`, 'i'), '').trim()
                              : rawRole;
                            const track = resolveRoleTrack(
                              rawRole,
                              workplace,
                              portfolio.personal.aboutRoleType,
                              portfolio.personal.coverRoleTrackColor,
                              portfolio.personal.aboutRoleStatusText,
                              portfolio.personal.aboutRoleIcon,
                              portfolio.personal.aboutRoleCardStyle
                            );
                            const tagText = (portfolio.personal.aboutRoleTag || "").trim() || track.defaultTag;

                            return (
                              <div
                                className="w-full rounded-xl bg-[#fffdfa] border-2 border-black p-2.5 shadow-[3px_3px_0_#000] relative overflow-hidden space-y-1.5"
                                style={track.cardStyle}
                              >
                                {/* Blueprint dot pattern */}
                                <div 
                                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                  style={{
                                    backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
                                    backgroundSize: '6px 6px',
                                  }}
                                />

                                <div className="relative z-10 flex items-center justify-between gap-1 pb-1 border-b border-black/10">
                                  <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                        style={{ backgroundColor: track.activeColor }}
                                      />
                                      <span
                                        className="relative inline-flex rounded-full h-1.5 w-1.5"
                                        style={{
                                          backgroundColor: track.activeColor,
                                          boxShadow: `0 0 0 2px ${track.activeColor}33`,
                                        }}
                                      />
                                    </span>
                                    <span
                                      className="font-mono text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1"
                                      style={{ color: track.activeColor }}
                                    >
                                      {track.icon}
                                      <span>{track.label}</span>
                                    </span>
                                  </div>
                                  {Boolean(tagText) && (
                                    <span
                                      className="font-mono text-[7px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded border shadow-2xs"
                                      style={track.tagStyle}
                                    >
                                      {tagText}
                                    </span>
                                  )}
                                </div>
                                <div className="relative z-10 pt-0.5 flex flex-wrap items-center gap-1.5">
                                  {Boolean(displayRole) && (
                                    <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase text-black leading-tight">
                                      {displayRole}
                                    </span>
                                  )}
                                  {Boolean(workplace) && (
                                    <span
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-black border shadow-2xs"
                                      style={track.workplaceBadgeStyle}
                                    >
                                      <span
                                        className="font-sans font-bold text-[9px]"
                                        style={track.workplaceAtStyle}
                                      >
                                        @
                                      </span>
                                      <span className="text-stone-900">{workplace}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Live Education Module Preview (Hide / Unhideable) */}
                          {portfolio.personal.showEducationBadge !== false && (Boolean(portfolio.personal.aboutEducationDegree || portfolio.personal.degree) || Boolean(portfolio.personal.aboutEducationCollege || portfolio.personal.college)) && (
                            <div className="w-full rounded-lg bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-50 p-2 border border-sky-300/60 shadow-xs">
                              <div className="flex items-center justify-between gap-1 pb-1 border-b border-black/10">
                                <div className="flex items-center gap-1.5">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
                                  </span>
                                  <span className="font-mono text-[8px] font-black uppercase tracking-wider text-sky-700 flex items-center gap-0.5">
                                    <GraduationCap className="w-2.5 h-2.5 text-sky-600" />
                                    <span>Education &middot; Current</span>
                                  </span>
                                </div>
                                <span className="font-mono text-[7.5px] font-bold uppercase tracking-wider text-stone-500">
                                  Campus
                                </span>
                              </div>
                              <div className="pt-1 flex flex-wrap items-center gap-1">
                                {Boolean(portfolio.personal.aboutEducationDegree || portfolio.personal.degree) && (
                                  <span className="font-['Space_Grotesk'] text-[11px] font-black uppercase text-black leading-tight">
                                    {portfolio.personal.aboutEducationDegree || portfolio.personal.degree}
                                  </span>
                                )}
                                {Boolean(portfolio.personal.aboutEducationCollege || portfolio.personal.college) && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-sky-200 border border-sky-950/20 font-mono text-[9.5px] font-black text-sky-950">
                                    <span className="text-sky-700 font-sans font-bold text-[9px]">@</span>
                                    <span>{portfolio.personal.aboutEducationCollege || portfolio.personal.college}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Coordinates */}
                          {portfolio.personal.location && (
                            <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[10px] font-mono text-stone-600">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span>{portfolio.personal.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 2. PERSONAL STATEMENT, BIO & CLEAN COLOR PICKER ── */}
            {(aboutSubView === "all" || aboutSubView === "bio") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-7">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                      ✍️
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        2. Persona Statement, Narrative Bio &amp; Color Highlighter
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        Text select karke niche kisi bhi color swatch par click karein to highlight ho jayega.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setIsEditingBio(!isEditingBio)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        isEditingBio
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {isEditingBio ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Bio &amp; Statement</span>
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                      Studio
                    </span>
                  </div>
                </div>

                {!isEditingBio ? (
                  /* ── View Mode: Clean Typography & Highlights ── */
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Headline Statement:</span>
                        <div className="p-3.5 rounded-xl bg-white border border-stone-200 text-sm font-semibold leading-relaxed text-stone-900">
                          <FormattedHighlightedText
                            text={portfolio.personal.headline}
                            highlightKeywords={portfolio.personal.aboutHighlightedWords}
                            highlightColor={portfolio.personal.aboutHighlightColor}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono font-black uppercase text-stone-400 block mb-1">Narrative Bio:</span>
                        <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs font-mono leading-relaxed text-stone-800 whitespace-pre-wrap">
                          <FormattedHighlightedText
                            text={portfolio.personal.bio}
                            highlightKeywords={portfolio.personal.aboutHighlightedWords}
                            highlightColor={portfolio.personal.aboutHighlightColor}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-dashed border-stone-200">
                        <span>Bio is locked. Click &ldquo;Edit Bio &amp; Statement&rdquo; to modify or highlight words.</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingBio(true)}
                          className="text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>✏️ Edit Statement &amp; Bio ↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Edit Mode: Highlighter & Form Inputs ── */
                  <div className="space-y-7">

                {/* ── MASTER PORTFOLIO COLOR PICKER BAR ── */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#faf7ee] border-2 border-black shadow-[2px_2px_0_#000] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                    <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-stone-900">
                      <Palette className="w-4 h-4 text-amber-600" />
                      <span>Portfolio Color Palette:</span>
                    </div>

                    {/* Active Selected Text Indicator */}
                    {selectedTarget && selectedTarget.start < selectedTarget.end ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-400 font-mono text-[11px] font-bold text-emerald-950 animate-pulse">
                        <span>✦ Selected:</span>
                        <span className="font-black underline decoration-wavy">
                          &quot;{selectedTarget.text.slice(0, 25)}{selectedTarget.text.length > 25 ? "..." : ""}&quot;
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-black text-white rounded">
                          in {selectedTarget.field}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-[11px] text-stone-500">
                        💡 Tip: Headline ya Bio me koi word select karein, fir swatch par click karein.
                      </span>
                    )}
                  </div>

                  {/* Curated Swatches Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {PORTFOLIO_HIGHLIGHT_PALETTE.map((color) => {
                      const isSelected = highlighterColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.hex}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setHighlighterColor(color.hex);
                            if (selectedTarget && selectedTarget.start < selectedTarget.end) {
                              const ref = selectedTarget.field === "headline" ? headlineInputRef : bioTextareaRef;
                              applyColorHighlight(selectedTarget.field, ref, color.hex);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? "bg-black text-white border-black shadow-md scale-105"
                              : "bg-white text-stone-800 border-stone-300 hover:border-black hover:bg-stone-50"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          <span className={`text-[9px] uppercase px-1 py-0.2 rounded font-mono ${isSelected ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
                            {color.label}
                          </span>
                        </button>
                      );
                    })}

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-stone-300 ml-auto shadow-2xs">
                      <input
                        type="color"
                        value={highlighterColor}
                        onChange={(e) => {
                          setHighlighterColor(e.target.value);
                          if (selectedTarget && selectedTarget.start < selectedTarget.end) {
                            const ref = selectedTarget.field === "headline" ? headlineInputRef : bioTextareaRef;
                            applyColorHighlight(selectedTarget.field, ref, e.target.value);
                          }
                        }}
                        className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                        title="Pick custom hex color"
                      />
                      <input
                        type="text"
                        value={highlighterColor}
                        onChange={(e) => setHighlighterColor(e.target.value)}
                        className="w-18 font-mono text-xs font-bold text-stone-900 focus:outline-none uppercase"
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>
                </div>

                {/* ── 2A. HEADLINE (STATEMENT) EDITOR ── */}
                <div className="space-y-2.5 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-100">
                    <label className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Headline Statement:</span>
                    </label>

                    {/* Dedicated Formatting Toolbar for Headline */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyColorHighlight("headline", headlineInputRef, highlighterColor)}
                        className="px-3 py-1 rounded-lg text-black font-mono text-[11px] font-black border-2 border-black shadow-[1.5px_1.5px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 hover:brightness-105"
                        style={{ backgroundColor: highlighterColor }}
                        title="Highlight selected text in Headline"
                      >
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Highlight Selected</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatToSelection("headline", headlineInputRef, "bold")}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-mono text-[11px] font-bold border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                        title="Wrap selected text in **bold**"
                      >
                        <Type className="w-3 h-3 text-stone-600" />
                        <span>Bold</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatToSelection("headline", headlineInputRef, "clear")}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 font-mono text-[11px] border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                        title="Remove highlight/bold from selected text"
                      >
                        <Eraser className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  <input
                    ref={headlineInputRef}
                    type="text"
                    value={portfolio.personal.headline || ""}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, headline: e.target.value },
                      }))
                    }
                    onSelect={(e) => handleSelectionCapture("headline", e.currentTarget)}
                    onMouseUp={(e) => handleSelectionCapture("headline", e.currentTarget)}
                    onKeyUp={(e) => handleSelectionCapture("headline", e.currentTarget)}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none font-bold"
                    placeholder="e.g. Exploring Data Science, Machine Learning Foundations & Scientific Computing."
                  />

                  {/* Headline Live Formatted Line */}
                  <div className="p-3 rounded-xl bg-[#fafafa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold leading-relaxed">
                    <span className="font-mono text-[10px] uppercase text-stone-400 block mb-1">Live Result Preview:</span>
                    <FormattedHighlightedText
                      text={portfolio.personal.headline}
                      highlightKeywords={portfolio.personal.aboutHighlightedWords}
                      highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                    />
                  </div>
                </div>

                {/* ── 2B. NARRATIVE BIO EDITOR ── */}
                <div className="space-y-2.5 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-100">
                    <label className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>About Me Narrative Bio:</span>
                    </label>

                    {/* Dedicated Formatting Toolbar for Bio */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyColorHighlight("bio", bioTextareaRef, highlighterColor)}
                        className="px-3 py-1 rounded-lg text-black font-mono text-[11px] font-black border-2 border-black shadow-[1.5px_1.5px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 hover:brightness-105"
                        style={{ backgroundColor: highlighterColor }}
                        title="Highlight selected text in Bio"
                      >
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Highlight Selected</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatToSelection("bio", bioTextareaRef, "bold")}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 font-mono text-[11px] font-bold border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                        title="Wrap selected text in **bold**"
                      >
                        <Type className="w-3 h-3 text-stone-600" />
                        <span>Bold</span>
                      </button>

                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyFormatToSelection("bio", bioTextareaRef, "clear")}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 font-mono text-[11px] border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                        title="Remove highlight/bold from selected text"
                      >
                        <Eraser className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={bioTextareaRef}
                    rows={7}
                    value={portfolio.personal.bio || ""}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, bio: e.target.value },
                      }))
                    }
                    onSelect={(e) => handleSelectionCapture("bio", e.currentTarget)}
                    onMouseUp={(e) => handleSelectionCapture("bio", e.currentTarget)}
                    onKeyUp={(e) => handleSelectionCapture("bio", e.currentTarget)}
                    className="w-full p-4 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none leading-relaxed"
                    placeholder="Enter your detailed bio narrative..."
                  />

                  {/* Bio Live Formatted Preview */}
                  <div className="p-3.5 rounded-xl bg-[#fafafa] dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    <span className="font-mono text-[10px] uppercase text-stone-400 block mb-1">Bio Live Result:</span>
                    <FormattedHighlightedText
                      text={portfolio.personal.bio}
                      highlightKeywords={portfolio.personal.aboutHighlightedWords}
                      highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                    />
                  </div>
                </div>

                {/* ── 2C. STATEMENT & BIO HIGHLIGHT COLOR & KEYWORDS MANAGER ── */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-4">
                  {/* Header & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                        <Sparkles className="w-4 h-4 text-amber-700" />
                      </span>
                      <div>
                        <h4 className="font-mono text-xs font-black uppercase text-stone-900">
                          Highlight Color & Keyword Markers
                        </h4>
                        <p className="font-mono text-[10px] text-stone-500">
                          Persona Statement aur Bio me keywords ko highlight karne ka simple controller.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setPortfolio((prev) => {
                          const current = prev.personal.aboutHighlightedWords;
                          const nextVal = current ? "" : "Harsh Aryan, IIT Madras, Artificial Intelligence, Data Science, Machine Learning, Scientific Computing";
                          const nextPort = {
                            ...prev,
                            personal: { ...prev.personal, aboutHighlightedWords: nextVal },
                          };
                          saveInstantly(nextPort, nextVal ? "Auto-highlighting enabled" : "Auto-highlighting paused");
                          return nextPort;
                        })
                      }
                      className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer border ${
                        portfolio.personal.aboutHighlightedWords
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                          : "bg-stone-200 text-stone-600 border-stone-300"
                      }`}
                    >
                      {portfolio.personal.aboutHighlightedWords ? "● HIGHLIGHTS: ACTIVE" : "○ HIGHLIGHTS: PAUSED"}
                    </button>
                  </div>

                  {/* 1. Dedicated Color Picker Bar */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-stone-800 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-stone-600" />
                        <span>Select Portfolio Highlight Color:</span>
                      </span>
                      <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-700">
                        {portfolio.personal.aboutHighlightColor || "#f43f5e"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {PORTFOLIO_HIGHLIGHT_PALETTE.map((c) => {
                        const isCurrent =
                          (portfolio.personal.aboutHighlightColor || "#f43f5e").toLowerCase() ===
                          c.hex.toLowerCase();
                        return (
                          <button
                            key={c.hex}
                            type="button"
                            onClick={() => {
                              const nextPort = {
                                ...portfolio,
                                personal: { ...portfolio.personal, aboutHighlightColor: c.hex },
                              };
                              setPortfolio(nextPort);
                              setHighlighterColor(c.hex);
                              saveInstantly(nextPort, `Highlight color changed to ${c.name}!`);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                              isCurrent
                                ? "bg-black text-white border-black shadow-md scale-105"
                                : "bg-white text-stone-800 border-stone-300 hover:border-black"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                            <span
                              className={`text-[9px] uppercase px-1 py-0.2 rounded font-mono ${
                                isCurrent ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
                              }`}
                            >
                              {c.label}
                            </span>
                          </button>
                        );
                      })}

                      {/* Native HTML Color Wheel */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-stone-300 ml-auto shadow-2xs">
                        <input
                          type="color"
                          value={portfolio.personal.aboutHighlightColor || "#f43f5e"}
                          onChange={(e) => {
                            const newHex = e.target.value;
                            const nextPort = {
                              ...portfolio,
                              personal: { ...portfolio.personal, aboutHighlightColor: newHex },
                            };
                            setPortfolio(nextPort);
                            setHighlighterColor(newHex);
                          }}
                          onBlur={(e) => {
                            saveInstantly(portfolioRef.current, `Saved highlight color: ${e.target.value}`);
                          }}
                          className="w-6 h-6 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          title="Pick custom color"
                        />
                        <span className="font-mono text-xs font-black text-stone-800 uppercase">
                          {portfolio.personal.aboutHighlightColor || "#f43f5e"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Interactive Word & Phrase Tags Cloud */}
                  <div className="space-y-2.5">
                    <label className="block font-mono text-[11px] font-bold text-stone-700">
                      Highlighted Words in Statement & Bio:
                    </label>

                    {/* Chips Display */}
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 min-h-[44px]">
                      {(() => {
                        const activeColor = portfolio.personal.aboutHighlightColor || "#f43f5e";
                        const words = (portfolio.personal.aboutHighlightedWords || "")
                          .split(",")
                          .map((w) => w.trim())
                          .filter(Boolean);

                        if (words.length === 0) {
                          return (
                            <span className="font-mono text-xs text-stone-400 italic">
                              Koi keyword add nahi hai. Neeche input me type karke &quot;Add Word&quot; karein.
                            </span>
                          );
                        }

                        return words.map((word) => (
                          <span
                            key={word}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-all shadow-2xs"
                            style={{
                              backgroundColor: `${activeColor}18`,
                              color: activeColor,
                              borderColor: `${activeColor}50`,
                            }}
                          >
                            <span>{word}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const remaining = words.filter((w) => w.toLowerCase() !== word.toLowerCase()).join(", ");
                                const nextPort = {
                                  ...portfolio,
                                  personal: { ...portfolio.personal, aboutHighlightedWords: remaining },
                                };
                                setPortfolio(nextPort);
                                saveInstantly(nextPort, `Removed highlight: "${word}"`);
                              }}
                              className="w-4 h-4 rounded-full bg-black/10 hover:bg-black/25 flex items-center justify-center text-[10px] cursor-pointer"
                              title={`Remove "${word}"`}
                            >
                              ✕
                            </button>
                          </span>
                        ));
                      })()}
                    </div>

                    {/* Add Word Input Row */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const val = newKeywordInput.trim();
                            if (!val) return;
                            const words = (portfolio.personal.aboutHighlightedWords || "")
                              .split(",")
                              .map((w) => w.trim())
                              .filter(Boolean);
                            if (!words.some((w) => w.toLowerCase() === val.toLowerCase())) {
                              const updated = [...words, val].join(", ");
                              const nextPort = {
                                ...portfolio,
                                personal: { ...portfolio.personal, aboutHighlightedWords: updated },
                              };
                              setPortfolio(nextPort);
                              setNewKeywordInput("");
                              saveInstantly(nextPort, `Added highlight keyword: "${val}"`);
                            }
                          }
                        }}
                        placeholder="Type word to highlight (e.g. Data Science, Machine Learning)..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const val = newKeywordInput.trim();
                          if (!val) return;
                          const words = (portfolio.personal.aboutHighlightedWords || "")
                            .split(",")
                            .map((w) => w.trim())
                            .filter(Boolean);
                          if (!words.some((w) => w.toLowerCase() === val.toLowerCase())) {
                            const updated = [...words, val].join(", ");
                            const nextPort = {
                              ...portfolio,
                              personal: { ...portfolio.personal, aboutHighlightedWords: updated },
                            };
                            setPortfolio(nextPort);
                            setNewKeywordInput("");
                            saveInstantly(nextPort, `Added highlight keyword: "${val}"`);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 active:translate-y-0.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Word</span>
                      </button>
                    </div>

                    {/* Quick 1-Click Common Suggestions */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-mono text-[10px] text-stone-500 font-bold">Quick Suggestions:</span>
                      {[
                        "Harsh Aryan",
                        "Artificial Intelligence",
                        "Data Science",
                        "Machine Learning",
                        "Scientific Computing",
                        "IIT Madras",
                        "Python",
                      ].map((preset) => {
                        const words = (portfolio.personal.aboutHighlightedWords || "")
                          .split(",")
                          .map((w) => w.trim().toLowerCase());
                        const isAdded = words.includes(preset.toLowerCase());
                        if (isAdded) return null;

                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const curr = (portfolio.personal.aboutHighlightedWords || "")
                                .split(",")
                                .map((w) => w.trim())
                                .filter(Boolean);
                              const updated = [...curr, preset].join(", ");
                              const nextPort = {
                                ...portfolio,
                                personal: { ...portfolio.personal, aboutHighlightedWords: updated },
                              };
                              setPortfolio(nextPort);
                              saveInstantly(nextPort, `Added highlight keyword: "${preset}"`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-mono text-[10px] font-bold cursor-pointer transition-all"
                          >
                            + {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditingBio(false)}
                      className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Save &amp; Lock Bio View</span>
                    </button>
                  </div>
                </div>
              )}

                {/* ── 2D. FULL COMBINED LIVE PERSONA PREVIEW (EXACT WEBSITE REPLICA) ── */}
                <div className="p-5 sm:p-6 rounded-3xl bg-[#faf8f3] dark:bg-[#13141b] border-2 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] space-y-4">
                  <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                    <span className="font-mono text-xs font-black uppercase text-stone-900 dark:text-white flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-500" />
                      <span>Live Website Preview (About Section Persona Card):</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold text-stone-500">
                      Exact Public Look
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-0.5">
                      <span className="font-hero-heading text-2xl font-black uppercase tracking-tight text-amber-600 dark:text-amber-400">
                        Persona
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 border-2 border-black dark:border-amber-400/80 text-black dark:text-amber-200 font-mono text-[10px] font-black uppercase shadow-[1.5px_1.5px_0_#000]">
                        STATEMENT
                      </span>
                    </div>

                    <div className="font-semibold text-base sm:text-lg text-black dark:text-white leading-snug">
                      <FormattedHighlightedText
                        text={portfolio.personal.headline}
                        highlightKeywords={portfolio.personal.aboutHighlightedWords}
                        highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                      />
                    </div>

                    <div className="space-y-2 pt-1 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                      <FormattedHighlightedText
                        text={portfolio.personal.bio}
                        highlightKeywords={portfolio.personal.aboutHighlightedWords}
                        highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        )}

        {/* ── TAB: WORK & LEADERSHIP (EXPERIENCE STATION) ── */}
        {activeTab === "experience" && (
          <div className="space-y-6">

            {/* ── 4. PROFESSIONAL EXPERIENCE CATALOG ── */}
            
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black uppercase text-stone-500 mr-1">Filter Roles:</span>
                    {[
                      { id: "current", label: `🟢 Current (${(portfolio.experiences || []).filter(e => e.isCurrent || (e.isCurrent !== false && (e.period || "").toLowerCase().includes("present"))).length})` },
                      { id: "past", label: `📁 Past (${(portfolio.experiences || []).filter(e => !e.isCurrent && (e.isCurrent === false || !(e.period || "").toLowerCase().includes("present"))).length})` },
                      { id: "all", label: `✦ All (${(portfolio.experiences || []).length})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setExpStationFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold cursor-pointer transition-all ${
                          expStationFilter === f.id
                            ? "bg-black text-white shadow-xs font-black"
                            : "text-stone-600 hover:text-black bg-stone-100 hover:bg-stone-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Hide / Unhide Toggle */}
                    <button
                      type="button"
                      onClick={async () => {
                        const base = portfolioRef.current || portfolio;
                        const nextVal = base.personal.showExperienceSection === false ? true : false;
                        const nextPort = {
                          ...base,
                          personal: {
                            ...base.personal,
                            showExperienceSection: nextVal,
                          },
                        };
                        setPortfolio(nextPort);
                        portfolioRef.current = nextPort;
                        await saveInstantly(
                          nextPort,
                          nextVal
                            ? "✅ Experience section is now VISIBLE on site!"
                            : "⚠️ Experience section is now HIDDEN from site!"
                        );
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        portfolio.personal.showExperienceSection === false
                          ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 shadow-xs"
                          : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs"
                      }`}
                      title={
                        portfolio.personal.showExperienceSection === false
                          ? "Click to display Experience section on main page"
                          : "Click to hide Experience section from main page"
                      }
                    >
                      {portfolio.personal.showExperienceSection === false ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                          <span>● Section Hidden</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            Live on Site
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const base = portfolioRef.current || portfolio;
                        const list = [...(base.experiences || [])];
                        const isCurr = (e: any) => Boolean(e.isCurrent || (e.period || "").toLowerCase().includes("present") || (e.period || "").toLowerCase().includes("current"));
                        const parseYear = (p?: string) => {
                          const m = p?.match(/\b(20\d{2})\b/g);
                          return m && m.length > 0 ? Math.max(...m.map(Number)) : 0;
                        };
                        const currList = list.filter(isCurr).sort((a, b) => parseYear(b.period) - parseYear(a.period));
                        const pastList = list.filter((e) => !isCurr(e)).sort((a, b) => parseYear(b.period) - parseYear(a.period));
                        const sorted = [...currList, ...pastList];
                        const nextPort = { ...base, experiences: sorted };
                        setPortfolio(nextPort);
                        portfolioRef.current = nextPort;
                        await saveInstantly(nextPort, "✅ Experiences reordered: Current roles placed at top, past roles below!");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:translate-y-0.5"
                      title="Current roles ko automatically top par aur past roles ko niche arrange karein"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Current on Top</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:translate-y-0.5"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Add Role / Mandate</span>
                    </button>
                  </div>
                </div>

                {portfolio.personal.showExperienceSection === false && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 font-mono">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong className="font-bold">Experience Section is currently hidden:</strong> Ye section main homepage par render nahi hoga.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const base = portfolioRef.current || portfolio;
                        const nextPort = {
                          ...base,
                          personal: {
                            ...base.personal,
                            showExperienceSection: true,
                          },
                        };
                        setPortfolio(nextPort);
                        portfolioRef.current = nextPort;
                        await saveInstantly(nextPort, "✅ Experience section is now VISIBLE on site!");
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      Unhide / Show Section
                    </button>
                  </div>
                )}

                {/* Experience Cards List */}
                <div className="space-y-6">
                  {(!portfolio.experiences || portfolio.experiences.length === 0) ? (
                    <div className="p-8 text-center border-2 border-dashed border-stone-300 rounded-2xl space-y-3">
                      <p className="font-mono text-sm text-stone-500">No experience roles added yet.</p>
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-4 py-2 rounded-xl bg-black text-white font-mono text-xs font-bold hover:bg-stone-800 transition-all cursor-pointer shadow-[2px_2px_0_#000]"
                      >
                        + Add First Experience Role
                      </button>
                    </div>
                  ) : (
                    (portfolio.experiences || []).map((exp, idx) => {
                      const isEditingThisExp = editingExpIndex === idx;
                      return (
                      <div
                        key={exp.id || idx}
                        className="p-5 sm:p-6 rounded-2xl border-2 border-black bg-white shadow-[3px_3px_0_#000] space-y-5"
                      >
                        {/* Entry Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-lg bg-black text-white font-mono text-xs font-black">
                              Role #{idx + 1}
                            </span>
                            <span className="font-['Space_Grotesk'] text-sm sm:text-base font-black text-stone-900">
                              {exp.role || "Untitled Role"}
                            </span>
                            <span className="font-mono text-xs text-stone-500">
                              @ {exp.company || "Company"}
                            </span>
                            {exp.isCurrent ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Current Active Role
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-300 font-mono text-[10px] font-medium">
                                ✓ Past Milestone
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {/* Primary Edit / Done Toggle */}
                            <button
                              type="button"
                              onClick={() => setEditingExpIndex(isEditingThisExp ? null : idx)}
                              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                                isEditingThisExp
                                  ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                                  : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                              }`}
                              title={isEditingThisExp ? "Close editor & lock" : "Click to edit this role"}
                            >
                              {isEditingThisExp ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Done Editing</span>
                                </>
                              ) : (
                                <>
                                  <Edit className="w-3.5 h-3.5" />
                                  <span>Edit Role</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMoveExperience(idx, "up")}
                              disabled={idx === 0}
                              className={`p-1.5 rounded-lg border border-black bg-white transition-all ${
                                idx === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-stone-100 cursor-pointer shadow-[1px_1px_0_#000]"
                              }`}
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-stone-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveExperience(idx, "down")}
                              disabled={idx === (portfolio.experiences || []).length - 1}
                              className={`p-1.5 rounded-lg border border-black bg-white transition-all ${
                                idx === (portfolio.experiences || []).length - 1
                                  ? "opacity-30 cursor-not-allowed"
                                  : "hover:bg-stone-100 cursor-pointer shadow-[1px_1px_0_#000]"
                              }`}
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-stone-700" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(idx)}
                              className="p-1.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer shadow-[1px_1px_0_#ef4444]"
                              title="Delete Role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {!isEditingThisExp ? (
                          /* ── VIEW MODE (READABLE PLAQUE CARD) ── */
                          <div className="space-y-4 pt-1">
                            {/* Metadata Pills: Period, Location, Type */}
                            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-50 border border-stone-300 font-bold text-stone-800 shadow-2xs">
                                <span>📅</span>
                                <span>{exp.period || "Period not set"}</span>
                              </span>
                              {exp.location && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-50 border border-stone-300 font-bold text-stone-800 shadow-2xs">
                                  <span>📍</span>
                                  <span>{exp.location}</span>
                                </span>
                              )}
                              {exp.type && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 font-bold text-indigo-900">
                                  <span>🏷️</span>
                                  <span>{exp.type}</span>
                                </span>
                              )}
                              {exp.companyUrl && (
                                <a
                                  href={exp.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold text-[11px]"
                                >
                                  <span>🔗</span>
                                  <span>{exp.companyUrl.replace(/^https?:\/\//, "")}</span>
                                </a>
                              )}
                            </div>

                            {/* Description snippet */}
                            {exp.description && (
                              <p className="text-xs text-stone-700 font-mono leading-relaxed bg-[#faf8f5] p-3.5 rounded-xl border border-stone-200">
                                {exp.description}
                              </p>
                            )}

                            {/* Bullets Preview */}
                            {(exp.highlights || []).length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-stone-400">
                                  Key Deliverables &amp; Impact ({(exp.highlights || []).length}):
                                </span>
                                <ul className="space-y-1.5 bg-[#faf8f5] p-3.5 rounded-xl border border-stone-200">
                                  {(exp.highlights || []).map((h, i) => (
                                    <li key={i} className="flex items-start gap-2 font-mono text-xs text-stone-800">
                                      <span className="text-amber-500 font-black">✦</span>
                                      <span>{h}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Skill Tags */}
                            {(exp.skillsUsed || []).length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-mono font-bold text-stone-400 mr-1">Technologies:</span>
                                {(exp.skillsUsed || []).map((sk, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-300 font-mono text-[10px] font-bold text-stone-800"
                                  >
                                    #{sk}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-dashed border-stone-200">
                              <span>Role details locked. Click &ldquo;Edit Role&rdquo; to modify.</span>
                              <button
                                type="button"
                                onClick={() => setEditingExpIndex(idx)}
                                className="text-amber-700 hover:text-amber-900 font-black flex items-center gap-1 cursor-pointer"
                              >
                                <span>✏️ Edit this Role ↗</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── EDIT MODE (INPUT FIELDS) ── */
                          <div className="space-y-5 pt-1">

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Role Title *
                            </label>
                            <input
                              type="text"
                              value={exp.role || ""}
                              onChange={(e) => handleUpdateExperience(idx, "role", e.target.value)}
                              placeholder="e.g. Teaching Assistant"
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Company / Institution *
                            </label>
                            <input
                              type="text"
                              value={exp.company || ""}
                              onChange={(e) => handleUpdateExperience(idx, "company", e.target.value)}
                              placeholder="e.g. IIT Madras"
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Company Website URL
                            </label>
                            <input
                              type="url"
                              value={exp.companyUrl || ""}
                              onChange={(e) => handleUpdateExperience(idx, "companyUrl", e.target.value)}
                              placeholder="https://..."
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Time Period *
                            </label>
                            <input
                              type="text"
                              value={exp.period || ""}
                              onChange={(e) => handleUpdateExperience(idx, "period", e.target.value)}
                              placeholder="e.g. Aug 2024 – Present"
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={exp.location || ""}
                              onChange={(e) => handleUpdateExperience(idx, "location", e.target.value)}
                              placeholder="e.g. Chennai, India / Remote"
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                              Role Type / Domain Tag
                            </label>
                            <input
                              type="text"
                              value={exp.type || ""}
                              onChange={(e) => handleUpdateExperience(idx, "type", e.target.value)}
                              placeholder="e.g. Academic & Mentorship"
                              className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                            />
                          </div>
                        </div>

                        {/* Current vs Past Station Status Controller */}
                        <div className="p-3.5 rounded-2xl bg-stone-50 border-2 border-stone-200 space-y-2">
                          <label className="block text-xs font-mono font-black uppercase text-stone-700">
                            Role Status Station (Current vs Past)
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateExperience(idx, "isCurrent", true)}
                              className={`px-3.5 py-2.5 rounded-xl border-2 font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                exp.isCurrent
                                  ? "bg-emerald-400 text-black border-black shadow-[3px_3px_0_#000] scale-101"
                                  : "bg-white text-stone-600 border-stone-300 hover:border-black"
                              }`}
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping" />
                              <span>🟢 CURRENT ACTIVE ROLE</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleUpdateExperience(idx, "isCurrent", false)}
                              className={`px-3.5 py-2.5 rounded-xl border-2 font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                !exp.isCurrent
                                  ? "bg-stone-800 text-white border-black shadow-[3px_3px_0_#000] scale-101"
                                  : "bg-white text-stone-600 border-stone-300 hover:border-black"
                              }`}
                            >
                              <span>✓ PAST MILESTONE / COMPLETED</span>
                            </button>
                          </div>
                          <p className="text-[11px] font-mono text-stone-500">
                            {exp.isCurrent
                              ? "✨ ACTIVE MANDATE: Appears first under CURRENT ROLES on the main site with a live radar beacon."
                              : "📁 COMPLETED: Appears under PAST MILESTONES in the flight log archive."}
                          </p>
                        </div>

                        {/* Role Description */}
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                            Role Description / Scope
                          </label>
                          <textarea
                            rows={3}
                            value={exp.description || ""}
                            onChange={(e) => handleUpdateExperience(idx, "description", e.target.value)}
                            placeholder="Describe your primary role, mentoring responsibilities, or technical focus..."
                            className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>

                        {/* Key Highlights / Bullets */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-mono font-bold text-stone-700">
                              Key Impacts & Achievements (Bullet Points)
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddExperienceHighlight(idx)}
                              className="px-2 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 font-mono text-[10px] font-bold text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> Add Impact Bullet
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(exp.highlights || []).map((highlight, hIdx) => (
                              <div key={hIdx} className="flex items-center gap-2">
                                <span className="font-mono text-xs text-amber-500 font-black">✦</span>
                                <input
                                  type="text"
                                  value={highlight}
                                  onChange={(e) => handleUpdateExperienceHighlight(idx, hIdx, e.target.value)}
                                  placeholder="Key achievement or metric..."
                                  className="flex-1 px-3 py-1.5 border border-stone-300 rounded-lg font-mono text-xs bg-white focus:outline-hidden focus:border-black"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExperienceHighlight(idx, hIdx)}
                                  className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remove Highlight"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack / Skills Used */}
                        <div>
                          <label className="block text-xs font-mono font-bold text-stone-700 mb-1 flex items-center justify-between">
                            <span>Skills &amp; Technologies Used (Comma-separated)</span>
                            <span className="text-stone-400 font-normal text-[10px]">Type freely with commas</span>
                          </label>
                          <input
                            type="text"
                            value={
                              expSkillsInputMap[exp.id || `exp-${idx}`] !== undefined
                                ? expSkillsInputMap[exp.id || `exp-${idx}`]
                                : (exp.skillsUsed || []).join(", ")
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const key = exp.id || `exp-${idx}`;
                              setExpSkillsInputMap((prev) => ({ ...prev, [key]: val }));
                              const items = val
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              handleUpdateExperience(idx, "skillsUsed", items);
                            }}
                            onBlur={() => {
                              saveInstantly(portfolioRef.current, "Experience skills updated!");
                            }}
                            placeholder="e.g. Python, Machine Learning, Data Science, Git"
                            className="w-full px-3 py-2 border-2 border-black rounded-xl font-mono text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
                          />
                          <p className="font-mono text-[10px] text-stone-400 mt-1">
                            Separate skills with commas. They will appear as neat tags on the website card.
                          </p>
                        </div>

                        {/* Live Experience Preview Card */}
                        <div className="mt-4 pt-4 border-t border-dashed border-stone-300">
                          <div className="text-[10px] font-mono font-black uppercase text-stone-500 tracking-wider mb-2">
                            ✦ Live Neo-Brutalist Card Preview:
                          </div>
                          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] relative space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 border border-black font-mono text-[10px] font-bold text-stone-800">
                                  💼 {exp.type || "Role"}
                                </span>
                                {exp.isCurrent && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-400 font-mono text-[10px] font-black text-emerald-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                    Active Now
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-300">
                                📅 {exp.period || "Period"}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-['Space_Grotesk'] text-base font-black text-stone-900 leading-tight">
                                {exp.role || "Role Title"}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono font-bold text-stone-600">
                                <span>🏢 {exp.company || "Company"}</span>
                                {exp.location && <span>• 📍 {exp.location}</span>}
                              </div>
                            </div>

                            {exp.description && (
                              <p className="font-mono text-xs text-stone-600 leading-relaxed">
                                {exp.description}
                              </p>
                            )}

                            {(exp.highlights || []).length > 0 && (
                              <ul className="space-y-1">
                                {(exp.highlights || []).map((h, i) => (
                                  <li key={i} className="flex items-start gap-1.5 font-mono text-[11px] text-stone-700">
                                    <span className="text-amber-500 font-black">✦</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {(exp.skillsUsed || []).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100">
                                {(exp.skillsUsed || []).map((sk, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-300 font-mono text-[10px] font-bold text-stone-700"
                                  >
                                    #{sk}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Done Editing Button at Bottom of Form */}
                        <div className="pt-3 border-t border-stone-200 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingExpIndex(null)}
                            className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Save &amp; Lock Role View</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
                  )}
                </div>
              </div>


          </div>
        )}


        {/* ── TAB: DEVELOPMENT TRAJECTORY (ROADMAP MILESTONES) ── */}
        {activeTab === "milestones" && (
          <div className="space-y-6">

            {/* ── 5. DEVELOPMENT TRAJECTORY (ROADMAP MILESTONES) ── */}
            
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-sm">
                      🚀
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                          Development Trajectory (Roadmap Milestones)
                        </h3>
                        {portfolio.personal.showDevelopmentTrajectory === false && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-300 font-mono text-[10px] font-black uppercase">
                            Hidden from Site
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-stone-500">
                        Sequential roadmap phases showcasing core algorithms, exploratory mathematical modeling, and AI system engineering.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Hide / Unhide Section Toggle */}
                    <button
                      type="button"
                      onClick={async () => {
                        const current = portfolio.personal.showDevelopmentTrajectory !== false;
                        const updated = {
                          ...portfolio,
                          personal: {
                            ...portfolio.personal,
                            showDevelopmentTrajectory: !current,
                          },
                        };
                        setPortfolio(updated);
                        await saveInstantly(
                          updated,
                          !current
                            ? "✅ Development Trajectory section is now VISIBLE on site!"
                            : "⚠️ Development Trajectory section is now HIDDEN from site!"
                        );
                      }}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-black uppercase transition-all cursor-pointer border flex items-center gap-1.5 active:translate-y-0.5 ${
                        portfolio.personal.showDevelopmentTrajectory !== false
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : "bg-stone-200 hover:bg-stone-300 text-stone-700 border-stone-400"
                      }`}
                      title={portfolio.personal.showDevelopmentTrajectory !== false ? "Click to hide section from main site" : "Click to show section on main site"}
                    >
                      {portfolio.personal.showDevelopmentTrajectory !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>● Section Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-red-600" />
                          <span>○ Section Hidden</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Trajectory Phase</span>
                    </button>
                  </div>
                </div>

                {/* Notice banner when section is hidden */}
                {portfolio.personal.showDevelopmentTrajectory === false && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Ye poora <strong>DEVELOPMENT TRAJECTORY</strong> section abhi main website par <strong>HIDDEN</strong> hai. Live site par ye render nahi hoga.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const updated = {
                          ...portfolio,
                          personal: {
                            ...portfolio.personal,
                            showDevelopmentTrajectory: true,
                          },
                        };
                        setPortfolio(updated);
                        await saveInstantly(updated, "✅ Development Trajectory section is now VISIBLE on site!");
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      Unhide / Show Section
                    </button>
                  </div>
                )}

                {/* Milestones Edit Cards */}
                <div className="space-y-4">
                  {(portfolio.milestones && portfolio.milestones.length > 0
                    ? portfolio.milestones
                    : [
                        { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
                        { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
                        { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
                      ]
                  ).map((m, mIdx, arr) => {
                    const isEditingThisMilestone = editingMilestoneIdx === mIdx;
                    const mStatus = resolveMilestoneStatus(m, mIdx);
                    return (
                    <div
                      key={mIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            PHASE {m.phaseNumber || `0${mIdx + 1}`}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-mono text-[9.5px] font-black uppercase border shadow-2xs ${mStatus.bg}`}
                            style={mStatus.style}
                          >
                            {mStatus.label}
                          </span>
                          <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {m.period}
                          </span>
                          <span className="font-['Space_Grotesk'] text-sm font-black text-stone-900 truncate max-w-[200px] sm:max-w-none">
                            {m.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingMilestoneIdx(isEditingThisMilestone ? null : mIdx)}
                            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-black cursor-pointer flex items-center gap-1 border-2 border-black shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 transition-all ${
                              isEditingThisMilestone
                                ? "bg-emerald-400 text-black hover:bg-emerald-300"
                                : "bg-amber-400 text-black hover:bg-amber-300"
                            }`}
                            title={isEditingThisMilestone ? "Done editing" : "Edit phase"}
                          >
                            {isEditingThisMilestone ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Done</span>
                              </>
                            ) : (
                              <>
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMilestone(mIdx, "up")}
                            disabled={mIdx === 0}
                            className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveMilestone(mIdx, "down")}
                            disabled={mIdx === arr.length - 1}
                            className="p-1.5 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMilestone(mIdx)}
                            className="p-1.5 rounded-lg bg-white border border-stone-300 text-red-500 hover:bg-red-50 cursor-pointer ml-1"
                            title="Delete Phase"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {!isEditingThisMilestone ? (
                        /* ── View Mode: Clean Phase Card ── */
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-stone-500">
                              {m.subtitle}
                            </span>
                          </div>
                          <p className="font-mono text-xs text-stone-700 leading-relaxed bg-[#faf8f5] p-3 rounded-xl border border-stone-200">
                            {m.description}
                          </p>
                          <div className="pt-1 flex items-center justify-between text-[11px] font-mono text-stone-400">
                            <span>Status: <strong className="text-stone-700">{mStatus.label}</strong> • Click &ldquo;Edit&rdquo; above to change status or details.</span>
                            <button
                              type="button"
                              onClick={() => setEditingMilestoneIdx(mIdx)}
                              className="text-amber-700 hover:text-amber-900 font-bold cursor-pointer"
                            >
                              ✏️ Edit Phase ↗
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* ── Edit Mode: Form Inputs with Full Status Control ── */
                        <div className="space-y-4 pt-1">
                          {/* 1. Status Selection Row (Completed / Active Execution / Next Horizon / Planned / Custom) */}
                          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2.5">
                            <label className="block font-mono text-[11px] font-bold text-stone-800 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span>Phase Status / State:</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 border border-amber-300 font-black">
                                  ACTIVE / COMPLETED / AAGE KARNA HAI
                                </span>
                              </span>
                              <span className="text-stone-500 font-normal text-[10px]">Displayed on live cards</span>
                            </label>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {MILESTONE_STATUS_PRESETS.map((preset) => {
                                const currentStatus = (m.status || "").toLowerCase();
                                const currentLabel = (m.statusLabel || "").toUpperCase();
                                const isSelected =
                                  currentStatus === preset.id ||
                                  currentLabel === preset.label.toUpperCase() ||
                                  (!m.status && !m.statusLabel && mStatus.label === preset.label);
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => {
                                      handleUpdateMilestone(mIdx, "status", preset.id);
                                      handleUpdateMilestone(mIdx, "statusLabel", preset.label);
                                      handleUpdateMilestone(mIdx, "statusColor", "");
                                    }}
                                    className={`px-3 py-1.5 rounded-xl border-2 font-mono text-[10.5px] font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                                      isSelected
                                        ? "bg-black text-white border-black shadow-[2px_2px_0_rgba(0,0,0,0.25)] scale-[1.03]"
                                        : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                                    }`}
                                  >
                                    <span
                                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                                      style={{ backgroundColor: preset.color }}
                                    />
                                    <span>{preset.label}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Custom Status Label & Color Input */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-dashed border-amber-200">
                              <div>
                                <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                                  Custom Status Label (Optional):
                                </label>
                                <input
                                  type="text"
                                  value={m.statusLabel || ""}
                                  placeholder="e.g. AAGE KARNA HAI 🚀 or IN TESTING ⚡"
                                  onChange={(e) => handleUpdateMilestone(mIdx, "statusLabel", e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                                  Custom Badge Color (Optional):
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={m.statusColor || mStatus.color || "#10b981"}
                                    onChange={(e) => handleUpdateMilestone(mIdx, "statusColor", e.target.value)}
                                    className="w-8 h-8 rounded-md border border-stone-300 p-0.5 cursor-pointer bg-white"
                                  />
                                  <span className="font-mono text-xs text-stone-700 font-bold">
                                    {m.statusColor || "Preset Default"}
                                  </span>
                                  {m.statusColor && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateMilestone(mIdx, "statusColor", "")}
                                      className="text-[10px] font-mono text-rose-600 underline cursor-pointer ml-auto font-bold"
                                    >
                                      Reset Color
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 2. Phase Number & Domain Category */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                                Phase Number (e.g. 01, 02, 03):
                              </label>
                              <input
                                type="text"
                                value={m.phaseNumber || ""}
                                placeholder="e.g. 01"
                                onChange={(e) => handleUpdateMilestone(mIdx, "phaseNumber", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-800 focus:border-black focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                                Domain / Category (e.g. Foundations, Data &amp; Math):
                              </label>
                              <input
                                type="text"
                                value={m.period}
                                placeholder="e.g. Foundations, Data & Math"
                                onChange={(e) => handleUpdateMilestone(mIdx, "period", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-800 focus:border-black focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* 3. Title & Subtitle */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                                Phase Title:
                              </label>
                              <input
                                type="text"
                                value={m.title}
                                onChange={(e) => handleUpdateMilestone(mIdx, "title", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                                Focus &amp; Tools Subtitle:
                              </label>
                              <input
                                type="text"
                                value={m.subtitle}
                                onChange={(e) => handleUpdateMilestone(mIdx, "subtitle", e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* 4. Description */}
                          <div>
                            <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                              Phase Description:
                            </label>
                            <textarea
                              rows={2}
                              value={m.description}
                              onChange={(e) => handleUpdateMilestone(mIdx, "description", e.target.value)}
                              className="w-full p-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs text-stone-800 focus:border-black focus:outline-none leading-relaxed"
                            />
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMilestoneIdx(null);
                                saveInstantly(portfolioRef.current, `Phase ${m.phaseNumber || mIdx + 1} updated!`);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Save &amp; Lock Phase View</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>

                {/* Live Trajectory Roadmap Preview (Real Website Banners) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border border-stone-300 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-mono text-xs font-black uppercase text-stone-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live Trajectory Roadmap Preview (Actual Site Cards):</span>
                    </span>
                    <span className="font-mono text-[10px] text-stone-500">
                      [ROADMAP]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(portfolio.milestones && portfolio.milestones.length > 0
                      ? portfolio.milestones
                      : [
                          { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
                          { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
                          { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
                        ]
                    ).map((m, idx, list) => {
                      const milestoneThemes = [
                        { badgeBg: "bg-amber-400 text-black", border: "border-amber-300", accentText: "text-amber-800" },
                        { badgeBg: "bg-emerald-500 text-white", border: "border-emerald-300", accentText: "text-emerald-800" },
                        { badgeBg: "bg-indigo-600 text-white", border: "border-indigo-300", accentText: "text-indigo-800" },
                      ];
                      const t = milestoneThemes[idx % milestoneThemes.length];
                      const status = resolveMilestoneStatus(m, idx);
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${t.badgeBg}`}>
                                PHASE {m.phaseNumber || `0${idx + 1}`}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-mono text-[8.5px] font-black uppercase border shadow-2xs ${status.bg}`}
                                style={status.style}
                              >
                                {status.label}
                              </span>
                            </div>
                            <span className={`block font-mono text-[10.5px] font-bold ${t.accentText}`}>
                              {m.period}
                            </span>
                            <h4 className="font-black text-sm uppercase text-black leading-snug">
                              {m.title}
                            </h4>
                            <p className="text-[11px] font-mono font-bold text-stone-500">
                              {m.subtitle}
                            </p>
                            <p className="text-xs text-stone-600 leading-relaxed pt-1 border-t border-dashed border-stone-200">
                              {m.description}
                            </p>
                          </div>
                          <div className="pt-2 flex items-center justify-between font-mono text-[9.5px] font-black text-stone-400 uppercase border-t border-stone-100">
                            <span>STEP 0{idx + 1} OF {String(list.length).padStart(2, "0")}</span>
                            <span className="text-amber-500">✦ ✦ ✦</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>


          </div>
        )}


        {/* ── TAB: KEY BENCHMARKS (QUICK STATS CAPSULES) ── */}
        {activeTab === "highlights" && (
          <div className="space-y-6">

            {/* ── 3. KEY BENCHMARKS (QUICK STATS CAPSULES) ── */}
            
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 text-sm">
                      ⚡
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        Key Benchmarks &amp; Impact Metrics
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        About section me Statement aur Bio ke theek neeche render hone wale slim benchmark capsules.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAddQuickStat}
                      className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Stat Capsule</span>
                    </button>
                  </div>
                </div>

                {/* Edit Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {(portfolio.quickStats || []).map((stat, idx) => {
                    const theme = getBenchmarkStickerTheme(stat, idx);
                    const currentColor = (stat.color || "").toLowerCase().trim();
                    const isEditingThisStat = editingStatIdx === idx;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-3.5"
                      >
                        {/* Header & Ordering */}
                        <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.hex }} />
                            <span className="font-mono text-xs font-black uppercase text-stone-900">
                              Card #{idx + 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingStatIdx(isEditingThisStat ? null : idx)}
                              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black cursor-pointer flex items-center gap-1 border border-black shadow-[1px_1px_0_#000] active:translate-y-0.5 transition-all ${
                                isEditingThisStat
                                  ? "bg-emerald-400 text-black hover:bg-emerald-300"
                                  : "bg-amber-400 text-black hover:bg-amber-300"
                              }`}
                              title={isEditingThisStat ? "Done editing" : "Edit metric"}
                            >
                              {isEditingThisStat ? (
                                <>
                                  <Check className="w-2.5 h-2.5" />
                                  <span>Done</span>
                                </>
                              ) : (
                                <>
                                  <Edit className="w-2.5 h-2.5" />
                                  <span>Edit</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveQuickStat(idx, "up")}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                              title="Move Left/Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveQuickStat(idx, "down")}
                              disabled={idx === (portfolio.quickStats || []).length - 1}
                              className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                              title="Move Right/Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveQuickStat(idx)}
                              className="p-1 rounded bg-white border border-stone-300 text-red-500 hover:bg-red-50 cursor-pointer ml-1"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {!isEditingThisStat ? (
                          /* ── View Mode: Clean Sticker Card ── */
                          <div className="space-y-2.5 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase tracking-wider bg-stone-100 border border-stone-300">
                                <span>{stat.icon || theme.defaultIcon}</span>
                                <span>{stat.tag || theme.defaultTag}</span>
                              </span>
                              <span className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: theme.hex }} />
                            </div>

                            <div className="text-2xl font-black font-mono tracking-tight text-stone-900 leading-none">
                              {stat.value || "0"}
                            </div>
                            <div className="text-[11px] font-mono font-black uppercase tracking-wider text-stone-800 leading-tight">
                              {stat.label || "METRIC"}
                            </div>
                            {stat.sublabel && (
                              <div className="text-[10px] font-mono text-stone-500 truncate leading-tight font-medium">
                                {stat.sublabel}
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-stone-400 border-t border-dashed border-stone-200">
                              <span>Locked. Click Edit to change.</span>
                              <button
                                type="button"
                                onClick={() => setEditingStatIdx(idx)}
                                className="text-amber-700 hover:text-amber-900 font-bold"
                              >
                                ✏️ Edit Metric ↗
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Edit Mode: Form Inputs ── */
                          <div className="space-y-3 pt-1">
                            {/* 1. Color Picker & Palette */}
                            <div className="space-y-1.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                              <div className="flex items-center justify-between">
                                <label className="font-mono text-[10px] font-black uppercase text-stone-700 flex items-center gap-1">
                                  <Palette className="w-3 h-3 text-stone-500" />
                                  <span>Card Color:</span>
                                </label>
                                <span className="font-mono text-[9.5px] font-bold text-stone-500 uppercase">
                                  {theme.name}
                                </span>
                              </div>

                              {/* 8 Preset Swatches */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                {Object.entries(BENCHMARK_STICKER_COLOR_MAP).map(([key, val]) => {
                                  const isSelected =
                                    currentColor === key ||
                                    currentColor === val.hex.toLowerCase() ||
                                    (!stat.color && theme.hex.toLowerCase() === val.hex.toLowerCase());

                                  return (
                                    <button
                                      key={key}
                                      type="button"
                                      onClick={() => handleUpdateQuickStat(idx, "color", key)}
                                      className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                                        isSelected
                                          ? "scale-120 ring-2 ring-black shadow-xs"
                                          : "border-stone-300 hover:scale-110 opacity-75 hover:opacity-100"
                                      }`}
                                      style={{ backgroundColor: val.hex }}
                                      title={`${val.name} (${val.hex})`}
                                    />
                                  );
                                })}

                                {/* Native Custom Hex Color Input */}
                                <div className="flex items-center gap-1 pl-1 ml-auto border-l border-stone-200">
                                  <input
                                    type="color"
                                    value={theme.hex}
                                    onChange={(e) => handleUpdateQuickStat(idx, "color", e.target.value)}
                                    className="w-4.5 h-4.5 rounded cursor-pointer border-0 p-0 bg-transparent"
                                    title="Pick custom color"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* 2. Tag & Icon */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2 space-y-1">
                                <label className="block font-mono text-[10px] font-black uppercase text-stone-700">
                                  Top Tag:
                                </label>
                                <input
                                  type="text"
                                  value={stat.tag !== undefined ? stat.tag : theme.defaultTag}
                                  onChange={(e) => handleUpdateQuickStat(idx, "tag", e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-black uppercase text-stone-900 focus:border-black focus:outline-none"
                                  placeholder="e.g. HONORS"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block font-mono text-[10px] font-black uppercase text-stone-700">
                                  Icon:
                                </label>
                                <input
                                  type="text"
                                  value={stat.icon !== undefined ? stat.icon : theme.defaultIcon}
                                  onChange={(e) => handleUpdateQuickStat(idx, "icon", e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs text-center text-stone-900 focus:border-black focus:outline-none"
                                  placeholder="🏆"
                                />
                              </div>
                            </div>

                            {/* 3. Big Metric Value */}
                            <div>
                              <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                                Value (Big Stat):
                              </label>
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => handleUpdateQuickStat(idx, "value", e.target.value)}
                                onBlur={() => saveInstantly(portfolioRef.current, `Saved Card #${idx + 1} stat value!`)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-sm font-black text-stone-900 focus:border-black focus:outline-none"
                                placeholder="e.g. 5+ / 150+ / AI & DS"
                              />
                            </div>

                            {/* 4. Title / Label */}
                            <div>
                              <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                                Label / Heading:
                              </label>
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => handleUpdateQuickStat(idx, "label", e.target.value)}
                                onBlur={() => saveInstantly(portfolioRef.current, `Saved Card #${idx + 1} label!`)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                                placeholder="e.g. CERTIFICATIONS"
                              />
                            </div>

                            {/* 5. Sublabel / Description */}
                            <div>
                              <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                                Sublabel / Note:
                              </label>
                              <input
                                type="text"
                                value={stat.sublabel}
                                onChange={(e) => handleUpdateQuickStat(idx, "sublabel", e.target.value)}
                                onBlur={() => saveInstantly(portfolioRef.current, `Saved Card #${idx + 1} note!`)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-[11px] text-stone-600 focus:border-black focus:outline-none"
                                placeholder="e.g. Courses & Hackathons"
                              />
                            </div>

                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingStatIdx(null)}
                                className="px-3 py-1 rounded-lg bg-black text-white hover:bg-stone-800 font-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Done</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Live Colourful Sticker Preview */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 border border-stone-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-mono text-xs font-black uppercase text-stone-800 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-stone-600" />
                      <span>Live Key Benchmarks Preview (Colourful Stickers):</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-white font-mono text-[9px] font-black uppercase -rotate-1 shadow-[1.5px_1.5px_0_#f59e0b]">
                      🏷️ KEY BENCHMARKS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 pt-1">
                    {(portfolio.quickStats || []).map((st, i) => {
                      const theme = getBenchmarkStickerTheme(st, i);
                      return (
                        <div
                          key={i}
                          className={`relative pt-3.5 pb-2.5 px-3 rounded-2xl border-2 ${theme.border} ${theme.bg} ${theme.shadow} ${theme.tilt} transition-all`}
                        >
                          {/* Washi tape strip */}
                          <div
                            className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 ${theme.tape} border border-black/25 shadow-xs rotate-[-1deg] rounded-xs`}
                          />

                          {/* Top row */}
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-black uppercase tracking-wider border ${theme.badgeBg}`}
                            >
                              {theme.icon && <span>{theme.icon}</span>}
                              <span>{st.tag || theme.tag}</span>
                            </span>
                            <span className="text-[9.5px] font-mono font-bold text-black/35">
                              #{String(i + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight leading-none ${theme.valueText}`}>
                            {st.value || "0"}
                          </div>
                          <div className={`text-[10px] sm:text-[10.5px] font-mono font-black uppercase tracking-wider mt-1.5 leading-tight ${theme.labelText}`}>
                            {st.label || "METRIC"}
                          </div>
                          {st.sublabel && (
                            <div className={`text-[9px] font-mono truncate mt-0.5 leading-tight font-medium ${theme.sublabel}`}>
                              {st.sublabel}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>


          </div>
        )}



        {/* ── TAB: TECHNICAL ARSENAL & SKILLS ── */}
        {activeTab === "skills" && (
          <div className="space-y-8">
            {/* Header intro & Save CTA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Code2 className="w-6 h-6 text-amber-500" />
                  <span>Technical Arsenal &amp; Skills ({portfolio.skills?.length || 0} Categories)</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1">
                  Skills categories aur har category ke toolchips ko customize karein.
                </p>
              </div>
            </div>

            {/* Technical Arsenal Block */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300 text-sm">
                    💻
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Technical Arsenal (Core Capabilities)
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Skills categories aur har category ke tags ko customize karein.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                {(portfolio.skills || []).map((cat, cIdx) => {
                  const isEditingThisSkillCat = editingSkillCatIdx === cIdx;
                  return (
                  <div
                    key={cIdx}
                    className="p-5 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-4"
                  >
                    {/* Category Title & Order Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                        <span className="px-2 py-0.5 rounded-md bg-black text-amber-300 font-mono text-[10px] font-black shrink-0">
                          #{String(cIdx + 1).padStart(2, "0")}
                        </span>
                        {!isEditingThisSkillCat ? (
                          <div className="flex items-center gap-2">
                            <span className="font-['Space_Grotesk'] text-base font-black text-stone-900 uppercase">
                              {cat.category || "Untitled Category"}
                            </span>
                            <span className="text-[10px] font-mono text-stone-500 font-bold bg-stone-100 px-2 py-0.5 rounded-md">
                              {(cat.items || []).length} Skills
                            </span>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={cat.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPortfolio((prev) => {
                                const updated = [...(prev.skills || [])];
                                updated[cIdx] = { ...updated[cIdx], category: val };
                                return { ...prev, skills: updated };
                              });
                            }}
                            onBlur={() => {
                              saveInstantly(portfolioRef.current, `Saved category "${cat.category}"`);
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-black text-stone-900 focus:border-black focus:outline-none uppercase"
                            placeholder="Category Name"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingSkillCatIdx(isEditingThisSkillCat ? null : cIdx)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-black cursor-pointer flex items-center gap-1 border border-black shadow-[1px_1px_0_#000] active:translate-y-0.5 transition-all ${
                            isEditingThisSkillCat
                              ? "bg-emerald-400 text-black hover:bg-emerald-300"
                              : "bg-amber-400 text-black hover:bg-amber-300"
                          }`}
                        >
                          {isEditingThisSkillCat ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Done</span>
                            </>
                          ) : (
                            <>
                              <Edit className="w-3 h-3" />
                              <span>Edit Category</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveSkillCategory(cIdx, "up")}
                          disabled={cIdx === 0}
                          className={`p-1.5 rounded-lg border bg-white cursor-pointer ${
                            cIdx === 0
                              ? "border-stone-200 text-stone-300 cursor-not-allowed"
                              : "border-stone-300 text-stone-600 hover:text-black hover:border-black"
                          }`}
                          title="Move Category Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSkillCategory(cIdx, "down")}
                          disabled={cIdx === (portfolio.skills?.length || 1) - 1}
                          className={`p-1.5 rounded-lg border bg-white cursor-pointer ${
                            cIdx === (portfolio.skills?.length || 1) - 1
                              ? "border-stone-200 text-stone-300 cursor-not-allowed"
                              : "border-stone-300 text-stone-600 hover:text-black hover:border-black"
                          }`}
                          title="Move Category Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillCategory(cIdx)}
                          className="p-1.5 rounded-lg border border-stone-300 text-stone-500 hover:text-red-600 hover:border-red-400 bg-white cursor-pointer ml-1"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Color Theme & Icon / Emoji Customizers (Only in Edit Mode) */}
                    {isEditingThisSkillCat && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                        {/* Card Color Theme Picker */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold text-stone-600 uppercase flex items-center gap-1">
                              <Palette className="w-3 h-3 text-amber-500" />
                              <span>Card Color Theme:</span>
                            </label>
                            <span className="text-[9px] font-mono font-bold uppercase text-stone-500">
                              {cat.color || "amber"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {ADMIN_PALETTE_COLORS.map((col) => {
                              const isSelected = (cat.color || "amber").toLowerCase() === col.id;
                              return (
                                <button
                                  key={col.id}
                                  type="button"
                                  onClick={() => {
                                    setPortfolio((prev) => {
                                      const updated = [...(prev.skills || [])];
                                      updated[cIdx] = { ...updated[cIdx], color: col.id };
                                      return { ...prev, skills: updated };
                                    });
                                    saveInstantly(portfolioRef.current, `Set color "${col.name}" for "${cat.category}"`);
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                                    isSelected ? "border-black scale-110 shadow-xs" : "border-stone-200 hover:scale-105"
                                  }`}
                                  style={{ backgroundColor: col.hex }}
                                  title={col.name}
                                >
                                  {isSelected && <span className="text-white text-[9px] font-black drop-shadow-xs">✓</span>}
                                </button>
                              );
                            })}
                            {/* Custom Color Input */}
                            <div className="relative inline-flex items-center ml-1">
                              <input
                                type="color"
                                value={
                                  cat.color && cat.color.startsWith("#")
                                    ? cat.color
                                    : (ADMIN_PALETTE_COLORS.find((c) => c.id === cat.color)?.hex || "#f59e0b")
                                }
                                onChange={(e) => {
                                  const hex = e.target.value;
                                  setPortfolio((prev) => {
                                    const updated = [...(prev.skills || [])];
                                    updated[cIdx] = { ...updated[cIdx], color: hex };
                                    return { ...prev, skills: updated };
                                  });
                                }}
                                onBlur={() => {
                                  saveInstantly(portfolioRef.current, `Saved custom color for "${cat.category}"`);
                                }}
                                className="w-6 h-6 rounded-full border border-stone-300 p-0 cursor-pointer overflow-hidden"
                                title="Pick custom hex color"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Card Icon Picker */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-bold text-stone-600 uppercase flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Category Icon / Emoji:</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-1">
                            {SKILL_ICON_PRESETS.map((ic) => {
                              const isSelected = (cat.icon || "code").toLowerCase() === ic.id;
                              return (
                                <button
                                  key={ic.id}
                                  type="button"
                                  onClick={() => {
                                    setPortfolio((prev) => {
                                      const updated = [...(prev.skills || [])];
                                      updated[cIdx] = { ...updated[cIdx], icon: ic.id };
                                      return { ...prev, skills: updated };
                                    });
                                    saveInstantly(portfolioRef.current, `Set icon "${ic.label}" for "${cat.category}"`);
                                  }}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                    isSelected
                                      ? "bg-black text-white border-black shadow-xs"
                                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                                  }`}
                                  title={ic.label}
                                >
                                  <span>{ic.emoji}</span>
                                  <span className="hidden xl:inline">{ic.label}</span>
                                </button>
                              );
                            })}
                            {/* Custom Icon/Emoji Input */}
                            <input
                              type="text"
                              placeholder="Custom: e.g. 🤖, 🚀"
                              value={cat.icon || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPortfolio((prev) => {
                                  const updated = [...(prev.skills || [])];
                                  updated[cIdx] = { ...updated[cIdx], icon: val };
                                  return { ...prev, skills: updated };
                                });
                              }}
                              onBlur={() => {
                                saveInstantly(portfolioRef.current, `Saved custom icon for "${cat.category}"`);
                              }}
                              className="w-28 px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-300 font-mono text-[10px] text-stone-900 focus:border-black focus:outline-none"
                              title="Type any emoji or icon name (e.g. 🤖, 🚀, brain, laptop, terminal)"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Skill Tags */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                        Category Skills &amp; Tools ({cat.items?.length || 0}):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items?.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-300 text-stone-900 font-mono text-xs font-bold shadow-2xs"
                          >
                            <span>✦ {item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkillItem(cIdx, iIdx)}
                              className="text-stone-400 hover:text-red-600 text-[10px] ml-0.5 cursor-pointer font-bold"
                              title="Remove tag"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Add Skill to this Category */}
                    <div className="flex gap-2 pt-1 max-w-md">
                      <input
                        type="text"
                        placeholder="e.g. Scikit-Learn, PyTorch..."
                        value={skillTagInputs[cIdx] || ""}
                        onChange={(e) =>
                          setSkillTagInputs((prev) => ({ ...prev, [cIdx]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkillItem(cIdx, skillTagInputs[cIdx] || "");
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSkillItem(cIdx, skillTagInputs[cIdx] || "")}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold cursor-pointer shrink-0"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>
                );
              })}

                {/* Add New Category */}
                <div className="flex gap-2 pt-2 max-w-md">
                  <input
                    type="text"
                    placeholder="New Category Name (e.g. Cloud &amp; MLOps)..."
                    value={newSkillCatName}
                    onChange={(e) => setNewSkillCatName(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkillCategory}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-mono text-xs font-bold cursor-pointer shrink-0"
                  >
                    + Add Category
                  </button>
                </div>
              </div>
            </div>

            {/* Live Bento Preview (Matches Portfolio Public View) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/50 border-2 border-black shadow-[4px_4px_0_#000] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="sketch-stamp bg-black text-amber-300 font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    LIVE PREVIEW
                  </span>
                  <h4 className="font-['Space_Grotesk'] text-base font-black uppercase text-stone-900">
                    Live Bento Cards Preview (Portfolio Display)
                  </h4>
                </div>
                <span className="font-mono text-xs text-stone-500">
                  Yeh preview realtime me live updates reflect karta hai
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 pt-2">
                {(portfolio.skills || []).map((group, idx) => {
                  const colorKey = (group.color || "").toLowerCase().trim();
                  const theme = SKILL_CARD_COLOR_MAP[colorKey] || Object.values(SKILL_CARD_COLOR_MAP)[idx % 8];
                  const total = portfolio.skills?.length || 1;
                  const colSpan =
                    total === 5
                      ? idx < 3
                        ? "lg:col-span-2"
                        : "lg:col-span-3"
                      : total === 4 || total === 2
                      ? "lg:col-span-3"
                      : total === 1
                      ? "lg:col-span-6"
                      : "lg:col-span-2";

                  return (
                    <div
                      key={idx}
                      className={`relative p-4 rounded-2xl ${colSpan} ${theme.bg} ${theme.border} ${theme.shadow} flex flex-col justify-between space-y-3 transition-all`}
                    >
                      {/* Washi tape pin */}
                      <div
                        className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 ${theme.tape} border border-black/25 shadow-xs rotate-[-1deg] rounded-xs pointer-events-none z-10`}
                      />

                      <div className="flex items-center justify-between gap-1 pb-2 border-b border-dashed border-black/15">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`inline-flex px-1.5 py-0.5 rounded font-mono text-[9px] font-black border ${theme.badgeBg}`}>
                            0{idx + 1}
                          </span>
                          <span className="font-mono text-xs font-black uppercase text-black flex items-center gap-1.5 truncate">
                            {renderSkillIcon(group.icon, `w-3.5 h-3.5 ${theme.iconColor} shrink-0`)}
                            <span className="truncate">{group.category || "Untitled Category"}</span>
                          </span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-stone-500 px-1.5 py-0.5 rounded-full bg-black/5 shrink-0">
                          {group.items?.length || 0} tools
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(group.items || []).map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-black/15 text-stone-900 font-mono text-[11px] font-bold shadow-2xs"
                          >
                            <span className={theme.starColor}>✦</span>
                            <span>{tool}</span>
                          </span>
                        ))}
                        {(!group.items || group.items.length === 0) && (
                          <span className="font-mono text-xs text-stone-400 italic">No skill tags yet. Add one above!</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: PROJECTS MANAGER ── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Header + Add Project CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900">
                  Projects Catalog ({portfolio.projects?.length || 0})
                </h2>
                <p className="font-mono text-xs text-stone-500">
                  Manage projects, dynamic categories, GitHub repositories, and live demo links
                </p>
              </div>

              <button
                type="button"
                onClick={openNewProjectModal}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#000] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Navigation & Mobile Dock Icon Selector */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Projects Navigation Icon (Laptop Menu &amp; Mobile Dock)</span>
                  </div>
                  <p className="text-[11px] font-mono text-stone-500">
                    Choose which icon represents Projects across both laptop dropdown and mobile bottom dock
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-stone-400">Current:</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-[10px] font-bold uppercase">
                    {portfolio.personal.projectsNavIcon || "foldercode"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  { id: "foldercode", label: "Folder Code (<>)", icon: FolderCode, desc: "Clean Code Folder" },
                  { id: "code", label: "Code Brackets (</>)", icon: Code2, desc: "Classic Developer Brackets" },
                  { id: "folder", label: "Clean Folder", icon: Folder, desc: "Minimalist Directory" },
                  { id: "terminal", label: "Terminal (>_)", icon: Terminal, desc: "Command Terminal" },
                  { id: "layers", label: "Stack Layers", icon: Layers, desc: "Architectural Build" },
                ].map((opt) => {
                  const isSelected = (portfolio.personal.projectsNavIcon || "foldercode") === opt.id;
                  const IconComp = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={async () => {
                        const updated = {
                          ...portfolio,
                          personal: {
                            ...portfolio.personal,
                            projectsNavIcon: opt.id as any,
                          },
                        };
                        setPortfolio(updated);
                        await saveInstantly(updated, `✓ Projects icon changed to "${opt.label}"!`);
                      }}
                      className={`px-3 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? "bg-black text-white border-black shadow-[2px_2px_0_#6366f1]"
                          : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-black"
                      }`}
                    >
                      <IconComp className={`w-4 h-4 ${isSelected ? "text-indigo-400 stroke-[2.5]" : "text-stone-600"}`} />
                      <span>{opt.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Project Categories Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-stone-800">
                    Project Categories ({projectCats.length}):
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    (Added categories show up as live filter pills on the main site)
                  </span>
                </div>

                {/* Add Category Form */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newProjectCatInput}
                    onChange={(e) => setNewProjectCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddProjectCategory();
                      }
                    }}
                    placeholder="New category name..."
                    className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 font-mono focus:border-black focus:outline-none bg-stone-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddProjectCategory}
                    className="px-3 py-1.5 bg-black text-white hover:bg-stone-800 text-xs font-mono font-bold rounded-xl cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Category Badges with delete button */}
              <div className="flex flex-wrap gap-2 pt-1">
                {projectCats.length === 0 ? (
                  <span className="text-xs font-mono text-stone-400 italic">No project categories defined yet. Type above and click "+ Add".</span>
                ) : (
                  projectCats.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono text-xs font-bold shadow-xs hover:border-stone-400 transition-colors"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProjectCategory(cat)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer text-[10px]"
                        title={`Remove "${cat}"`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Projects Grid */}
            {(portfolio.projects || []).length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border-2 border-dashed border-stone-200 font-mono space-y-2">
                <p className="text-stone-800 font-bold text-sm">No projects added yet</p>
                <p className="text-stone-500 text-xs">Click "+ Add Project" above to publish your first project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(portfolio.projects || []).map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-black flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[4px_4px_0_#000] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold uppercase">
                          {proj.category}
                        </span>
                        {proj.color && (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-300 font-mono text-[9px] font-bold uppercase text-stone-700"
                            title={`Color theme: ${proj.color}`}
                          >
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  ADMIN_PALETTE_COLORS.find((c) => c.id === proj.color)?.hex ||
                                  (proj.color.startsWith("#") ? proj.color : "#f59e0b"),
                              }}
                            />
                            <span>{proj.color}</span>
                          </span>
                        )}
                        {proj.isVisible === false && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 font-mono text-[9px] font-bold uppercase">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleProjectVisibility(proj.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            proj.isVisible !== false
                              ? "bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-black"
                              : "bg-rose-100 hover:bg-rose-200 text-rose-700"
                          }`}
                          title={proj.isVisible !== false ? "Hide project from main site" : "Show project on main site"}
                        >
                          {proj.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(proj)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-black cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-mono font-black text-base text-stone-900 line-clamp-1">{proj.title}</h3>
                    <p className="font-mono text-xs text-stone-600 line-clamp-2 leading-relaxed">{proj.tagline}</p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies?.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[9px] border border-stone-200">
                          {t}
                        </span>
                      ))}
                      {proj.technologies && proj.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-mono text-[9px]">
                          +{proj.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Links Footer */}
                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between font-mono text-xs">
                    {proj.githubUrl ? (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-stone-700 hover:text-black flex items-center gap-1 font-bold hover:underline">
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-stone-400 text-[11px]">No GitHub Link</span>
                    )}

                    {proj.liveUrl ? (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-red-600 hover:text-red-800 flex items-center gap-1 font-bold hover:underline">
                        <span>Live</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-stone-400 text-[11px]">No Live Link</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* ── TAB: CERTIFICATES MANAGER ── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900">
                  Certificates &amp; Credentials ({portfolio.certificates?.length || 0})
                </h2>
                <p className="font-mono text-xs text-stone-500">
                  Manage accredited courses, certificates, photo previews, and custom categories
                </p>
              </div>

              <button
                type="button"
                onClick={openNewCertModal}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#000] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Certificate</span>
              </button>
            </div>

            {/* Dynamic Certificate Categories Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-stone-800">
                    Certificate Categories ({certCats.length}):
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    (Directly synced with the clothesline carousel on main site)
                  </span>
                </div>

                {/* Add Category Form */}
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newCertCatInput}
                    onChange={(e) => setNewCertCatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertCategory();
                      }
                    }}
                    placeholder="New category..."
                    className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 font-mono focus:border-black focus:outline-none bg-stone-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddCertCategory}
                    className="px-3 py-1.5 bg-black text-white hover:bg-stone-800 text-xs font-mono font-bold rounded-xl cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Category Badges with delete button */}
              <div className="flex flex-wrap gap-2 pt-1">
                {certCats.length === 0 ? (
                  <span className="text-stone-400 font-mono text-xs italic">
                    No custom categories added yet. Add one above or type a new one when creating a certificate.
                  </span>
                ) : (
                  certCats.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-mono text-xs font-bold shadow-xs hover:border-stone-400 transition-colors"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCertCategory(cat)}
                        className="w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-red-500 transition-colors cursor-pointer text-[10px]"
                        title={`Remove "${cat}"`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Certificates List */}
            {(portfolio.certificates || []).length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border-2 border-dashed border-stone-200 font-mono space-y-2">
                <p className="text-stone-800 font-bold text-sm">No certificates added yet</p>
                <p className="text-stone-500 text-xs">Click "+ Add Certificate" above to upload your verified credentials.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(portfolio.certificates || []).map((cert) => (
                  <div
                    key={cert.id}
                    className={`p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-black flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[4px_4px_0_#000] transition-all ${
                      cert.isVisible === false ? "opacity-60 bg-stone-50 border-dashed" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Certificate Photo / Image Thumbnail (if added) */}
                      {cert.imageUrl ? (
                        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-stone-300 shadow-sm bg-stone-100 flex items-center justify-center relative">
                          <img
                            src={formatGoogleDriveImageUrl(cert.imageUrl)}
                            alt={cert.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.dataset.triedFallback && isGoogleDriveUrl(cert.imageUrl)) {
                                target.dataset.triedFallback = "true";
                                target.src = formatGoogleDriveThumbnailUrl(cert.imageUrl);
                              } else {
                                (target as HTMLElement).style.display = "none";
                              }
                            }}
                          />
                          {isGoogleDriveUrl(cert.imageUrl) && (
                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/75 text-amber-300 font-mono text-[8px] font-bold rounded">
                              DRIVE
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 shrink-0 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
                          <Award className="w-8 h-8" />
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold uppercase truncate">
                              {cert.category}
                            </span>
                            {cert.color && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-300 font-mono text-[9px] font-bold uppercase text-stone-700"
                                title={`Theme: ${cert.color}`}
                              >
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{
                                    backgroundColor:
                                      ADMIN_PALETTE_COLORS.find((c) => c.id === cert.color)?.hex ||
                                      (cert.color.startsWith("#") ? cert.color : "#f59e0b"),
                                  }}
                                />
                                <span>{cert.color}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleCertVisibility(cert.id)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                cert.isVisible !== false
                                  ? "bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-black"
                                  : "bg-rose-100 hover:bg-rose-200 text-rose-700"
                              }`}
                              title={cert.isVisible !== false ? "Hide certificate from main site" : "Show certificate on main site"}
                            >
                              {cert.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditCertModal(cert)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-black cursor-pointer"
                              title="Edit Certificate"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCert(cert.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                              title="Delete Certificate"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h3 className="font-mono font-black text-sm text-stone-900 line-clamp-1">{cert.title}</h3>
                        <p className="font-mono text-xs text-stone-600 flex items-center gap-2 flex-wrap">
                          <span>{cert.issuer} • <span className="font-bold">{cert.issueDate}</span></span>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            {cert.verificationSource?.trim()
                              ? (cert.verificationSource.trim().toLowerCase().startsWith("verified by")
                                  ? cert.verificationSource.trim()
                                  : `Verified by ${cert.verificationSource.trim()}`)
                              : (cert.issuer ? `Verified by ${cert.issuer}` : "Verified by Institution")}
                          </span>
                        </p>
                      </div>
                    </div>

                    <p className="font-mono text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {cert.description}
                    </p>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1">
                      {cert.skillsLearned?.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[9px] border border-stone-200">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Verification link */}
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-mono text-xs">
                      <span className="text-stone-500 text-[11px]">ID: {cert.credentialId || "N/A"}</span>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline flex items-center gap-1 font-bold">
                          <span>Verify Credential</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SUBSECTION: LAURELS, RESEARCH PAPERS & PUBLISHED BOOKS MANAGER ── */}
            <div className="pt-10 border-t-2 border-dashed border-stone-300 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-['Space_Grotesk'] text-xl font-black uppercase text-stone-900">
                      Laurels, Research Papers &amp; Published Books ({(portfolio.laurelItems || []).length})
                    </h3>
                  </div>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    Manage hackathon laurels, peer-reviewed research papers, and published academic literature with instant hide/unhide control
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Master Section Hide / Unhide Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleLaurelsSection}
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-2 ${
                      portfolio.personal.showLaurelsSection !== false
                        ? "bg-emerald-50 text-emerald-900 border-emerald-500 shadow-[2px_2px_0_#10b981]"
                        : "bg-stone-100 text-stone-600 border-stone-300"
                    }`}
                    title="Toggle whole section visibility on the live site"
                  >
                    {portfolio.personal.showLaurelsSection !== false ? (
                      <>
                        <Eye className="w-4 h-4 text-emerald-600" />
                        <span>Section Visible on Site</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-stone-400" />
                        <span>Section Hidden from Site</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openNewLaurelModal("award")}
                    className="px-4 py-2 rounded-xl bg-black hover:bg-stone-800 text-white font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#f59e0b] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>+ Add Entry</span>
                  </button>
                </div>
              </div>

              {/* Type Filter Pills within Admin */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                {(["all", "award", "paper", "book"] as const).map((t) => {
                  const items = portfolio.laurelItems || [];
                  const count = t === "all" ? items.length : items.filter((i) => i.type === t).length;
                  const label =
                    t === "all"
                      ? `All Entries (${count})`
                      : t === "award"
                      ? `🏆 Awards & Laurels (${count})`
                      : t === "paper"
                      ? `📄 Research Papers (${count})`
                      : `📚 Published Books (${count})`;

                  const isSelected = laurelAdminFilter === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLaurelAdminFilter(t)}
                      className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer font-bold ${
                        isSelected
                          ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:border-black"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Items List in Admin */}
              {(() => {
                const raw = portfolio.laurelItems || [];
                const filtered = laurelAdminFilter === "all" ? raw : raw.filter((i) => i.type === laurelAdminFilter);

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 sm:p-12 text-center rounded-2xl bg-white border-2 border-dashed border-stone-200 font-mono space-y-2">
                      <p className="text-stone-800 font-bold text-sm">No items in this filter view</p>
                      <p className="text-stone-500 text-xs">Click "+ Add Entry" above to add an award, research paper, or published book.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => {
                      const isAward = item.type === "award";
                      const isPaper = item.type === "paper";
                      const isBook = item.type === "book";
                      const isVis = item.isVisible !== false;

                      return (
                        <div
                          key={item.id}
                          className={`p-5 rounded-2xl bg-white border-2 flex flex-col justify-between space-y-4 shadow-sm transition-all ${
                            isVis ? "border-stone-200 hover:border-black" : "border-dashed border-stone-300 opacity-60 bg-stone-50/70"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-200">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black uppercase border flex items-center gap-1 ${
                                    isAward
                                      ? "bg-amber-100 text-amber-900 border-amber-300"
                                      : isPaper
                                      ? "bg-indigo-100 text-indigo-900 border-indigo-300"
                                      : "bg-rose-100 text-rose-900 border-rose-300"
                                  }`}
                                >
                                  {isAward ? "🏆 Award" : isPaper ? "📄 Paper" : "📚 Book"}
                                </span>
                                {item.color && (
                                  <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 border border-stone-300 font-mono text-[9px] font-bold uppercase text-stone-700"
                                    title={`Color theme: ${item.color}`}
                                  >
                                    <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{
                                        backgroundColor:
                                          ADMIN_PALETTE_COLORS.find((c) => c.id === item.color)?.hex ||
                                          (item.color.startsWith("#") ? item.color : "#f59e0b"),
                                      }}
                                    />
                                    <span>{item.color}</span>
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Quick Hide / Show Item Toggle */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleLaurelVisibility(item.id)}
                                  className={`p-1.5 rounded-lg border text-xs font-mono font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                                    isVis
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                      : "bg-stone-200 text-stone-600 border-stone-400 hover:bg-stone-300"
                                  }`}
                                  title={isVis ? "Click to Hide this item from live site" : "Click to Show this item on live site"}
                                >
                                  {isVis ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-500" />}
                                  <span className="text-[10px]">{isVis ? "Live" : "Hidden"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openEditLaurelModal(item)}
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-black cursor-pointer"
                                  title="Edit Entry"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLaurel(item.id)}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                                  title="Delete Entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-500 font-bold mb-1">
                                <span>{item.date}</span>
                                {item.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700 border border-stone-200">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-mono font-black text-sm text-stone-900 leading-snug line-clamp-2">
                                {item.title}
                              </h4>
                              <p className="font-mono text-xs text-stone-600 line-clamp-1 mt-1">
                                {item.issuerOrPublisher}
                              </p>
                              {item.roleOrAward && (
                                <p className="font-mono text-[11px] font-bold text-amber-700 line-clamp-1 mt-0.5">
                                  ✦ {item.roleOrAward}
                                </p>
                              )}
                            </div>

                            {item.description && (
                              <p className="font-mono text-xs text-stone-500 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {item.link ? (
                            <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono text-xs">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-700 hover:underline flex items-center gap-1 font-bold text-[11px]"
                              >
                                <span>Open Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                              No External Link
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── TAB: INQUIRIES & CONTACT ── */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            {/* Top Bar for Contact & Dispatch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Send className="w-6 h-6 text-amber-500" />
                  <span>Contact Page &amp; Inquiries Dispatch</span>
                </h2>
                <p className="font-mono text-xs text-stone-500">
                  Full control over contact headers, inquiry form copy, live coordinates station, and received client messages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingContactTexts(!isEditingContactTexts)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-[2px_2px_0_#000] active:translate-y-0.5 self-start sm:self-auto shrink-0 ${
                  isEditingContactTexts
                    ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                    : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                }`}
              >
                {isEditingContactTexts ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Done Editing</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>Edit Station Setup</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Sub-Section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              {[
                { id: "all", label: "✦ All Settings", count: "4" },
                { id: "coordinates", label: "📍 Live Coordinates & Clock", count: "Station" },
                { id: "copy", label: "📝 Header & Doodles", count: "Copy" },
                { id: "form", label: "📮 Inquiry Form & Email", count: "Form" },
                { id: "footer", label: "🏛️ Site Footer", count: "Footer" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setContactSubTab(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer flex items-center gap-2 ${
                    contactSubTab === sub.id
                      ? "bg-white text-stone-950 font-black shadow-xs border border-stone-300"
                      : "text-stone-600 hover:text-black font-bold hover:bg-white/60"
                  }`}
                >
                  <span>{sub.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      contactSubTab === sub.id
                        ? "bg-amber-300 text-stone-900"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            {/* ── 1. CONTACT PAGE HEADER & HANDWRITTEN DOODLES ── */}
            {(contactSubTab === "all" || contactSubTab === "copy") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-rose-100 text-rose-900 border border-rose-300 text-sm">
                      📝
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        1. Contact Header &amp; Visual Doodles
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        Main heading, introductory subtitle, and airmail letter doodle sticker
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingContactTexts(!isEditingContactTexts)}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-[1.5px_1.5px_0_#000] active:translate-y-0.5 ${
                        isEditingContactTexts
                          ? "bg-emerald-400 hover:bg-emerald-300 text-black border-2 border-black"
                          : "bg-amber-400 hover:bg-amber-300 text-black border-2 border-black"
                      }`}
                    >
                      {isEditingContactTexts ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </>
                      ) : (
                        <>
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit Header</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!isEditingContactTexts ? (
                  /* ── View Mode: Clean Plaque ── */
                  <div className="space-y-3.5 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Contact Section Title</span>
                        <span className="font-['Space_Grotesk'] font-black text-stone-900 text-base">{portfolio.personal.contactTitle || "LET'S BUILD SOMETHING EXTRAORDINARY"}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Airmail Sticky Note</span>
                        <span className="font-bold text-amber-800">{portfolio.personal.contactDoodleNote || "Open for Summer 2025 AI/ML Research & Engineering Internships"}</span>
                      </div>
                      <div className="sm:col-span-2 p-3.5 rounded-xl bg-white border border-stone-200">
                        <span className="text-[10px] font-black uppercase text-stone-400 block mb-0.5">Scope Description Subline</span>
                        <p className="text-stone-700 leading-relaxed font-medium">
                          {portfolio.personal.contactSubtitle || "Have an ambitious idea, research proposition, or engineering role in mind? Drop your dispatch directly into my terminal station."}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-dashed border-stone-200">
                      <span>Header texts locked. Click &ldquo;Edit Header&rdquo; to modify.</span>
                      <button
                        type="button"
                        onClick={() => setIsEditingContactTexts(true)}
                        className="text-amber-700 hover:text-amber-900 font-bold"
                      >
                        ✏️ Edit Header Texts ↗
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Edit Mode: Form Inputs ── */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                          Section Heading Title *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Send a Dispatch"
                          value={portfolio.personal.contactTitle || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, contactTitle: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                          Airmail Doodle Handwritten Note (Sticky Pill)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. drop a note anytime 💌"
                          value={portfolio.personal.contactDoodleNote || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, contactDoodleNote: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                          Introductory Subtitle / Scope Description
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Have an interesting machine learning challenge, internship opportunity, or algorithmic project in mind? Drop your inquiry directly into my terminal."
                          value={portfolio.personal.contactSubtitle || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, contactSubtitle: e.target.value },
                            }))
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingContactTexts(false)}
                        className="px-4 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Save &amp; Lock Header View</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 2. INQUIRY FORM & DIRECT EMAIL SETTINGS ── */}
            {(contactSubTab === "all" || contactSubTab === "form") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                    📮
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      2. Direct Inquiry Form &amp; Outreach Settings
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Customize form card title, postal mailbox doodle badge, button text, and direct mail
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Form Card Header Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DIRECT INQUIRY DISPATCH"
                      value={portfolio.personal.contactFormTitle || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, contactFormTitle: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Mailbox Doodle Handwritten Note
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. direct dispatch 📬"
                      value={portfolio.personal.contactMailboxNote || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, contactMailboxNote: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Submit Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SEND DISPATCH"
                      value={portfolio.personal.contactButtonText || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, contactButtonText: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Direct Electronic Mail (Email Address)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. harsharyan@outlook.com"
                      value={portfolio.personal.email || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, email: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Success Banner Message (Shown after form submission)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Thank you! Your message has been received directly. I will follow up shortly."
                      value={portfolio.personal.contactSuccessMessage || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, contactSuccessMessage: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. LIVE COORDINATES & CURRENT DISPATCH STATION ── */}
            {(contactSubTab === "all" || contactSubTab === "coordinates") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                  <span className="p-2 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 text-sm">
                    📍
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      3. Live Coordinates &amp; Current Dispatch Station
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Location coordinates, current workplace, real-time ticking clock timezone, status note &amp; stamp
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Title */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Coordinates Card Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CURRENT COORDINATES"
                      value={portfolio.personal.contactCoordinatesTitle || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, contactCoordinatesTitle: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Live Station Badge */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Station Badge Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LIVE STATION"
                      value={portfolio.personal.currentStationBadge || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentStationBadge: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Current Country */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Current Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. India"
                      value={portfolio.personal.currentCountry || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentCountry: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Current City & Location */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Current City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, India"
                      value={portfolio.personal.currentCity || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentCity: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Location / India Badge Color Link */}
                  <div className="md:col-span-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-700">
                        Location Pin Accent:
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-black border shadow-2xs"
                        style={{
                          backgroundColor: portfolio.personal.locationBadgeColor ? `${portfolio.personal.locationBadgeColor}15` : "#fee2e2",
                          color: portfolio.personal.locationBadgeColor || "#e11d48",
                          borderColor: portfolio.personal.locationBadgeColor || "#f43f5e",
                        }}
                      >
                        <MapPin className="w-3 h-3" />
                        <span>{portfolio.personal.currentCity || portfolio.personal.location || "Chennai, India"}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("badges")}
                      className="font-mono text-[10.5px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200 cursor-pointer self-start sm:self-auto"
                    >
                      🎨 Change Pin Color in Badges Tab ↗
                    </button>
                  </div>

                  {/* Current Role / Workplace ("kha job kr rha hu") */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Current Workplace / Role (&ldquo;Kaha Job Kar Rahe Ho&rdquo;) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Teaching Assistant @ IIT Madras"
                      value={portfolio.personal.currentWork || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentWork: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border-2 border-black font-mono text-xs font-bold text-amber-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Standard Timezone Label */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Timezone Label Display
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UTC+5:30 (IST)"
                      value={portfolio.personal.currentTimezone || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentTimezone: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Timezone IANA (For auto ticking clock) */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Timezone IANA Identifier (Controls Live Clock)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Asia/Kolkata, America/New_York, Europe/London"
                      value={portfolio.personal.currentTimezoneIana || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentTimezoneIana: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Status Note / Availability */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                      Current Status Note / Availability
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Open for Opportunities & Collaborations"
                      value={portfolio.personal.currentStatusNote || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, currentStatusNote: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Bento Preview */}
                <div className="pt-4 border-t border-dashed border-stone-300 space-y-2">
                  <div className="text-[10px] font-mono font-black uppercase text-stone-500 tracking-wider">
                    ✦ Live Station Card Preview:
                  </div>
                  <div className="p-4 sm:p-5 rounded-2xl border-2 border-black bg-stone-50 shadow-[3px_3px_0_#06b6d4] max-w-lg font-mono text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-dashed border-stone-300">
                      <span className="font-black text-cyan-900 uppercase">
                        {portfolio.personal.contactCoordinatesTitle || "CURRENT COORDINATES"}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {portfolio.personal.currentStationBadge || "LIVE STATION"}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-500">LOCATION:</strong>{" "}
                      {portfolio.personal.currentCountry ? `${portfolio.personal.currentCountry} • ` : ""}
                      {portfolio.personal.currentCity || portfolio.personal.location || "Chennai, India"}
                    </div>
                    <div>
                      <strong className="text-stone-500">STATION/JOB:</strong>{" "}
                      <span className="font-black text-amber-800">
                        {portfolio.personal.currentWork || "Teaching Assistant @ IIT Madras"}
                      </span>
                    </div>
                    <div>
                      <strong className="text-stone-500">STATUS:</strong>{" "}
                      <span className="italic text-stone-700">
                        &ldquo;{portfolio.personal.currentStatusNote || "Open for Opportunities"}&rdquo;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. QUICK SHORTCUT TO INCOMING INQUIRIES & DISPATCHES ── */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-white to-emerald-50 border-2 border-black shadow-[4px_4px_0_#000] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-amber-400 text-black border-2 border-black shadow-[2px_2px_0_#000] text-xl">
                  📬
                </span>
                <div>
                  <h4 className="font-['Space_Grotesk'] text-base font-black uppercase text-stone-900 flex items-center gap-2">
                    <span>Incoming Inquiries &amp; Dispatches</span>
                    <span className="px-2 py-0.5 rounded-full bg-black text-amber-300 font-mono text-xs font-black">
                      {messages.length} Messages
                    </span>
                  </h4>
                  <p className="font-mono text-xs text-stone-600">
                    Portfolio contact form se submit hone wale sabhi live messages ab apne dedicated top-level Inbox tab mein hain.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("inquiries")}
                className="px-4 py-2 rounded-xl bg-black hover:bg-stone-800 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-0.5 shrink-0"
              >
                <span>Open Inquiries Inbox</span>
                <Send className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* ── 5. SITE FOOTER & SOCIUS EASTER EGG MANAGER ── */}
            {(contactSubTab === "all" || contactSubTab === "footer") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-sm">
                    🏛️
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      5. Site Footer Branding &amp; Socius Easter Egg
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Customize footer brand name, subtitle moniker, bottom tagline, and secret 5-click easter egg text.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Brand Name */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-stone-700">
                      Footer Brand Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HARSH ARYAN"
                      value={portfolio.personal.footerBrandName || portfolio.personal.name || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, footerBrandName: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Footer Subtitle */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-stone-700">
                      Footer Subtitle Moniker:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Teaching machines to learn • Scientific software"
                      value={portfolio.personal.footerSubtitle || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, footerSubtitle: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Footer Tagline */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-stone-700">
                      Bottom Slim Tagline:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. crafting with code &amp; mathematics"
                      value={portfolio.personal.footerTagline || ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, footerTagline: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Easter Egg Trigger Text */}
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs font-bold text-stone-700">
                      Secret 5-Click Admin Trigger Text:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. socius"
                      value={portfolio.personal.footerEasterEggText ?? ""}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, footerEasterEggText: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                    />
                    <p className="font-mono text-[11px] text-stone-400">
                      Clicking this 5 times in the site footer opens the Socius admin console.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* ── PROJECT MODAL (ADD / EDIT) ── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[10px_10px_0_#000] space-y-4 text-stone-900">
            <h3 className="font-['Space_Grotesk'] text-xl font-black uppercase text-stone-900">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>

            <div className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-stone-800 font-bold mb-1">Project Title:</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Pneumonia Chest X-Ray Classifier"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Short Tagline:</label>
                <input
                  type="text"
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                  placeholder="Short one-line summary"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category Selector + Custom Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">Category:</label>
                  <select
                    value={customProjectCat ? "__custom__" : projectForm.category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setCustomProjectCat("New Category");
                      } else {
                        setCustomProjectCat("");
                        setProjectForm({ ...projectForm, category: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    {projectCats.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter Custom Category...</option>
                  </select>
                </div>

                {customProjectCat !== "" && (
                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Custom Category Name:</label>
                    <input
                      type="text"
                      value={customProjectCat}
                      onChange={(e) => setCustomProjectCat(e.target.value)}
                      placeholder="e.g. Robotics, GenAI"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-400 text-stone-900 focus:border-black focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Project Card Color Theme Selector */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold text-xs flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Project Card Color Theme:</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-700">
                    Selected: {projectForm.color || "amber"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ADMIN_PALETTE_COLORS.map((col) => {
                    const isSelected = (projectForm.color || "amber").toLowerCase() === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setProjectForm({ ...projectForm, color: col.id })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white border-black shadow-xs scale-105"
                            : "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                        {isSelected && <span className="text-amber-300 ml-0.5">✓</span>}
                      </button>
                    );
                  })}

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500">Custom:</span>
                    <input
                      type="color"
                      value={
                        projectForm.color && projectForm.color.startsWith("#")
                          ? projectForm.color
                          : (ADMIN_PALETTE_COLORS.find((c) => c.id === projectForm.color)?.hex || "#f59e0b")
                      }
                      onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                      className="w-5 h-5 rounded-full border border-stone-300 p-0 cursor-pointer overflow-hidden"
                      title="Pick custom hex color"
                    />
                  </div>
                </div>
              </div>

              {/* GitHub Repo URL & Live Demo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">GitHub Repo URL:</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/harsharyann/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1">Live Demo / Deployment URL:</label>
                  <input
                    type="text"
                    value={projectForm.liveUrl || ""}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Detailed Description:</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Explain the problem, methodology, and results..."
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Technologies (Comma separated):</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, technologies: list });
                  }}
                  placeholder="Python, PyTorch, OpenCV, Scikit-Learn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Key Metrics (Comma separated):</label>
                <input
                  type="text"
                  value={metricInput}
                  onChange={(e) => {
                    setMetricInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, metrics: list });
                  }}
                  placeholder="92.4% Accuracy, 5,000+ Samples, Sub-20ms Inference"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Project"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE MODAL (ADD / EDIT) ── */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[10px_10px_0_#000] space-y-4 text-stone-900">
            <h3 className="font-['Space_Grotesk'] text-xl font-black uppercase text-stone-900">
              {editingCert ? "Edit Certificate" : "Add New Certificate"}
            </h3>

            <div className="space-y-3.5 font-mono text-xs">
              <div>
                <label className="block text-stone-800 font-bold mb-1">Certificate Title:</label>
                <input
                  type="text"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Supervised Machine Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">Issuer / Institution:</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Stanford Online / DeepLearning.AI / IBM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1">Issue Year / Date:</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Verification Source / Provider Badge (Coursera, IBM, College, Hackathon, etc.) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <label className="block text-emerald-950 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verification Badge / Source (Coursera, IBM, College, Hackathon):</span>
                  </label>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Custom Provider Badge
                  </span>
                </div>

                <input
                  type="text"
                  value={certForm.verificationSource || ""}
                  onChange={(e) => setCertForm({ ...certForm, verificationSource: e.target.value })}
                  placeholder="e.g. Coursera, IBM, College, Hackathon, Politecnico Milano..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-stone-900 focus:border-emerald-600 focus:outline-none text-xs font-mono"
                />

                {/* Quick 1-click Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono text-stone-500 font-bold mr-1">Quick Presets:</span>
                  {["Coursera", "IBM", "College", "Hackathon", "Institute", "IIT Madras", "Google", "NPTEL", "Kaggle"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCertForm({ ...certForm, verificationSource: preset })}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                        certForm.verificationSource === preset
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : "bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      + {preset}
                    </button>
                  ))}
                  {certForm.verificationSource && (
                    <button
                      type="button"
                      onClick={() => setCertForm({ ...certForm, verificationSource: "" })}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border border-stone-300 text-stone-500 hover:bg-stone-100 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Live Preview of the Badge */}
                <div className="pt-1 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-mono">Live Visitor Badge Preview:</span>
                  <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-black text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-md border border-emerald-400 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {certForm.verificationSource?.trim()
                        ? (certForm.verificationSource.trim().toLowerCase().startsWith("verified by")
                            ? certForm.verificationSource.trim()
                            : `Verified by ${certForm.verificationSource.trim()}`)
                        : (certForm.issuer?.trim()
                            ? `Verified by ${certForm.issuer.trim()}`
                            : "Verified by Institution")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Selector + Custom Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">Category:</label>
                  <select
                    value={isCustomCat ? "__custom__" : certForm.category}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsCustomCat(true);
                      } else {
                        setIsCustomCat(false);
                        setCustomCertCat("");
                        setCertForm({ ...certForm, category: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    {Array.from(new Set([...certCats, certForm.category].filter(Boolean))).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__custom__">+ Enter Custom Category...</option>
                  </select>
                </div>

                {isCustomCat && (
                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Custom Category Name:</label>
                    <input
                      type="text"
                      autoFocus
                      value={customCertCat}
                      onChange={(e) => setCustomCertCat(e.target.value)}
                      placeholder="e.g. Cloud Computing, Hackathons"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-amber-50 border-2 border-amber-400 text-stone-900 focus:border-black focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Certificate Polaroid Card Color Theme Selector */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold text-xs flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Certificate Polaroid Card Color:</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-700">
                    Selected: {certForm.color || "amber"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ADMIN_PALETTE_COLORS.map((col) => {
                    const isSelected = (certForm.color || "amber").toLowerCase() === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setCertForm({ ...certForm, color: col.id })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white border-black shadow-xs scale-105"
                            : "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                        {isSelected && <span className="text-amber-300 ml-0.5">✓</span>}
                      </button>
                    );
                  })}

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500">Custom:</span>
                    <input
                      type="color"
                      value={
                        certForm.color && certForm.color.startsWith("#")
                          ? certForm.color
                          : (ADMIN_PALETTE_COLORS.find((c) => c.id === certForm.color)?.hex || "#f59e0b")
                      }
                      onChange={(e) => setCertForm({ ...certForm, color: e.target.value })}
                      className="w-5 h-5 rounded-full border border-stone-300 p-0 cursor-pointer overflow-hidden"
                      title="Pick custom hex color"
                    />
                  </div>
                </div>
              </div>

              {/* ── GOOGLE DRIVE HELPER BOX ── */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-dashed border-amber-400 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-amber-200 text-amber-900 font-bold text-xs">
                      📁
                    </span>
                    <span className="font-bold text-stone-900 text-xs">
                      Add Certificate via Google Drive Link:
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-900 font-bold bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300">
                    Quick Converter
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={driveInput}
                      onChange={(e) => handleDrivePaste(e.target.value)}
                      placeholder="Paste any Google Drive link: https://drive.google.com/file/d/.../view"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 focus:border-amber-500 focus:outline-none text-xs"
                    />
                  </div>

                  {driveFeedback && (
                    <div className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300/80">
                      {driveFeedback}
                    </div>
                  )}

                  {extractGoogleDriveId(driveInput) && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={applyDriveBoth}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-[10px] shadow-[2px_2px_0_#000] border border-black cursor-pointer transition-transform hover:-translate-y-0.5"
                      >
                        ⚡ Set for Both (Photo + View Link)
                      </button>
                      <button
                        type="button"
                        onClick={applyDriveAsImage}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 font-bold text-[10px] border border-stone-300 cursor-pointer shadow-xs"
                      >
                        🖼️ Set as Photo Only
                      </button>
                      <button
                        type="button"
                        onClick={applyDriveAsCredential}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 font-bold text-[10px] border border-stone-300 cursor-pointer shadow-xs"
                      >
                        🔗 Set as View Link Only
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-stone-600 font-mono leading-tight">
                    💡 <b>Google Drive Tip:</b> Make sure your file sharing permission in Google Drive is set to <b>&quot;Anyone with the link can view&quot;</b> so your certificate displays smoothly.
                  </p>
                </div>
              </div>

              {/* Certificate Image / Photo URL (Photo Link Feature) */}
              <div>
                <label className="block text-stone-800 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Certificate Photo / Image URL (Displays on clothesline carousel):</span>
                  </span>
                  <span className="text-stone-400 font-normal text-[10px]">Optional</span>
                </label>
                <input
                  type="text"
                  value={certForm.imageUrl || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isGoogleDriveUrl(val) && !val.includes("lh3.googleusercontent.com")) {
                      const converted = formatGoogleDriveImageUrl(val);
                      setCertForm({ ...certForm, imageUrl: converted });
                      setDriveFeedback("✓ Google Drive link converted to direct image URL automatically!");
                    } else {
                      setCertForm({ ...certForm, imageUrl: val });
                    }
                  }}
                  placeholder="https://images.unsplash.com/... or Google Drive link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />

                {/* Live Image Preview */}
                {certForm.imageUrl && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-stone-100 border border-stone-300 flex items-center gap-3">
                    <div className="w-20 h-14 rounded-lg overflow-hidden border border-stone-300 bg-white shadow-sm flex items-center justify-center shrink-0">
                      <img
                        src={formatGoogleDriveImageUrl(certForm.imageUrl)}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedFallback && isGoogleDriveUrl(certForm.imageUrl)) {
                            target.dataset.triedFallback = "true";
                            target.src = formatGoogleDriveThumbnailUrl(certForm.imageUrl);
                          } else {
                            (target as HTMLElement).style.display = "none";
                          }
                        }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-stone-600 min-w-0">
                      <span className="font-bold text-stone-900 block flex items-center gap-1.5 flex-wrap">
                        <span>Photo Preview</span>
                        {isGoogleDriveUrl(certForm.imageUrl) && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[9px] border border-amber-300">
                            Google Drive Connected
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {isGoogleDriveUrl(certForm.imageUrl)
                          ? "High-res Google Drive direct stream configured."
                          : "This image will appear inside the polaroid print frame."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Credential ID and Verification URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">Credential ID:</label>
                  <input
                    type="text"
                    value={certForm.credentialId || ""}
                    onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                    placeholder="e.g. DLAI-ML-2025-HA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1 flex items-center justify-between">
                    <span>Credential Verification URL:</span>
                    {isGoogleDriveUrl(certForm.credentialUrl) && (
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">Google Drive Link</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={certForm.credentialUrl || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isGoogleDriveUrl(val)) {
                        setCertForm({ ...certForm, credentialUrl: formatGoogleDriveViewUrl(val) });
                      } else {
                        setCertForm({ ...certForm, credentialUrl: val });
                      }
                    }}
                    placeholder="https://coursera.org/verify/... or Google Drive URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Skills Learned (Comma separated):</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setCertForm({ ...certForm, skillsLearned: list });
                  }}
                  placeholder="Linear Regression, Logistic Regression, Gradient Descent"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-800 font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  placeholder="Brief summary of syllabus and achievements..."
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCert}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Certificate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD / EDIT LAUREL / RESEARCH PAPER / BOOK MODAL ── */}
      {isLaurelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0_#000] p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-['Space_Grotesk'] text-xl font-black uppercase text-stone-900">
                  {editingLaurel ? "Edit Laurel / Publication" : "Add Laurel, Research Paper or Book"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLaurelModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Type Selector (Presets + Custom Type) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-stone-800 font-bold">Entry Type:</label>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-700">
                    Active: {laurelForm.type || "award"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { type: "award", icon: Trophy, label: "🏆 Award & Laurel", color: "hover:border-amber-400" },
                    { type: "paper", icon: FileText, label: "📄 Research Paper", color: "hover:border-indigo-400" },
                    { type: "book", icon: BookOpen, label: "📚 Published Book", color: "hover:border-rose-400" },
                    { type: "patent", icon: Lightbulb, label: "💡 Patent & IP", color: "hover:border-yellow-400" },
                    { type: "fellowship", icon: Award, label: "🎖️ Fellowship / Grant", color: "hover:border-emerald-400" },
                    { type: "talk", icon: Mic, label: "🎙️ Keynote / Talk", color: "hover:border-purple-400" },
                    { type: "hackathon", icon: Rocket, label: "🚀 Hackathon / Win", color: "hover:border-cyan-400" },
                    { type: "article", icon: Newspaper, label: "📰 Article & Press", color: "hover:border-teal-400" },
                  ].map((btn) => {
                    const isSelected = laurelForm.type === btn.type;
                    return (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setLaurelForm({ ...laurelForm, type: btn.type })}
                        className={`p-2.5 rounded-xl border-2 font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "bg-black text-white border-black shadow-[2.5px_2.5px_0_#f59e0b]"
                            : `bg-stone-50 text-stone-700 border-stone-200 ${btn.color}`
                        }`}
                      >
                        <btn.icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-stone-500"}`} />
                        <span className="text-[10.5px] leading-tight font-black">{btn.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Type Input Field */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Custom Entry Type (or type your own):</span>
                    </span>
                    {!["award", "paper", "book", "patent", "fellowship", "talk", "hackathon", "article"].includes(laurelForm.type) && (
                      <span className="text-[9.5px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                        Custom Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Open Source, Workshop, Exhibition, Fellowship, Grant..."
                      value={!["award", "paper", "book", "patent", "fellowship", "talk", "hackathon", "article"].includes(laurelForm.type) ? laurelForm.type : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLaurelForm({ ...laurelForm, type: val || "award" });
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-mono font-bold focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Laurel Card Color Theme Selector */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-stone-800 font-bold text-xs flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-500" />
                    <span>Card Color Theme:</span>
                  </label>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-700">
                    Selected: {laurelForm.color || "amber"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {ADMIN_PALETTE_COLORS.map((col) => {
                    const isSelected = (laurelForm.color || "amber").toLowerCase() === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setLaurelForm({ ...laurelForm, color: col.id })}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-black text-white border-black shadow-xs scale-105"
                            : "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                        {isSelected && <span className="text-amber-300 ml-0.5">✓</span>}
                      </button>
                    );
                  })}

                  {/* Custom Hex Color Picker */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] font-mono text-stone-500">Custom:</span>
                    <input
                      type="color"
                      value={
                        laurelForm.color && laurelForm.color.startsWith("#")
                          ? laurelForm.color
                          : (ADMIN_PALETTE_COLORS.find((c) => c.id === laurelForm.color)?.hex || "#f59e0b")
                      }
                      onChange={(e) => setLaurelForm({ ...laurelForm, color: e.target.value })}
                      className="w-5 h-5 rounded-full border border-stone-300 p-0 cursor-pointer overflow-hidden"
                      title="Pick custom hex color"
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-stone-800 font-bold mb-1">
                  {laurelForm.type === "award"
                    ? "Award / Laurel Title:"
                    : laurelForm.type === "paper"
                    ? "Research Paper Title:"
                    : "Book / Chapter Title:"}
                </label>
                <input
                  type="text"
                  value={laurelForm.title}
                  onChange={(e) => setLaurelForm({ ...laurelForm, title: e.target.value })}
                  placeholder={
                    laurelForm.type === "award"
                      ? "e.g. Smart India Hackathon — 1st Runner Up"
                      : laurelForm.type === "paper"
                      ? "e.g. Low-Latency Edge Inference with Pruned Tensors"
                      : "e.g. Mathematical Intuition for Machine Learning"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none font-bold"
                />
              </div>

              {/* Organization / Publisher / Journal & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">
                    {laurelForm.type === "award"
                      ? "Awarding Body / Organization:"
                      : laurelForm.type === "paper"
                      ? "Journal / Conference / ArXiv:"
                      : "Publisher / Press:"}
                  </label>
                  <input
                    type="text"
                    value={laurelForm.issuerOrPublisher}
                    onChange={(e) => setLaurelForm({ ...laurelForm, issuerOrPublisher: e.target.value })}
                    placeholder={
                      laurelForm.type === "award"
                        ? "e.g. Ministry of Education / IIT Madras"
                        : laurelForm.type === "paper"
                        ? "e.g. IEEE Transactions / ArXiv / ACM"
                        : "e.g. Self-Published / Springer / Notion Press"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1">Year / Date:</label>
                  <input
                    type="text"
                    value={laurelForm.date}
                    onChange={(e) => setLaurelForm({ ...laurelForm, date: e.target.value })}
                    placeholder="2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Role / Standing & Badge Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">
                    {laurelForm.type === "award"
                      ? "Award Place / Standing:"
                      : laurelForm.type === "paper"
                      ? "Author Role:"
                      : "Author / Editor Role:"}
                  </label>
                  <input
                    type="text"
                    value={laurelForm.roleOrAward || ""}
                    onChange={(e) => setLaurelForm({ ...laurelForm, roleOrAward: e.target.value })}
                    placeholder={
                      laurelForm.type === "award"
                        ? "e.g. 1st Place Laureate (Among 100+ Teams)"
                        : "e.g. Lead Author / First Author"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 font-bold mb-1">Badge Tag (Optional):</label>
                  <input
                    type="text"
                    value={laurelForm.badge || ""}
                    onChange={(e) => setLaurelForm({ ...laurelForm, badge: e.target.value })}
                    placeholder={
                      laurelForm.type === "award"
                        ? "e.g. National Finalist"
                        : laurelForm.type === "paper"
                        ? "e.g. Peer-Reviewed"
                        : "e.g. ISBN Verified"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Link / DOI / Credential URL */}
              <div>
                <label className="block text-stone-800 font-bold mb-1">
                  Link (DOI / PDF / Publication / Certificate URL):
                </label>
                <input
                  type="text"
                  value={laurelForm.link || ""}
                  onChange={(e) => setLaurelForm({ ...laurelForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Description / Abstract */}
              <div>
                <label className="block text-stone-800 font-bold mb-1">Description / Abstract:</label>
                <textarea
                  rows={3}
                  value={laurelForm.description}
                  onChange={(e) => setLaurelForm({ ...laurelForm, description: e.target.value })}
                  placeholder="Brief synopsis, problem tackled, or key impact of this work..."
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              {/* Visibility Switch */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <span className="font-bold text-stone-900 block text-xs">Show on Live Portfolio:</span>
                  <span className="text-[11px] text-stone-500">
                    {laurelForm.isVisible !== false ? "Visible to website visitors" : "Hidden from website"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLaurelForm({ ...laurelForm, isVisible: laurelForm.isVisible === false ? true : false })}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    laurelForm.isVisible !== false
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                      : "bg-stone-200 text-stone-700 border-stone-300"
                  }`}
                >
                  {laurelForm.isVisible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{laurelForm.isVisible !== false ? "Visible" : "Hidden"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsLaurelModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLaurel}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Entry"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
