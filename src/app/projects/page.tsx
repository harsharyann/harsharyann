"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Machine Learning", "Data Analysis", "Web & AI Tools", "Python Basics"];

  const filtered =
    activeCategory === "All"
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.category === activeCategory);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Top Header */}
        <div className="pb-6 border-b-2 border-editorial flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
              [ PAGE 03 &bull; PRACTICAL IMPLEMENTATIONS ]
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase">
              Projects &amp; Code
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-editorial italic text-stone-400 max-w-xl">
              End-to-end data analysis, baseline neural networks, and interactive Python tools built during my 1st year.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs uppercase tracking-wider">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 border transition-all ${
                  activeCategory === cat
                    ? "bg-amber-500 text-stone-950 font-bold border-amber-500"
                    : "border-editorial text-stone-400 hover:text-white"
                }`}
              >
                {cat === "All" ? "[ ALL PROJECTS ]" : `[ ${cat} ]`}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((proj, idx) => (
            <article
              key={proj.id}
              id={proj.id}
              className="scroll-mt-28 paper-card p-6 sm:p-7 border-editorial rounded-sm flex flex-col justify-between group hover:border-stone-500 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-editorial text-xs font-mono text-stone-400 mb-4">
                  <span className="text-amber-500 font-bold">PROJECT 0{idx + 1}</span>
                  <span className="text-[11px] uppercase tracking-wider">{proj.category}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-editorial uppercase text-white mb-2 group-hover:text-amber-400 transition-colors leading-snug">
                  {proj.title}
                </h3>

                <p className="text-xs sm:text-sm font-editorial italic text-stone-300 mb-4">
                  &ldquo;{proj.tagline}&rdquo;
                </p>

                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.metrics.map((m, mIdx) => (
                    <span
                      key={mIdx}
                      className="px-2.5 py-0.5 border border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-[11px] rounded-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-6 pt-3 border-t border-editorial-light">
                  {proj.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-stone-400 font-sans">
                      <span className="text-amber-500 font-mono text-xs font-bold">&bull;</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pb-4 border-b border-editorial-light font-mono text-[11px] mb-4">
                  {proj.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 border border-editorial text-stone-300 bg-stone-900/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-editorial hover:border-stone-400 bg-stone-900 text-stone-200 hover:text-white uppercase tracking-wider text-[11px] transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>View GitHub Repo</span>
                  </a>

                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider text-[11px] transition-colors"
                    >
                      <span>Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Turn to Next Page Footer Link */}
        <div className="pt-8 border-t-2 border-editorial flex items-center justify-between font-mono text-xs">
          <Link href="/about" className="text-stone-400 hover:text-white uppercase transition-colors">
            &larr; Page 02: About &amp; Education
          </Link>

          <Link
            href="/certificates"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            <span>Turn to Page 04: Certificates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
