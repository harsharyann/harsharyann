"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, Mail, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";
import { ThemeToggle } from "./ThemeToggle";

export function SiteFooter() {
  const { data: portfolio, openCover } = usePortfolio();
  const personal = portfolio?.personal;
  const socialLinks = portfolio?.socialLinks;
  const router = useRouter();

  // Secret 5-Click Easter Egg to open Admin (/admin)
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSociusClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2500);

    if (nextCount >= 5) {
      setClickCount(0);
      router.push("/admin");
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const directoryItems = [
    { id: "cover", label: "Cover", href: "#cover" },
    { id: "about", label: "About", href: "/#about" },
    { id: "projects", label: "Projects", href: "/#projects" },
    { id: "certificates", label: "Certificates", href: "/#certificates" },
    { id: "contact", label: "Dispatch Desk", href: "/#contact" },
  ];

  const handleDirectoryClick = (e: React.MouseEvent, item: typeof directoryItems[0]) => {
    if (item.id === "cover") {
      e.preventDefault();
      openCover();
      scrollToTop();
      return;
    }
    const target = document.getElementById(item.id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full mt-12 sm:mt-16 pt-7 pb-8 border-t-2 border-black/15 dark:border-white/10 bg-stone-100/70 dark:bg-[#0c0d12]/80 backdrop-blur-xl text-black dark:text-white transition-colors duration-200">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ── MAIN TIER: BRAND, THREADED DIRECTORY & CONNECT ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-black/10 dark:border-white/10">
          
          {/* Brand & Mini Moniker */}
          <div className="space-y-1">
            <h3 className="font-['Space_Grotesk'] text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              {personal?.name || "HARSH ARYAN"}
            </h3>
            <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
              Teaching machines to learn • Scientific software
            </p>
          </div>

          {/* Threaded Site Directory */}
          <nav aria-label="Site Directory Thread" className="overflow-x-auto py-1 scrollbar-none">
            <div className="inline-flex items-center gap-1 font-mono text-xs whitespace-nowrap">
              {directoryItems.map((item, idx, arr) => (
                <React.Fragment key={item.id}>
                  <Link
                    href={item.href}
                    onClick={(e) => handleDirectoryClick(e, item)}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-stone-600 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 font-bold transition-all duration-150 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-600 group-hover:bg-amber-500 group-hover:scale-125 transition-all" />
                    <span>{item.label}</span>
                  </Link>

                  {idx < arr.length - 1 && (
                    <span className="text-stone-300 dark:text-stone-700 select-none font-bold px-0.5 tracking-tighter">
                      ───
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </nav>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            {/* GitHub */}
            <a
              href={socialLinks?.github || "https://github.com/harsharyann"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-black/20 dark:border-white/20 text-black dark:text-white shadow-2xs hover:-translate-y-0.5 transition-all"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            {/* LinkedIn */}
            <a
              href={socialLinks?.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-black/20 dark:border-white/20 text-[#0077b5] shadow-2xs hover:-translate-y-0.5 transition-all"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${personal?.email || "harsharyan@outlook.com"}`}
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-black/20 dark:border-white/20 text-rose-500 shadow-2xs hover:-translate-y-0.5 transition-all"
              title="Email Dispatch"
              aria-label="Email Dispatch"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Theme Toggle in Footer */}
            <div className="ml-1">
              <ThemeToggle />
            </div>

            {/* Back to Top Icon */}
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black border border-black shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer ml-1"
              title="Return to Top"
              aria-label="Return to Top"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ── LOWER SLIM TIER: SECRET SOCIUS 5-CLICK TRIGGER ── */}
        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 dark:text-stone-600 pt-1">
          <div className="text-[10px] tracking-wide">
            crafting with code &amp; mathematics
          </div>

          {/* Secret 5-click easter egg button */}
          <button
            type="button"
            onClick={handleSociusClick}
            className="font-mono text-[11px] text-stone-400/80 dark:text-stone-600 hover:text-stone-800 dark:hover:text-stone-300 transition-colors select-none cursor-pointer tracking-wider lowercase"
            title={clickCount > 0 ? `${5 - clickCount} more...` : undefined}
            aria-label="Socius"
          >
            socius
          </button>
        </div>
      </div>
    </footer>
  );
}
