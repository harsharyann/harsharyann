"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import {
  ArrowLeft,
  Check,
  RotateCcw,
  ExternalLink,
  Eye,
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

  // Handle URL change
  const handleMediaUrlChange = (url: string) => {
    const isVideo = /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
    setFormData((prev) => ({
      ...prev,
      coverMediaUrl: url,
      coverImage: url,
      coverMediaType: isVideo ? "video" : "image",
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all settings back to default?")) {
      resetSettings();
      setFormData(settings);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1015] text-[#f5f3ef] font-sans py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-[#e5c07b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Portfolio</span>
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* 1. Header Card (Google Forms Style) */}
        <div className="bg-[#161820] rounded-xl border border-white/10 overflow-hidden shadow-xl">
          <div className="h-3 bg-gradient-to-r from-[#e5c07b] via-[#f3d99b] to-[#d4af37]" />
          <div className="p-6 sm:p-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-wide">
              Portfolio Settings Form
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
              Fill out the details below to update your live cover photo, name, role at IIT Madras, and visible elements. Changes save directly to your portfolio.
            </p>
          </div>
        </div>

        {/* 2. Main Form Fields (Clean GForm Question Cards) */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Question 1: Cover Image URL */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-3 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Cover Photo / Media Link <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-stone-400">
              Paste direct image or video link (ImageKit, Unsplash, GitHub asset, etc.)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={formData.coverMediaUrl || formData.coverImage || ""}
                onChange={(e) => handleMediaUrlChange(e.target.value)}
                placeholder="https://ik.imagekit.io/... or https://example.com/photo.jpg"
                className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-xs font-mono text-white placeholder-stone-600 transition-colors"
              />
              {formData.coverMediaUrl && (
                <a
                  href={formData.coverMediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open image preview"
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Quick Preview Thumbnail */}
            {formData.coverMediaUrl && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-stone-400 font-mono">Current Preview:</span>
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/15 bg-black/50 shrink-0">
                  <img
                    src={formData.coverMediaUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Question 2: Full Name */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-2 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Full Name <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-stone-400">
              Displays as the main masthead title on your magazine cover.
            </p>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="HARSH ARYAN"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-sm text-white font-medium placeholder-stone-600 transition-colors"
            />
          </div>

          {/* Question 3: Current Role / Title */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-2 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Current Role / Designation <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-stone-400">
              Your primary title (e.g. Teaching Assistant @ IIT Madras).
            </p>
            <input
              type="text"
              required
              value={formData.role || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              placeholder="Teaching Assistant @ IIT Madras"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
            />
          </div>

          {/* Question 4: Department / Academic Focus */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-2 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Academic Department / Program
            </label>
            <p className="text-xs text-stone-400">
              Specialization or coursework details.
            </p>
            <input
              type="text"
              value={formData.whereAndWhat || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, whereAndWhat: e.target.value }))
              }
              placeholder="Data Science & Applications"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
            />
          </div>

          {/* Question 5: Location */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-2 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Location
            </label>
            <p className="text-xs text-stone-400">
              City, Country where you are based.
            </p>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="Chennai, India"
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-sm text-white placeholder-stone-600 transition-colors"
            />
          </div>

          {/* Question 6: Personal Statement Quote */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-2 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Personal Statement / Quote
            </label>
            <p className="text-xs text-stone-400">
              Featured italic quote on your magazine cover story.
            </p>
            <textarea
              rows={2}
              value={formData.statement || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, statement: e.target.value }))
              }
              placeholder="Crafting interfaces at the intersection of modern design and artificial intelligence."
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/15 focus:border-[#e5c07b] focus:outline-none text-sm font-editorial italic text-white placeholder-stone-600 transition-colors"
            />
          </div>

          {/* Question 7: Visible Elements on Cover (Simple Checkboxes) */}
          <div className="bg-[#161820] rounded-xl border border-white/10 p-5 sm:p-6 space-y-3 shadow-sm hover:border-white/20 transition-all">
            <label className="block text-sm font-semibold text-white">
              Elements Visibility Checkbox
            </label>
            <p className="text-xs text-stone-400 mb-3">
              Uncheck any field if you wish to temporarily hide it from the cover page:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showName !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, showName: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Full Name</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showRole !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, showRole: e.target.checked }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Current Role</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showLocation !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showLocation: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Location</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showWhereAndWhat !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showWhereAndWhat: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Academic Focus</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showStatement !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showStatement: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Statement Quote</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-white/10 cursor-pointer hover:bg-black/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.showSocialLinks !== false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showSocialLinks: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#e5c07b] rounded cursor-pointer"
                />
                <span className="text-xs text-stone-200">Show Social Icons</span>
              </label>
            </div>
          </div>

          {/* Submit Action Card (Google Forms Submit Button) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-[#e5c07b] hover:bg-[#d4af37] text-stone-950 font-mono text-xs uppercase tracking-wider font-bold shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <span>Saving to Portfolio...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Submit / Save Changes</span>
                </>
              )}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-400 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4 text-[#e5c07b]" />
              <span>Preview Live Portfolio ↗</span>
            </Link>
          </div>
        </form>

        {/* Success Toast */}
        {savedToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-lg bg-emerald-500 text-stone-950 font-mono text-xs font-bold uppercase tracking-wider shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Saved successfully! Changes are live on your portfolio.</span>
          </div>
        )}
      </div>
    </div>
  );
}
