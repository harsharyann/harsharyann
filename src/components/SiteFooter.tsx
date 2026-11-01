"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Mail, ExternalLink, Sparkles, Terminal } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "./SocialIcons";
import { usePortfolio } from "@/context/PortfolioContext";

export function SiteFooter() {
  const { data: portfolio } = usePortfolio();
  const personal = portfolio?.personal;
  const socialLinks = portfolio?.socialLinks;

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full mt-20 pt-10 pb-12 border-t-4 border-black dark:border-white/20 bg-stone-100/70 dark:bg-[#0c0d12]/75 backdrop-blur-2xl text-black dark:text-white transition-colors duration-200">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ── TOP TIER: RETURN TO TOP ── */}
        <div className="flex items-center justify-end pb-6 border-b-2 border-black/15 dark:border-white/10 font-mono text-xs">
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black border-2 border-black shadow-[2.5px_2.5px_0_#000] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[1px_1px_0_#000] transition-all cursor-pointer"
            title="Return to the top of the page"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* ── MIDDLE TIER: 3-COLUMN ARCHITECTURAL DOSSIER GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Column 1: Monumental Moniker & Vibe (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <h3 className="font-['Permanent_Marker',cursive] text-3xl sm:text-4xl text-black dark:text-white tracking-wide leading-tight">
              {personal?.name || "HARSH ARYAN"}
            </h3>

            <p className="font-mono text-xs text-stone-700 dark:text-stone-300 leading-relaxed max-w-sm">
              Teaching machines to learn and crafting reliable scientific software. Rooted in linear algebra, probability, and full-stack engineering.
            </p>
          </div>

          {/* Column 2: Index Directory (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-[11px] font-black uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Site Directory:
            </div>
            <ul className="space-y-2 font-mono text-xs font-bold">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-500 hover:translate-x-1 inline-block transition-transform"
                >
                  <span className="text-stone-400 mr-2">01.</span>Cover Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-500 hover:translate-x-1 inline-block transition-transform"
                >
                  <span className="text-stone-400 mr-2">02.</span>About Dossier
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-amber-500 hover:translate-x-1 inline-block transition-transform"
                >
                  <span className="text-stone-400 mr-2">03.</span>Project Lab
                </Link>
              </li>
              <li>
                <Link
                  href="/certificates"
                  className="hover:text-amber-500 hover:translate-x-1 inline-block transition-transform"
                >
                  <span className="text-stone-400 mr-2">04.</span>Credentials
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-500 hover:translate-x-1 inline-block transition-transform"
                >
                  <span className="text-stone-400 mr-2">05.</span>Dispatch Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Social Radar (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono text-[11px] font-black uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Direct Radar &amp; Channels:
            </div>
            <div className="flex flex-col gap-2 font-mono text-xs">
              {/* GitHub */}
              <a
                href={socialLinks?.github || "https://github.com/harsharyann"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-700 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#38bdf8] transition-all font-bold group"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4 text-black dark:text-white" />
                  <span>GitHub Repository</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-sky-400 transition-colors" />
              </a>

              {/* LinkedIn */}
              <a
                href={socialLinks?.linkedin || "https://linkedin.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-700 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#fde047] transition-all font-bold group"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4 text-[#0077b5]" />
                  <span>LinkedIn Network</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-400 transition-colors" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${personal?.email || "harsharyan@outlook.com"}`}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-stone-900 border-2 border-black dark:border-stone-700 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f43f5e] transition-all font-bold group"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span className="truncate">{personal?.email || "harsharyan@outlook.com"}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-rose-500 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* ── BOTTOM TIER: COPYRIGHT & DISCREET ADMIN LINK ── */}
        <div className="pt-6 border-t border-black/15 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-stone-600 dark:text-stone-400">
          <div>
            © 2026 Harsh Aryan • Handcrafted Comic Sketchbook Edition
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white border border-stone-300 dark:border-stone-700 font-bold transition-all text-[10px]"
              title="Admin CMS Console"
            >
              <Terminal className="w-3 h-3 text-amber-500" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
