import React from "react";
import Link from "next/link";
import Image from "next/image";
import { portfolioData } from "@/data/portfolioData";
import { AutoPageTurn } from "@/components/AutoPageTurn";
import {
  GraduationCap,
  Award,
  ArrowRight,
  Code2,
  FolderGit2,
  FileText,
  Sparkles,
  Compass,
  CheckCircle2,
  Cpu,
  Binary,
} from "lucide-react";

export default function AboutPage() {
  const { personal, education, schooling, skills, projects } = portfolioData;
  const featuredProjects = projects.slice(0, 3);

  const timelineMilestones = [
    {
      period: "2025",
      title: "Foundational Distinctions",
      subtitle: `${schooling.institution} • ${schooling.percentage}`,
      description: "Completed senior secondary with top honors in Physics, Mathematics & Computer Science. Built early algorithmic intuition through competitive problems.",
    },
    {
      period: "2025 — Present",
      title: "Undergraduate Immersion",
      subtitle: `${education.institution} • CSE (AI & DS)`,
      description: "Enrolled in Bachelor of Technology specializing in AI & Data Science. Dedicated to rigorous coursework in Discrete Math, Linear Algebra, and Systems Programming.",
    },
    {
      period: "Current Phase",
      title: "Mathematics & Machine Learning Laboratory",
      subtitle: "Hands-on Modeling & Data Analysis",
      description: "Deep-diving into vectorized computations with NumPy/Pandas, supervised regression/classification, and implementing algorithms from first principles.",
    },
    {
      period: "Target 2026",
      title: "Industry Collaboration & Internships",
      subtitle: "Summer 2026 Early Internship Focus",
      description: "Actively seeking collegiate hackathons, open-source AI tooling contributions, and early research or engineering internship positions.",
    },
  ];

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-16">
      {/* Chapter 02 Header */}
      <div className="pb-6 border-b-2 border-black flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="sketch-stamp mb-2">
            ABOUT &amp; ACADEMICS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            About Harsh Aryan
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 max-w-xl">
            Crafting at the intersection of Code, Mathematics &amp; Intelligent Models.
          </p>
        </div>

        {personal.resumeUrl && (
          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="sketch-button-solid text-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume PDF</span>
          </a>
        )}
      </div>

      {/* Main Narrative & Profile Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative Story */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-black" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
              The Philosophy: Depth Over Hype
            </h2>
          </div>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            I am <strong className="text-black font-black">{personal.name}</strong>, a freshman undergraduate passionate about Artificial Intelligence, Data Science, and Scientific Computing. My fascination began when I wrote my first Python script to automate a repetitive task; seeing lines of logic produce tangible results sparked an obsession that has guided my work ever since.
          </p>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            While modern AI moves at breakneck speed, I believe real engineering requires solid anchors. Rather than jumping straight to pre-trained libraries, I spend my early years understanding the foundational mathematics—Linear Algebra, Multivariate Calculus, and Probability—implementing algorithms from scratch before relying on abstractions.
          </p>

          {/* Handcrafted Notebook Quote Card */}
          <div className="sketch-box p-6 border-l-8 border-l-black bg-stone-50 my-6 relative overflow-hidden">
            <div className="font-mono text-[10px] font-bold uppercase text-stone-500 mb-2">
              NOTEBOOK ENTRY #01 • PERSPECTIVE
            </div>
            <p className="font-editorial italic text-base sm:text-lg text-black font-semibold leading-relaxed">
              &ldquo;Being in 1st year is an immense superpower: it grants four focused years to master mathematics, build real-world open source systems, and prepare for high-impact AI research.&rdquo;
            </p>
            <span className="block text-right font-mono text-xs font-bold mt-2 text-stone-700">
              — Harsh Aryan
            </span>
          </div>

          <p className="text-stone-800 text-sm sm:text-base leading-relaxed">
            When I am not writing code or studying course notes, you will find me participating in hackathons, analyzing Kaggle datasets, and experimenting with clean, tactile front-end designs.
          </p>
        </div>

        {/* Right Column: Sketchbook Photo Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          {/* Handcrafted Sketchbook Photo Frame */}
          <div className="sketch-box p-3.5 sm:p-4 bg-white relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 shadow-[5px_5px_0_#000] w-full max-w-sm sm:max-w-md">
            {/* Washi tape strip pinned at the top */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-200/90 border border-black/40 rotate-[1.5deg] shadow-sm z-10 pointer-events-none"
              aria-hidden="true"
            />

            {/* Inner photo border */}
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black bg-stone-100">
              <Image
                src="/harsh-cover.jpg"
                alt="Harsh Aryan - B.Tech CSE (AI & DS)"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top filter grayscale contrast-[1.06] hover:grayscale-0 transition-all duration-500"
              />
              {/* Corner photofilm overlay stamp */}
              <div className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                HARSH ARYAN
              </div>
            </div>

            {/* Polaroid-style caption strip */}
            <div className="pt-3 pb-1 flex items-center justify-between font-mono text-xs">
              <span className="font-black text-black uppercase tracking-wider text-xs block">
                {personal.name}
              </span>
              <span className="sketch-stamp text-[10px]">
                ORIGINAL PRINT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Roadmap */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            The Roadmap &amp; Progress
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelineMilestones.map((m, idx) => (
            <div
              key={m.period}
              className="sketch-box p-5 flex flex-col justify-between space-y-3 relative group hover:translate-y-[-2px] transition-transform"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-black font-mono text-xs font-bold">
                  <span className="sketch-stamp">PHASE 0{idx + 1}</span>
                  <span className="text-stone-600">{m.period}</span>
                </div>
                <h3 className="text-base font-black uppercase text-black mt-3 leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs font-mono font-bold text-stone-600 mt-1">
                  {m.subtitle}
                </p>
                <p className="text-xs text-stone-800 leading-relaxed mt-2">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Track: University & Schooling */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Academic Track &amp; Coursework
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Undergraduate Enrollment */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black text-xs font-mono">
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
                Current Status: <span className="text-black font-bold">{education.status}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-stone-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2 font-bold">
                KEY SYLLABUS &amp; CORE MODULES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {education.courses.map((course) => (
                  <span
                    key={course}
                    className="border border-black px-2.5 py-0.5 rounded-full font-bold bg-white"
                  >
                    ✦ {course}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Schooling Background */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black text-xs font-mono">
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
                Academic Score: <span className="text-black font-bold">{schooling.percentage}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed border-stone-300">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-2 font-bold">
                CORE PILLARS:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-black px-2.5 py-0.5 rounded-full font-bold bg-white">✦ Physics &amp; Mathematics</span>
                <span className="border border-black px-2.5 py-0.5 rounded-full font-bold bg-white">✦ Computer Science (Basics)</span>
                <span className="border border-black px-2.5 py-0.5 rounded-full font-bold bg-white">✦ Logical Reasoning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skillset Matrix Laboratory */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Technical Skillsets &amp; Tooling
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
                  LAB UNIT 0{idx + 1}
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

      {/* Featured Projects Teaser */}
      <div className="space-y-6 pt-6 border-t-2 border-dashed border-black">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="sketch-stamp mb-1">FEATURED BUILDS</div>
            <h2 className="text-2xl font-black uppercase text-black">
              Featured Builds &amp; Code
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
                  <span>PROJECT</span>
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
                <span>Inspect Repository</span>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Automatic Page Turn to Next Section */}
      <AutoPageTurn
        nextPath="/projects"
        nextTitle="Projects & Builds"
        subtitle="Moving to technical builds, machine learning experiments & code..."
      />
    </div>
  );
}
