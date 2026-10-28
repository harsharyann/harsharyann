"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { Check, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/SocialIcons";

export default function ContactPage() {
  const { personal, socialLinks } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Summer 2026 Internship Opportunity",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", category: "Summer 2026 Internship Opportunity", message: "" });
    }, 600);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Page Top Header */}
        <div className="pb-6 border-b-2 border-editorial flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold mb-1">
              [ PAGE 05 &bull; CORRESPONDENCE &amp; INQUIRIES ]
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight uppercase">
              Contact Desk
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-editorial italic text-stone-400 max-w-xl">
              Open to Summer 2026 early internship roles, collegiate hackathon teams, research mentorship, and collaborations.
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500 uppercase">
            DIRECT INQUIRIES &bull; 2026
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="paper-card p-6 border-editorial rounded-sm font-mono text-xs space-y-4">
              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block border-b border-editorial pb-2">
                COMMUNICATIONS &amp; NETWORK
              </span>

              <h2 className="text-xl font-bold font-editorial uppercase text-white leading-snug">
                Let&apos;s Build Together.
              </h2>

              <p className="font-sans text-xs sm:text-sm text-stone-300 leading-relaxed">
                As a motivated 1st-year student, I am eager to contribute to engineering teams, learn from senior developers and researchers, and build reliable software.
              </p>

              {/* Direct Email Box */}
              <div className="p-3.5 border border-editorial bg-stone-900/60">
                <span className="text-[10px] uppercase text-stone-500 block mb-1">
                  DIRECT EMAIL:
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-amber-400 truncate">{personal.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1 bg-amber-500 text-stone-950 font-bold uppercase text-[10px] tracking-wider hover:bg-amber-400 transition-colors shrink-0"
                  >
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>
              </div>

              {/* Status info */}
              <div className="space-y-1.5 pt-2 text-[11px] text-stone-400">
                <div>
                  <span className="text-stone-500">LOCATION:</span> {personal.location}
                </div>
                <div>
                  <span className="text-stone-500">AVAILABILITY:</span>{" "}
                  <span className="text-emerald-400">Active (Summer 2026 Internships)</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-editorial flex flex-wrap gap-2">
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-editorial hover:border-stone-400 text-stone-300 hover:text-white flex items-center gap-1.5 uppercase text-[11px] transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 border border-editorial hover:border-stone-400 text-stone-300 hover:text-white flex items-center gap-1.5 uppercase text-[11px] transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
                {socialLinks.leetcode && (
                  <a
                    href={socialLinks.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 border border-editorial hover:border-amber-400 text-amber-400 flex items-center gap-1.5 uppercase text-[11px] transition-colors"
                  >
                    <LeetCodeIcon className="w-3.5 h-3.5" />
                    <span>LeetCode</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Message Transmission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="paper-card p-6 sm:p-8 border-editorial rounded-sm font-mono text-xs">
              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block border-b border-editorial pb-3 mb-6">
                TRANSMIT INQUIRY / NOTE
              </span>

              {submitted ? (
                <div className="p-8 border border-emerald-500/30 bg-emerald-500/10 text-center font-mono text-xs">
                  <div className="w-10 h-10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-3">
                    <Check className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-editorial uppercase font-bold text-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-stone-300 font-sans text-xs max-w-sm mx-auto mb-4">
                    Thank you for reaching out! Harsh will review your message and get back to you via email soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 border border-editorial text-stone-300 uppercase tracking-wider hover:text-white"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase text-[10px] text-stone-400 tracking-wider mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Jane Doe"
                        className="w-full px-3.5 py-2.5 bg-stone-900/80 border border-editorial text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block uppercase text-[10px] text-stone-400 tracking-wider mb-1">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="jane@company.com"
                        className="w-full px-3.5 py-2.5 bg-stone-900/80 border border-editorial text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase text-[10px] text-stone-400 tracking-wider mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-stone-900/80 border border-editorial text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="Summer 2026 Internship Opportunity">
                        Summer 2026 Internship Opportunity
                      </option>
                      <option value="Hackathon Team / Project Collaboration">
                        Hackathon Team / Project Collaboration
                      </option>
                      <option value="Research Guidance / Mentorship">
                        Research Guidance / Mentorship
                      </option>
                      <option value="General Connect & Chat">
                        General Connect &amp; Chat
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase text-[10px] text-stone-400 tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Hi Harsh, I checked your projects and would love to discuss..."
                      className="w-full px-3.5 py-2.5 bg-stone-900/80 border border-editorial text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors resize-none font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Turn to Next Page Footer Link */}
        <div className="pt-8 border-t-2 border-editorial flex items-center justify-between font-mono text-xs">
          <Link href="/certificates" className="text-stone-400 hover:text-white uppercase transition-colors">
            &larr; Page 04: Certificates
          </Link>

          <Link href="/" className="text-amber-400 hover:underline uppercase transition-colors font-bold">
            Back to Issue Cover (P.01) &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
