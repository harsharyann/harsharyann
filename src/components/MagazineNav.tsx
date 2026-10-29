"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText, ArrowLeft } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";

export function MagazineNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden on root cover and admin
  if (pathname === "/" || pathname === "/admin") {
    return null;
  }

  const pages = [
    { pageNum: "01", name: "Cover", path: "/" },
    { pageNum: "02", name: "About", path: "/about" },
    { pageNum: "03", name: "Projects", path: "/projects" },
    { pageNum: "04", name: "Certificates", path: "/certificates" },
    { pageNum: "05", name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full relative z-50 bg-white border-b-2 border-black">
      {/* Top Sketchbook Masthead */}
      <div className="py-4 px-4 sm:px-8 max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="bg-black text-white px-3 py-1 text-xs sm:text-sm font-black tracking-widest uppercase rounded -rotate-1 group-hover:rotate-1 transition-transform">
            HARSH ARYAN
          </span>
          <span className="hidden sm:inline font-mono text-[11px] font-bold tracking-wider text-stone-600 uppercase">
            ✦ AI &amp; DATA SCIENCE SKETCHBOOK
          </span>
        </Link>

        {/* Back to Cover Shortcut */}
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cover Page</span>
        </Link>

        {/* Resume button */}
        {portfolioData.personal.resumeUrl && (
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold border-2 border-black px-3.5 py-1.5 rounded-full shadow-[2px_2px_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume PDF</span>
          </a>
        )}

        {/* Mobile menu hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 border-2 border-black rounded shadow-[2px_2px_0_#000] hover:bg-black hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Chapter Tabs Sub-Bar */}
      <div className="border-t border-dashed border-stone-300 py-2.5 px-4 sm:px-8 bg-stone-50/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-mono text-xs font-bold uppercase">
            {pages.map((p) => {
              const isActive = pathname === p.path;
              return (
                <Link
                  key={p.path}
                  href={p.path}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-black text-white shadow-[2px_2px_0_#444]"
                      : "border border-black bg-white text-black hover:bg-black hover:text-white shadow-[1px_1px_0_#000]"
                  }`}
                >
                  <span className={isActive ? "text-stone-300" : "text-stone-500"}>
                    {p.pageNum}
                  </span>
                  <span>{p.name}</span>
                </Link>
              );
            })}
          </nav>

          <span className="hidden lg:inline text-[11px] font-mono text-stone-500 font-semibold">
            B.TECH CSE (AI &amp; DS) • CLASS OF 2029
          </span>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white p-4 space-y-2">
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded border-2 border-black text-sm font-mono font-bold uppercase transition-all ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-stone-100"
                }`}
              >
                <span className="mr-2 opacity-60">[{p.pageNum}]</span>
                <span>{p.name}</span>
              </Link>
            );
          })}
          {portfolioData.personal.resumeUrl && (
            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="block text-center mt-3 py-2 border-2 border-black rounded font-mono text-xs font-bold bg-black text-white"
            >
              DOWNLOAD RESUME PDF ↗
            </a>
          )}
        </div>
      )}
    </header>
  );
}
