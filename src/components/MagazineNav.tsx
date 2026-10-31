"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
    <header className="w-full sticky top-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b-2 border-black dark:border-stone-800 py-3 px-4 sm:px-8 transition-colors duration-200">
      <div className="max-w-6xl xl:max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Link to Cover */}
        <Link
          href="/"
          className="font-mono text-xs font-black uppercase bg-black text-white dark:bg-white dark:text-black px-2.5 py-1 rounded tracking-wider shadow-[2px_2px_0_#555] dark:shadow-[2px_2px_0_#fff] hover:opacity-85 transition-all flex items-center gap-1.5"
          title="Return to Cover"
        >
          <span>HARSH ARYAN</span>
        </Link>

        {/* Navigation Chapter Pills - Colourful in Light, B&W in Dark */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 font-mono text-xs font-bold uppercase">
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-[2px_2px_0_#000] dark:bg-white dark:text-black dark:shadow-[2px_2px_0_#fff]"
                    : "border-2 border-black dark:border-stone-400 bg-white dark:bg-stone-900 text-black dark:text-stone-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#888]"
                }`}
              >
                <span>{p.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side: mobile menu hamburger */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-black dark:border-white rounded shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black dark:border-stone-800 bg-white dark:bg-stone-950 p-4 space-y-2 mt-3">
          {pages.map((p) => {
            const isActive = pathname === p.path;
            return (
              <Link
                key={p.path}
                href={p.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded border-2 border-black dark:border-stone-700 text-sm font-mono font-bold uppercase transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-white dark:text-black"
                    : "bg-white dark:bg-stone-900 text-black dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
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
