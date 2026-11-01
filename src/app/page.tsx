"use client";

import React, { useEffect } from "react";
import { DoodleCrewCover } from "@/components/DoodleCrewCover";
import { MobileDoodleCover } from "@/components/MobileDoodleCover";
import { Scroll3DSection } from "@/components/Scroll3DSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { MagazineChapterSpine } from "@/components/MagazineChapterSpine";
import { ChapterTransitionBridge } from "@/components/ChapterTransitionBridge";

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
      {/* ── 3D MAGAZINE CHAPTER SPINE (Idea #1: Interactive Floating Right Dock) ── */}
      <MagazineChapterSpine />

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

      {/* ── 02. CHAPTER 02: ABOUT & BIO (3D Scroll Perspective) ── */}
      <Scroll3DSection
        id="about"
        chapterNumber="02"
        chapterName="The Architect & Mind"
        accentColor="#f59e0b"
      >
        <AboutSection id="about-content" />
      </Scroll3DSection>

      {/* ── TRANSITION 02 ➔ 03: ABOUT TO PROJECTS ── */}
      <ChapterTransitionBridge
        fromChapter="02"
        fromName="The Architect & Mind"
        toChapter="03"
        toName="Project Lab & Code"
        targetId="projects"
        accentFrom="#f59e0b"
        accentTo="#6366f1"
        icon="🧪"
        tagline="From core mathematics & algorithmic intuition into full-stack machine learning builds."
      />

      {/* ── 03. CHAPTER 03: PROJECTS & BUILDS (3D Scroll Perspective) ── */}
      <Scroll3DSection
        id="projects"
        chapterNumber="03"
        chapterName="Project Lab & Code"
        accentColor="#6366f1"
      >
        <ProjectsSection id="projects-content" />
      </Scroll3DSection>

      {/* ── TRANSITION 03 ➔ 04: PROJECTS TO CERTIFICATES ── */}
      <ChapterTransitionBridge
        fromChapter="03"
        fromName="Project Lab & Code"
        toChapter="04"
        toName="Credential Archive"
        targetId="certificates"
        accentFrom="#6366f1"
        accentTo="#10b981"
        icon="🏆"
        tagline="From code experiments to verified institutional credentials, hackathons & laurels."
      />

      {/* ── 04. CHAPTER 04: CERTIFICATES & LAURELS (3D Scroll Perspective) ── */}
      <Scroll3DSection
        id="certificates"
        chapterNumber="04"
        chapterName="Credential Archive"
        accentColor="#10b981"
      >
        <CertificatesSection id="certificates-content" />
      </Scroll3DSection>

      {/* ── TRANSITION 04 ➔ 05: CERTIFICATES TO CONTACT ── */}
      <ChapterTransitionBridge
        fromChapter="04"
        fromName="Credential Archive"
        toChapter="05"
        toName="Direct Comms & Dispatch"
        targetId="contact"
        accentFrom="#10b981"
        accentTo="#f43f5e"
        icon="📬"
        tagline="Got a question, opportunity, or collaboration in mind? Let's connect directly."
      />

      {/* ── 05. CHAPTER 05: CONTACT & DISPATCH (3D Scroll Perspective) ── */}
      <Scroll3DSection
        id="contact"
        chapterNumber="05"
        chapterName="Direct Comms & Dispatch"
        accentColor="#f43f5e"
      >
        <ContactSection id="contact-content" />
      </Scroll3DSection>

      {/* ── FINAL ARCHITECTURAL FOOTER (At the very end of the website) ── */}
      <SiteFooter />
    </main>
  );
}
