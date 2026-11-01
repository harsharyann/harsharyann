"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DoodleCrewCover } from "@/components/DoodleCrewCover";
import { MobileDoodleCover } from "@/components/MobileDoodleCover";
import { Scroll3DSection } from "@/components/Scroll3DSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { MagazineChapterSpine } from "@/components/MagazineChapterSpine";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Home() {
  const { isCoverOpen, closeCover } = usePortfolio();

  // Lock document scroll completely while the Cover Portal is active so scrolling CANNOT reach About
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isCoverOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isCoverOpen]);

  // Support direct anchor jumps on initial page load (e.g., /#about, /#projects)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.replace("#", "");
      if (id && id !== "cover") {
        closeCover();
        const timer = setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 250);
        return () => clearTimeout(timer);
      }
    }
  }, [closeCover]);

  return (
    <main className="w-full min-h-screen bg-transparent text-black dark:text-white selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
      {/* ── 3D MAGAZINE CHAPTER SPINE (Visible once cover is dismissed) ── */}
      {!isCoverOpen && <MagazineChapterSpine />}

      {/* ── 01. COVER SCREEN (Dedicated Mobile & Desktop Versions - Fully Dismissable Portal) ── */}
      <AnimatePresence mode="wait" initial={false}>
        {isCoverOpen && (
          <motion.div
            key="cover-portal-screen"
            id="cover"
            initial={{ y: "-100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              y: "-100%",
              opacity: 0,
              transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-50 w-full h-[100dvh] overflow-hidden touch-none select-none bg-[#edf6fa] dark:bg-[#090a0f] text-black dark:text-white transition-colors duration-300"
          >
            {/* Phone Cover (iOS & Android) — Dedicated Clean Portrait Layout */}
            <div className="block md:hidden w-full h-full">
              <MobileDoodleCover />
            </div>

            {/* Desktop Cover (Tablet & Laptop) — Full Interactive Doodle Crew */}
            <div className="hidden md:block w-full h-full">
              <DoodleCrewCover />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PORTFOLIO MAIN BODY (Only visible & scrollable when Cover is dismissed) ── */}
      <div
        className={`w-full transition-opacity duration-300 ${
          isCoverOpen ? "invisible h-0 overflow-hidden pointer-events-none" : "visible"
        }`}
      >
        {/* ── 01. CHAPTER 01: ABOUT & BIO (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="about"
          chapterNumber="01"
          chapterName="The Architect & Mind"
          accentColor="#f59e0b"
        >
          <AboutSection id="about-content" />
        </Scroll3DSection>

        {/* ── 02. CHAPTER 02: PROJECTS & BUILDS (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="projects"
          chapterNumber="02"
          chapterName="Project Lab & Code"
          accentColor="#6366f1"
        >
          <ProjectsSection id="projects-content" />
        </Scroll3DSection>

        {/* ── 03. CHAPTER 03: CERTIFICATES & LAURELS (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="certificates"
          chapterNumber="03"
          chapterName="Certifications & Laurels"
          accentColor="#10b981"
        >
          <CertificatesSection id="certificates-content" />
        </Scroll3DSection>

        {/* ── 04. CHAPTER 04: CONTACT & DISPATCH (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="contact"
          chapterNumber="04"
          chapterName="Direct Communications & Dispatch"
          accentColor="#f43f5e"
        >
          <ContactSection id="contact-content" />
        </Scroll3DSection>

        {/* ── FINAL ARCHITECTURAL FOOTER (At the very end of the website) ── */}
        <SiteFooter />
      </div>
    </main>
  );
}
