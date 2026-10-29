"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { portfolioData } from "@/data/portfolioData";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";

export function MagazineColophon() {
  const pathname = usePathname();
  const { personal, socialLinks } = portfolioData;

  // Only render colophon at the conclusion of the storybook on the contact page
  if (pathname !== "/contact") {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 py-12 px-4 sm:px-8 bg-white border-t-2 border-dashed border-black font-mono text-xs">
      <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200">
          <div>
            <span className="bg-black text-white px-2.5 py-0.5 text-[11px] font-black uppercase rounded tracking-wider inline-block mb-2">
              SKETCHBOOK COLOPHON
            </span>
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              {personal.name}
            </h4>
            <p className="text-xs text-stone-600 mt-1 max-w-md">
              Personal Portfolio • Handcrafted in Black &amp; White ink.
            </p>
          </div>

          {/* Social Channels */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="sketch-pill"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="sketch-pill"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${personal.email}`}
              className="sketch-pill"
            >
              <span>{personal.email}</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-600 text-[11px]">
          <p>© 2026 Harsh Aryan. All ideas sketched by hand.</p>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-black font-bold underline">
              Cover Issue
            </Link>
            <Link href="/about" className="hover:text-black font-bold">
              About
            </Link>
            <Link href="/projects" className="hover:text-black font-bold">
              Projects
            </Link>
            <Link href="/certificates" className="hover:text-black font-bold">
              Certificates
            </Link>
            <Link href="/contact" className="hover:text-black font-bold">
              Contact
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 border border-black px-2.5 py-1 rounded-full text-black hover:bg-black hover:text-white transition-colors ml-2 font-bold"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
