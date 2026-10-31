"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Eye,
  EyeOff,
  User,
  Layout,
  Award,
  FolderGit2,
  Mail,
  MessageSquare,
  LogOut,
  Check,
  RefreshCw,
  Trash2,
  Plus,
  Edit,
  ExternalLink,
  Save,
  AlertCircle,
  Sparkles,
  Layers,
  GraduationCap,
  Sliders,
  Send,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project, Certificate, PortfolioData } from "@/data/portfolioData";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const { data: initialData, updateData, resetData } = usePortfolio();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS Form State
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = useState<"cover" | "about" | "projects" | "certificates" | "contact">("cover");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

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
    category: "Machine Learning",
    skillsLearned: [],
    description: "",
  });
  const [skillInput, setSkillInput] = useState("");

  // 1. Check Auth Status on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        const json = await res.json();
        setIsAuthenticated(Boolean(json.authenticated));
      } catch (err) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Update local portfolio state when initialData arrives
  useEffect(() => {
    if (initialData && initialData.personal) {
      setPortfolio(initialData);
    }
  }, [initialData]);

  // Fetch Messages when Contact Tab is opened
  useEffect(() => {
    if (activeTab === "contact" && isAuthenticated) {
      fetchMessages();
    }
  }, [activeTab, isAuthenticated]);

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch("/api/contact", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.messages)) {
        setMessages(json.messages);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  // Login Handler
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

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(json.error || "Invalid username or password");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (err) {}
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  // Save All Changes to Server & Context
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const success = await updateData(portfolio);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError("Failed to save changes. Make sure server is reachable.");
      }
    } catch (err) {
      setSaveError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Defaults
  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all portfolio data back to default values?")) return;
    setIsSaving(true);
    try {
      const ok = await resetData();
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Project Actions
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      id: "project_" + Date.now(),
      title: "",
      tagline: "",
      description: "",
      category: "Machine Learning",
      technologies: ["Python", "Machine Learning"],
      metrics: ["High Accuracy", "End-to-End Pipeline"],
      features: [],
      githubUrl: "https://github.com/harsharyann",
      liveUrl: "",
      imageGradient: "from-indigo-500 to-purple-600",
    });
    setTechInput("");
    setMetricInput("");
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (p: Project) => {
    setEditingProject(p);
    setProjectForm({ ...p });
    setTechInput("");
    setMetricInput("");
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectForm.title.trim()) {
      alert("Please provide a project title");
      return;
    }

    if (editingProject) {
      // Update existing
      setPortfolio((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === editingProject.id ? projectForm : p)),
      }));
    } else {
      // Add new
      setPortfolio((prev) => ({
        ...prev,
        projects: [projectForm, ...prev.projects],
      }));
    }
    setIsProjectModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setPortfolio((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Certificate Actions
  const openNewCertModal = () => {
    setEditingCert(null);
    setCertForm({
      id: "cert_" + Date.now(),
      title: "",
      issuer: "",
      issueDate: new Date().getFullYear().toString(),
      credentialId: "",
      credentialUrl: "",
      category: "Machine Learning",
      skillsLearned: ["Python", "Algorithms"],
      description: "",
    });
    setSkillInput("");
    setIsCertModalOpen(true);
  };

  const openEditCertModal = (c: Certificate) => {
    setEditingCert(c);
    setCertForm({ ...c });
    setSkillInput("");
    setIsCertModalOpen(true);
  };

  const handleSaveCert = () => {
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      alert("Please provide certificate title and issuer");
      return;
    }

    if (editingCert) {
      setPortfolio((prev) => ({
        ...prev,
        certificates: prev.certificates.map((c) => (c.id === editingCert.id ? certForm : c)),
      }));
    } else {
      setPortfolio((prev) => ({
        ...prev,
        certificates: [certForm, ...prev.certificates],
      }));
    }
    setIsCertModalOpen(false);
  };

  const handleDeleteCert = (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    setPortfolio((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id),
    }));
  };

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-white font-mono">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs tracking-widest uppercase text-stone-400">Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  // ─── LOCKED ACCESS SCREEN ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-stone-950 via-zinc-900 to-black text-white selection:bg-amber-400 selection:text-black">
        <div className="w-full max-w-md p-8 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          {/* Lock Header */}
          <div className="relative text-center mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-amber-200/10 border border-amber-400/40 text-amber-400 mb-4 shadow-[0_0_25px_rgba(251,191,36,0.25)]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-white">
              PORTFOLIO ADMIN
            </h1>
            <p className="font-mono text-xs text-stone-400 mt-1 uppercase tracking-widest">
              Restricted Area &bull; Credentials Required
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-stone-300 mb-1.5">
                Username:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or harsh"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-600 font-mono text-xs focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all"
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-stone-500" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-black uppercase tracking-wider text-stone-300 mb-1.5">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/20 text-white placeholder-stone-600 font-mono text-xs focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-white"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-mono text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Unlocking...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Default: admin / harsh@2026</span>
            </span>
            <Link href="/" className="hover:text-amber-400 transition-colors">
              &larr; Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── AUTHENTICATED ADMIN DASHBOARD ───
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans pb-20 selection:bg-amber-400 selection:text-black">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 w-full bg-black/85 backdrop-blur-xl border-b border-white/15 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-black font-mono font-black text-xs shadow-sm">
            HA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black uppercase tracking-wider text-white">
                Admin Control Center
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Session
              </span>
            </div>
            <p className="font-mono text-[10px] text-stone-400">Harsh Aryan &bull; Portfolio Management</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-stone-300 hover:text-white font-mono text-xs font-bold transition-all"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs font-bold transition-all cursor-pointer"
            title="Reset data back to portfolioData defaults"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1.5"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save All Changes</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 transition-all cursor-pointer"
            title="Lock Console &amp; Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save Notification Toasts */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>✓ All Changes Successfully Saved &amp; Live!</span>
        </div>
      )}

      {saveError && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-red-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-white/10 font-mono text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("cover")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "cover"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] font-black"
                : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>1. Cover Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "about"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] font-black"
                : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>2. About Page</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] font-black"
                : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>3. Projects ({portfolio.projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "certificates"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] font-black"
                : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Certificates ({portfolio.certificates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] font-black"
                : "bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>5. Contact &amp; Messages ({messages.length})</span>
          </button>
        </div>

        {/* ── TAB 1: COVER PAGE EDITOR ── */}
        {activeTab === "cover" && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                <span>Cover Screen Identity &amp; Roles</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Display Name:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.name}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, name: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Primary Role (Displayed below Name):
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.role}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, role: e.target.value },
                      }))
                    }
                    placeholder="Teaching Assistant • IIT Madras"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Specialization Headline / Tagline:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.headline}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, headline: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Availability Status (Cover Pill):
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.availability}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, availability: e.target.value },
                      }))
                    }
                    placeholder="Seeking Summer 2026 Early Internships"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Location:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.location}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, location: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Editor */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Cover Social Links &amp; Profiles</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    GitHub URL:
                  </label>
                  <input
                    type="text"
                    value={portfolio.socialLinks.github}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, github: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    LinkedIn URL:
                  </label>
                  <input
                    type="text"
                    value={portfolio.socialLinks.linkedin}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        socialLinks: { ...prev.socialLinks, linkedin: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Contact Email:
                  </label>
                  <input
                    type="email"
                    value={portfolio.personal.email}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                        socialLinks: { ...prev.socialLinks, email: `mailto:${e.target.value}` },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Resume PDF Path / URL:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.resumeUrl}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, resumeUrl: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ABOUT PAGE EDITOR ── */}
        {activeTab === "about" && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Biography &amp; Academic Background</span>
              </h2>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                  Full Bio Paragraph:
                </label>
                <textarea
                  rows={4}
                  value={portfolio.personal.bio}
                  onChange={(e) =>
                    setPortfolio((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, bio: e.target.value },
                    }))
                  }
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    University / College:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.college}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, college: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Degree &amp; Branch:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.degree}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, degree: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Status / Year:
                  </label>
                  <input
                    type="text"
                    value={portfolio.personal.year}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, year: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Metrics Editor */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <span>Quick Stats Metrics (About Page Numbers)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.quickStats.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-stone-400 font-bold">
                      Metric #{i + 1}
                    </label>
                    <input
                      type="text"
                      value={st.value}
                      placeholder="Value (e.g. 6+)"
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio((prev) => ({
                          ...prev,
                          quickStats: prev.quickStats.map((s, idx) => (idx === i ? { ...s, value: val } : s)),
                        }));
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white font-mono font-black text-sm"
                    />
                    <input
                      type="text"
                      value={st.label}
                      placeholder="Label"
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio((prev) => ({
                          ...prev,
                          quickStats: prev.quickStats.map((s, idx) => (idx === i ? { ...s, label: val } : s)),
                        }));
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-stone-200 font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={st.sublabel}
                      placeholder="Sublabel"
                      onChange={(e) => {
                        const val = e.target.value;
                        setPortfolio((prev) => ({
                          ...prev,
                          quickStats: prev.quickStats.map((s, idx) => (idx === i ? { ...s, sublabel: val } : s)),
                        }));
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/15 text-stone-400 font-mono text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: PROJECTS MANAGER ── */}
        {activeTab === "projects" && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-lg font-black uppercase text-amber-400">
                  Projects Catalog ({portfolio.projects.length})
                </h2>
                <p className="font-mono text-xs text-stone-400">Add, edit, or remove featured projects</p>
              </div>

              <button
                type="button"
                onClick={openNewProjectModal}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add New Project</span>
              </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-stone-900/80 border border-white/15 flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-mono text-[10px] font-bold uppercase">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditProjectModal(proj)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-stone-300 hover:text-white"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-mono font-black text-sm text-white line-clamp-1">{proj.title}</h3>
                    <p className="font-mono text-xs text-stone-400 line-clamp-2">{proj.tagline}</p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-stone-300 font-mono text-[9px]">
                          {t}
                        </span>
                      ))}
                      {proj.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-stone-500 font-mono text-[9px]">
                          +{proj.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" className="text-stone-400 hover:text-amber-400 flex items-center gap-1">
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: CERTIFICATES MANAGER ── */}
        {activeTab === "certificates" && (
          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-mono text-lg font-black uppercase text-amber-400">
                  Certificates &amp; Credentials ({portfolio.certificates.length})
                </h2>
                <p className="font-mono text-xs text-stone-400">Manage verified courses and certificates</p>
              </div>

              <button
                type="button"
                onClick={openNewCertModal}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Certificate</span>
              </button>
            </div>

            {/* Certificates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-stone-900/80 border border-white/15 flex flex-col justify-between space-y-3 hover:border-amber-400/50 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold uppercase">
                        {cert.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCertModal(cert)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/20 text-stone-300 hover:text-white"
                          title="Edit Certificate"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCert(cert.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-mono font-black text-sm text-white">{cert.title}</h3>
                    <p className="font-mono text-xs text-stone-400">
                      {cert.issuer} &bull; <span className="text-amber-400">{cert.issueDate}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skillsLearned.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-stone-300 font-mono text-[9px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-2 border-t border-white/10">
                      <a href={cert.credentialUrl} target="_blank" className="text-amber-400 hover:underline font-mono text-xs flex items-center gap-1">
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: CONTACT & MESSAGES INBOX ── */}
        {activeTab === "contact" && (
          <div className="pt-6 space-y-6">
            {/* Contact Settings */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Contact Desk Settings</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Primary Inbox Email:
                  </label>
                  <input
                    type="email"
                    value={portfolio.personal.email}
                    onChange={(e) =>
                      setPortfolio((prev) => ({
                        ...prev,
                        personal: { ...prev.personal, email: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-300 mb-1">
                    Response Expectation Note:
                  </label>
                  <input
                    type="text"
                    defaultValue="Typically replies within 24-48 hours"
                    placeholder="e.g. Replies within 24-48 hours"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Visitor Inbound Messages */}
            <div className="p-6 rounded-2xl bg-stone-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-lg font-black uppercase text-amber-400 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Inbound Visitor Messages ({messages.length})</span>
                  </h2>
                  <p className="font-mono text-xs text-stone-400">Messages submitted through the contact page form</p>
                </div>

                <button
                  type="button"
                  onClick={fetchMessages}
                  disabled={isLoadingMessages}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-xl">
                  <Mail className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                  <p className="font-mono text-sm text-stone-400">No incoming messages yet.</p>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    When visitors submit the contact form, their messages will securely appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 hover:border-amber-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-white">{msg.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px]">
                            {msg.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-500">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1 text-stone-500 hover:text-red-400"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <a href={`mailto:${msg.email}`} className="font-mono text-xs text-indigo-400 hover:underline block">
                        {msg.email}
                      </a>

                      <p className="font-mono text-xs text-stone-300 bg-black/40 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── PROJECT MODAL (ADD / EDIT) ── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-stone-900 border border-white/20 shadow-2xl space-y-4">
            <h3 className="font-mono text-lg font-black uppercase text-amber-400">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Project Title:</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Student Exam Performance EDA & Predictor"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Tagline:</label>
                <input
                  type="text"
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                  placeholder="Short one-line pitch"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Category:</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Web &amp; AI Tools">Web &amp; AI Tools</option>
                    <option value="Python Basics">Python Basics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">GitHub Repo URL:</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Technologies (Comma separated):</label>
                <input
                  type="text"
                  value={techInput || projectForm.technologies.join(", ")}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, technologies: list });
                  }}
                  placeholder="Python, Pandas, NumPy, Scikit-Learn"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Key Metrics (Comma separated):</label>
                <input
                  type="text"
                  value={metricInput || projectForm.metrics.join(", ")}
                  onChange={(e) => {
                    setMetricInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, metrics: list });
                  }}
                  placeholder="92% Accuracy, 1,000+ Records Analyzed"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE MODAL (ADD / EDIT) ── */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-stone-900 border border-white/20 shadow-2xl space-y-4">
            <h3 className="font-mono text-lg font-black uppercase text-amber-400">
              {editingCert ? "Edit Certificate" : "Add New Certificate"}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Certificate Title:</label>
                <input
                  type="text"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Python for Data Science & AI"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Issuer / Academy:</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="IBM / Coursera / DeepLearning.AI"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Issue Date / Year:</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="2025 or Oct 2025"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Category:</label>
                  <select
                    value={certForm.category}
                    onChange={(e) =>
                      setCertForm({
                        ...certForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Programming">Programming</option>
                    <option value="Mathematics & Hackathons">Mathematics &amp; Hackathons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1">Credential URL:</label>
                  <input
                    type="text"
                    value={certForm.credentialUrl || ""}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="https://coursera.org/verify/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Skills Learned (Comma separated):</label>
                <input
                  type="text"
                  value={skillInput || certForm.skillsLearned.join(", ")}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setCertForm({ ...certForm, skillsLearned: list });
                  }}
                  placeholder="Python, Linear Regression, Pandas"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/50 border border-white/20 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCert}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase"
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
