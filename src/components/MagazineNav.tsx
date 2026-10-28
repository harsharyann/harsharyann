"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, FileDown } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";

export function MagazineNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render navbar on the cover page (Page 01) or standalone admin panel
  if (pathname === "/" || pathname === "/admin") {
    return null;
  }

  // Portfolio reading sections (P.01 Issue Cover removed from navbar as requested)
  const pages = [
    { pageNum: "02", name: "About & Education", path: "/about" },
    { pageNum: "03", name: "Projects & Works", path: "/projects" },
    { pageNum: "04", name: "Certificates", path: "/certificates" },
    { pageNum: "05", name: "Contact Desk", path: "/contact" },
  ];

  return (
    <header className="w-full relative z-50">
      {/* Main Magazine Masthead */}
      <div className="py-6 sm:py-8 px-4 sm:px-8 border-b-2 border-editorial text-center relative bg-stone-950/40">
        <Link href="/" className="inline-block group" title="Return to Issue Cover">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] block mb-2 text-stone-400 group-hover:text-amber-400 transition-colors">
            STUDENT RESEARCH &amp; AI LEARNER FOLIO
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-editorial tracking-tight uppercase leading-[0.95] group-hover:opacity-90 transition-opacity">
            {portfolioData.personal.name}
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-editorial italic text-stone-400 max-w-md mx-auto">
            1st Year Student in AI &amp; Data Science &bull; Building Foundations in Code, Math &amp; Models
          </p>
        </Link>
      </div>

      {/* Magazine Page Navigation Tabs */}
      <div className="w-full border-b border-editorial py-2.5 px-4 sm:px-8 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Magazine Multi-page links (P.02 to P.05) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-wider">
            {pages.map((p) => {
              const isActive = pathname === p.path;
              return (
                <Link
                  key={p.pageNum}
                  href={p.path}
                  className={`group flex items-center gap-1.5 py-1 transition-all ${
                    isActive
                      ? "text-amber-400 font-bold border-b-2 border-amber-500 -mb-[12px] pb-[10px]"
                      : "text-stone-400 hover:text-stone-100"
                  }`}
                >
                  <span className="text-[10px] text-stone-500 group-hover:text-amber-400/70">
                    P.{p.pageNum}
                  </span>
                  <span>{p.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs: Resume download + Mobile Menu */}
          <div className="flex items-center gap-3 ml-auto md:ml-0">
            <a
              href={portfolioData.personal.resumeUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-editorial hover:border-amber-400/80 bg-stone-900/60 text-[11px] font-mono uppercase tracking-wider text-stone-300 hover:text-white transition-all shadow-sm"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Resume</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-1.5 text-stone-300 hover:text-white border border-editorial rounded-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-3 border-t border-editorial font-mono text-xs space-y-2">
            {pages.map((p) => (
              <Link
                key={p.pageNum}
                href={p.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 px-1 border-b border-editorial/40 ${
                  pathname === p.path ? "text-amber-400 font-bold" : "text-stone-300 hover:text-amber-400"
                }`}
              >
                <span>P.{p.pageNum} &bull; {p.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-500" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
