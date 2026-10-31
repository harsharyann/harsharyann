"use client";

import React, { useState } from "react";
import { portfolioData } from "@/data/portfolioData";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";
import { AutoPageTurn } from "@/components/AutoPageTurn";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Machine Learning",
    "Data Analysis",
    "Web & AI Tools",
    "Python Basics",
  ];

  const filtered =
    activeCategory === "All"
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.category === activeCategory);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="sketch-stamp mb-2 bg-indigo-600 text-white dark:bg-white dark:text-black">
            PROJECTS &amp; LAB EXPERIMENTS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
            Projects &amp; Builds
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400 max-w-xl">
            End-to-end exploratory data analysis, foundational machine learning algorithms, and scientific Python tools developed during my 1st year.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs uppercase">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full border-2 border-black dark:border-white font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white dark:bg-white dark:text-black shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
                  : "bg-white text-black dark:bg-stone-900 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#666]"
              }`}
            >
              {cat === "All" ? "ALL PROJECTS" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((proj, idx) => (
          <article
            key={proj.id}
            id={proj.id}
            className="scroll-mt-28 sketch-box sketch-box-hover p-6 sm:p-7 flex flex-col justify-between group space-y-6"
          >
            <div className="space-y-4">
              {/* Header meta */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-800 font-mono text-xs">
                <span className="sketch-stamp bg-indigo-600 text-white dark:bg-white dark:text-black">
                  PROJ #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-stone-300">
                  {proj.category}
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h2 className="text-2xl font-black uppercase text-black dark:text-white tracking-tight group-hover:underline">
                  {proj.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1">
                  {proj.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                {proj.description}
              </p>

              {/* Key Highlights / Metrics */}
              {proj.metrics && proj.metrics.length > 0 && (
                <div className="p-3 bg-indigo-50/50 dark:bg-stone-800/60 border border-indigo-200 dark:border-stone-700 rounded space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 dark:text-stone-400 block">
                    KEY OBSERVATIONS &amp; METRICS:
                  </span>
                  <div className="flex flex-wrap gap-2 font-mono text-xs">
                    {proj.metrics.map((m, i) => (
                      <span key={i} className="font-bold text-black dark:text-white flex items-center gap-1">
                        <span className="text-indigo-600 dark:text-white">✦</span> {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Pills */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono font-bold uppercase text-stone-500 dark:text-stone-400 block">
                  TECH STACK &amp; TOOLS:
                </span>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="border border-indigo-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-stone-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="pt-4 border-t-2 border-dashed border-black dark:border-stone-800 flex items-center justify-between gap-3">
              <a
                href={proj.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="sketch-button-solid text-xs flex-1 text-center"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              {proj.liveUrl && (
                <a
                  href={proj.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="sketch-button-outline text-xs flex-1 text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Automatic Page Turn to Next Section */}
      <AutoPageTurn
        nextPath="/certificates"
        nextTitle="Certificates & Laurels"
        subtitle="Moving to verified honors, technical credentials & courses..."
      />
    </div>
  );
}
