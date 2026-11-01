"use client";

import React, { useState, useEffect } from "react";
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
  FolderGit2,
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
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project, Certificate, PortfolioData, TimelineMilestone } from "@/data/portfolioData";
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

const DEFAULT_PROJECT_CATS = [
  "Machine Learning",
  "Data Analysis",
  "Web & AI Tools",
  "Python Basics",
];

const DEFAULT_CERT_CATS = [
  "Machine Learning",
  "Data Science",
  "Programming",
  "Mathematics & Hackathons",
];

export default function AdminPage() {
  const router = useRouter();
  const { data: initialData, updateData } = usePortfolio();

  // Enforce Light Theme strictly on Socius Admin Console
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS Form State
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialData);
  type AdminTab = "cover" | "about" | "highlights" | "projects" | "certificates" | "milestones" | "skills" | "contact";
  const [activeTab, setActiveTab] = useState<AdminTab>("cover");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const [coverAccentColor, setCoverAccentColor] = useState<string>("#facc15");

  useEffect(() => {
    const photo = formatGoogleDriveImageUrl(portfolio.personal?.coverPhotoUrl) || "/harsh-cover.jpg";
    extractVibrantColor(photo, "#facc15").then(setCoverAccentColor);
  }, [portfolio.personal?.coverPhotoUrl]);

  // Category Management Inputs
  const [newProjectCatInput, setNewProjectCatInput] = useState("");
  const [newCertCatInput, setNewCertCatInput] = useState("");

  // About Skills & Highlighter Refs
  const bioTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const headlineInputRef = React.useRef<HTMLInputElement>(null);
  const [newSkillCatName, setNewSkillCatName] = useState("");
  const [skillTagInputs, setSkillTagInputs] = useState<Record<number, string>>({});

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
    setPortfolio((prev) => {
      const updated = [...(prev.skills || [])];
      updated[catIdx] = {
        ...updated[catIdx],
        items: [...(updated[catIdx].items || []), item.trim()],
      };
      return { ...prev, skills: updated };
    });
    setSkillTagInputs((prev) => ({ ...prev, [catIdx]: "" }));
  };

  const handleRemoveSkillItem = (catIdx: number, itemIdx: number) => {
    setPortfolio((prev) => {
      const updated = [...(prev.skills || [])];
      updated[catIdx] = {
        ...updated[catIdx],
        items: updated[catIdx].items.filter((_, i) => i !== itemIdx),
      };
      return { ...prev, skills: updated };
    });
  };

  const handleAddSkillCategory = () => {
    if (!newSkillCatName.trim()) return;
    setPortfolio((prev) => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        { category: newSkillCatName.trim(), items: [] },
      ],
    }));
    setNewSkillCatName("");
  };

  const handleRemoveSkillCategory = (catIdx: number) => {
    if (!confirm("Are you sure you want to delete this skills category?")) return;
    setPortfolio((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== catIdx),
    }));
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setAuthError("Failed to authenticate. Please check network connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error(err);
    }
  };

  // ── Central Instant Save Handler (Reflects Fatak Se Without Bugs) ──
  const saveInstantly = async (dataToSave: PortfolioData, successMsg: string = "Saved to Socius!") => {
    setIsSaving(true);
    setSaveError("");
    try {
      const success = await updateData(dataToSave);
      if (success) {
        setToastMessage(successMsg);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setSaveError("Failed to save. Make sure server is reachable.");
        setTimeout(() => setSaveError(""), 4000);
      }
    } catch (err) {
      setSaveError("Error saving data to Socius.");
      setTimeout(() => setSaveError(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Save All button
  const handleSaveAll = async () => {
    await saveInstantly(portfolio, "All changes saved successfully!");
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
    const cats = portfolio.projectCategories || DEFAULT_PROJECT_CATS;
    setEditingProject(null);
    setProjectForm({
      id: "proj-" + Date.now(),
      title: "",
      tagline: "",
      description: "",
      category: cats[0] || "Machine Learning",
      technologies: ["Python"],
      metrics: ["High Accuracy"],
      features: [],
      githubUrl: "https://github.com/harsharyann",
      liveUrl: "",
      imageGradient: "from-amber-400 to-orange-500",
    });
    setCustomProjectCat("");
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

    const effectiveCategory = customProjectCat.trim() || projectForm.category || "Machine Learning";
    const finalProject: Project = {
      ...projectForm,
      category: effectiveCategory,
    };

    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = portfolio.projects.map((p) => (p.id === editingProject.id ? finalProject : p));
    } else {
      updatedProjects = [finalProject, ...portfolio.projects];
    }

    // Auto-register category if new
    const currentCats = portfolio.projectCategories || DEFAULT_PROJECT_CATS;
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
    const updatedProjects = portfolio.projects.filter((p) => p.id !== id);
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

    let updatedCerts: Certificate[];
    if (editingCert) {
      updatedCerts = portfolio.certificates.map((c) => (c.id === editingCert.id ? finalCert : c));
    } else {
      updatedCerts = [finalCert, ...portfolio.certificates];
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
    const updatedCerts = portfolio.certificates.filter((c) => c.id !== id);
    const newPortfolio: PortfolioData = {
      ...portfolio,
      certificates: updatedCerts,
    };
    setPortfolio(newPortfolio);
    await saveInstantly(newPortfolio, "Certificate deleted.");
  };

  // ─── LOADING STATE ───
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-stone-600 font-bold">
            Checking Socius Session...
          </p>
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN (SOCIUS LOCKED VIEW) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 sm:p-6 text-stone-900 font-sans selection:bg-amber-400 selection:text-black">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[8px_8px_0_#000] space-y-6">
          {/* Socius Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-400 text-black border-2 border-black shadow-[3px_3px_0_#000] mx-auto mb-1">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="font-['Space_Grotesk'] text-3xl font-black uppercase tracking-tight text-stone-900">
              Socius
            </h1>
            <p className="font-mono text-xs text-stone-500">
              Personal Portfolio Management Console
            </p>
          </div>

          {/* Feedback error alert */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form (Clean, Zero Password Hints, High-Security) */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1.5">
                Username:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder=""
                  autoComplete="username"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border-2 border-stone-300 text-stone-900 font-mono text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-stone-700 mb-1.5">
                Password:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border-2 border-stone-300 text-stone-900 font-mono text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                />
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3.5px_3.5px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 stroke-[2.5]" />
                  <span>Enter Socius</span>
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-5 border-t border-stone-200 text-center">
            <Link
              href="/"
              className="font-mono text-xs font-bold text-stone-500 hover:text-black transition-colors"
            >
              &larr; Return to Live Portfolio
            </Link>
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

  // ─── AUTHENTICATED DASHBOARD (SOCIUS IN PURE LIGHT THEME) ───
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-400 selection:text-black font-sans pb-20">
      {/* ── Instant Save Toast Notification (Fatak Se Feedback) ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-black text-white font-mono text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200 w-[92%] sm:w-auto max-w-md justify-center text-center">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {saveError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-red-600 text-white font-mono text-xs font-bold shadow-lg w-[92%] sm:w-auto max-w-md justify-center text-center">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Floating Glassmorphism Navbar (Socius NavButton Bar) ── */}
      <header className="sticky top-3 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-full bg-white/80 backdrop-blur-2xl border border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.06)] px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3 pointer-events-auto transition-all">
          
          {/* Brand Left: Socius + Return Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer"
              title="Return to Live Portfolio"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-black font-['Space_Grotesk'] font-black text-xs border border-black/20 shadow-sm group-hover:scale-105 transition-transform">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-base font-black uppercase tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                  Socius
                </span>
                <span className="font-mono text-[9px] text-stone-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Glassmorphism NavTabs (Pill Buttons) */}
          <nav className="flex items-center gap-1.5 p-1 rounded-xl sm:rounded-full bg-stone-100/90 border border-stone-200/80 overflow-x-auto max-w-full">
            {[
              { id: "cover", label: "Cover", icon: Sliders },
              { id: "about", label: "Profile", icon: User },
              { id: "highlights", label: "Highlights", icon: Sparkles },
              { id: "projects", label: "Projects", icon: FolderGit2, count: portfolio.projects.length },
              { id: "certificates", label: "Certificates", icon: Award, count: portfolio.certificates.length },
              { id: "milestones", label: "Milestones", icon: Layers, count: (portfolio.milestones || []).length || 3 },
              { id: "skills", label: "Skills", icon: Code2, count: portfolio.skills.length },
              { id: "contact", label: "Inquiries", icon: Send, count: messages.filter((m) => !m.read).length || undefined },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-full font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-black text-white shadow-sm font-black"
                      : "text-stone-600 hover:text-black hover:bg-white/80"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:border-black bg-white hover:bg-stone-50 font-mono text-xs font-bold text-stone-700 hover:text-black transition-all"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border border-black shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save All"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl border border-stone-200 hover:border-stone-400 text-stone-500 hover:text-red-600 bg-white hover:bg-red-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">

        {/* ── TAB: COVER HERO MANAGER (LAPTOP & PHONE DEDICATED SECTIONS) ── */}
        {activeTab === "cover" && (
          <div className="space-y-8">
            {/* Header intro */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-amber-500" />
                  <span>Cover Page Manager</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1">
                  Yahan se aap <strong>Big Screen / Laptop</strong> aur <strong>Mobile Phone</strong> dono covers ka text, pills, aur photos alag-alag customize kar sakte hain.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer shrink-0 flex items-center gap-1.5 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save All Cover Changes"}</span>
              </button>
            </div>

            {/* ── 1. LAPTOP / BIG SCREEN COVER CONFIG ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-900 border border-indigo-300">
                    💻
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Laptop &amp; Big Screen Cover (Desktop View)
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Tablets, Laptops aur Desktop screens par ye interactive Doodle Crew cover show hota hai.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-center font-mono text-[10px] font-black uppercase bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-full">
                  Desktop &bull; Large Screen
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Giant Stamped Ink Wordmark:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HARSH ARYAN"
                    value={portfolio.personal.desktopWordmark || portfolio.personal.name || ""}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, desktopWordmark: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-sm focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                  <span className="block font-mono text-[10px] text-stone-400 mt-1">
                    Characters is giant wordmark ke letters par baithte hain.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Desktop Role Badge:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Teaching Assistant • IIT Madras"
                    value={portfolio.personal.desktopRole || portfolio.personal.role || ""}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, desktopRole: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-sm focus:border-black focus:bg-white focus:outline-none transition-all"
                  />
                  <span className="block font-mono text-[10px] text-stone-400 mt-1">
                    Hero section me green live-dot ke sath pill me show hota hai.
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                  Desktop Headline / Subtitle:
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
                  className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                  Architecture Tagline:
                </label>
                <input
                  type="text"
                  placeholder="e.g. DESIGN · CODE · MACHINE LEARNING"
                  value={portfolio.personal.desktopTagline || "DESIGN · CODE · MACHINE LEARNING"}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, desktopTagline: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* ── 2. PHONE / MOBILE COVER CONFIG (With Badges & Tagline) ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                    📱
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Mobile Phone Cover (Portrait Photo &amp; Highlighter Pills)
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Smartphones par fullscreen hero portrait ke upar Highlighter Pills aur Tagline show hoti hain.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-center font-mono text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                  Mobile &bull; Portrait View
                </span>
              </div>

              {/* Editable Name & Badges */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-8 space-y-4">
                  {/* Hero Name */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                      Phone Hero Name (Permanent Marker):
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
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-sm focus:border-black focus:bg-white focus:outline-none transition-all"
                    />
                  </div>

                  {/* Current Role / Internship Status Badge with Toggle */}
                  <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-xs font-black uppercase text-stone-900">
                          Current Role / Internship Badge
                        </span>
                      </div>

                      {/* Show / Hide Toggle Button */}
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
                        className={`px-3 py-1 rounded-full font-mono text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1.5 border ${
                          portfolio.personal.showMobileCurrentRole !== false
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                            : "bg-stone-200 text-stone-600 border-stone-300"
                        }`}
                      >
                        <span>{portfolio.personal.showMobileCurrentRole !== false ? "● SHOWN ON COVER" : "○ HIDDEN"}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                        Role Title &amp; Organization:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Teaching Assistant • IIT Madras"
                        value={portfolio.personal.mobileBadge1 || "Teaching Assistant • IIT Madras"}
                        onChange={(e) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, mobileBadge1: e.target.value },
                          }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                      />
                      <span className="block font-mono text-[10px] text-stone-400 mt-1">
                        Phone cover par pulsating green dot ke sath <strong>CURRENT ROLE</strong> badge me dikhta hai. Agar hide karna ho toh upar toggle switch use karein.
                      </span>
                    </div>
                  </div>

                  {/* Punchy Narrative Tagline */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                      <span>✍️</span>
                      <span>Mobile Narrative Tagline:</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Teaching Machines To Learn • Building Scientific Software"
                      value={portfolio.personal.mobileTagline ?? "Teaching Machines To Learn • Building Scientific Software"}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, mobileTagline: e.target.value },
                        }))
                      }
                      className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none transition-all"
                    />
                    <span className="block font-mono text-[10px] text-stone-400 mt-1">
                      Highlighter pills ke theek neeche handwritten font me show hota hai.
                    </span>
                  </div>

                  {/* Mobile Cover Photo Manager */}
                  <div className="pt-2 space-y-3">
                    <label className="block font-mono text-xs font-bold text-stone-700">
                      Mobile Cover Photo (Google Drive ya Direct Link):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="e.g. https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                        value={portfolio.personal.coverPhotoUrl || ""}
                        onChange={(e) =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, coverPhotoUrl: e.target.value },
                          }))
                        }
                        className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
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
                          className="px-3 py-2 rounded-xl border border-stone-300 text-stone-600 hover:text-red-600 hover:border-red-400 font-mono text-xs cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>

                    {/* Google Drive Status */}
                    {isGoogleDriveUrl(portfolio.personal.coverPhotoUrl) && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold">Google Drive link detected!</div>
                          <div className="text-[11px] text-emerald-700">
                            Drive ID: <span className="font-mono font-bold">{extractGoogleDriveId(portfolio.personal.coverPhotoUrl)}</span> — Auto-converted into high-speed CDN image link.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Upload button */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                        <span>📁 Select Image from Device</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                setIsSaving(true);
                                setToastMessage("Optimizing & compressing image for mobile...");
                                const compressed = await compressImageFile(file);
                                const updated = {
                                  ...portfolio,
                                  personal: {
                                    ...portfolio.personal,
                                    coverPhotoUrl: compressed,
                                  },
                                };
                                setPortfolio(updated);
                                await saveInstantly(updated, "✅ Cover photo uploaded & saved successfully!");
                              } catch (err) {
                                alert("Failed to process image. Please try another image file.");
                              } finally {
                                setIsSaving(false);
                              }
                            }
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={async () => {
                          const updated = {
                            ...portfolio,
                            personal: { ...portfolio.personal, coverPhotoUrl: "/harsh-cover.jpg" },
                          };
                          setPortfolio(updated);
                          await saveInstantly(updated, "✅ Reset to default /harsh-cover.jpg!");
                        }}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-100 text-stone-700 font-mono text-xs cursor-pointer active:translate-y-0.5"
                      >
                        Reset to Default (/harsh-cover.jpg)
                      </button>
                    </div>
                  </div>
                </div>

                {/* 📱 Real-Time Live Phone Mockup Preview */}
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="font-mono text-[11px] font-bold text-stone-500 mb-1.5">
                    Live Phone Mockup Preview:
                  </div>
                  <div className="relative w-44 h-80 rounded-3xl p-1 bg-stone-900 border-2 border-stone-700 shadow-xl overflow-hidden flex flex-col">
                    <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-stone-800 flex flex-col justify-between">
                      <img
                        src={formatGoogleDriveImageUrl(portfolio.personal.coverPhotoUrl) || "/harsh-cover.jpg"}
                        alt="Cover Preview"
                        className="absolute inset-0 w-full h-full object-cover object-[center_16%]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/harsh-cover.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 via-48% to-transparent pointer-events-none" />

                      {/* Top Bar inside Mockup */}
                      <div className="relative z-10 w-full px-2 pt-2 flex justify-end">
                        <span className="font-mono text-[7px] text-white bg-black/75 px-1.5 py-0.5 rounded-full border border-stone-600">
                          ADMIN
                        </span>
                      </div>

                      {/* Bottom Details inside Mockup */}
                      <div className="relative z-10 p-2 text-center flex flex-col items-center">
                        <svg viewBox="0 0 54 34" className="w-5 h-3.5 mb-1" fill="none" stroke="#000" strokeWidth="2.5">
                          <path d="M 6 28 L 48 28 L 46 11 L 35 19 L 27 6 L 19 19 L 8 11 Z" fill={coverAccentColor} />
                        </svg>

                        <span
                          className="font-['Permanent_Marker',cursive] text-[13px] text-white tracking-wide leading-none select-none mb-1.5"
                          style={{
                            textShadow: `1px 1px 0 #000, -1px -1px 0 #000, 2px 2px 0 ${coverAccentColor}`,
                          }}
                        >
                          {portfolio.personal.name || "HARSH ARYAN"}
                        </span>

                        {/* Live Badges Preview */}
                        {portfolio.personal.showMobileCurrentRole !== false && (
                          <div className="flex items-center justify-center mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-black/85 text-white text-[7.5px] font-bold uppercase tracking-wider border border-emerald-400/50 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-emerald-400 font-mono text-[6.5px]">ROLE:</span>
                              <span className="truncate max-w-[100px]">{portfolio.personal.mobileBadge1 || "Teaching Assistant • IIT Madras"}</span>
                            </span>
                          </div>
                        )}

                        {/* Live Tagline Preview */}
                        <p className="text-stone-300 text-[8px] font-drawing-kids tracking-wider line-clamp-2 max-w-[140px]">
                          {portfolio.personal.mobileTagline || "Teaching Machines To Learn • Building Scientific Software"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                    <span className="w-2.5 h-2.5 rounded-full border border-black shadow-[1px_1px_0_#000]" style={{ backgroundColor: coverAccentColor }} />
                    <span>Auto Accent: <strong className="font-bold">{coverAccentColor}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3. SOCIAL & CONTACT LINKS (Both Devices) ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-mono text-sm font-black uppercase text-stone-900">
                Primary Social &amp; Contact Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">GitHub URL:</label>
                  <input
                    type="text"
                    value={portfolio.socialLinks.github}
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
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">LinkedIn URL:</label>
                  <input
                    type="text"
                    value={portfolio.socialLinks.linkedin}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 font-mono text-xs focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-sm font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Apply & Save All Cover Settings"}</span>
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
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-amber-500" />
                  <span>About Page &amp; Dossier Manager</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1">
                  Yahan se aap About page ki <strong>Framed Photo</strong>, <strong>OG Plaque (Name, Work &amp; Workplace)</strong>, <strong>Content Highlights</strong>, <strong>Quick Stats Capsules</strong>, <strong>Skills</strong>, aur <strong>Roadmap Milestones</strong> edit kar sakte hain.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer shrink-0 flex items-center gap-1.5 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save All About Changes"}</span>
              </button>
            </div>

            {/* ── 1. FRAMED PHOTO & "OG" EXHIBITION PLAQUE ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-stone-900 text-amber-300 border border-black text-sm">
                    🖼️
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Framing Photo &amp; &quot;OG&quot; Exhibition Plaque
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Classic dark moulding frame, archival ivory mat, photo corner tag, aur frame ke theek neeche authentic identity plaque.
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-center font-mono text-[10px] font-black uppercase bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-full">
                  Exhibition Mount
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Photo Inputs & Plaque Fields (Left 7 cols) */}
                <div className="md:col-span-7 space-y-4">
                  {/* Photo Link Input */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                      About Photo (Google Drive ya Direct Image URL):
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

                  {/* Device Upload / Reset */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <label className="px-3.5 py-1.5 rounded-xl border-2 border-dashed border-stone-400 hover:border-black bg-stone-50 hover:bg-white text-stone-700 hover:text-black font-mono text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                      <span>📁 Select Image from Device</span>
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

                    <button
                      type="button"
                      onClick={async () => {
                        const updated = {
                          ...portfolio,
                          personal: { ...portfolio.personal, aboutPhotoUrl: "/harsh-cover.jpg" },
                        };
                        setPortfolio(updated);
                        await saveInstantly(updated, "✅ Reset to /harsh-cover.jpg!");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-100 text-stone-700 font-mono text-xs cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>

                  {/* Corner Photo Tag */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black inline-block" />
                      <span>Photo Corner Tag / Badge (Right bottom of photo):</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ✦ TA @ IIT MADRAS"
                      value={portfolio.personal.aboutPhotoTag ?? "✦ TA @ IIT MADRAS"}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, aboutPhotoTag: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-amber-50/50 border border-amber-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                    />
                    <span className="block font-mono text-[10px] text-stone-400 mt-1">
                      Framed photo ke bottom-right corner me gold ribbon badge ki tarah show hota hai.
                    </span>
                  </div>

                  {/* ── OG PLAQUE DETAILS (Under the frame) ── */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-300 space-y-3.5">
                    <div className="font-mono text-xs font-black uppercase text-stone-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span>🏛️</span>
                        <span>OG Exhibition Plaque Details (Frame Ke Niche):</span>
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        Live Displayed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Current Work / Role:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Teaching Assistant"
                          value={portfolio.personal.aboutCurrentWork ?? "Teaching Assistant"}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, aboutCurrentWork: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Work Place / Org:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. IIT Madras"
                          value={portfolio.personal.aboutWorkPlace ?? "IIT Madras"}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, aboutWorkPlace: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Location:
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
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Degree &amp; Major:
                        </label>
                        <input
                          type="text"
                          value={portfolio.personal.degree || ""}
                          onChange={(e) =>
                            setPortfolio((prev) => ({
                              ...prev,
                              personal: { ...prev.personal, degree: e.target.value },
                            }))
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 font-mono text-xs text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Preview Unified Frame (Right 5 cols) */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="font-mono text-[11px] font-bold text-stone-500 mb-2">
                    Live Unified Frame Preview:
                  </div>

                  {/* The Unified Frame Preview */}
                  <div className="w-full max-w-[270px]">
                    {/* Washi Tape */}
                    <div className="w-24 h-5 bg-[#fde047]/85 border-t border-b border-black/25 shadow-xs rotate-[-1.5deg] mx-auto -mb-2.5 z-20 relative rounded-[2px]" />

                    {/* Frame Body */}
                    <div className="rounded-2xl border-2 border-black bg-[#fffdfa] shadow-[5px_5px_0_#000] p-3 space-y-2.5">
                      {/* Photo Inset */}
                      <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden border border-black/25 bg-stone-100">
                        <img
                          src={formatGoogleDriveImageUrl(portfolio.personal.aboutPhotoUrl) || "/harsh-cover.jpg"}
                          alt="About Frame Preview"
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/harsh-cover.jpg";
                          }}
                        />
                        {/* Corner Tabs */}
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-black/60 pointer-events-none" />
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-black/60 pointer-events-none" />
                        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-black/60 pointer-events-none" />
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-black/60 pointer-events-none" />
                      </div>

                      {/* Integrated Chin Details */}
                      <div className="pt-2 border-t-2 border-dashed border-stone-300 space-y-2">
                        <div className="font-['Space_Grotesk'] text-base font-black uppercase text-black leading-none truncate">
                          {portfolio.personal.name || "HARSH ARYAN"}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap text-[9px] font-mono font-bold">
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-300 text-stone-900 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{portfolio.personal.aboutCurrentWork || portfolio.personal.role || "Teaching Assistant"}</span>
                          </span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-950">
                            🏛️ {portfolio.personal.aboutWorkPlace || portfolio.personal.college || "IIT Madras"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-[9px] font-mono text-stone-500">
                          <span>📍 {portfolio.personal.location || "India"}</span>
                          <span>🎓 {portfolio.personal.degree || "BS Degree"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 2. PERSONAL STATEMENT, BIO & LIVE HIGHLIGHTER ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                    ✍️
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Statement, Bio &amp; Content Highlighter
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      Apne words aur names ko highlight karein (Yellow marker, Cyan marker, ya Bold).
                    </p>
                  </div>
                </div>
              </div>

              {/* Header Zone & Title Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Section Header Badge Stamp:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.aboutZoneBadge ?? "✦ THE ARCHITECT & MIND"}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, aboutZoneBadge: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Section Heading:
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Subtitle / Description */}
              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                  Section Subtitle / Description:
                </label>
                <input
                  type="text"
                  value={portfolio.personal.aboutSubtitle ?? "Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed."}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, aboutSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:outline-none"
                />
              </div>

              {/* Headline / Big Statement */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-xs font-bold text-stone-700">
                    Personal Headline (Bold Statement):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        wrapTextSelection(
                          headlineInputRef,
                          "==",
                          "==",
                          "highlighted",
                          portfolio.personal.headline || "",
                          (val) => setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, headline: val } }))
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-amber-200 hover:bg-amber-300 text-stone-900 font-mono text-[10px] font-bold border border-amber-400 cursor-pointer"
                      title="Wrap selection in Yellow highlight"
                    >
                      🟡 Yellow ==text==
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        wrapTextSelection(
                          headlineInputRef,
                          "^^",
                          "^^",
                          "highlighted",
                          portfolio.personal.headline || "",
                          (val) => setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, headline: val } }))
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-cyan-200 hover:bg-cyan-300 text-stone-900 font-mono text-[10px] font-bold border border-cyan-400 cursor-pointer"
                      title="Wrap selection in Cyan highlight"
                    >
                      🔵 Cyan ^^text^^
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:outline-none"
                />
              </div>

              {/* Bio Narrative */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-xs font-bold text-stone-700">
                    About Me Narrative Bio:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        wrapTextSelection(
                          bioTextareaRef,
                          "==",
                          "==",
                          "highlighted",
                          portfolio.personal.bio || "",
                          (val) => setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, bio: val } }))
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-amber-200 hover:bg-amber-300 text-stone-900 font-mono text-[10px] font-bold border border-amber-400 cursor-pointer"
                      title="Wrap selection in Yellow highlight"
                    >
                      🟡 Yellow Highlight (==word==)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        wrapTextSelection(
                          bioTextareaRef,
                          "^^",
                          "^^",
                          "highlighted",
                          portfolio.personal.bio || "",
                          (val) => setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, bio: val } }))
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-cyan-200 hover:bg-cyan-300 text-stone-900 font-mono text-[10px] font-bold border border-cyan-400 cursor-pointer"
                      title="Wrap selection in Cyan highlight"
                    >
                      🔵 Cyan Highlight (^^word^^)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        wrapTextSelection(
                          bioTextareaRef,
                          "**",
                          "**",
                          "bold",
                          portfolio.personal.bio || "",
                          (val) => setPortfolio((prev) => ({ ...prev, personal: { ...prev.personal, bio: val } }))
                        )
                      }
                      className="px-2.5 py-1 rounded-md bg-stone-200 hover:bg-stone-300 text-stone-900 font-mono text-[10px] font-bold border border-stone-400 cursor-pointer"
                      title="Wrap selection in Bold"
                    >
                      𝗕 Bold (**word**)
                    </button>
                  </div>
                </div>
                <textarea
                  ref={bioTextareaRef}
                  rows={5}
                  value={portfolio.personal.bio || ""}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, bio: e.target.value },
                    }))
                  }
                  className="w-full p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none transition-all leading-relaxed"
                />
              </div>
            </div>

            {/* Bottom Final Save Button for Profile */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: HIGHLIGHTS & KEY METRICS ── */}
        {activeTab === "highlights" && (
          <div className="space-y-8">
            {/* Header intro & Save CTA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <span>Highlights &amp; Section Metrics</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1">
                  Section Header stamps, Auto-highlighted words &amp; custom colors (without boxes), aur Quick Stats capsules.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer shrink-0 flex items-center gap-1.5 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Highlights"}</span>
              </button>
            </div>

            {/* ── 1. SECTION HEADINGS & ZONE STAMP ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                  🏷️
                </span>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                    Section Header Stamp &amp; Titles
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Portfolio ke About section ka zone badge, main heading aur subtitle customize karein.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Section Header Badge Stamp:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.aboutZoneBadge ?? "✦ THE ARCHITECT & MIND"}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, aboutZoneBadge: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                    Section Heading:
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs font-bold focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                  Section Subtitle / Description:
                </label>
                <input
                  type="text"
                  value={portfolio.personal.aboutSubtitle ?? "Curious mind blending machine learning fundamentals with expressive software architecture. Here is who I am, how I build, and where I am headed."}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, aboutSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:outline-none"
                />
              </div>
            </div>

            {/* ── 2. AUTO-HIGHLIGHT KEYWORDS & COLOR PICKER ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-sm">
                  ✨
                </span>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                    Auto-Highlight Keywords &amp; Custom Color
                  </h3>
                  <p className="font-mono text-xs text-stone-500">
                    Jo words comma ke sath likhenge, wo portfolio bio me bina background box ke directly is custom text color me highlight ho jayenge.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1.5">
                  Auto-Highlight Keywords (Comma Separated):
                </label>
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
                  className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-black focus:bg-white focus:outline-none font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🎨</span>
                    <span>Highlight Text Color:</span>
                  </label>
                  <span
                    className="px-2.5 py-1 rounded-lg font-mono text-xs font-black text-white shadow-xs"
                    style={{ backgroundColor: portfolio.personal.aboutHighlightColor || "#f59e0b" }}
                  >
                    {portfolio.personal.aboutHighlightColor || "#f59e0b"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex items-center gap-2 p-1.5 rounded-xl bg-white border border-amber-300 shadow-2xs">
                    <input
                      type="color"
                      value={portfolio.personal.aboutHighlightColor || "#f59e0b"}
                      onChange={(e) =>
                        setPortfolio((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, aboutHighlightColor: e.target.value },
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
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
                      placeholder="#f59e0b"
                      className="w-24 px-2 py-1 font-mono text-xs font-bold text-stone-900 focus:outline-none uppercase"
                    />
                  </div>

                  {/* 8 Curated Quick Preset Color Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { name: "Warm Amber", hex: "#f59e0b" },
                      { name: "Fresh Emerald", hex: "#10b981" },
                      { name: "Royal Indigo", hex: "#6366f1" },
                      { name: "Coral Rose", hex: "#f43f5e" },
                      { name: "Electric Purple", hex: "#a855f7" },
                      { name: "Ocean Cyan", hex: "#06b6d4" },
                      { name: "Sunset Orange", hex: "#f97316" },
                      { name: "Golden Yellow", hex: "#eab308" },
                    ].map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() =>
                          setPortfolio((prev) => ({
                            ...prev,
                            personal: { ...prev.personal, aboutHighlightColor: preset.hex },
                          }))
                        }
                        className={`px-2.5 py-1.5 rounded-xl font-mono text-[10px] font-bold border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                          (portfolio.personal.aboutHighlightColor || "#f59e0b").toLowerCase() === preset.hex.toLowerCase()
                            ? "border-black bg-stone-900 text-white shadow-xs font-black"
                            : "border-stone-300 bg-white text-stone-700 hover:border-black"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Text Sample Preview */}
                <div className="p-3.5 rounded-xl bg-white border border-amber-200/90 shadow-2xs">
                  <span className="font-mono text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Live Sample Preview:
                  </span>
                  <p className="font-['Space_Grotesk'] text-sm text-stone-800 font-semibold leading-relaxed">
                    Undergraduate in AI &amp; Data Science at{" "}
                    <span
                      style={{ color: portfolio.personal.aboutHighlightColor || "#f59e0b" }}
                      className="font-bold underline decoration-wavy underline-offset-4"
                    >
                      IIT Madras
                    </span>
                    , specializing in{" "}
                    <span
                      style={{ color: portfolio.personal.aboutHighlightColor || "#f59e0b" }}
                      className="font-bold"
                    >
                      Machine Learning
                    </span>{" "}
                    and{" "}
                    <span
                      style={{ color: portfolio.personal.aboutHighlightColor || "#f59e0b" }}
                      className="font-bold"
                    >
                      Scientific Computing
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* ── 3. QUICK STATS CAPSULES ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 text-sm">
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Quick Stats Capsules (4 Metrix Badges)
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      About page par show hone wale metric capsules ko add, edit, reorder, ya delete karein.
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

              {/* List of Quick Stat Capsules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(portfolio.quickStats || []).map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-300 hover:border-black transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <span className="font-mono text-xs font-black uppercase text-stone-500">
                        Capsule #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveQuickStat(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveQuickStat(idx, "down")}
                          disabled={idx === (portfolio.quickStats?.length || 0) - 1}
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuickStat(idx)}
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-red-600 hover:border-red-400 cursor-pointer ml-1"
                          title="Delete Capsule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Big Value (e.g. AI &amp; DS, 6+, 150+):
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleUpdateQuickStat(idx, "value", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-sm font-black text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] font-bold text-stone-700 mb-1">
                          Label (e.g. SPECIALIZATION):
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleUpdateQuickStat(idx, "label", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 font-mono text-xs font-bold text-stone-900 focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-[10px] font-bold text-stone-500 mb-1">
                        Sublabel (Optional context):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Machine Learning & Analytics"
                        value={stat.sublabel || ""}
                        onChange={(e) => handleUpdateQuickStat(idx, "sublabel", e.target.value)}
                        className="w-full px-3 py-1 rounded-lg bg-white border border-stone-200 font-mono text-xs text-stone-700 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Final Save Button for Highlights */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Highlights Changes"}</span>
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
                  <span>Technical Arsenal &amp; Skills ({portfolio.skills.length} Categories)</span>
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

        {/* ── TAB: ROADMAP & MILESTONES ── */}
        {activeTab === "milestones" && (
          <div className="space-y-8">
            {/* Header intro & Save CTA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-amber-500" />
                  <span>Development Trajectory ({(portfolio.milestones || []).length || 3} Phases)</span>
                </h2>
                <p className="font-mono text-xs text-stone-500 mt-1">
                  Sequential roadmap phases showcasing foundations, mathematical modeling, and AI system engineering.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3.5 py-2 rounded-xl bg-black text-white hover:bg-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:translate-y-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Trajectory Phase</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Milestones"}</span>
                </button>
              </div>
            </div>

            {/* Milestones Cards */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0_#000] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-sm">
                    🚀
                  </span>
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-lg font-black uppercase text-stone-900">
                      Development Trajectory (Roadmap Milestones)
                    </h3>
                    <p className="font-mono text-xs text-stone-500">
                      About page ke Trajectory phases ko edit, add ya remove karein.
                    </p>
                  </div>
                </div>
              </div>

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
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMilestone(mIdx, "down")}
                          disabled={mIdx === arr.length - 1}
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-black disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(mIdx)}
                          className="p-1 rounded bg-white border border-stone-300 text-stone-600 hover:text-red-600 hover:border-red-400 cursor-pointer ml-1"
                          title="Delete Phase"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
                        className="w-full p-2.5 rounded-xl bg-white border border-stone-300 font-mono text-xs text-stone-800 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Final Save Button for Milestones */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0_#000] cursor-pointer flex items-center gap-2 active:translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Save Milestones Changes"}</span>
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
                  Projects Catalog ({portfolio.projects.length})
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
                {projectCats.map((cat) => (
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
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.projects.map((proj) => (
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
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold hover:underline">
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-stone-400 text-[11px]">No Live Demo</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: CERTIFICATES MANAGER ── */}
        {activeTab === "certificates" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900">
                  Certificates &amp; Credentials ({portfolio.certificates.length})
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
                {certCats.map((cat) => (
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
                ))}
              </div>
            </div>

            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.certificates.map((cert) => (
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
          </div>
        )}

        {/* ── TAB: INQUIRIES & CONTACT ── */}
        {activeTab === "contact" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-['Space_Grotesk'] text-2xl font-black uppercase text-stone-900 flex items-center gap-2">
                  <Send className="w-6 h-6 text-amber-500" />
                  <span>Contact Inquiries ({messages.length})</span>
                </h2>
                <p className="font-mono text-xs text-stone-500">Messages sent via your portfolio contact form</p>
              </div>

              <button
                type="button"
                onClick={fetchMessages}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 hover:border-black bg-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {isLoadingMessages ? (
              <div className="py-12 text-center text-stone-500 font-mono text-xs">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="py-12 text-center text-stone-500 font-mono text-xs bg-stone-50 rounded-2xl border border-stone-200">
                No inquiries received yet. Test by submitting the contact form on your portfolio!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900">{msg.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold uppercase">
                          {msg.category}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-stone-400">
                        {new Date(msg.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <a href={`mailto:${msg.email}`} className="font-mono text-xs text-indigo-600 hover:underline block font-bold">
                      {msg.email}
                    </a>

                    <p className="font-mono text-xs text-stone-700 bg-white border border-stone-200 p-3 rounded-xl whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

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
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                Save Project
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
                      placeholder="e.g. Extra Caricullam, Hackathons"
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
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                Save Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
