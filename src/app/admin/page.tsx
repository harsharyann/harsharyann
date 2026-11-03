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
  Bookmark,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project, Certificate, LaurelItem, PortfolioData, TimelineMilestone, Experience, DailyThought, DEFAULT_DAILY_THOUGHTS } from "@/data/portfolioData";
import { FormattedHighlightedText } from "@/components/sections/AboutSection";
import {
  extractGoogleDriveId,
  isGoogleDriveUrl,
  formatGoogleDriveImageUrl,
  formatGoogleDriveThumbnailUrl,
  formatGoogleDriveViewUrl,
} from "@/lib/googleDrive";
import { extractVibrantColor } from "@/lib/colorExtractor";
import { compressImageFile } from "@/lib/imageCompressor";

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
      if (!isFormInitializedRef.current || !isDirtyRef.current) {
        setPortfolioState(initialData);
        portfolioRef.current = initialData;
        isFormInitializedRef.current = true;
      }
    }
  }, [initialData]);
  type AdminTab = "cover" | "about" | "highlights" | "projects" | "certificates" | "milestones" | "skills" | "contact";
  const [activeTab, setActiveTab] = useState<AdminTab>("cover");
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

  // Gracefully route any legacy highlights/milestones tab selection to the unified Profile & Bio tab
  useEffect(() => {
    if ((activeTab as string) === "highlights") {
      setActiveTab("about");
      setAboutSubView("benchmarks");
    } else if ((activeTab as string) === "milestones") {
      setActiveTab("about");
      setAboutSubView("milestones");
    }
  }, [activeTab]);

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
  const [aboutSubView, setAboutSubView] = useState<"all" | "identity" | "bio" | "benchmarks" | "experience" | "milestones">("all");
  const [contactSubTab, setContactSubTab] = useState<"all" | "copy" | "form" | "coordinates" | "footer" | "inquiries">("all");
  const [selectedThoughtDay, setSelectedThoughtDay] = useState<number>(0);
  const [todayWeekday, setTodayWeekday] = useState<number>(0);
  const [thoughtViewMode, setThoughtViewMode] = useState<"tabs" | "grid">("tabs");

  useEffect(() => {
    const day = new Date().getDay();
    setTodayWeekday(day);
    setSelectedThoughtDay(day);
  }, []);

  const HIGHLIGHT_PALETTE = [
    { name: "Warm Amber", hex: "#f59e0b" },
    { name: "Fresh Emerald", hex: "#10b981" },
    { name: "Ocean Cyan", hex: "#06b6d4" },
    { name: "Electric Indigo", hex: "#6366f1" },
    { name: "Coral Rose", hex: "#f43f5e" },
    { name: "Vibrant Purple", hex: "#a855f7" },
    { name: "Sunset Orange", hex: "#f97316" },
    { name: "Golden Yellow", hex: "#eab308" },
    { name: "Bright Lime", hex: "#84cc16" },
    { name: "Crimson Red", hex: "#dc2626" },
  ];

  const applyColorHighlight = (
    field: "headline" | "bio",
    ref: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>,
    color: string
  ) => {
    const el = ref.current;
    const currentVal = portfolio.personal[field] || "";
    let start = el && el.selectionStart !== null ? el.selectionStart : 0;
    let end = el && el.selectionEnd !== null ? el.selectionEnd : 0;

    // Fallback to selectedTarget if element lost focus
    if (start === end && selectedTarget && selectedTarget.field === field && selectedTarget.start < selectedTarget.end) {
      start = selectedTarget.start;
      end = selectedTarget.end;
    }

    if (start === end) {
      alert("Please select the text in the box above first, then click the color to highlight it!");
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

    setPortfolio((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: nextVal },
    }));

    setSelectedTarget({
      field,
      text: clean,
      start,
      end: start + replacement.length,
    });

    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(start, start + replacement.length);
      }
    }, 0);
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

    if (start === end && selectedTarget && selectedTarget.field === field && selectedTarget.start < selectedTarget.end) {
      start = selectedTarget.start;
      end = selectedTarget.end;
    }

    if (start === end) {
      alert("Please select the text in the box first!");
      if (el) el.focus();
      return;
    }

    const rawSelected = currentVal.substring(start, end);
    const clean = rawSelected
      .replace(/^\{\{#[0-9a-fA-F]{3,8}\|(.+?)\}\}$/, "$1")
      .replace(/^==(.+?)==$/, "$1")
      .replace(/^\^\^(.+?)\^\^$/, "$1")
      .replace(/^\*\*(.+?)\*\*$/, "$1");

    const replacement = mode === "bold" ? `**${clean}**` : clean;
    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);

    setPortfolio((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: nextVal },
    }));

    setSelectedTarget({
      field,
      text: clean,
      start,
      end: start + replacement.length,
    });

    setTimeout(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(start, start + replacement.length);
      }
    }, 0);
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
    setPortfolio((prev) => ({
      ...prev,
      quickStats: [
        ...(prev.quickStats || []),
        { value: "10+", label: "NEW BENCHMARK", sublabel: "Metric details" },
      ],
    }));
  };

  const handleRemoveQuickStat = (index: number) => {
    setPortfolio((prev) => ({
      ...prev,
      quickStats: prev.quickStats.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateQuickStat = (index: number, field: "value" | "label" | "sublabel", val: string) => {
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
    setPortfolio((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp],
    }));
  };

  const handleRemoveExperience = (idx: number) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    setPortfolio((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((_, i) => i !== idx),
    }));
  };

  const handleMoveExperience = (idx: number, direction: "up" | "down") => {
    setPortfolio((prev) => {
      const list = [...(prev.experiences || [])];
      const target = direction === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[target];
      list[target] = temp;
      return { ...prev, experiences: list };
    });
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
    setPortfolio((prev) => {
      const updated = [...(prev.quickStats || [])];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[target];
      updated[target] = temp;
      return { ...prev, quickStats: updated };
    });
  };

  // Skills Handlers
  const handleAddSkillItem = (catIdx: number, item: string) => {
    if (!item.trim()) return;
    const currentSkills = [...(portfolio.skills || [])];
    if (!currentSkills[catIdx]) return;
    currentSkills[catIdx] = {
      ...currentSkills[catIdx],
      items: [...(currentSkills[catIdx].items || []), item.trim()],
    };
    const newPort = { ...portfolio, skills: currentSkills };
    setPortfolio(newPort);
    setSkillTagInputs((prev) => ({ ...prev, [catIdx]: "" }));
    saveInstantly(newPort, `Added "${item.trim()}"`);
  };

  const handleRemoveSkillItem = (catIdx: number, itemIdx: number) => {
    const currentSkills = [...(portfolio.skills || [])];
    if (!currentSkills[catIdx]) return;
    currentSkills[catIdx] = {
      ...currentSkills[catIdx],
      items: (currentSkills[catIdx].items || []).filter((_, i) => i !== itemIdx),
    };
    const newPort = { ...portfolio, skills: currentSkills };
    setPortfolio(newPort);
    saveInstantly(newPort, "Skill removed");
  };

  const handleAddSkillCategory = () => {
    if (!newSkillCatName.trim()) return;
    const newPort = {
      ...portfolio,
      skills: [
        ...(portfolio.skills || []),
        { category: newSkillCatName.trim(), items: [] },
      ],
    };
    setPortfolio(newPort);
    setNewSkillCatName("");
    saveInstantly(newPort, `Added category "${newSkillCatName.trim()}"`);
  };

  const handleRemoveSkillCategory = (catIdx: number) => {
    if (!confirm("Are you sure you want to delete this skills category?")) return;
    const catName = portfolio.skills?.[catIdx]?.category || "";
    const newPort = {
      ...portfolio,
      skills: (portfolio.skills || []).filter((_, i) => i !== catIdx),
    };
    setPortfolio(newPort);
    saveInstantly(newPort, `Deleted category "${catName}"`);
  };

  // Milestones Handlers
  const handleAddMilestone = () => {
    setPortfolio((prev) => {
      const current = prev.milestones && prev.milestones.length > 0 ? [...prev.milestones] : [
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
      };
      return { ...prev, milestones: [...current, newMilestone] };
    });
  };

  const handleRemoveMilestone = (index: number) => {
    setPortfolio((prev) => {
      const current = prev.milestones && prev.milestones.length > 0 ? [...prev.milestones] : [
        { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
        { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
        { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
      ];
      const filtered = current.filter((_, i) => i !== index);
      const reindexed = filtered.map((m, idx) => ({
        ...m,
        phaseNumber: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, milestones: reindexed };
    });
  };

  const handleMoveMilestone = (index: number, direction: "up" | "down") => {
    setPortfolio((prev) => {
      const current = prev.milestones && prev.milestones.length > 0 ? [...prev.milestones] : [
        { phaseNumber: "01", period: "Foundations", title: "Algorithmic Intuition & Logic", subtitle: "Python, C & Core Problem Solving", description: "Cultivating a deep focus on core data structures, algorithms, and mathematical logic through hundreds of practice problems." },
        { phaseNumber: "02", period: "Data & Math", title: "Exploratory Modeling & Linear Algebra", subtitle: "Vectorized Computations & Analytics", description: "Diving into statistical data pipelines, hypothesis tests, PCA dimensionality reductions, and building reproducible notebooks." },
        { phaseNumber: "03", period: "Frontiers", title: "Modern AI Systems & Interactive Tools", subtitle: "Full-Stack AI Prototypes & Deployment", description: "Architecting clean Next.js interfaces powered by Python backend microservices, real-time embeddings, and automated workflows." },
      ];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return prev;
      const updated = [...current];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      const reindexed = updated.map((m, idx) => ({
        ...m,
        phaseNumber: String(idx + 1).padStart(2, "0"),
      }));
      return { ...prev, milestones: reindexed };
    });
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
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setToastMessage("✓ Inquiry deleted successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert("Failed to delete inquiry: " + (json.error || "Server error"));
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting inquiry.");
    }
  };

  const handleClearAllMessages = async () => {
    if (!confirm("Are you sure you want to clear ALL inquiries? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/contact?id=all`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setMessages([]);
        setToastMessage("✓ All inquiries cleared!");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        alert("Failed to clear inquiries: " + (json.error || "Server error"));
      }
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
        setToastMessage(successMsg);
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
    const current = portfolio.projectCategories || DEFAULT_PROJECT_CATS;
    if (current.includes(trimmed)) {
      alert("This category already exists!");
      return;
    }
    const updatedCats = [...current, trimmed];
    const newPort = { ...portfolio, projectCategories: updatedCats };
    setPortfolio(newPort);
    setNewProjectCatInput("");
    saveInstantly(newPort, `Added category: "${trimmed}"`);
  };

  const handleRemoveProjectCategory = (cat: string) => {
    if (!confirm(`Remove category "${cat}"? Projects with this category will keep it until edited.`)) return;
    const current = portfolio.projectCategories || DEFAULT_PROJECT_CATS;
    const updatedCats = current.filter((c) => c !== cat);
    const newPort = { ...portfolio, projectCategories: updatedCats };
    setPortfolio(newPort);
    saveInstantly(newPort, `Removed category: "${cat}"`);
  };

  // ── Certificate Category Actions ──
  const handleAddCertCategory = () => {
    const trimmed = newCertCatInput.trim();
    if (!trimmed) return;
    const current = portfolio.certificateCategories || DEFAULT_CERT_CATS;
    if (current.includes(trimmed)) {
      alert("This category already exists!");
      return;
    }
    const updatedCats = [...current, trimmed];
    const newPort = { ...portfolio, certificateCategories: updatedCats };
    setPortfolio(newPort);
    setNewCertCatInput("");
    saveInstantly(newPort, `Added certificate category: "${trimmed}"`);
  };

  const handleRemoveCertCategory = (cat: string) => {
    if (!confirm(`Remove category "${cat}"? Certificates with this category will keep it until edited.`)) return;
    const current = portfolio.certificateCategories || DEFAULT_CERT_CATS;
    const updatedCats = current.filter((c) => c !== cat);
    const newPort = { ...portfolio, certificateCategories: updatedCats };
    setPortfolio(newPort);
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
    });
    setCustomProjectCat(cats.length === 0 ? "General" : "");
    setTechInput("");
    setMetricInput("");
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ ...p });
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

    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = (portfolio.projects || []).map((p) => (p.id === editingProject.id ? finalProject : p));
    } else {
      updatedProjects = [finalProject, ...(portfolio.projects || [])];
    }

    // Auto-register category if new
    const currentCats = portfolio.projectCategories || [];
    const updatedCats = currentCats.includes(effectiveCategory) ? currentCats : [...currentCats, effectiveCategory];

    const newPortfolio: PortfolioData = {
      ...portfolio,
      projectCategories: updatedCats,
      projects: updatedProjects,
    };

    setPortfolio(newPortfolio);
    setIsProjectModalOpen(false);
    await saveInstantly(newPortfolio, editingProject ? "Project updated successfully!" : "New project published!");
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const updatedProjects = (portfolio.projects || []).filter((p) => p.id !== id);
    const newPortfolio: PortfolioData = {
      ...portfolio,
      projects: updatedProjects,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, "Project deleted.");
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

    const currentCerts = portfolio.certificates || [];
    let updatedCerts: Certificate[];
    if (editingCert) {
      updatedCerts = currentCerts.map((c) => (c.id === editingCert.id ? finalCert : c));
    } else {
      updatedCerts = [finalCert, ...currentCerts];
    }

    // Auto-register category ONLY if user typed a new custom category
    let updatedCats = portfolio.certificateCategories || [];
    if (isCustomCat && customCertCat.trim() && !updatedCats.includes(customCertCat.trim())) {
      updatedCats = [...updatedCats, customCertCat.trim()];
    }

    const newPortfolio: PortfolioData = {
      ...portfolio,
      certificateCategories: updatedCats,
      certificates: updatedCerts,
    };

    setPortfolio(newPortfolio);
    setIsCertModalOpen(false);
    await saveInstantly(newPortfolio, editingCert ? "Certificate updated!" : "Certificate added!");
  };

  const handleDeleteCert = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    const currentCerts = portfolio.certificates || [];
    const updatedCerts = currentCerts.filter((c) => c.id !== id);
    const newPortfolio: PortfolioData = {
      ...portfolio,
      certificates: updatedCerts,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, "Certificate deleted.");
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
    });
    setIsLaurelModalOpen(true);
  };

  const openEditLaurelModal = (item: LaurelItem) => {
    setEditingLaurel(item);
    setLaurelForm({ ...item });
    setIsLaurelModalOpen(true);
  };

  const handleSaveLaurel = async () => {
    if (!laurelForm.title.trim()) {
      alert("Please provide a title");
      return;
    }

    const currentList = portfolio.laurelItems || [];
    let updatedList: LaurelItem[];
    if (editingLaurel) {
      updatedList = currentList.map((item) => (item.id === editingLaurel.id ? laurelForm : item));
    } else {
      updatedList = [laurelForm, ...currentList];
    }

    const newPortfolio: PortfolioData = {
      ...portfolio,
      laurelItems: updatedList,
    };

    setPortfolio(newPortfolio);
    setIsLaurelModalOpen(false);
    await saveInstantly(newPortfolio, editingLaurel ? "Item updated successfully!" : "Item added to Laurels!");
  };

  const handleDeleteLaurel = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const currentList = portfolio.laurelItems || [];
    const updatedList = currentList.filter((item) => item.id !== id);
    const newPortfolio: PortfolioData = {
      ...portfolio,
      laurelItems: updatedList,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, "Item removed.");
  };

  const handleToggleLaurelVisibility = async (id: string) => {
    const currentList = portfolio.laurelItems || [];
    const updatedList = currentList.map((item) => {
      if (item.id === id) {
        const nextState = item.isVisible === false ? true : false;
        return { ...item, isVisible: nextState };
      }
      return item;
    });

    const newPortfolio: PortfolioData = {
      ...portfolio,
      laurelItems: updatedList,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, "Item visibility updated!");
  };

  const handleToggleLaurelsSection = async () => {
    const currentState = portfolio.personal.showLaurelsSection !== false;
    const newPersonal = {
      ...portfolio.personal,
      showLaurelsSection: !currentState,
    };
    const newPortfolio: PortfolioData = {
      ...portfolio,
      personal: newPersonal,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, !currentState ? "Laurels & Research section visible on main site" : "Laurels & Research section hidden from main site");
  };

  // ─── LOADING STATE ───
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#f7f3ea] dark:bg-[#0c0d14] flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-white dark:bg-[#151620] border-2 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-bold">
            Checking Socius Session...
          </p>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN (SOCIUS LOCKED VIEW - ULTRA CLEAN & MINIMAL) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f3ea] dark:bg-[#0c0d14] flex flex-col items-center justify-center p-4 sm:p-6 text-stone-900 dark:text-stone-100 font-sans selection:bg-amber-400 selection:text-black relative overflow-hidden">
        {/* Subtle Sketchbook Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Ambient Blurred Glows */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-400/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

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

  const updateDailyThought = (dayIndex: number, field: "quote" | "persona" | "dayName", value: string) => {
    const updated = activeThoughtsList.map((item) => {
      if (item.dayIndex === dayIndex) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setPortfolio((prev) => ({
      ...prev,
      dailyThoughts: updated,
    }));
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
    setPortfolio((prev) => ({
      ...prev,
      dailyThoughts: updated,
    }));
  };

  const navTabs = [
    { id: "cover", label: "Cover Hero", title: "Cover Page Manager", desc: "Hero portrait, wordmark, roles & cover buttons", icon: Sliders },
    { id: "about", label: "Profile & Bio", title: "Profile, Bio & Dossier", desc: "All-in-one: Photo mount, statement, bio highlighter, benchmarks & roadmap", icon: User },
    { id: "projects", label: "Projects Lab", title: "Technical Projects Manager", desc: "Filter tags, live links, github repositories & tech stacks", icon: FolderCode, count: portfolio.projects?.length || 0 },
    { id: "certificates", label: "Certificates", title: "Credentials & Laurels", desc: "Verified credentials, verification links & categories", icon: Award, count: portfolio.certificates?.length || 0 },
    { id: "skills", label: "Skills Arsenal", title: "Technical Skills Arsenal", desc: "Category groupings, badges, proficiency & skill tags", icon: Code2, count: portfolio.skills?.length || 0 },
    { id: "contact", label: "Inquiries & Dispatch", title: "Inquiries & Live Station", desc: "Location coordinates, local time, status & incoming contact dispatches", icon: Send, count: messages.filter((m) => !m.read).length || undefined, alert: messages.some((m) => !m.read) },
  ];

  const currentTabObj = navTabs.find((t) => t.id === activeTab) || navTabs[0];

  // ─── AUTHENTICATED DASHBOARD (SOCIUS WITH MODERN LEFT SIDEBAR LAYOUT) ───
  return (
    <div className="min-h-screen bg-[#f7f3ea] dark:bg-[#0c0d14] text-stone-900 dark:text-stone-100 selection:bg-amber-400 selection:text-black font-sans flex flex-col md:flex-row relative">
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
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 dark:bg-[#141520]/95 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-xs">
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

      {/* ── LEFT SIDEBAR (Desktop Fixed, Mobile Slide-Over) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-[#141520]/95 backdrop-blur-xl border-r-2 border-stone-200/90 dark:border-stone-800/90 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header: Brand & Live Indicator */}
        <div className="p-5 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group cursor-pointer"
              title="Return to Live Portfolio"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black border-2 border-black shadow-[2px_2px_0_#000] group-hover:scale-105 transition-transform overflow-hidden p-1 shrink-0">
                <img src="/icon.svg" alt="Socius Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-lg font-black uppercase tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors leading-none">
                  Socius Studio
                </span>
                <span className="font-mono text-[9px] text-stone-500 flex items-center gap-1.5 mt-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>LIVE CLOUD CMS</span>
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-black hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items (Vertical Menu) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">
            Workspace Tabs
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id as AdminTab);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left group ${
                    isActive
                      ? "bg-stone-900 text-white font-black shadow-[3px_3px_0_#f59e0b] border border-stone-800"
                      : "text-stone-700 hover:text-black hover:bg-stone-100 font-bold"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-amber-400" : "text-stone-500 group-hover:text-black"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === "cover" ? (
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-stone-800 px-2 py-0.5 rounded-md">
                      {coverSubView === "desktop" ? "💻 PC" : "📱 Phone"}
                    </span>
                  ) : tab.count !== undefined ? (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? "bg-amber-400 text-black"
                          : "bg-stone-200 text-stone-700 group-hover:bg-stone-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </button>

                {/* Cover Sub-Views Dropdown (Desktop vs Mobile) */}
                {tab.id === "cover" && isActive && (
                  <div className="ml-5 pl-2.5 border-l-2 border-stone-200 space-y-1 pt-1 pb-1">
                    <button
                      type="button"
                      onClick={() => setCoverSubView("desktop")}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer text-left ${
                        coverSubView === "desktop"
                          ? "bg-amber-400 text-black shadow-xs font-black"
                          : "text-stone-600 hover:text-black hover:bg-stone-100 font-bold"
                      }`}
                    >
                      <span>💻</span>
                      <span>Desktop View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSubView("mobile")}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-mono text-[11px] transition-all cursor-pointer text-left ${
                        coverSubView === "mobile"
                          ? "bg-amber-400 text-black shadow-xs font-black"
                          : "text-stone-600 hover:text-black hover:bg-stone-100 font-bold"
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

        {/* Sidebar Footer: Live Site Link & User Profile */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-black font-mono text-xs font-bold text-stone-700 hover:text-black transition-all shadow-xs group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-600" />
              <span>View Live Website</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">↗</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-mono text-xs font-black border border-stone-800 shadow-2xs">
                HA
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold font-mono text-stone-900 leading-tight">Harsh Aryan</span>
                <span className="text-[9.5px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Super Admin
                </span>
                <span className="text-[9px] font-mono text-stone-400 flex items-center gap-1 mt-0.5" title="Auto-locks after 20 minutes of inactivity">
                  <Clock className="w-2.5 h-2.5 text-amber-500" /> Auto-Lock: 20m
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE (Right Side on md: screens) ── */}
      <div className="flex-1 md:ml-72 min-h-screen flex flex-col relative bg-[#faf7f2]/95 dark:bg-[#0e0f17]/95">
        {/* Subtle Sketchbook Grid Background */}
        <div
          className="fixed inset-0 md:left-72 pointer-events-none opacity-[0.06] dark:opacity-[0.04] z-0"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Sticky Top Bar for Section Header & Save All */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#141520]/90 backdrop-blur-xl border-b-2 border-stone-200/90 dark:border-stone-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
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

          {/* Actions Right */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:border-black bg-white hover:bg-stone-50 font-mono text-xs font-bold text-stone-700 hover:text-black transition-all cursor-pointer"
            >
              <span>Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-7 max-w-6xl w-full mx-auto space-y-8">

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

                {/* Quick Save */}
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>

            {/* ── SIDE-BY-SIDE: FORM CONTROLS (LEFT) + REAL-TIME PREVIEW (RIGHT) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* ── LEFT: FORM INPUTS FOR SELECTED VIEW ── */}
              <div className="xl:col-span-7 space-y-6">

                {/* ========================================================
                    SUB-VIEW A: DESKTOP / LAPTOP COVER CONFIGURATION
                ======================================================== */}
                {coverSubView === "desktop" && (
                  <div className="space-y-6">
                    {/* 1. Desktop Photo Frame Settings */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                        <ImageIcon className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          1. Studio Photo Frame (Left Column)
                        </h3>
                      </div>

                      {/* Photo URL */}
                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Cover Photo Link (Google Drive / Direct URL):
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/file/d/.../view"
                            value={portfolio.personal.coverPhotoUrl || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, coverPhotoUrl: e.target.value },
                              }))
                            }
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                          {portfolio.personal.coverPhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, coverPhotoUrl: "" },
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
                      {isGoogleDriveUrl(portfolio.personal.coverPhotoUrl) && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="text-[11px]">
                            Google Drive link verified: <span className="font-bold">{extractGoogleDriveId(portfolio.personal.coverPhotoUrl)}</span>
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
                                  setToastMessage("Optimizing image for cover frame...");
                                  const compressed = await compressImageFile(file);
                                  const updated = {
                                    ...portfolio,
                                    personal: {
                                      ...portfolio.personal,
                                      coverPhotoUrl: compressed,
                                    },
                                  };
                                  setPortfolio(updated);
                                  await saveInstantly(updated, "✅ Cover photo uploaded successfully!");
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
                            placeholder="e.g. Teaching Assistant"
                            value={portfolio.personal.aboutCurrentWork ?? portfolio.personal.role ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutCurrentWork: e.target.value, role: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Workplace / Institute:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. IIT Madras"
                            value={portfolio.personal.aboutWorkPlace ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutWorkPlace: e.target.value },
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
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

                    {/* 4. Desktop 7-Day Thought of the Day / Daily Spark Manager */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-sm">
                            ✨
                          </span>
                          <div>
                            <h3 className="font-['Space_Grotesk'] text-base sm:text-lg font-black uppercase text-stone-900">
                              4. Weekly Sparks: 7 Days Daily Thoughts Manager
                            </h3>
                            <p className="font-mono text-xs text-stone-500">
                              Har ek din (Sunday se Saturday) ke liye unique thought &amp; persona customize karein. Live desktop cover par automatically us din ka thought display hoga.
                            </p>
                          </div>
                        </div>

                        {/* View Switcher: Tabs vs All 7 Days Grid */}
                        <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200 self-start sm:self-auto shrink-0">
                          <button
                            type="button"
                            onClick={() => setThoughtViewMode("tabs")}
                            className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                              thoughtViewMode === "tabs"
                                ? "bg-black text-white shadow-xs font-black"
                                : "text-stone-600 hover:text-black"
                            }`}
                          >
                            Single Day View
                          </button>
                          <button
                            type="button"
                            onClick={() => setThoughtViewMode("grid")}
                            className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
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
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Card Heading (Shown above the thought):
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                            Bottom Signature:
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* 7-Day Day Selector Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
                          <span>Select Day to Edit ({activeThoughtsList.length} Days Configured):</span>
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Today is {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][todayWeekday]}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                          {activeThoughtsList.map((dayItem) => {
                            const isToday = dayItem.dayIndex === todayWeekday;
                            const isSelected = dayItem.dayIndex === selectedThoughtDay;
                            const DAY_EMOJIS = ["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"];

                            return (
                              <button
                                key={dayItem.dayIndex}
                                type="button"
                                onClick={() => setSelectedThoughtDay(dayItem.dayIndex)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-black text-white border-black shadow-[2px_2px_0_#f59e0b] scale-[1.02]"
                                    : "bg-white hover:bg-stone-50 border-stone-200 text-stone-800"
                                }`}
                              >
                                <div className="flex items-center justify-between gap-1 w-full">
                                  <span className="font-mono text-xs font-black uppercase flex items-center gap-1">
                                    <span>{DAY_EMOJIS[dayItem.dayIndex] || "✦"}</span>
                                    <span>{dayItem.dayName.slice(0, 3)}</span>
                                  </span>
                                  {isToday && (
                                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase ${
                                      isSelected ? "bg-emerald-400 text-black" : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    }`}>
                                      Today
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[9.5px] font-mono truncate mt-1 ${
                                  isSelected ? "text-amber-300 font-bold" : "text-stone-500"
                                }`}>
                                  {dayItem.persona}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* MODE A: Single Day Focused Editor */}
                      {thoughtViewMode === "tabs" && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/50 border-2 border-black shadow-[3px_3px_0_#000] space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"][selectedThoughtDay] || "📅"}
                              </span>
                              <div>
                                <h4 className="font-['Space_Grotesk'] text-base font-black uppercase text-stone-900">
                                  {activeThoughtsList[selectedThoughtDay]?.dayName}&apos;s Daily Thought
                                </h4>
                                <span className="font-mono text-[10px] text-stone-500 font-bold">
                                  Day #{selectedThoughtDay} • {selectedThoughtDay === todayWeekday ? "Active on Cover Today!" : "Scheduled for " + activeThoughtsList[selectedThoughtDay]?.dayName}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => resetDailyThought(selectedThoughtDay)}
                              className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-mono text-[10px] font-bold cursor-pointer self-start sm:self-auto flex items-center gap-1"
                              title="Reset this day to default quote"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset to Default</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                                Day Label:
                              </label>
                              <input
                                type="text"
                                value={activeThoughtsList[selectedThoughtDay]?.dayName || ""}
                                onChange={(e) => updateDailyThought(selectedThoughtDay, "dayName", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                                Persona / Author Tag (Shown in Card Pill):
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. The Philosopher, The Builder, The Thinker..."
                                value={activeThoughtsList[selectedThoughtDay]?.persona || ""}
                                onChange={(e) => updateDailyThought(selectedThoughtDay, "persona", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold focus:border-black focus:outline-none"
                              />
                            </div>

                            <div className="md:col-span-3">
                              <div className="flex items-center justify-between mb-1">
                                <label className="block font-mono text-xs font-bold text-stone-700">
                                  Quote / Thought for {activeThoughtsList[selectedThoughtDay]?.dayName}:
                                </label>
                                <span className="font-mono text-[10px] text-stone-400">
                                  {(activeThoughtsList[selectedThoughtDay]?.quote || "").length} characters
                                </span>
                              </div>
                              <textarea
                                rows={3}
                                placeholder="Enter inspiring thought for this day..."
                                value={activeThoughtsList[selectedThoughtDay]?.quote || ""}
                                onChange={(e) => updateDailyThought(selectedThoughtDay, "quote", e.target.value)}
                                className="w-full p-3.5 rounded-xl bg-white border border-stone-300 font-mono text-xs leading-relaxed focus:border-black focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MODE B: All 7 Days Grid Editor */}
                      {thoughtViewMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {activeThoughtsList.map((dayItem) => {
                            const isToday = dayItem.dayIndex === todayWeekday;
                            const DAY_EMOJIS = ["☀️", "🚀", "🛠️", "💡", "🧭", "🎨", "⚡"];

                            return (
                              <div
                                key={dayItem.dayIndex}
                                className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                                  isToday
                                    ? "bg-amber-50/70 border-black shadow-[3px_3px_0_#f59e0b]"
                                    : "bg-white border-stone-200 shadow-xs"
                                }`}
                              >
                                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                                  <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-stone-900">
                                    <span>{DAY_EMOJIS[dayItem.dayIndex]}</span>
                                    <span>{dayItem.dayName}</span>
                                    {isToday && (
                                      <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-black">
                                        TODAY
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => resetDailyThought(dayItem.dayIndex)}
                                    className="text-[10px] font-mono text-stone-400 hover:text-stone-800"
                                    title="Reset to default"
                                  >
                                    Reset
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  <div>
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
                    {/* 1. Mobile Photo Manager */}
                    <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                        <ImageIcon className="w-4 h-4 text-amber-500" />
                        <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                          1. Mobile Portrait Photo
                        </h3>
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Mobile Photo Link (Google Drive ya Direct Link):
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/file/d/.../view"
                            value={portfolio.personal.coverPhotoUrl || ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, coverPhotoUrl: e.target.value },
                              }))
                            }
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                          />
                          {portfolio.personal.coverPhotoUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, coverPhotoUrl: "" },
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
                      {isGoogleDriveUrl(portfolio.personal.coverPhotoUrl) && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div className="text-[11px]">
                            Google Drive link verified: <span className="font-bold">{extractGoogleDriveId(portfolio.personal.coverPhotoUrl)}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <label className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                          <span>Select Image from Device</span>
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
                                    personal: { ...portfolio.personal, coverPhotoUrl: compressed },
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
                            onClick={() =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: {
                                  ...prev.personal,
                                  showMobileCurrentRole: prev.personal.showMobileCurrentRole === false ? true : false,
                                },
                              }))
                            }
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
                              onChange={(e) =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, role: e.target.value, aboutCurrentWork: e.target.value },
                                }))
                              }
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
                              onChange={(e) =>
                                setPortfolio((prev) => ({
                                  ...prev,
                                  personal: { ...prev.personal, aboutWorkPlace: e.target.value },
                                }))
                              }
                              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs focus:border-black focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Mobile Narrative Tagline */}
                      <div>
                        <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                          Mobile Handwritten Tagline Quote:
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Teaching Machines To Learn • Building Scientific Software"
                          value={portfolio.personal.mobileTagline ?? ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, mobileTagline: e.target.value },
                            }))
                          }
                          className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* 3. Mobile Social Links */}
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
                              src={formatGoogleDriveImageUrl(portfolio.personal.coverPhotoUrl)}
                              alt="Cover Preview"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          {/* Lower Plaque */}
                          <div className="flex items-center justify-between text-[8px] font-mono font-bold pt-0.5 border-t border-dashed border-stone-300">
                            <span className="truncate font-black text-black">{portfolio.personal.name || "HARSH ARYAN"}</span>
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

                        {/* Role Pill */}
                        <div className="inline-flex items-center gap-1 py-0.5 px-2 rounded-lg bg-amber-100 border border-black text-[8px] font-mono font-bold shadow-[1px_1px_0_#000]">
                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                          <span className="font-black text-black truncate max-w-[90px]">
                            {portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"}
                          </span>
                          <span className="text-stone-400">•</span>
                          <span className="text-amber-700 font-black truncate max-w-[70px]">
                            {portfolio.personal.aboutWorkPlace || "IIT Madras"}
                          </span>
                        </div>

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
                        <div className="mt-2 p-1.5 rounded-lg bg-white/90 dark:bg-stone-900/90 border border-black/20 shadow-[1.5px_1.5px_0_#000] text-[7.5px] font-mono space-y-0.5">
                          <div className="flex items-center justify-between text-[6.5px] font-black text-purple-700 dark:text-purple-300">
                            <span>✦ {portfolio.personal.coverDailyThoughtHeader || "A LITTLE THOUGHT FOR TODAY"}</span>
                            <span className="bg-purple-100 dark:bg-purple-950 px-1 py-0.2 rounded text-[6px]">
                              {activeThoughtsList[selectedThoughtDay]?.persona || "Daily Spark"}
                            </span>
                          </div>
                          <p className="italic text-stone-800 dark:text-stone-200 line-clamp-1">
                            &quot;{activeThoughtsList[selectedThoughtDay]?.quote || "Teach machines to learn. Never stop learning yourself."}&quot;
                          </p>
                          <div className="flex items-center justify-between text-[6px] text-stone-500 pt-0.5">
                            <span className="text-amber-600 font-bold">
                              Preview: {activeThoughtsList[selectedThoughtDay]?.dayName || "Today"}
                            </span>
                            <span>{portfolio.personal.coverDailyThoughtSignature || "— Harsh’s Daily Thoughts"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] font-mono text-center text-stone-500 pt-1 border-t border-black/10">
                      💡 Desktop cover changes are saved directly into the CMS.
                    </div>
                  </div>
                )}

                {/* ── MOBILE COVER REALISTIC PHONE MOCKUP PREVIEW ── */}
                {coverSubView === "mobile" && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-56 h-[440px] rounded-[36px] p-2 bg-stone-900 border-4 border-stone-800 shadow-2xl overflow-hidden flex flex-col select-none">
                      {/* Phone Screen Container */}
                      <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-stone-950 flex flex-col justify-between">
                        {/* Background Portrait Photo */}
                        <img
                          src={formatGoogleDriveImageUrl(portfolio.personal.coverPhotoUrl)}
                          alt="Cover Mobile Preview"
                          className="absolute inset-0 w-full h-full object-cover object-[center_top]"
                        />

                        {/* Gradient vignettes */}
                        <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none" />

                        {/* Dynamic Camera Notch at Top */}
                        <div className="relative z-10 w-full px-4 pt-2 flex items-center justify-between">
                          <span className="font-mono text-[7px] text-white/80">9:41</span>
                          <div className="w-12 h-3 rounded-full bg-black border border-white/10" />
                          <span className="font-mono text-[7px] text-emerald-400">5G</span>
                        </div>

                        {/* Bottom Phone Details & Sticker Note */}
                        <div className="relative z-10 p-2.5 flex flex-col items-center text-center space-y-1.5">
                          {/* Hero Name Heading */}
                          <div
                            className="font-hero-heading text-lg text-white font-black uppercase tracking-wider leading-none select-none"
                            style={{
                              textShadow: "1.5px 1.5px 0 #000, -1px -1px 0 #000, 2px 2px 0 #f59e0b",
                            }}
                          >
                            {portfolio.personal.name || "HARSH ARYAN"}
                          </div>

                          {/* Sticker Note Mock */}
                          <div className="w-full rounded-xl p-2 bg-[#fffef5] border border-black shadow-[2px_2px_0_#000] space-y-1 text-black">
                            {/* Role Badge */}
                            {portfolio.personal.showMobileCurrentRole !== false && (
                              <div className="py-0.5 px-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center">
                                <span className="font-mono text-[7px] font-black uppercase text-emerald-800 flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                  <span>{portfolio.personal.role || "Teaching Assistant"}</span>
                                </span>
                                <span className="font-mono text-[6.5px] font-extrabold uppercase text-amber-700">
                                  {portfolio.personal.aboutWorkPlace || "IIT Madras"}
                                </span>
                              </div>
                            )}

                            {/* Tagline */}
                            <p className="text-[7.5px] font-bold italic text-stone-700 line-clamp-2 leading-tight">
                              &ldquo;{portfolio.personal.mobileTagline || "Teaching Machines To Learn • Building Scientific Software"}&rdquo;
                            </p>

                            {/* Social Icons */}
                            <div className="flex items-center justify-center gap-2 pt-0.5 border-t border-dashed border-stone-300">
                              <span className="w-4 h-4 rounded-full bg-black text-white text-[7px] flex items-center justify-center">GH</span>
                              <span className="w-4 h-4 rounded-full bg-[#0077b5] text-white text-[7px] flex items-center justify-center">IN</span>
                              <span className="w-4 h-4 rounded-full bg-[#f59e0b] text-white text-[7px] flex items-center justify-center">@</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="mt-2 text-[10px] font-mono text-stone-500">
                      📱 Real-time smartphone preview
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Final Save Button for Cover Hero */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Cover Settings"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: ABOUT & DOSSIER MANAGER ── */}
        {activeTab === "about" && (
          <div className="space-y-8">
            {/* Header intro & Save CTA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-black uppercase">
                    Live Section #01
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    SYNCED WITH ABOUT SECTION
                  </span>
                </div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-500" />
                  <span>Profile, Bio &amp; Dossier (All-in-One)</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1 max-w-2xl">
                  Framed Exhibition Photo, Identity Plaque, Statement &amp; Bio with <strong>Multi-Color Highlighter</strong>, Key Benchmarks, aur <strong>Trajectory Milestones</strong> ko live preview ke sath ek hi jagah manage karein.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Profile & Bio"}</span>
                </button>
              </div>
            </div>

            {/* Quick Sub-Section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              {[
                { id: "all", label: "✦ All Sections", count: "5" },
                { id: "identity", label: "🪪 Photo & Plaque", count: "Mount" },
                { id: "bio", label: "✍️ Statement, Bio & Highlighter", count: "Colors" },
                { id: "benchmarks", label: "⚡ Key Benchmarks", count: (portfolio.quickStats || []).length.toString() },
                {
                  id: "experience",
                  label: "💼 Experience",
                  count: portfolio.personal.showExperienceSection === false ? "Hidden" : ((portfolio.experiences || []).length || 1).toString(),
                },
                {
                  id: "milestones",
                  label: "🚀 Trajectory Milestones",
                  count: portfolio.personal.showDevelopmentTrajectory === false ? "Hidden" : ((portfolio.milestones || []).length || 3).toString(),
                },
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
                  <span className="self-start sm:self-center font-mono text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full">
                    Left Column Mount
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Inputs (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Section Heading & Subtitle */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="font-mono text-xs font-black uppercase text-stone-800 flex items-center gap-1.5">
                        <span>🏷️</span>
                        <span>Section Header &amp; Subtitle (Live Above Frame)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Section Main Heading:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.aboutHeading ?? "Behind the Terminal"}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutHeading: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            placeholder="e.g. Behind the Terminal"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Section Subtitle:
                          </label>
                          <input
                            type="text"
                            value={portfolio.personal.aboutSubtitle ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutSubtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                            placeholder="Curious mind blending machine learning..."
                          />
                        </div>
                      </div>
                    </div>

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
                            Plaque Name:
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
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                            placeholder="HARSH ARYAN"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Current Role / Work:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Teaching Assistant"
                            value={portfolio.personal.aboutCurrentWork ?? portfolio.personal.role ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutCurrentWork: e.target.value, role: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                            Workplace / Institution:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. IIT Madras"
                            value={portfolio.personal.aboutWorkPlace ?? ""}
                            onChange={(e) =>
                              setPortfolio((prev) => ({
                                ...prev,
                                personal: { ...prev.personal, aboutWorkPlace: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                          />
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
                            className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                            placeholder="e.g. Chennai, India"
                          />
                        </div>
                      </div>
                    </div>
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
                            className="w-full h-full object-cover object-top"
                          />
                          {/* Corner Tabs */}
                          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-black/60 pointer-events-none" />
                          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-black/60 pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-black/60 pointer-events-none" />
                          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-black/60 pointer-events-none" />
                        </div>

                        {/* Integrated Lower Chin */}
                        <div className="pt-2.5 border-t-2 border-dashed border-stone-300 space-y-2">
                          <div className="font-['Space_Grotesk'] text-lg font-black uppercase text-black leading-none truncate">
                            {portfolio.personal.name || "HARSH ARYAN"}
                          </div>

                          <div className="flex flex-col items-start gap-1">
                            {/* Role badge with pulse */}
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-stone-900 font-mono text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <span>{portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"}</span>
                            </div>

                            {/* Workplace badge */}
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 font-mono text-[10px] font-bold">
                              <span>{portfolio.personal.aboutWorkPlace || "IIT Madras"}</span>
                            </div>
                          </div>

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

            {/* ── 2. PERSONAL STATEMENT, BIO & MULTI-COLOR HIGHLIGHTER ── */}
            {(aboutSubView === "all" || aboutSubView === "bio") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                      ✍️
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        2. Personal Statement, Narrative Bio &amp; Multi-Color Highlighter
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        Text select karke koi vi custom color se highlight karein. Arbitrary color picker, palette swatches aur live formatted preview right below!
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center font-mono text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded-full">
                    Any Color Highlight
                  </span>
                </div>

                {/* ── UNIFIED COLOR PICKER TOOLBAR ── */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border-2 border-stone-300 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-xs font-black uppercase text-stone-900">
                        Highlighter Color Studio
                      </span>
                    </div>
                    {/* Active Selected Text Indicator */}
                    {selectedTarget && selectedTarget.start < selectedTarget.end ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/90 border border-amber-400 font-mono text-[11px] font-bold text-stone-900">
                        <span>✦ Target:</span>
                        <span className="underline decoration-wavy">
                          &quot;{selectedTarget.text.slice(0, 30)}{selectedTarget.text.length > 30 ? "..." : ""}&quot;
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 bg-black text-white rounded">
                          {selectedTarget.field}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-[11px] text-stone-500">
                        👉 Select any text in Headline ya Bio, then click a color below
                      </span>
                    )}
                  </div>

                  {/* Color Picker & Preset Swatches */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Native Color Picker + Hex Input */}
                    <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-stone-300 shadow-2xs">
                      <input
                        type="color"
                        value={highlighterColor}
                        onChange={(e) => setHighlighterColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                        title="Pick any custom color"
                      />
                      <input
                        type="text"
                        value={highlighterColor}
                        onChange={(e) => setHighlighterColor(e.target.value)}
                        placeholder="#f59e0b"
                        className="w-20 px-2 py-1 font-mono text-xs font-bold text-stone-900 focus:outline-none uppercase"
                      />
                    </div>

                    {/* Quick Palette Chips */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {HIGHLIGHT_PALETTE.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setHighlighterColor(c.hex);
                            if (selectedTarget && selectedTarget.start < selectedTarget.end) {
                              const ref = selectedTarget.field === "headline" ? headlineInputRef : bioTextareaRef;
                              applyColorHighlight(selectedTarget.field, ref, c.hex);
                            }
                          }}
                          className={`px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                            highlighterColor.toLowerCase() === c.hex.toLowerCase()
                              ? "border-black bg-stone-900 text-white shadow-xs font-black"
                              : "border-stone-300 bg-white text-stone-700 hover:border-black"
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── 2A. HEADLINE (STATEMENT) EDITOR ── */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-mono text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Personal Statement (Headline):</span>
                    </label>

                    {/* Toolbar for Headline */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyColorHighlight("headline", headlineInputRef, highlighterColor)}
                        className="px-3 py-1 rounded-lg text-black font-mono text-[11px] font-bold border-2 border-black shadow-[1.5px_1.5px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 hover:brightness-105"
                        style={{ backgroundColor: highlighterColor }}
                        title="Highlight selected text in Headline with active color"
                      >
                        <span className="w-2 h-2 rounded-full bg-black/80" />
                        <span>Highlight Selection</span>
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
                        className="px-2 py-1 rounded-lg bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 font-mono text-[11px] border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
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
                    onSelect={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "headline",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    onMouseUp={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "headline",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    onKeyUp={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "headline",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none font-bold"
                    placeholder="e.g. Exploring Data Science, Machine Learning Foundations & Scientific Computing."
                  />
                  <div className="font-mono text-[10px] text-stone-400">
                    Syntax: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-bold">&#123;&#123;#hex|text&#125;&#125;</code> for custom color, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-bold">==text==</code> for default highlight, <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700 font-bold">**text**</code> for bold.
                  </div>
                </div>

                {/* ── 2B. NARRATIVE BIO EDITOR ── */}
                <div className="space-y-2 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="font-mono text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>About Me Narrative Bio:</span>
                    </label>

                    {/* Toolbar for Bio */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applyColorHighlight("bio", bioTextareaRef, highlighterColor)}
                        className="px-3 py-1 rounded-lg text-black font-mono text-[11px] font-bold border-2 border-black shadow-[1.5px_1.5px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5 hover:brightness-105"
                        style={{ backgroundColor: highlighterColor }}
                        title="Highlight selected text in Bio with active color"
                      >
                        <span className="w-2 h-2 rounded-full bg-black/80" />
                        <span>Highlight Selection</span>
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
                        className="px-2 py-1 rounded-lg bg-white hover:bg-red-50 text-stone-600 hover:text-red-600 font-mono text-[11px] border border-stone-300 cursor-pointer flex items-center gap-1 active:translate-y-0.5"
                        title="Remove highlight/bold from selected text"
                      >
                        <Eraser className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={bioTextareaRef}
                    rows={6}
                    value={portfolio.personal.bio || ""}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, bio: e.target.value },
                      }))
                    }
                    onSelect={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "bio",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    onMouseUp={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "bio",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    onKeyUp={(e) => {
                      const el = e.currentTarget;
                      if (el.selectionStart !== null && el.selectionEnd !== null && el.selectionStart < el.selectionEnd) {
                        setSelectedTarget({
                          field: "bio",
                          text: el.value.substring(el.selectionStart, el.selectionEnd),
                          start: el.selectionStart,
                          end: el.selectionEnd,
                        });
                      }
                    }}
                    className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none leading-relaxed transition-all"
                    placeholder="Enter your detailed bio narrative..."
                  />
                </div>

                {/* ── 2C. AUTO-HIGHLIGHT KEYWORDS (GLOBAL) ── */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Auto-Highlight Keywords (Comma Separated):</span>
                    </label>
                    <span className="text-[10px] font-mono text-stone-500">
                      Applied automatically without typing markup
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. Harsh Aryan, IIT Madras, Artificial Intelligence, Data Science, Machine Learning"
                    value={portfolio.personal.aboutHighlightedWords ?? "Harsh Aryan, IIT Madras, Artificial Intelligence, Data Science, Machine Learning"}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, aboutHighlightedWords: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="font-mono text-[11px] text-stone-600 font-bold">
                      Default Keyword Auto-Color:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={portfolio.personal.aboutHighlightColor || "#f59e0b"}
                        onChange={(e) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, aboutHighlightColor: e.target.value },
                          }))
                        }
                        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={portfolio.personal.aboutHighlightColor || "#f59e0b"}
                        onChange={(e) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, aboutHighlightColor: e.target.value },
                          }))
                        }
                        className="w-20 px-2 py-0.5 rounded border border-stone-300 font-mono text-[11px] font-bold uppercase text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* ── 2D. LIVE FORMATTED PREVIEW ── */}
                <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white space-y-3.5 border-2 border-black shadow-[3px_3px_0_#f59e0b]">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <span className="font-mono text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Live Formatted Preview (Real-Time Rendering):</span>
                    </span>
                    <span className="font-mono text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded border border-stone-700">
                      Matches Live About Page
                    </span>
                  </div>

                  {/* Statement Live */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-0.5">
                      <span className="font-['Space_Grotesk'] text-base font-black uppercase text-amber-400">
                        Persona
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono text-[9px] font-black uppercase">
                        STATEMENT
                      </span>
                    </div>
                    <div className="font-semibold text-base sm:text-lg text-white leading-snug">
                      <FormattedHighlightedText
                        text={portfolio.personal.headline}
                        highlightKeywords={portfolio.personal.aboutHighlightedWords}
                        highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                      />
                    </div>
                  </div>

                  {/* Bio Live */}
                  <div className="space-y-1 pt-2 border-t border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
                    <FormattedHighlightedText
                      text={portfolio.personal.bio}
                      highlightKeywords={portfolio.personal.aboutHighlightedWords}
                      highlightColor={portfolio.personal.aboutHighlightColor || highlighterColor}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── 3. KEY BENCHMARKS (QUICK STATS CAPSULES) ── */}
            {(aboutSubView === "all" || aboutSubView === "benchmarks") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 text-sm">
                      ⚡
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                        3. Key Benchmarks (Quick Stats Cards)
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        About section me Statement aur Bio ke theek neeche render hone wale 4 slim benchmark capsules.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuickStat}
                    className="px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stat Capsule</span>
                  </button>
                </div>

                {/* Edit Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(portfolio.quickStats || []).map((stat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-300 hover:border-black transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <span className="font-mono text-xs font-black uppercase text-stone-600">
                          Card #{idx + 1}
                        </span>
                        <div className="flex items-center gap-1">
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

                      <div>
                        <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                          Value (Big Stat):
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleUpdateQuickStat(idx, "value", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-sm font-black text-stone-900 focus:border-black focus:outline-none"
                          placeholder="e.g. 6+"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                          Label:
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleUpdateQuickStat(idx, "label", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                          placeholder="e.g. Specialization"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] font-bold text-stone-700 mb-1">
                          Sublabel:
                        </label>
                        <input
                          type="text"
                          value={stat.sublabel}
                          onChange={(e) => handleUpdateQuickStat(idx, "sublabel", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-[11px] text-stone-600 focus:border-black focus:outline-none"
                          placeholder="e.g. Machine Learning & AI"
                        />
                      </div>
                    </div>
                  ))}
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
                      const themes = [
                        {
                          bg: "bg-amber-100",
                          border: "border-black",
                          shadow: "shadow-[3px_3px_0_#000]",
                          tape: "bg-amber-300",
                          text: "text-amber-950",
                          label: "text-amber-900",
                          sub: "text-amber-800/80",
                          badge: "bg-amber-200 text-amber-950 border-amber-950/20",
                          icon: "✨",
                          tag: "SPECIALTY",
                          tilt: "-rotate-1 sm:-rotate-2",
                        },
                        {
                          bg: "bg-emerald-100",
                          border: "border-black",
                          shadow: "shadow-[3px_3px_0_#000]",
                          tape: "bg-emerald-300",
                          text: "text-emerald-950",
                          label: "text-emerald-900",
                          sub: "text-emerald-800/80",
                          badge: "bg-emerald-200 text-emerald-950 border-emerald-950/20",
                          icon: "⚡",
                          tag: "PROJECTS",
                          tilt: "rotate-1 sm:rotate-2",
                        },
                        {
                          bg: "bg-cyan-100",
                          border: "border-black",
                          shadow: "shadow-[3px_3px_0_#000]",
                          tape: "bg-cyan-300",
                          text: "text-cyan-950",
                          label: "text-cyan-900",
                          sub: "text-cyan-800/80",
                          badge: "bg-cyan-200 text-cyan-950 border-cyan-950/20",
                          icon: "🏆",
                          tag: "HONORS",
                          tilt: "-rotate-1 sm:-rotate-1.5",
                        },
                        {
                          bg: "bg-rose-100",
                          border: "border-black",
                          shadow: "shadow-[3px_3px_0_#000]",
                          tape: "bg-rose-300",
                          text: "text-rose-950",
                          label: "text-rose-900",
                          sub: "text-rose-800/80",
                          badge: "bg-rose-200 text-rose-950 border-rose-950/20",
                          icon: "🔥",
                          tag: "SOLVED",
                          tilt: "rotate-1 sm:rotate-2",
                        },
                      ];
                      const theme = themes[i % themes.length];
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
                              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-black uppercase tracking-wider border ${theme.badge}`}
                            >
                              <span>{theme.icon}</span>
                              <span>{theme.tag}</span>
                            </span>
                            <span className="text-[9.5px] font-mono font-bold text-black/35">
                              #{String(i + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <div className={`text-xl sm:text-2xl font-black font-mono tracking-tight leading-none ${theme.text}`}>
                            {st.value || "0"}
                          </div>
                          <div className={`text-[10px] sm:text-[10.5px] font-mono font-black uppercase tracking-wider mt-1.5 leading-tight ${theme.label}`}>
                            {st.label || "METRIC"}
                          </div>
                          {st.sublabel && (
                            <div className={`text-[9px] font-mono truncate mt-0.5 leading-tight font-medium ${theme.sub}`}>
                              {st.sublabel}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. PROFESSIONAL EXPERIENCE CATALOG ── */}
            {(aboutSubView === "all" || aboutSubView === "experience") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-sky-100 text-sky-900 border border-sky-300 text-sm">
                      💼
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                          4. Professional Experience & Roles
                        </h3>
                        {portfolio.personal.showExperienceSection === false && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 border border-red-300 font-mono text-[10px] font-black uppercase">
                            Section Hidden
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-stone-500">
                        Manage teaching roles, internships, research assistantships & industry experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Hide / Unhide Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: {
                            ...prev.personal,
                            showExperienceSection: prev.personal.showExperienceSection === false ? true : false,
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                        portfolio.personal.showExperienceSection === false
                          ? "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 shadow-xs"
                          : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs"
                      }`}
                      title={
                        portfolio.personal.showExperienceSection === false
                          ? "Click to display Experience section on the main page"
                          : "Click to hide Experience section from the main page"
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
                            Section Visible
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 rounded-xl bg-black text-white font-mono text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Experience</span>
                    </button>
                  </div>
                </div>

                {portfolio.personal.showExperienceSection === false && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-2.5 text-xs text-amber-900 font-mono">
                    <span className="text-base">ℹ️</span>
                    <div>
                      <strong className="font-bold">Experience Section is currently hidden:</strong> It will not show on the live homepage between Core Capabilities and Trajectory. Click <strong>"Section Hidden"</strong> above to make it visible.
                    </div>
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
                    (portfolio.experiences || []).map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        className="p-5 sm:p-6 rounded-2xl border-2 border-black bg-stone-50/70 shadow-[3px_3px_0_#000] space-y-5"
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
                            {exp.isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                Current Active Role
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
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

                        {/* Current Role Checkbox */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-200">
                          <input
                            type="checkbox"
                            id={`current-role-${idx}`}
                            checked={exp.isCurrent || false}
                            onChange={(e) => handleUpdateExperience(idx, "isCurrent", e.target.checked)}
                            className="w-4 h-4 rounded-sm border-2 border-black accent-yellow-400 cursor-pointer"
                          />
                          <label
                            htmlFor={`current-role-${idx}`}
                            className="font-mono text-xs font-bold text-stone-800 cursor-pointer select-none"
                          >
                            Currently active position (Displays glowing live green pulse badge on website)
                          </label>
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
                          <label className="block text-xs font-mono font-bold text-stone-700 mb-1">
                            Skills & Technologies Used (Comma-separated)
                          </label>
                          <input
                            type="text"
                            value={(exp.skillsUsed || []).join(", ")}
                            onChange={(e) => {
                              const items = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              handleUpdateExperience(idx, "skillsUsed", items);
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ── 5. DEVELOPMENT TRAJECTORY (ROADMAP MILESTONES) ── */}
            {(aboutSubView === "all" || aboutSubView === "milestones") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-sm">
                      🚀
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                          5. Development Trajectory (Roadmap Milestones)
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
                  ).map((m, mIdx, arr) => (
                    <div
                      key={mIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-stone-50 border-2 border-stone-300 hover:border-black transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                            PHASE {m.phaseNumber || `0${mIdx + 1}`}
                          </span>
                          <input
                            type="text"
                            value={m.period}
                            placeholder="e.g. Foundations, Data & Math"
                            onChange={(e) => handleUpdateMilestone(mIdx, "period", e.target.value)}
                            className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-800 focus:border-black focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-1">
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
                            Phase Subtitle:
                          </label>
                          <input
                            type="text"
                            value={m.subtitle}
                            onChange={(e) => handleUpdateMilestone(mIdx, "subtitle", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>

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
                    </div>
                  ))}
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
                    ).map((m, idx) => {
                      const milestoneThemes = [
                        { badgeBg: "bg-amber-400 text-black", border: "border-amber-300", accentText: "text-amber-800" },
                        { badgeBg: "bg-emerald-500 text-white", border: "border-emerald-300", accentText: "text-emerald-800" },
                        { badgeBg: "bg-indigo-600 text-white", border: "border-indigo-300", accentText: "text-indigo-800" },
                      ];
                      const t = milestoneThemes[idx % milestoneThemes.length];
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white border-2 border-black shadow-[3px_3px_0_#000] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase ${t.badgeBg}`}>
                                PHASE {m.phaseNumber || `0${idx + 1}`}
                              </span>
                              <span className={`font-mono text-[11px] font-bold ${t.accentText}`}>
                                {m.period}
                              </span>
                            </div>
                            <h4 className="font-black text-sm uppercase text-black leading-snug">
                              {m.title}
                            </h4>
                            <p className="text-[11px] font-mono font-bold text-stone-500">
                              {m.subtitle}
                            </p>
                            <p className="text-xs text-stone-600 leading-relaxed pt-1">
                              {m.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Final Save Button for Profile */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Profile & Bio Changes"}</span>
              </button>
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

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer shrink-0 flex items-center gap-1.5 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Skills"}</span>
              </button>
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

              <div className="space-y-4">
                {(portfolio.skills || []).map((cat, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 max-w-sm">
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
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-black text-stone-900 focus:border-black focus:outline-none uppercase"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkillCategory(cIdx)}
                        className="p-1.5 rounded-lg border border-stone-300 text-stone-500 hover:text-red-600 hover:border-red-400 bg-white cursor-pointer ml-2"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Skill Tags */}
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
                        className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold cursor-pointer shrink-0"
                      >
                        + Add Tag
                      </button>
                    </div>
                  </div>
                ))}

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
                  const themes = [
                    {
                      bg: "bg-[#fffef7]",
                      border: "border-2 border-black",
                      shadow: "shadow-[4px_4px_0_#f59e0b]",
                      tape: "bg-amber-300",
                      badgeBg: "bg-amber-100 text-amber-950 border-amber-300",
                      starColor: "text-amber-500",
                      icon: <Code2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
                    },
                    {
                      bg: "bg-[#fafffa]",
                      border: "border-2 border-black",
                      shadow: "shadow-[4px_4px_0_#10b981]",
                      tape: "bg-emerald-300",
                      badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-300",
                      starColor: "text-emerald-500",
                      icon: <Brain className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
                    },
                    {
                      bg: "bg-[#fafaff]",
                      border: "border-2 border-black",
                      shadow: "shadow-[4px_4px_0_#6366f1]",
                      tape: "bg-indigo-300",
                      badgeBg: "bg-indigo-100 text-indigo-950 border-indigo-300",
                      starColor: "text-indigo-500",
                      icon: <Laptop className="w-3.5 h-3.5 text-indigo-600 shrink-0" />,
                    },
                    {
                      bg: "bg-[#f7feff]",
                      border: "border-2 border-black",
                      shadow: "shadow-[4px_4px_0_#06b6d4]",
                      tape: "bg-cyan-300",
                      badgeBg: "bg-cyan-100 text-cyan-950 border-cyan-300",
                      starColor: "text-cyan-500",
                      icon: <FolderGit2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />,
                    },
                    {
                      bg: "bg-[#fff8fa]",
                      border: "border-2 border-black",
                      shadow: "shadow-[4px_4px_0_#f43f5e]",
                      tape: "bg-rose-300",
                      badgeBg: "bg-rose-100 text-rose-950 border-rose-300",
                      starColor: "text-rose-500",
                      icon: <Sparkles className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
                    },
                  ];
                  const t = themes[idx % themes.length];
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
                      className={`relative p-4 rounded-2xl ${colSpan} ${t.bg} ${t.border} ${t.shadow} flex flex-col justify-between space-y-3`}
                    >
                      {/* Washi tape pin */}
                      <div
                        className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-12 h-2.5 ${t.tape} border border-black/25 shadow-xs rotate-[-1deg] rounded-xs pointer-events-none z-10`}
                      />

                      <div className="flex items-center justify-between gap-1 pb-2 border-b border-dashed border-black/15">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex px-1.5 py-0.5 rounded font-mono text-[9px] font-black border ${t.badgeBg}`}>
                            0{idx + 1}
                          </span>
                          <span className="font-mono text-xs font-black uppercase text-black flex items-center gap-1 truncate">
                            {t.icon}
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
                            <span className={t.starColor}>✦</span>
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

            {/* Bottom Final Save Button for Skills */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Skills Changes"}</span>
              </button>
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
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold uppercase">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-1">
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
                    className="p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-black flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[4px_4px_0_#000] transition-all"
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
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold uppercase truncate">
                            {cert.category}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
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
                onClick={() => saveInstantly(portfolioRef.current, "✓ Contact page & dispatch settings updated successfully!")}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 cursor-pointer flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Contact Settings"}</span>
              </button>
            </div>

            {/* Quick Sub-Section Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              {[
                { id: "all", label: "✦ All Settings", count: "5" },
                { id: "copy", label: "📝 Header & Doodles", count: "Copy" },
                { id: "form", label: "📮 Inquiry Form & Email", count: "Form" },
                { id: "coordinates", label: "📍 Live Coordinates & Clock", count: "Station" },
                { id: "footer", label: "🏛️ Site Footer", count: "Footer" },
                { id: "inquiries", label: "📬 Inquiries Dispatch", count: messages.length.toString() },
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
                <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
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

            {/* ── 4. CONTACT INQUIRIES DISPATCH (WITH DELETE & REPLY) ── */}
            {(contactSubTab === "all" || contactSubTab === "inquiries") && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-sm">
                      📬
                    </span>
                    <div>
                      <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900 flex items-center gap-2">
                        <span>Incoming Inquiries &amp; Dispatches</span>
                        <span className="px-2 py-0.5 rounded-full bg-black text-white font-mono text-xs font-bold">
                          {messages.length}
                        </span>
                      </h3>
                      <p className="font-mono text-xs text-stone-500">
                        Inquiries submitted via your portfolio. Reply directly or delete manually once resolved.
                      </p>
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
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={fetchMessages}
                      className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:border-black bg-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {isLoadingMessages ? (
                  <div className="py-12 text-center text-stone-500 font-mono text-xs">
                    Loading inquiries...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 font-mono text-xs bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 space-y-2">
                    <p className="font-bold text-stone-700">No inquiries received yet.</p>
                    <p className="text-stone-500">Test by submitting the contact form on your portfolio website!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-2xl border-2 border-black bg-stone-50/80 shadow-[3px_3px_0_#000] space-y-3 transition-all hover:bg-white"
                      >
                        {/* Header: Name, Category, Timestamp, Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-sm text-stone-900">
                              {msg.name}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400 font-mono text-[10px] font-bold uppercase">
                              {msg.category || "General Inquiry"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <span className="font-mono text-[10px] text-stone-400">
                              📅 {new Date(msg.timestamp).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>

                            {/* Reply Button */}
                            <a
                              href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry - ${encodeURIComponent(msg.category || "General")}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Send Email Reply"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </a>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-mono text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-[1px_1px_0_#e11d48]"
                              title="Delete inquiry manually"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Sender Email */}
                        <div className="text-xs font-mono font-bold text-indigo-700 flex items-center gap-1.5">
                          <span>✉️</span>
                          <a href={`mailto:${msg.email}`} className="hover:underline">
                            {msg.email}
                          </a>
                        </div>

                        {/* Message Body */}
                        <div className="p-3.5 rounded-xl bg-white border border-stone-200 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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

            {/* Bottom Final Save Button for Contact */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => saveInstantly(portfolioRef.current, "✓ Contact page & dispatch settings updated successfully!")}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? "Saving..." : "Save Contact Settings"}</span>
              </button>
            </div>
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
              {/* Type Selector (3 Visual Cards) */}
              <div>
                <label className="block text-stone-800 font-bold mb-1.5">Entry Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { type: "award", icon: Trophy, label: "🏆 Award & Laurel", color: "hover:border-amber-400" },
                    { type: "paper", icon: FileText, label: "📄 Research Paper", color: "hover:border-indigo-400" },
                    { type: "book", icon: BookOpen, label: "📚 Published Book", color: "hover:border-rose-400" },
                  ].map((btn) => {
                    const isSelected = laurelForm.type === btn.type;
                    return (
                      <button
                        key={btn.type}
                        type="button"
                        onClick={() => setLaurelForm({ ...laurelForm, type: btn.type as any })}
                        className={`p-3 rounded-xl border-2 font-bold text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? "bg-black text-white border-black shadow-[2.5px_2.5px_0_#f59e0b]"
                            : `bg-stone-50 text-stone-700 border-stone-200 ${btn.color}`
                        }`}
                      >
                        <btn.icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-stone-500"}`} />
                        <span className="text-[11px] leading-tight">{btn.label}</span>
                      </button>
                    );
                  })}
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
