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

  // Enforce Light Theme strictly on Admin Console
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

  // Keep state synced with portfolio data
  useEffect(() => {
    setPortfolio(initialData);
  }, [initialData]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const json = await res.json();
        setIsAuthenticated(json.authenticated);
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

  // Handle Save All
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const success = await updateData(portfolio);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setSaveError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset to Defaults
  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all portfolio data back to defaults? All custom edits will be reverted."
      )
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const ok = await resetData();
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to reset data");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete message");
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
      setPortfolio((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p.id === editingProject.id ? projectForm : p)),
      }));
    } else {
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
    if (!certForm.title.trim()) {
      alert("Please provide a certificate title");
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

  // ─── LOADING STATE (Clean Light Canvas) ───
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 font-mono">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs tracking-widest uppercase text-stone-500 font-bold">
            Verifying Security Credentials...
          </p>
        </div>
      </div>
    );
  }

  // ─── LOCKED ACCESS SCREEN (Clean Light Theme with Sketchbook Shadows) ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-stone-50 via-amber-50/40 to-stone-100 text-stone-900 selection:bg-amber-400 selection:text-black font-sans">
        <div className="w-full max-w-md p-8 rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0_#000] relative overflow-hidden">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          {/* Lock Header */}
          <div className="relative text-center mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-400 border-2 border-black text-black mb-4 shadow-[3px_3px_0_#000]">
              <Lock className="w-8 h-8 stroke-[2.4]" />
            </div>
            <h1 className="font-mono text-2xl font-black uppercase tracking-tight text-stone-900">
              PORTFOLIO ADMIN
            </h1>
            <p className="font-mono text-xs text-stone-500 mt-1 uppercase tracking-widest font-bold">
              Restricted Area &bull; Credentials Required
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
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
                  placeholder="admin or harsh"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border-2 border-stone-300 text-stone-900 placeholder-stone-400 font-mono text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border-2 border-stone-300 text-stone-900 placeholder-stone-400 font-mono text-xs focus:outline-none focus:border-black focus:bg-white transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
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
              className="w-full mt-2 py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3.5px_3.5px_0_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
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

          {/* Quick Help Hint */}
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

  // ─── AUTHENTICATED ADMIN DASHBOARD (Crisp Light Theme) ───
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-400 selection:text-black font-sans pb-16">
      {/* ── Top Bar Header ── */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xl border-b-2 border-black/10 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400 text-black font-mono font-black text-xs border border-black shadow-sm">
            HA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black uppercase tracking-wider text-stone-900">
                Admin Control Center
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[9px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </span>
            </div>
            <p className="font-mono text-[10px] text-stone-500">Harsh Aryan &bull; Portfolio Management</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-xs font-bold transition-all"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-xs font-bold transition-all cursor-pointer"
            title="Reset data back to portfolioData defaults"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2.5px_2.5px_0_#000] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save All Changes</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-300 text-red-600 transition-all cursor-pointer"
            title="Lock Console &amp; Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save Notification Toasts */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(16,185,129,0.35)] flex items-center gap-2 border-2 border-black animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>✓ All Changes Successfully Saved &amp; Live!</span>
        </div>
      )}

      {saveError && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-red-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 border-2 border-black">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-6 border-b-2 border-stone-200 font-mono text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setActiveTab("cover")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "cover"
                ? "bg-black text-white border-2 border-black shadow-[2.5px_2.5px_0_#555] font-black"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
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
                ? "bg-black text-white border-2 border-black shadow-[2.5px_2.5px_0_#555] font-black"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
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
                ? "bg-black text-white border-2 border-black shadow-[2.5px_2.5px_0_#555] font-black"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
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
                ? "bg-black text-white border-2 border-black shadow-[2.5px_2.5px_0_#555] font-black"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
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
                ? "bg-black text-white border-2 border-black shadow-[2.5px_2.5px_0_#555] font-black"
                : "bg-white hover:bg-stone-100 text-stone-700 border border-stone-300"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>5. Contact &amp; Messages ({messages.length})</span>
          </button>
        </div>

        {/* ── TAB 1: COVER PAGE EDITOR ── */}
        {activeTab === "cover" && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-600 flex items-center gap-2">
                <Layout className="w-5 h-5" />
                <span>Cover Screen Identity &amp; Roles</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Editor */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-600 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Cover Social Links &amp; Profiles</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ABOUT PAGE EDITOR ── */}
        {activeTab === "about" && (
          <div className="pt-6 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-600 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Biography &amp; Academic Background</span>
              </h2>

              <div>
                <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Metrics Editor */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-600 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                <span>Quick Stats Metrics (About Page Numbers)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.quickStats.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <label className="block font-mono text-[10px] uppercase text-stone-500 font-bold">
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
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-900 font-mono font-black text-sm focus:border-amber-500 focus:outline-none"
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
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-800 font-mono text-xs focus:border-amber-500 focus:outline-none"
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
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-600 font-mono text-[11px] focus:border-amber-500 focus:outline-none"
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
                <h2 className="font-mono text-lg font-black uppercase text-stone-900">
                  Projects Catalog ({portfolio.projects.length})
                </h2>
                <p className="font-mono text-xs text-stone-500">Add, edit, or remove featured projects</p>
              </div>

              <button
                type="button"
                onClick={openNewProjectModal}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
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
                  className="p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-black flex flex-col justify-between space-y-4 shadow-sm hover:shadow-[3px_3px_0_#000] transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono text-[10px] font-bold uppercase">
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

                    <h3 className="font-mono font-black text-sm text-stone-900 line-clamp-1">{proj.title}</h3>
                    <p className="font-mono text-xs text-stone-600 line-clamp-2">{proj.tagline}</p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[9px] border border-stone-200">
                          {t}
                        </span>
                      ))}
                      {proj.technologies.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 font-mono text-[9px]">
                          +{proj.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between font-mono text-xs">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" className="text-stone-600 hover:text-amber-600 flex items-center gap-1 font-bold">
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold">
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
                <h2 className="font-mono text-lg font-black uppercase text-stone-900">
                  Certificates &amp; Credentials ({portfolio.certificates.length})
                </h2>
                <p className="font-mono text-xs text-stone-500">Manage verified courses and certificates</p>
              </div>

              <button
                type="button"
                onClick={openNewCertModal}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] transition-all cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5"
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
                  className="p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-black flex flex-col justify-between space-y-3 shadow-sm hover:shadow-[3px_3px_0_#000] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                        {cert.category}
                      </span>
                      <div className="flex items-center gap-1">
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

                    <h3 className="font-mono font-black text-sm text-stone-900">{cert.title}</h3>
                    <p className="font-mono text-xs text-stone-600">
                      {cert.issuer} &bull; <span className="text-amber-600 font-bold">{cert.issueDate}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {cert.skillsLearned.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[9px] border border-stone-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {cert.credentialUrl && (
                    <div className="pt-2 border-t border-stone-200">
                      <a href={cert.credentialUrl} target="_blank" className="text-amber-600 hover:underline font-mono text-xs flex items-center gap-1 font-bold">
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
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-mono text-lg font-black uppercase text-amber-600 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>Contact Desk Settings</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-stone-700 mb-1">
                    Response Expectation Note:
                  </label>
                  <input
                    type="text"
                    defaultValue="Typically replies within 24-48 hours"
                    placeholder="e.g. Replies within 24-48 hours"
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono text-xs focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Visitor Inbound Messages */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-mono text-lg font-black uppercase text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <span>Inbound Visitor Messages ({messages.length})</span>
                  </h2>
                  <p className="font-mono text-xs text-stone-500">Messages submitted through the contact page form</p>
                </div>

                <button
                  type="button"
                  onClick={fetchMessages}
                  disabled={isLoadingMessages}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-stone-300 rounded-xl bg-stone-50">
                  <Mail className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="font-mono text-sm text-stone-700 font-bold">No incoming messages yet.</p>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    When visitors submit the contact form, their messages will securely appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-xl bg-white border-2 border-stone-200 shadow-sm space-y-2 hover:border-amber-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-stone-900">{msg.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold">
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
                            className="p-1 text-stone-400 hover:text-red-600 cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <a href={`mailto:${msg.email}`} className="font-mono text-xs text-indigo-600 hover:underline block font-bold">
                        {msg.email}
                      </a>

                      <p className="font-mono text-xs text-stone-700 bg-stone-50 border border-stone-200 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white border-2 border-black shadow-[8px_8px_0_#000] space-y-4 text-stone-900">
            <h3 className="font-mono text-lg font-black uppercase text-stone-900">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Project Title:</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. Student Exam Performance EDA & Predictor"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Tagline:</label>
                <input
                  type="text"
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                  placeholder="Short one-line pitch"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category:</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Web &amp; AI Tools">Web &amp; AI Tools</option>
                    <option value="Python Basics">Python Basics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">GitHub Repo URL:</label>
                  <input
                    type="text"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Technologies (Comma separated):</label>
                <input
                  type="text"
                  value={techInput || projectForm.technologies.join(", ")}
                  onChange={(e) => {
                    setTechInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, technologies: list });
                  }}
                  placeholder="Python, Pandas, NumPy, Scikit-Learn"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Key Metrics (Comma separated):</label>
                <input
                  type="text"
                  value={metricInput || projectForm.metrics.join(", ")}
                  onChange={(e) => {
                    setMetricInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setProjectForm({ ...projectForm, metrics: list });
                  }}
                  placeholder="92% Accuracy, 1,000+ Records Analyzed"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsProjectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProject}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE MODAL (ADD / EDIT) ── */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-white border-2 border-black shadow-[8px_8px_0_#000] space-y-4 text-stone-900">
            <h3 className="font-mono text-lg font-black uppercase text-stone-900">
              {editingCert ? "Edit Certificate" : "Add New Certificate"}
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Certificate Title:</label>
                <input
                  type="text"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  placeholder="e.g. Python for Data Science & AI"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Issuer / Academy:</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="IBM / Coursera / DeepLearning.AI"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Issue Date / Year:</label>
                  <input
                    type="text"
                    value={certForm.issueDate}
                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                    placeholder="2025 or Oct 2025"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category:</label>
                  <select
                    value={certForm.category}
                    onChange={(e) =>
                      setCertForm({
                        ...certForm,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  >
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Programming">Programming</option>
                    <option value="Mathematics & Hackathons">Mathematics &amp; Hackathons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Credential URL:</label>
                  <input
                    type="text"
                    value={certForm.credentialUrl || ""}
                    onChange={(e) => setCertForm({ ...certForm, credentialUrl: e.target.value })}
                    placeholder="https://coursera.org/verify/..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Skills Learned (Comma separated):</label>
                <input
                  type="text"
                  value={skillInput || certForm.skillsLearned.join(", ")}
                  onChange={(e) => {
                    setSkillInput(e.target.value);
                    const list = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    setCertForm({ ...certForm, skillsLearned: list });
                  }}
                  placeholder="Python, Linear Regression, Pandas"
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={certForm.description}
                  onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:border-black focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 font-mono text-xs">
              <button
                type="button"
                onClick={() => setIsCertModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCert}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer"
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
