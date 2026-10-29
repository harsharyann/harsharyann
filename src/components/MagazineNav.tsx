"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, FileText } from "lucide-react";
import { portfolioData } from "@/data/portfolioData";

export function MagazineNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden on root cover page
  if (pathname === "/") {
    return null;
  }

  const pages = [
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Certificates", path: "/certificates" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8">
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Link to Cover */}
        <Link
          href="/"
          className="font-mono text-xs font-black uppercase bg-black text-white px-2.5 py-1 rounded tracking-wider shadow-[2px_2px_0_#555] hover:bg-stone-800 transition-all flex items-center gap-1.5"
          title="Return to Cover"
        >
          <span>HARSH ARYAN</span>
        </Link>

        {/* Navigation Chapter Pills without numbers, no Cover */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-mono text-xs font-bold uppercase">
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-black text-white shadow-[2px_2px_0_#555]"
                    : "border-2 border-black bg-white text-black hover:bg-black hover:text-white shadow-[2px_2px_0_#000]"
                }`}
              >
                <span>{p.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: Resume button & mobile menu hamburger */}
        <div className="flex items-center gap-3">
          {portfolioData.personal.resumeUrl && (
            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold border-2 border-black px-3.5 py-1.5 rounded-full bg-white text-black shadow-[2px_2px_0_#000] hover:bg-black hover:text-white transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume PDF</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 border-2 border-black rounded shadow-[2px_2px_0_#000] hover:bg-black hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white p-4 space-y-2 mt-3">
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
                <span>{p.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
