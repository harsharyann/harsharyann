import React from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import {
  GraduationCap,
  Award,
  ArrowRight,
  Code2,
  FolderGit2,
  Mail,
  FileText,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function AboutPage() {
  const { personal, education, schooling, skills, projects, certificates } = portfolioData;

  const featuredProjects = projects.slice(0, 3);
  const featuredCertificates = certificates.slice(0, 3);

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-16">
      {/* Page Header */}
      <div className="pb-6 border-b-2 border-black flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="sketch-stamp mb-2">
            CHAPTER 02 • BIOGRAPHY &amp; ACADEMICS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            About Harsh Aryan
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600">
            1ST YEAR B.TECH • CSE (ARTIFICIAL INTELLIGENCE &amp; DATA SCIENCE)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {personal.resumeUrl && (
            <a
              href={personal.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="sketch-button-solid"
            >
              <FileText className="w-4 h-4" />
              <span>Resume PDF</span>
            </a>
          )}
        </div>
      </div>

      {/* Narrative Biography Spread */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-7 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-snug">
            Building Strong Foundations From The Ground Up.
          </h2>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            I am <strong className="text-black">{personal.name}</strong>, a first-year undergraduate student pursuing my Bachelor of Technology in Computer Science &amp; Engineering with a specialization in Artificial Intelligence and Data Science. My journey began with simple Python scripts, which quickly evolved into an obsession with understanding how data can be cleaned, modeled, and transformed into intelligence.
          </p>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            As a freshman, I prioritize deep fundamentals over surface-level hype. I spend my time mastering mathematical foundations—especially Linear Algebra and Calculus—and implementing algorithms from scratch in Python before relying on complex abstractions.
          </p>

          {/* Pull quote notebook note */}
          <div className="sketch-box p-5 border-l-8 border-l-black bg-stone-50 my-6">
            <p className="font-editorial italic text-base sm:text-lg text-black font-semibold leading-relaxed">
              &ldquo;Being in 1st year is my greatest advantage: it gives me four focused years to master mathematics, build real-world open source projects, and prepare for impactful AI research.&rdquo;
            </p>
            <span className="block text-right font-mono text-xs font-bold mt-2 text-stone-600">
              — Harsh Aryan
            </span>
          </div>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            Beyond academics, I enjoy competing in hackathons, breaking down machine learning research papers, and crafting minimalist, high-craft web interfaces.
          </p>
        </div>

        {/* Quick Facts Sticky Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="sketch-box p-6 bg-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <span className="font-mono text-xs font-black uppercase tracking-wider">
                QUICK PROFILE NOTE
              </span>
              <BookOpen className="w-4 h-4 text-black" />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">CURRENT FOCUS</span>
                <span className="font-bold text-black text-sm">Python, Linear Algebra &amp; EDA</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">COLLEGE / INSTITUTION</span>
                <span className="font-bold text-black">{education.institution}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">DEGREE</span>
                <span className="font-bold text-black">{education.degree}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">YEAR OF STUDY</span>
                <span className="font-bold text-black">{personal.year}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">LOCATION</span>
                <span className="font-bold text-black">{personal.location}</span>
              </div>
              <div>
                <span className="text-stone-500 uppercase block text-[10px]">AVAILABILITY</span>
                <span className="font-bold text-black bg-stone-100 p-1 rounded inline-block">
                  {personal.availability}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-dashed border-stone-300">
              <Link
                href="/contact"
                className="w-full sketch-button-solid py-2 text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Dispatch / Message</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Qualifications */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-black">
          <GraduationCap className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Academic Track
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Undergraduate Card */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-black text-xs font-mono">
                <span className="sketch-stamp">CURRENT ENROLLMENT</span>
                <span className="font-bold">{education.duration}</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black mt-3">
                {education.institution}
              </h3>
              <p className="text-sm font-semibold text-stone-700 mt-1">
                {education.degree}
              </p>
              <div className="mt-3 text-xs font-mono text-stone-600">
                Status: <span className="text-black font-bold">{education.status}</span> ({education.score})
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-stone-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2 font-bold">
                KEY COURSEWORK &amp; STUDY UNITS:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {education.courses.map((course) => (
                  <span
                    key={course}
                    className="border border-black px-2 py-0.5 rounded-full font-medium"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Schooling Card */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-black text-xs font-mono">
                <span className="border border-black px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  SENIOR SECONDARY
                </span>
                <span className="font-bold">{schooling.year}</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black mt-3">
                {schooling.institution}
              </h3>
              <p className="text-sm font-semibold text-stone-700 mt-1">
                {schooling.board} • {schooling.stream}
              </p>
              <div className="mt-3 text-xs font-mono text-stone-600">
                Final Academic Score: <span className="text-black font-bold">{schooling.percentage}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-stone-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2 font-bold">
                FOUNDATIONAL PILLARS:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-black px-2 py-0.5 rounded-full font-medium">Physics &amp; Math</span>
                <span className="border border-black px-2 py-0.5 rounded-full font-medium">Computer Science Basics</span>
                <span className="border border-black px-2 py-0.5 rounded-full font-medium">Logical Problem Solving</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-black">
          <Code2 className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Skillsets &amp; Toolkit
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup, idx) => (
            <div
              key={skillGroup.category}
              className="sketch-box p-5 flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-transform"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-stone-500 block mb-1 uppercase">
                  UNIT 0{idx + 1}
                </span>
                <h3 className="text-base font-black uppercase text-black pb-2 border-b-2 border-black">
                  {skillGroup.category}
                </h3>
                <ul className="mt-3 space-y-2 font-mono text-xs">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-stone-800">
                      <span className="text-black font-black text-sm">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Work Previews Teasers */}
      <div className="space-y-8 pt-6 border-t-2 border-dashed border-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="sketch-stamp mb-1">CHAPTER 03 TEASER</div>
            <h2 className="text-2xl font-black uppercase text-black">
              Featured Projects Preview
            </h2>
          </div>
          <Link
            href="/projects"
            className="sketch-button-solid text-xs"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Open All Projects →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((p, i) => (
            <Link
              key={p.id}
              href={`/projects#${p.id}`}
              className="sketch-box sketch-box-hover p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-black text-[10px] font-mono font-bold">
                  <span>PROJ 0{i + 1}</span>
                  <span className="uppercase">{p.category}</span>
                </div>
                <h3 className="text-lg font-black uppercase text-black mt-3 group-hover:underline">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-700 mt-2 line-clamp-2">
                  {p.tagline}
                </p>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-300 flex items-center justify-between font-mono text-xs font-bold">
                <span>View Details</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation to Chapter 03 */}
      <div className="text-center pt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 sketch-button-solid text-sm px-8 py-3.5"
        >
          <span>Continue to Chapter 03: Projects &amp; Code</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
