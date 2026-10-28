import React from "react";
import Link from "next/link";
import Image from "next/image";
import { portfolioData } from "@/data/portfolioData";
import {
  GraduationCap,
  Award,
  ArrowRight,
  Code2,
  FolderGit2,
  Mail,
  FileText,
  ArrowUpRight,
} from "lucide-react";

export default function AboutPage() {
  const { personal, education, schooling, skills, projects, certificates } = portfolioData;

  // Selected top 3 projects for preview
  const featuredProjects = projects.slice(0, 3);
  // Selected top 3 certificates for preview
  const featuredCertificates = certificates.slice(0, 3);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Page Top Header */}
        <div className="pb-6 border-b-2 border-editorial flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
              [ PAGE 02 &bull; BIOGRAPHY &amp; ACADEMICS ]
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase">
              About Me &amp; Education
            </h1>
          </div>
          <div className="text-xs font-mono text-stone-500 uppercase">
            1ST YEAR B.TECH &bull; CSE (AI &amp; DS)
          </div>
        </div>

        {/* Narrative Biography Spread */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial uppercase text-white leading-snug">
              Building From The Ground Up.
            </h2>

            <p className="drop-cap text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
              I am <strong>{personal.name}</strong>, a first-year undergraduate student pursuing my Bachelor of Technology in Computer Science &amp; Engineering with a specialization in Artificial Intelligence and Data Science. My journey into tech began with simple Python scripts, which quickly evolved into an obsession with understanding how data can be cleaned, modeled, and transformed into actionable intelligence.
            </p>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
              As a freshman, I prioritize deep fundamentals over surface-level hype. I spend my time working through mathematical foundations—especially Linear Algebra and Calculus—and implementing algorithms from scratch in Python and C before using high-level frameworks.
            </p>

            <blockquote className="pull-quote text-base font-editorial text-stone-200 my-4">
              &ldquo;I believe that being in 1st year is an advantage: it gives me four focused years to master mathematics, build real-world open source projects, and prepare for impactful AI research.&rdquo;
            </blockquote>
          </div>

          <div className="md:col-span-5 space-y-4">
            {/* Editorial Portrait Frame */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm border-2 border-editorial shadow-2xl group paper-card">
              <Image
                src="/harsh-cover.jpg"
                alt="Harsh Aryan - B.Tech CSE (AI & DS)"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent p-4 font-mono text-stone-300 z-10">
                <span className="text-amber-400 font-bold uppercase block text-[11px]">
                  HARSH ARYAN &bull; FRESHMAN FOLIO
                </span>
                <span className="text-stone-400 text-[10px]">
                  Department of Computer Science (AI &amp; Data Science)
                </span>
              </div>
            </div>

            <div className="paper-card p-6 border-editorial rounded-sm font-mono text-xs space-y-4">
              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block border-b border-editorial pb-2">
                FRESHMAN PROFILE SNAPSHOT
              </span>

              <div className="space-y-3">
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">CURRENT STANDING:</span>
                  <span className="text-stone-200 font-semibold">{personal.year}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">DEGREE PROGRAM:</span>
                  <span className="text-stone-200">{personal.degree}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">PRIMARY FOCUS:</span>
                  <span className="text-amber-400">Python, Data Science (Pandas), Linear Algebra</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">CURRENT GOAL:</span>
                  <span className="text-stone-300">Summer 2026 Early Internship / Research Mentorship</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Education Section (Merged directly here) */}
        <div className="space-y-6 pt-6 border-t border-editorial">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase">
              Academic Background &amp; Coursework
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Undergraduate Degree */}
            <div className="paper-card p-6 border-editorial rounded-sm font-mono text-xs space-y-3">
              <div className="flex items-baseline justify-between border-b border-editorial pb-2">
                <span className="text-amber-400 font-bold uppercase">{education.duration}</span>
                <span className="text-emerald-400 font-semibold">{education.status}</span>
              </div>

              <h4 className="text-lg font-bold font-editorial uppercase text-white leading-snug">
                {education.degree}
              </h4>
              <p className="text-stone-400 font-sans text-xs">{education.institution}</p>

              <div className="pt-3 border-t border-editorial-light">
                <span className="text-[10px] text-stone-500 uppercase block mb-2">
                  1ST YEAR RELEVANT COURSEWORK:
                </span>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {education.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 border border-editorial text-[11px] text-stone-300 bg-stone-900/60"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* High School Record */}
            <div className="paper-card p-6 border-editorial rounded-sm font-mono text-xs space-y-3">
              <div className="flex items-baseline justify-between border-b border-editorial pb-2">
                <span className="text-amber-400 font-bold uppercase">{schooling.year}</span>
                <span className="text-emerald-400 font-semibold">{schooling.percentage}</span>
              </div>

              <h4 className="text-lg font-bold font-editorial uppercase text-white leading-snug">
                Higher Secondary Schooling (Class 12th)
              </h4>
              <p className="text-stone-400 font-sans text-xs">
                {schooling.institution} &bull; {schooling.board}
              </p>
              <p className="text-stone-300 font-sans text-xs">{schooling.stream}</p>

              <div className="pt-3 border-t border-editorial-light">
                <span className="text-[10px] text-stone-500 uppercase block mb-1">
                  FOUNDATIONAL SUBJECTS:
                </span>
                <p className="font-sans text-xs text-stone-300">
                  Mathematics (Calculus, Probability), Physics &amp; Computer Science fundamentals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Skills Taxonomy */}
        <div className="space-y-6 pt-6 border-t border-editorial">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber-500" />
            <h3 className="text-2xl sm:text-3xl font-black font-editorial tracking-tight uppercase">
              Current Skills &amp; Technologies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="paper-card p-5 border-editorial rounded-sm font-mono text-xs">
                <h4 className="text-amber-400 font-bold uppercase text-[11px] pb-2 border-b border-editorial mb-3">
                  {skillGroup.category}
                </h4>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {skillGroup.items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className="px-2 py-0.5 border border-editorial text-[11px] text-stone-300 bg-stone-900/40"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 1 CONTINUATION: FEATURED PROJECTS (P.03 PREVIEW) */}
        <div className="space-y-6 pt-10 border-t-2 border-editorial">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
                <FolderGit2 className="w-4 h-4" />
                <span>[ SECTION PREVIEW &bull; PAGE 03 ]</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-editorial tracking-tight uppercase">
                Featured Works &amp; Practical Projects
              </h3>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
            >
              <span>Explore All Projects (P.03)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-3xl">
            Real-world exploratory data analysis, machine learning models, and student tools built with Python, PyTorch, Pandas, and Streamlit. Grounded in 1st-year computer science fundamentals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                className="paper-card p-5 border-editorial rounded-sm flex flex-col justify-between group hover:border-amber-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-editorial font-mono text-[10px]">
                    <span className="text-amber-400 font-bold uppercase">{proj.category}</span>
                    <span className="text-stone-500">P.03 FEATURE</span>
                  </div>

                  <h4 className="text-base font-bold font-editorial text-white group-hover:text-amber-300 transition-colors leading-snug mb-2">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-stone-300 font-sans line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {proj.metrics.slice(0, 2).map((m, mIdx) => (
                      <div key={mIdx} className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-editorial-light flex items-center justify-between font-mono text-[10px]">
                  <span className="text-stone-400">{proj.technologies.slice(0, 3).join(", ")}</span>
                  <Link
                    href={`/projects#${proj.id}`}
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Details <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner link to Projects */}
          <div className="p-4 bg-stone-900/60 border border-editorial flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-stone-300">
              Want to see all {projects.length} projects, detailed methodology, and GitHub repositories?
            </span>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Turn to Page 03: Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 2 CONTINUATION: VERIFIED CERTIFICATIONS (P.04 PREVIEW) */}
        <div className="space-y-6 pt-10 border-t-2 border-editorial">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
                <Award className="w-4 h-4" />
                <span>[ SECTION PREVIEW &bull; PAGE 04 ]</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-editorial tracking-tight uppercase">
                Verified Certifications &amp; Honors
              </h3>
            </div>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
            >
              <span>Inspect All ({certificates.length}) Certificates (P.04)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-3xl">
            Accredited credentials from Stanford/DeepLearning.AI, Imperial College London, IBM, and competitive freshman hackathon laurels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {featuredCertificates.map((cert) => (
              <div
                key={cert.id}
                className="paper-card p-5 border-editorial rounded-sm flex flex-col justify-between group hover:border-amber-500/50 transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between pb-2 mb-3 border-b border-editorial font-mono text-[10px]">
                    <span className="text-amber-400 font-bold uppercase">{cert.category}</span>
                    <span className="text-stone-500">{cert.issueDate}</span>
                  </div>

                  <h4 className="text-base font-bold font-editorial text-white group-hover:text-amber-300 transition-colors leading-snug mb-1">
                    {cert.title}
                  </h4>

                  <p className="text-xs text-amber-400/90 font-mono mb-3">{cert.issuer}</p>

                  <p className="text-xs text-stone-300 font-sans line-clamp-2 mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-editorial-light flex items-center justify-between font-mono text-[10px]">
                  <span className="text-emerald-400 font-semibold">VERIFIED RECORD</span>
                  <Link
                    href="/certificates"
                    className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    View Credential <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Banner link to Certificates */}
          <div className="p-4 bg-stone-900/60 border border-editorial flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <span className="text-stone-300">
              Review credential verification IDs, coursework syllabi, and Hackathon honors.
            </span>
            <Link
              href="/certificates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider transition-colors shrink-0"
            >
              <span>Turn to Page 04: Certificates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SECTION 3 CONTINUATION: CONTACT DESK & INQUIRIES (P.05 PREVIEW) */}
        <div className="space-y-6 pt-10 border-t-2 border-editorial">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
                <Mail className="w-4 h-4" />
                <span>[ SECTION PREVIEW &bull; PAGE 05 ]</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black font-editorial tracking-tight uppercase">
                Contact Desk &amp; Dispatches
              </h3>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider"
            >
              <span>Go to Contact Desk (P.05)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3 font-sans">
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                I am actively seeking <strong>Summer 2026 early internships</strong>, research mentorships, open-source data science projects, and hackathon teams. Whether you have an inquiry, feedback on my projects, or an exciting student opportunity, feel free to reach out.
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs pt-2">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-sm">
                  &bull; Currently Available: Summer 2026 Internships
                </span>
                <span className="text-stone-400">Direct: {personal.email}</span>
              </div>
            </div>

            <div className="md:col-span-4 paper-card p-5 border-editorial rounded-sm text-center font-mono text-xs space-y-3">
              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block">
                DIRECT INQUIRY PORTAL
              </span>
              <p className="text-stone-300 text-xs font-sans">
                Send a categorized inquiry message or download official resume.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-wider transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send a Message (P.05)</span>
                </Link>
                <a
                  href={personal.resumeUrl}
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-editorial hover:border-amber-400 text-stone-300 hover:text-white uppercase tracking-wider transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Turn to Next Page Footer Link */}
        <div className="pt-10 border-t-2 border-editorial flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <Link href="/" className="text-stone-400 hover:text-white uppercase transition-colors">
            &larr; Return to Issue Cover (P.01)
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            <span>Turn to Page 03: Projects Folio</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
