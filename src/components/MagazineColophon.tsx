"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { portfolioData } from "@/data/portfolioData";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./SocialIcons";
import { ThemeToggle } from "./ThemeToggle";

export function MagazineColophon() {
  const pathname = usePathname();
  const { personal, socialLinks } = portfolioData;

  // Do not render colophon footer on the cover page (Page 01) or standalone admin panel
  if (pathname === "/" || pathname === "/admin") {
    return null;
  }

  const scrollToCover = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-8 bg-stone-950 text-stone-400 font-mono text-xs border-t-2 border-editorial">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-editorial">
          {/* Masthead Imprint (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold block">
              THE COLOPHON &bull; IMPRINT
            </span>
            <h4 className="text-2xl font-bold font-editorial uppercase text-white tracking-tight">
              {personal.name}
            </h4>
            <p className="font-sans text-xs text-stone-400 max-w-sm leading-relaxed">
              1st Year B.Tech Student in Artificial Intelligence &amp; Data Science. Learning foundations in Python, Statistics, and Machine Learning.
            </p>
            <div className="text-[11px] text-stone-500">
              {personal.college} &bull; Class of 2029
            </div>
          </div>

          {/* Magazine Multi-Page Directory (4 Cols) */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold block mb-3">
              MAGAZINE DIRECTORY
            </span>
            <ul className="space-y-1.5 text-xs text-stone-300">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  P.02 &bull; About Harsh &amp; Education
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">
                  P.03 &bull; Projects &amp; Explorations
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-amber-400 transition-colors">
                  P.04 &bull; Certificates &amp; Laurels
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  P.05 &bull; Contact Desk &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Back to Cover & Connect (3 Cols) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start md:items-end gap-4">
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={scrollToCover}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-editorial hover:border-amber-400 text-stone-200 hover:text-white uppercase tracking-wider text-[11px] transition-colors"
              >
                <span>Scroll to Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <div className="flex items-center gap-3 pt-6 md:pt-0">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 border border-editorial hover:text-white hover:border-stone-400 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 border border-editorial hover:text-white hover:border-stone-400 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Microprint */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div>
            &copy; 2026 {personal.name}. Crafted with Next.js 16, Framer Motion &amp; Tailwind CSS.
          </div>
          <div>
            1st Year AI/ML Portfolio &bull; Open for Summer &apos;26 Internships
          </div>
        </div>
      </div>
    </footer>
  );
}
