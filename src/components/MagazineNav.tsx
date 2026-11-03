"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Sparkles, Home, User, FolderCode, Code2, Folder, Terminal, Layers, Award, Mail } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

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

const NAV_ITEM_THEMES: Record<
  string,
  {
    active: string;
    inactive: string;
    iconColor: string;
    numBadge: string;
    tagBadge: string;
  }
> = {
  cover: {
    active:
      "bg-amber-300 text-black dark:bg-amber-400 dark:text-black border-black dark:border-amber-300 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f59e0b]",
    inactive:
      "border-transparent hover:border-black dark:hover:border-amber-400 hover:bg-amber-100/70 dark:hover:bg-amber-950/40 text-stone-900 dark:text-stone-100",
    iconColor: "text-amber-600 dark:text-amber-400",
    numBadge:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/70 dark:text-amber-300 dark:border-amber-700",
    tagBadge:
      "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-700",
  },
  about: {
    active:
      "bg-orange-300 text-black dark:bg-orange-400 dark:text-black border-black dark:border-orange-300 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f97316]",
    inactive:
      "border-transparent hover:border-black dark:hover:border-orange-400 hover:bg-orange-100/70 dark:hover:bg-orange-950/40 text-stone-900 dark:text-stone-100",
    iconColor: "text-orange-600 dark:text-orange-400",
    numBadge:
      "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/70 dark:text-orange-300 dark:border-orange-700",
    tagBadge:
      "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-900/60 dark:text-orange-200 dark:border-orange-700",
  },
  projects: {
    active:
      "bg-indigo-300 text-black dark:bg-indigo-400 dark:text-black border-black dark:border-indigo-300 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#6366f1]",
    inactive:
      "border-transparent hover:border-black dark:hover:border-indigo-400 hover:bg-indigo-100/70 dark:hover:bg-indigo-950/40 text-stone-900 dark:text-stone-100",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    numBadge:
      "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/70 dark:text-indigo-300 dark:border-indigo-700",
    tagBadge:
      "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900/60 dark:text-indigo-200 dark:border-indigo-700",
  },
  certificates: {
    active:
      "bg-emerald-300 text-black dark:bg-emerald-400 dark:text-black border-black dark:border-emerald-300 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#10b981]",
    inactive:
      "border-transparent hover:border-black dark:hover:border-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/40 text-stone-900 dark:text-stone-100",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    numBadge:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/70 dark:text-emerald-300 dark:border-emerald-700",
    tagBadge:
      "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-700",
  },
  contact: {
    active:
      "bg-rose-300 text-black dark:bg-rose-400 dark:text-black border-black dark:border-rose-300 shadow-[3px_3px_0_#000] dark:shadow-[3px_3px_0_#f43f5e]",
    inactive:
      "border-transparent hover:border-black dark:hover:border-rose-400 hover:bg-rose-100/70 dark:hover:bg-rose-950/40 text-stone-900 dark:text-stone-100",
    iconColor: "text-rose-600 dark:text-rose-400",
    numBadge:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/70 dark:text-rose-300 dark:border-rose-700",
    tagBadge:
      "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/60 dark:text-rose-200 dark:border-rose-700",
  },
};

