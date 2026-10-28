"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Machine Learning", "Data Science", "Programming", "Mathematics & Hackathons"];

  const filtered =
    activeCategory === "All"
      ? portfolioData.certificates
      : portfolioData.certificates.filter((c) => c.category === activeCategory);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Top Header */}
        <div className="pb-6 border-b-2 border-editorial flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
              [ PAGE 04 &bull; VERIFIED CREDENTIALS &amp; LAURELS ]
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase">
              Certifications &amp; Courses
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-editorial italic text-stone-400 max-w-xl">
              Specialized coursework in Machine Learning, Linear Algebra, Python, and hackathon accomplishments completed during my 1st year.
            </p>
          </div>

          {/* Filter Pills */}
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
                {cat === "All" ? "[ ALL CERTIFICATES ]" : `[ ${cat} ]`}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert, idx) => (
            <article
              key={cert.id}
              id={cert.id}
              className="scroll-mt-28 paper-card p-6 border-editorial rounded-sm flex flex-col justify-between group hover:border-amber-500/60 transition-colors"
            >
              <div>
                {/* Card Top Strip */}
                <div className="flex items-center justify-between pb-3 border-b border-editorial text-xs font-mono text-stone-400 mb-4">
                  <span className="text-amber-500 font-bold">CERT 0{idx + 1}</span>
                  <span className="text-[10px] uppercase tracking-wider">{cert.issueDate}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{cert.category}</span>
                </div>

                <h3 className="text-lg font-bold font-editorial uppercase text-white mb-1.5 group-hover:text-amber-400 transition-colors leading-snug">
                  {cert.title}
                </h3>

                <p className="text-xs font-mono text-amber-300 mb-3">
                  {cert.issuer}
                </p>

                <p className="text-xs text-stone-300 font-sans leading-relaxed mb-4">
                  {cert.description}
                </p>

                {/* Skills tags */}
                <div className="pt-3 border-t border-editorial-light">
                  <span className="text-[10px] font-mono text-stone-500 uppercase block mb-1.5 font-bold">
                    SKILLS &amp; CONCEPTS MASTERED:
                  </span>
                  <div className="flex flex-wrap gap-1 font-sans">
                    {cert.skillsLearned.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 border border-editorial text-[10px] text-stone-300 bg-stone-900/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Verification Link */}
              <div className="pt-4 mt-4 border-t border-editorial flex items-center justify-between font-mono text-xs">
                {cert.credentialId && (
                  <span className="text-[10px] text-stone-500 truncate max-w-[140px]">
                    ID: {cert.credentialId}
                  </span>
                )}

                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] font-bold uppercase transition-colors ml-auto"
                  >
                    <span>Verify</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-stone-400 text-[10px] uppercase ml-auto">
                    College Certificate
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Turn to Next Page Footer Link */}
        <div className="pt-8 border-t-2 border-editorial flex items-center justify-between font-mono text-xs">
          <Link href="/projects" className="text-stone-400 hover:text-white uppercase transition-colors">
            &larr; Page 03: Projects &amp; Code
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            <span>Turn to Page 05: Contact Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
