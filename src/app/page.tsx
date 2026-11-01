"use client";

import React, { useEffect } from "react";
import { DoodleCrewCover } from "@/components/DoodleCrewCover";
import { MobileDoodleCover } from "@/components/MobileDoodleCover";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  // Support direct anchor jumps on initial page load (e.g., /#about, /#projects)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="w-full min-h-screen bg-transparent text-black dark:text-white selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* ── 01. COVER SCREEN (Dedicated Mobile & Desktop Versions) ── */}
      <section id="cover" className="relative w-full">
        {/* Phone Cover (iOS & Android) — Dedicated Clean Portrait Layout */}
        <div className="block md:hidden w-full">
          <MobileDoodleCover />
        </div>

        {/* Desktop Cover (Tablet & Laptop) — Full Interactive Doodle Crew */}
        <div className="hidden md:block w-full">
          <DoodleCrewCover />
        </div>
      </section>

      {/* ── 02. CHAPTER 02: ABOUT & BIO ── */}
      <AboutSection id="about" />

      {/* ── 03. CHAPTER 03: PROJECTS & BUILDS (Compact & 3D Interactive) ── */}
      <ProjectsSection id="projects" />

      {/* ── 04. CHAPTER 04: CERTIFICATES & LAURELS (Compact Polaroid Bento Vault) ── */}
      <CertificatesSection id="certificates" />

      {/* ── 05. CHAPTER 05: CONTACT & DISPATCH ── */}
      <ContactSection id="contact" />

      {/* ── FINAL ARCHITECTURAL FOOTER (At the very end of the website) ── */}
      <SiteFooter />
    </main>
  );
}
