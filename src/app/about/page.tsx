import React from "react";
import Link from "next/link";
import Image from "next/image";
import { portfolioData } from "@/data/portfolioData";
import { AutoPageTurn } from "@/components/AutoPageTurn";
import {
  Brain,
  Code2,
  FolderGit2,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const { personal, skills, projects } = portfolioData;
  const featuredProjects = projects.slice(0, 3);

  const phaseBadges = [
    "bg-emerald-600 text-white dark:bg-white dark:text-black",
    "bg-sky-600 text-white dark:bg-white dark:text-black",
    "bg-indigo-600 text-white dark:bg-white dark:text-black",
    "bg-amber-500 text-black dark:bg-white dark:text-black",
  ];

  const skillColors = [
    "text-indigo-600 dark:text-white border-b-indigo-500 dark:border-b-white",
    "text-emerald-600 dark:text-white border-b-emerald-500 dark:border-b-white",
    "text-sky-600 dark:text-white border-b-sky-500 dark:border-b-white",
    "text-amber-600 dark:text-white border-b-amber-500 dark:border-b-white",
  ];

  const timelineMilestones = [
    {
      period: "Foundations",
      title: "Algorithmic Intuition & Logic",
      subtitle: "Python, C & Core Problem Solving",
      description: "Cultivated a deep focus on core algorithms, clean data structures, and mathematical logic through hundreds of practice problems.",
    },
    {
      period: "Data & Math",
      title: "Exploratory Modeling & Linear Algebra",
      subtitle: "Vectorized Computations & Analytics",
      description: "Deep-diving into NumPy, Pandas, multivariate statistics, and exploring datasets to extract actionable signals and predictive patterns.",
    },
    {
      period: "Machine Learning",
      title: "Deep Learning & Neural Architectures",
      subtitle: "PyTorch, Computer Vision & CNNs",
      description: "Building and fine-tuning neural networks from first principles. Implementing CNNs, transfer learning pipelines, and model evaluation metrics.",
    },
    {
      period: "Systems & Vision",
      title: "Intelligent Systems & Open Source",
      subtitle: "Full-Stack AI Tooling & Deployment",
      description: "Deploying interactive models, developing high-performance web tooling, and contributing to open-source developer infrastructure.",
    },
  ];

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-16">
      {/* Chapter 02 Header */}
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="sketch-stamp mb-2 bg-indigo-600 text-white dark:bg-white dark:text-black">
            ABOUT &amp; CRAFT
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
            About Harsh Aryan
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400 max-w-xl">
            Crafting at the intersection of Code, Mathematics &amp; Intelligent Models.
          </p>
        </div>
      </div>

      {/* Main Narrative & Profile Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Narrative Story */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-white" />
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              The Philosophy: Depth Over Hype
            </h2>
          </div>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            I am <strong className="text-indigo-600 dark:text-white font-black">{personal.name}</strong>, a developer passionate about Artificial Intelligence, Data Science, and Scientific Computing. My fascination began when I wrote my first Python script to automate a repetitive task; seeing lines of logic produce tangible results sparked an obsession that has guided my work ever since.
          </p>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            While modern AI moves at breakneck speed, I believe real engineering requires solid anchors. Rather than jumping straight to high-level wrappers, I spend my time understanding the foundational mathematics—Linear Algebra, Multivariate Calculus, and Probability—implementing algorithms from scratch before relying on abstractions.
          </p>

          {/* Handcrafted Notebook Quote Card */}
          <div className="sketch-box p-6 border-l-8 border-l-indigo-600 dark:border-l-white bg-indigo-50/60 dark:bg-stone-900/60 my-6 relative overflow-hidden">
            <div className="font-mono text-[10px] font-bold uppercase text-indigo-600 dark:text-stone-400 mb-2">
              NOTEBOOK ENTRY #01 • PERSPECTIVE
            </div>
            <p className="font-editorial italic text-base sm:text-lg text-indigo-950 dark:text-stone-100 font-semibold leading-relaxed">
              &ldquo;Master the underlying mathematics, build real-world open source systems, and engineering excellence will naturally follow.&rdquo;
            </p>
            <span className="block text-right font-mono text-xs font-bold mt-2 text-indigo-700 dark:text-stone-300">
              — Harsh Aryan
            </span>
          </div>

          <p className="text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed">
            When I am not writing code or studying theory, you will find me participating in hackathons, analyzing Kaggle datasets, and experimenting with clean, tactile front-end designs.
          </p>
        </div>

        {/* Right Column: Sketchbook Photo Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          {/* Handcrafted Sketchbook Photo Frame */}
          <div className="sketch-box p-3.5 sm:p-4 bg-white dark:bg-stone-900 relative rotate-[-1deg] hover:rotate-0 transition-all duration-300 shadow-[5px_5px_0_#000] dark:shadow-[5px_5px_0_#fff] w-full max-w-sm sm:max-w-md">
            {/* Washi tape strip pinned at the top */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-200/90 dark:bg-stone-700/90 border border-black/40 dark:border-white/40 rotate-[1.5deg] shadow-sm z-10 pointer-events-none"
              aria-hidden="true"
            />

            {/* Inner photo border */}
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black dark:border-white bg-stone-100 dark:bg-stone-800">
              <Image
                src="/harsh-cover.jpg"
                alt="Harsh Aryan - AI & Data Science"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-top filter grayscale contrast-[1.06] hover:grayscale-0 transition-all duration-500"
              />
              {/* Corner photofilm overlay stamp */}
              <div className="absolute bottom-2 right-2 bg-black/85 dark:bg-white text-white dark:text-black text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                HARSH ARYAN
              </div>
            </div>

            {/* Polaroid-style caption strip */}
            <div className="pt-3 pb-1 flex items-center justify-between font-mono text-xs">
              <span className="font-black text-black dark:text-white uppercase tracking-wider text-xs block">
                {personal.name}
              </span>
              <span className="sketch-stamp text-[10px] bg-indigo-600 text-white dark:bg-white dark:text-black">
                ORIGINAL PRINT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Engineering Disciplines & Specializations */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-indigo-600 dark:text-white" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
            Core Disciplines &amp; Specializations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 01 */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-800 text-xs font-mono">
                <span className="sketch-stamp bg-indigo-600 text-white dark:bg-white dark:text-black">DISCIPLINE 01</span>
                <span className="font-bold text-indigo-600 dark:text-stone-300">INTELLIGENCE</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Machine Learning &amp; Neural Models
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Developing supervised classifiers, regression models, and deep neural architectures. Focused on end-to-end model evaluation, transfer learning with ResNet, and CNN-based computer vision.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-stone-300 dark:border-stone-700">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2 font-bold">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-indigo-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-stone-200">✦ PyTorch &amp; Scikit-Learn</span>
                <span className="border border-indigo-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-stone-200">✦ CNN Radiography Screening</span>
                <span className="border border-indigo-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-stone-800 text-indigo-700 dark:text-stone-200">✦ Model Evaluation &amp; Metrics</span>
              </div>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-800 text-xs font-mono">
                <span className="sketch-stamp bg-emerald-600 text-white dark:bg-white dark:text-black">DISCIPLINE 02</span>
                <span className="font-bold text-emerald-600 dark:text-stone-300">ANALYTICS</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Data Science &amp; Statistical Modeling
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Extracting actionable insights from high-dimensional datasets. Mastery of vectorized data manipulation, outlier detection, hypothesis validation, and rich statistical visualization.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-stone-300 dark:border-stone-700">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2 font-bold">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-emerald-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-stone-200">✦ Pandas &amp; Vectorized NumPy</span>
                <span className="border border-emerald-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-stone-200">✦ Correlation &amp; Feature EDA</span>
                <span className="border border-emerald-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-stone-800 text-emerald-700 dark:text-stone-200">✦ Interactive Seaborn &amp; Plotly</span>
              </div>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="sketch-box p-6 space-y-4 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-800 text-xs font-mono">
                <span className="sketch-stamp bg-purple-600 text-white dark:bg-white dark:text-black">DISCIPLINE 03</span>
                <span className="font-bold text-purple-600 dark:text-stone-300">SYSTEMS</span>
              </div>
              <h3 className="text-xl font-black uppercase text-black dark:text-white mt-3 leading-snug">
                Interactive Systems &amp; Web Tooling
              </h3>
              <p className="text-sm text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                Bridging machine learning models with accessible user interfaces. Designing high-craft web apps with Streamlit, React, Next.js, and TypeScript with zero-friction UX.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-stone-300 dark:border-stone-700">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2 font-bold">
                KEY CAPABILITIES:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <span className="border border-purple-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-stone-800 text-purple-700 dark:text-stone-200">✦ Next.js &amp; React Architecture</span>
                <span className="border border-purple-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-stone-800 text-purple-700 dark:text-stone-200">✦ Streamlit Dashboards</span>
                <span className="border border-purple-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full font-bold bg-purple-50 dark:bg-stone-800 text-purple-700 dark:text-stone-200">✦ Neo-Brutalist Craft &amp; UX</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Roadmap */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-emerald-600 dark:text-white" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
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
                <div className="flex items-center justify-between pb-2 border-b border-black dark:border-stone-800 font-mono text-xs font-bold">
                  <span className={`sketch-stamp ${phaseBadges[idx % phaseBadges.length]}`}>PHASE 0{idx + 1}</span>
                  <span className="text-stone-600 dark:text-stone-400">{m.period}</span>
                </div>
                <h3 className="text-base font-black uppercase text-black dark:text-white mt-3 leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs font-mono font-bold text-indigo-600 dark:text-stone-400 mt-1">
                  {m.subtitle}
                </p>
                <p className="text-xs text-stone-800 dark:text-stone-300 leading-relaxed mt-2">
                  {m.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skillset Matrix Laboratory */}
      <div className="space-y-6 pt-4 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-purple-600 dark:text-white" />
          <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
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
                <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 block mb-1 uppercase">
                  LAB UNIT 0{idx + 1}
                </span>
                <h3 className={`text-base font-black uppercase pb-2 border-b-2 ${skillColors[idx % skillColors.length]}`}>
                  {skillGroup.category}
                </h3>
                <ul className="mt-3 space-y-2 font-mono text-xs">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-stone-800 dark:text-stone-200">
                      <span className="text-indigo-600 dark:text-white font-black text-sm">✦</span>
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
      <div className="space-y-6 pt-6 border-t-2 border-dashed border-black dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="sketch-stamp mb-1 bg-indigo-600 text-white dark:bg-white dark:text-black">FEATURED BUILDS</div>
            <h2 className="text-2xl font-black uppercase text-black dark:text-white">
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
          {featuredProjects.map((p) => (
            <Link
              key={p.id}
              href={`/projects#${p.id}`}
              className="sketch-box sketch-box-hover p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-black dark:border-stone-800 text-[10px] font-mono font-bold">
                  <span>PROJECT</span>
                  <span className="uppercase text-indigo-600 dark:text-stone-400">{p.category}</span>
                </div>
                <h3 className="text-lg font-black uppercase text-black dark:text-white mt-3 group-hover:underline">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-700 dark:text-stone-300 mt-2 line-clamp-2">
                  {p.tagline}
                </p>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-between font-mono text-xs font-bold text-indigo-600 dark:text-white">
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
