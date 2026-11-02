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

  // 8-Second Auto Transition fallback (synced with desktop live countdown)
  useEffect(() => {
    if (!isCoverOpen) return;

    const autoTransitionTimer = setTimeout(() => {
      closeCover();
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 8500); // 8.5s fallback

    return () => clearTimeout(autoTransitionTimer);
  }, [isCoverOpen, closeCover]);

  return (
    <main className="w-full min-h-screen bg-transparent text-black dark:text-white selection:bg-indigo-600 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-200">
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
              y: "-110%",
              scale: 0.88,
              rotateX: 14,
              opacity: 0,
              transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
            }}
            style={{ perspective: "1400px", transformOrigin: "50% 15%" }}
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

      {/* ── PORTFOLIO MAIN BODY (Cinematic 3D Zoom Reveal when Cover is dismissed) ── */}
      <motion.div
        key="portfolio-main-body"
        initial={{ opacity: 0, scale: 0.94, y: 50, filter: "blur(6px)" }}
        animate={
          !isCoverOpen
            ? { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.94, y: 50, filter: "blur(6px)" }
        }
        transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full ${
          isCoverOpen ? "invisible h-0 overflow-hidden pointer-events-none" : "visible"
        }`}
      >
        {/* ── 01. CHAPTER 01: ABOUT & BIO (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="about"
          chapterNumber="01"
          chapterName="The Architect and Mind"
          accentColor="#f59e0b"
        >
          <AboutSection id="about-content" />
        </Scroll3DSection>

        {/* ── 02. CHAPTER 02: PROJECTS & BUILDS (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="projects"
          chapterNumber="02"
          chapterName="Project Lab and Code"
          accentColor="#6366f1"
        >
          <ProjectsSection id="projects-content" />
        </Scroll3DSection>

        {/* ── 03. CHAPTER 03: CERTIFICATES & LAURELS (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="certificates"
          chapterNumber="03"
          chapterName="Certifications and Laurels"
          accentColor="#10b981"
        >
          <CertificatesSection id="certificates-content" />
        </Scroll3DSection>

        {/* ── 04. CHAPTER 04: CONTACT & DISPATCH (3D Scroll Perspective) ── */}
        <Scroll3DSection
          id="contact"
          chapterNumber="04"
          chapterName="Direct Communications and Dispatch"
          accentColor="#f43f5e"
        >
          <ContactSection id="contact-content" />
        </Scroll3DSection>

        {/* ── FINAL ARCHITECTURAL FOOTER (At the very end of the website) ── */}
        <SiteFooter />
      </motion.div>
    </main>
  );
}