export function MagazineNav() {
  const pathname = usePathname();
  const { isCoverOpen, openCover, data: portfolio } = usePortfolio();
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
              if (typeof window !== "undefined") {
                try {
                  sessionStorage.setItem("socius_cover_dismissed", "true");
                  sessionStorage.setItem("socius_last_section", id);
                  if (window.history && window.location.hash !== `#${id}`) {
                    window.history.replaceState(null, "", `/#${id}`);
                  }
                } catch {}
              }
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

  const getProjectsIcon = (active: boolean) => {
    const iconType = portfolio?.personal?.projectsNavIcon || "foldercode";
    const iconClass = `w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`;
    switch (iconType) {
      case "code":
        return <Code2 className={iconClass} />;
      case "folder":
        return <Folder className={iconClass} />;
      case "terminal":
        return <Terminal className={iconClass} />;
      case "layers":
        return <Layers className={iconClass} />;
      case "foldercode":
      default:
        return <FolderCode className={iconClass} />;
    }
  };

  const sections: NavSection[] = [
    {
      name: "About",
      id: "about",
      path: "/#about",
      chapter: "01",
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
      chapter: "02",
      badge: "Work",
      shortLabel: "Projects",
      accentHex: "#6366f1",
      icon: (active) => getProjectsIcon(active),
    },
    {
      name: "Certificates",
      id: "certificates",
      path: "/#certificates",
      chapter: "03",
      badge: "Laurels",
      shortLabel: "Certificates",
      accentHex: "#10b981",
      icon: (active) => (
        <Award className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? "stroke-[2.5]" : "stroke-2"}`} />
      ),
    },
    {
      name: "Contact",
      id: "contact",
      path: "/#contact",
      chapter: "04",
      badge: "Dispatch",
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
      openCover();
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
  const showMobileDock = !isCoverOpen && (isScrolled || activeSection !== "cover");

  return (
    <>
      {/* ── DESKTOP TOP-RIGHT FLOATING MENU BUTTON ── */}
      <div
        ref={dropdownRef}
        className={`hidden md:flex fixed top-6 right-6 lg:right-8 z-50 items-center gap-3 select-none transition-all duration-300 ${
          isCoverOpen ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100 pointer-events-auto translate-y-0"
        }`}
      >
        {/* EXPANDABLE SKETCHBOOK DIRECTORY POPUP */}
        {isOpen && (
          <div
            className="absolute right-0 top-full mt-3 w-80 bg-[#fffdfa] dark:bg-[#12131c] backdrop-blur-2xl border-2 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#f59e0b] rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-150 select-none"
            role="dialog"
            aria-label="Site Navigation Directory"
          >
            {/* Playful washi tape on top of the directory modal */}
            <div
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-amber-400 dark:bg-amber-400 border border-black/30 shadow-xs rotate-[-1deg] rounded-xs pointer-events-none z-10"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-dashed border-black/15 dark:border-white/15 font-mono text-[11px] font-black uppercase">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black font-black text-[10px] -rotate-1 shadow-[1.5px_1.5px_0_#f59e0b]">
                <span>📑</span> EXPLORE INDEX
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[9px] font-mono text-stone-500 dark:text-stone-400 font-bold">
                ESC ✕
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              {/* 00 Cover */}
              {(() => {
                const isCoverActive = activeSection === "cover";
                const theme = NAV_ITEM_THEMES.cover;
                return (
                  <button
                    type="button"
                    onClick={(e) => handleNavClick("cover", e)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-150 group font-mono text-xs font-bold cursor-pointer select-none ${
                      isCoverActive ? theme.active : theme.inactive
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                          isCoverActive
                            ? "bg-black text-amber-300 dark:bg-black dark:text-amber-300 border-black"
                            : theme.numBadge
                        }`}
                      >
                        00
                      </span>
                      <Home
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isCoverActive ? "text-black dark:text-black stroke-[2.5]" : theme.iconColor
                        }`}
                      />
                      <span className="uppercase font-black tracking-wide">Cover Screen</span>
                    </div>
                    {isCoverActive ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-black bg-white dark:bg-black dark:text-amber-300 px-2 py-0.5 rounded-full border border-black shadow-xs">
                        <span>✦</span> CURRENT
                      </span>
                    ) : (
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${theme.tagBadge}`}>
                        TOP ↵
                      </span>
                    )}
                  </button>
                );
              })()}

              {/* Chapter Sections */}
              {sections.map((s) => {
                const isActive = activeSection === s.id;
                const theme = NAV_ITEM_THEMES[s.id] || NAV_ITEM_THEMES.about;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={(e) => handleNavClick(s.id, e)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 transition-all duration-150 group font-mono text-xs font-bold cursor-pointer select-none ${
                      isActive ? theme.active : theme.inactive
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded border ${
                          isActive
                            ? "bg-black text-white dark:bg-black dark:text-white border-black"
                            : theme.numBadge
                        }`}
                      >
                        {s.chapter}
                      </span>
                      <span
                        className={`flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isActive ? "text-black dark:text-black" : theme.iconColor
                        }`}
                      >
                        {s.icon(isActive)}
                      </span>
                      <span className="uppercase font-black tracking-wide">{s.name}</span>
                    </div>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-black bg-white dark:bg-black dark:text-white px-2 py-0.5 rounded-full border border-black shadow-xs">
                        <span>✦</span> CURRENT
                      </span>
                    ) : (
                      <span
                        className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${theme.tagBadge}`}
                      >
                        {s.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Admin Portal Shortcut (Single Click) */}
              <div className="pt-2 mt-2 border-t-2 border-dashed border-black/10 dark:border-white/10">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/25 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/40 text-stone-900 dark:text-stone-100 transition-all font-mono text-xs font-bold group cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <img src="/icon.svg" alt="Socius" className="w-3.5 h-3.5 object-contain rounded-xs group-hover:scale-110 transition-transform" />
                    <span className="font-black uppercase tracking-wide">Socius Admin</span>
                  </span>
                  <span className="text-[9.5px] font-bold bg-amber-200/90 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>Open ↗</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── SINGLE-CLICK SOCIUS ADMIN BUTTON (DESKTOP) ── */}
        <Link
          href="/admin"
          className="group relative inline-flex items-center gap-1.5 font-mono text-xs font-black uppercase px-3.5 py-2.5 rounded-full border-2 border-black dark:border-white bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 hover:bg-amber-300 dark:hover:bg-amber-400 hover:text-black dark:hover:text-black shadow-[3.5px_3.5px_0_#000] dark:shadow-[3.5px_3.5px_0_#fff] transition-all duration-200 select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5"
          title="Open Socius Admin Console (Single Click)"
          aria-label="Socius Admin Console"
        >
          <img
            src="/icon.svg"
            alt="Socius"
            className="w-3.5 h-3.5 object-contain rounded-xs group-hover:scale-110 transition-transform"
          />
          <span className="tracking-wide">Socius</span>
        </Link>

        {/* ── THE MENU BUTTON ── */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative inline-flex items-center gap-2.5 font-mono text-xs font-black uppercase px-4 py-2.5 rounded-full border-2 transition-all duration-200 select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0.5 ${
            isOpen
              ? "bg-amber-300 text-black border-black shadow-[3.5px_3.5px_0_#000] dark:bg-amber-400 dark:text-black dark:border-black dark:shadow-[3.5px_3.5px_0_#f59e0b]"
              : "bg-white/90 dark:bg-stone-900/90 text-black dark:text-white border-black dark:border-white shadow-[3.5px_3.5px_0_#000] dark:shadow-[3.5px_3.5px_0_#fff]"
          }`}
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
        className={`md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[375px] backdrop-blur-2xl bg-white/70 dark:bg-stone-900/70 border-2 border-black dark:border-white/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.7)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1.5px_1.5px_0_rgba(255,255,255,0.2)] p-1.5 flex items-center justify-between gap-1 select-none transition-all duration-300 ${
          showMobileDock ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
        aria-label="Mobile Navigation Dock"
      >
        {/* Section Links */}
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={(e) => handleNavClick(s.id, e)}
              className={`flex-1 relative flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 active:scale-90 cursor-pointer overflow-hidden ${
                isActive
                  ? "text-black dark:text-white font-black shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.12)] bg-white/90 dark:bg-white/20 backdrop-blur-xl border border-white/60 dark:border-white/20"
                  : "text-stone-500 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {/* iOS Liquid Sheen Tint when Active */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full opacity-25 pointer-events-none"
                  style={{ backgroundColor: s.accentHex }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center transition-transform" style={{ color: isActive ? s.accentHex : undefined }}>
                {s.icon(isActive)}
              </span>
              <span className="relative z-10 text-[9.5px] font-mono tracking-tight font-black uppercase mt-0.5">
                {s.shortLabel}
              </span>

              {/* Tiny glowing dot below active tab */}
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ backgroundColor: s.accentHex }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
