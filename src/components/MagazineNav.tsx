"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, Home, User, FolderGit2, Award, Mail } from "lucide-react";

interface NavSection {
  name: string;
  id: string;
  path: string;
  chapter: string;
  badge: string;
  shortLabel: string;
  accentHex: string;
  icon: (active: boolean) => React.ReactNode;
}

export function MagazineNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("cover");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll Spy for Single Page Architecture (Throttled with requestAnimationFrame)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const pastCover = y > 120;
        setIsScrolled((prev) => (prev !== pastCover ? pastCover : prev));

        if (y < 120) {
          setActiveSection((prev) => (prev !== "cover" ? "cover" : prev));
          ticking = false;
          return;
        }

        const sectionIds = ["contact", "certificates", "projects", "about"];
        const midTop = window.innerHeight * 0.45;
        const midBottom = window.innerHeight * 0.15;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= midTop && rect.bottom >= midBottom) {
              setActiveSection((prev) => (prev !== id ? id : prev));
              ticking = false;
              return;
            }
          }
        }
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hidden on admin route
  if (pathname === "/admin") {
    return null;
  }

  const sections: NavSection[] = [
    {
      name: "About",
      id: "about",
      path: "/#about",
      chapter: "02",
      badge: "Bio",
      shortLabel: "About",
      accentHex: "#f59e0b",
      icon: (active) => (
        <User className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
      ),
    },
    {
      name: "Projects",
      id: "projects",
      path: "/#projects",
      chapter: "03",
      badge: "Work",
      shortLabel: "Projects",
      accentHex: "#6366f1",
      icon: (active) => (
        <FolderGit2 className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
      ),
    },
    {
      name: "Certificates",
      id: "certificates",
      path: "/#certificates",
      chapter: "04",
      badge: "Awards",
      shortLabel: "Certs",
      accentHex: "#10b981",
      icon: (active) => (
        <Award className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
      ),
    },
    {
      name: "Contact",
      id: "contact",
      path: "/#contact",
      chapter: "05",
      badge: "Say Hi",
      shortLabel: "Contact",
      accentHex: "#f43f5e",
      icon: (active) => (
        <Mail className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
      ),
    },
  ];

  const handleNavClick = (targetId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    if (targetId === "cover") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("cover");
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState(null, "", "/");
      }
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(targetId);
      if (typeof window !== "undefined" && window.history) {
        window.history.pushState(null, "", `/#${targetId}`);
      }
    } else {
      window.location.href = `/#${targetId}`;
    }
  };

  const activePage = sections.find((s) => s.id === activeSection);
  const showMobileDock = isScrolled || activeSection !== "cover";

  return (
    <>
      {/* ── DESKTOP BOTTOM-RIGHT FLOATING MENU BUTTON ── */}
      <div
        ref={dropdownRef}
        className="hidden md:flex fixed bottom-6 right-6 lg:right-8 z-50 items-center gap-3 select-none"
      >
        {/* EXPANDABLE SKETCHBOOK DIRECTORY POPUP */}
        {isOpen && (
          <div
            className="absolute right-0 bottom-full mb-3 w-80 bg-white/75 dark:bg-stone-900/75 backdrop-blur-2xl border-2 border-black dark:border-white shadow-[6px_6px_0_#000,inset_0_1px_1.5px_0_rgba(255,255,255,0.7)] dark:shadow-[6px_6px_0_#fff,inset_0_1px_1.5px_0_rgba(255,255,255,0.18)] rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150 select-none"
            role="dialog"
            aria-label="Site Navigation Directory"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black/10 dark:border-white/10 font-mono text-[11px] font-black uppercase text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <span className="text-amber-500">✦</span> EXPLORE INDEX
              </span>
              <span className="text-[10px] text-stone-400">[ESC TO CLOSE]</span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              {/* 01 Cover */}
              <button
                type="button"
                onClick={(e) => handleNavClick("cover", e)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all group font-mono text-xs font-bold cursor-pointer ${
                  activeSection === "cover"
                    ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2px_2px_0_#888]"
                    : "border-transparent hover:border-black dark:hover:border-white hover:bg-stone-100 dark:hover:bg-stone-800 text-black dark:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-extrabold w-5 ${activeSection === "cover" ? "text-amber-400 dark:text-amber-600" : "text-stone-400"}`}>
                    01
                  </span>
                  <Home className="w-4 h-4 text-stone-500 group-hover:text-amber-500 transition-colors" />
                  <span className="uppercase font-black">Cover Screen</span>
                </div>
                {activeSection === "cover" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 dark:text-amber-700 bg-stone-800 dark:bg-stone-200 px-2 py-0.5 rounded-full">
                    <span>✦</span> CURRENT
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-400 font-mono">↵ Top</span>
                )}
              </button>

              {/* Chapter Sections */}
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => handleNavClick(s.id, e)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all font-mono text-xs font-bold cursor-pointer ${
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-[2.5px_2.5px_0_#888]"
                        : "border-transparent hover:border-black dark:hover:border-white hover:bg-stone-100 dark:hover:bg-stone-800 text-black dark:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-extrabold w-5 ${isActive ? "text-amber-400 dark:text-amber-600" : "text-stone-400"}`}>
                        {s.chapter}
                      </span>
                      <span className="flex items-center justify-center">
                        {s.icon(isActive)}
                      </span>
                      <span className="uppercase font-black">{s.name}</span>
                    </div>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-amber-300 dark:text-amber-700 bg-stone-800 dark:bg-stone-200 px-2 py-0.5 rounded-full">
                        <span>✦</span> CURRENT
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-400 uppercase font-mono">
                        {s.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Admin Portal Shortcut */}
              <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10">
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all font-mono text-[11px] font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin CMS Console</span>
                  </span>
                  <span className="text-[9px] bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded">
                    Locked
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── THE MENU BUTTON ── */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative inline-flex items-center gap-2.5 font-mono text-xs font-black uppercase bg-white/75 dark:bg-stone-900/75 backdrop-blur-2xl text-black dark:text-white px-4 py-2.5 rounded-full border-2 border-black dark:border-white shadow-[3.5px_3.5px_0_#000,inset_0_1px_1.5px_0_rgba(255,255,255,0.7)] dark:shadow-[3.5px_3.5px_0_#fff,inset_0_1px_1.5px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all select-none cursor-pointer"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {/* Active Chapter Dot */}
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
            style={{ backgroundColor: activePage?.accentHex || "#f59e0b" }}
          />

          <span className="tracking-wide">
            {isOpen ? "CLOSE ✕" : `${activePage?.shortLabel || "HOME"} ☰`}
          </span>

          <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform" />
        </button>
      </div>

      {/* ── PHONE NAVIGATION: FLOATING BOTTOM DOCK ── */}
      <nav
        className={`md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[360px] backdrop-blur-2xl bg-white/75 dark:bg-stone-900/75 border-2 border-black dark:border-white rounded-full shadow-[4px_4px_0_#000,inset_0_1px_1.5px_0_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_0_#fff,inset_0_1px_1.5px_0_rgba(255,255,255,0.18)] p-1.5 flex items-center justify-between gap-1 select-none transition-all duration-300 ${
          showMobileDock ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        aria-label="Mobile Navigation Dock"
      >
        {/* Cover Link */}
        <button
          type="button"
          onClick={(e) => handleNavClick("cover", e)}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${
            activeSection === "cover"
              ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold scale-[1.03]"
              : "text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white"
          }`}
          title="Home Cover"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="text-[9px] font-mono tracking-tight font-black uppercase mt-0.5">
            Cover
          </span>
        </button>

        {/* Section Links */}
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={(e) => handleNavClick(s.id, e)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full transition-all duration-200 active:scale-90 cursor-pointer ${
                isActive
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold scale-[1.03]"
                  : "text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white"
              }`}
            >
              <span className="flex items-center justify-center">
                {s.icon(isActive)}
              </span>
              <span className="text-[9px] font-mono tracking-tight font-black uppercase mt-0.5">
                {s.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
