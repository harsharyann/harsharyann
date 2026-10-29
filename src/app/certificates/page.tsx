"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { ArrowRight, Sparkles, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { PolaroidCertificateCarousel } from "@/components/PolaroidCertificateCarousel";
import { AutoPageTurn } from "@/components/AutoPageTurn";

export default function CertificatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Machine Learning",
    "Data Science",
    "Programming",
    "Mathematics & Hackathons",
  ];

  const filtered =
    activeCategory === "All"
      ? portfolioData.certificates
      : portfolioData.certificates.filter((c) => c.category === activeCategory);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="pb-6 border-b-2 border-black flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="sketch-stamp mb-2">
            CERTIFICATES &amp; CREDENTIALS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Certifications &amp; Laurels
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 max-w-xl">
            Verified technical coursework pegged onto an interactive clothesline. Drag the line, swipe prints, or click any card to inspect credentials.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 font-mono text-xs uppercase">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full border-2 border-black font-bold transition-all ${
                activeCategory === cat
                  ? "bg-black text-white shadow-[2px_2px_0_#444]"
                  : "bg-white text-black hover:bg-stone-100 shadow-[2px_2px_0_#000]"
              }`}
            >
              {cat === "All" ? "ALL CERTIFICATES" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Polaroid Clothesline Carousel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-600">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-black" />
            <span>DRAG THE STRING OR CLICK A CARD TO SWING</span>
          </span>
          <span>{filtered.length} PRINTS HANGING</span>
        </div>

        <PolaroidCertificateCarousel certificates={filtered} height={520} cardWidth={280} />
      </div>

      {/* Automatic Page Turn to Next Section */}
      <AutoPageTurn
        nextPath="/contact"
        nextTitle="Contact Desk"
        subtitle="Moving to dispatch, contact correspondence & direct messaging..."
      />
    </div>
  );
}
